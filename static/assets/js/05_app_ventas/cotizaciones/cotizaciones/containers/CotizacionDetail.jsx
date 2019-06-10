import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapterDos} from "../../../../00_utilities/common";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {
    COTIZACIONES as permisos_view,
    PROYECTOS as proyecto_permisos_view,
    ARCHIVOS_COTIZACIONES as archivo_cotizacion_permisos_view
} from "../../../../00_utilities/permisos/types";
import ComentariosList from '../../seguimientos/components/comentarios_list';
import TareasList from '../../seguimientos/components/tareas_list';
import CambioEstadoList from '../../seguimientos/components/cambios_estado_list';
import CotizacionForm from '../../tuberia_ventas/components/forms/cotizacion_form_detail';
import CotizacionInfo from '../../tuberia_ventas/components/cotizacion_info';
import UploadDocumentoForm from '../../../../04_app_proyectos/proyectos/archivos/forms/upload_documento_form';
import ArchivosCotizacionList from '../../../../04_app_proyectos/proyectos/archivos/components/archivos_list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adicionar_documento: false,
            item_seleccionado: null,
        };
        this.cargarDatos = this.cargarDatos.bind(this);
        this.guardarComentario = this.guardarComentario.bind(this);
        this.guardarTarea = this.guardarTarea.bind(this);
        this.eliminarSeguimiento = this.eliminarSeguimiento.bind(this);
        this.actualizarSeguimiento = this.actualizarSeguimiento.bind(this);
        this.guardarCambiosCotizacion = this.guardarCambiosCotizacion.bind(this);
        this.onUploadArchivo = this.onUploadArchivo.bind(this);
        this.onSubmitUploadArchivo = this.onSubmitUploadArchivo.bind(this);
        this.onDeleteArchivo = this.onDeleteArchivo.bind(this);
        this.onSelectArchivo = this.onSelectArchivo.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                permisos_view,
                proyecto_permisos_view,
                archivo_cotizacion_permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    componentWillUnmount() {
        this.props.clearCotizaciones();
        this.props.clearSeguimientosCotizaciones();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarArchivos = () => this.props.fetchArchivosCotizaciones_x_cotizacion(id);
        const cargarMiCuenta = () => this.props.fetchMiCuenta({callback: cargarArchivos});
        const cargarSeguimientos = () => this.props.fetchSeguimientosCotizacionesxCotizacion(id, {callback: cargarMiCuenta});
        this.props.fetchCotizacion(id, {callback: cargarSeguimientos});

    }

    guardarCambiosCotizacion(cotizacion) {
        const {id} = this.props.match.params;
        const {history} = this.props;
        const callback = () => {
            history.push('/app/ventas')
        };
        this.props.updateCotizacion(id, cotizacion, {callback})
    }

    guardarComentario(comentario) {
        const {id} = this.props.match.params;
        const seguimiento = {...comentario, cotizacion: id, tipo_seguimiento: 0};
        this.props.createSeguimientoCotizacion(seguimiento)
    }

    eliminarSeguimiento(seguimiento_id) {
        this.props.deleteSeguimientoCotizacion(seguimiento_id)
    }

    guardarTarea(tarea) {
        const {id} = this.props.match.params;
        const seguimiento = {...tarea, cotizacion: id, tipo_seguimiento: 2};
        this.props.createSeguimientoCotizacion(seguimiento)
    }

    actualizarSeguimiento(seguimiento) {
        this.props.updateSeguimientoCotizacion(seguimiento.id, seguimiento)
    }

    onSubmitUploadArchivo(valores) {
        const {id} = valores;
        if (id) {
            delete valores.archivo;
            this.props.updateArchivoCotizacion(
                id,
                valores,
                {callback: () => this.setState({adicionar_documento: false})}
            )
        } else {
            this.onUploadArchivo(valores);
        }
    }

    onSelectArchivo(item_seleccionado) {
        this.setState({item_seleccionado, adicionar_documento: true})
    }

    onDeleteArchivo(archivo_id) {
        const {object} = this.props;
        this.props.deleteArchivoCotizacion(
            archivo_id,
            {callback: () => this.props.fetchArchivosCotizaciones_x_cotizacion(object.id)}
        )
    }

    onUploadArchivo(e) {
        const {notificarAction, object} = this.props;
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            this.props.uploadArchivoCotizacion(
                object.id,
                formData,
                {
                    callback:
                        () => {
                            this.props.fetchArchivosCotizaciones_x_cotizacion(
                                object.id,
                                () => {
                                    notificarAction(`La ha subido el archivo para la cotizacion ${object.nro_cotizacion ? object.nro_cotizacion : object.id}`);
                                    this.setState({adicionar_documento: false});
                                }
                            )
                        }
                }
            )
        }
    }

    render() {
        const {object, seguimiento_list, archivos_list, mis_permisos} = this.props;
        const {adicionar_documento, item_seleccionado} = this.state;
        const permisos = permisosAdapterDos(permisos_view);
        const permisos_proyecto = permisosAdapterDos(mis_permisos, proyecto_permisos_view);
        const permisos_archivos_cotizacion = permisosAdapterDos(mis_permisos, archivo_cotizacion_permisos_view);
        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
                <Titulo>Detalle de
                    Cotización {object.nro_cotizacion && `Nro. ${object.unidad_negocio}-${object.nro_cotizacion}`}</Titulo>
                <div className="row">
                    <CotizacionInfo object={object} permisos_proyecto={permisos_proyecto}
                                    permisos_cotizacion={permisos} {...this.props}/>
                    <div className="col-12 mt-3">
                        <Tabs>
                            <TabList>
                                {
                                    permisos.change &&
                                    <Tab>Editar</Tab>
                                }
                                {
                                    permisos_archivos_cotizacion.list &&
                                    <Tab onClick={() => this.setState({adicionar_documento: false})}>Documentos</Tab>
                                }
                                <Tab>Comentarios</Tab>
                                <Tab>Cambios de Estado</Tab>
                                <Tab>Tareas</Tab>
                            </TabList>
                            {
                                permisos.change &&
                                <TabPanel>
                                    <CotizacionForm
                                        item_seleccionado={object}
                                        onSubmit={this.guardarCambiosCotizacion}
                                        {...this.props}
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
                                            onClick={() => this.setState((s) => ({
                                                adicionar_documento: !s.adicionar_documento,
                                                item_seleccionado: null
                                            }))}
                                        />
                                    }
                                    {
                                        adicionar_documento &&
                                        <UploadDocumentoForm
                                            onSubmit={this.onSubmitUploadArchivo}
                                            item_seleccionado={item_seleccionado}
                                        />
                                    }
                                    <ArchivosCotizacionList
                                        lista={archivos_list}
                                        permisos={permisos_archivos_cotizacion}
                                        onDeleteArchivo={this.onDeleteArchivo}
                                        onSelectElemento={this.onSelectArchivo}
                                    />
                                </TabPanel>
                            }
                            <TabPanel>
                                <ComentariosList
                                    seguimiento_list={seguimiento_list}
                                    guardarComentario={this.guardarComentario}
                                    eliminarSeguimiento={this.eliminarSeguimiento}
                                />
                            </TabPanel>
                            <TabPanel>
                                <CambioEstadoList seguimiento_list={seguimiento_list}/>
                            </TabPanel>
                            <TabPanel>
                                <TareasList
                                    actualizarSeguimiento={this.actualizarSeguimiento}
                                    seguimiento_list={seguimiento_list}
                                    guardarTarea={this.guardarTarea}
                                    eliminarSeguimiento={this.eliminarSeguimiento}
                                    cotizacion={object}
                                />
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        seguimiento_list: state.cotizaciones_seguimientos,
        proyectos_list: state.proyectos,
        literales_list: state.literales,
        object: state.cotizaciones[id],
        usuarios_list: state.usuarios,
        contactos_list: state.clientes_contactos,
        clientes_list: state.clientes,
        archivos_list: state.archivos_cotizaciones,
    }
}

export default connect(mapPropsToState, actions)(Detail)