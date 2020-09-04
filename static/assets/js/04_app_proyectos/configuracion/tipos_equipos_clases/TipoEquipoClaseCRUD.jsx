import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {
    TIPOS_EQUIPOS
} from "../../../permisos";
import CreateForm from './forms/TipoEquipoClaseCRUDForm';
import Tabla from './TipoEquipoClaseCRUDTable';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';

const CRUD = crudHOC(CreateForm, Tabla);

import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const TipoEquipoClaseCRUD = memo(props => {
    const dispatch = useDispatch();
    const {tipo_equipo: {id, clases_tipo_equipo}} = props;
    const list = _.mapKeys(clases_tipo_equipo, 'id');
    const permisos = useTengoPermisos(TIPOS_EQUIPOS);
    const method_pool = {
        fetchObjectMethod: (tipo_equipo_clase_id) => list[tipo_equipo_clase_id],
        deleteObjectMethod: (tipo_equipo_clase_id, options) => dispatch(actions.deleteClaseTipoEquipo(id, tipo_equipo_clase_id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createClaseTipoEquipo(id, item, options)),
        updateObjectMethod: (tipo_equipo_clase_id, item, options) => dispatch(actions.updateClaseTipoEquipo(id, tipo_equipo_clase_id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                isPasive={true}
                method_pool={method_pool}
                list={list}
                permisos_object={permisos}
                singular_name='Tipo Equipo Clase'
            />
        </Fragment>
    )
});
export default TipoEquipoClaseCRUD;