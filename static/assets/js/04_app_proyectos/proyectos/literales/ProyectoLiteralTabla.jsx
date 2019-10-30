import React, {memo, useContext} from 'react';
import {pesosColombianos} from '../../../00_utilities/common';
import StylesContext from "../../../00_utilities/contexts/StylesContext";

const ItemTabla = memo(props => {
    const {
        select_literal_id,
        onSelectItem,
        item,
        table,
        permisos,
    } = props;
    return (
        <tr className={select_literal_id === item.id ? 'tr-seleccionado' : ''}
            style={{...table, cursor: "pointer"}}
            onClick={() => {
                onSelectItem(item.id);
            }}
        >
            <td style={table.td}>
                {item.id_literal}
            </td>
            {permisos.costo_materiales &&
            <td style={table.td_right}>
                {pesosColombianos(item.costo_materiales)}
            </td>
            }
            {permisos.costo_mano_obra &&
            <td style={table.td_right}>
                {pesosColombianos(Number(item.costo_mano_obra) + Number(item.costo_mano_obra_inicial))}
            </td>
            }
            {permisos.costo &&
            <td style={table.td_right}>
                {pesosColombianos(Number(item.costo_mano_obra) + Number(item.costo_mano_obra_inicial) + Number(item.costo_materiales))}
            </td>
            }
        </tr>
    )
});


const TablaProyectosLiterales = memo(props => {
    const {
        proyecto,
        permisos,
        style,
        select_literal_id,
        onSelectItem
    } = props;
    let {lista_literales} = props;
    _.map(lista_literales, l => {
        const costo_mano_obra = _.reduce(l.mis_horas_trabajadas, (total, h) => parseFloat(total) + parseFloat(h.costo_total), 0);
        const costo_mano_obra_inicial = _.reduce(l.mis_horas_trabajadas_iniciales, (total, h) => parseFloat(total) + parseFloat(h.valor), 0);
        lista_literales = {...lista_literales, [l.id]: {...l, costo_mano_obra, costo_mano_obra_inicial}}
    });
    let {table} = useContext(StylesContext);
    table = {...table, fontSize: '0.7rem'};
    return (
        <table className='table table-striped table-responsive tabla-maestra'>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Proyecto</th>
                {permisos.costo_materiales && <th style={table.td}>Cost. Mater.</th>}
                {permisos.costo_mano_obra && <th style={table.td}>Costo MO</th>}
                {permisos.costo && <th style={table.td}>Costo Total</th>}
            </tr>
            </thead>
            <tbody>
            {_.orderBy(lista_literales, ['id_literal'], ['asc']).map(item => {
                return <ItemTabla
                    table={table}
                    key={item.id}
                    item={item}
                    select_literal_id={select_literal_id}
                    onSelectItem={onSelectItem}
                    permisos={permisos}
                    style={style}
                />
            })}
            </tbody>
            <tfoot>
            <tr style={table.tr}>
                <td style={table.td}>Total</td>
                {permisos.costo_materiales &&
                <td style={table.td_right}>{pesosColombianos(proyecto.costo_materiales)}</td>}
                {permisos.costo_mano_obra &&
                <td style={table.td_right}>{pesosColombianos(Number(proyecto.costo_mano_obra) + Number(proyecto.costo_mano_obra_inicial))}</td>}
                {permisos.costo &&
                <td style={table.td_right}>{pesosColombianos(Number(proyecto.costo_mano_obra) + Number(proyecto.costo_mano_obra_inicial) + Number(proyecto.costo_materiales))}</td>}
            </tr>
            </tfoot>
        </table>
    )
});

export default TablaProyectosLiterales;