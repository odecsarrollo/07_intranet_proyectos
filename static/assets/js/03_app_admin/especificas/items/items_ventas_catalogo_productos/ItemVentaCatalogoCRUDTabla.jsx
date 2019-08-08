import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['to_string'], ['asc']);
    const {
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object
    } = props;
    return (
        <ReactTable
            data={data}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Id",
                            accessor: "id",
                            maxWidth: 40
                        },
                        {
                            Header: "Nombre",
                            maxWidth: 120,
                            minWidth: 120,
                            accessor: "to_string",
                            filterable: true,
                            filterMethod: (filter, row) => row._original.to_string.includes(filter.value.toUpperCase()),
                            Cell: row => <div style={{
                                fontSize: '0.6rem',
                                whiteSpace: 'normal'
                            }}>{row.value}</div>
                        },
                        {
                            Header: "Referencia",
                            maxWidth: 110,
                            accessor: 'referencia',
                            filterable: true,
                            filterMethod: (filter, row) => row._original.referencia.includes(filter.value.toUpperCase())
                        },
                        {
                            Header: "U.M",
                            maxWidth: 80,
                            accessor: "unidad_medida",
                            Cell: row => row.value
                        },
                        {
                            Header: "Costo MO",
                            maxWidth: 80,
                            accessor: "costo",
                            Cell: row => <div className='text-right'>
                                {row.value} {row.original.moneda_nombre}
                            </div>
                        },
                        {
                            Header: "TRM",
                            maxWidth: 80,
                            accessor: "moneda_tasa",
                            Cell: row => <div className='text-right'>
                                {pesosColombianos(row.value)} COP
                            </div>
                        },
                        {
                            Header: "FI",
                            maxWidth: 40,
                            minWidth: 40,
                            accessor: "proveedor_importacion_fi",
                            Cell: row => <div className='text-right'>
                                {row.value}
                            </div>
                        },
                        {
                            Header: "Costo",
                            maxWidth: 80,
                            accessor: "costo_cop",
                            Cell: row => <div className='text-right'>
                                {pesosColombianos(row.value)} COP
                            </div>
                        },
                        {
                            Header: "FI Aer.",
                            maxWidth: 50,
                            minWidth: 50,
                            accessor: "proveedor_importacion_fi_aereo",
                            Cell: row => <div className='text-right'>
                                {row.value}
                            </div>
                        },
                        {
                            Header: "Cos. Aereo",
                            maxWidth: 80,
                            accessor: "costo_cop_aereo",
                            Cell: row => <div className='text-right'>
                                {pesosColombianos(row.value)} COP
                            </div>
                        },
                        {
                            Header: "MGN",
                            maxWidth: 50,
                            minWidth: 50,
                            accessor: "margen_deseado",
                            Cell: row => <div className='text-right'>
                                {row.value}%
                            </div>
                        },
                        {
                            Header: "Pre. Base.",
                            maxWidth: 80,
                            accessor: "precio_base",
                            Cell: row => <div className='text-right'>
                                {pesosColombianos(row.value)} COP
                            </div>
                        },
                        {
                            Header: "Pre. Bas. Aer",
                            maxWidth: 80,
                            accessor: "precio_base_aereo",
                            Cell: row => <div className='text-right'>
                                {pesosColombianos(row.value)} COP
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
                            maxWidth: 45,
                            Cell: row =>
                                row.original.origen === 'LP_INTRANET' &&
                                <MyDialogButtonDelete
                                    onDelete={() => {
                                        onDelete(row.original)
                                    }}
                                    element_name={`${row.original.to_string}`}
                                    element_type={singular_name}
                                />

                        },
                        {
                            Header: "Editar",
                            show: permisos_object.change,
                            maxWidth: 45,
                            Cell: row =>
                                <IconButtonTableEdit
                                    onClick={() => {
                                        onSelectItemEdit(row.original);
                                    }}/>

                        }
                    ]
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    )
}, areEqual);

export default Tabla;