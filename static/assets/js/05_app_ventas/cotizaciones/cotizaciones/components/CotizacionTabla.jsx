import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/table_icon_button_detail';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";
import Checkbox from "@material-ui/core/Checkbox";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list && prevProps.data_to_excel === nextProps.data_to_excel
}

const Tabla = memo((props) => {
    const {onSelectDataToExcel, data_to_excel} = props;
    let data = _.orderBy(_.pickBy(props.list, e => e.estado !== "Cita/Generación Interés"), ['nro_cotizacion'], ['desc']);
    const seleccionados_to_excel = _.map(data_to_excel, e => e.id);
    const {
        updateItem,
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object,
        proyectos_permisos
    } = props;

    return (
        <div>
            <ReactTable
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
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
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Nro. Coti",
                                accessor: "nro_cotizacion",
                                filterable: true,
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
                                Header: "Contacto",
                                accessor: "contacto_cliente_nombre",
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
                                Cell: row => <div className='text-right'>
                                    {
                                        row.original.valor_orden_compra > 0 ?
                                            pesosColombianos(row.original.valor_orden_compra) :
                                            pesosColombianos(row.value)
                                    }
                                </div>
                            },
                            {
                                Header: "Fecha OC",
                                accessor: "orden_compra_fecha",
                                maxWidth: 100,
                                Cell: row => <div className='text-right'>
                                    {
                                        row.value &&
                                        row.value
                                    }
                                </div>
                            },
                            {
                                Header: "Trim. OC",
                                accessor: "orden_compra_fecha",
                                maxWidth: 80,
                                Cell: row => {
                                    return (
                                        <div className='text-right'>
                                            {
                                                row.value &&
                                                Math.ceil((new Date(row.value).getMonth() + 1) / 3)
                                            }
                                        </div>
                                    )
                                }
                            },
                            {
                                Header: "Año OC",
                                accessor: "orden_compra_fecha",
                                maxWidth: 80,
                                Cell: row => <div className='text-right'>
                                    {
                                        row.value &&
                                        new Date(row.value).getFullYear()
                                    }
                                </div>
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

                            },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 60,
                                Cell: row => {
                                    if (!row.original.nro_cotizacion) {
                                        return (
                                            <MyDialogButtonDelete
                                                onDelete={() => {
                                                    onDelete(row.original)
                                                }}
                                                element_name={row.original.nombre}
                                                element_type={singular_name}
                                            />
                                        )
                                    } else {
                                        return <div></div>
                                    }
                                }

                            },
                        ]
                    }
                ]}
                defaultPageSize={100}
                className="-striped -highlight tabla-maestra"
            />
        </div>
    )

}, areEqual);

export default Tabla;