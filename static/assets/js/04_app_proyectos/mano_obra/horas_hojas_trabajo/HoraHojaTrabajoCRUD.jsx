import React, {Fragment, useEffect, memo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import RangoFechas from "../../../00_utilities/calendariosRangosFiltro";
import {MANOS_OBRAS_HORAS_HOJAS_TRABAJOS} from "../../../permisos";
import Tabla from './HoraHojaTrabajoCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';


const CRUD = crudHOC(null, Tabla);

import moment from "moment/moment";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import Combobox from "react-widgets/lib/Combobox";

const List = memo(props => {
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(MANOS_OBRAS_HORAS_HOJAS_TRABAJOS);
    const horas = useSelector(state => state.horas_hojas_trabajos);
    const colaboradores = useSelector(state => state.colaboradores);
    const [colaborador_id_filtro, setColaboradorIdFiltro] = useState(null);


    const cargarDatos = () => {
        const {add_para_otros} = permisos;
        const date_today = moment(new Date());
        const hoy = date_today.format('YYYY-MM-DD');
        const hace_un_mes = date_today.add({days: -30}).format('YYYY-MM-DD');
        const fecha_inicial = add_para_otros ? hoy : hace_un_mes;
        const cargarColaboradores = () => dispatch(actions.fetchColaboradores());
        const cargarMiCuenta = () => dispatch(actions.fetchMiCuenta({callback: cargarColaboradores}));
        const parametros_get = [
            {llave: 'fecha_inicial', valor: fecha_inicial},
            {llave: 'fecha_final', valor: hoy},
        ];
        const cargarHorasHojasTrabajoHoy = () => dispatch(actions.fetchHorasHojasTrabajosxParametros(parametros_get, {callback: cargarMiCuenta}));
        dispatch(actions.fetchConfiguracionesCostos({callback: cargarHorasHojasTrabajoHoy}));

    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearHorasHojasTrabajos());
        }
    }, []);

    const method_pool = {
        fetchObjectMethod: (id, options) => alert('metodo fetch no definido'),
        deleteObjectMethod: (id, options) => alert('metodo delete no definido'),
        createObjectMethod: (item, options) => alert('metodo create no definido'),
        updateObjectMethod: (id, item, options) => alert('metodo update no definido'),
    };
    return (
        <Fragment>
            <div>
                <label>Colaborador</label>
                <Combobox
                    className="col-6"
                    data={_.map(colaboradores, c => ({nombre: `${c.nombres} ${c.apellidos}`, id: c.id}))}
                    onSelect={(e) => setColaboradorIdFiltro(e.id)}
                    filter='contains'
                    placeholder='Seleccionar Colaborador'
                    valueField='id'
                    textField='nombre'
                />
            </div>
            <RangoFechas metodoBusquedaFechas={(i, f) => {
                let parametros_get = [
                    {llave: 'fecha_inicial', valor: i},
                    {llave: 'fecha_final', valor: f},
                ];
                if (colaborador_id_filtro) {
                    parametros_get = [...parametros_get, {llave: 'colaborador_id', valor: colaborador_id_filtro}]
                }
                dispatch(actions.fetchHorasHojasTrabajosxParametros(parametros_get));
            }}/>
            <CRUD
                method_pool={method_pool}
                list={horas}
                permisos_object={{...permisos, add: false}}
                plural_name='Horas Hojas de Trabajo'
                singular_name='Hora Hoja de Trabajo'
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});
export default List;