import React, {memo, useEffect} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {PROYECTOS} from "../../../../permisos";

const ClienteDetailDashboardProyectos = (props) => {
    const dispatch = useDispatch();
    const {cliente_id} = props;
    const proyectos = useSelector(state => state.proyectos);
    const permisos = useTengoPermisos(PROYECTOS);
    const cargarDatos = () => {
        dispatch(actions.fetchProyectosCliente(cliente_id));
    };
    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearProyectos())
    }, []);
    return <div>Proyectos2</div>
};

export default ClienteDetailDashboardProyectos;