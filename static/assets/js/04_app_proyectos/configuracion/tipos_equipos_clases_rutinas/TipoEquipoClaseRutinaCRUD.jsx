import React, {Fragment, memo} from 'react';
import {useDispatch} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {
    TIPOS_EQUIPOS
} from "../../../permisos";
import CreateForm from './forms/TipoEquipoClaseRutinaCRUDForm';
import Tabla from './TipoEquipoClaseRutinaCRUDTable';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';

const CRUD = crudHOC(CreateForm, Tabla);

import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const TipoEquipoClaseRutinaCRUD = memo(props => {
    const dispatch = useDispatch();
    const {tipo_equipo_clase: {id, rutinas_postventa}} = props;
    const list = _.mapKeys(rutinas_postventa, 'id');
    const permisos = useTengoPermisos(TIPOS_EQUIPOS);
    const method_pool = {
        fetchObjectMethod: (tipo_equipo_campo_id) => list[tipo_equipo_campo_id],
        deleteObjectMethod: (tipo_equipo_campo_id, options) => dispatch(actions.deleteRutinaTipoEquipoClase(id, tipo_equipo_campo_id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createRutinaTipoEquipoClase(id, item, options)),
        updateObjectMethod: (tipo_equipo_campo_id, item, options) => dispatch(actions.updateRutinaTipoEquipoClase(id, tipo_equipo_campo_id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                isPasive={true}
                method_pool={method_pool}
                list={list}
                permisos_object={permisos}
                singular_name='Tipo Equipo Clase Rutinas'
            />
        </Fragment>
    )
});
export default TipoEquipoClaseRutinaCRUD;