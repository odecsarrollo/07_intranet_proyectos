import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../00_utilities/templates/fragmentos";
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

const Detail = memo(props => {
    const dispatch = useDispatch();
    const {history} = props;
    const {id} = props.match.params;
    const seguimiento_list = useSelector(state => state.cotizaciones_seguimientos);
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
        const callback = () => {
            history.push('/app/ventas')
        };
        dispatch(actions.updateCotizacion(id, cotizacion, {callback}));
    };

    const guardarComentario = (comentario) => {
        const seguimiento = {...comentario, cotizacion: id, tipo_seguimiento: 0};
        dispatch(actions.createSeguimientoCotizacion(seguimiento));
    };

    const eliminarSeguimiento = (seguimiento_id) => {
        dispatch(actions.deleteSeguimientoCotizacion(seguimiento_id))
    };

    const guardarTarea = (tarea) => {
        const seguimiento = {...tarea, cotizacion: id, tipo_seguimiento: 2};
        dispatch(actions.createSeguimientoCotizacion(seguimiento));
    };

    const actualizarSeguimiento = (seguimiento) => {
        dispatch(actions.updateSeguimientoCotizacion(seguimiento.id, seguimiento))
    };

    const cargarDatos = () => {
        const cargarArchivos = () => dispatch(actions.fetchArchivosCotizaciones_x_cotizacion(id));
        const cargarMiCuenta = () => dispatch(actions.fetchMiCuenta({callback: cargarArchivos}));
        const cargarSeguimientos = () => dispatch(actions.fetchSeguimientosCotizacionesxCotizacion(id, {callback: cargarMiCuenta}));
        dispatch(actions.fetchCotizacion(id, {callback: cargarSeguimientos}));

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
    }, []);

    if (!object) {
        return <SinObjeto/>
    }

    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
            <Titulo>Detalle de
                Cotización {object.nro_cotizacion && `Nro. ${object.unidad_negocio}-${object.nro_cotizacion}`}</Titulo>
            <div className="row">
                <CotizacionInfo object={object} permisos_proyecto={permisos_proyecto}
                                permisos_cotizacion={permisos} {...props}/>
                <div className="col-12 mt-3">
                    <Tabs>
                        <TabList>
                            {
                                permisos.change &&
                                <Tab>Editar</Tab>
                            }
                            {
                                permisos_archivos_cotizacion.list &&
                                <Tab onClick={() => setAdicionarDocumento(false)}>Documentos</Tab>
                            }
                            <Tab>Comentarios</Tab>
                            <Tab>Cambios de Estado</Tab>
                            <Tab>Tareas</Tab>
                        </TabList>
                        {
                            permisos.change &&
                            <TabPanel>
                                <CotizacionForm
                                    initialValues={object}
                                    onSubmit={guardarCambiosCotizacion}
                                />
                            </TabPanel>
                        }
                        {
                            permisos_archivos_cotizacion.list &&
                            <TabPanel>
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
                            </TabPanel>
                        }
                        <TabPanel>
                            <ComentariosList
                                seguimiento_list={seguimiento_list}
                                guardarComentario={guardarComentario}
                                eliminarSeguimiento={eliminarSeguimiento}
                            />
                        </TabPanel>
                        <TabPanel>
                            <CambioEstadoList seguimiento_list={seguimiento_list}/>
                        </TabPanel>
                        <TabPanel>
                            <TareasList
                                actualizarSeguimiento={actualizarSeguimiento}
                                seguimiento_list={seguimiento_list}
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