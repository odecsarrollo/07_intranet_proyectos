import React from "react";
import {MyDialogButtonDelete} from '../../../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit} from '../../../../../../00_utilities/components/ui/icon/iconos';
import {fechaFormatoUno, pesosColombianos} from '../../../../../../00_utilities/common';

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
                                Header: "Nombre",
                                maxWidth: 250,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return (
                                        row._original.colaborador_nombres.includes(filter.value.toUpperCase()) ||
                                        row._original.colaborador_apellidos.includes(filter.value.toUpperCase())
                                    )
                                },
                                Cell: row => {
                                    return (
                                        <span>{row.original.colaborador_nombres} {row.original.colaborador_apellidos}</span>
                                    )
                                }
                            },
                            {
                                Header: "Lapso",
                                accessor: "lapso",
                                maxWidth: 130,
                                Cell: row => fechaFormatoUno(row.value)
                            },
                            {
                                Header: "Centro Costo",
                                accessor: "centro_costo_nombre",
                                maxWidth: 130,
                            },
                            {
                                Header: "Costo",
                                accessor: "costo",
                                maxWidth: 90,
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "Nro. Horas",
                                accessor: "nro_horas_mes",
                                maxWidth: 90,
                            },
                            {
                                Header: "Valor Hora",
                                accessor: "valor_hora",
                                maxWidth: 90,
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "Sal. Fijo",
                                accessor: "es_salario_fijo",
                                maxWidth: 60,
                                Cell: row => (
                                    row.value && <i className='far fa-check-circle'></i>
                                )
                            },
                            {
                                Header: "No Actual.",
                                accessor: "modificado",
                                maxWidth: 70,
                                Cell: row => (
                                    row.value && <i className='far fa-check-circle'></i>
                                )
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
                                Cell: row =>
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={row.original.nombre}
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