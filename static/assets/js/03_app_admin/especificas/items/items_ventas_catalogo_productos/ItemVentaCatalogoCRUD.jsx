import React, {memo, useEffect, useState, Fragment} from 'react';
import CreateForm from './forms/ItemVentaCatalogoCRUDForm';
import Tabla from './ItemVentaCatalogoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {ITEMS_VENTAS_CATALOGOS} from "../../../../permisos";
import BuquedaTextoPorMetodo from "../../../../00_utilities/components/filtros/BuquedaTextoPorMetodo";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const [origen_seleccionado, setOrigenSeleccionado] = useState('LP_INTRANET');
    const busquedaItem = (parametro) => {
        dispatch(actions.fetchItemsVentasCatalogosxOrigen(origen_seleccionado, parametro));
    };
    useEffect(() => {
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
        <Fragment>
            <BuquedaTextoPorMetodo onBuscar={busquedaItem} placeholder='A buscar...'/>
            <CRUD
                setOrigenSeleccionado={(origen) => {
                    setOrigenSeleccionado(origen);
                    dispatch(actions.clearItemsVentasCatalogos());
                }}
                origen_seleccionado={origen_seleccionado}
                method_pool={method_pool}
                list={list}
                permisos_object={permisos}
                plural_name=''
                singular_name='Item Venta'
            />
        </Fragment>
    )
});

export default List;