import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../../01_actions/01_index';
import TablaColaboradores from '../../../components/cguno/colaboradores/colaboradores_list_tabla';
import ColaboradorForm from '../../../components/cguno/colaboradores/colaboradores_form';
import CargarDatos from '../../../../components/cargar_datos';
import {SinPermisos, ListaTitulo, ListaBusqueda} from '../../../../components/utiles';

import {tengoPermiso} from './../../../../../01_actions/00_general_fuctions';

class ColaboradoresLista extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_form: false,
            cargando: false
        });
        this.onCancel = this.onCancel.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onCreateColaboradorUsuario = this.onCreateColaboradorUsuario.bind(this);
        this.onCambiarActivacion = this.onCambiarActivacion.bind(this);
        this.error_callback = this.error_callback.bind(this);
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    componentDidMount() {
        this.cargarDatos()
    }

    componentWillMount() {
        this.props.clearColaboradores()
    }

    onUpdate(item) {
        this.props.updateColaborador(
            item.id,
            item,
            () => {
                this.props.fetchColaborador(
                    item.id,
                    (response) => {
                        this.props.notificarAction(`El registro del colaborador ${response.nombres} ${response.apellidos} ha sido exitoso!`)
                    },
                    this.error_callback
                )
            },
            this.error_callback
        )
    }

    onCreateColaboradorUsuario(item) {
        this.props.createColaboradorUsuario(
            item.id,
            (response) => {
                this.props.notificarAction(`Se ha creado el usuario ${response.usuario_username} para ${response.nombres} ${response.apellidos} con exitoso!`)
            },
            this.error_callback
        )
    }

    onCambiarActivacion(item) {
        this.props.activateColaboradorUsuario(
            item.id,
            (response) => {
                this.props.notificarAction(`Se ha cambiado la activacion del usuario ${response.usuario_username} para ${response.nombres} ${response.apellidos} con exitoso!`)
            },
            this.error_callback
        )
    }

    onSubmit(values) {
        const {id} = values;
        const callback = (response) => {
            this.props.fetchColaborador(response.id);
            this.setState({mostrar_form: false, item_seleccionado: null});
            this.props.notificarAction(`El registro del colaborador ${response.nombres} ${response.apellidos} ha sido exitoso!`);
        };
        if (id) {
            this.props.updateColaborador(
                id,
                values,
                callback,
                this.error_callback
            )
        } else {
            this.props.createColaborador({...values, es_cguno: false}, callback, this.error_callback)
        }
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onDelete(id) {
        const {item_seleccionado} = this.state;
        const {deleteColaborador} = this.props;
        deleteColaborador(id, () => {
                this.props.notificarAction(`Se ha eliminado el colaborador ${item_seleccionado.nombres} ${item_seleccionado.apellidos}!`);
            }, this.error_callback
        );
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onSelectItem(item_seleccionado) {
        this.props.fetchColaborador(
            item_seleccionado.id,
            response => {
                this.setState({item_seleccionado: response, mostrar_form: true})
            },
            this.error_callback
        );
    }

    cargarDatos() {
        this.setState({cargando: true});
        this.props.fetchMisPermisos(() => {
                this.props.fetchColaboradores(() => {
                        this.setState({cargando: false});
                    },
                    this.error_callback
                );
            },
            this.error_callback
        );
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
                return (
                    objeto.cedula.toUpperCase().includes(busqueda.toUpperCase()) ||
                    objeto.nombres.toUpperCase().includes(busqueda.toUpperCase()) ||
                    objeto.apellidos.toUpperCase().includes(busqueda.toUpperCase())
                )
            });
        }
        return (
            <SinPermisos
                nombre='Colaboradores'
                cargando={this.state.cargando}
                mis_permisos={mis_permisos}
                can_see={tengoPermiso(mis_permisos, 'list_colaboradorbiable')}
            >
                <div className="row">
                    <div className="col-12">
                        <ListaTitulo
                            titulo='Colaboradores'
                            can_add={tengoPermiso(mis_permisos, 'add_colaboradorbiable')}
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
                            tengoPermiso(mis_permisos, 'add_colaboradorbiable') ||
                            tengoPermiso(mis_permisos, 'change_colaboradorbiable')
                        ) &&
                        <div className="col-12 pl-3">
                            <ColaboradorForm
                                mis_permisos={mis_permisos}
                                onSubmit={this.onSubmit}
                                item_seleccionado={item_seleccionado}
                                onCancel={this.onCancel}
                                onDelete={this.onDelete}
                            />
                        </div>
                    }
                    <div className="col-12">
                        <h5>Colaboradores</h5>
                        <TablaColaboradores
                            lista={_.sortBy(items_tabla_list, ['nombres', 'apellidos'])}
                            mis_permisos={mis_permisos}
                            item_seleccionado={item_seleccionado}
                            onSelectItem={this.onSelectItem}
                            onUpdate={this.onUpdate}
                            onCreateColaboradorUsuario={this.onCreateColaboradorUsuario}
                            onCambiarActivacion={this.onCambiarActivacion}
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
        lista_objetos: state.colaboradores,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(ColaboradoresLista);