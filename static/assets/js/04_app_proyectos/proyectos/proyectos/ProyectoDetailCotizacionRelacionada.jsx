import React, {useContext} from "react";
import StylesContext from "../../../00_utilities/contexts/StylesContext";
import {fechaFormatoUno, pesosColombianos} from "../../../00_utilities/common";
import {Link} from "react-router-dom";

const ProyectoDetailCotizacionRelacionada = props => {
    const {proyecto: {cotizaciones}} = props;
    const {table} = useContext(StylesContext);
    let cotizaciones_proyecto = cotizaciones.map(c => ({
        literales: [],
        tipo: 1,
        es_adicional: false,
        id: c.id,
        valor_orden_compra: c.valor_orden_compra,
        costo_presupuestado: c.costo_presupuestado,
        codigo: `${c.unidad_negocio}-${c.nro_cotizacion}`,
        estado: c.estado,
        created: c.created,
        orden_compra_nro: c.orden_compra_nro,
        fecha_entrega_pactada: c.fecha_entrega_pactada
    }));
    cotizaciones.map(c => c.cotizaciones_adicionales.filter(e => e.estado === 'Cierre (Aprobado)').map(a => {
        cotizaciones_proyecto = [...cotizaciones_proyecto, {
            literales: [a.literales],
            es_adicional: true,
            tipo: 2,
            id: a.id,
            valor_orden_compra: a.valor_orden_compra,
            costo_presupuestado: a.costo_presupuestado,
            codigo: `${a.unidad_negocio}-${a.nro_cotizacion}`,
            estado: a.estado,
            created: a.created,
            orden_compra_nro: a.orden_compra_nro,
            fecha_entrega_pactada: a.fecha_entrega_pactada
        }]
    }));
    cotizaciones_proyecto = _.orderBy(cotizaciones_proyecto, ['tipo'], ['asc']);

    return (
        <table className='table table-striped table-responsive'>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}># Cotizacion</th>
                <th style={table.td}>Tipo</th>
                <th style={table.td}>Fec. Creación</th>
                <th style={table.td}>Fec. Pac. Entrega</th>
                <th style={table.td}># OC</th>
                <th style={table.td}>$ OC</th>
                <th style={table.td}>$ Costo Presu.</th>
            </tr>
            </thead>
            <tbody>
            {cotizaciones_proyecto.map(c => <tr key={c.id} style={table.tr}>
                <td style={table.td}>
                    <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${c.id}`}
                          target="_blank">{c.codigo}</Link>
                </td>
                <td style={table.td}>{c.es_adicional ? 'Adicional' : 'Inicial'}</td>
                <td style={table.td_right}>{fechaFormatoUno(c.created)}</td>
                <td style={table.td_right}>{fechaFormatoUno(c.fecha_entrega_pactada)}</td>
                <td style={table.td_right}>{c.orden_compra_nro}</td>
                <td style={table.td_right}>{pesosColombianos(c.valores_oc)}</td>
                <td style={table.td_right}>{pesosColombianos(c.costo_presupuestado)}</td>
            </tr>)}
            </tbody>
            <tfoot>
            <tr>
                <td style={table.td} colSpan={5}>Total</td>
                <td style={table.td_right}>{pesosColombianos(cotizaciones_proyecto.map(c => c.valores_oc).reduce(((total, actual) => total + actual)))}</td>
                <td style={table.td_right}>{pesosColombianos(cotizaciones_proyecto.map(c => c.costo_presupuestado).reduce(((total, actual) => total + actual)))}</td>
            </tr>
            </tfoot>
        </table>
    )
};
export default ProyectoDetailCotizacionRelacionada;