import React, {memo, useEffect} from 'react';
import Tabla from './CiudadCargueCatalogoTabla';
import crudHOC from '../../../../../00_utilities/components/hoc_crud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {CIUDADES_CARGUES_CATALOGOS} from "../../../../../permisos";


const CRUD = crudHOC(null, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCiudadesCarguesCatalogos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCiudadesCarguesCatalogos());
        };
    }, []);
    const list = useSelector(state => state.ciudades_catalogos);
    const permisos = {...useTengoPermisos(CIUDADES_CARGUES_CATALOGOS), add: false, change: false};
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCiudad(id, options)),
        deleteObjectMethod: null,
        createObjectMethod: null,
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCiudad(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Ciudad Catalogo'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;