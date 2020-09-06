import React, {Fragment, memo} from 'react';
import {useDispatch} from "react-redux";
import {fechaToYMD} from "../../../00_utilities/common";
import * as actions from "../../../01_actions/01_index";
import {
    TIPOS_EQUIPOS
} from "../../../permisos";
import CreateForm from './forms/EquipoGarantiaCRUDForm';
import Tabla from './EquipoGarantiaCRUDTable';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';

const CRUD = crudHOC(CreateForm, Tabla);

import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const EquipoGarantiaCRUD = memo(props => {
    const dispatch = useDispatch();
    const {equipo: {id, garantias}} = props;
    const list = _.mapKeys(garantias, 'id');
    const permisos = useTengoPermisos(TIPOS_EQUIPOS);
    const method_pool = {
        fetchObjectMethod: (garantia_id) => list[garantia_id],
        deleteObjectMethod: (garantia_id, options) => dispatch(actions.deleteGarantiaEquipoProyecto(id, garantia_id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createGarantiaEquipoProyecto(
            id,
            {
                ...item,
                fecha_inicial: fechaToYMD(item.fecha_inicial),
                fecha_final: fechaToYMD(item.fecha_final),
            },
            options
        )),
        updateObjectMethod: null
    };
    return (
        <Fragment>
            <CRUD
                isPasive={true}
                method_pool={method_pool}
                list={list}
                permisos_object={permisos}
                singular_name='Equipo Garantía'
            />
        </Fragment>
    )
});
export default EquipoGarantiaCRUD;