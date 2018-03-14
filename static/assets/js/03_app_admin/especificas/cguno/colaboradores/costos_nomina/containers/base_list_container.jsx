import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {
    COLABORADORES_COSTOS_MESES as permisos_view
} from "../../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../../00_utilities/common";
import CalendarioRangosFiltro from '../../../../../../00_utilities/calendariosRangosFiltro';

import ListCrud from '../components/base_list';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.consultarPorFecha = this.consultarPorFecha.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearColaboradoresCostosMeses();
    }

    consultarPorFecha(fecha_inicial, fecha_final) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.fetchColaboradoresCostosMesesxFechas(fecha_inicial, fecha_final, () => noCargando(), notificarErrorAjaxAction);
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarCentrosCostos = () => this.props.fetchCentrosCostosColaboradores(() => noCargando(), notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarCentrosCostos, notificarErrorAjaxAction)
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const bloque_1_list = permisosAdapter(mis_permisos, permisos_view);
        return (
            <Fragment>
                <CalendarioRangosFiltro metodoBusquedaFechas={this.consultarPorFecha} className='col-12'/>
                <ListCrud
                    object_list={object_list}
                    permisos_object={bloque_1_list}
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
        object_list: state.colaboradores_costos_nomina,
        centros_costos_list: state.centros_costos_colaboradores,
    }
}

export default connect(mapPropsToState, actions)(List)