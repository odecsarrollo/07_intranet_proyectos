import React, {Fragment, Component} from 'react'
import Tabla from './centros_costos_colaboradores_tabla';
import CreateForm from './forms/centro_costo_colaborador_form';
import ListManager from "../../../../../../00_utilities/components/CRUDTableManager";
import {
    COLABORADORES as permisos_view,
} from "../../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../../00_utilities/common";

class BloqueTab extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.plural_name = 'Centro Costo Colaborador';
        this.singular_name = 'Centros Costos Colaboradores';
    }

    onDelete(item, tipo) {
        const nombre = item.nombre;
        const {cargando, noCargando, notificarAction, notificarErrorAjaxAction} = this.props;
        const success_callback = () => {
            noCargando();
            notificarAction(`Se ha eliminado con éxito ${tipo.toLowerCase()} ${nombre}`)
        };
        cargando();
        this.props.deleteCentroCostoColaborador(item.id, success_callback, notificarErrorAjaxAction)
    }

    onSubmit(item, tipo) {
        const nombre = item.nombre;
        const {cargando, noCargando, notificarAction, notificarErrorAjaxAction} = this.props;
        const success_callback = () => {
            notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${tipo.toLowerCase()} ${nombre}`);
            noCargando();
        };
        cargando();
        if (item.id) {
            this.props.updateCentroCostoColaborador(item.id, item, success_callback, notificarErrorAjaxAction);
        } else {
            this.props.createCentroCostoColaborador(item, success_callback, notificarErrorAjaxAction);
        }
    }

    render() {
        const {list, mis_permisos} = this.props;
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
                                        this.props.fetchCentroCostoColaborador(item.id, () => {
                                                onSelectItem(item);
                                                handleModalOpen();
                                                noCargando();
                                            },
                                            notificarErrorAjaxAction
                                        )
                                    }}
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