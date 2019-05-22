import React, {Component} from 'react';
import CreateForm from './forms/MargenForm';
import Tabla from './MargenTabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchMargenProvedor,
            deleteObjectMethod: this.props.deleteMargenProvedor,
            createObjectMethod: this.props.createMargenProvedor,
            updateObjectMethod: this.props.updateMargenProvedor,
        };
        this.plural_name = 'Margenes x Proveedores x Categorías';
        this.singular_name = 'Margen x Proveedor x Categoría';
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