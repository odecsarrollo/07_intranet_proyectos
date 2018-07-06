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

import ListCrud from '../components/horas_verificar_list';


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
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarProyectos = () => this.props.fetchProyectosAbiertos(() => noCargando(), notificarErrorAjaxAction);
        const cargarHorasHojasTrabajo = () => this.props.fetchHorasHojasTrabajosAutogestionadas(cargarProyectos, notificarErrorAjaxAction);
        const cargarConfigCostos = () => this.props.fetchConfiguracionesCostos(cargarHorasHojasTrabajo, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarConfigCostos, notificarErrorAjaxAction)

    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const bloque_1_permisos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_hoja = permisosAdapter(mis_permisos, permisos_view_hoja);
        return (
            <Fragment>
                <RangoFechas metodoBusquedaFechas={(i, f) => {
                    const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
                    cargando();
                    this.props.fetchHorasHojasTrabajosAutogestionadasxFechas(i, f, () => noCargando(), notificarErrorAjaxAction);
                }}/>
                <ListCrud
                    object_list={object_list}
                    permisos_hoja={permisos_hoja}
                    permisos_object={{...bloque_1_permisos, list: bloque_1_permisos.verificar, add: false}}
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