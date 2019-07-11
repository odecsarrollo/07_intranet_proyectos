import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {fechaFormatoUno} from "../../../../00_utilities/common";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list && prevProps.data_to_excel === nextProps.data_to_excel
}

const Tabla = memo(props => {
    const data = _.map(props.list);
    const {
        updateItem,
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object
    } = props;

    return (
        <ReactTable
            data={data}
            noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Nro. Consecutivo",
                            accessor: "nro_consecutivo",
                            maxWidth: 100,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Nit",
                            accessor: "nit",
                            maxWidth: 100,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Nombre",
                            accessor: "nombre_cliente",
                            maxWidth: 250,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Fecha",
                            accessor: "fecha",
                            maxWidth: 100,
                            Cell: row => fechaFormatoUno(row.value)
                        },
                        {
                            Header: "Fecha Cobro",
                            accessor: "fecha_cobro",
                            maxWidth: 100,
                            Cell: row => row.value && <div>{fechaFormatoUno(row.value)}</div>
                        },
                        {
                            Header: "Tipo",
                            accessor: "tipo_documento",
                            maxWidth: 100,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Condició Pago",
                            accessor: "condicion_pago",
                            maxWidth: 100,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Version",
                            accessor: "version",
                            maxWidth: 80,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Estado",
                            accessor: "estado_display",
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
                                                width: `${row.original.porcentaje_a_verificacion > 100 ? 100 : row.original.porcentaje_a_verificacion}%`,
                                                height: '100%',
                                                padding: '2px',
                                                backgroundColor: row.original && row.original.color_estado,
                                                borderRadius: '2px',
                                                transition: 'all .2s ease-out'
                                            }}
                                        >
                                            {row.value}
                                            {
                                                row.original.porcentaje_a_verificacion > 0 &&
                                                <div className='text-right'>
                                                    {row.original.porcentaje_a_verificacion}%
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            },
                        },
                        {
                            Header: "Divisa",
                            accessor: "divisa",
                            maxWidth: 80,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        }
                    ]
                },
                {
                    Header: "Opciones",
                    columns: [
                        // {
                        //     Header: "Activo",
                        //     accessor: "is_active",
                        //     show: permisos_object.make_user_active,
                        //     maxWidth: 60,
                        //     Cell: row => (
                        //         <Checkbox
                        //             checked={row.value}
                        //             onCheck={() => updateItem({...row.original, is_active: !row.value})}
                        //         />
                        //     )
                        // },
                        {
                            Header: "Elimi.",
                            show: permisos_object.delete,
                            maxWidth: 60,
                            Cell: row =>
                                <MyDialogButtonDelete
                                    onDelete={() => {
                                        onDelete(row.original)
                                    }}
                                    element_name={row.original.nombre}
                                    element_type={singular_name}
                                />

                        },
                        {
                            Header: "Editar",
                            show: permisos_object.change,
                            maxWidth: 60,
                            Cell: row =>
                                <IconButtonTableEdit
                                    onClick={() => {
                                        onSelectItemEdit(row.original);
                                    }}/>

                        },
                    ]
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    );
}, areEqual);

export default Tabla;