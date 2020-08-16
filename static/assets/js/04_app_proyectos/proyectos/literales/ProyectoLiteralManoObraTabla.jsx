import React, {Fragment, memo} from 'react';
import {fechaFormatoUno, formatoMoneda, pesosColombianos} from "../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


import crudHOC from "../../../00_utilities/components/HOC_CRUD2";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import Table from "react-table";

const SelectTable = selectTableHOC(Table);

const Tabla = (props) => {
    let data = props.list;
    const {
        selection,
        getTrGroupProps,
        isSelected,
        toggleAll,
        checkboxTable,
        selectAll,
        toggleSelection,
        rowFn,
        singular_name
    } = props;
    const costo_total = data.reduce((suma, elemento) => parseFloat(suma) + parseFloat(elemento['costo_total']), 0);
    return (
        <div>
            <SelectTable
                ref={r => checkboxTable.current = r}
                getTrGroupProps={getTrGroupProps}
                selection={selection}
                selectType="checkbox"
                isSelected={isSelected}
                selectAll={selectAll}
                toggleSelection={toggleSelection}
                toggleAll={toggleAll}
                keyField="id"
                previousText='Anterior'
                nextText='Siguiente'
                pageText='Página'
                ofText='de'
                rowsText='filas'
                getTrProps={rowFn}
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Colaborador",
                        accessor: "colaborador_nombre",
                        filterable: true,
                        maxWidth: 250,
                        minWidth: 250,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Centro Costo",
                        accessor: "centro_costo_nombre",
                        filterable: true,
                        maxWidth: 200,
                        minWidth: 200,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Fecha",
                        accessor: "fecha",
                        filterable: true,
                        maxWidth: 150,
                        minWidth: 150,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Tiempo",
                        maxWidth: 150,
                        minWidth: 150,
                        Cell: row => <div>{row.original.horas} horas y {row.original.minutos} minutos</div>
                    },
                    {
                        Header: "Valor Hora",
                        accessor: "tasa_valor_hora",
                        maxWidth: 80,
                        minWidth: 80,
                        Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                    },
                    {
                        Header: "Costo Total",
                        accessor: "costo_total",
                        Footer: <div className='text-right'>{formatoMoneda(costo_total, '$', 0)}</div>,
                        maxWidth: 80,
                        minWidth: 80,
                        Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                    },
                    {
                        Header: "Verificado",
                        accessor: "verificado",
                        maxWidth: 80,
                        minWidth: 80,
                        Cell: row => row.value && <FontAwesomeIcon
                            icon={'check-circle'}
                            style={{color: 'green'}}
                        />
                    },
                    {
                        Header: "Inicial",
                        accessor: "inicial",
                        maxWidth: 80,
                        minWidth: 80,
                        Cell: row => row.value && <FontAwesomeIcon
                            icon={'check-circle'}
                            style={{color: 'green'}}
                        />
                    },
                ]}
                defaultPageSize={data.length}
                className="-striped -highlight tabla-maestra"
            />
        </div>
    )
};
const CRUD = crudHOC(null, Tabla);
const List = memo((props) => {
    const {list, permisos_proyecto} = props;
    const method_pool = {
        fetchObjectMethod: null,
        deleteObjectMethod: null,
        createObjectMethod: null,
        updateObjectMethod: null,
    };
    return (
        <CRUD
            permisos_object={{...permisos_proyecto, list: true, delete: false, change: false, add: false}}
            method_pool={method_pool}
            list={list}
            plural_name=''
            singular_name='Mano Obra'
        />
    )
});

const ItemTablaCentroCosto = (props) => {
    const {item} = props;
    return (
        <tr>
            <td>{item.nombre}</td>
            <td>{pesosColombianos(item.costo_total)}</td>
            <td>{Math.floor(item.total_minutos / 60)} horas y {item.total_minutos % 60} minutos</td>
        </tr>
    )
};


const ListadoManoObralLiteralTabla = memo(props => {
    const {horas_iniciales, horas} = props;

    const union_cc = _.map(horas, e => {
        return {
            cc_nombre: e.centro_costo_nombre,
            costo_total: e.costo_total,
            cantidad_minutos: e.cantidad_minutos
        }
    });
    const union_inicial_cc = _.map(horas_iniciales, e => {
        return {
            cc_nombre: e.centro_costo_nombre,
            costo_total: Number(e.valor),
            cantidad_minutos: e.cantidad_minutos
        }
    });
    const todas_horas_x_centro_costo = _.concat(union_cc, union_inicial_cc);
    let centros_costos_list = _.groupBy(todas_horas_x_centro_costo, 'cc_nombre');
    let otro = [];
    _.mapKeys(centros_costos_list, (v, k) => {
        otro = [...otro, {horas: v, nombre: k}]
    });
    centros_costos_list = otro.map(e => {
        return {
            nombre: e.nombre,
            costo_total: _.sumBy(e.horas, h => h.costo_total),
            total_minutos: _.sumBy(e.horas, h => h.cantidad_minutos)
        }
    });

    const union_horas = _.map(horas, e => {
        return {
            id: `e${e.id}`,
            colaborador_nombre: e.colaborador_nombre,
            centro_costo_nombre: e.centro_costo_nombre,
            fecha: fechaFormatoUno(e.fecha),
            horas: e.horas,
            minutos: e.minutos,
            tasa_valor_hora: e.tasa_valor_hora,
            costo_total: e.costo_total,
            verificado: e.verificado,
            inicial: false,
        }
    });

    const union_horas_iniciales = _.map(horas_iniciales, e => {
        return {
            id: `i${e.id}`,
            colaborador_nombre: e.colaborador_nombre,
            centro_costo_nombre: e.centro_costo_nombre,
            fecha: 'Inicial',
            horas: e.horas,
            minutos: e.minutos,
            tasa_valor_hora: e.valor / (((e.horas * 60) + e.minutos) / 60),
            costo_total: e.valor,
            verificado: true,
            inicial: true,
        }
    });

    const todas_horas = _.concat(union_horas, union_horas_iniciales);


    return <Fragment>
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
        <List
            list={todas_horas}
        />
    </Fragment>
});

export {ListadoManoObralLiteralTabla}