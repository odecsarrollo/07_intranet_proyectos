import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    LITERALES as permisos_view
} from "../../../../permisos";
import {permisosAdapterDos} from "../../../../00_utilities/common";
import Tabla from '../components/consecutivo_proyectos_tabla';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    componentWillUnmount() {
        this.props.clearLiterales();
    }

    cargarDatos() {
        this.props.fetchLiterales();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const bloque_1_permisos = permisosAdapterDos(mis_permisos, permisos_view);
        return (
            <Fragment>
                <Tabla
                    data={_.map(_.orderBy(object_list, ['abierto', 'id_literal'], ['desc', 'desc']), e => e)}
                    singular_name='Consecutivos Proyectos'
                    permisos_object={bloque_1_permisos}
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
        object_list: state.literales
    }
}

export default connect(mapPropsToState, actions)(List)