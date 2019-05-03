import React, {Component} from 'react';
import CreateForm from './forms/tipos_form';
import Tabla from './tipos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchBandaEurobeltTipo,
            deleteObjectMethod: this.props.deleteBandaEurobeltTipo,
            createObjectMethod: this.props.createBandaEurobeltTipo,
            updateObjectMethod: this.props.updateBandaEurobeltTipo,
        };
        this.plural_name = 'Tipos';
        this.singular_name = 'Tipo';
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