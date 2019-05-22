import React, {Component} from 'react';
import CreateForm from './forms/SerieForm';
import Tabla from './SerieTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchBandaEurobeltSerie,
            deleteObjectMethod: this.props.deleteBandaEurobeltSerie,
            createObjectMethod: this.props.createBandaEurobeltSerie,
            updateObjectMethod: this.props.updateBandaEurobeltSerie,
        };
        this.plural_name = 'Series';
        this.singular_name = 'Serie';
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