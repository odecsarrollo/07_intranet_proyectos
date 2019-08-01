import React, {Component, memo, useEffect} from 'react';
import CreateForm from './forms/TipoBandaCRUDForm';
import Tabla from './TipoBandaCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {BANDA_EUROBELT_TIPOS} from "../../../permisos";
import {useSelector} from "react-redux/es/hooks/useSelector";
import * as actions from "../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(BANDA_EUROBELT_TIPOS);
    const tipos = useSelector(state => state.banda_eurobelt_tipos);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBandaEurobeltTipo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBandaEurobeltTipo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBandaEurobeltTipo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBandaEurobeltTipo(id, item, options)),
    };

    const cargarDatos = () => {
        dispatch(actions.fetchBandaEurobeltTipos())
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandaEurobeltTipos());
        }
    }, []);
    return (
        <CRUD
            method_pool={method_pool}
            list={tipos}
            permisos_object={permisos}
            plural_name=''
            singular_name='Tipo'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;