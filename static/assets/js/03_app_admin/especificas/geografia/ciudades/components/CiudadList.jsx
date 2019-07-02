import React, {memo, useEffect} from 'react';
import CreateForm from './forms/CiudadForm';
import Tabla from './CiudadTabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {CIUDADES} from "../../../../../00_utilities/permisos/types";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCiudades());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCiudades());
        };
    }, []);
    const list = useSelector(state => state.geografia_ciudades);
    const permisos = useTengoPermisos(CIUDADES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCiudad(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCiudad(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCiudad(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCiudad(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Ciudad'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;