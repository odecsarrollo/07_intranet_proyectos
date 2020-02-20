import React, {memo, useEffect} from 'react';
import CreateForm from './forms/ColorCRUDForm';
import Tabla from './ColorCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const {permisos} = props;
    const colores = useSelector(state => state.banda_eurobelt_colores);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBandaEurobeltColor(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBandaEurobeltColor(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBandaEurobeltColor(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBandaEurobeltColor(id, item, options)),
    };

    const cargarDatos = () => {
        dispatch(actions.fetchBandaEurobeltColores())
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandaEurobeltColores());
        }
    }, []);
    return (
        <CRUD
            method_pool={method_pool}
            list={colores}
            permisos_object={permisos}
            plural_name=''
            singular_name='Color'
            cargarDatos={cargarDatos}
        />
    )
});
export default List;