import React, {memo, useContext} from 'react';
import StylesContext from "../../../00_utilities/contexts/StylesContext";
import {pesosColombianos} from "../../../00_utilities/common";

const CotizadorListaPrecioTablaItem = memo(props => {
    const {item, adicionarItem} = props;
    const {
        item_descripcion,
        item_referencia,
        tipo_item,
        item_unidad_medida,
        precio_unitario,
        precio_unitario_aereo,
        id_item,
        forma_pago_id,
        origen
    } = item;
    const adicionarItemConPrecio = (precio, transporte_tipo) => {
        if (!adicionarItem || precio <= 0) {
            return null
        }
        return adicionarItem(
            tipo_item,
            precio,
            item_descripcion,
            item_referencia,
            item_unidad_medida,
            transporte_tipo,
            id_item,
            forma_pago_id
        )
    };
    return (
        <tr>
            <td>{tipo_item}</td>
            <td>{item_referencia}</td>
            <td>{item_descripcion}</td>
            <td>{item_unidad_medida}</td>
            <td>
                <span className='puntero'
                      onClick={() => adicionarItemConPrecio(precio_unitario, 'CONVENCIONAL')}>
                    {pesosColombianos(precio_unitario)}
                </span>
            </td>
            <td>
                <span className='puntero'
                      onClick={() => adicionarItemConPrecio(precio_unitario_aereo, 'AEREO')}>
                    {pesosColombianos(precio_unitario_aereo)}
                </span>
            </td>
            <td>{origen}</td>
        </tr>
    )
});

const CotizadorListaPrecioTabla = memo(props => {
    const {table} = useContext(StylesContext);
    const {items, adicionarItem = null} = props;
    return (
        <table className='table table-striped table-responsive' style={table}>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Tipo</th>
                <th style={table.td}>Referencia</th>
                <th style={table.td}>Descripción</th>
                <th style={table.td}>Uni. Med</th>
                <th style={table.td}>$</th>
                <th style={table.td}>$ Aéreo</th>
                <th style={table.td}>Origen</th>
            </tr>
            </thead>
            <tbody>
            {items.map(i => <CotizadorListaPrecioTablaItem
                key={`${i.tipo_item}-${i.id_item}`}
                item={i}
                adicionarItem={adicionarItem}
            />)}
            </tbody>
            <tfoot>
            </tfoot>
        </table>
    )
});

export default CotizadorListaPrecioTabla;