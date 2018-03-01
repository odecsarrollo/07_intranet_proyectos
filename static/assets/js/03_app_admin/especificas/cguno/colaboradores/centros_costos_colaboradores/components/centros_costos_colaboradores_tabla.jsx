import React from "react";
import {MyDialogButtonDelete} from '../../../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit} from '../../../../../../00_utilities/components/ui/icon/iconos';

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            onDelete,
            onSelectItemEdit,
            permisos,
            element_type,
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
                                    Header: "Id",
                                    accessor: "id",
                                    maxWidth: 60,
                                },
                                {
                                    Header: "Nombres",
                                    accessor: 'nombre',
                                    maxWidth: 280,
                                },
                            ]
                        },
                        {
                            Header: "Opciones",
                            columns: [
                                {
                                    Header: "Elimi.",
                                    show: permisos.delete,
                                    maxWidth: 45,
                                    Cell: row =>
                                        <MyDialogButtonDelete
                                            onDelete={() => {
                                                onDelete(row.original)
                                            }}
                                            element_name={row.original.nombre}
                                            element_type={element_type}
                                        />

                                },
                                {
                                    Header: "Editar",
                                    show: permisos.change,
                                    maxWidth: 45,
                                    Cell: row =>
                                        <IconButtonTableEdit
                                            onClick={() => {
                                                onSelectItemEdit(row.original);
                                            }}/>

                                },
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