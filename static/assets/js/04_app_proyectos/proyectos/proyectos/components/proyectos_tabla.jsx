import React, {Fragment} from "react";
import Checkbox from '@material-ui/core/Checkbox';
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../../00_utilities/components/ui/icon/table_icon_button_detail';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

class Tabla extends React.Component {

    constructor(props) {
        super(props);
        this.state = {tipo_proyecto: null}
    }

    render() {

        let data = _.orderBy(this.props.data, ['abierto', 'id_proyecto'], ['desc', 'desc']);
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object,
            permisos_cotizaciones
        } = this.props;

        const tipos_proyectos_base = _.map(this.props.data, p => p.id_proyecto.substring(0, 2)).filter((v, i, self) => self.indexOf(v) === i);

        const tipos_proyectos = tipos_proyectos_base.map(t => {
            return {
                tipo: t
            }
        });
        const {tipo_proyecto} = this.state;

        if (tipo_proyecto) {
            data = data.filter(d => d.id_proyecto.substring(0, 2) === tipo_proyecto)
        }


        return (
            <Fragment>
                <div>
                    Tipo: {
                    tipos_proyectos.map(
                        t =>
                            <span className={`puntero`}
                                  style={{color: `${tipo_proyecto === t.tipo ? 'red' : 'black'}`}}
                                  onClick={() => this.setState({tipo_proyecto: t.tipo})}
                                  key={t.tipo}>[{t.tipo}] </span>
                    )
                }
                    <span className='puntero'
                          onClick={() => this.setState({tipo_proyecto: null})}
                          style={{color: `${tipo_proyecto === null ? 'red' : 'black'}`}}
                    >TODO </span>
                </div>
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
                                                    to={`/app/ventas/cotizaciones/cotizaciones/detail/${row.original.cotizacion}`}>
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
                                    show: permisos_object.change,
                                    Cell: row => (
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={row.value}
                                            onChange={() => updateItem({...row.original, abierto: !row.value})}
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
                                            element_name={row.original.to_string}
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
            </Fragment>
        );
    }
}

export default Tabla;