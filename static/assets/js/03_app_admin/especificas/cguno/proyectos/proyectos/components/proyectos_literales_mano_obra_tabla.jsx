import React, {Fragment} from 'react';
import {ListaBusqueda} from '../../../../../../00_utilities/utiles';
import {fechaFormatoUno, pesosColombianos} from "../../../../../../00_utilities/common";

const ItemTablaCentroCosto = (props) => {
    const {item} = props;
    return (
        <tr>
            <td>{item.nombre}</td>
            <td>{pesosColombianos(item.costo_total)}</td>
            <td>{(item.total_minutos / 60).toFixed(0)} horas y {item.total_minutos % 60} minutos</td>
        </tr>
    )
};

const ItemTablaManoObra = (props) => {
    const {item} = props;
    return (
        <tr>
            <td>{item.colaborador_nombre}</td>
            <td>{item.centro_costo_nombre}</td>
            <td>{fechaFormatoUno(item.fecha)}</td>
            <td>{item.horas} horas y {item.minutos} minutos</td>
            <td>{pesosColombianos(item.tasa_valor_hora)}</td>
            <td>{pesosColombianos(item.costo_total)}</td>
            <td>{item.verificado && 'Verificado'}</td>
        </tr>
    )
};

const buscarBusqueda = (lista, busqueda) => {
    return _.pickBy(lista, (item) => {
        return (
            item.colaborador_nombre.toUpperCase().includes(busqueda.toUpperCase()) ||
            item.centro_costo_nombre.toUpperCase().includes(busqueda.toUpperCase())
        )
    });
};

const TablaProyectosLiteralesManoObra = (props) => {
    const {horas_mano_obra_literales} = props;
    let centros_costos_list = _.groupBy(horas_mano_obra_literales, 'centro_costo_nombre');
    let otro = [];
    _.mapKeys(centros_costos_list, (v, k) => {
        otro = [...otro, {horas: v, nombre: k}]
    });
    centros_costos_list = otro.map(e => {
        return {
            ...e,
            costo_total: _.sumBy(e.horas, h => h.costo_total),
            total_minutos: _.sumBy(e.horas, h => h.cantidad_minutos)
        }
    });
    return (
        <Fragment>
            <table className="table table-responsive table-striped tabla-maestra">
                <thead>
                <tr>
                    <th>Centro de Costo</th>
                    <th>Costo Total</th>
                    <th>Tiempo Total</th>
                </tr>
                </thead>
                <tbody>
                {centros_costos_list.map(e => <ItemTablaCentroCosto key={e.nombre} item={e}/>)}
                </tbody>
                <tfoot>
                </tfoot>
            </table>
            <ListaBusqueda>
                {
                    busqueda => {
                        const listado_mano_obra = buscarBusqueda(horas_mano_obra_literales, busqueda);
                        return (
                            <table className="table table-responsive table-striped tabla-maestra">
                                <thead>
                                <tr>
                                    <th>Colaborador</th>
                                    <th>Centro de Costo</th>
                                    <th>Fecha</th>
                                    <th>Tiempo</th>
                                    <th>Valor Hora</th>
                                    <th>Costo Total</th>
                                    <th>Estado</th>
                                </tr>
                                </thead>
                                <tbody>
                                {_.map(listado_mano_obra, item => {
                                    return <ItemTablaManoObra key={item.id} item={item} {...props}/>
                                })}
                                </tbody>
                                <tfoot>

                                </tfoot>
                            </table>
                        )
                    }
                }
            </ListaBusqueda>
        </Fragment>
    )
};

export default TablaProyectosLiteralesManoObra;