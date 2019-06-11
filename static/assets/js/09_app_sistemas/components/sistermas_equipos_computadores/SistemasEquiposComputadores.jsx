import React, {Component} from 'react';
import Tabla from '../01_tabla/computadores_tabla';
import {connect} from 'react-redux'
import * as actions from '../../../01_actions/01_index';
import CreateForm from '../00_forms/computadores_form';
import crudHOC from '../../../00_utilities/components/hoc_crud';
import {
    SISTEMAS_EQUIPOS_COMPUTADORES as computadores_permisos_view,

} from "../../../00_utilities/permisos/types";

import {permisosAdapterDos} from "../../../00_utilities/common";
const CRUD = crudHOC(CreateForm, Tabla);

class EquiposComputadoresSistemas extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this)
        this.plural_name = 'Computadores';
        this.singular_name = 'Computador';

        this.method_pool = {
            fetchObjectMethod: this.props.fetchSistemasEquipoComputador,
            deleteObjectMethod: this.props.deleteSistemasEquipoComputador,
            createObjectMethod: this.props.createSistemasEquipoComputador,
            updateObjectMethod: this.props.updateSistemasEquipoComputador,
        };

    }

    componentDidMount() {
        console.log("props",this.props)
        this.props.fetchMisPermisosxListado(
            [
               computadores_permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    cargarDatos(){
        this.props.fetchSistemasEquiposComputadores();
    }
    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_computadores = permisosAdapterDos(mis_permisos, computadores_permisos_view)

        return (
            <CRUD
                method_pool={this.method_pool}
                list={object_list}
                permisos_object={permisos_computadores}
                plural_name={this.plural_name}
                singular_name = {this.singular_name}
                {...this.props}
            />
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        object_list: state.sistemas_equipos_computadores
    }
}

export default connect(mapPropsToState, actions)(EquiposComputadoresSistemas);