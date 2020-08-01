import {makeStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React, {Fragment, useState} from "react";
import {formatoMoneda} from "../../../00_utilities/common";
import InformeTunelVentasTabla from "./CuadroTuberiaVentasTabla";


const useStyles = makeStyles(theme => ({
    table: {
        fontSize: '0.7rem',
    },
    tr: {
        padding: '0px !important',
        margin: '0px !important'
    },
    td: {
        padding: '0px !important',
        margin: '0px !important'
    }
}))

const TuberiaVentaComponenteTablaTotales = props => {
    let {items, estado, moneda, son_facturas = false} = props;
    const columna_valor = son_facturas ? 'venta_bruta' : 'valor_total';
    if (!son_facturas) {
        items = items.filter(e => e.estado === estado);
    }
    if (items.length > 0) {
        return <div className="row" style={{textAlign: 'center', fontWeight: 'bold'}}>
            <div className="col-12">{items.length}</div>
            <div className="col-12">
                {formatoMoneda(items.reduce((uno, dos) => uno + dos[columna_valor], 0), '$', moneda === 'COP' ? 0 : 2)}
            </div>
        </div>
    }
    return null
};

const TuberiaVentaComponenteTablaItem = props => {
    let {items, color = null, moneda, son_facturas = false, vendedor} = props;
    const [is_open, setIsOpen] = useState(false);
    const columna_valor = son_facturas ? 'venta_bruta' : 'valor_total';
    if (items && items.length > 0) {
        if (!son_facturas) {
            items = items.filter(e => e.color_seguimiento === color);
        }
        return <Fragment>
            {items.length > 0 &&
            <Fragment>
                <div className="row puntero"
                     onClick={() => setIsOpen(true)}
                     style={{
                         backgroundColor: color ? color : "none",
                         textAlign: 'center',
                         borderRadius: '10px',
                         margin: '4px',
                         fontWeight: 'bold'
                     }}>
                    <div className="col-12">{items.length}</div>
                    <div className="col-12">
                        {formatoMoneda(items.reduce((uno, dos) => uno + dos[columna_valor], 0), '$', moneda === 'COP' ? 0 : 2)}
                    </div>
                </div>
                {is_open && <InformeTunelVentasTabla
                    vendedor={vendedor}
                    son_facturas={son_facturas}
                    moneda={moneda}
                    cotizaciones_seleccionardas={items}
                    cerrar={() => setIsOpen(false)}
                    is_open={is_open}
                />}
            </Fragment>}
        </Fragment>
    }
    return null
};
const TuberiaVentaComponenteFila = props => {
    const {colores, cotizaciones_por_estado, moneda, vendedor, facturas} = props;
    const classes = useStyles();
    return (
        <tr className={classes.tr}>
            <td className={classes.td}>{vendedor}</td>
            <td className={classes.td}>{colores.map(color => <TuberiaVentaComponenteTablaItem
                vendedor={vendedor}
                key={color}
                items={cotizaciones_por_estado['APL']}
                color={color}
                moneda={moneda}
            />)}
            </td>
            <td className={classes.td}>{colores.map(color => <TuberiaVentaComponenteTablaItem
                vendedor={vendedor}
                key={color}
                items={cotizaciones_por_estado['ENV']}
                color={color}
                moneda={moneda}
            />)}
            </td>
            <td className={classes.td}>{colores.map(color => <TuberiaVentaComponenteTablaItem
                vendedor={vendedor}
                key={color}
                items={cotizaciones_por_estado['REC']}
                color={color}
                moneda={moneda}
            />)}
            </td>
            <td className={classes.td}>{colores.map(color => <TuberiaVentaComponenteTablaItem
                vendedor={vendedor}
                key={color}
                items={cotizaciones_por_estado['PRO']}
                color={color}
                moneda={moneda}
            />)}
            </td>
            <td className={classes.td}>
                <TuberiaVentaComponenteTablaItem
                    vendedor={vendedor}
                    son_facturas={true}
                    items={facturas}
                    moneda={moneda}
                />
            </td>
        </tr>
    )
};
const TuberiaVentaComponenteDivisa = props => {
    const {cotizaciones, divisa, facturas} = props;
    const classes = useStyles();
    const colores = _.uniq(_.map(cotizaciones, a => a.color_seguimiento));
    const cotizaciones_por_color = _.countBy(cotizaciones, 'color_seguimiento');
    let colaboradores = _.uniqBy(_.map(cotizaciones, e => ({
        colaborador: e.colaborador,
        nombre: e.responsable_nombre
    })), c => c.nombre);
    colaboradores = _.mapKeys(colaboradores, 'colaborador');
    const fecha_hoy = new Date();
    let facturacion_mes = _.pickBy(facturas, f => {
        return (new Date(f.fecha_documento).getUTCMonth() === fecha_hoy.getUTCMonth())
    })

    const facturacion_por_vendedor = _.groupBy(_.pickBy(facturacion_mes, e => e.colaborador !== null), 'colaborador');
    const cotizaciones_por_vendedor = _.groupBy(_.map(cotizaciones, c => ({
        ...c,
        vendedor: c.responsable_nombre
    })), 'colaborador');


    let cotizaciones_por_vendedor_valores = []
    _.mapKeys(cotizaciones_por_vendedor, (v, k) => {
        cotizaciones_por_vendedor_valores = [...cotizaciones_por_vendedor_valores, {
            vendedor: colaboradores[k] ? colaboradores[k].nombre : 'Sin Definir',
            cotizaciones: _.groupBy(v, 'estado'),
            facturas: facturacion_por_vendedor[k] ? facturacion_por_vendedor[k] : []
        }]
    });

    return <div className='row' style={{font: '0.6rem'}}>
        <div className="col-12">
            <Typography variant="h6" gutterBottom color="primary">
                {divisa}
            </Typography>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
            <div className="row" style={{textAlign: 'center'}}>
                <div className="col-3" style={{backgroundColor: 'tomato'}}>{cotizaciones_por_color['tomato']}</div>
                <div className="col-3" style={{backgroundColor: 'yellow'}}>{cotizaciones_por_color['yellow']}</div>
                <div className="col-3"
                     style={{backgroundColor: 'lightgreen'}}>{cotizaciones_por_color['lightgreen']}</div>
                <div className="col-3" style={{backgroundColor: 'white'}}>{cotizaciones_por_color['white']}</div>
            </div>
        </div>
        <div className="col-12">
            <table className={classNames('table table-striped', classes.table)}>
                <thead>
                <tr className={classes.tr}>
                    <th>Vendedor</th>
                    <th style={{textAlign: 'center'}}>Aplazada</th>
                    <th style={{textAlign: 'center'}}>Enviada</th>
                    <th style={{textAlign: 'center'}}>Recibida</th>
                    <th style={{textAlign: 'center'}}>Aceptada</th>
                    <th style={{textAlign: 'center'}}>Facturado</th>
                </tr>
                </thead>
                <tbody>

                {cotizaciones_por_vendedor_valores.map(v => <TuberiaVentaComponenteFila
                    key={v.vendedor}
                    facturas={v.facturas}
                    vendedor={v.vendedor}
                    colores={colores}
                    cotizaciones_por_estado={v.cotizaciones}
                    moneda={divisa}
                />)}
                </tbody>
                <tfoot>
                <tr className={classes.tr}>
                    <td className={classes.td}>Total</td>
                    <td className={classes.td}>
                        <TuberiaVentaComponenteTablaTotales
                            estado={'APL'}
                            items={_.map(cotizaciones)}
                            moneda={divisa}
                        />
                    </td>
                    <td className={classes.td}>
                        <TuberiaVentaComponenteTablaTotales
                            estado={'ENV'}
                            items={_.map(cotizaciones)}
                            moneda={divisa}
                        />
                    </td>
                    <td className={classes.td}>
                        <TuberiaVentaComponenteTablaTotales
                            estado={'REC'}
                            items={_.map(cotizaciones)}
                            moneda={divisa}
                        />
                    </td>
                    <td className={classes.td}>
                        <TuberiaVentaComponenteTablaTotales
                            estado={'PRO'}
                            items={_.map(cotizaciones)}
                            moneda={divisa}
                        />
                    </td>
                    <td>
                        <TuberiaVentaComponenteTablaTotales
                            son_facturas={true}
                            items={_.flatMap(cotizaciones_por_vendedor_valores.map(e => e.facturas))}
                            moneda={divisa}
                        />
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
};


const TuberiaVentaComponente = props => {
    const {contizaciones_componentes, facturas} = props;
    let cotizaciones_por_divisa = [];
    _.mapKeys(_.groupBy(contizaciones_componentes, 'moneda'), (v, k) => {
        cotizaciones_por_divisa = [...cotizaciones_por_divisa, {key: k, values: v}];
    });
    return <div className='row'>
        <div className="col-12">
            <Typography variant="h5" gutterBottom color="primary">
                Tubería Ventas Componentes
            </Typography>
        </div>
        {cotizaciones_por_divisa.map(e => <div key={e.key} className="col-12">
            <TuberiaVentaComponenteDivisa cotizaciones={e.values} divisa={e.key} facturas={facturas}/>
        </div>)}
    </div>
}

export default TuberiaVentaComponente;