import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {FACTURAS} from "../../permisos";
import CreateForm from './forms/FacturaCRUDForm';
import Tabla from './FacturaCRUDTabla';
import crudHOC from '../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(FACTURAS);
    const cargarDatos = () => {
        if (permisos.list) {
            dispatch(actions.fetchFacturas());
        }
    };
    useEffect(() => {
        //cargarDatos();
        return () => {
            dispatch(actions.clearFacturas());
        };
    }, [permisos.list]);
    const list = useSelector(state => state.facturas);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchFactura(id, options)),
        deleteObjectMethod: null,
        createObjectMethod: null,
        updateObjectMethod: (id, item, options) => dispatch(actions.updateFactura(id, item, options)),
    };
    return (
        <CRUD
            con_busqueda_rango={true}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Facturas'
            singular_name='Factura'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;