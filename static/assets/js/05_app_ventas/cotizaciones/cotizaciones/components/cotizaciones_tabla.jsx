import React, {Fragment} from "react";
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {
        let data = _.orderBy(this.props.data, ['nro_cotizacion'], ['desc']);
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object,
            proyectos_permisos
        } = this.props;

        return (
            <div>
                <ReactTable
                    data={data}
                    noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                    columns={[
                        {
                            Header: "Caracteristicas",
                            columns: [
                                {
                                    Header: "Nro. Coti",
                                    accessor: "nro_cotizacion",
                                    maxWidth: 70
                                },
                                {
                                    Header: "Nro. OP",
                                    accessor: "id_proyecto",
                                    maxWidth: 80,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                    },
                                    Cell: row => {
                                        const id_proyecto = row.original.mi_proyecto;
                                        const id_literal = row.original.mi_literal;
                                        const id_proyecto_mostrar = id_proyecto ? row.original.id_proyecto : row.original.mi_literal_id_literal;
                                        const id_proyecto_url = id_literal ? row.original.mi_literal_proyecto_id : row.original.mi_proyecto;
                                        return (
                                            proyectos_permisos.detail ?
                                                <Link
                                                    to={`/app/proyectos/proyectos/detail/${id_proyecto_url}`}>
                                                    <span>{id_proyecto_mostrar}</span>
                                                </Link> :
                                                <span>{id_proyecto_mostrar}</span>
                                        )
                                    }
                                },
                                {
                                    Header: "Uni. Nego",
                                    accessor: "unidad_negocio",
                                    maxWidth: 70,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Cliente",
                                    accessor: "cliente_nombre",
                                    maxWidth: 190,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    },
                                    Cell: row => {
                                        return (
                                            <div style={{
                                                fontSize: '0.6rem',
                                                whiteSpace: 'normal'
                                            }}>{row.value}</div>
                                        )
                                    }
                                },
                                {
                                    Header: "Responsable",
                                    maxWidth: 80,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        const {_original: {responsable_actual}} = row;
                                        if (responsable_actual) {
                                            return (
                                                responsable_actual.toUpperCase().includes(filter.value.toUpperCase())
                                            )
                                        } else {
                                            return false
                                        }
                                    },
                                    Cell: row => {
                                        return <span>
                                        {row.original.responsable_actual ? row.original.responsable_actual : ''}
                                            </span>
                                    }
                                },
                                {
                                    Header: "Descripción",
                                    accessor: "descripcion_cotizacion",
                                    maxWidth: 350,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    },
                                    Cell: row => {
                                        return (
                                            <div style={{
                                                fontSize: '0.6rem',
                                                whiteSpace: 'normal'
                                            }}>
                                                {row.value}
                                            </div>
                                        )
                                    }
                                },
                                {
                                    Header: "Estado",
                                    accessor: "estado",
                                    maxWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                    },
                                    Cell: row => {
                                        return (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: '2px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: `${row.original.porcentaje_tuberia_ventas > 100 ? 100 : row.original.porcentaje_tuberia_ventas}%`,
                                                        height: '100%',
                                                        padding: '2px',
                                                        backgroundColor: row.original && row.original.color_tuberia_ventas,
                                                        borderRadius: '2px',
                                                        transition: 'all .2s ease-out'
                                                    }}
                                                >
                                                    {row.value}
                                                    <div className='text-right'>
                                                        {row.original.porcentaje_tuberia_ventas}%
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                },
                                {
                                    Header: "$ Oferta",
                                    accessor: "valor_ofertado",
                                    maxWidth: 100,
                                    Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                                },
                            ]
                        },
                        {
                            Header: "Opciones",
                            columns: [
                                {
                                    Header: "Ver",
                                    show: permisos_object.detail,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <Link to={`/app/ventas/cotizaciones/cotizaciones/detail/${row.original.id}`}>
                                            <IconButtonTableSee/>
                                        </Link>

                                }
                            ]
                        }
                    ]}
                    defaultPageSize={100}
                    className="-striped -highlight tabla-maestra"
                />
            </div>
        );
    }
}

export default Tabla;