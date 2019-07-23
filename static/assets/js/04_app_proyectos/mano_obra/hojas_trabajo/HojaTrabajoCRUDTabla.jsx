import React, {Fragment, memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';
import {fechaFormatoUno, pesosColombianos} from '../../../00_utilities/common';
import {Link} from 'react-router-dom'

import selectTableHOC from "react-table/lib/hoc/selectTable";
import Table from "react-table";

const SelectTable = selectTableHOC(Table);

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list && prevProps.selection === nextProps.selection
}

const Tabla = memo(props => {
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
        onDelete,
        permisos_object,
        configuracion_costos
    } = props;
    const data = _.orderBy(props.list, ['fecha'], ['desc']);
    const fecha_cierre = configuracion_costos ? configuracion_costos.fecha_cierre : null;
    return (
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
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Colaborador",
                            accessor: "colaborador_nombre",
                            maxWidth: 250,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Fecha",
                            accessor: "fecha",
                            maxWidth: 150,
                            Cell: row => fechaFormatoUno(row.value)
                        },
                        {
                            Header: "Valor Hora",
                            accessor: "tasa_valor_hora",
                            show: permisos_object.costos,
                            maxWidth: 100,
                            Cell: row =>
                                <div className='text-right'>
                                    {pesosColombianos(row.value)}
                                </div>
                        },
                        {
                            Header: "Horas",
                            accessor: "cantidad_horas",
                            maxWidth: 100,
                            Cell: row =>
                                <div className='text-right'>
                                    {row.value}
                                </div>

                        },
                        {
                            Header: "Costo Total",
                            accessor: "costo_total",
                            maxWidth: 100,
                            show: permisos_object.costos,
                            Cell: row =>
                                <div className='text-right'>
                                    {pesosColombianos(row.value)}
                                </div>
                        },
                    ]
                },
                {
                    Header: "Opciones",
                    columns: [
                        {
                            Header: "Elimi.",
                            show: permisos_object.delete,
                            maxWidth: 60,
                            Cell: row => {
                                const puede_eliminar = row.original.fecha > fecha_cierre;
                                return (
                                    parseInt(row.original.cantidad_horas) === 0 && puede_eliminar ?
                                        <MyDialogButtonDelete
                                            onDelete={() => {
                                                onDelete(row.original)
                                            }}
                                            element_name={`en ${fechaFormatoUno(row.original.fecha)} para ${row.original.colaborador_nombre}`}
                                            element_type={singular_name}
                                        /> : <Fragment></Fragment>
                                )
                            }

                        },
                        {
                            Header: "Ver",
                            show: permisos_object.detail,
                            maxWidth: 60,
                            Cell: row =>
                                <Link to={`/app/proyectos/mano_obra/hojas_trabajo/detail/${row.original.id}`}>
                                    <IconButtonTableSee/>
                                </Link>

                        }
                    ]
                }
            ]}
            defaultPageSize={50}
            className="-striped -highlight tabla-maestra"
        />
    )

}, areEqual);

export default Tabla;