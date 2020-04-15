import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import RangoFechas from "../../../00_utilities/calendariosRangosFiltro";
import {
    MANOS_OBRAS_HORAS_HOJAS_TRABAJOS,
    MANOS_OBRAS_HOJAS_TRABAJOS,
} from "../../../permisos";
import Tabla from './HoraTrabajoVerificarCRUDTabla';
import crudHOC from '../../../00_utilities/components/hoc_crud';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(null, Tabla);

const HoraTrabajoVerificarCRUD = memo(props => {
    const dispatch = useDispatch();
    const permisos_horas = useTengoPermisos(MANOS_OBRAS_HORAS_HOJAS_TRABAJOS);
    const permisos_hojas = useTengoPermisos(MANOS_OBRAS_HOJAS_TRABAJOS);

    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchHoraHojaTrabajo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteHoraHojaTrabajo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createHoraHojaTrabajo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateHoraHojaTrabajo(id, item, options)),
    };

    const cargarDatos = () => {
        const cargarHorasHojasTrabajo = () => dispatch(actions.fetchHorasHojasTrabajosAutogestionadas());
        dispatch(actions.fetchConfiguracionesCostos({callback: cargarHorasHojasTrabajo}));

    };
    const horas_list = useSelector(state => state.horas_hojas_trabajos);
    const configuracion_costos = _.map(useSelector(state => state.configuracion_costos), c => c)[0];

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearHorasHojasTrabajos());
            dispatch(actions.clearProyectos());
        }
    }, []);

    return <Fragment>
        <RangoFechas metodoBusquedaFechas={(i, f) => {
            dispatch(actions.fetchHorasHojasTrabajosAutogestionadasxFechas(i, f));
        }}/>
        <CRUD
            method_pool={method_pool}
            list={horas_list}
            configuracion_costos={configuracion_costos}
            permisos_hoja={permisos_hojas}
            permisos_object={{...permisos_horas, list: permisos_horas.verificar, add: false}}
            plural_name='Verificar'
            singular_name='Verificar'
            cargarDatos={cargarDatos}
        />
    </Fragment>
});
export default HoraTrabajoVerificarCRUD;