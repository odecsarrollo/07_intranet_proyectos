import React, {memo, useEffect} from 'react';
import CreateForm from './forms/FormaPagoCRUDForm';
import Tabla from './FormaPagoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {FORMAS_PAGOS} from "../../../../permisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchFormasPagos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearFormasPagos());
        };
    }, []);
    const list = useSelector(state => state.formas_pagos_canales);
    const permisos = useTengoPermisos(FORMAS_PAGOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchFormaPago(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteFormaPago(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createFormaPago(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateFormaPago(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Forma de Pago Canal'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;