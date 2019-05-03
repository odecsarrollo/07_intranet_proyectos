import React, {Component} from 'react';
import CreateForm from './forms/monedas_form';
import Tabla from './monedas_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchMonedaCambio,
            deleteObjectMethod: this.props.deleteMonedaCambio,
            createObjectMethod: this.props.createMonedaCambio,
            updateObjectMethod: this.props.updateMonedaCambio,
        };
        this.plural_name = 'Monedas de Cambio';
        this.singular_name = 'Moneda de Cambio';
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