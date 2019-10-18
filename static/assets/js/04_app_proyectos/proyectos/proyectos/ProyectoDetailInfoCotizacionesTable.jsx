import React, {Fragment, useContext} from 'react';
import {pesosColombianos} from "../../../00_utilities/common";
import StylesContext from "../../../00_utilities/contexts/StylesContext";

const ProyectoDetailCotizacionesTable = (props) => {
    const {proyecto} = props;
    const {table} = useContext(StylesContext);
    return (
        <table className='table table-striped table-responsive'>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Tipo</th>
                <th style={table.td}>$</th>
            </tr>
            </thead>
            <tbody>
            <tr style={table.tr}>
                <td style={table.td}>Valor OC.</td>
                <td style={table.td_right}>{pesosColombianos(proyecto.valor_orden_compra_cotizaciones + proyecto.valor_orden_compra_cotizaciones_adicional)}</td>
            </tr>
            <Fragment>
                <tr style={table.tr}>
                    <td style={table.td}>Costo Presu.</td>
                    <td style={table.td_right}>{pesosColombianos(proyecto.costo_presupuestado_cotizaciones + proyecto.costo_presupuestado_cotizaciones_adicional)}</td>
                </tr>
            </Fragment>
            </tbody>
        </table>
    )
};

export default ProyectoDetailCotizacionesTable;