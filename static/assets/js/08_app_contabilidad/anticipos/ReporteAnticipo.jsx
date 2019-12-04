import React, {useEffect, useState, Fragment} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../01_actions/01_index';
import Typography from "@material-ui/core/Typography";
import {numeroFormato} from "../../00_utilities/common";
import CargarDatos from "../../00_utilities/components/system/cargar_datos";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

const ReporteAnticipoTablaItemDialog = props => {
    const {is_open, items, onCancel} = props;
    return <Dialog
        scroll='paper'
        open={is_open}
    >
        <DialogTitle id="responsive-dialog-title">
            Cobros
        </DialogTitle>
        <DialogContent>
            <table className='table table-striped'>
                <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Cobro</th>
                </tr>
                </thead>
                <tbody>
                {items.map(i => <tr key={i.id}>
                    <td>{i.nombre_cliente}</td>
                    <td>{numeroFormato(i.valor_total_sin_impuesto + i.impuesto, 2)}</td>
                    <td>
                        <Link to={`/app/contabilidad/cobros/detalle/${i.id}`} target={'_blank'}>
                            {i.nro_consecutivo}
                        </Link>
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

const ReporteAnticipoTablaItem = props => {
    let {items, color} = props;
    const [is_open, setIsOpen] = useState(false);
    if (items && items.length > 0) {
        items = items.filter(e => e.color_estado === color);
        return <Fragment>
            {items.length > 0 &&
            <Fragment>
                <div className="row puntero"
                     onClick={() => setIsOpen(true)}
                     style={{
                         backgroundColor: color,
                         textAlign: 'center',
                         borderRadius: '10px',
                         margin: '4px',
                         fontWeight: 'bold'
                     }}>
                    <div className="col-12">{items.length}</div>
                    <div
                        className="col-12">{numeroFormato(items.reduce((uno, dos) => uno + dos.valor_total_sin_impuesto + dos.impuesto, 0), 2)}</div>
                </div>
                {is_open &&
                <ReporteAnticipoTablaItemDialog is_open={is_open} items={items} onCancel={() => setIsOpen(false)}/>}
            </Fragment>}
        </Fragment>
    }
    return null
};

const ReporteAnticipoTablaTotales = props => {
    let {items, estado} = props;
    items = items.filter(e => e.estado === estado);
    if (items.length > 0) {
        return <div className="row" style={{textAlign: 'center', fontWeight: 'bold'}}>
            <div className="col-12">{items.length}</div>
            <div
                className="col-12">{numeroFormato(items.reduce((uno, dos) => uno + dos.valor_total_sin_impuesto + dos.impuesto, 0), 2)}</div>
        </div>
    }
    return null
};

const ReporteAnticipoDivisa = props => {
    const {anticipos, divisa} = props;

    const colores = _.uniq(_.map(anticipos, a => a.color_estado));
    const anticipos_por_color = _.countBy(anticipos, 'color_estado');
    const anticipos_por_estado = _.groupBy(anticipos, 'estado');
    return <div className='row'>
        <div className="col-12">
            <Typography variant="h6" gutterBottom color="primary">
                {divisa}
            </Typography>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
            <div className="row" style={{textAlign: 'center'}}>
                <div className="col-3" style={{backgroundColor: 'tomato'}}>{anticipos_por_color['tomato']}</div>
                <div className="col-3" style={{backgroundColor: 'yellow'}}>{anticipos_por_color['yellow']}</div>
                <div className="col-3" style={{backgroundColor: 'lightgreen'}}>{anticipos_por_color['lightgreen']}</div>
                <div className="col-3" style={{backgroundColor: 'white'}}>{anticipos_por_color['white']}</div>
            </div>
        </div>
        <div className="col-12">
            <table className='table table-striped table-responsive'>
                <thead>
                <tr>
                    <th></th>
                    <th style={{textAlign: 'center'}}>ENVIADO</th>
                    <th style={{textAlign: 'center'}}>RECIBIDO</th>
                    <th style={{textAlign: 'center'}}>COBRADO</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td>{colores.map(color => <ReporteAnticipoTablaItem key={color}
                                                                        items={anticipos_por_estado['ENVIADA']}
                                                                        color={color}/>)}
                    </td>
                    <td>{colores.map(color => <ReporteAnticipoTablaItem key={color}
                                                                        items={anticipos_por_estado['RECIBIDA']}
                                                                        color={color}/>)}
                    </td>
                    <td>{colores.map(color => <ReporteAnticipoTablaItem key={color}
                                                                        items={anticipos_por_estado['CERRADA']}
                                                                        color={color}/>)}
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>Total</td>
                    <td><ReporteAnticipoTablaTotales estado={'ENVIADA'} items={_.map(anticipos)}/></td>
                    <td><ReporteAnticipoTablaTotales estado={'RECIBIDA'} items={_.map(anticipos)}/></td>
                    <td><ReporteAnticipoTablaTotales estado={'CERRADA'} items={_.map(anticipos)}/></td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
};


const ReporteAnticipo = props => {
    const dispatch = useDispatch();
    const anticipos = useSelector(state => state.contabilidad_proforma_anticipos);
    let anticipos_por_divisa = [];
    _.mapKeys(_.groupBy(anticipos, 'divisa'), (v, k) => {
        anticipos_por_divisa = [...anticipos_por_divisa, {key: k, values: v}];
    });


    const cargarDatos = () => dispatch(actions.fetchProformasAnticiposReporte());
    useEffect(() => {
        dispatch(actions.fetchProformasAnticiposReporte());
        return () => {
            dispatch(actions.clearProformasAnticipos());
        }
    }, []);
    return <div className='row'>
        <div className="col-12">
            <Typography variant="h5" gutterBottom color="primary">
                Resumen de cobros
            </Typography>
        </div>
        {anticipos_por_divisa.map(e => <div key={e.key} className="col-12 col-lg-6 col-xl-4">
            <ReporteAnticipoDivisa anticipos={e.values} divisa={e.key}/>
        </div>)}
        <CargarDatos
            cargarDatos={cargarDatos}
        />
    </div>
};

export default ReporteAnticipo;