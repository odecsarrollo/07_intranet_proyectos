import React, {Component} from 'react';
import CreateForm from './forms/ContactoForm';
import Tabla from './ContactoTabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';
import {CLIENTES as permisos_view} from "../../../../../00_utilities/permisos/types";


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.plural_name = 'Contactos';
        this.singular_name = 'Contacto';
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearContactosClientes();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        this.props.fetchContactosClientes_por_cliente(id);
    }

    render() {
        const {object_list, permisos_object} = this.props;
        const method_pool = {
            fetchObjectMethod: this.props.fetchContactoCliente,
            deleteObjectMethod: this.props.deleteContactoCliente,
            createObjectMethod: this.props.createContactoCliente,
            updateObjectMethod: this.props.updateContactoCliente,
        };
        return (
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
                {...this.props}
            />
        )
    }
}

export default List;