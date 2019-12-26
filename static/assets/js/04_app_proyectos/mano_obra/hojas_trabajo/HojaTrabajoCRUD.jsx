import React, {Fragment, useEffect, memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import RangoFechas from "../../../00_utilities/calendariosRangosFiltro";
import {MANOS_OBRAS_HOJAS_TRABAJOS} from "../../../permisos";
import CreateForm from './forms/HojaTrabajoCRUDForm';
import Tabla from './HojaTrabajoCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';


const CRUD = crudHOC(CreateForm, Tabla);

import moment from "moment/moment";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const HojaTrabajoCRUD = memo(props => {
    const dispatch = useDispatch();
    const {history} = props;
    const permisos = useTengoPermisos(MANOS_OBRAS_HOJAS_TRABAJOS);
    const hojas_trabajos_diarios = useSelector(state => state.hojas_trabajos_diarios);
    const configuracion_costos = _.map(useSelector(state => state.configuracion_costos))[0];

    const cargarDatos = () => {
        const {add_para_otros} = permisos;
        const date_today = moment(new Date());
        const hoy = date_today.format('YYYY-MM-DD');
        const hace_un_mes = date_today.add({days: -30}).format('YYYY-MM-DD');
        const fecha_inicial = add_para_otros ? hoy : hace_un_mes;
        const cargarMiCuenta = () => dispatch(actions.fetchMiCuenta());
        const cargarHojasTrabajoHoy = () => dispatch(actions.fetchHojasTrabajosxFechas(fecha_inicial, hoy, {callback: cargarMiCuenta}));
        dispatch(actions.fetchConfiguracionesCostos({callback: cargarHojasTrabajoHoy}));

    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearHojasTrabajos());
        }
    }, []);

    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchHojaTrabajo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteHojaTrabajo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createHojaTrabajo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateHojaTrabajo(id, item, options)),
    };
    const mi_cuenta = JSON.parse(localStorage.getItem('mi_cuenta'));

    const can_add = permisos.add &&
        (
            permisos.add_para_otros ||
            (
                mi_cuenta.colaborador &&
                mi_cuenta.colaborador.autogestion_horas_trabajadas
            )
        );

    return (
        <Fragment>
            <RangoFechas metodoBusquedaFechas={(i, f) => {
                dispatch(actions.fetchHojasTrabajosxFechas(i, f));
            }}/>
            <CRUD
                configuracion_costos={configuracion_costos}
                posCreateMethod={(r) => history.push(`/app/proyectos/mano_obra/hojas_trabajo/detail/${r.id}`)}
                method_pool={method_pool}
                list={hojas_trabajos_diarios}
                permisos_object={{...permisos, add: can_add}}
                plural_name='Hojas de Trabajo'
                singular_name='Hoja de Trabajo'
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});
export default HojaTrabajoCRUD;