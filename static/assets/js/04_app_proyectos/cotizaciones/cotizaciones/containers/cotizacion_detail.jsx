import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter, pesosColombianos} from "../../../../00_utilities/common";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {
    COTIZACIONES as permisos_view,
    PROYECTOS as proyecto_permisos_view
} from "../../../../00_utilities/permisos/types";
import ComentariosList from '../../seguimientos/components/comentarios_list';
import TareasList from '../../seguimientos/components/tareas_list';
import CambioEstadoList from '../../seguimientos/components/cambios_estado_list';
import CotizacionForm from '../../cotizaciones/components/forms/cotizacion_form_detail';
import SolicitarCreacionLiteralForm from '../../cotizaciones/components/forms/cotizacion_solicitar_crear_literal_form';
import CotizacionInfo from '../components/cotizacion_info';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.guardarComentario = this.guardarComentario.bind(this);
        this.guardarTarea = this.guardarTarea.bind(this);
        this.eliminarSeguimiento = this.eliminarSeguimiento.bind(this);
        this.actualizarSeguimiento = this.actualizarSeguimiento.bind(this);
        this.guardarCambiosCotizacion = this.guardarCambiosCotizacion.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearCotizaciones();
        this.props.clearSeguimientosCotizaciones();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = () => {
            noCargando();
        };
        const cargarMiCuenta = () => this.props.fetchMiCuenta(success_callback, notificarErrorAjaxAction);
        const cargarSeguimientos = () => this.props.fetchSeguimientosCotizacionesxCotizacion(id, cargarMiCuenta, notificarErrorAjaxAction);
        const cargarCotizacion = () => this.props.fetchCotizacion(id, cargarSeguimientos, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarCotizacion, notificarErrorAjaxAction);

    }

    guardarCambiosCotizacion(cotizacion) {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.updateCotizacion(id, cotizacion, () => noCargando(), notificarErrorAjaxAction)
    }

    guardarComentario(comentario) {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const seguimiento = {...comentario, cotizacion: id, tipo_seguimiento: 0};
        this.props.createSeguimientoCotizacion(seguimiento, () => noCargando(), notificarErrorAjaxAction)
    }

    eliminarSeguimiento(seguimiento_id) {
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.deleteSeguimientoCotizacion(seguimiento_id, () => noCargando(), notificarErrorAjaxAction)
    }

    guardarTarea(tarea) {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const seguimiento = {...tarea, cotizacion: id, tipo_seguimiento: 2};
        this.props.createSeguimientoCotizacion(seguimiento, () => noCargando(), notificarErrorAjaxAction)
    }

    actualizarSeguimiento(seguimiento) {
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.updateSeguimientoCotizacion(seguimiento.id, seguimiento, () => noCargando(), notificarErrorAjaxAction)
    }

    render() {
        const {object, mis_permisos, seguimiento_list, mi_cuenta} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_proyecto = permisosAdapter(mis_permisos, proyecto_permisos_view);
        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
                <Titulo>Detalle de
                    Cotización {object.nro_cotizacion && `Nro. ${object.unidad_negocio}-${object.nro_cotizacion}`}</Titulo>
                <div className="row">
                    <CotizacionInfo object={object} permisos_proyecto={permisos_proyecto}/>
                    <div className="col-12">
                        <div className="row">
                            {
                                object.estado === 'Aprobado' &&
                                <Fragment>
                                    {
                                        !object.mi_literal &&
                                        !object.abrir_carpeta &&
                                        <Fragment>
                                            {
                                                !object.crear_literal ?
                                                    <SolicitarCreacionLiteralForm onSubmit={(v) => {
                                                        this.guardarCambiosCotizacion({
                                                            ...object,
                                                            crear_literal: true,
                                                            crear_literal_id_proyecto: v.id_proyecto
                                                        })
                                                    }}/> :
                                                    <span className='btn btn-primary'
                                                          onClick={() => this.guardarCambiosCotizacion({
                                                              ...object,
                                                              crear_literal: false,
                                                              crear_literal_id_proyecto: null
                                                          })}>
                                        Cancelar Creación Literal para Poyecto {object.crear_literal_id_proyecto}
                                    </span>
                                            }
                                        </Fragment>

                                    }
                                    {
                                        !object.mi_proyecto &&
                                        !object.crear_literal &&
                                        <div className="col-12 col-md-3">
                                            <div className="row card p-1">
                                                <div className="col-12">
                                                    <h4>Apertura Proyecto</h4>
                                                </div>
                                                {
                                                    object.abrir_carpeta ?
                                                        <div className='row'>
                                                            <div className="col-12">
                                    <span className='btn btn-primary'
                                          onClick={() => this.guardarCambiosCotizacion({
                                              ...object,
                                              abrir_carpeta: false
                                          })}>
                                        Cancelar Apertura Carpeta
                                    </span>
                                                            </div>
                                                        </div> :
                                                        object.estado === 'Aprobado' &&
                                                        <span className='btn btn-primary'
                                                              onClick={() => this.guardarCambiosCotizacion({
                                                                  ...object,
                                                                  abrir_carpeta: true
                                                              })}>
                                    Solicitar Apertura Carpeta
                                </span>

                                                }
                                            </div>
                                        </div>
                                    }
                                </Fragment>
                            }
                        </div>
                    </div>
                    <div className="col-12 mt-3">
                        <Tabs>
                            <TabList>
                                <Tab>Comentarios</Tab>
                                <Tab>Cambios de Estado</Tab>
                                <Tab>Tareas</Tab>
                                {
                                    permisos.change &&
                                    <Tab>Editar</Tab>
                                }
                            </TabList>
                            <TabPanel>
                                <ComentariosList
                                    mi_cuenta={mi_cuenta}
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
                                    mi_cuenta={mi_cuenta}
                                    seguimiento_list={seguimiento_list}
                                    guardarTarea={this.guardarTarea}
                                    eliminarSeguimiento={this.eliminarSeguimiento}
                                    cotizacion={object}
                                />
                            </TabPanel>
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
        object: state.cotizaciones[id],
        mi_cuenta: state.mi_cuenta,
        usuarios_list: state.usuarios,
        clientes_list: state.clientes,
    }
}

export default connect(mapPropsToState, actions)(Detail)