import React, {memo, useEffect, Fragment, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {COTIZACIONES_COMPONENTES} from "../../permisos";
import CreateForm from './cotizacion/forms/CotizacionCRUDFormDialog';
import Tabla from './CotizacionComponenteCRUDTabla';
import crudHOC from '../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import CotizacionEdicionList from "./CotizacionEdicionList";

const CRUD = crudHOC(CreateForm, Tabla);
const Cotizaciones = memo(props => {
    const {history} = props;
    const dispatch = useDispatch();
    const [estado_cotizacion, setEstadoCotizacion] = useState('PRO');
    const cargarDatos = () => {
        dispatch(actions.fetchCotizacionesComponentes_por_estado(estado_cotizacion));
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCotizacionesComponentes());
        };
    }, [estado_cotizacion]);
    const list = useSelector(state => state.cotizaciones_componentes);
    const permisos = useTengoPermisos(COTIZACIONES_COMPONENTES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCotizacionComponente(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCotizacionComponente(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCotizacionComponente(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCotizacionComponente(id, item, options)),
    };
    return (
        <Fragment>
            <CotizacionEdicionList/>
            <CRUD
                posSummitMethod={(cot) => history.push(`/app/ventas_componentes/cotizaciones/detail/${cot.id}`)}
                method_pool={method_pool}
                list={list}
                setEstadoCotizacion={setEstadoCotizacion}
                estado_cotizacion_seleccionada={estado_cotizacion}
                permisos_object={permisos}
                plural_name='Cotizaciones'
                singular_name='Cotización'
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});

export default Cotizaciones;