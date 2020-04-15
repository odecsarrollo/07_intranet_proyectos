import React, {memo} from "react";
import Checkbox from '@material-ui/core/Checkbox';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {useAuth} from "../../../00_utilities/hooks";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const UsuarioCRUDTabla = memo(props => {
    const data = props.list;
    const authentication = useAuth();
    const {auth: {user}} = authentication;
    const {
        updateItem,
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object,
        onSelectForDelete
    } = props;

    return (
        <div>
            <ReactTable
                data={_.map(data)}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Personal",
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
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return (
                                        row._original.first_name.includes(filter.value.toUpperCase()) |
                                        row._original.last_name.includes(filter.value.toUpperCase())
                                    )
                                },
                                Cell: row => {
                                    return (
                                        `${row.original.first_name} ${row.original.last_name}`
                                    )
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
                                maxWidth: 50,
                                Cell: row => (
                                    user.id !== row.original.id &&
                                    <div className='text-center' style={{width: '100%'}}>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={row.value}
                                            onChange={() => updateItem({...row.original, is_active: !row.value})}
                                        />
                                    </div>
                                )
                            },
                            {
                                Header: "Admin",
                                accessor: "is_superuser",
                                show: permisos_object.make_user_superuser,
                                maxWidth: 50,
                                Cell: row => (
                                    user.id !== row.original.id &&
                                    <div className='text-center' style={{width: '100%'}}>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={row.value}
                                            onChange={() => updateItem({...row.original, is_superuser: !row.value})}
                                        />
                                    </div>
                                )
                            },
                            {
                                Header: "Staff",
                                accessor: "is_staff",
                                show: permisos_object.make_user_staff,
                                maxWidth: 50,
                                Cell: row => (
                                    user.id !== row.original.id &&
                                    <div className='text-center' style={{width: '100%'}}>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={row.value}
                                            onChange={() => updateItem({...row.original, is_staff: !row.value})}
                                        />
                                    </div>
                                )
                            },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 50,
                                Cell: row =>
                                    user.id !== row.original.id &&
                                    (
                                        (user.is_superuser && row.original.is_superuser) ||
                                        (!row.original.is_superuser)
                                    )
                                    &&
                                    <MyDialogButtonDelete
                                        onSelectForDelete={onSelectForDelete}
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
                                maxWidth: 50,
                                Cell: row =>
                                    <IconButtonTableEdit
                                        onClick={() => {
                                            onSelectItemEdit(row.original);
                                        }}/>

                            },
                            {
                                Header: "Ver",
                                show: permisos_object.detail,
                                maxWidth: 50,
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
        </div>
    );
}, areEqual);
export default UsuarioCRUDTabla;