import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {
    EQUIPOS_PROYECTOS
} from "../../../permisos";
import CreateForm from './forms/EquipoCRUDForm';
import Tabla from './EquipoCRUDTable';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';

const CRUD = crudHOC(CreateForm, Tabla);

import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const List = memo(props => {
    const dispatch = useDispatch();
    const {literal} = props;
    const permisos = useTengoPermisos(EQUIPOS_PROYECTOS);
    const cargarDatos = () => {
        if (permisos.list) {
            dispatch(actions.fetchEquiposProyectosxLiteral(literal.id));
        }
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearEquiposProyectos());
        };
    }, [literal.id]);
    const list = useSelector(state => state.equipos_proyectos);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchEquipoProyecto(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteEquipoProyecto(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createEquipoProyecto({
            ...item,
            literal: literal.id
        }, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateEquipoProyecto(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={list}
                permisos_object={permisos}
                singular_name='Equipo Proyecto'
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});
export default List;