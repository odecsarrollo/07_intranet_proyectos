import React, {memo, useEffect} from 'react';
import CreateForm from './forms/CategoriaCRUDForm';
import Tabla from './CategoriaCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {CATEGORIAS_PRODUCTOS} from "../../../../permisos";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCategoriasProductos());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCategoriasProductos());
        };
    }, []);
    const list = useSelector(state => state.categorias_productos);
    const permisos = useTengoPermisos(CATEGORIAS_PRODUCTOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCategoriaProducto(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCategoriaProducto(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCategoriaProducto(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCategoriaProducto(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Categorías'
            singular_name=''
            cargarDatos={cargarDatos}
        />
    )
});

export default List;