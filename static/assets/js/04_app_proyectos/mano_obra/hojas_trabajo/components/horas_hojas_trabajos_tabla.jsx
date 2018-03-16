import React, {Fragment} from "react";
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {fechaFormatoUno, pesosColombianos} from '../../../../00_utilities/common';
import {IconButtonTableEdit} from '../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object
        } = this.props;


        return (
            <ReactTable
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Literal",
                                accessor: "literal_nombre",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Literal",
                                accessor: "literal_descripcion",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Horas",
                                accessor: "horas",
                                maxWidth: 50,
                                Cell: row => row.value
                            },
                            {
                                Header: "Minutos",
                                accessor: "minutos",
                                maxWidth: 60,
                                Cell: row => row.value
                            },
                            {
                                Header: "Costo Total",
                                accessor: "costo_total",
                                maxWidth: 100,
                                Cell: row => pesosColombianos(row.value)
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            // {
                            //     Header: "Activo",
                            //     accessor: "is_active",
                            //     show: permisos_object.make_user_active,
                            //     maxWidth: 60,
                            //     Cell: row => (
                            //         <Checkbox
                            //             checked={row.value}
                            //             onCheck={() => updateItem({...row.original, is_active: !row.value})}
                            //         />
                            //     )
                            // },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 60,
                                Cell: row => {
                                    return (
                                        row.original.literal_abierto ?
                                            <MyDialogButtonDelete
                                                onDelete={() => {
                                                    onDelete(row.original)
                                                }}
                                                element_name={`en ${fechaFormatoUno(row.original.fecha)} para ${row.original.colaborador_nombre}`}
                                                element_type={singular_name}
                                            /> :
                                            <Fragment></Fragment>
                                    )
                                }

                            },
                            {
                                Header: "Editar",
                                show: permisos_object.change,
                                maxWidth: 60,
                                Cell: row => {
                                    return (
                                        row.original.literal_abierto ?
                                            <IconButtonTableEdit
                                                onClick={() => {
                                                    onSelectItemEdit(row.original);
                                                }}/> :
                                            <Fragment></Fragment>
                                    )
                                }

                            },
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