import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {
    TIPOS_EQUIPOS
} from "../../../permisos";
import CreateForm from './forms/TipoEquipoCRUDForm';
import Tabla from './TipoEquipoCRUDTable';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';

const CRUD = crudHOC(CreateForm, Tabla);

import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const List = memo(props => {
    const dispatch = useDispatch();
    const {history} = props;
    const permisos = useTengoPermisos(TIPOS_EQUIPOS);
    const cargarDatos = () => {
        if (permisos.list) {
            dispatch(actions.fetchTIposEquipos());
        }
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearTIposEquipos());
        };
    }, [permisos.list]);
    const list = useSelector(state => state.tipos_equipos);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchTipoEquipo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteTipoEquipo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createTipoEquipo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateTipoEquipo(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                posCreateMethod={(res) => history.push(`/app/proyectos/configuracion/tipos_equipos/${res.id}`)}
                method_pool={method_pool}
                list={list}
                permisos_object={permisos}
                plural_name='Tipos Equipos'
                singular_name='Tipo Equipo'
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});
export default List;