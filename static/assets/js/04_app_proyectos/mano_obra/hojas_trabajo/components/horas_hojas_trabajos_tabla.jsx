import React, {Fragment} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import {fechaFormatoUno, pesosColombianos} from '../../../../00_utilities/common';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';
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
            permisos_object,
            permisos_hoja
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
                                    maxWidth: 400,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Horas",
                                    accessor: "horas",
                                    maxWidth: 90,
                                    Footer:
                                    _.size(data) > 0 &&
                                    <div className='text-right'>
                                            <span>
                                                {((_.map(data, e => e.cantidad_minutos).reduce(((total, actual) => total + actual))) / 60).toFixed(2)} Horas
                                            </span>
                                    </div>
                                    ,
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
                                    Header: "Costo Total",
                                    accessor: "costo_total",
                                    maxWidth: 100,
                                    show: permisos_hoja.costos,
                                    Footer:
                                    permisos_hoja.costos &&
                                    _.size(data) > 0 &&
                                    <div className='text-right'>
                                        <span>
                                            {pesosColombianos(_.map(data, e => e.costo_total).reduce(((total, actual) => total + actual)))}
                                        </span>
                                    </div>,
                                    Cell: row =>
                                        <div className='text-right'>
                                            {pesosColombianos(row.value)}
                                        </div>
                                },
                                {
                                    Header: "Verificada",
                                    accessor: "verificado",
                                    maxWidth: 70,
                                    Cell: row => {
                                        return (
                                            <div data-tip={row.original.descripcion_tarea} className='text-center'>
                                                {
                                                    row.value ?
                                                        <i className='fas fa-check' style={{color: 'green'}}></i> :
                                                        <i className='fas fa-times' style={{color: 'red'}}></i>
                                                }
                                            </div>
                                        )
                                    }
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
                                            row.original.literal_abierto &&
                                            (
                                                (
                                                    row.original.autogestionada &&
                                                    !row.original.verificado
                                                ) ||
                                                (
                                                    !row.original.autogestionada
                                                )
                                            ) ?
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
                                            row.original.literal_abierto &&
                                            !row.original.verificado ?
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
            </Fragment>
        );
    }
}

export default Tabla;