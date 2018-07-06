import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import RangoFechas from "../../../../00_utilities/calendariosRangosFiltro";
import {
    MANOS_OBRAS_HOJAS_TRABAJOS as permisos_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";

import ListCrud from '../components/hojas_trabajos_list';
import moment from "moment/moment";

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
        this.props.clearHorasHojasTrabajos();
        this.props.clearColaboradores();
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const date_today = moment(new Date());
        const today = date_today.format('YYYY-MM-DD');
        const cargarHojasTrabajoHoy = () => this.props.fetchHojasTrabajosxFechas(today, today, () => noCargando(), notificarErrorAjaxAction);
        const cargarMiCuenta = () => this.props.fetchMiCuenta(cargarHojasTrabajoHoy, notificarErrorAjaxAction);
        const cargarConfigCostos = () => this.props.fetchConfiguracionesCostos(cargarMiCuenta, notificarErrorAjaxAction)
        const cargarColaboradores = () => this.props.fetchColaboradoresEnProyectos(cargarConfigCostos, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarColaboradores, notificarErrorAjaxAction)

    }

    render() {
        const {
            object_list,
            mis_permisos,
            mi_cuenta,
        } = this.props;

        const permisos = permisosAdapter(mis_permisos, permisos_view);
        return (
            <Fragment>
                <RangoFechas metodoBusquedaFechas={(i, f) => {
                    const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
                    cargando();
                    this.props.fetchHojasTrabajosxFechas(i, f, () => noCargando(), notificarErrorAjaxAction);
                }}/>
                <ListCrud
                    object_list={object_list}
                    permisos_object={{
                        ...permisos,
                        add:
                            (
                                permisos.add &&
                                (
                                    permisos.add_para_otros ||
                                    (
                                        mi_cuenta.colaborador &&
                                        mi_cuenta.colaborador.autogestion_horas_trabajadas
                                    )
                                )
                            )
                    }}
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
        object_list: state.hojas_trabajos_diarios,
        colaboradores_list: state.colaboradores,
        mi_cuenta: state.mi_cuenta,
        proyectos_list: state.proyectos,
        configuracion_costos: _.map(state.configuracion_costos, c => c)[0],
    }
}

export default connect(mapPropsToState, actions)(List)