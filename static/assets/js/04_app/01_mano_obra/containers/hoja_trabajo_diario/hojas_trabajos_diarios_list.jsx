import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';
import TablaHojasTrabajosDiarios from '../../components/hoja_trabajo_diario/hojas_trabajos_diarios_tabla';
import HojaTrabajoDiarioForm from '../../components/hoja_trabajo_diario/hojas_trabajos_diarios_form';
import CalendarioRangosFiltro from '../../../components/utilidades/calendariosRangosFiltro';
import CargarDatos from '../../../components/cargar_datos';
import {SinPermisos, ListaTitulo, ListaBusqueda} from '../../../components/utiles';

import {tengoPermiso} from './../../../../01_actions/00_general_fuctions';

class HojaTrabajoDiarioLista extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_form: false,
            filtro_fecha_min: null,
            filtro_fecha_max: null
        });
        this.error_callback = this.error_callback.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.cargarHojasTrabajo = this.cargarHojasTrabajo.bind(this);
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    componentDidMount() {
        this.cargarDatos()
    }

    componentWillUnmount() {
        this.props.clearHojasTrabajos();
    }

    onSubmit(values) {
        this.props.cargando();
        const {id} = values;
        const callback = (response) => {
            this.props.fetchHojaTrabajoDiario(response.id, () => {
                    this.setState({mostrar_form: false, item_seleccionado: null});
                    this.props.notificarAction(`El registro de hoja de trabajo para ${response.colaborador_nombre} ha sido exitoso!`);
                    this.props.noCargando();
                },
                this.error_callback
            );
        };
        if (id) {
            this.props.updateHojaTrabajoDiario(
                id,
                values,
                callback,
                this.error_callback
            )
        } else {
            this.props.createHojaTrabajoDiario(values, callback, this.error_callback)
        }
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onDelete(id) {
        this.props.cargando();
        const {deleteHojaTrabajoDiario} = this.props;
        deleteHojaTrabajoDiario(id, () => {
                this.props.notificarAction(`Se ha eliminado hoja de trabajo!`);
                this.props.noCargando();
                this.setState({item_seleccionado: null, mostrar_form: false});
            }, this.error_callback
        );
    }

    onSelectItem(item_seleccionado) {
        this.props.cargando();
        this.props.fetchHojaTrabajoDiario(
            item_seleccionado.id,
            response => {
                this.setState({item_seleccionado: response, mostrar_form: true});
                this.props.noCargando();
            },
            this.error_callback
        );
    }

    cargarHojasTrabajo(filtro_fecha_min, filtro_fecha_max) {
        if (filtro_fecha_max && filtro_fecha_min) {
            this.props.cargando();
            this.props.fetchHojasTrabajosxFechas(
                filtro_fecha_min,
                filtro_fecha_max,
                () => {
                    this.props.noCargando()
                }, this.error_callback
            )
        }
    }

    cargarDatos() {
        this.props.cargando();
        this.props.fetchMiColaborador();
        this.props.fetchMisPermisos(
            () => {
                this.props.noCargando();
            },
            this.error_callback
        );
    }

    render() {
        const {busqueda, item_seleccionado, mostrar_form, filtro_fecha_max, filtro_fecha_min} = this.state;
        const {
            lista_objetos,
            mis_permisos,
            colaboradores,
            mi_colaborador,
            esta_cargando
        } = this.props;

        let items_tabla_list = lista_objetos;
        if (!busqueda.toUpperCase().includes('TODO')) {
            items_tabla_list = _.pickBy(lista_objetos, objeto => {
                return (
                    objeto.colaborador_nombre.toUpperCase().includes(busqueda.toUpperCase()) ||
                    objeto.fecha.toString().toUpperCase().includes(busqueda.toUpperCase())
                )
            });
        }

        return (
            <SinPermisos
                nombre='Hojas de Trabajo'
                cargando={esta_cargando}
                mis_permisos={mis_permisos}
                can_see={tengoPermiso(mis_permisos, 'list_hojatrabajodiario')}
            >
                <div className="row">
                    <div className="col-12">
                        <ListaTitulo
                            titulo='Hojas de Trabajos Diarios'
                            can_add={
                                tengoPermiso(mis_permisos, 'add_hojatrabajodiario') &&
                                (
                                    tengoPermiso(mis_permisos, 'para_otros_hojatrabajodiario') ||
                                    (
                                        mi_colaborador && mi_colaborador.en_proyectos && mi_colaborador.autogestion_horas_trabajadas
                                    )
                                )
                            }
                            onClick={() => {
                                this.props.fetchColaboradoresEnProyectos(
                                    () => {
                                        this.props.noCargando();
                                        this.setState({item_seleccionado: null, mostrar_form: true});
                                    },
                                    this.error_callback
                                );
                            }}
                        />
                    </div>
                    <CalendarioRangosFiltro metodoBusquedaFechas={this.cargarHojasTrabajo} className='col-12'/>
                    <div className="col-12">
                        <ListaBusqueda
                            busqueda={busqueda}
                            onChange={e => {
                                this.setState({busqueda: e.target.value});
                            }}/>
                    </div>
                    {
                        mostrar_form &&
                        <div className="col-12 pl-3">
                            <HojaTrabajoDiarioForm
                                onSubmit={this.onSubmit}
                                item_seleccionado={item_seleccionado}
                                onCancel={this.onCancel}
                                onDelete={this.onDelete}
                                can_delete={item_seleccionado && tengoPermiso(mis_permisos, 'delete_hojatrabajodiario') && Number(item_seleccionado.costo_total) === 0}
                                colaboradores={
                                    tengoPermiso(mis_permisos, 'para_otros_hojatrabajodiario') ?
                                        colaboradores :
                                        {[mi_colaborador.id]: mi_colaborador}
                                }
                            />
                        </div>
                    }
                    <div className="col-12">
                        <h5>Hojas de Trabajos Diarios</h5>
                        <TablaHojasTrabajosDiarios
                            lista={items_tabla_list}
                            can_change={tengoPermiso(mis_permisos, 'delete_hojatrabajodiario')}
                            can_see_costos={tengoPermiso(mis_permisos, 'costos_hojatrabajodiario')}
                            can_see_details={tengoPermiso(mis_permisos, 'detail_hojatrabajodiario') && tengoPermiso(mis_permisos, 'list_horahojatrabajo')}
                            item_seleccionado={item_seleccionado}
                            onSelectItem={this.onSelectItem}
                        />
                    </div>
                    <CargarDatos cargarDatos={this.cargarDatos}/>
                </div>
            </SinPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        lista_objetos: state.hojas_trabajos_diarios,
        colaboradores: state.colaboradores,
        esta_cargando: state.esta_cargando,
        mi_colaborador: state.mi_colaborador,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(HojaTrabajoDiarioLista);