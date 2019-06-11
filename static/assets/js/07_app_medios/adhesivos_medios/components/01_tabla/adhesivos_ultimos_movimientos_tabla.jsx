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
                                Header: "Codigo",
                                accessor: "codigo",
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

                            },
                            {
                                Header: "Tipo Adhesivo",
                                accessor: "tipo_nombre",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }

                            },
                            {
                                Header: "Stock Minimo",
                                accessor: "stock_min",

                            },
                            {
                                Header: "Cantidad Disponible",
                                accessor: "disponible",
                                Cell: (filter, row) =>(
                                    <div>
                                        <strong>{filter.value}</strong>
                                    </div>
                                )

                            },
                            {
                                Header: "Imagen",
                                Cell: ({original}) =>(
                                    <div style={{textAlign:'center', width: '100%'}}>
                                        <img src={original.imagen_small}></img>
                                    </div>
                                )

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