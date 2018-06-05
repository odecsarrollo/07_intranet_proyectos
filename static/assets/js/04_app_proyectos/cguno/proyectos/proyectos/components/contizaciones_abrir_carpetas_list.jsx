import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';

import CreateForm from './forms/proyectos_modal_from_cotizacion_form';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';

const Lista = (props) => {
    const {list, onSelectItemEdit} = props;
    return (
        <Fragment>
            <h4 style={{color: 'red'}}>Para apertura de carpeta o literal</h4>
            <ul className="list-group puntero" style={{fontSize: '0.7rem', padding: 0, margin: 0}}>
                {_.map(list, c => {
                    if (c.abrir_carpeta) {
                        return <li key={c.id}
                                   onClick={() => {
                                       onSelectItemEdit(c);
                                   }}
                                   className="list-group-item">
                            {`${c.unidad_negocio}-${c.nro_cotizacion} ${c.descripcion_cotizacion} (${c.cliente})`}
                        </li>
                    }
                    else {
                        if (c.mi_proyecto) {
                            return <li key={c.id} className="list-group-item">
                                <Link to={`/app/proyectos/proyectos/detail/${c.mi_proyecto}`}>
                                    <div>
                                        CREAR LITERAL PARA PROYECTO {c.crear_literal_id_proyecto}
                                    </div>
                                </Link>
                            </li>
                        } else {
                            return <li key={c.id} className="list-group-item">
                                <div>
                                    CREAR LITERAL PARA PROYECTO {c.crear_literal_id_proyecto}, proyecto no existe!
                                </div>
                            </li>
                        }
                    }
                })}
            </ul>
        </Fragment>
    )
};
const CRUD = crudHOC(CreateForm, Lista);

export default class CotizacionAbrirCarpetaLista extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.fetchObjectMethod.bind(this),
            deleteObjectMethod: this.deleteObjectMethod.bind(this),
            createObjectMethod: this.createObjectMethod.bind(this),
            updateObjectMethod: this.updateObjectMethod.bind(this),
        };
        this.plural_name = null;
        this.singular_name = 'Proyecto';
    }

    successSubmitCallback(item) {
        const nombre = item.id_proyecto;
        const {noCargando, notificarAction, notificarErrorAjaxAction} = this.props;
        notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${this.singular_name.toLowerCase()} ${nombre}`);
        this.props.fetchCotizacionesPidiendoCarpeta(() => noCargando(), notificarErrorAjaxAction);
    }

    fetchObjectMethod(item_id, successCallback) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        const success_method = (item) => {
            successCallback(item);
            noCargando();
        };
        cargando();
        this.props.fetchCotizacion(item_id, success_method, notificarErrorAjaxAction);
    }

    createObjectMethod(item, successCallback) {
        const {cargando, notificarErrorAjaxAction} = this.props;
        const success_method = () => {
            this.successSubmitCallback(item);
            successCallback();
        };
        cargando();
        this.props.createProyecto({
            ...item,
            en_cguno: false
        }, success_method, notificarErrorAjaxAction);
    }

    updateObjectMethod(item, successCallback) {
        console.log('No aplica update');
    }

    deleteObjectMethod(item, successCallback) {
        console.log('No aplica delete')
    }

    render() {
        const {lista, permisos_object} = this.props;
        if (_.size(lista) > 0) {
            return (
                <CRUD
                    method_pool={this.method_pool}
                    list={lista}
                    permisos_object={permisos_object}
                    plural_name={this.plural_name}
                    singular_name={this.singular_name}
                    {...this.props}
                />
            )
        }
        return (
            <div></div>
        )
    }
}