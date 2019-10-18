import React, {memo, useContext} from 'react';
import {fechaFormatoUno, pesosColombianos} from "../../../00_utilities/common";
import StylesContext from "../../../00_utilities/contexts/StylesContext";

const FacturaList = memo((props) => {
    const {facturas} = props;
    const {table} = useContext(StylesContext);
    return (
        <table className='table table-striped table-responsive' style={table.tabla}>
            <thead>
            <tr>
                <th style={table.tr.th}>Literal</th>
                <th style={table.tr.th}>Fecha</th>
                <th style={table.tr.th}>Item</th>
                <th style={table.tr.th}>Nro. Documento</th>
                <th style={table.tr.th}>Precio</th>
                <th style={table.tr.th}>Iva</th>
                <th style={table.tr.th}>Total</th>
            </tr>
            </thead>
            <tbody>
            {_.orderBy(facturas, ['fecha'], ['desc']).map(f => (
                <tr key={f.id}>
                    <td style={table.tr.td}>{f.literal_nombre}</td>
                    <td style={table.tr.td}>{fechaFormatoUno(f.fecha)}</td>
                    <td style={table.tr.td}>{f.concepto}</td>
                    <td style={table.tr.td}>{f.documento}</td>
                    <td style={table.tr.td_numero}>{pesosColombianos(f.valor_sin_impuesto)}</td>
                    <td style={table.tr.td_numero}>{pesosColombianos(f.impuesto)}</td>
                    <td style={table.tr.td_numero}>{pesosColombianos(parseFloat(f.impuesto) + parseFloat(f.valor_sin_impuesto))}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
});

export default FacturaList;