import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list && prevProps.selection === nextProps.selection
}

const ClienteDetailDashboardCRUDContactosTabla = memo((props) => {
    const data = _.map(_.orderBy(props.list, ['nombres', 'apellidos'], ['asc', 'asc']));
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
                            Header: "Id",
                            accessor: "id",
                            maxWidth: 50,
                            filterable: true
                        },
                        {
                            Header: "Nombre",
                            accessor: "nombres",
                            maxWidth: 150,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Apellido",
                            accessor: "apellidos",
                            maxWidth: 150,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Cargo",
                            accessor: "cargo",
                            maxWidth: 150,
                            filterable: true,
                            filterMethod: (filter, row) => {
                                return row[filter.id].includes(filter.value.toUpperCase())
                            }
                        },
                        {
                            Header: "Telefono",
                            accessor: "telefono",
                            maxWidth: 100,
                        },
                        {
                            Header: "Telefono 2",
                            accessor: "telefono_2",
                            maxWidth: 100,
                        },
                        {
                            Header: "Correo",
                            accessor: "correo_electronico",
                            maxWidth: 200,
                        },
                        {
                            Header: "Correo 2",
                            accessor: "correo_electronico_2",
                            maxWidth: 200,
                        },
                        {
                            Header: "Creado por",
                            accessor: "creado_por_username",
                            maxWidth: 100,
                        },
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

export default ClienteDetailDashboardCRUDContactosTabla;