import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import {
    CLIENTES as permisos_view
} from "../../../../../00_utilities/permisos/types";

import ListCrud from '../../contactos/components/contactos_list';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearClientes();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = () => {
            noCargando();
        };
        const cargarContactos = () => this.props.fetchContactosClientes_por_cliente(id, success_callback, notificarErrorAjaxAction);
        const cargarCliente = () => this.props.fetchCliente(id, cargarContactos, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarCliente, notificarErrorAjaxAction);

    }

    render() {
        const {object, contactos, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);

        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de cliente'>
                <Titulo>Detalle {object.nombre}</Titulo>
                <ListCrud
                    object_list={contactos}
                    permisos_object={permisos}
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