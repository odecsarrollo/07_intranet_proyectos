import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    COTIZACIONES as permisos_view,
    PROYECTOS as proyectos_permisos_view,
} from "../../../../00_utilities/permisos/types";
import {permisosAdapterDos} from "../../../../00_utilities/common";

import CreateForm from '../components/forms/cotizacion_form';
import Tabla from '../components/tuberia_ventas_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";

const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.plural_name = 'Panel Ventas';
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                permisos_view,
                proyectos_permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    componentWillUnmount() {
        this.props.clearCotizaciones();
    }

    cargarDatos() {
        this.props.fetchCotizacionesTuberiaVentas();

    }

    render() {
        const {mis_permisos, object_list} = this.props;

        const cotizaciones_permisos = permisosAdapterDos(mis_permisos, permisos_view);
        const proyectos_permisos = permisosAdapterDos(mis_permisos, proyectos_permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchCotizacion,
            deleteObjectMethod: this.props.deleteCotizacion,
            createObjectMethod: this.props.createCotizacion,
            updateObjectMethod: this.props.updateCotizacion,
        };
        const can_see =
            proyectos_permisos.list ||
            cotizaciones_permisos.list ||
            cotizaciones_permisos.list_tuberia_ventas;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
            <Fragment>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={{...cotizaciones_permisos, list: cotizaciones_permisos.list_tuberia_ventas}}
                    proyectos_permisos={proyectos_permisos}
                    plural_name='Tuberia Ventas'
                    singular_name='Tuberia Venta'
                    {...this.props}
                />
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </Fragment>
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        object_list: state.cotizaciones,
        contactos_list: state.clientes_contactos,
        clientes_list: state.clientes,
    }
}

export default connect(mapPropsToState, actions)(List)