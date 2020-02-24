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
        >
            <FacturaDetailTabla factura={factura} list={factura.items} permisos_factura={permisos}/>
        </DetailLayout>
    </ValidarPermisos>
};

export default FacturaDetail;