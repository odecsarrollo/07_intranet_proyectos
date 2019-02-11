import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';

import CreateForm from './forms/proyectos_modal_from_cotizacion_form';
import crudHOC from '../../../../00_utilities/components/hoc_crud';

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
                            {`${c.unidad_negocio}-${c.nro_cotizacion} ${c.descripcion_cotizacion} (${c.cliente_nombre})`}
                        </li>
                    }
                    else {
                        if (c.mi_proyecto) {
                            return <li key={c.id} className="list-group-item">
                                <Link to={`/app/proyectos/proyectos/detail/${c.mi_proyecto}`}>
                                    <div>
                                        Crear LITERAL en PROYECTO ({c.mi_proyecto_id_proyecto}) para COTIZACION
                                        nro. ({c.unidad_negocio}-{c.nro_cotizacion})
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
        this.createCotizacion = this.createCotizacion.bind(this);
        this.plural_name = null;
        this.singular_name = 'Proyecto';
    }

    createCotizacion(item) {
        this.props.createProyecto({...item, en_cguno: false});
    }

    render() {
        const {lista, permisos_object} = this.props;
        const method_pool = {
            fetchObjectMethod: this.fetchCotizacion,
            deleteObjectMethod: null,
            createObjectMethod: this.createCotizacion,
            updateObjectMethod: null,
        };
        if (_.size(lista) > 0) {
            return (
                <CRUD
                    method_pool={method_pool}
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