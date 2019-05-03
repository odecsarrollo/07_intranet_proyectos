import React, {Component} from 'react';
import CreateForm from './forms/colores_form';
import Tabla from './colores_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchBandaEurobeltColor,
            deleteObjectMethod: this.props.deleteBandaEurobeltColor,
            createObjectMethod: this.props.createBandaEurobeltColor,
            updateObjectMethod: this.props.updateBandaEurobeltColor,
        };
        this.plural_name = 'Colores';
        this.singular_name = 'Color';
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