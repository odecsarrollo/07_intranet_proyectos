import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    USUARIOS as permisos_view_groups
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import CreateForm from '../components/forms/usuarios_form';
import Tabla from '../components/usuarios_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';

const CRUD = crudHOC(CreateForm, Tabla);


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearUsuarios()
    }

    cargarDatos() {
        const cargarUsuarios = () => this.props.fetchUsuarios();
        const cargarMiCuenta = this.props.fetchMiCuenta({callback: cargarUsuarios});
        this.props.fetchMisPermisos({callback: cargarMiCuenta})
    }

    render() {
        const {object_list, mis_permisos, mi_cuenta} = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view_groups);
        const method_pool = {
            fetchObjectMethod: this.props.fetchUsuario,
            deleteObjectMethod: this.props.deleteUsuario,
            createObjectMethod: this.props.createUsuario,
            updateObjectMethod: this.props.updateUsuario,
        };

        return (
            <Fragment>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    mi_cuenta={mi_cuenta}
                    permisos_object={permisos_object}
                    plural_name='Usuarios'
                    singular_name='Usuario'
                    {...this.props}
                />
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </Fragment>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        mi_cuenta: state.mi_cuenta,
        object_list: state.usuarios
    }
}

export default connect(mapPropsToState, actions)(List)