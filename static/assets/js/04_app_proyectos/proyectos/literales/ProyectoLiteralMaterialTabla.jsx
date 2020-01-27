import React, {memo} from 'react';
import {fechaFormatoDos, pesosColombianos, numeroFormato} from '../../../00_utilities/common';
import {ListaBusqueda} from '../../../00_utilities/utiles';

const ItemTabla = memo((props) => {
    const {material, material: {item}, ultimo_costo_item_biable} = props;
    return (
        <tr>
            <td>{fechaFormatoDos(material.lapso)}</td>
            <td>{item.id_item}</td>
            <td>{item.id_referencia}</td>
            <td>{item.descripcion}</td>
            <td>{numeroFormato(material.cantidad)}</td>
            <td>{item.unidad_medida_inventario}</td>
            <td>{item.sistema_informacion === 1 ? 'CGUno' : 'Siesa Cloud'}</td>
            {ultimo_costo_item_biable && <td>{pesosColombianos(material.costo_total)}</td>}
        </tr>
    )
});

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (material) => {
        return (
            material.item && (
                material.item.descripcion.toUpperCase().includes(busqueda.toUpperCase()) ||
                material.item.id_referencia.toUpperCase().includes(busqueda.toUpperCase()) ||
                fechaFormatoDos(material.lapso).toUpperCase().includes(busqueda.toUpperCase()) ||
                material.item.id_item.toString().toUpperCase().includes(busqueda.toUpperCase())
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
                                <th>Origen</th>
                                {permisos_proyecto.ultimo_costo_item_biable && <th>Costo Total</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {_.map(listado_materiales, material => {
                                return <ItemTabla
                                    key={material.id}
                                    material={material}
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