import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import {pesosColombianos} from '../../../../../00_utilities/common';

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {
        const data = this.props.data;
        const {
            updateItem,
            onDelete,
            onSelectItem,
            handleOpen,
            can_detail,
            can_delete,
            can_change,
            can_see_costo_total,
            can_see_costo_presupuestado,
            can_see_precio,
            can_see_costo_materiales,
            can_see_costo_mano_obra
        } = this.props;
        return (
            <div>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: "Información Proyecto",
                            columns: [
                                {
                                    Header: "Proyecto",
                                    accessor: "id_proyecto",
                                    maxWidth: 150,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toLowerCase())
                                    }
                                },
                                {
                                    Header: "Costo Presupuestado",
                                    accessor: "costo_presupuestado",
                                    maxWidth: 150,
                                    show: can_see_costo_presupuestado,
                                    Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                                },
                                {
                                    Header: "Precio",
                                    accessor: "valor_cliente",
                                    maxWidth: 150,
                                    show: can_see_precio,
                                    Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                                },
                            ]
                        },
                        {
                            Header: "Costos Reales",
                            columns: [
                                {
                                    Header: "Costo Materiales",
                                    accessor: "costo_materiales",
                                    maxWidth: 150,
                                    show: can_see_costo_materiales,
                                    Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                                },
                                {
                                    Header: "Costo Mano Obra",
                                    accessor: "costo_mano_obra",
                                    maxWidth: 150,
                                    show: can_see_costo_mano_obra,
                                    Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                                },
                                {
                                    Header: "Costo Total",
                                    maxWidth: 150,
                                    show: can_see_costo_total,
                                    Cell: row => <div
                                        className='text-right'>{pesosColombianos(Number(row.original.costo_materiales) + Number(row.original.costo_mano_obra))}</div>
                                },
                            ]
                        },
                        {
                            Header: "Opciones",
                            columns: [
                                {
                                    Header: "Abierto",
                                    accessor: "abierto",
                                    maxWidth: 60,
                                    Cell: row => (
                                        <Checkbox
                                            checked={row.value}
                                            onCheck={() => updateItem({...row.original, abierto: !row.value})}
                                        />
                                    )
                                },
                                {
                                    Header: "Elimi.",
                                    show: can_delete,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <MyDialogButtonDelete
                                            onDelete={() => {
                                                onDelete(row.original)
                                            }}
                                            element_name={row.original.id_proyecto}
                                            element_type='Proyecto'
                                        />

                                },
                                {
                                    Header: "Editar",
                                    show: can_change,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <IconButtonTableEdit
                                            onClick={() => {
                                                onSelectItem(row.original);
                                                handleOpen()
                                            }}/>

                                },
                                {
                                    Header: "Ver",
                                    show: can_detail,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <Link to={`/app/admin/cguno/proyectos/detail/${row.original.id}`}>
                                            <IconButtonTableSee/>
                                        </Link>

                                }
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