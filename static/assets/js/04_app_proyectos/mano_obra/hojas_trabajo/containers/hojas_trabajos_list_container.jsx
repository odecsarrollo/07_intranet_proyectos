import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    MANOS_OBRAS_HOJAS_TRABAJOS as permisos_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";

import ListCrud from '../components/hojas_trabajos_list';

class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearHojasTrabajos();
        this.props.clearColaboradores();
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarColaboradores = () => this.props.fetchColaboradoresEnProyectos(() => noCargando(), notificarErrorAjaxAction)
        const cargarHojasTrabajos = () => this.props.fetchHojasTrabajos(cargarColaboradores, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarHojasTrabajos, notificarErrorAjaxAction)

    }

    render() {
        const {object_list, colaboradores_list, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        return (
            <Fragment>
                <ListCrud
                    object_list={object_list}
                    permisos_object={permisos}
                    {...this.props}
                    colaboradores_list={colaboradores_list}
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
        object_list: state.hojas_trabajos_diarios,
        colaboradores_list: state.colaboradores,
    }
}

export default connect(mapPropsToState, actions)(List)