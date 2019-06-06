import React from "react";
import ReactTable from "react-table";
import moment from 'moment'

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
         console.log(data)
        return (
            <ReactTable
                data={data}

                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Tipo",
                                accessor: "tipo_nombre",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Responsable",
                                accessor: "responsable",
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
                                Header: "Cantidad",
                                accessor: "cantidad",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }

                            },
                            {
                                Header: "Saldo",
                                accessor: "saldo",
                                filterable: true,
                                Cell: (filter, row) =>(
                                    <div>
                                        <strong>{filter.value}</strong>
                                    </div>
                                )
                            },
                            {
                                Header: "Fecha",
                                accessor: "created",
                                id: "created",
                                Cell: (filter, row) =>(
                                    <div>
                                        {moment(filter.value).format('YYYY/MM/DD HH:mm:ss')}
                                    </div>
                                ),
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
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;