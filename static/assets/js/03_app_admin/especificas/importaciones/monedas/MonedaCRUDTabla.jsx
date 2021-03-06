import React from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {formatoMoneda} from "../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object
        } = this.props;


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
                                Header: "En Pesos",
                                maxWidth: 110,
                                accessor: "cambio",
                                Cell: row => `${formatoMoneda(row.value, '$', 0, 'COP')}`
                            },
                            {
                                Header: "Variacion %",
                                maxWidth: 80,
                                accessor: "variacion",
                                Cell: row => `${row.value}%`
                            },
                            {
                                Header: "Variacion $",
                                maxWidth: 80,
                                Cell: row => `${formatoMoneda(row.original.cambio * (row.original.variacion / 100), '$', 0, 'COP')}`
                            },
                            {
                                Header: "En Dolares",
                                maxWidth: 110,
                                accessor: "cambio_a_usd",
                                Cell: row => `${formatoMoneda(row.value, '$', 5, 'USD')}`
                            },
                            {
                                Header: "Variacion USD %",
                                maxWidth: 80,
                                accessor: "variacion_usd",
                                Cell: row => `${row.value}%`
                            },
                            {
                                Header: "Variacion $",
                                maxWidth: 120,
                                Cell: row => `${formatoMoneda(row.original.cambio_a_usd * (row.original.variacion_usd / 100), '$', 6, 'USD')}`
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
        );
    }
}

export default Tabla;