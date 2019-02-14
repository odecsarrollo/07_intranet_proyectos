import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {FASES as permisos_view} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import CreateForm from '../components/forms/fase_form';
import Tabla from '../components/fases_tabla';
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
        this.props.clearFases();
    }

    cargarDatos() {
        this.props.fetchFases();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_object = permisosAdapter(permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchFase,
            deleteObjectMethod: this.props.deleteFase,
            createObjectMethod: this.props.createFase,
            updateObjectMethod: this.props.updateFase,
        };
        return (
            <Fragment>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={permisos_object}
                    plural_name='Fases'
                    singular_name='Fase'
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
        auth: state.auth,
        object_list: state.fases
    }
}

export default connect(mapPropsToState, actions)(List)