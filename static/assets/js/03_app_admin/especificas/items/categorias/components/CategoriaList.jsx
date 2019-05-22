import React, {Component} from 'react';
import CreateForm from './forms/CategoriaForm';
import Tabla from './CategoriaTabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchCategoriaProducto,
            deleteObjectMethod: this.props.deleteCategoriaProducto,
            createObjectMethod: this.props.createCategoriaProducto,
            updateObjectMethod: this.props.updateCategoriaProducto,
        };
        this.plural_name = 'Categorías';
        this.singular_name = 'Categoría';
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                con_titulo={false}
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