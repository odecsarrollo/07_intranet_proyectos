import React, {memo} from "react";
import {fechaFormatoUno} from '../../../00_utilities/common';

import selectTableHOC from "react-table/lib/hoc/selectTable";
import Table from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
        singular_name
    } = props;
    const data = _.orderBy(props.list, ['fecha'], ['desc']);
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
                    Header: "Literal",
                    accessor: "literal_nombre",
                    maxWidth: 100,
                    filterable: true,
                },
                {
                    Header: "Literal Nombre",
                    accessor: "literal_descripcion",
                    maxWidth: 400,
                    minWidth: 400,
                    filterable: true,
                },
                {
                    Header: "Horas",
                    accessor: "horas",
                    maxWidth: 90,
                    Cell: row =>
                        <div className='text-right'>
                            {row.value}
                        </div>
                },
                {
                    Header: "Minutos",
                    accessor: "minutos",
                    maxWidth: 60,
                    Cell: row =>
                        <div className='text-right'>
                            {row.value}
                        </div>
                },
                {
                    Header: "Verificado",
                    accessor: "verificado",
                    maxWidth: 100,
                    Cell: row =>
                        <div className='text-center'>
                            {row.value && <FontAwesomeIcon icon={'check-circle'}/>}
                        </div>
                },
            ]}
            defaultPageSize={50}
            className="-striped -highlight tabla-maestra"
        />
    )

}, areEqual);

export default Tabla;