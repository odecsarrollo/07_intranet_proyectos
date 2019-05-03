import React, {Component} from 'react';
import CreateForm from './forms/proveedores_form';
import Tabla from './proveedores_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchProveedorImportacion,
            deleteObjectMethod: this.props.deleteProveedorImportacion,
            createObjectMethod: this.props.createProveedorImportacion,
            updateObjectMethod: this.props.updateProveedorImportacion,
        };
        this.plural_name = 'Proveedores';
        this.singular_name = 'Proveedor';
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                method_pool={this.method_pool}
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