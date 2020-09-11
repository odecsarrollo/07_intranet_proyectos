import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {POSTVENTA_EVENTOS_EQUIPOS} from "../../permisos";
import CreateForm from './forms/EventoPostventaEquipoCRUDForm';
import Tabla from './EventoPostventaEquipoCRUDTabla';
import crudHOC from '../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(POSTVENTA_EVENTOS_EQUIPOS);
    const cargarDatos = () => {
        if (permisos.list) {
            dispatch(actions.fetchPostventaEventosEquipos());
        }
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearPostventaEventosEquipos());
        };
    }, []);
    const list = useSelector(state => state.postventa_ordenes_servicio);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchPostventaEventoEquipo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deletePostventaEventoEquipo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createPostventaEventoEquipo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updatePostventaEventoEquipo(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Eventos Postventa Equipos'
            singular_name='Evento Postventa Equipo'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;