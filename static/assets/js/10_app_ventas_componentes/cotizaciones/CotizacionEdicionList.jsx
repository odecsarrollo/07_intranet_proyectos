import React, {memo, useEffect, Fragment} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from "../../01_actions/01_index";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    normal: {
        borderRadius: '10px',
        border: `1px ${theme.palette.primary.dark} solid`,
    },
    seleccionada: {
        padding: '2px',
        borderRadius: '10px',
        border: `1px ${theme.palette.primary.dark} solid`,
        color: 'white',
        backgroundColor: theme.palette.primary.dark,
    }
}));

const CotizacionEdicionListItem = memo(props => {
    const style_item = useStyles();
    const {item, cotizacion_actual_id} = props;
    const seleccionada = cotizacion_actual_id === item.id;
    return (
        <div className='col-12 col-md-4 col-lg-3 p-1 text-center'>
            <Link to={`/app/ventas_componentes/cotizaciones/detail/${item.id}`}>
                <div className={!seleccionada ? style_item.normal : style_item.seleccionada}>
                    Cotización <strong>{item.nro_consecutivo}</strong>
                    <br/> {item.cliente_nombre}
                </div>
            </Link>
        </div>
    )
});

const CotizacionEdicionList = memo(props => {
    const {cotizacion_actual_id = null, cargar = false} = props;
    const dispatch = useDispatch();
    const cotizaciones = _.pickBy(useSelector(state => state.cotizaciones_componentes), c => c.estado === 'INI');
    useEffect(() => {
        if (cargar) {
            dispatch(actions.fetchCotizacionesComponentesEdicionAsesor({limpiar_coleccion: false}));
        }
    }, []);
    if (cotizacion_actual_id && _.size(cotizaciones) <= 1) {
        return <Fragment></Fragment>
    }
    return (
        <div className="row">
            {_.map(cotizaciones, item => <CotizacionEdicionListItem
                key={item.id} item={item}
                cotizacion_actual_id={cotizacion_actual_id}
            />)}
        </div>
    )
});
export default CotizacionEdicionList;