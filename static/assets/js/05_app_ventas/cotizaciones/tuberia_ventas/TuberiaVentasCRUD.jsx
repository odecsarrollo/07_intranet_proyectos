import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {
    COTIZACIONES,
    PROYECTOS
} from "../../../00_utilities/permisos/types";

import CreateForm from './forms/TuberiaVentasCRUDCotizacionForm';
import Tabla from './TuberiaVentaCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCotizacionesTuberiaVentas());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCotizaciones());
        };
    }, []);
    const list = useSelector(state => state.cotizaciones);
    const cotizaciones_permisos = useTengoPermisos(COTIZACIONES);
    const proyectos_permisos = useTengoPermisos(PROYECTOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCotizacion(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCotizacion(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCotizacion(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCotizacion(id, item, options)),
    };
    return (
        <CRUD
            permisos_object={{...cotizaciones_permisos, list: cotizaciones_permisos.list_tuberia_ventas}}
            proyectos_permisos={proyectos_permisos}
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            plural_name='Panel Ventas'
            singular_name='Panel Ventas'
            cargarDatos={cargarDatos}
        />
    )
});


export default List;