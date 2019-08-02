import React, {memo, useEffect} from 'react';
import CreateForm from './forms/BandaEurobeltCRUDModalForm';
import Tabla from './BandaEurobeltCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {BANDAS_EUROBELT} from "../../../permisos";
import {useSelector} from "react-redux/es/hooks/useSelector";
import * as actions from "../../../01_actions/01_index";


const CRUD = crudHOC(CreateForm, Tabla);

const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(BANDAS_EUROBELT);
    const bandas = useSelector(state => state.banda_eurobelt_bandas);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchBandaEurobelt(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteBandaEurobelt(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createBandaEurobelt(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateBandaEurobelt(id, item, options)),
    };

    const cargarDatos = () => {
        dispatch(actions.fetchBandasEurobelt())
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBandasEurobelt());
        }
    }, []);
    return (
        <CRUD
            method_pool={method_pool}
            list={bandas}
            permisos_object={permisos}
            plural_name=''
            singular_name='Banda Eurobelt'
            cargarDatos={cargarDatos}
        />
    )
});
export default List;