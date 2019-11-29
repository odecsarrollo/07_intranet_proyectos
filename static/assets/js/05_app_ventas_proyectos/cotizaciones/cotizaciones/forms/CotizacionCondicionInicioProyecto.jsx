import React, {useEffect} from 'react';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CotizacionCondicionInicioProyectoItemForm from './CotizacionCondicionInicioProyectoItemForm';
import CotizacionOrdenCompraForm from './CotizacionOrdenCompraForm';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    delete_boton: {
        position: 'absolute',
        bottom: '10px',
        right: '10px'
    },
    download_boton: {
        position: 'absolute',
        bottom: '10px',
        right: '40px',
        margin: 0,
        padding: 4,
        color: theme.palette.primary.dark
    },
    limpiar_boton: {
        position: 'absolute',
        bottom: '10px',
        right: '20px',
        margin: 0,
        padding: 4,
        color: theme.palette.primary.dark
    },
    info_archivo: {
        color: theme.palette.primary.dark
    },
}));

const CotizacionCondicionInicioProyecto = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {cotizacion, cotizacion: {condiciones_inicio_cotizacion, orden_compra_fecha, valor_orden_compra, orden_compra_nro}} = props;
    const cerrado = cotizacion.estado === 'Cierre (Aprobado)';
    let list = useSelector(state => state.condiciones_inicios_proyectos);
    const read_only_orden_compra = (orden_compra_fecha && valor_orden_compra > 0 && orden_compra_nro);
    const cargarDatos = () => {
        dispatch(actions.fetchCondicionesIniciosProyectos());
        //dispatch(actions.fetchCotizacion(cotizacion.id));
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCondicionesIniciosProyectos());
        };
    }, []);
    const condiciones_inicio_cotizacion_seleccionadas = _.orderBy(_.map(condiciones_inicio_cotizacion, c => c.condicion_inicio_proyecto), ['require_documento'], ['desc']);
    list = _.map(list, e => ({...e, esta_activo: condiciones_inicio_cotizacion_seleccionadas.includes(e.id)}));
    list = _.orderBy(list, ['esta_activo'], ['desc']);
    return <div className='row'>
        <CotizacionOrdenCompraForm initialValues={cotizacion} read_only={read_only_orden_compra} classes={classes}/>
        {_.map(list, c => {
            const accion = () => c.esta_activo ? dispatch(actions.quitarCondicionInicioProyectoCotizacion(cotizacion.id, c.id)) : dispatch(actions.adicionarCondicionInicioProyectoCotizacion(cotizacion.id, c.id));
            return (
                <div className='col-12 col-sm-6 col-md-4' key={c.id}>
                    {!c.esta_activo && !cerrado && <FormControlLabel
                        control={
                            <Checkbox
                                checked={c.esta_activo}
                                color='primary'
                                onChange={accion}
                            />
                        }
                        label={c.to_string}
                    />}
                    {c.esta_activo && <CotizacionCondicionInicioProyectoItemForm
                        classes={classes}
                        form={`form-${c.id}`}
                        initialValues={_.mapKeys(condiciones_inicio_cotizacion, 'condicion_inicio_proyecto')[c.id]}
                        onDelete={accion}
                    />}
                </div>
            )
        })}
    </div>
};

export default CotizacionCondicionInicioProyecto;