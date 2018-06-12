import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {

        const data = _.orderBy(this.props.data, ['abierto', 'id_proyecto'], ['desc', 'asc']);
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object,
            permisos_cotizaciones
        } = this.props;


        return (
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
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Nro. Cotización",
                                accessor: "cotizacion_nro",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => {
                                    return (
                                        permisos_cotizaciones.detail ?
                                            <Link
                                                to={`/app/proyectos/cotizaciones/cotizaciones/detail/${row.original.cotizacion}`}>
                                                <span>{row.value}</span>
                                            </Link> :
                                            <span>{row.value}</span>
                                    )
                                }
                            }
                            ,
                            {
                                Header: "Nombre",
                                accessor: "nombre",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => <div>{row.value ? row.value : 'SIN DEFINIR'}</div>
                            },
                            {
                                Header: "Cliente",
                                accessor: "cliente_nombre",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => <div>{row.value ? row.value : 'SIN DEFINIR'}</div>
                            },
                            {
                                Header: "Costo Presupuestado",
                                accessor: "costo_presupuestado",
                                maxWidth: 150,
                                show: permisos_object.costo_presupuestado,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "Precio",
                                accessor: "valor_cliente",
                                maxWidth: 150,
                                show: permisos_object.valor,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                        ]
                    },
                    {
                        Header: "Mano Obra",
                        columns: [
                            {
                                Header: "Costo M.O",
                                maxWidth: 150,
                                show: permisos_object.costo_mano_obra,
                                Cell: row => <div
                                    className='text-right'>{pesosColombianos(Number(row.original.costo_mano_obra) + Number(row.original.costo_mano_obra_inicial))}</div>
                            },
                            {
                                Header: "Horas M.O",
                                maxWidth: 80,
                                Cell: row => <div
                                    className='text-right'>{(Number(row.original.cantidad_horas_mano_obra) + Number(row.original.cantidad_horas_mano_obra_inicial)).toFixed(2)}</div>
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
                                show: permisos_object.costo_materiales,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "Costo Total",
                                maxWidth: 150,
                                show: permisos_object.costo,
                                Cell: row => <div
                                    className='text-right'>{pesosColombianos(Number(row.original.costo_materiales) + Number(row.original.costo_mano_obra) + Number(row.original.costo_mano_obra_inicial))}</div>
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
                                show: permisos_object.delete,
                                maxWidth: 60,
                                Cell: row =>
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={row.original.id_proyecto}
                                        element_type={singular_name}
                                    />

                            },
                            {
                                Header: "Editar",
                                show: permisos_object.change,
                                maxWidth: 60,
                                Cell: row =>
                                    <IconButtonTableEdit
                                        onClick={() => {
                                            onSelectItemEdit(row.original);
                                        }}/>

                            },
                            {
                                Header: "Ver",
                                show: permisos_object.detail,
                                maxWidth: 60,
                                Cell: row =>
                                    <Link to={`/app/proyectos/proyectos/detail/${row.original.id}`}>
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
    }
}

export default Tabla;