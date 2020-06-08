import React, {memo} from 'react';
import {numeroFormato, formatoMoneda} from '../../../00_utilities/common';
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
        singular_name,
        permisos_object
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
                        Header: "Lapso",
                        accessor: "lapso",
                        filterable: true,
                        maxWidth: 100,
                        minWidth: 100
                    },
                    {
                        Header: "Id Item",
                        accessor: "id_item",
                        filterable: true,
                        maxWidth: 80,
                        minWidth: 80,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Referencia",
                        accessor: "id_referencia",
                        filterable: true,
                        maxWidth: 80,
                        minWidth: 80,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Nombre",
                        accessor: "descripcion",
                        filterable: true,
                        maxWidth: 250,
                        minWidth: 250,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                    },
                    {
                        Header: "Cantidad",
                        accessor: "cantidad",
                        maxWidth: 80,
                        minWidth: 80,
                        Cell: row => <div className='text-right'>{numeroFormato(row.value)}</div>
                    },
                    {
                        Header: "Uni. Inv",
                        accessor: "unidad_medida_inventario",
                        filterable: true,
                        maxWidth: 80,
                        minWidth: 80,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Origen",
                        accessor: "sistema_informacion",
                        maxWidth: 80,
                        minWidth: 80,
                        Cell: row => <div>{row.value === 1 ? 'CGUno' : 'Siesa Cloud'}</div>
                    },
                    {
                        Header: "Costo Total",
                        Footer: <div className='text-right'>{formatoMoneda(costo_total, '$', 0)}</div>,
                        show: permisos_object.ultimo_costo_item_biable,
                        accessor: "costo_total",
                        maxWidth: 80,
                        minWidth: 80,
                        Cell: row => <div className='text-right'>{formatoMoneda(row.value, "$", 0)}</div>
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
            singular_name='Material'
        />
    )
});

const ListadoMaterialesLiteralTabla = memo(props => {
    const {materiales, permisos_proyecto} = props;
    const materiales_flat = materiales.map(
        m => ({
            id: m.id,
            costo_total: m.costo_total,
            cantidad: m.cantidad,
            lapso: m.lapso,
            unidad_medida_inventario: m.item.unidad_medida_inventario,
            id_item: m.item.id_item,
            id_referencia: m.item.id_referencia,
            descripcion: m.item.descripcion,
            sistema_informacion: m.item.sistema_informacion,
        })
    )
    return <List
        permisos_proyecto={permisos_proyecto}
        list={materiales_flat}
    />
});

export {ListadoMaterialesLiteralTabla}