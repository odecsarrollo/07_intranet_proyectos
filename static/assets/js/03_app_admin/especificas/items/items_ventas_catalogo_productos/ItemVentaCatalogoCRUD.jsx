import React, {memo, useEffect} from 'react';
import CreateForm from './forms/ItemVentaCatalogoCRUDForm';
import Tabla from './ItemVentaCatalogoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {ITEMS_VENTAS_CATALOGOS} from "../../../../permisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchItemsVentasCatalogos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearItemsVentasCatalogos());
        };
    }, []);
    const list = useSelector(state => state.catalogos_productos_items_ventas);
    const permisos = useTengoPermisos(ITEMS_VENTAS_CATALOGOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchItemVentaCatalogo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteItemVentaCatalogo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createItemVentaCatalogo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateItemVentaCatalogo(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Items Ventas'
            singular_name=''
            cargarDatos={cargarDatos}
        />
    )
});

export default List;