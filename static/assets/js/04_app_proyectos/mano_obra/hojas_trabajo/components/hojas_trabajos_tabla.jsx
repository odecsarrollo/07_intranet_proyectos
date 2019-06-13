import React, {Fragment} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/table_icon_button_detail';
import {fechaFormatoUno, pesosColombianos} from '../../../../00_utilities/common';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = _.orderBy(this.props.data, ['fecha'], ['desc']);
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object,
            configuracion_costos
        } = this.props;

        const fecha_cierre = configuracion_costos ? configuracion_costos.fecha_cierre : null;

        return (
            <ReactTable
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Colaborador",
                                accessor: "colaborador_nombre",
                                maxWidth: 250,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Fecha",
                                accessor: "fecha",
                                maxWidth: 150,
                                Cell: row => fechaFormatoUno(row.value)
                            },
                            {
                                Header: "Valor Hora",
                                accessor: "tasa_valor_hora",
                                show: permisos_object.costos,
                                maxWidth: 100,
                                Cell: row =>
                                    <div className='text-right'>
                                        {pesosColombianos(row.value)}
                                    </div>
                            },
                            {
                                Header: "Horas",
                                accessor: "cantidad_horas",
                                maxWidth: 100,
                                Cell: row =>
                                    <div className='text-right'>
                                        {row.value}
                                    </div>

                            },
                            {
                                Header: "Costo Total",
                                accessor: "costo_total",
                                maxWidth: 100,
                                show: permisos_object.costos,
                                Cell: row =>
                                    <div className='text-right'>
                                        {pesosColombianos(row.value)}
                                    </div>
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
                                    const puede_eliminar = row.original.fecha > fecha_cierre;
                                    return (
                                         parseInt(row.original.cantidad_horas) === 0 && puede_eliminar ?
                                            <MyDialogButtonDelete
                                                onDelete={() => {
                                                    onDelete(row.original)
                                                }}
                                                element_name={`en ${fechaFormatoUno(row.original.fecha)} para ${row.original.colaborador_nombre}`}
                                                element_type={singular_name}
                                            /> : <Fragment></Fragment>
                                    )
                                }

                            },
                            {
                                Header: "Ver",
                                show: permisos_object.detail,
                                maxWidth: 60,
                                Cell: row =>
                                    <Link to={`/app/proyectos/mano_obra/hojas_trabajo/detail/${row.original.id}`}>
                                        <IconButtonTableSee/>
                                    </Link>

                            }
                        ]
                    }
                ]}
                defaultPageSize={50}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;