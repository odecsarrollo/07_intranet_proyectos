import React, {useEffect, memo} from 'react';
import CreateForm from './forms/PaisForm';
import Tabla from './PaisTabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';
import {PAISES} from "../../../../../permisos";
import * as actions from "../../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchPaises());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearPaises());
        };
    }, []);
    const list = useSelector(state => state.geografia_paises);
    const permisos = useTengoPermisos(PAISES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchPais(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deletePais(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createPais(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updatePais(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='País'
            cargarDatos={cargarDatos}
        />
    )
});
export default List;