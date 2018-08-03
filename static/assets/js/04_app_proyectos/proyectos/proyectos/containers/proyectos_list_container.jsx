import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    PROYECTOS as permisos_view,
    COTIZACIONES as cotizaciones_permisos_view,
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";

import ListCrud from '../components/proyectos_list';

import CotizacionAbrirCarpetaLista from '../components/contizaciones_abrir_carpetas_list';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearProyectos();
        this.props.clearCotizaciones();
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarCotizacionesParaCarpetas = () => this.props.fetchCotizacionesPidiendoCarpeta(() => noCargando(), notificarErrorAjaxAction);
        const cargarProyectos = () => this.props.fetchProyectos(cargarCotizacionesParaCarpetas, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarProyectos, notificarErrorAjaxAction)

    }

    render() {
        const {object_list, mis_permisos, cotizaciones_list} = this.props;
        const permisos_proyectos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_cotizaciones = permisosAdapter(mis_permisos, cotizaciones_permisos_view);
        const cotizaciones_list_2 = _.map(cotizaciones_list, c => {
            if (c.crear_literal) {
                const proyectos = _.map(_.pickBy(object_list, p => {
                    return p.id_proyecto === c.crear_literal_id_proyecto
                }), e => e);
                if (proyectos.length > 0) {
                    return {...c, mi_proyecto: proyectos[0].id}
                }
            }
            return c
        });

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
                <ListCrud
                    object_list={_.orderBy(object_list,['id_proyecto'],['desc'])}
                    permisos_cotizaciones={permisos_cotizaciones}
                    permisos_object={permisos_proyectos}
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