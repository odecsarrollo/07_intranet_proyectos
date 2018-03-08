import React, {Fragment, Component} from 'react'
import CreateForm from '../components/forms/colaborador_form';
import Tabla from '../components/colaboradores_tabla';
import ListManager from "../../../../../../00_utilities/components/CRUDTableManager";
import {
    COLABORADORES as permisos_view
} from "../../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../../00_utilities/common";

class BloqueTab extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onCreateColaboradorUsuario = this.onCreateColaboradorUsuario.bind(this);
        this.plural_name = 'colaboradores';
        this.singular_name = 'colaborador';
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
            return this.props.createColaborador(item, success_callback, notificarErrorAjaxAction)
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

    render() {
        const {list, mis_permisos, centros_costos_list} = this.props;
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
                                        centros_costos_list={centros_costos_list}
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
                                <Tabla
                                    data={_.map(list, e => e)}
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
                            </Fragment>
                        )
                    }
                }
            </ListManager>
        )
    }
}

export default BloqueTab;