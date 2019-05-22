import React, {Component} from 'react';
import CreateForm from './forms/MaterialForm';
import Tabla from './MaterialTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchBandaEurobeltMaterial,
            deleteObjectMethod: this.props.deleteBandaEurobeltMaterial,
            createObjectMethod: this.props.createBandaEurobeltMaterial,
            updateObjectMethod: this.props.updateBandaEurobeltMaterial,
        };
        this.plural_name = 'Materiales';
        this.singular_name = 'Material';
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