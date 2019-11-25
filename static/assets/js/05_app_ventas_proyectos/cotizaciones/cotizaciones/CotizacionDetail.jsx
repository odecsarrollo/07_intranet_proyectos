import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {SinObjeto} from "../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {COTIZACIONES, PROYECTOS, ARCHIVOS_COTIZACIONES} from "../../../permisos";
import ComentariosList from '../seguimientos/CotizacionSeguimientoComentarioList';
import TareasList from '../seguimientos/CotizacionSeguimientoTareaList';
import CambioEstadoList from '../seguimientos/CotizacionSeguimientoCambioEstadoList';
import CotizacionForm from './forms/CotizacionFormDetail';
import CotizacionInfo from './CotizacionDetailInfo';
import UploadDocumentoForm from '../../../04_app_proyectos/proyectos/archivos/forms/UploadArchivoForm';
import ArchivosCotizacionList from '../../../04_app_proyectos/proyectos/archivos/components/ProyectoDocumentoList';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import Typography from "@material-ui/core/Typography";
import CotizacionCondicionInicioProyecto from "./forms/CotizacionCondicionInicioProyecto";

const Detail = memo(props => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const archivos_list = useSelector(state => state.archivos_cotizaciones);
    const object = useSelector(state => state.cotizaciones[id]);
    const [adicionar_documento, setAdicionarDocumento] = useState(false);
    const [item_seleccionado, setItemSeleccionado] = useState(null);
    const permisos = useTengoPermisos(COTIZACIONES);
    const permisos_proyecto = useTengoPermisos(PROYECTOS);
    const permisos_archivos_cotizacion = useTengoPermisos(ARCHIVOS_COTIZACIONES);

    const onSelectArchivo = (item_seleccionado) => {
        setItemSeleccionado(item_seleccionado);
        setAdicionarDocumento(true);
    };

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
        const cargarArchivos = () => dispatch(actions.fetchArchivosCotizaciones_x_cotizacion(id));
        const cargarMiCuenta = () => dispatch(actions.fetchMiCuenta({callback: cargarArchivos}));
        dispatch(actions.fetchCotizacion(id, {callback: cargarMiCuenta}));

    };


    const onSubmitUploadArchivo = (valores) => {
        if (valores.id) {
            delete valores.archivo;
            dispatch(
                actions.updateArchivoCotizacion(
                    valores.id,
                    valores,
                    {callback: () => setAdicionarDocumento(false)}
                )
            )
        } else {
            onUploadArchivo(valores);
        }
    };

    const onDeleteArchivo = (archivo_id) => {
        dispatch(
            actions.deleteArchivoCotizacion(
                archivo_id,
                {callback: () => dispatch(actions.fetchArchivosCotizaciones_x_cotizacion(object.id))}
            )
        )
    };

    const onUploadArchivo = (e) => {
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            dispatch(
                actions.uploadArchivoCotizacion(
                    object.id,
                    formData,
                    {
                        callback:
                            () => {
                                dispatch(
                                    actions.fetchArchivosCotizaciones_x_cotizacion(
                                        object.id,
                                        () => {
                                            dispatch(actions.notificarAction(`La ha subido el archivo para la cotizacion ${object.nro_cotizacion ? object.nro_cotizacion : object.id}`));
                                            setAdicionarDocumento(false);
                                        }
                                    )
                                )
                            }
                    }
                )
            )
        }
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearArchivosCotizaciones());
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
                            {object.estado === 'Cierre (Aprobado)' && <Tab>Inicio Proyecto</Tab>}
                            {permisos.change && <Tab>Editar</Tab>}
                            {permisos_archivos_cotizacion.list &&
                            <Tab onClick={() => setAdicionarDocumento(false)}>Documentos</Tab>}
                            <Tab>Comentarios</Tab>
                            <Tab>Cambios de Estado</Tab>
                            <Tab>Tareas</Tab>
                        </TabList>
                        {object.estado === 'Cierre (Aprobado)' && <TabPanel>
                            <CotizacionCondicionInicioProyecto cotizacion={object}/>
                        </TabPanel>}
                        {permisos.change && <TabPanel>
                            <CotizacionForm
                                initialValues={object}
                                onSubmit={guardarCambiosCotizacion}
                            />
                        </TabPanel>}
                        {permisos_archivos_cotizacion.list && <TabPanel>
                            {
                                permisos_archivos_cotizacion.add &&
                                <FontAwesomeIcon
                                    className='puntero'
                                    icon={`${adicionar_documento ? 'minus' : 'plus'}-circle`}
                                    onClick={() => {
                                        setAdicionarDocumento(!adicionar_documento);
                                        setItemSeleccionado(null);
                                    }}
                                />
                            }
                            {
                                adicionar_documento &&
                                <UploadDocumentoForm
                                    onSubmit={onSubmitUploadArchivo}
                                    initialValues={item_seleccionado}
                                />
                            }
                            <ArchivosCotizacionList
                                lista={archivos_list}
                                permisos={permisos_archivos_cotizacion}
                                onDeleteArchivo={onDeleteArchivo}
                                onSelectElemento={onSelectArchivo}
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