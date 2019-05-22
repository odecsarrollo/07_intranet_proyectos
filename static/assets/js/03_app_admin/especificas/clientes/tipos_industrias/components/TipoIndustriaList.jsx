import React, {Component} from 'react';
import CreateForm from './forms/TipoIndustriaForm';
import Tabla from './TipoIndustriaTabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchTipoIndustria,
            deleteObjectMethod: this.props.deleteTipoIndustria,
            createObjectMethod: this.props.createTipoIndustria,
            updateObjectMethod: this.props.updateTipoIndustria,
        };
        this.plural_name = 'Tipos Industrias';
        this.singular_name = 'Tipo Industria';
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