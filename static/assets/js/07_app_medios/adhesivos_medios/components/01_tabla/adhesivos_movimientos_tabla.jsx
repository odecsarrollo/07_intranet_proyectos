import React, {Fragment} from "react";
import ReactTable from "react-table";
import {fechaHoraFormatoUno} from "../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {

        const data = _.orderBy(this.props.data, ['created'], ['asc']);
        return (
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
                                    console.log(row[filter.id]);
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }

                            },
                            {
                                Header: "Responsable",
                                accessor: "responsable",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    console.log(row[filter.id]);
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
                                Cell: (filter, row) => (
                                    <div>
                                        <strong>{filter.value}</strong>
                                    </div>
                                )
                            },
                        ]
                    },
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;