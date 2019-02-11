import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import RangoFechas from "../../../../00_utilities/calendariosRangosFiltro";
import {
    MANOS_OBRAS_HOJAS_TRABAJOS as permisos_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import CreateForm from '../components/forms/hoja_trabajo_form';
import Tabla from '../components/hojas_trabajos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

import moment from "moment/moment";

class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.createHojaTrabajo = this.createHojaTrabajo.bind(this);
        this.plural_name = 'Hojas de Trabajo';
        this.singular_name = 'Hoja de Trabajo';
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
        const date_today = moment(new Date());
        const today = date_today.format('YYYY-MM-DD');
        const cargarMiCuenta = () => this.props.fetchMiCuenta();
        const cargarHojasTrabajoHoy = () => this.props.fetchHojasTrabajosxFechas(today, today, {callback: cargarMiCuenta});
        const cargarConfigCostos = () => this.props.fetchConfiguracionesCostos({callback: cargarHojasTrabajoHoy});
        const cargarColaboradores = () => this.props.fetchColaboradoresEnProyectos({callback: cargarConfigCostos});
        this.props.tengoMisPermisosxListado([permisos_view],{callback: cargarColaboradores})

    }

    createHojaTrabajo(item) {
        const {history} = this.props;
        const callback = (response) => {
            history.push(`/app/proyectos/mano_obra/hojas_trabajo/detail/${response.id}`);
        };
        this.props.createHojaTrabajo(item, {callback});
    }


    render() {
        const {
            object_list,
            mis_permisos
        } = this.props;

        const permisos = permisosAdapter(mis_permisos, permisos_view);

        const method_pool = {
            fetchObjectMethod: this.props.fetchHojaTrabajo,
            deleteObjectMethod: this.props.deleteHojaTrabajo,
            createObjectMethod: this.createHojaTrabajo,
            updateObjectMethod: this.props.updateHojaTrabajo,
        };

        return (
            <Fragment>
                <RangoFechas metodoBusquedaFechas={(i, f) => {
                    this.props.fetchHojasTrabajosxFechas(i, f);
                }}/>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
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
                    plural_name={this.plural_name}
                    singular_name={this.singular_name}
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