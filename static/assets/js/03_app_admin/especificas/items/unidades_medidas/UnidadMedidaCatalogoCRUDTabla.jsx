import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Checkbox from "@material-ui/core/Checkbox";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['to_string'], ['asc']);
    const {
        singular_name,
        onDelete,
        updateItem,
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
                            maxWidth: 100,
                            minWidth: 100,
                        },
                        {
                            Header: "Descripcion",
                            maxWidth: 200,
                            minWidth: 200,
                            accessor: "to_string"
                        },
                        {
                            Header: "Decimales",
                            maxWidth: 80,
                            minWidth: 80,
                            accessor: 'decimales'
                        },
                        {
                            Header: "Sincr.",
                            maxWidth: 80,
                            minWidth: 80,
                            accessor: 'sincronizado_sistema_informacion',
                            Cell: row => (
                                row.value && <div className='text-center' style={{color: 'green'}}>
                                    <FontAwesomeIcon
                                        icon={'check-circle'}
                                    />
                                </div>
                            )
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
                                <MyDialogButtonDelete
                                    onDelete={() => {
                                        onDelete(row.original)
                                    }}
                                    element_name={`${row.original.to_string}`}
                                    element_type={singular_name}
                                />

                        },
                        {
                            Header: "Activo",
                            accessor: "activo",
                            maxWidth: 50,
                            Cell: row => (
                                <div className='text-center' style={{width: '100%'}}>
                                    <Checkbox
                                        style={{margin: 0, padding: 0}}
                                        color='primary'
                                        checked={row.value}
                                        onChange={() => updateItem({...row.original, activo: !row.value})}
                                    />
                                </div>
                            )
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