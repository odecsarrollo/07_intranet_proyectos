import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../../00_utilities/templates/fragmentos";
import ListManager from "../../../../../../00_utilities/components/CRUDTableManager";
import {
    USUARIOS as permisos_view
} from "../../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../../00_utilities/common";

import CreateForm from '../components/forms/base_form';

import Tabla from '../components/base_tabla';

class List extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.plural_name = 'Algo';
        this.singular_name = 'Algo';
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearAlgos()
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarAlgos = () => this.props.fetchAlgos(() => noCargando(), notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarAlgos, notificarErrorAjaxAction)
    }

    onSubmit(item, tipo) {
        const nombre = item.username;
        const {cargando, noCargando, notificarAction, notificarErrorAjaxAction} = this.props;
        const success_callback = () => {
            notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${tipo.toLowerCase()} ${nombre}`);
            noCargando();
        };
        cargando();
        if (item.id) {
            this.props.updateALGO(item.id, item, success_callback, notificarErrorAjaxAction);
        } else {
            this.props.createALGO(item, success_callback, notificarErrorAjaxAction);
        }
    }

    onDelete(item, tipo) {
        const nombre = item.username;
        const {cargando, noCargando, notificarAction, notificarErrorAjaxAction} = this.props;
        const success_callback = () => {
            noCargando();
            notificarAction(`Se ha eliminado con éxito ${tipo.toLowerCase()} ${nombre}`)
        };
        cargando();
        this.props.deleteAlgo(item.id, success_callback, notificarErrorAjaxAction)
    }

    render() {
        const {object_list, mi_cuenta, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        return (

            <ListManager permisos={permisos} singular_name={this.singular_name} plural_name={this.plural_name}>
                {
                    (list_manager_state,
                     onSelectItem,
                     onCancel,
                     handleModalOpen,
                     handleModalClose) => {
                        return (
                            <Fragment>
                                {
                                    list_manager_state.modal_open &&
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
                                }
                                <Titulo>Lista de {list_manager_state.plural_name}</Titulo>
                                <CargarDatos
                                    cargarDatos={this.cargarDatos}
                                />


                                <Tabla
                                    data={_.map(object_list, e => e)}
                                    permisos={permisos}
                                    mi_cuenta={mi_cuenta}
                                    element_type={`${list_manager_state.singular_name}`}
                                    onDelete={(item) => {
                                        this.onDelete(item, list_manager_state.singular_name);
                                        handleModalClose();
                                    }}
                                    onSelectItemEdit={(item) => {
                                        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
                                        cargando();
                                        this.props.fetchAlgos(item.id, () => {
                                                onSelectItem(item);
                                                handleModalOpen();
                                                noCargando();
                                            },
                                            notificarErrorAjaxAction
                                        )
                                    }}
                                    updateItem={(item) => this.onSubmit(item, list_manager_state.singular_name)}
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
        object_list: state.algos
    }
}

export default connect(mapPropsToState, actions)(List)