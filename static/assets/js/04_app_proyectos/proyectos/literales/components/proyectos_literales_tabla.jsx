import React, {memo} from 'react';
import {pesosColombianos} from '../../../../00_utilities/common';

const style = {
    tabla: {
        fontSize: '9px',
        tr: {
            td: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
            td_numero: {
                margin: 0,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 4,
                paddingRight: 4,
                textAlign: 'right',
            },
            th_numero: {
                margin: 0,
                textAlign: 'right',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
            th: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
        }
    }
};

const ItemTabla = memo(props => {
    const {
        select_literal_id,
        onSelectItem,
        item,
        permisos
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
        lista_literales,
        proyecto,
        permisos
    } = props;
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
            {_.map(_.orderBy(lista_literales, ['id_literal'], ['asc']), item => {
                return <ItemTabla key={item.id} item={item} {...props}/>
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