import React from "react";
import {IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {fechaFormatoUno, pesosColombianos} from '../../../../00_utilities/common';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            singular_name,
            permisos_object
        } = this.props;


        return (
            <ReactTable
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Abierto",
                                accessor: "abierto",
                                maxWidth: 60,
                                Cell: row => <div className='text-center'>
                                    <i
                                        className={`fas fa${row.value ? '-check' : '-times'}-circle`}
                                        style={{color: `${row.value ? 'green' : 'red'}`}}
                                    >
                                    </i>
                                </div>
                            },
                            {
                                Header: "Literal",
                                accessor: "id_literal",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Nombre Literal",
                                accessor: "descripcion",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Nombre Proyecto",
                                accessor: "proyecto_nombre",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Cliente",
                                accessor: "cliente_nombre",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Nro. Cotización",
                                accessor: "cotizacion_nro",
                                maxWidth: 100,
                            },
                            {
                                Header: "Nro. OC",
                                accessor: "orden_compra_nro",
                                maxWidth: 100,
                            },
                            {
                                Header: "Fecha OC",
                                accessor: "orden_compra_fecha",
                                maxWidth: 150,
                                Cell: row => <div>{row.value ? fechaFormatoUno(row.value) : ''}</div>
                            },
                            {
                                Header: "F. E. Pactada",
                                accessor: "fecha_entrega_pactada",
                                maxWidth: 150,
                                Cell: row => <div>{row.value ? fechaFormatoUno(row.value) : ''}</div>
                            },
                            {
                                Header: "Precio",
                                accessor: "valor_cliente",
                                maxWidth: 150,
                                Cell: row => <div
                                    className='text-right'>{row.value ? pesosColombianos(row.value) : ''}</div>
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            {
                                Header: "Ver",
                                maxWidth: 60,
                                Cell: row =>
                                    <Link to={`/app/proyectos/proyectos/detail/${row.original.proyecto}`}>
                                        <IconButtonTableSee/>
                                    </Link>

                            }
                        ]
                    }
                ]}
                defaultPageSize={25}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;