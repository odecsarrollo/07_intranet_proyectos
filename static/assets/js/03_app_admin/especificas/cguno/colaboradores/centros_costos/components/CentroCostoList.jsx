import React, {Component} from 'react';
import CreateForm from './forms/CentroCostoForm';
import Tabla from './CentroCostoTabla';
import crudHOC from '../../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchCentroCostoColaborador,
            deleteObjectMethod: this.props.deleteCentroCostoColaborador,
            createObjectMethod: this.props.createCentroCostoColaborador,
            updateObjectMethod: this.props.updateCentroCostoColaborador,
        };
        this.plural_name = 'Centros Costos';
        this.singular_name = 'Centro Costo';
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