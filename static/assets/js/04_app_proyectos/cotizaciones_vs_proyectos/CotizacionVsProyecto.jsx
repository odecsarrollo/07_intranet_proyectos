import React, {Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {COTIZACIONES} from "../../permisos";
import Tabla from './CotizacionVsProyectoTabla';

import crudHOC from '../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(null, Tabla);

const ConsecutivoProyecto = (props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        const cargarProyectos = () => dispatch(actions.fetchProyectosConCotizaciones());
        dispatch(actions.fetchCotizacionesConProyectos({callback: cargarProyectos}))
    };
    const permisos_cotizaciones = useTengoPermisos(COTIZACIONES);
    let cotizaciones_list = useSelector(state => state.cotizaciones);
    let proyectos_list = useSelector(state => state.proyectos);
    console.log(cotizaciones_list)
    console.log(proyectos_list)
    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearCotizaciones());
    }, []);
    const method_pool = {};
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={cotizaciones_list}
                permisos_object={{...permisos_cotizaciones, add: false}}
                plural_name='Cotizaciones vs Proyectos'
                singular_name=''
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )

};
export default ConsecutivoProyecto;