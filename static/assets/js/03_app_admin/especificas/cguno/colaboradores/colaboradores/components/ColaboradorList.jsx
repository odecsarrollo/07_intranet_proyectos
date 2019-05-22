import React, {Component} from 'react';
import CreateForm from './forms/ColaboradorForm';
import Tabla from './ColaboradorTabla';
import crudHOC from '../../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchColaborador,
            deleteObjectMethod: this.props.deleteColaborador,
            createObjectMethod: this.props.createColaborador,
            updateObjectMethod: this.props.updateColaborador,
        };
        this.plural_name = 'Colaboradores';
        this.singular_name = 'Colaborador';
        this.onCreateColaboradorUsuario = this.onCreateColaboradorUsuario.bind(this);

    }

    onCreateColaboradorUsuario(item) {
        const callback = (response) => {
            this.props.notificarAction(`Se ha creado el usuario ${response.usuario_username} para ${response.nombres} ${response.apellidos} con exitoso!`)
        };
        this.props.createColaboradorUsuario(item.id, {callback})
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                onCreateColaboradorUsuario={this.onCreateColaboradorUsuario}
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