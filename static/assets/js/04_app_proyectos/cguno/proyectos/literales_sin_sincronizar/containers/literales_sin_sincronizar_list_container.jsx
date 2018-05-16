import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {
    LITERALES as permisos_view,
    PROYECTOS as proyectos_permisos_view,
    COTIZACIONES as cotizaciones_permisos_view,
} from "../../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../../00_utilities/common";

import ListCrud from '../components/literales_sin_sincronizar_list';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearLiterales();
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarLiterales = () => this.props.fetchLiteralesSinSincronizar(() => noCargando(), notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarLiterales, notificarErrorAjaxAction)

    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const literales_permisos = permisosAdapter(mis_permisos, permisos_view);
        const proyectos_permisos = permisosAdapter(mis_permisos, proyectos_permisos_view);
        const cotizaciones_permisos = permisosAdapter(mis_permisos, cotizaciones_permisos_view);
        return (
            <Fragment>
                <ListCrud
                    object_list={object_list}
                    permisos_cotizaciones={cotizaciones_permisos}
                    permisos_proyectos={proyectos_permisos}
                    permisos_object={{
                        list: true,
                        change: false,
                        delete: false,
                        add: false
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
        object_list: state.literales
    }
}

export default connect(mapPropsToState, actions)(List)