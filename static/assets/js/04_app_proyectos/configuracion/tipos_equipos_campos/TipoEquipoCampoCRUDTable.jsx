import React, {Fragment, memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const TipoEquipoCampoCRUDTable = memo(props => {
    const {
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
                            {
                                Header: "Tamaño",
                                accessor: "tamano",
                                maxWidth: 70
                            },
                            {
                                Header: "Tam. Col",
                                accessor: "tamano_columna",
                                maxWidth: 70
                            },
                            {
                                Header: "Uni. Med",
                                accessor: "unidad_medida",
                                maxWidth: 100
                            },
                            {
                                Header: "Orden",
                                accessor: "orden",
                                maxWidth: 70
                            },
                            {
                                Header: "Tipo",
                                accessor: "get_tipo_display",
                                maxWidth: 100
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

export default TipoEquipoCampoCRUDTable;