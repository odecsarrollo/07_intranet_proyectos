import React, {Component} from 'react';
import CreateForm from '../00_forms/adhesivos_form';
import Tabla from '../01_tabla/adhesivos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class StickerMedios extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchAdhesivoMedios,
            deleteObjectMethod: this.props.deleteAdhesivoMedios,
            createObjectMethod: this.props.createStickerMedios,
            updateObjectMethod: this.props.updateAdhesivoMedios,
        };
        this.plural_name = 'Stickers';
        this.singular_name = 'Stiker';
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

export default StickerMedios;