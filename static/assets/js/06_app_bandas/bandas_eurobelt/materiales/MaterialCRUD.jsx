import React, {memo, useEffect} from 'react';
import CreateForm from './forms/MaterialCRUDForm';
import Tabla from './MaterialCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const {permisos} = props;
    const materiales = useSelector(state => state.banda_eurobelt_materiales);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBandaEurobeltMaterial(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBandaEurobeltMaterial(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBandaEurobeltMaterial(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBandaEurobeltMaterial(id, item, options)),
    };

    const cargarDatos = () => {
        dispatch(actions.fetchBandaEurobeltMateriales())
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandaEurobeltMateriales());
        }
    }, []);
    return (
        <CRUD
            method_pool={method_pool}
            list={materiales}
            permisos_object={permisos}
            plural_name=''
            singular_name='Material'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;