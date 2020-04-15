import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {FACTURAS} from "../../permisos";
import Tabla from './ItemVendidoCRUDTabla';
import crudHOC from '../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(null, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(FACTURAS);
    useEffect(() => {
        return () => {
            dispatch(actions.clearItemsFacturas());
        };
    }, [permisos.list]);
    const list = useSelector(state => state.facturas_items);
    const method_pool = {
        fetchObjectMethod: null,
        deleteObjectMethod: null,
        createObjectMethod: null,
        updateObjectMethod: null,
    };
    return (
        <CRUD
            con_busqueda_rango={true}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Items Ventas'
            singular_name='Item Venta'
        />
    )
});

export default List;