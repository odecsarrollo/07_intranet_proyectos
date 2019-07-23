import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../permisos/validar_permisos";
import {permisosAdapterDos} from "../../../../../00_utilities/common";
import {
    CLIENTES as permisos_view,
    CONTACTOS_CLIENTES as contactos_permisos_view,
} from "../../../../../permisos";

import ListCrud from '../../contactos/components/ContactoList';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                permisos_view,
                contactos_permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearClientes();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarContactos = () => this.props.fetchContactosClientes_por_cliente(id);
        this.props.fetchCliente(id, {callback: cargarContactos});

    }

    render() {
        const {object, contactos, mis_permisos} = this.props;
        const permisos = permisosAdapterDos(mis_permisos, permisos_view);
        const permisos_contactos = permisosAdapterDos(mis_permisos, contactos_permisos_view);

        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de cliente'>
                <Titulo>Detalle {object.nombre}</Titulo>
                <ListCrud
                    object_list={contactos}
                    permisos_object={permisos_contactos}
                    {...this.props}
                />
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        contactos: state.clientes_contactos,
        object: state.clientes[id]
    }
}

export default connect(mapPropsToState, actions)(Detail)