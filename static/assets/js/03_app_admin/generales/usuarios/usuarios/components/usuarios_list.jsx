import React, {Component} from 'react';
import CreateForm from './forms/usuarios_form';
import Tabla from './usuarios_tabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';


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
        this.plural_name = 'Usuarios';
        this.singular_name = 'Usuario';
    }

    successSubmitCallback(item) {
        const nombre = item.username;
        const {noCargando, notificarAction} = this.props;
        notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        noCargando()
    }


    successDeleteCallback(item) {
        const nombre = item.username;
        const {noCargando, notificarAction} = this.props;
        notificarAction(`Se ha eliminado con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        noCargando()
    }

    componentWillUnmount() {
        this.props.clearUsuarios()
    }

    fetchObjectMethod(item_id, successCallback) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        const success_method = () => {
            successCallback();
            noCargando();
        };
        cargando();
        this.props.fetchUsuario(item_id, success_method, notificarErrorAjaxAction);
    }

    createObjectMethod(item, successCallback) {
        const {cargando, notificarErrorAjaxAction} = this.props;
        const success_method = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        cargando();
        this.props.createUsuario(item, success_method, notificarErrorAjaxAction);
    }

    updateObjectMethod(item, successCallback) {
        const {cargando, notificarErrorAjaxAction} = this.props;
        const success_method = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        cargando();
        this.props.updateUsuario(item.id, item, success_method, notificarErrorAjaxAction);
    }

    deleteObjectMethod(item, successCallback) {
        const {cargando, notificarErrorAjaxAction} = this.props;
        const success_method = () => {
            this.successDeleteCallback(item);
            successCallback();
        };
        cargando();
        this.props.deleteUsuario(item.id, success_method, notificarErrorAjaxAction);
    }

    render() {
        const {object_list, permisos_object, mi_cuenta} = this.props;
        return (
            <CRUD
                method_pool={this.method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
                {...this.props}
                mi_cuenta={mi_cuenta}
            />
        )
    }
}

export default List;