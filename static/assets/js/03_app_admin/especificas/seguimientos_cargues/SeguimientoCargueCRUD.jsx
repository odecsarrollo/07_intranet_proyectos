import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {SEGUIMIENTOS_CARGUES} from "../../../permisos";
import Tabla from './SeguimientoCargueCRUDLista';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(null, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchSeguimientosCargues());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearSeguimientosCargues());
        };
    }, []);
    const list = useSelector(state => state.seguimientos_cargues);
    console.log(list)
    const permisos = useTengoPermisos(SEGUIMIENTOS_CARGUES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchSistemaInformacionOrigen(id, options)),
        deleteObjectMethod: null,
        createObjectMethod: null,
        updateObjectMethod: null,
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Seguimientos Cargues'
            singular_name='Seguimiento Cargue'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;