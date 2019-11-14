import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../01_actions/01_index';
import Typography from "@material-ui/core/Typography";
import {pesosColombianos} from "../../00_utilities/common";
import CargarDatos from "../../00_utilities/components/system/cargar_datos";

const ReporteAnticipoTablaItem = props => {
    let {items, color} = props;
    if (items && items.length > 0) {
        items = items.filter(e => e.color_estado === color);
        return <div className="row"
                    style={{
                        backgroundColor: color,
                        textAlign: 'center',
                        borderRadius: '10px',
                        margin: '4px',
                        fontWeight: 'bold'
                    }}>
            <div className="col-12">{items.length}</div>
            <div
                className="col-12">{pesosColombianos(items.reduce((uno, dos) => uno + dos.valor_total_sin_impuesto, 0))}</div>
        </div>
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
                className="col-12">{pesosColombianos(items.reduce((uno, dos) => uno + dos.valor_total_sin_impuesto, 0))}</div>
        </div>
    }
    return null
};

const ReporteAnticipo = props => {
    const dispatch = useDispatch();
    const anticipos = useSelector(state => state.contabilidad_proforma_anticipos);

    const cargarDatos = () => dispatch(actions.fetchProformasAnticiposReporte());

    const colores = _.uniq(_.map(anticipos, a => a.color_estado));
    const anticipos_por_color = _.countBy(anticipos, 'color_estado');
    const anticipos_por_estado = _.groupBy(anticipos, 'estado');

    useEffect(() => {
        dispatch(actions.fetchProformasAnticiposReporte())
        return () => {
            dispatch(actions.clearProformasAnticipos())
        }
    }, []);
    return <div className='row'>
        <div className="col-12">
            <Typography variant="h5" gutterBottom color="primary">
                Resumen de cobros
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
        <CargarDatos
            cargarDatos={cargarDatos}
        />
    </div>
};

export default ReporteAnticipo;