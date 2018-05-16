import React, {Component} from 'react';
import CreateForm from './forms/proyectos_sin_sincronizar_form';
import Tabla from './literales_sin_sincronizar_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.fetchObjectMethod.bind(this),
            deleteObjectMethod: this.deleteObjectMethod.bind(this),
            createObjectMethod: this.createObjectMethod.bind(this),
            updateObjectMethod: this.updateObjectMethod.bind(this),
        };
        this.plural_name = 'Literales sin Sincronizar';
        this.singular_name = 'Literal sin Sincronizar';
    }

    successSubmitCallback(item) {

    }


    successDeleteCallback(item) {

    }

    fetchObjectMethod(item_id, successCallback) {

    }

    createObjectMethod(item, successCallback) {

    }

    updateObjectMethod(item, successCallback) {

    }

    deleteObjectMethod(item, successCallback) {

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