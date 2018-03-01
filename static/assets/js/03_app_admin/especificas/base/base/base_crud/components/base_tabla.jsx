import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            mi_cuenta,
            element_type,
            onDelete,
            onSelectItemEdit,
            permisos
        } = this.props;


        return (
            <div>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: "Caracteristicas",
                            columns: [
                                {
                                    Header: "Campo",
                                    accessor: "campo",
                                    maxWidth: 150,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toLowerCase())
                                    }
                                },
                            ]
                        },
                        {
                            Header: "Opciones",
                            columns: [
                                {
                                    Header: "Booleano",
                                    accessor: "booleano",
                                    show: permisos.make_user_staff,
                                    maxWidth: 60,
                                    Cell: row => (
                                        mi_cuenta.id !== row.original.id &&
                                        <Checkbox
                                            checked={row.value}
                                            onCheck={() => updateItem({...row.original, booleano: !row.value})}
                                        />
                                    )
                                },
                                {
                                    Header: "Elimi.",
                                    show: permisos.delete,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <MyDialogButtonDelete
                                            onDelete={() => {
                                                onDelete(row.original)
                                            }}
                                            element_name={row.original.username}
                                            element_type={element_type}
                                        />

                                },
                                {
                                    Header: "Editar",
                                    show: permisos.change,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <IconButtonTableEdit
                                            onClick={() => {
                                                onSelectItemEdit(row.original);
                                            }}/>

                                },
                                {
                                    Header: "Ver",
                                    show: permisos.detail,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <Link to={`/app/admin/algos/detail/${row.original.id}`}>
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
    }
}

export default Tabla;