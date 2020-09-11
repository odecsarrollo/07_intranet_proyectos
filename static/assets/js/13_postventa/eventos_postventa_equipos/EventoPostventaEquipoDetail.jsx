import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fechaFormatoUno} from "../../00_utilities/common";
import DetailLayout from "../../00_utilities/components/ui/detail_layout/DetailLayout";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import * as actions from "../../01_actions/01_index";
import {POSTVENTA_EVENTOS_EQUIPOS} from "../../permisos";
import ValidarPermisos from "../../permisos/validar_permisos";

const EventoPostventaEquipoDetail = (props) => {
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(POSTVENTA_EVENTOS_EQUIPOS);
    const evento = useSelector(state => state.postventa_ordenes_servicio[id]);
    useEffect(() => {
        dispatch(actions.fetchPostventaEventoEquipo(id));
        return () => dispatch(actions.clearPostventaEventosEquipos());
    }, []);
    if (!evento) {
        return <div>Cargando...</div>
    }

    return <ValidarPermisos can_see={permisos.detail} nombre='Factura de cliente'>
        <DetailLayout
            titulo={`Orden Servicio`}
            info_items={[
                {
                    label: 'Cliente',
                    text_value: evento.cliente_nombre,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                {label: 'Nit', text_value: evento.cliente_nit, className: 'col-12 col-md-4 col-xl-3'},
                {
                    label: 'Fecha Documento',
                    text_value: fechaFormatoUno(evento.fecha_solicitud),
                    className: 'col-12 col-md-4 col-xl-3'
                }
            ]}
        >

        </DetailLayout>
    </ValidarPermisos>
};

export default EventoPostventaEquipoDetail;