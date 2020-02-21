import React, {memo, useEffect} from 'react';
import CreateForm from './forms/ComponenteCRUDForm';
import Tabla from './ComponenteCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const {permisos} = props;
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

    const activarDesactivarComponente = (componente_id, valor) => {
        dispatch(actions.activarDesactivarComponente(componente_id, valor))
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
            activarDesactivarComponente={activarDesactivarComponente}
        />
    )
});

export default List;