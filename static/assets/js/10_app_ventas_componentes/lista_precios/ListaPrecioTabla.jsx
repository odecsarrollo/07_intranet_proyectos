import React, {memo, useContext, Fragment} from 'react';
import StylesContext from "../../00_utilities/contexts/StylesContext";
import {pesosColombianos} from "../../00_utilities/common";
import PropTypes from "prop-types";
import * as _ from 'lodash';

const CotizadorListaPrecioTablaItem = memo(props => {
    const {
        item,
        con_precios,
        con_costos,
        adicionarItem = null
    } = props;
    const {
        item_descripcion,
        item_referencia,
        tipo_item,
        item_unidad_medida,
        precio_unitario,
        precio_unitario_aereo,
        id_item,
        forma_pago_id,
        origen,
        costo_cop,
        costo_cop_aereo,
        unidades_disponibles,
        fecha_ultima_entrada,
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
            <td>{unidades_disponibles}</td>
            <td>{item_unidad_medida}</td>
            <td>{fecha_ultima_entrada}</td>
            {con_precios && <Fragment>
                <td>
                <span className={adicionarItem ? 'puntero' : ''}
                      onClick={() => adicionarItem ? adicionarItemConPrecio(precio_unitario, 'CONVENCIONAL') : null}>
                    {pesosColombianos(precio_unitario)}
                </span>
                </td>
                <td>
                <span className={adicionarItem ? 'puntero' : ''}
                      onClick={() => adicionarItem ? adicionarItemConPrecio(precio_unitario_aereo, 'AEREO') : null}>
                    {pesosColombianos(precio_unitario_aereo)}
                </span>
                </td>
            </Fragment>}
            {con_costos && <Fragment>
                <td>{pesosColombianos(costo_cop)}</td>
                <td>{pesosColombianos(costo_cop_aereo)}</td>
            </Fragment>}
            <td>{origen}</td>
        </tr>
    )
});
CotizadorListaPrecioTablaItem.propTypes = {
    adicionarItem: PropTypes.func,
    con_costos: PropTypes.bool,
    con_precios: PropTypes.bool,
};

function areEqual(prevProps, nextProps) {
    return _.isEqual(prevProps.items, nextProps.items);
}


const ListaPrecioTabla = memo(props => {
    const {table} = useContext(StylesContext);
    const {
        items,
        adicionarItem = null,
        con_costos = true,
        con_precios = true,
    } = props;
    return (
        <table className='table table-striped table-responsive' style={table}>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Tipo</th>
                <th style={table.td}>Referencia</th>
                <th style={table.td}>Descripción</th>
                <th style={table.td}>Inv.</th>
                <th style={table.td}>Uni. Med</th>
                <th style={table.td}>Inv. Fecha Entr.</th>
                {con_precios && <Fragment>
                    <th style={table.td}>$Vlr. Marítimo</th>
                    <th style={table.td}>$Vlr. Aéreo</th>
                </Fragment>}
                {con_costos && <Fragment>
                    <th style={table.td}>Cos. Marítimo</th>
                    <th style={table.td}>Cos. Aéreo</th>
                </Fragment>}
                <th style={table.td}>Origen</th>
            </tr>
            </thead>
            <tbody>
            {items.map(i => <CotizadorListaPrecioTablaItem
                con_precios={con_precios}
                con_costos={con_costos}
                key={`${i.tipo_item}-${i.id_item}`}
                item={i}
                adicionarItem={adicionarItem}
            />)}
            </tbody>
            <tfoot>
            </tfoot>
        </table>
    )
}, areEqual);
ListaPrecioTabla.propTypes = {
    adicionarItem: PropTypes.func,
    con_costos: PropTypes.bool,
    con_precios: PropTypes.bool,
    items: PropTypes.array.isRequired
};

export default ListaPrecioTabla;