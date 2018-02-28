import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../00_utilities/templates/fragmentos";
import ListManager from "../../../../../00_utilities/components/CRUDTableManager";
import {
    USUARIOS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";

import CreateForm from '../components/forms/colaborador_form';
import Tabla from '../components/colaboradores_tabla';

class ColaboradoresList extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onCreateColaboradorUsuario = this.onCreateColaboradorUsuario.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearColaboradores()
    }

    cargarDatos() {
        this.props.cargando();
        const cargarColaboradores = () => this.props.fetchColaboradores(() => this.props.noCargando(), this.error_callback);
        const cargarMiCuenta = () => this.props.fetchMiCuenta(cargarColaboradores, this.error_callback);
        this.props.fetchMisPermisos(cargarMiCuenta, this.error_callback)
    }

    onSubmit(item, tipo) {
        const nombre = `${item.nombres} ${item.apellidos}`;
        const {cargando, noCargando, notificarAction, notificarErrorAjaxAction} = this.props;
        const success_callback = () => {
            notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${tipo.toLowerCase()} ${nombre}`);
            noCargando();
        };
        cargando();
        if (item.id) {
            this.props.updateColaborador(item.id, item, success_callback, notificarErrorAjaxAction);
        } else {
            this.props.createColaborador(item, success_callback, notificarErrorAjaxAction);
        }
    }

    onDelete(item, tipo) {
        const nombre = `${item.nombres} ${item.apellidos}`;
        const {cargando, noCargando, notificarAction, notificarErrorAjaxAction} = this.props;
        const success_callback = () => {
            noCargando();
            notificarAction(`Se ha eliminado con éxito ${tipo.toLowerCase()} ${nombre}`)
        };
        cargando();
        this.props.deleteColaborador(item.id, success_callback, notificarErrorAjaxAction)
    }

    onCreateColaboradorUsuario(item) {
        const {cargando, noCargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.createColaboradorUsuario(
            item.id,
            (response) => {
                noCargando();
                notificarAction(`Se ha creado el usuario ${response.usuario_username} para ${response.nombres} ${response.apellidos} con exitoso!`)
            },
            notificarErrorAjaxAction
        )
    }

    render() {
        const {object_list, mi_cuenta, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        return (
            <ListManager permisos={permisos} singular_name='colaborador' plural_name='colaboradores'>
                {
                    (list_manager_state,
                     onSelectItem,
                     onCancel,
                     handleModalOpen,
                     handleModalClose) => {
                        return (
                            <Fragment>
                                <CreateForm
                                    onCancel={onCancel}
                                    item_seleccionado={list_manager_state.item_seleccionado}
                                    onSubmit={
                                        (item) => {
                                            this.onSubmit(item, list_manager_state.singular_name);
                                            handleModalClose();
                                        }
                                    }
                                    modal_open={list_manager_state.modal_open}
                                    element_type={`${list_manager_state.singular_name}`}
                                />
                                <Titulo>Lista de {list_manager_state.plural_name}</Titulo>
                                <Tabla
                                    data={_.map(object_list, e => e)}
                                    permisos={permisos}
                                    element_type={`${list_manager_state.singular_name}`}
                                    onDelete={(item) => {
                                        this.onDelete(item, list_manager_state.singular_name);
                                        handleModalClose();
                                    }}
                                    onSelectItemEdit={(item) => {
                                        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
                                        cargando();
                                        this.props.fetchColaborador(item.id, () => {
                                                onSelectItem(item);
                                                handleModalOpen();
                                                noCargando();
                                            },
                                            notificarErrorAjaxAction
                                        )
                                    }}
                                    updateItem={(item) => this.onSubmit(item, list_manager_state.singular_name)}
                                    onCreateColaboradorUsuario={this.onCreateColaboradorUsuario}
                                />

                                <CargarDatos
                                    cargarDatos={this.cargarDatos}
                                />
                            </Fragment>
                        )
                    }
                }
            </ListManager>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        mi_cuenta: state.mi_cuenta,
        object_list: state.colaboradores
    }
}

export default connect(mapPropsToState, actions)(ColaboradoresList)