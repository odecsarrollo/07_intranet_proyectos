import React, {Component} from 'react';
import CreateForm from './forms/CategoriaDosForm';
import Tabla from './CategoriaDosTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchBandaEurobeltCategoria,
            deleteObjectMethod: this.props.deleteBandaEurobeltCategoria,
            createObjectMethod: this.props.createBandaEurobeltCategoria,
            updateObjectMethod: this.props.updateBandaEurobeltCategoria,
        };
        this.plural_name = 'Categorias';
        this.singular_name = 'Categoria';
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