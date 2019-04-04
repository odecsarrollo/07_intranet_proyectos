import React, {Component} from 'react';
import CreateForm from './forms/paises_form';
import Tabla from './paises_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchPais,
            deleteObjectMethod: this.props.deletePais,
            createObjectMethod: this.props.createPais,
            updateObjectMethod: this.props.updatePais,
        };
        this.plural_name = 'Paises';
        this.singular_name = 'Pais';
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