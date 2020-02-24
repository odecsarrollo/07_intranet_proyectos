import React, {useEffect} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {FACTURAS} from "../../../../permisos";
import FacturaTabla from "../../../../11_app_sistemas_informacion/facturacion/FacturaTabla";
import ValidarPermisos from "../../../../permisos/validar_permisos";

const ClienteDetailDashboardFacturacion = (props) => {
    const dispatch = useDispatch();
    const {cliente_id} = props;
    const facturas = useSelector(state => state.facturas);
    const permisos = useTengoPermisos(FACTURAS);
    const cargarDatos = () => {
        if (permisos.list) {
            dispatch(actions.fetchFacturasCliente(cliente_id));
        }
    };
    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearFacturas())
    }, [permisos.list]);
    return <ValidarPermisos can_see={permisos.list} nombre='Facturas de cliente'>
        <FacturaTabla list={_.map(facturas)} permisos_object={permisos}/>
    </ValidarPermisos>
};

export default ClienteDetailDashboardFacturacion;