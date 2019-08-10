import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {COTIZACIONES_COMPONENTES} from "../../../permisos";
import CreateForm from './forms/CotizacionCRUDFormDialog';
import Tabla from './CotizacionComponenteCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);
const Cotizaciones = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        dispatch(actions.fetchCotizacionesComponentes());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCotizacionesComponentes());
        };
    }, []);
    const list = useSelector(state => state.cotizaciones_componentes);
    const permisos = useTengoPermisos(COTIZACIONES_COMPONENTES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCotizacionComponente(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCotizacionComponente(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCotizacionComponente(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCotizacionComponente(id, item, options)),
    };
    return (
        <CRUD
            posSummitMethod={() => cargarDatos()}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name='Cotizaciones'
            singular_name='Cotización'
            cargarDatos={cargarDatos}
        />
    )
});

export default Cotizaciones;