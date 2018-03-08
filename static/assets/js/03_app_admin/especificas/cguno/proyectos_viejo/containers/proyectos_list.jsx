import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {tengoPermiso} from "../../../../../00_utilities/common";
import {
    PERMISO_LIST_PROYECTO as can_list_permiso,
    PERMISO_DETAIL_PROYECTO as can_detail_permiso,
    PERMISO_ADD_PROYECTO as can_add_permiso,
    PERMISO_CHANGE_PROYECTO as can_change_permiso,
    PERMISO_DELETE_PROYECTO as can_delete_permiso,
    PERMISO_VALOR_PROYECTO as can_valor_proyecto_permiso,
    PERMISO_COSTO_PROYECTO as can_costo_proyecto_permiso,
    PERMISO_COSTO_PRESUPUESTADO_PROYECTO as can_costo_presupuestado_proyecto_permiso,
    PERMISO_COSTO_MATERIALES_PROYECTO as can_costo_materiales_proyecto_permiso,
    PERMISO_COSTO_MANO_OBRA_PROYECTO as can_costo_mano_obra_proyectos_permiso

} from "../../../../../00_utilities/permisos/types";

import CreateForm from '../components/forms/proyecto_form';
import {ContainerNuevoButton} from '../../../../../00_utilities/components/ui/icon/iconos';

import Tabla from '../../proyectos/proyectos/components/proyecto_tabla';

class ProyectosList extends Component {
    constructor(props) {
        super(props);

        this.state = ({
            item_seleccionado: null,
            modal_open: false
        });

        this.error_callback = this.error_callback.bind(this);
        this.notificar = this.notificar.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);

        this.cargarDatos = this.cargarDatos.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    handleModalClose() {
        this.setState({modal_open: false})
    }

    handleModalOpen() {
        this.setState({modal_open: true})
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    onSelectItem(item) {
        this.setState({item_seleccionado: item})
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    componentWillUnmount() {
        this.props.clearProyectos()
    }

    cargarDatos() {
        this.props.cargando();
        const cargarProyectos = () => this.props.fetchProyectos(() => this.props.noCargando(), this.error_callback);
        const cargarMiCuenta = () => this.props.fetchMiCuenta(cargarProyectos, this.error_callback);
        this.props.fetchMisPermisos(cargarMiCuenta, this.error_callback)
    }

    onSubmit(item) {
        const {id_proyecto} = item;
        const success_callback = () => {
            this.props.noCargando();
            this.notificar(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito el proyecto ${id_proyecto}`);
            this.handleModalClose();
            this.setState({item_seleccionado: null});
        };
        this.props.cargando();
        if (item.id) {
            this.props.updateProyecto(item.id, item, success_callback, this.error_callback);
        } else {
            this.props.createProyecto(item, success_callback, this.error_callback);
        }
    }

    onDelete(item) {
        this.setState({item_seleccionado: null});
        const success_callback = () => {
            this.props.noCargando();
            this.notificar(`Se ha eliminado con éxito el proyecto ${item.id_proyecto}`)
        };
        this.props.cargando();
        this.props.deleteProyecto(item.id, success_callback, this.error_callback)
    }

    render() {
        const {object_list, mi_cuenta, mis_permisos} = this.props;
        const {item_seleccionado, modal_open} = this.state;

        const can_add = tengoPermiso(mis_permisos, can_add_permiso);
        const can_detail = tengoPermiso(mis_permisos, can_detail_permiso);
        const can_change = tengoPermiso(mis_permisos, can_change_permiso);
        const can_delete = tengoPermiso(mis_permisos, can_delete_permiso);
        const can_list = tengoPermiso(mis_permisos, can_list_permiso);
        const can_see_costo_mano_obra = tengoPermiso(mis_permisos, can_costo_mano_obra_proyectos_permiso);
        const can_see_costo_materiales = tengoPermiso(mis_permisos, can_costo_materiales_proyecto_permiso);
        const can_see_costo_presupuestado = tengoPermiso(mis_permisos, can_costo_presupuestado_proyecto_permiso);
        const can_see_precio = tengoPermiso(mis_permisos, can_valor_proyecto_permiso);
        const can_see_costo_total = tengoPermiso(mis_permisos, can_costo_proyecto_permiso);

        return (
            <ValidarPermisos can_see={can_list} nombre='listas de proyectos'>
                <CreateForm
                    onCancel={this.onCancel}
                    item_seleccionado={item_seleccionado}
                    onSubmit={this.onSubmit}
                    handleClose={this.handleModalClose}
                    modal_open={modal_open}
                    cantidad_literales={item_seleccionado ? item_seleccionado.mis_literales.length : 0}
                    can_see_costo_presupuestado={can_see_costo_presupuestado}
                    can_see_precio={can_see_precio}
                />
                <Titulo>Lista de proyectos</Titulo>
                {can_add && <ContainerNuevoButton
                    onClick={() => {
                        this.setState({item_seleccionado: null});
                        this.handleModalOpen();
                    }}
                />}
                <Tabla
                    data={_.map(object_list, e => e)}
                    mi_cuenta={mi_cuenta}
                    can_delete={can_delete}
                    can_detail={can_detail}
                    can_change={can_change}
                    can_see_costo_mano_obra={can_see_costo_mano_obra}
                    can_see_costo_presupuestado={can_see_costo_presupuestado}
                    can_see_precio={can_see_precio}
                    can_see_costo_materiales={can_see_costo_materiales}
                    can_see_costo_total={can_see_costo_total}
                    onDelete={this.onDelete}
                    updateItem={this.onSubmit}
                    onSelectItem={this.onSelectItem}
                    handleOpen={this.handleModalOpen}
                />

                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        mi_cuenta: state.mi_cuenta,
        object_list: state.proyectos
    }
}

export default connect(mapPropsToState, actions)(ProyectosList)