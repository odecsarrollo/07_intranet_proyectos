import React, {Component} from 'react';
import CreateForm from './forms/canales_form';
import Tabla from './canales_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchCanalDistribucion,
            deleteObjectMethod: this.props.deleteCanalDistribucion,
            createObjectMethod: this.props.createCanalDistribucion,
            updateObjectMethod: this.props.updateCanalDistribucion,
        };
        this.plural_name = 'Canales';
        this.singular_name = 'Canal';
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