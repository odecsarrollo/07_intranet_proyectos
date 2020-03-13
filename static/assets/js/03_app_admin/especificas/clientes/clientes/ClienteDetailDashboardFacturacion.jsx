import React, {useEffect} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {FACTURAS} from "../../../../permisos";
import FacturaCRUDTabla from "../../../../11_app_sistemas_informacion/facturacion/FacturaCRUDTabla";
import ValidarPermisos from "../../../../permisos/validar_permisos";
import crudHOC from "../../../../00_utilities/components/HOC_CRUD2";
import CreateForm from "../../../../11_app_sistemas_informacion/facturacion/forms/FacturaCRUDForm";

const CRUD = crudHOC(CreateForm, FacturaCRUDTabla);

const ClienteDetailDashboardFacturacion = (props) => {
    const dispatch = useDispatch();
    const {cliente_id} = props;
    const facturas = useSelector(state => state.facturas);
    const permisos = useTengoPermisos(FACTURAS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchFactura(id, options)),
        deleteObjectMethod: null,
        createObjectMethod: null,
        updateObjectMethod: (id, item, options) => dispatch(actions.updateFactura(id, item, options)),
    };
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
        <CRUD
            con_busqueda_rango={false}
            method_pool={method_pool}
            list={facturas}
            permisos_object={{...permisos, delete: false, change: false}}
            plural_name='Facturas'
            singular_name='Factura'
        />
    </ValidarPermisos>
};

export default ClienteDetailDashboardFacturacion;