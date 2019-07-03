import React, {memo} from 'react';
import {fechaFormatoDos, pesosColombianos, numeroFormato} from '../../../../00_utilities/common';
import {ListaBusqueda} from '../../../../00_utilities/utiles';

const ItemTabla = memo((props) => {
    const {item, item: {item_biable}, ultimo_costo_item_biable} = props;
    return (
        <tr>
            <td>{fechaFormatoDos(item.lapso)}</td>
            <td>{item_biable.id_item}</td>
            <td>{item_biable.id_referencia}</td>
            <td>{item_biable.descripcion}</td>
            <td>{numeroFormato(item.cantidad)}</td>
            <td>{item_biable.unidad_medida_inventario}</td>
            {ultimo_costo_item_biable && <td>{pesosColombianos(item.costo_total)}</td>}
        </tr>
    )
});

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (item) => {
        return (
            item.item_biable && (
                item.item_biable.descripcion.toUpperCase().includes(busqueda.toUpperCase()) ||
                item.item_biable.id_referencia.toUpperCase().includes(busqueda.toUpperCase()) ||
                fechaFormatoDos(item.lapso).toUpperCase().includes(busqueda.toUpperCase()) ||
                item.item_biable.id_item.toString().toUpperCase().includes(busqueda.toUpperCase())
            )
        )
    });
};

const Tabla = (props) => {
    let {materiales, permisos_proyecto} = props;
    return (
        <ListaBusqueda>
            {
                busqueda => {
                    const listado_materiales = buscarBusqueda(_.orderBy(materiales, ['lapso'], ['desc']), busqueda);
                    return (
                        <table className="table table-responsive table-striped tabla-maestra">
                            <thead>
                            <tr>
                                <th>Lapso</th>
                                <th>Id CGUNO</th>
                                <th>Referencia</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Unidad</th>
                                {permisos_proyecto.ultimo_costo_item_biable && <th>Costo Total</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {_.map(listado_materiales, item => {
                                return <ItemTabla
                                    key={item.id}
                                    item={item}
                                    ultimo_costo_item_biable={permisos_proyecto.ultimo_costo_item_biable}
                                />
                            })}
                            </tbody>
                            <tfoot>

                            </tfoot>
                        </table>
                    )
                }
            }
        </ListaBusqueda>
    )
};

export default Tabla;