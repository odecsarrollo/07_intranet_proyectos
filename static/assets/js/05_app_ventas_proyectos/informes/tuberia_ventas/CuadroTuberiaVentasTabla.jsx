import React, {memo} from 'react';
import {Link} from "react-router-dom";
import crudHOC from "../../../00_utilities/components/HOC_CRUD2";
import InformationDisplayDialog from "../../../00_utilities/components/ui/dialog/InformationDisplayDialog";

import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import {pesosColombianos} from "../../../00_utilities/common";

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
        campo_valor,
    } = props;
    const valor = data.reduce((suma, elemento) => parseFloat(suma) + parseFloat(elemento[campo_valor]), 0);
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
                        Header: "Cotización",
                        accessor: "nro_cotizacion",
                        filterable: true,
                        maxWidth: 100,
                        minWidth: 100,
                        filterMethod: (filter, row) => `${row._original.unidad_negocio}-${row._original.nro_cotizacion}`.includes(filter.value.toUpperCase()),
                        Cell: row => <div>
                            <Link
                                to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${row.original.id}`}
                                target={'_blank'}
                            >
                                {row.original.unidad_negocio}-{row.original.nro_cotizacion}
                            </Link>
                        </div>
                    },
                    {
                        Header: "Cliente",
                        accessor: "cliente_nombre",
                        filterable: true,
                        maxWidth: 300,
                        minWidth: 300,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                    },
                    {
                        Header: "Descripción",
                        accessor: "descripcion_cotizacion",
                        filterable: true,
                        maxWidth: 400,
                        minWidth: 400,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                        Cell: row => <div style={{
                            fontSize: '0.6rem',
                            whiteSpace: 'normal'
                        }}>{row.value}</div>
                    },
                    {
                        Header: "Valor",
                        maxWidth: 150,
                        minWidth: 150,
                        Footer: <div className='text-right'>{pesosColombianos(valor)}</div>,
                        Cell: row => <div className='text-right'>{pesosColombianos(row.original[campo_valor])}</div>
                    }
                ]}
                defaultPageSize={data.length}
                className="-striped -highlight tabla-maestra"
            />
        </div>
    )
};


const CRUD = crudHOC(null, Tabla);
const List = memo((props) => {
    const {campo_valor, list, plural_name} = props;
    const method_pool = {
        fetchObjectMethod: null,
        deleteObjectMethod: null,
        createObjectMethod: null,
        updateObjectMethod: null,
    };
    return (
        <CRUD
            permisos_object={{list: true, delete: false, change: false, add: false}}
            method_pool={method_pool}
            list={list}
            campo_valor={campo_valor}
            plural_name={plural_name}
            singular_name='Cotizacion'
        />
    )
});

const InformeTunelVentasTabla = memo(props => {
    const {cotizaciones_seleccionardas: {campo_valor, lista, estado, responsable, id}, limpiarLista} = props;
    return <InformationDisplayDialog
        onCerrar={limpiarLista}
        is_open={lista.length > 0}
        fullScreen={true}
        scroll='paper'
        cerrar_text='Cerrar'
        titulo_text={`${responsable} - ${estado}`}
    >
        <List list={lista} campo_valor={campo_valor} plural_name={`Tuberia Ventas ${responsable}_${estado}`}/>
    </InformationDisplayDialog>
});


export default InformeTunelVentasTabla;