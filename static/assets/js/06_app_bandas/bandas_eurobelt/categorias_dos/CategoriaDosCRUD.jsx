import React, {memo, useEffect} from 'react';
import CreateForm from './forms/CategoriaDosCRUDForm';
import Tabla from './CategoriaDosCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const {permisos} = props;
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