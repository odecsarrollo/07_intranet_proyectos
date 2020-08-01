import React, {Fragment, useContext} from "react";
import {pesosColombianos} from "../../../00_utilities/common";
import StylesContext from "../../../00_utilities/contexts/StylesContext";

const CotizacionDetailInfoValoresTable = (props) => {
    const {cotizacion} = props;
    const {table} = useContext(StylesContext);
    return (
        <table className='table table-striped'>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}></th>
                <th style={table.td}>Valor OC.</th>
                <th style={table.td}>Recaudo</th>
                <th style={table.td}>Costo Presu.</th>
            </tr>
            </thead>
            <tbody>
            <tr style={table.tr}>
                <td style={table.td}>Cotización</td>
                <td style={table.td_right}>{pesosColombianos(cotizacion.valores_oc)}</td>
                <td style={table.td_right}>{pesosColombianos(cotizacion.pagos)}</td>
                <td style={table.td_right}>{pesosColombianos(cotizacion.costo_presupuestado)}</td>
            </tr>
            {(cotizacion.valor_orden_compra_adicionales > 0 || cotizacion.costo_presupuestado_adicionales > 0) &&
            <Fragment>
                <tr style={table.tr}>
                    <td style={table.td}>Cotizaciones Adicionales</td>
                    <td style={table.td_right}>{pesosColombianos(cotizacion.valores_oc_adicionales)}</td>
                    <td style={table.td_right}>{pesosColombianos(cotizacion.pagos_adicionales)}</td>
                    <td style={table.td_right}>{pesosColombianos(cotizacion.costo_presupuestado_adicionales)}</td>
                </tr>
            </Fragment>}
            </tbody>
            <tfoot>
            <tr style={table.tr}>
                <td style={table.td}>Total</td>
                <td style={table.td_right}>{pesosColombianos(cotizacion.valores_oc + cotizacion.valores_oc_adicionales)}</td>
                <td style={table.td_right}>{pesosColombianos(cotizacion.pagos + cotizacion.pagos_adicionales)}</td>
                <td style={table.td_right}>{pesosColombianos(cotizacion.costo_presupuestado + cotizacion.costo_presupuestado_adicionales)}</td>
            </tr>
            </tfoot>
        </table>
    )
};

export default CotizacionDetailInfoValoresTable;