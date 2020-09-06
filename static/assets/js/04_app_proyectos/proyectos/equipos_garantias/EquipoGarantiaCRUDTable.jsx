import React, {Fragment, memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';
import {fechaFormatoUno} from '../../../00_utilities/common';

import ReactTable from "react-table";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const EquipoGarantiaCRUDTable = memo(props => {
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
                                Header: "Fecha Inicial",
                                accessor: "fecha_inicial",
                                maxWidth: 150,
                                Cell: row => fechaFormatoUno(row.value)
                            },
                            {
                                Header: "Fecha Final",
                                accessor: "fecha_final",
                                maxWidth: 150,
                                Cell: row => fechaFormatoUno(row.value)
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

export default EquipoGarantiaCRUDTable;