import React, {useState, memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';
import {Link} from 'react-router-dom'

import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";

const SelectTable = selectTableHOC(Table);
import {fechaFormatoUno, pesosColombianos} from "../../../00_utilities/common";


function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list && prevProps.selection === nextProps.selection
}


const Tabla = memo((props) => {
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
        permisos_object,
    } = props;
    let data = _.map(_.orderBy(props.list, ['nro_cotizacion'], ['desc']));

    const [color, setColor] = useState(null);
    if (color) {
        data = _.orderBy(_.pickBy(props.list, e => e.color_tuberia_ventas === color), ['nro_cotizacion'], ['desc']);
    }
    const colores = _.uniq(_.map(props.list, e => e.color_tuberia_ventas).filter(h => h));

    return (
        <div className='row'>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 text-right pb-1">
                        Estados
                        {colores.map(c => {
                            return (
                                <span
                                    key={c}
                                    className="btn puntero"
                                    style={{backgroundColor: c, height: '40px', border: '1px solid black'}}
                                    onClick={() => setColor(c)}
                                >

                                        </span>
                            )
                        })}
                        <span className="btn puntero"
                              style={{backgroundColor: 'white', border: '1px solid black', height: '40px'}}
                              onClick={() => setColor(null)}
                        >
                                    Todas
                                </span>

                    </div>
                </div>
            </div>
            <div className="col-12">
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
                                    accessor: "nro_cotizacion",
                                    maxWidth: 70,
                                    id: "nro_cotizacion"
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
                                    maxWidth: 140,
                                    filterable: true,
                                    accessor: "responsable_actual_nombre",
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
                                            }}>{row.value}</div>
                                        )
                                    }
                                },
                                {
                                    Header: "F. Verificación",
                                    accessor: "fecha_limite_segumiento_estado",
                                    maxWidth: 100,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        const fecha = row[filter.id] ? fechaFormatoUno(row[filter.id]).toString().toUpperCase() : '';
                                        return fecha.includes(filter.value.toUpperCase()) || (row[filter.id] && row[filter.id].includes(filter.value.toUpperCase()))
                                    },
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
                                                    {
                                                        row.original.porcentaje_tuberia_ventas &&
                                                        <div className='text-right'>
                                                            {row.original.porcentaje_tuberia_ventas}%
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    },
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
                            ]
                        },
                        {
                            Header: "Opciones",
                            columns: [
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
                                                    element_name={row.original.to_string}
                                                    element_type={singular_name}
                                                />
                                            )
                                        } else {
                                            return <div></div>
                                        }
                                    }

                                },
                                {
                                    Header: "Ver",
                                    show: permisos_object.detail,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <Link
                                            to={`/app/ventas/cotizaciones/cotizaciones/detail/${row.original.id}`}>
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
        </div>
    )

}, areEqual);

export default Tabla;