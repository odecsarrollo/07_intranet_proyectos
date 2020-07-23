import React, {useEffect} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {COTIZACIONES_COMPONENTES} from "../../../../permisos";
import CotizacionComponenteCrudTablaBase
    from '../../../../10_app_ventas_componentes/cotizaciones/CotizacionComponenteCrudTablaBase';

const ClienteDetailDashboardCotizaciones = (props) => {
    const dispatch = useDispatch();
    const {cliente_id} = props;
    const cotizaciones = useSelector(state => state.cotizaciones_componentes);
    const permisos = useTengoPermisos(COTIZACIONES_COMPONENTES);
    const cargarDatos = () => {
        dispatch(actions.fetchCotizacionesComponentesCliente(cliente_id));
    };
    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearCotizacionesComponentes())
    }, [permisos.list]);
    return <CotizacionComponenteCrudTablaBase
        list={cotizaciones}
        permisos_object={permisos}
        singular_name='Cotización'
        nro_filas={10}
    />
};

export default ClienteDetailDashboardCotizaciones;