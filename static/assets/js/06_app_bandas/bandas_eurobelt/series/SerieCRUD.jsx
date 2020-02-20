import React, {memo, useEffect} from 'react';
import CreateForm from './forms/SerieCRUDForm';
import Tabla from './SerieCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import * as actions from "../../../01_actions/01_index";
import {useDispatch, useSelector} from "react-redux";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const {permisos} = props;
    const series = useSelector(state => state.banda_eurobelt_series);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBandaEurobeltSerie(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBandaEurobeltSerie(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBandaEurobeltSerie(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBandaEurobeltSerie(id, item, options)),
    };

    const cargarDatos = () => {
        dispatch(actions.fetchBandaEurobeltSeries())
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandaEurobeltSeries());
        }
    }, []);
    return (
        <CRUD
            method_pool={method_pool}
            list={series}
            permisos_object={permisos}
            plural_name=''
            singular_name='Serie'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;