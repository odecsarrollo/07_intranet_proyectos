import {makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom";
import {formatoMoneda} from "../../../00_utilities/common";


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

const TuberiaVentaComponenteTablaItemDialog = props => {
    const {is_open, items, onCancel, moneda, son_facturas = false} = props;
    const columna_valor = son_facturas ? 'venta_bruta' : 'valor_total';
    return <Dialog
        scroll='paper'
        open={is_open}
    >
        <DialogTitle id="responsive-dialog-title">
            {son_facturas ? 'Facturas' : 'Cotizaciones'}
        </DialogTitle>
        <DialogContent>
            <table className='table table-striped'>
                <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Cotizacion</th>
                </tr>
                </thead>
                <tbody>
                {items.map(i => <tr key={i.id}>
                    <td>{i.cliente_nombre}</td>
                    <td>
                        {formatoMoneda(i[columna_valor], '$', moneda === 'COP' ? 0 : 2)}
                    </td>
                    <td>
                        {!son_facturas ?
                            <Link to={`/app/ventas_componentes/cotizaciones/detail/${i.id}`} target={'_blank'}>
                                {i.nro_consecutivo}
                            </Link> :
                            <Fragment>
                                {i.cotizaciones_componentes.map(n => <div>
                                    <Link key={n.id} to={`/app/ventas_componentes/cotizaciones/detail/${n.id}`}
                                          target={'_blank'}>
                                        {n.nro_consecutivo}
                                    </Link>
                                </div>)}
                            </Fragment>
                        }
                    </td>
                </tr>)}

                </tbody>
            </table>
        </DialogContent>
        <DialogActions>
            <Button
                color="secondary"
                variant="contained"
                className='ml-3'
                onClick={onCancel}
            >
                Cancelar
            </Button>
        </DialogActions>
    </Dialog>
};

const TuberiaVentaComponenteTablaItem = props => {
    let {items, color = null, moneda, son_facturas = false} = props;
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
                {is_open && <TuberiaVentaComponenteTablaItemDialog
                    son_facturas={son_facturas}
                    moneda={moneda}
                    is_open={is_open}
                    items={items}
                    onCancel={() => setIsOpen(false)}
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
                key={color}
                items={cotizaciones_por_estado['ENV']}
                color={color}
                moneda={moneda}
            />)}
            </td>
            <td className={classes.td}>{colores.map(color => <TuberiaVentaComponenteTablaItem
                key={color}
                items={cotizaciones_por_estado['REC']}
                color={color}
                moneda={moneda}
            />)}
            </td>
            <td className={classes.td}>{colores.map(color => <TuberiaVentaComponenteTablaItem
                key={color}
                items={cotizaciones_por_estado['PRO']}
                color={color}
                moneda={moneda}
            />)}
            </td>
            <td className={classes.td}>
                <TuberiaVentaComponenteTablaItem
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
        //return (new Date(f.fecha_documento).getMonth() === 2)
        return (new Date(f.fecha_documento).getMonth() === fecha_hoy.getMonth())
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
                    <th style={{textAlign: 'center'}}>Enviada</th>
                    <th style={{textAlign: 'center'}}>Recibida</th>
                    <th style={{textAlign: 'center'}}>En Proceso</th>
                    <th style={{textAlign: 'center'}}>Venta Mes</th>
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