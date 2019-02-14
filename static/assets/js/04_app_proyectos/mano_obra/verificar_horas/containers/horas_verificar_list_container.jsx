import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    MANOS_OBRAS_HORAS_HOJAS_TRABAJOS as permisos_view,
    MANOS_OBRAS_HOJAS_TRABAJOS as permisos_view_hoja,
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import RangoFechas from "../../../../00_utilities/calendariosRangosFiltro";

import CreateForm from '../../hojas_trabajo/components/forms/hora_hoja_trabajo_form';
import Tabla from '../components/horas_verificar_tabla';
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
        this.props.clearHorasHojasTrabajos();
    }

    cargarDatos() {
        const cargarProyectos = () => this.props.fetchProyectosAbiertos();
        const cargarHorasHojasTrabajo = () => this.props.fetchHorasHojasTrabajosAutogestionadas({callback: cargarProyectos});
        this.props.fetchConfiguracionesCostos({callback: cargarHorasHojasTrabajo});
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const bloque_1_permisos = permisosAdapter(permisos_view);
        const permisos_hoja = permisosAdapter(permisos_view_hoja);
        const method_pool = {
            fetchObjectMethod: this.props.fetchHoraHojaTrabajo,
            deleteObjectMethod: this.props.deleteHoraHojaTrabajo,
            createObjectMethod: this.props.createHoraHojaTrabajo,
            updateObjectMethod: this.props.updateHoraHojaTrabajo,
        };
        return (
            <Fragment>
                <RangoFechas metodoBusquedaFechas={(i, f) => {
                    this.props.fetchHorasHojasTrabajosAutogestionadasxFechas(i, f);
                }}/>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    permisos_hoja={permisos_hoja}
                    permisos_object={{...bloque_1_permisos, list: bloque_1_permisos.verificar, add: false}}
                    plural_name='Verificar'
                    singular_name='Verificar'
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
        object_list: state.horas_hojas_trabajos,
        colaboradores_list: state.colaboradores,
        proyectos_list: state.proyectos,
        mi_cuenta: state.mi_cuenta,
        configuracion_costos: _.map(state.configuracion_costos, c => c)[0],
    }
}

export default connect(mapPropsToState, actions)(List)