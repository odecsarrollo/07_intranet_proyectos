import React, {memo} from "react";
import MyDialogButtonDelete from '../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from "../../00_utilities/components/ui/icon/table_icon_button_detail";

import ReactTable from "react-table";
import {Link} from "react-router-dom";

const Tabla = memo(props => {
    const data = _.map(props.list);
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
                            Header: "#",
                            accessor: "nro_consecutivo",
                            maxWidth: 70
                        },
                        {
                            Header: "Cliente",
                            accessor: "cliente_nombre",
                            maxWidth: 250,
                            minWidth: 250,
                            filterable: true
                        },
                        {
                            Header: "Estado",
                            accessor: "estado_display",
                            maxWidth: 80,
                            minWidth: 80,
                            filterable: true
                        },
                        {
                            Header: "Ciudad",
                            maxWidth: 350,
                            minWidth: 350,
                            filterable: true,
                            Cell: row => `${row.original.pais_nombre}-${row.original.departamento_nombre}-${row.original.ciudad_nombre}`
                        },
                        {
                            Header: "Contacto",
                            maxWidth: 250,
                            minWidth: 250,
                            filterable: true,
                            Cell: row => `${row.original.contacto_nombres} ${row.original.contacto_apellidos}`
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
                            maxWidth: 60,
                            Cell: row =>
                                <Link to={`/app/ventas_componentes/cotizaciones/detail/${row.original.id}`}>
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
});

export default Tabla;