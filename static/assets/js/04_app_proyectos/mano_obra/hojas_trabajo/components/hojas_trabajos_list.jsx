import React, {Component} from 'react';
import CreateForm from './forms/hoja_trabajo_form';
import Tabla from './hojas_trabajos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';
import {fechaFormatoUno} from '../../../../00_utilities/common';


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
        this.plural_name = 'Hojas de Trabajo';
        this.singular_name = 'Hoja de Trabajo';
    }

    successSubmitCallback(item) {
        const nombre = `en ${fechaFormatoUno(item.fecha)} para ${item.colaborador_nombre}`;
        const {noCargando, notificarAction} = this.props;
        notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        noCargando()
    }


    successDeleteCallback(item) {
        const nombre = `en ${fechaFormatoUno(item.fecha)} para ${item.colaborador_nombre}`;
        const {noCargando, notificarAction} = this.props;
        notificarAction(`Se ha eliminado con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        noCargando()
    }

    fetchObjectMethod(item_id, successCallback) {
        const callback = (item) => {
            successCallback(item);
        };
        this.props.fetchHojaTrabajo(item_id, {callback});
    }

    createObjectMethod(item, successCallback) {
        const {history} = this.props;
        const callback = (response) => {
            this.successSubmitCallback(item);
            successCallback();
            history.push(`/app/proyectos/mano_obra/hojas_trabajo/detail/${response.id}`);
        };
        this.props.createHojaTrabajo(item, {callback});
    }

    updateObjectMethod(item, successCallback) {
        console.log('no aplica')
    }

    deleteObjectMethod(item, successCallback) {
        const callback = () => {
            this.successDeleteCallback(item);
            successCallback();
        };
        this.props.deleteHojaTrabajo(item.id, {callback});
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