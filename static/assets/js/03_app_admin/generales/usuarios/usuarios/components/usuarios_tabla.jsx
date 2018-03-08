import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            mi_cuenta,
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
                                Header: "Usuario",
                                accessor: "username",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toLowerCase())
                                }
                            },
                            {
                                Header: "Nombres",
                                accessor: "first_name",
                                maxWidth: 200,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Apellidos",
                                id: "last_name",
                                accessor: "last_name",
                                maxWidth: 200,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Correo",
                                accessor: "email",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            {
                                Header: "Activo",
                                accessor: "is_active",
                                show: permisos_object.make_user_active,
                                maxWidth: 60,
                                Cell: row => (
                                    mi_cuenta.id !== row.original.id &&
                                    <Checkbox
                                        checked={row.value}
                                        onCheck={() => updateItem({...row.original, is_active: !row.value})}
                                    />
                                )
                            },
                            {
                                Header: "Admin",
                                accessor: "is_superuser",
                                show: permisos_object.make_user_superuser,
                                maxWidth: 60,
                                Cell: row => (
                                    mi_cuenta.id !== row.original.id &&
                                    <Checkbox
                                        checked={row.value}
                                        onCheck={() => updateItem({...row.original, is_superuser: !row.value})}
                                    />
                                )
                            },
                            {
                                Header: "Staff",
                                accessor: "is_staff",
                                show: permisos_object.make_user_staff,
                                maxWidth: 60,
                                Cell: row => (
                                    mi_cuenta.id !== row.original.id &&
                                    <Checkbox
                                        checked={row.value}
                                        onCheck={() => updateItem({...row.original, is_staff: !row.value})}
                                    />
                                )
                            },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 60,
                                Cell: row =>
                                    mi_cuenta.id !== row.original.id &&
                                    (
                                        (mi_cuenta.is_superuser && row.original.is_superuser) ||
                                        (!row.original.is_superuser)
                                    ) &&
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={row.original.username}
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
                            {
                                Header: "Ver",
                                show: permisos_object.detail,
                                maxWidth: 60,
                                Cell: row =>
                                    <Link to={`/app/admin/usuarios/detail/${row.original.id}`}>
                                        <IconButtonTableSee/>
                                    </Link>

                            }
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;