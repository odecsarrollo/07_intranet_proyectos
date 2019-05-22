import React, {Component} from 'react';
import CreateForm from './forms/ComponenteForm';
import Tabla from './ComponenteTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchBandaEurobeltComponente,
            deleteObjectMethod: this.props.deleteBandaEurobeltComponente,
            createObjectMethod: this.props.createBandaEurobeltComponente,
            updateObjectMethod: this.props.updateBandaEurobeltComponente,
        };
        this.plural_name = 'Componentes';
        this.singular_name = 'Componente';
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