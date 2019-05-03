import React, {Component} from 'react';
import CreateForm from './forms/forma_pago_form';
import Tabla from './forma_pago_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchFormaPago,
            deleteObjectMethod: this.props.deleteFormaPago,
            createObjectMethod: this.props.createFormaPago,
            updateObjectMethod: this.props.updateFormaPago,
        };
        this.plural_name = 'Forma de Pago Canal';
        this.singular_name = 'Formas de Pagos Canales';
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