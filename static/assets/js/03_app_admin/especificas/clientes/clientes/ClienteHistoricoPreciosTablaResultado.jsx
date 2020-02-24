import React, {memo} from "react";
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/table_icon_button_detail';

import ReactTable from "react-table";
import {Link} from "react-router-dom";
import {fechaHoraFormatoUno, pesosColombianos} from "../../../../00_utilities/common";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}


const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['fecha'], ['desc']);
    return (
        <ReactTable
            data={data}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Fecha",
                            accessor: "fecha",
                            maxWidth: 200,
                            minWidth: 200,
                            Cell: row => fechaHoraFormatoUno(row.value)
                        },
                        {
                            Header: "Origen",
                            accessor: "origen",
                            maxWidth: 100,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                        },
                        {
                            Header: "Referencia",
                            accessor: "referencia",
                            maxWidth: 350,
                            minWidth: 350,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            Cell: row => {
                                return (
                                    <div style={{
                                        fontSize: '0.7rem',
                                        whiteSpace: 'normal'
                                    }}>{row.value}</div>
                                )
                            }
                        },
                        {
                            Header: "Nombre",
                            accessor: "nombre",
                            minWidth: 300,
                            maxWidth: 300,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            Cell: row => <div style={{
                                fontSize: '0.7rem',
                                whiteSpace: 'normal'
                            }}>{row.value}</div>
                        },
                        {
                            Header: "Precio",
                            accessor: "precio",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => <div className="text-right">{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "Nro. Documento",
                            accessor: "nro",
                            minWidth: 80,
                            maxWidth: 80,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                        },
                    ]
                },
                {
                    Header: "Opciones",
                    columns: [
                        {
                            Header: "Ver",
                            accessor: "origen",
                            maxWidth: 40,
                            Cell: row => {
                                const link = row.value === 'FACTURA' ? `/app/ventas_componentes/facturas/detail/${row.original.id_factura}` : `/app/ventas_componentes/cotizaciones/detail/${row.original.id_cotizacion}`
                                return (
                                    <Link to={link} target='_blank'>
                                        <IconButtonTableSee/>
                                    </Link>
                                )
                            }

                        }
                    ]
                }
            ]}
            defaultPageSize={props.list.lenth}
            className="-striped -highlight tabla-maestra"
        />
    );
}, areEqual);

export default Tabla;