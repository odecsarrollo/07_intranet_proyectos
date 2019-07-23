import React, {Fragment, memo, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {Titulo, SinObjeto} from "../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import {fechaFormatoUno, pesosColombianos} from "../../../00_utilities/common";
import {
    MANOS_OBRAS_HOJAS_TRABAJOS,
    MANOS_OBRAS_HORAS_HOJAS_TRABAJOS
} from "../../../permisos";
import CreateForm from './forms/HojaTrabajoDetailHoraCRUDForm';
import Tabla from './HojaTrabajoDetailHoraCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUDHorasHojasTrabajoList = crudHOC(CreateForm, Tabla);

const Detail = memo(props => {
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(MANOS_OBRAS_HOJAS_TRABAJOS);
    const permisos_horas = useTengoPermisos(MANOS_OBRAS_HORAS_HOJAS_TRABAJOS);
    const object = useSelector(state => state.hojas_trabajos_diarios[id]);
    const configuracion_costos = useSelector(state => _.map(state.configuracion_costos, c => c)[0]);

    const cargarDatos = () => {
        const cargarProyectos = () => dispatch(actions.fetchProyectosConLiteralesAbiertos());
        const cargarHojaTrabajo = () => dispatch(actions.fetchHojaTrabajo(id, {callback: cargarProyectos}));
        const cargarMiCuenta = () => dispatch(actions.fetchMiCuenta({callback: cargarHojaTrabajo}));
        dispatch(actions.fetchConfiguracionesCostos({callback: cargarMiCuenta}));

    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearHojasTrabajos());
            dispatch(actions.clearProyectos());
        }
    }, []);

    if (!object) {
        return <SinObjeto/>
    }

    const {
        colaborador_nombre,
        fecha,
        tasa_valor_hora,
        costo_total,
        mis_horas_trabajadas,
    } = object;

    const fecha_cierre = configuracion_costos ? configuracion_costos.fecha_cierre : null;
    const fecha_registro = object ? object.fecha : null;
    const puede_modificar = fecha_cierre && fecha_registro ? object.fecha > fecha_cierre : true;

    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchHoraHojaTrabajo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteHoraHojaTrabajo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createHoraHojaTrabajo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateHoraHojaTrabajo(id, item, options)),
    };

    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de hoja de trabajo'>
            <Titulo>Detalle {object.username}</Titulo>
            <div className="row">
                <div className="col-md-6">
                    <strong>Colaborador: </strong>{colaborador_nombre}
                </div>
                <div className="col-md-6">
                    <strong>Fecha: </strong>{fechaFormatoUno(fecha)}
                </div>
                {
                    permisos.costos &&
                    <Fragment>
                        <div className="col-md-6">
                            <strong>Valor Hora: </strong>{pesosColombianos(tasa_valor_hora)}
                        </div>
                        < div className="col-md-6">
                            <strong>Costo Total: </strong>{pesosColombianos(costo_total)}
                        </div>
                    </Fragment>
                }
            </div>
            <CRUDHorasHojasTrabajoList
                posCreateMethod={(r) => dispatch(actions.fetchHojaTrabajo(r.hoja))}
                posUpdateMethod={(r) => dispatch(actions.fetchHojaTrabajo(r.hoja))}
                posDeleteMethod={() => dispatch(actions.fetchHojaTrabajo(id))}
                method_pool={method_pool}
                list={_.mapKeys(mis_horas_trabajadas, 'id')}
                permisos_object={{
                    ...permisos_horas,
                    add: permisos_horas.add && puede_modificar,
                    delete: permisos_horas.delete && puede_modificar
                }}
                permisos_hoja={permisos}
                hoja_trabajo={object}
                plural_name='Horas Hojas de Trabajo'
                singular_name='Hora Hoja de Trabajo'
                cargarDatos={cargarDatos}
            />
        </ValidarPermisos>
    )

});

export default Detail;