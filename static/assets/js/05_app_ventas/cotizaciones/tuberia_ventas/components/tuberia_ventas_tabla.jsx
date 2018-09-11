import React from "react";
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {fechaFormatoUno, pesosColombianos} from "../../../../00_utilities/common";

class Tabla extends React.Component {
    constructor(props) {
        super(props);
        this.state = {color: null}
    }

    render() {
        let data = _.orderBy(this.props.data, ['nro_cotizacion'], ['desc']);
        const {color} = this.state;
        if (color) {
            data = _.orderBy(_.pickBy(this.props.data, e => e.color_tuberia_ventas === color), ['nro_cotizacion'], ['desc']);
        }
        const colores = _.uniq(_.map(this.props.data, e => e.color_tuberia_ventas).filter(h => h));
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object,
            proyectos_permisos
        } = this.props;
        return (
            <div className='row'>
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 text-right pb-1">
                            Estados
                                {colores.map(c => {
                                    return (
                                        <span
                                            key={c}
                                            className="btn puntero"
                                            style={{backgroundColor: c, height: '40px', border:'1px solid black'}}
                                            onClick={() => {
                                                this.setState({color: c})
                                            }}
                                        >

                                        </span>
                                    )
                                })}
                                <span className="btn puntero"
                                      style={{backgroundColor: 'white', border:'1px solid black', height:'40px'}}
                                      onClick={() => {
                                          this.setState({color: null})
                                      }}
                                >
                                    Todas
                                </span>

                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <ReactTable
                        data={data}
                        noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                        columns={[
                            {
                                Header: "Caracteristicas",
                                columns: [
                                    {
                                        Header: "Nro. Coti",
                                        accessor: "nro_cotizacion",
                                        maxWidth: 70
                                    },
                                    {
                                        Header: "Uni. Nego",
                                        accessor: "unidad_negocio",
                                        maxWidth: 70,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].includes(filter.value.toUpperCase())
                                        }
                                    },
                                    {
                                        Header: "Cliente",
                                        accessor: "cliente_nombre",
                                        maxWidth: 190,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].includes(filter.value.toUpperCase())
                                        },
                                        Cell: row => {
                                            return (
                                                <div style={{
                                                    fontSize: '0.6rem',
                                                    whiteSpace: 'normal'
                                                }}>{row.value}</div>
                                            )
                                        }
                                    },
                                    {
                                        Header: "Responsable",
                                        maxWidth: 140,
                                        filterable: true,
                                        accessor: "responsable_actual_nombre",
                                        Cell: row => {
                                            return (
                                                <div style={{
                                                    fontSize: '0.6rem',
                                                    whiteSpace: 'normal'
                                                }}>{row.value}</div>
                                            )
                                        }
                                    },
                                    {
                                        Header: "Descripción",
                                        accessor: "descripcion_cotizacion",
                                        maxWidth: 350,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].includes(filter.value.toUpperCase())
                                        },
                                        Cell: row => {
                                            return (
                                                <div style={{
                                                    fontSize: '0.6rem',
                                                    whiteSpace: 'normal'
                                                }}>{row.value}</div>
                                            )
                                        }
                                    },
                                    {
                                        Header: "F. Verificación",
                                        accessor: "fecha_limite_segumiento_estado",
                                        maxWidth: 100,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            const fecha = row[filter.id] ? fechaFormatoUno(row[filter.id]).toString().toUpperCase() : '';
                                            return fecha.includes(filter.value.toUpperCase()) || (row[filter.id] && row[filter.id].includes(filter.value.toUpperCase()))
                                        },
                                    },
                                    {
                                        Header: "Estado",
                                        accessor: "estado",
                                        maxWidth: 200,
                                        filterable: true,
                                        filterMethod: (filter, row) => {
                                            return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                        },
                                        Cell: row => {
                                            return (
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '2px',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: `${row.original.porcentaje_tuberia_ventas > 100 ? 100 : row.original.porcentaje_tuberia_ventas}%`,
                                                            height: '100%',
                                                            padding: '2px',
                                                            backgroundColor: row.original && row.original.color_tuberia_ventas,
                                                            borderRadius: '2px',
                                                            transition: 'all .2s ease-out'
                                                        }}
                                                    >
                                                        {row.value}
                                                        {
                                                            row.original.porcentaje_tuberia_ventas &&
                                                            <div className='text-right'>
                                                                {row.original.porcentaje_tuberia_ventas}%
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        },
                                    },
                                    {
                                        Header: "$ Oferta",
                                        accessor: "valor_ofertado",
                                        maxWidth: 100,
                                        Cell: row => <div className='text-right'>
                                            {
                                                row.original.valor_orden_compra ?
                                                    pesosColombianos(row.original.valor_orden_compra) :
                                                    pesosColombianos(row.value)
                                            }
                                        </div>
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
                                                element_name={row.original.descripcion_cotizacion}
                                                element_type={singular_name}
                                            />

                                    },
                                    {
                                        Header: "Ver",
                                        show: permisos_object.detail,
                                        maxWidth: 60,
                                        Cell: row =>
                                            <Link
                                                to={`/app/ventas/cotizaciones/cotizaciones/detail/${row.original.id}`}>
                                                <IconButtonTableSee/>
                                            </Link>

                                    }
                                ]
                            }
                        ]}
                        defaultPageSize={100}
                        className="-striped -highlight tabla-maestra"
                    />
                </div>
            </div>
        );
    }
}

export default Tabla;