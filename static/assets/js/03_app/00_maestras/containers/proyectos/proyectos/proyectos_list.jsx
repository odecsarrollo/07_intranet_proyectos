import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../../01_actions/01_index';
import TextField from 'material-ui/TextField';
import TablaProyectos from '../../../components/proyectos/proyectos/proyectos_tabla';
import ProyectoForm from '../../../components/proyectos/proyectos/proyectos_form';
import CargarDatos from '../../../../components/cargar_datos';

import {tengoPermiso} from './../../../../../01_actions/00_general_fuctions';

class ProyectoLista extends Component {
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
            this.props.fetchProyecto(response.id);
            this.setState({mostrar_form: false, item_seleccionado: null});
            this.props.notificarAction(`El registro de el proyecto ${response.id_proyecto} ha sido exitoso!`);
        };
        if (id) {
            this.props.updateProyecto(
                id,
                values,
                callback,
                error_callback
            )
        } else {
            this.props.createProyecto(values, callback, error_callback)
        }
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onDelete(id) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        const {item_seleccionado} = this.state;
        const {deleteProyecto} = this.props;
        deleteProyecto(id, () => {
                this.props.notificarAction(`Se ha eliminado el proyecto ${item_seleccionado.id_proyecto}!`);
            }, error_callback
        );
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onSelectItem(item_seleccionado) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        this.props.fetchProyecto(
            item_seleccionado.id,
            response => {
                this.setState({item_seleccionado: response, mostrar_form: true})
            },
            error_callback
        );
    }

    cargarDatos() {
        this.props.fetchProyectos();
        this.props.fetchMisPermisos();
    }

    render() {
        const {busqueda, item_seleccionado, mostrar_form} = this.state;
        const {
            lista_objetos,
            mis_permisos
        } = this.props;

        if (!mis_permisos) {
            return (<div>Cargando...</div>)
        }
        else if (!tengoPermiso(mis_permisos, 'list_proyecto')) {
            return (<div>No tiene suficientes permisos.</div>)
        }

        let items_tabla_list = lista_objetos;
        if (!busqueda.toUpperCase().includes('TODO')) {
            items_tabla_list = _.pickBy(lista_objetos, objeto => {
                return (objeto.id_proyecto.toUpperCase().includes(busqueda.toUpperCase()))
            });
        }
        return (
            <div className="row">
                <div className="col-12">
                    <h3 className="h3-responsive">Proyectos</h3>
                    {
                        tengoPermiso(mis_permisos, 'add_proyecto') &&
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
                        tengoPermiso(mis_permisos, 'add_proyecto') ||
                        tengoPermiso(mis_permisos, 'change_proyecto')
                    ) &&
                    <div className="col-12 pl-3">
                        <ProyectoForm
                            onSubmit={this.onSubmit.bind(this)}
                            item_seleccionado={item_seleccionado}
                            onCancel={this.onCancel.bind(this)}
                            onDelete={this.onDelete.bind(this)}
                            can_delete={tengoPermiso(mis_permisos, 'delete_proyecto')}
                            cantidad_literales={item_seleccionado ? item_seleccionado.mis_literales.length : 0}
                            can_see_costo_presupuestado={tengoPermiso(mis_permisos, 'costo_presupuestado_proyecto')}
                            can_see_valor={tengoPermiso(mis_permisos, 'valor_proyecto')}
                        />
                    </div>
                }
                <div className="col-12">
                    <h5>Proyectos</h5>
                    <TablaProyectos
                        lista={items_tabla_list}
                        can_change={tengoPermiso(mis_permisos, 'change_proyecto')}
                        can_see_costo_presupuestado={tengoPermiso(mis_permisos, 'costo_presupuestado_proyecto')}
                        can_see_costo_materiales={tengoPermiso(mis_permisos, 'costo_materiales_proyecto')}
                        can_see_valor={tengoPermiso(mis_permisos, 'valor_proyecto')}
                        can_see_details={tengoPermiso(mis_permisos, 'detail_proyecto')}
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
        lista_objetos: state.proyectos,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(ProyectoLista);