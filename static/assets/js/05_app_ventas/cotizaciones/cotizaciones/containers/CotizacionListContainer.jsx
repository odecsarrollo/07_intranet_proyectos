import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {
    COTIZACIONES as permisos_view,
    PROYECTOS as proyectos_permisos_view,
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";
import Tabla from '../components/CotizacionTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';

const CRUD = crudHOC(null, Tabla);


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.plural_name = 'Cotizaciones';
        this.singular_name = 'Cotizacion';
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearCotizaciones();
    }

    cargarDatos() {
        this.props.fetchCotizaciones();

    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const cotizaciones_permisos = permisosAdapter(permisos_view);
        const proyectos_permisos = permisosAdapter(proyectos_permisos_view);
        const method_pool = {
            fetchObjectMethod: this.props.fetchCotizacion,
            deleteObjectMethod: this.props.deleteCotizacion,
            createObjectMethod: this.props.createCotizacion,
            updateObjectMethod: this.props.updateCotizacion,
        };

        return (
            <Fragment>
                <CRUD
                    method_pool={method_pool}
                    list={object_list}
                    permisos_object={{...cotizaciones_permisos, add: false}}
                    proyectos_permisos={proyectos_permisos}
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
        object_list: state.cotizaciones,
        contactos_list: state.clientes_contactos,
        clientes_list: state.clientes,
    }
}

export default connect(mapPropsToState, actions)(List)