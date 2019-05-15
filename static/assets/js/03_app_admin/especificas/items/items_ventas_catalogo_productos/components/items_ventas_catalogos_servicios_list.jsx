import React, {Component} from 'react';
import CreateForm from './forms/items_ventas_catalogos_servicios_form';
import Tabla from './items_ventas_catalogos_servicios_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchItemVentaCatalogo,
            deleteObjectMethod: this.props.deleteItemVentaCatalogo,
            createObjectMethod: this.props.createItemVentaCatalogo,
            updateObjectMethod: this.props.updateItemVentaCatalogo,
        };
        this.plural_name = 'Items Ventas';
        this.singular_name = 'Item Venta';
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