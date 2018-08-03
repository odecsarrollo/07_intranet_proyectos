import React, {Fragment} from 'react';
import {pesosColombianos} from '../../../../00_utilities/common';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import CargueListadoMateriales from '../../listado_materiales/containers/cargue_materiales';
import TablaListadoMateriales from '../../listado_materiales/components/listado_materiales_tabla';

const ItemTabla = (props) => {
    const {item, item: {item_biable}, can_see_ultimo_costo_item_biable} = props;
    return (
        <tr>
            <td>{item_biable.id_item}</td>
            <td>{item_biable.id_referencia}</td>
            <td>{item_biable.descripcion}</td>
            <td>{item.cantidad}</td>
            <td>{item_biable.unidad_medida_inventario}</td>
            {can_see_ultimo_costo_item_biable && <td>{pesosColombianos(item.costo_total)}</td>}
        </tr>
    )
};

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (item) => {
        return (
            item.item_biable && (
                item.item_biable.descripcion.toUpperCase().includes(busqueda.toUpperCase()) ||
                item.item_biable.id_referencia.toUpperCase().includes(busqueda.toUpperCase()) ||
                item.item_biable.id_item.toString().toUpperCase().includes(busqueda.toUpperCase())
            )
        )
    });
};

const TablaProyectosLiteralesMateriales = (props) => {
    const {
        onTabClick,
        items_literales,
        can_see_ultimo_costo_item_biable,
        items_listados_materiales
    } = props;
    return (
        <Fragment>
            <Tabs>
                <TabList>
                    <Tab onClick={() => onTabClick(0)}>Descargue Inventario</Tab>
                    <Tab onClick={() => onTabClick(2)}>Listado Materiales</Tab>
                </TabList>
                <TabPanel>
                    <ListaBusqueda>
                        {
                            busqueda => {
                                const listado_materiales = buscarBusqueda(items_literales, busqueda);
                                return (
                                    <table className="table table-responsive table-striped tabla-maestra">
                                        <thead>
                                        <tr>
                                            <th>Id CGUNO</th>
                                            <th>Referencia</th>
                                            <th>Nombre</th>
                                            <th>Cantidad</th>
                                            <th>Unidad</th>
                                            {can_see_ultimo_costo_item_biable && <th>Costo Total</th>}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {_.map(listado_materiales, item => {
                                            return <ItemTabla key={item.id} item={item} {...props}/>
                                        })}
                                        </tbody>
                                        <tfoot>

                                        </tfoot>
                                    </table>
                                )
                            }
                        }
                    </ListaBusqueda>
                </TabPanel>
                <TabPanel>
                    {
                        _.size(items_listados_materiales) === 0 ?
                            <CargueListadoMateriales {...props}/> :
                            <TablaListadoMateriales {...props}/>
                    }
                </TabPanel>
            </Tabs>
        </Fragment>
    )
};

export default TablaProyectosLiteralesMateriales;