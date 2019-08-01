import React, {memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";

const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['nombre'], ['asc']);
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
                            maxWidth: 220,
                            filterable: true,
                            filterMethod: (filter, row) => row._original.to_string.includes(filter.value.toUpperCase()),
                            Cell: row => `${row.original.to_string}`
                        },
                        {
                            Header: "Nomenclatura",
                            maxWidth: 110,
                            accessor: "nomenclatura",
                            filterable: true,
                            filterMethod: (filter, row) => row.value.includes(filter.value.toUpperCase()),
                            Cell: row => `${row.value}`
                        }
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
                                !row.original.es_cguno &&
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
            defaultPageSize={20}
            className="-striped -highlight tabla-maestra"
        />
    );
});

export default Tabla;