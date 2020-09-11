import React, {useContext, Fragment} from 'react';
import {numeroFormato, pesosColombianos} from "../../../00_utilities/common";
import StylesContext from "../../../00_utilities/contexts/StylesContext";

const ProyectoDetailCotizacionesTable = (props) => {
    const {proyecto} = props;
    const {table} = useContext(StylesContext);
    return (
        <div className='row'>
            <div className="col-12 col-md-4">
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

                    <tr style={table.tr}>
                        <td style={table.td}>Costo Presu.</td>
                        <td style={table.td_right}>{pesosColombianos(proyecto.costo_presupuestado_cotizaciones + proyecto.costo_presupuestado_cotizaciones_adicional)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="col-12">
                <table className='table table-striped table-responsive'>
                    <thead>
                    <tr style={table.tr}>
                        <td style={table.td}>MO</td>
                        <td style={table.td}>Materiales</td>
                        <td style={table.td}>Total</td>
                        <td style={table.td}>CIF Est.</td>
                        <td style={table.td}>Total + CIF</td>
                        <td style={table.td}>Valor OC.</td>
                        <td style={table.td}>% Ejecución Costos</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr style={table.tr}>
                        <td style={table.td_right}>{pesosColombianos(proyecto.costo_mano_obra)}</td>
                        <td style={table.td_right}>{pesosColombianos(proyecto.costo_materiales)}</td>
                        <td style={table.td_right}>{pesosColombianos(proyecto.costo_materiales + proyecto.costo_mano_obra)}</td>
                        <td style={table.td_right}>15%</td>
                        <td style={table.td_right}>{pesosColombianos((proyecto.costo_materiales + proyecto.costo_mano_obra) * (1.15))}</td>
                        <td style={table.td_right}>{pesosColombianos(proyecto.valor_orden_compra_cotizaciones + proyecto.valor_orden_compra_cotizaciones_adicional)}</td>
                        <td style={table.td_right}>{numeroFormato((((proyecto.costo_materiales + proyecto.costo_mano_obra) * (1.15)) / (proyecto.valor_orden_compra_cotizaciones + proyecto.valor_orden_compra_cotizaciones_adicional)) * 100, 2)}%</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default ProyectoDetailCotizacionesTable;