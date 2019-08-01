import React, {memo, useEffect} from 'react';
import CreateForm from './forms/ComponenteCRUDForm';
import Tabla from './ComponenteCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {BANDA_EUROBELT_COMPONENTES} from "../../../permisos";
import {useSelector} from "react-redux/es/hooks/useSelector";
import * as actions from "../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(BANDA_EUROBELT_COMPONENTES);
    const componentes = useSelector(state => state.banda_eurobelt_componentes);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBandaEurobeltComponente(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBandaEurobeltComponente(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBandaEurobeltComponente(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBandaEurobeltComponente(id, item, options)),
    };

    const cargarDatos = () => {
        dispatch(actions.fetchBandaEurobeltComponentes())
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandaEurobeltComponentes());
        }
    }, []);
    return (
        <CRUD
            method_pool={method_pool}
            list={componentes}
            permisos_object={permisos}
            plural_name=''
            singular_name='Componente'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;