import React, {Fragment, memo, useState} from "react";
import Checkbox from '@material-ui/core/Checkbox';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const Tabla = memo(props => {
    const {
        updateItem,
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object,
        list
    } = props;
    let data = _.orderBy(list, ['to_string'], ['desc']);
    return (
        <Fragment>
            <ReactTable
                data={data}
                columns={[
                    {
                        Header: "Información",
                        columns: [
                            {
                                Header: "Id",
                                accessor: "id",
                                maxWidth: 60
                            },
                            {
                                Header: "Nombre",
                                accessor: "to_string",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => <div>{row.value ? row.value : 'SIN DEFINIR'}</div>
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            {
                                Header: "Activo",
                                accessor: "activo",
                                maxWidth: 60,
                                show: permisos_object.change,
                                Cell: row => (
                                    <Checkbox
                                        style={{margin: 0, padding: 0}}
                                        color='primary'
                                        checked={row.value}
                                        onChange={() => updateItem({...row.original, activo: !row.value})}
                                    />
                                )
                            },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 60,
                                Cell: row =>
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={row.original.to_string}
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
                                    <Link to={`/app/proyectos/configuracion/tipos_equipos/${row.original.id}`}>
                                        <IconButtonTableSee/>
                                    </Link>

                            }
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        </Fragment>
    );
}, areEqual);

export default Tabla;