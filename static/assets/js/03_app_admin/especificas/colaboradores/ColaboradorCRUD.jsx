import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {COLABORADORESN} from "../../../permisos";
import CreateForm from './forms/ColaboradorCRUDForm';
import Tabla from './ColaboradorCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchColaboradoresn());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearColaboradoresn());
        };
    }, []);
    const list = useSelector(state => state.colaboradoresn);
    const permisos = useTengoPermisos(COLABORADORESN);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchColaboradorn(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteColaboradorn(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createColaboradorn(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateColaboradorn(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Colaboradores N'
            singular_name='Colaborador N'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;