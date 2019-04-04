import React, {Component} from 'react';
import CreateForm from './forms/departamentos_form';
import Tabla from './departamentos_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchDepartamento,
            deleteObjectMethod: this.props.deleteDepartamento,
            createObjectMethod: this.props.createDepartamento,
            updateObjectMethod: this.props.updateDepartamento,
        };
        this.plural_name = 'Departamentos';
        this.singular_name = 'Departamento';
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