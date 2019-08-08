import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {SISTEMAS_INFORMACION_ORIGEN} from "../../../permisos";
import CreateForm from './forms/SistemaInformacionOrigenCRUDForm';
import Tabla from './SistemaInformacionOrigenCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchSistemasInformacionOrigen());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearSistemasInformacionOrigen());
        };
    }, []);
    const list = useSelector(state => state.sistemas_informacion_reducer);
    const permisos = useTengoPermisos(SISTEMAS_INFORMACION_ORIGEN);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchSistemaInformacionOrigen(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteSistemaInformacionOrigen(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createSistemaInformacionOrigen(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateSistemaInformacionOrigen(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Sistemas Informacion Origen'
            singular_name='Sistema Informacion Origen'
            cargarDatos={cargarDatos}
        />
    )
});

export default List;