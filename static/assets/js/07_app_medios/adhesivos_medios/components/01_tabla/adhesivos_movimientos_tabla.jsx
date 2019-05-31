import React from "react";
import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
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

                            },
                            {
                                Header: "Adhesivo",
                                accessor: "adhesivo_descripcion",

                            },
                            {
                                Header: "Cantidad",
                                accessor: "cantidad",

                            },
                            {
                                Header: "Saldo",
                                accessor: "saldo",

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