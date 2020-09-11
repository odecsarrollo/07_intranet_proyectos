import React, {memo} from "react";
import {Link} from "react-router-dom";
import MyDialogButtonDelete from '../../00_utilities/components/ui/dialog/delete_dialog';
import ReactTable from "react-table";
import IconButtonTableSee from "../../00_utilities/components/ui/icon/table_icon_button_detail";

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
            noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Equipo",
                            accessor: "identificado_equipo",
                            maxWidth: 150,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id].includes(filter.value.toUpperCase())
                        },
                        {
                            Header: "Cliente",
                            accessor: "cliente_nombre",
                            maxWidth: 200,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id].includes(filter.value.toUpperCase())
                        },
                        {
                            Header: "Descripción",
                            accessor: "descripcion",
                            maxWidth: 400,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id].includes(filter.value.toUpperCase())
                        },
                        {
                            Header: "Tipo",
                            accessor: "get_tipo_display",
                            maxWidth: 100,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id].includes(filter.value.toUpperCase())
                        },
                        {
                            Header: "Estado",
                            accessor: "get_estado_display",
                            maxWidth: 100,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id].includes(filter.value.toUpperCase())
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
                            Header: "Ver",
                            show: permisos_object.detail,
                            maxWidth: 40,
                            Cell: row =>
                                <Link to={`/app/postventa/orden/${row.original.id}`}>
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