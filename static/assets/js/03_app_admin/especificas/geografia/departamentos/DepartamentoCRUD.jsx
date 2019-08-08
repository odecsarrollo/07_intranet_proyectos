import React, {memo, useEffect} from 'react';
import CreateForm from './forms/DepartamentoCRUDForm';
import Tabla from './DepartamentoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';
import {useDispatch,useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {DEPARTAMENTOS} from "../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);
const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchDepartamentos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearDepartamentos());
        };
    }, []);
    const list = useSelector(state => state.geografia_departamentos);
    const permisos = useTengoPermisos(DEPARTAMENTOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchDepartamento(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteDepartamento(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createDepartamento(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateDepartamento(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Departamento'
            cargarDatos={cargarDatos}
        />
    )
});
export default List;