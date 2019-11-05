import React, {Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {PROYECTOS} from "../../permisos";
import Tabla from './ConsecutivoProyectoTabla';

import crudHOC from '../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(null, Tabla);

const ConsecutivoProyecto = (props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchProyectosConsecutivo())
    };
    const permisos_proyectos = useTengoPermisos(PROYECTOS);
    const proyectos_list = useSelector(state => state.proyectos);
    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearProyectos());
    }, []);
    const method_pool = {};
    return (
        <Fragment>
            <CRUD
                method_pool={method_pool}
                list={_.orderBy(proyectos_list, ['id_proyecto'], ['desc'])}
                permisos_object={{...permisos_proyectos, add: false}}
                plural_name='Consecutivo de Proyectos'
                singular_name=''
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )

};
export default ConsecutivoProyecto;