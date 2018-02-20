import React from "react";
import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {

        const {data, can_see_ultimo_costo} = this.props;
        return (
            <div>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: "Atributos",
                            columns: [
                                {
                                    Header: "Id CGUNO",
                                    accessor: "id_item",
                                    maxWidth: 150,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toLowerCase())
                                    }
                                },
                                {
                                    Header: "Descripción",
                                    accessor: "descripcion",
                                    maxWidth: 300,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Descripción Dos",
                                    accessor: "descripcion_dos",
                                    maxWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Uni. Med",
                                    accessor: "unidad_medida_inventario",
                                    maxWidth: 60
                                },
                                {
                                    Header: "Activo",
                                    accessor: "activo",
                                    maxWidth: 40,
                                    Cell: row => (
                                        row.value && <i className='far fa-check-circle'></i>
                                    )
                                },
                                {
                                    Header: "Referencia",
                                    accessor: "id_referencia",
                                    maxWidth: 100,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Proveedor",
                                    accessor: "nombre_tercero",
                                    maxWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                }
                            ]
                        },
                        {
                            Header: "Costos",
                            columns: [
                                {
                                    Header: "Último Costo",
                                    accessor: "ultimo_costo",
                                    show: can_see_ultimo_costo,
                                    maxWidth: 100,
                                    Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                                },
                            ]
                        },
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight tabla-maestra"
                />
            </div>
        );
    }
}

export default Tabla;