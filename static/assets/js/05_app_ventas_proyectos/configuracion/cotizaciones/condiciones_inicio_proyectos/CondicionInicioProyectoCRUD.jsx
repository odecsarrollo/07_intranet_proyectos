import React, {useEffect, memo} from 'react';
import CreateForm from './forms/CondicionInicioProyectoCRUDForm';
import Tabla from './CondicionInicioProyectoCRUDTable';
import crudHOC from '../../../../00_utilities/components/hoc_crud';
import {CONDICIONES_INICIOS_PROYECTOS} from "../../../../permisos";
import * as actions from "../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCondicionesIniciosProyectos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCondicionesIniciosProyectos());
        };
    }, []);
    const list = useSelector(state => state.condiciones_inicios_proyectos);
    const permisos = useTengoPermisos(CONDICIONES_INICIOS_PROYECTOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCondicionInicioProyecto(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCondicionInicioProyecto(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCondicionInicioProyecto(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCondicionInicioProyecto(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Condición Inicio Proyecto'
            cargarDatos={cargarDatos}
        />
    )
});
export default List;