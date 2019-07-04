import React, {memo} from 'react';
import {pesosColombianos} from '../../../../00_utilities/common';

const ItemTabla = memo(props => {
    const {
        select_literal_id,
        onSelectItem,
        item,
        permisos,
        style
    } = props;
    return (
        <tr className={select_literal_id === item.id ? 'tr-seleccionado' : ''}
            style={{cursor: "pointer"}}
            onClick={() => {
                onSelectItem(item.id);
            }}
        >
            <td style={style.tabla.tr.td}>
                {item.id_literal}
            </td>
            {permisos.costo_materiales &&
            <td style={style.tabla.tr.td_numero}>
                {pesosColombianos(item.costo_materiales)}
            </td>
            }
            {permisos.costo_mano_obra &&
            <td style={style.tabla.tr.td_numero}>
                {pesosColombianos(Number(item.costo_mano_obra) + Number(item.costo_mano_obra_inicial))}
            </td>
            }
            {permisos.costo &&
            <td style={style.tabla.tr.td_numero}>
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
    return (
        <table className="table table-responsive table-striped tabla-maestra" style={style.tabla}>
            <thead>
            <tr>
                <th style={style.tabla.tr.th}>Proyecto</th>
                {permisos.costo_materiales && <th style={style.tabla.tr.th_numero}>Cost. Mater.</th>}
                {permisos.costo_mano_obra && <th style={style.tabla.tr.th_numero}>Costo MO</th>}
                {permisos.costo && <th style={style.tabla.tr.th_numero}>Costo Total</th>}
            </tr>
            </thead>
            <tbody>
            {_.orderBy(lista_literales, ['id_literal'], ['asc']).map(item => {
                return <ItemTabla
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
            <tr>
                <td></td>
                {permisos.costo_materiales &&
                <td style={style.tabla.tr.td_numero}>{pesosColombianos(proyecto.costo_materiales)}</td>}
                {permisos.costo_mano_obra &&
                <td style={style.tabla.tr.td_numero}>{pesosColombianos(Number(proyecto.costo_mano_obra) + Number(proyecto.costo_mano_obra_inicial))}</td>}
                {permisos.costo &&
                <td style={style.tabla.tr.td_numero}>{pesosColombianos(Number(proyecto.costo_mano_obra) + Number(proyecto.costo_mano_obra_inicial) + Number(proyecto.costo_materiales))}</td>}
            </tr>
            </tfoot>
        </table>
    )
});

export default TablaProyectosLiterales;