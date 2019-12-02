import React from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
                                Header: "Descripción",
                                accessor: "descripcion",
                                maxWidth: 220,
                            },
                            {
                                Header: "Requiere Documento",
                                accessor: "require_documento",
                                maxWidth: 100,
                                Cell: row => <div>
                                    {row.value && <FontAwesomeIcon
                                        className='puntero ml-4'
                                        onClick={() => onDelete(e.id)}
                                        icon={'check-circle'}
                                    />}
                                </div>
                            },
                            {
                                Header: "Con. Especial",
                                accessor: "condicion_especial",
                                maxWidth: 100,
                                Cell: row => <div>
                                    {row.value && <FontAwesomeIcon
                                        className='puntero ml-4'
                                        onClick={() => onDelete(e.id)}
                                        icon={'check-circle'}
                                    />}
                                </div>
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