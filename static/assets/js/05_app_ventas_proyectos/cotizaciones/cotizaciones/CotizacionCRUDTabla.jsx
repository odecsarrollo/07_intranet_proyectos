import React, {memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';
import {Link} from 'react-router-dom'

import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";

const SelectTable = selectTableHOC(Table);
import {pesosColombianos} from "../../../00_utilities/common";

import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list && prevProps.selection === nextProps.selection
}

const Tabla = memo((props) => {
    let data = _.orderBy(_.pickBy(props.list, e => e.estado !== "Cita/Generación Interés"), ['nro_cotizacion'], ['desc']);
    const {
        selection,
        getTrGroupProps,
        isSelected,
        toggleAll,
        checkboxTable,
        selectAll,
        toggleSelection,
        rowFn,
        singular_name,
        onDelete,
        permisos_object
    } = props;

    return (
        <div>
            <SelectTable
                ref={r => checkboxTable.current = r}
                getTrGroupProps={getTrGroupProps}
                selection={selection}
                selectType="checkbox"
                isSelected={isSelected}
                selectAll={selectAll}
                toggleSelection={toggleSelection}
                toggleAll={toggleAll}
                keyField="id"
                previousText='Anterior'
                nextText='Siguiente'
                pageText='Página'
                ofText='de'
                rowsText='filas'
                getTrProps={rowFn}
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Nro. Coti",
                                accessor: 'unidad_negocio',
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                },
                                maxWidth: 50,
                                filterable: true
                            },
                            {
                                Header: "Nro. Coti",
                                accessor: 'nro_cotizacion',
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].toString().includes(filter.value.toUpperCase())
                                },
                                maxWidth: 70,
                                filterable: true
                            },
                            {
                                Header: "Nro. OP",
                                maxWidth: 80,
                                Cell: row => {
                                    const proyectos = row.original.proyectos;
                                    return (
                                        <div>{proyectos && proyectos.map(p =>
                                            <div key={p.id}>
                                                <Link
                                                    to={`/app/proyectos/proyectos/detail/${p.id}`}>
                                                    {p.id_proyecto}
                                                </Link>
                                            </div>
                                        )}</div>
                                    )
                                }
                            },
                            {
                                Header: "Cot. Ini",
                                accessor: "cotizacion_inicial",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    const text = row[filter.id] ? `${row[filter.id].unidad_negocio}-${row[filter.id].nro_cotizacion}` : null;
                                    return text && text.includes(filter.value.toUpperCase())
                                },
                                Cell: row => {
                                    const cotizacion_inicial = row.original.cotizacion_inicial;
                                    const cotizaciones_adicionales = row.original.cotizaciones_adicionales;
                                    return (
                                        <div>
                                            {cotizacion_inicial &&
                                            <div>
                                                <Link
                                                    to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${cotizacion_inicial.id}`}>
                                                    {cotizacion_inicial.unidad_negocio}-{cotizacion_inicial.nro_cotizacion}
                                                </Link>
                                            </div>}
                                            {cotizaciones_adicionales &&
                                            cotizaciones_adicionales.map(c =>
                                                <div key={c.id}>
                                                    <Link
                                                        to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${c.id}`}>
                                                        {c.unidad_negocio}-{c.nro_cotizacion}
                                                    </Link>
                                                </div>
                                            )
                                            }
                                        </div>
                                    )
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
                                maxWidth: 140,
                                filterable: true,
                                accessor: "responsable_actual_nombre",
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
                                        row.original.valores_oc > 0 ?
                                            pesosColombianos(row.original.valores_oc) :
                                            pesosColombianos(row.value)
                                    }
                                </div>
                            },
                            {
                                Header: "$ Orden Compra",
                                accessor: "valores_oc",
                                maxWidth: 100,
                                Cell: row => <div className='text-right'>
                                    {
                                        row.original.valores_oc > 0 ?
                                            pesosColombianos(row.original.valores_oc) :
                                            pesosColombianos(row.value)
                                    }
                                </div>
                            },
                            // {
                            //     Header: "Fecha OC",
                            //     accessor: "orden_compra_fecha",
                            //     maxWidth: 100,
                            //     Cell: row => <div className='text-right'>
                            //         {
                            //             row.value &&
                            //             row.value
                            //         }
                            //     </div>
                            // },
                            // {
                            //     Header: "Año OC",
                            //     maxWidth: 80,
                            //     accessor: "orden_compra_fecha",
                            //     Cell: row => <div className='text-right'>
                            //         {
                            //             row.value &&
                            //             new Date(row.value).getFullYear()
                            //         }
                            //     </div>
                            // },
                            // {
                            //     Header: "Mes. OC",
                            //     maxWidth: 80,
                            //     accessor: "orden_compra_fecha",
                            //     Cell: row => {
                            //         return (
                            //             <div className='text-right'>
                            //                 {
                            //                     row.value &&
                            //                     new Date(row.value).getMonth()
                            //                 }
                            //             </div>
                            //         )
                            //     }
                            // },
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
                                    <Link
                                        to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${row.original.id}`}>
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