import React, {Fragment, memo} from "react";
import ReactTable from "react-table";
import {fechaHoraFormatoUno} from "../../../../00_utilities/common";
import Checkbox from "@material-ui/core/Checkbox";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list && prevProps.data_to_excel === nextProps.data_to_excel
}

const Tabla = memo((props) => {
    const {onSelectDataToExcel, data_to_excel} = props;
    const data = _.orderBy(props.data, ['created'], ['asc']);
    const seleccionados_to_excel = _.map(data_to_excel, e => e.id);
    return (
        <Fragment>
            <ReactTable
                data={data}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Creado Por",
                                accessor: "creado_por_username",
                                maxWidth: 80,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }

                            },
                            {
                                Header: "Responsable",
                                accessor: "responsable",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }

                            },
                            {
                                Header: "Adhesivo",
                                accessor: "adhesivo_descripcion",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Tipo Adhesivo",
                                accessor: "tipo_adhesivo",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }

                            },
                            {
                                Header: "Descripcion",
                                accessor: "descripcion",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }

                            }
                        ]
                    },
                    {
                        Header: "Inventario",
                        columns: [
                            {
                                Header: "Tipo",
                                accessor: "tipo_nombre",
                                maxWidth: 80,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Fecha",
                                accessor: "created",
                                id: "created",
                                Cell: row => (
                                    <div>
                                        {fechaHoraFormatoUno(row.value)}
                                    </div>
                                ),
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Entrada",
                                accessor: "cantidad",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => <Fragment>
                                    {
                                        row.original.tipo === 'E' &&
                                        <div>
                                            {row.value}
                                        </div>
                                    }
                                </Fragment>

                            },
                            {
                                Header: "Salida",
                                accessor: "cantidad",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => <Fragment>
                                    {
                                        row.original.tipo === 'S' &&
                                        <div>
                                            {row.value}
                                        </div>
                                    }
                                </Fragment>

                            },
                            {
                                Header: "Saldo",
                                accessor: "saldo",
                                filterable: true,
                                Cell: row => (
                                    <div>
                                        <strong>{row.value}</strong>
                                    </div>
                                )
                            },
                            {
                                Header: "Seleccionar",
                                accessor: "id",
                                Cell: row => {
                                    return (
                                        <Checkbox
                                            checked={seleccionados_to_excel.includes(row.value)}
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            onClick={() => {
                                                onSelectDataToExcel(row.original);
                                            }}
                                        />
                                    )
                                }
                            },
                        ]
                    },
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        </Fragment>
    );
}, areEqual);

export default Tabla;