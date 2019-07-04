import React, {memo} from 'react';
import {fechaFormatoUno, pesosColombianos} from "../../../../00_utilities/common";

const FacturaList = memo((props) => {
    const {facturas, style} = props;
    return (
        <table className='table table-striped table-responsive' style={style.tabla}>
            <thead>
            <tr>
                <th style={style.tabla.tr.th}>Literal</th>
                <th style={style.tabla.tr.th}>Fecha</th>
                <th style={style.tabla.tr.th}>Item</th>
                <th style={style.tabla.tr.th}>Nro. Documento</th>
                <th style={style.tabla.tr.th}>Precio</th>
                <th style={style.tabla.tr.th}>Iva</th>
                <th style={style.tabla.tr.th}>Total</th>
            </tr>
            </thead>
            <tbody>
            {_.orderBy(facturas, ['fecha'], ['desc']).map(f => (
                <tr key={f.id}>
                    <td style={style.tabla.tr.td}>{f.literal_nombre}</td>
                    <td style={style.tabla.tr.td}>{fechaFormatoUno(f.fecha)}</td>
                    <td style={style.tabla.tr.td}>{f.concepto}</td>
                    <td style={style.tabla.tr.td}>{f.documento}</td>
                    <td style={style.tabla.tr.td_numero}>{pesosColombianos(f.valor_sin_impuesto)}</td>
                    <td style={style.tabla.tr.td_numero}>{pesosColombianos(f.impuesto)}</td>
                    <td style={style.tabla.tr.td_numero}>{pesosColombianos(parseFloat(f.impuesto) + parseFloat(f.valor_sin_impuesto))}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
});

export default FacturaList;