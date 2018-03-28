import React, {Fragment} from "react";
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {fechaFormatoUno, pesosColombianos} from '../../../../00_utilities/common';
import Checkbox from 'material-ui/Checkbox';
import {IconButtonTableEdit} from '../../../../00_utilities/components/ui/icon/iconos';
import ReactTooltip from 'react-tooltip'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = _.orderBy(this.props.data, ['fecha'], ['desc']);
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_hoja,
            permisos_object,
        } = this.props;


        return (
            <Fragment>
                <ReactTooltip/>
                <ReactTable
                    data={data}
                    noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                    columns={[
                        {
                            Header: "Caracteristicas",
                            columns: [
                                {
                                    Header: "Fecha",
                                    accessor: "fecha",
                                    maxWidth: 130,
                                    Cell: row => fechaFormatoUno(row.value)
                                },
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
                                    },
                                    Cell: row =>
                                        <div data-tip={row.original.descripcion_tarea}>
                                            {row.value}
                                        </div>
                                },
                                {
                                    Header: "Colaborador",
                                    accessor: "colaborador_nombre",
                                    maxWidth: 300,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Creado Por",
                                    accessor: "creado_por_username",
                                    maxWidth: 100
                                },
                                {
                                    Header: "Horas",
                                    accessor: "horas",
                                    maxWidth: 50,
                                    Cell: row =>
                                        <div className='text-right'>
                                            {row.value}
                                        </div>
                                },
                                {
                                    Header: "Minutos",
                                    accessor: "minutos",
                                    maxWidth: 60,
                                    Cell: row =>
                                        <div className='text-right'>
                                            {row.value}
                                        </div>
                                },
                                {
                                    Header: "Valor Hora",
                                    accessor: "tasa_valor_hora",
                                    maxWidth: 80,
                                    show: permisos_hoja.costos,
                                    Cell: row =>
                                        <div className='text-right'>
                                            {pesosColombianos(row.value)}
                                        </div>
                                },
                                {
                                    Header: "Costo Total",
                                    accessor: "costo_total",
                                    maxWidth: 100,
                                    show: permisos_hoja.costos,
                                    Cell: row =>
                                        <div className='text-right'>
                                            {pesosColombianos(row.value)}
                                        </div>
                                },
                                {
                                    Header: "Verificado",
                                    accessor: "verificado",
                                    show: permisos_object.verificar,
                                    maxWidth: 80,
                                    Cell: row =>
                                        <Checkbox
                                            checked={row.value}
                                            onCheck={() => updateItem({...row.original, verificado: !row.value})}
                                        />
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
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight tabla-maestra"
                />
            </Fragment>
        );
    }
}

export default Tabla;