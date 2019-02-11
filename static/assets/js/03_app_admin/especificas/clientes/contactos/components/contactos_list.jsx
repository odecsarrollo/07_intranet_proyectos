import React, {Component} from 'react';
import CreateForm from '../components/forms/contacto_form';
import Tabla from '../components/contactos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


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
        const cargarContactos = this.props.fetchContactosClientes_por_cliente(id);
        this.props.fetchMisPermisos({callback: cargarContactos})
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