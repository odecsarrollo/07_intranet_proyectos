import React, {memo, useEffect} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {FACTURAS} from "../../../../permisos";

const ClienteDetailDashboardFacturacion = (props) => {
    const dispatch = useDispatch();
    const {cliente_id} = props;
    const facturas = useSelector(state => state.facturas);
    console.log(facturas);
    const permisos = useTengoPermisos(FACTURAS);
    const cargarDatos = () => {
        dispatch(actions.fetchFacturasCliente(cliente_id));
    };
    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearFacturas())
    }, []);
    return <div>Facturacion</div>
};

export default ClienteDetailDashboardFacturacion;