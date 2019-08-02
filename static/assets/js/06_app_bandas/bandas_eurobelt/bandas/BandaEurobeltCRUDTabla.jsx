import React, {memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';

import ReactTable from "react-table";
import {Link} from "react-router-dom";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}


const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['nombre'], ['asc']);
    const {
        singular_name,
        onDelete,
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
                            Header: "Ver",
                            show: permisos_object.detail,
                            maxWidth: 40,
                            Cell: row =>
                                <Link to={`/app/bandas/banda/${row.original.id}`}>
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
}, areEqual);

export default Tabla;