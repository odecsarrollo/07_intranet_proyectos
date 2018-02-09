import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../../01_actions/01_index';
import TablaProyectos from '../../../components/proyectos/proyectos/proyectos_tabla';
import ProyectoForm from '../../../components/proyectos/proyectos/proyectos_form';
import CargarDatos from '../../../../components/cargar_datos';
import {SinPermisos, ListaTitulo, ListaBusqueda} from '../../../../components/utiles';

import {tengoPermiso} from './../../../../../01_actions/00_general_fuctions';

class ProyectoLista extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_form: false
        });
        this.onCancel = this.onCancel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
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


        let items_tabla_list = lista_objetos;
        if (!busqueda.toUpperCase().includes('TODO')) {
            items_tabla_list = _.pickBy(lista_objetos, objeto => {
                return (objeto.id_proyecto.toUpperCase().includes(busqueda.toUpperCase()))
            });
        }
        return (
            <SinPermisos
                nombre='Proyectos'
                mis_permisos={mis_permisos}
                can_see={!tengoPermiso(mis_permisos, 'list_proyecto')}
            >
                <div className="row">
                    <div className="col-12">
                        <ListaTitulo
                            titulo='Proyectos'
                            can_add={tengoPermiso(mis_permisos, 'add_proyecto')}
                            onClick={() => {
                                this.setState({item_seleccionado: null, mostrar_form: true})
                            }}
                        />
                    </div>
                    <div className="col-12">
                        <ListaBusqueda
                            busqueda={busqueda}
                            onChange={e => {
                                this.setState({busqueda: e.target.value});
                            }}/>
                    </div>
                    {
                        mostrar_form &&
                        (
                            tengoPermiso(mis_permisos, 'add_proyecto') ||
                            tengoPermiso(mis_permisos, 'change_proyecto')
                        ) &&
                        <div className="col-12 pl-3">
                            <ProyectoForm
                                mis_permisos={mis_permisos}
                                onSubmit={this.onSubmit}
                                item_seleccionado={item_seleccionado}
                                onCancel={this.onCancel}
                                onDelete={this.onDelete}
                                cantidad_literales={item_seleccionado ? item_seleccionado.mis_literales.length : 0}
                            />
                        </div>
                    }
                    <div className="col-12">
                        <h5>Proyectos</h5>
                        <TablaProyectos
                            lista={items_tabla_list}
                            mis_permisos={mis_permisos}
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
        lista_objetos: state.proyectos,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(ProyectoLista);