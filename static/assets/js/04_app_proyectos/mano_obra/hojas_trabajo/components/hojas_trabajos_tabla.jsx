import React, {Fragment} from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
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
                                    return (
                                        row.original.costo_total > 0 ?
                                            <Fragment></Fragment> :
                                            <MyDialogButtonDelete
                                                onDelete={() => {
                                                    onDelete(row.original)
                                                }}
                                                element_name={`en ${fechaFormatoUno(row.original.fecha)} para ${row.original.colaborador_nombre}`}
                                                element_type={singular_name}
                                            />
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
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;