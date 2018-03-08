import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    USUARIOS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";

import ListCrud from '../components/usuarios_list';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearUsuarios();
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarUsuarios = () => this.props.fetchUsuarios(() => noCargando(), notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarUsuarios, notificarErrorAjaxAction)

    }

    render() {
        const {object_list, mis_permisos, mi_cuenta} = this.props;
        const bloque_1_list = permisosAdapter(mis_permisos, permisos_view);
        return (
            <Fragment>
                <ListCrud
                    object_list={object_list}
                    permisos_object={bloque_1_list}
                    {...this.props}
                    mi_cuenta={mi_cuenta}
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