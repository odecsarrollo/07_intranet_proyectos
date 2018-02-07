import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';
import TextField from 'material-ui/TextField';
import TablaHojasTrabajosDiarios from '../../components/hoja_trabajo_diario/hojas_trabajos_diarios_tabla';
import HojaTrabajoDiarioForm from '../../components/hoja_trabajo_diario/hojas_trabajos_diarios_form';
import CargarDatos from '../../../components/cargar_datos';

import {tengoPermiso} from './../../../../01_actions/00_general_fuctions';

class HojaTrabajoDiarioLista extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_form: false
        })
    }

    componentDidMount() {
        this.cargarDatos()
    }

    onSubmit(values) {
        const {id} = values;
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        const callback = (response) => {
            this.props.fetchHojaTrabajoDiario(response.id, () => {
                    this.setState({mostrar_form: false, item_seleccionado: null});
                    this.props.notificarAction(`El registro de hoja de trabajo para ${response.colaborador_nombre} ha sido exitoso!`);
                },
                error_callback
            );
        };
        if (id) {
            this.props.updateHojaTrabajoDiario(
                id,
                values,
                callback,
                error_callback
            )
        } else {
            this.props.createHojaTrabajoDiario(values, callback, error_callback)
        }
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onDelete(id) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        const {deleteHojaTrabajoDiario} = this.props;
        deleteHojaTrabajoDiario(id, () => {
                this.props.notificarAction(`Se ha eliminado hoja de trabajo!`);
            }, error_callback
        );
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onSelectItem(item_seleccionado) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        this.props.fetchHojaTrabajoDiario(
            item_seleccionado.id,
            response => {
                this.setState({item_seleccionado: response, mostrar_form: true})
            },
            error_callback
        );
    }

    cargarDatos() {
        this.props.fetchHojasTrabajosDiarios();
        this.props.fetchColaboradoresEnProyectos();
        this.props.fetchMisPermisos();
    }

    render() {
        const {busqueda, item_seleccionado, mostrar_form} = this.state;
        const {
            lista_objetos,
            mis_permisos,
            colaboradores
        } = this.props;
        if (!mis_permisos) {
            return (<div>Cargando...</div>)
        }
        else if (!tengoPermiso(mis_permisos, 'list_hojatrabajodiario')) {
            return (<div>No tiene suficientes permisos.</div>)
        }

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
            <div className="row">
                <div className="col-12">
                    <h3 className="h3-responsive">Hojas de Trabajos Diarios</h3>
                    {
                        tengoPermiso(mis_permisos, 'add_hojatrabajodiario') &&
                        <button
                            className="btn btn-primary"
                            style={{cursor: "pointer"}}
                            onClick={() => {
                                this.setState({item_seleccionado: null, mostrar_form: true})
                            }}
                        >
                            <i className="fas fa-plus"
                               aria-hidden="true"></i>
                        </button>
                    }
                </div>
                <div className="col-12">
                    <TextField
                        floatingLabelText="A buscar"
                        fullWidth={true}
                        onChange={e => {
                            this.setState({busqueda: e.target.value});
                        }}
                        autoComplete="off"
                        value={busqueda}
                    />
                </div>
                {
                    mostrar_form &&
                    (
                        tengoPermiso(mis_permisos, 'add_hojatrabajodiario') ||
                        tengoPermiso(mis_permisos, 'change_hojatrabajodiario')
                    ) &&
                    <div className="col-12 pl-3">
                        <HojaTrabajoDiarioForm
                            onSubmit={this.onSubmit.bind(this)}
                            item_seleccionado={item_seleccionado}
                            onCancel={this.onCancel.bind(this)}
                            onDelete={this.onDelete.bind(this)}
                            can_delete={item_seleccionado && tengoPermiso(mis_permisos, 'delete_hojatrabajodiario') && Number(item_seleccionado.costo_total) === 0}
                            colaboradores={colaboradores}
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
                        onSelectItem={this.onSelectItem.bind(this)}
                    />
                </div>
                <CargarDatos cargarDatos={this.cargarDatos.bind(this)}/>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        lista_objetos: state.hojas_trabajos_diarios,
        colaboradores: state.colaboradores,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(HojaTrabajoDiarioLista);