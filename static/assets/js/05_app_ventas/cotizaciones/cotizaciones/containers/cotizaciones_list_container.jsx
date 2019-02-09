import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    COTIZACIONES as permisos_view,
    PROYECTOS as proyectos_permisos_view,
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";

import ListCrud from '../components/cotizaciones_list';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearCotizaciones();
    }

    cargarDatos() {
        const cargarCotizaciones = () => this.props.fetchCotizaciones();
        this.props.fetchMisPermisos({callback:cargarCotizaciones})

    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const cotizaciones_permisos = permisosAdapter(mis_permisos, permisos_view);
        const proyectos_permisos = permisosAdapter(mis_permisos, proyectos_permisos_view);
        return (
            <Fragment>
                <ListCrud
                    object_list={object_list}
                    permisos_object={{...cotizaciones_permisos, add: false}}
                    proyectos_permisos={proyectos_permisos}
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
        object_list: state.cotizaciones,
        contactos_list: state.clientes_contactos,
        clientes_list: state.clientes,
    }
}

export default connect(mapPropsToState, actions)(List)