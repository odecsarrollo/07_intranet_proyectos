import Typography from "@material-ui/core/Typography";
import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {SinObjeto} from "../../../00_utilities/templates/fragmentos";
import * as actions from "../../../01_actions/01_index";
import {ARCHIVOS_COTIZACIONES, COTIZACIONES, PROYECTOS} from "../../../permisos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import CambioEstadoList from '../seguimientos/CotizacionSeguimientoCambioEstadoList';
import ComentariosList from '../seguimientos/CotizacionSeguimientoComentarioList';
import TareasList from '../seguimientos/CotizacionSeguimientoTareaList';
import CotizacionAcuerdoPagoList from "./CotizacionAcuerdoPagoList";
import CotizacionCondicionInicioProyecto from "./CotizacionCondicionInicioProyecto";
import CotizacionDetailDocumento from './CotizacionDetailDocumento';
import CotizacionInfo from './CotizacionDetailInfo';
import CotizacionForm from './forms/CotizacionFormDetail';

const Detail = memo(props => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const object = useSelector(state => state.cotizaciones[id]);

    const permisos = useTengoPermisos(COTIZACIONES);
    const permisos_proyecto = useTengoPermisos(PROYECTOS);
    const permisos_archivos_cotizacion = useTengoPermisos(ARCHIVOS_COTIZACIONES);

    const guardarCambiosCotizacion = (cotizacion) => {
        dispatch(actions.updateCotizacion(id, cotizacion));
    };

    const guardarComentario = (comentario) => {
        const seguimiento = {...comentario, cotizacion: id, tipo_seguimiento: 0};
        const cargarCotizacion = () => dispatch(actions.fetchCotizacion(id));
        dispatch(actions.createSeguimientoCotizacion(seguimiento, {callback: cargarCotizacion}));
    };

    const eliminarSeguimiento = (seguimiento_id) => {
        const cargarCotizacion = () => dispatch(actions.fetchCotizacion(id));
        dispatch(actions.deleteSeguimientoCotizacion(seguimiento_id, {callback: cargarCotizacion}))
    };

    const guardarTarea = (tarea) => {
        const seguimiento = {...tarea, cotizacion: id, tipo_seguimiento: 2};
        const cargarCotizacion = () => dispatch(actions.fetchCotizacion(id));
        dispatch(actions.createSeguimientoCotizacion(seguimiento, {callback: cargarCotizacion}));
    };

    const actualizarSeguimiento = (seguimiento) => {
        const cargarCotizacion = () => dispatch(actions.fetchCotizacion(id));
        dispatch(actions.updateSeguimientoCotizacion(seguimiento.id, seguimiento, {callback: cargarCotizacion}))
    };

    const cargarDatos = () => {
        const cargarMiCuenta = () => dispatch(actions.fetchMiCuenta());
        dispatch(actions.fetchCotizacion(id, {callback: cargarMiCuenta}));

    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCotizaciones());
            dispatch(actions.clearSeguimientosCotizaciones());
        }
    }, [id]);

    if (!object) {
        return <SinObjeto/>
    }

    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
            <div className="row">
                <div className="col-12">
                    <Typography variant="h3" color="inherit" noWrap>
                        Cotización {object.nro_cotizacion && `${object.unidad_negocio}-${object.nro_cotizacion}`}
                        <small> - {object.estado}</small>
                    </Typography>
                </div>
                <div className="col-12">
                    <CotizacionInfo
                        object={object}
                        permisos_proyecto={permisos_proyecto}
                        permisos_cotizacion={permisos}
                        {...props}
                    />
                </div>
                <div className="col-12 mt-3">
                    <Tabs>
                        <TabList>
                            {(object.estado === 'Aceptación de Terminos y Condiciones' || object.estado === 'Cierre (Aprobado)') &&
                            <Tab>Inicio Proyecto</Tab>}
                            {object.pagos_proyectados.length > 0 && <Tab>Acuerdos Pago</Tab>}
                            {permisos.change && <Tab>Editar</Tab>}
                            {permisos_archivos_cotizacion.list && <Tab>Documentos</Tab>}
                            <Tab>Comentarios</Tab>
                            <Tab>Cambios de Estado</Tab>
                            <Tab>Tareas</Tab>
                        </TabList>
                        {(object.estado === 'Aceptación de Terminos y Condiciones' || object.estado === 'Cierre (Aprobado)') &&
                        <TabPanel>
                            <CotizacionCondicionInicioProyecto cotizacion={object}/>
                        </TabPanel>}
                        {object.pagos_proyectados.length > 0 && <TabPanel>
                            <CotizacionAcuerdoPagoList cotizacion={object}/>
                        </TabPanel>}
                        {permisos.change && <TabPanel>
                            {object.responsable && <CotizacionForm
                                initialValues={object}
                                onSubmit={guardarCambiosCotizacion}
                                permisos={permisos}
                            />}
                        </TabPanel>}
                        {permisos_archivos_cotizacion.list && <TabPanel>
                            <CotizacionDetailDocumento
                                cotizacion={object}
                                permisos={permisos_archivos_cotizacion}
                            />
                        </TabPanel>}
                        <TabPanel>
                            <ComentariosList
                                seguimiento_list={object.mis_seguimientos}
                                guardarComentario={guardarComentario}
                                eliminarSeguimiento={eliminarSeguimiento}
                            />
                        </TabPanel>
                        <TabPanel>
                            <CambioEstadoList seguimiento_list={object.mis_seguimientos}/>
                        </TabPanel>
                        <TabPanel>
                            <TareasList
                                actualizarSeguimiento={actualizarSeguimiento}
                                seguimiento_list={object.mis_seguimientos}
                                guardarTarea={guardarTarea}
                                eliminarSeguimiento={eliminarSeguimiento}
                                cotizacion={object}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
            <CargarDatos cargarDatos={cargarDatos}/>
        </ValidarPermisos>
    )
});

export default Detail;