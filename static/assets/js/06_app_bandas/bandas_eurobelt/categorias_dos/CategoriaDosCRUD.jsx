import React, {memo, useEffect} from 'react';
import CreateForm from './forms/CategoriaDosCRUDForm';
import Tabla from './CategoriaDosCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {BANDA_EUROBELT_CATEGORIAS_DOS} from "../../../permisos";
import {useSelector} from "react-redux/es/hooks/useSelector";
import * as actions from "../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(BANDA_EUROBELT_CATEGORIAS_DOS);
    const categorias = useSelector(state => state.banda_eurobelt_categorias_dos);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBandaEurobeltCategoria(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBandaEurobeltCategoria(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBandaEurobeltCategoria(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBandaEurobeltCategoria(id, item, options)),
    };

    const cargarDatos = () => {
        dispatch(actions.fetchBandaEurobeltCategorias())
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandaEurobeltCategorias());
        }
    }, []);
    return (
        <CRUD
            method_pool={method_pool}
            list={categorias}
            permisos_object={permisos}
            plural_name=''
            singular_name='Categoria'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;