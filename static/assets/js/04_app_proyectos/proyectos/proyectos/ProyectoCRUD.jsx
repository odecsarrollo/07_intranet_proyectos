import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {
    PROYECTOS,
    COTIZACIONES
} from "../../../permisos";
import CreateForm from './forms/ProyectoCRUDForm';
import Tabla from './ProyectoCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';

const CRUD = crudHOC(CreateForm, Tabla);

import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const List = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchProyectos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearProyectos());
        };
    }, []);
    const list = useSelector(state => state.proyectos);
    const permisos_proyectos = useTengoPermisos(PROYECTOS);
    const permisos_cotizaciones = useTengoPermisos(COTIZACIONES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchProyecto(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteProyecto(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createProyecto(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateProyecto(id, item, options)),
    };
    return (
        <Fragment>
            <CRUD
                posSummitMethod={() => cargarDatos()}
                method_pool={method_pool}
                list={_.orderBy(list, ['id_proyecto'], ['desc'])}
                permisos_cotizaciones={permisos_cotizaciones}
                permisos_object={permisos_proyectos}
                plural_name='Proyectos'
                singular_name='Proyecto'
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});
export default List;