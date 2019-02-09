import React, {Component} from 'react';
import CreateForm from './forms/colaborador_form';
import Tabla from './colaboradores_tabla';
import crudHOC from '../../../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.fetchObjectMethod.bind(this),
            deleteObjectMethod: this.deleteObjectMethod.bind(this),
            createObjectMethod: this.createObjectMethod.bind(this),
            updateObjectMethod: this.updateObjectMethod.bind(this),
        };
        this.plural_name = 'Colaboradores';
        this.singular_name = 'Colaborador';
        this.onCreateColaboradorUsuario = this.onCreateColaboradorUsuario.bind(this);
    }

    successSubmitCallback(item) {
        const nombre = `${item.nombres} ${item.apellidos}`;
        const {noCargando, notificarAction} = this.props;
        notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        noCargando()
    }


    successDeleteCallback(item) {
        const nombre = `${item.nombres} ${item.apellidos}`;
        const {noCargando, notificarAction} = this.props;
        notificarAction(`Se ha eliminado con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        noCargando()
    }

    fetchObjectMethod(item_id, successCallback) {
        const callback = (item) => {
            successCallback(item);
        };
        this.props.fetchColaborador(item_id, {callback});
    }

    createObjectMethod(item, successCallback) {
        const callback = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        this.props.createColaborador(item, {callback});
    }

    updateObjectMethod(item, successCallback) {
        const callback = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        this.props.updateColaborador(item.id, item, {callback});
    }

    deleteObjectMethod(item, successCallback) {
        const callback = () => {
            this.successDeleteCallback(item);
            successCallback();
        };
        this.props.deleteColaborador(item.id, {callback});
    }

    onCreateColaboradorUsuario(item) {
        const callback = (response) => {
            this.props.notificarAction(`Se ha creado el usuario ${response.usuario_username} para ${response.nombres} ${response.apellidos} con exitoso!`)
        }
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