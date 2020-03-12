import React, {useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';
import * as actions from "../../01_actions/01_index";
import FacturaDetailTabla from "./FacturaDetailTabla";
import DetailLayout from "../../00_utilities/components/ui/detail_layout/DetailLayout";
import {fechaHoraFormatoUno} from "../../00_utilities/common";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {FACTURAS} from "../../permisos";
import ValidarPermisos from "../../permisos/validar_permisos";

const FacturaDetail = (props) => {
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const permisos = useTengoPermisos(FACTURAS);
    const factura = useSelector(state => state.facturas[id]);
    useEffect(() => {
        dispatch(actions.fetchFactura(id));
        return () => dispatch(actions.clearFacturas());
    }, []);
    if (!factura) {
        return <div>Cargando...</div>
    }
    const items_cotizaciones_componentes = factura.cotizaciones_componentes.map(f => ({
        label: f.nro_consecutivo.toString(),
        id: f.id,
        link: `/app/ventas_componentes/cotizaciones/detail/${f.id}`,
        className: 'col-12 col-md-4 col-xl-3'
    }));
    return <ValidarPermisos can_see={permisos.detail} nombre='Factura de cliente'>
        <DetailLayout
            titulo={`Factura ${factura.tipo_documento}-${factura.nro_documento}`}
            info_items={[
                {label: 'Cliente', text_value: factura.cliente_nombre, className: 'col-12 col-md-4 col-xl-3'},
                {label: 'Nit', text_value: factura.cliente_nit, className: 'col-12 col-md-4 col-xl-3'},
                {
                    label: 'Vendedor',
                    text_value: `${factura.vendedor_nombre} ${factura.vendedor_apellido}`,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                {
                    label: 'Fecha Documento',
                    text_value: fechaHoraFormatoUno(factura.fecha_documento),
                    className: 'col-12 col-md-4 col-xl-3'
                }
            ]}
            info_list_items_link={[
                {
                    titulo: 'Cotizaciones Relacionadas',
                    items: items_cotizaciones_componentes,
                    className: 'col-12'
                },
            ]}
        >
            <FacturaDetailTabla factura={factura} list={factura.items} permisos_factura={permisos}/>
        </DetailLayout>
    </ValidarPermisos>
};

export default FacturaDetail;