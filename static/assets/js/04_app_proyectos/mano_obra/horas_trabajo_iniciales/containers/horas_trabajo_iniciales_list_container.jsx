import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    HORAS_COLABORADORES_PROYECTOS_INICIALES as permisos_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import CreateForm from '../components/forms/base_form';
import Tabla from '../components/hora_trabajo_iniciales_tabla';
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
        this.props.clearHorasColaboradoresProyectosIniciales();
        this.props.clearProyectos();
        this.props.clearColaboradores();
        this.props.clearCentrosCostosColaboradores();
        this.props.clearLiterales();
    }

    cargarDatos() {
        this.props.fetchHorasColaboradoresProyectosIniciales();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const bloque_1_permisos = permisosAdapter(permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchHoraColaboradorProyectoInicial,
            deleteObjectMethod: this.props.deleteHoraColaboradorProyectoInicial,
            createObjectMethod: this.props.createHoraColaboradorProyectoInicial,
            updateObjectMethod: this.props.updateHoraColaboradorProyectoInicial,
        };
        return (
            <Fragment>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={bloque_1_permisos}
                    plural_name='Horas Colaboradores Proyectos Iniciales'
                    singular_name='Hora Colaborador Proyecto Inicial'
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
        object_list: state.horas_colaboradores_proyectos_iniciales,
        colaboradores_list: state.colaboradores,
        centros_costos_list: state.centros_costos_colaboradores,
        literales_list: state.literales,
        proyectos_list: state.proyectos,
    }
}

export default connect(mapPropsToState, actions)(List)