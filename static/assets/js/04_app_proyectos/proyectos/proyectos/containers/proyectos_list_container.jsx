import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    PROYECTOS as permisos_view,
    COTIZACIONES as cotizaciones_permisos_view,
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import CreateForm from '../components/forms/proyectos_modal_form';
import Tabla from '../components/proyectos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';

const CRUD = crudHOC(CreateForm, Tabla);

import CotizacionAbrirCarpetaLista from '../components/contizaciones_abrir_carpetas_list';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.plural_name = 'Proyectos';
        this.singular_name = 'Proyecto';
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearProyectos();
        this.props.clearCotizaciones();
    }

    cargarDatos() {
        const cargarCotizacionesParaCarpetas = () => this.props.fetchCotizacionesPidiendoCarpeta();
        const cargarProyectos = () => this.props.fetchProyectos({callback: cargarCotizacionesParaCarpetas});
        this.props.fetchMisPermisos({callback: cargarProyectos})

    }

    render() {
        const {object_list, mis_permisos, cotizaciones_list} = this.props;
        const permisos_proyectos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_cotizaciones = permisosAdapter(mis_permisos, cotizaciones_permisos_view);
        const cotizaciones_list_2 = _.map(cotizaciones_list, c => {
            if (c.crear_literal) {
                const proyectos = _.map(_.pickBy(object_list, p => {
                    return p.id === parseInt(c.crear_literal_id_proyecto)
                }), e => e);
                if (proyectos.length > 0) {
                    return {...c, mi_proyecto: proyectos[0].id, mi_proyecto_id_proyecto: proyectos[0].id_proyecto}
                }
            }
            return c
        });

        const method_pool = {
            fetchObjectMethod: this.props.fetchProyecto,
            deleteObjectMethod: this.props.deleteProyecto,
            createObjectMethod: this.props.createProyecto,
            updateObjectMethod: this.props.updateProyecto,
        };

        return (
            <Fragment>
                <CotizacionAbrirCarpetaLista
                    lista={cotizaciones_list_2}
                    {...this.props}
                    permisos_object={{
                        ...permisos_proyectos,
                        add: false,
                        delete: false,
                        change: true,
                        list: true
                    }}
                />

                <CRUD
                    method_pool={method_pool}
                    list={_.orderBy(object_list, ['id_proyecto'], ['desc'])}
                    permisos_cotizaciones={permisos_cotizaciones}
                    permisos_object={permisos_proyectos}
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
        object_list: state.proyectos,
        cotizaciones_list: state.cotizaciones
    }
}

export default connect(mapPropsToState, actions)(List)