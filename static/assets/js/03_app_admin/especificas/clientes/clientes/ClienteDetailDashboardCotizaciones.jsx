import React, {memo, useEffect} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {COTIZACIONES_COMPONENTES} from "../../../../permisos";

const ClienteDetailDashboardCotizaciones = (props) => {
    const dispatch = useDispatch();
    const {cliente_id} = props;
    const cotizaciones = useSelector(state => state.cotizaciones_componentes);
    const permisos = useTengoPermisos(COTIZACIONES_COMPONENTES);
    console.log(cotizaciones);
    const cargarDatos = () => {
        dispatch(actions.fetchCotizacionesComponentesCliente(cliente_id));
    };
    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearCotizacionesComponentes())
    }, []);
    return <div>Cotizaciones</div>
};
//fetchCotizacionesComponentesCliente

export default ClienteDetailDashboardCotizaciones;