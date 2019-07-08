import React, {memo, useEffect} from 'react';
import CreateForm from './forms/CobroCRUDForm';
import Tabla from './CobroCRUDTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {PROFORMAS_ANTICIPOS} from "../../../../00_utilities/permisos/types";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchProformasAnticipos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearProformasAnticipos());
        };
    }, []);
    const list = useSelector(state => state.contabilidad_proforma_anticipos);
    const permisos = useTengoPermisos(PROFORMAS_ANTICIPOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchProformaAnticipo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteProformaAnticipo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createProformaAnticipo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateProformaAnticipo(id, item, options)),
    };
    return (
        <CRUD
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Cobro'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;