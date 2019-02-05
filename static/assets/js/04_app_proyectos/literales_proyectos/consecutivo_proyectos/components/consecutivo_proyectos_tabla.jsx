import React, {Fragment} from "react";
import {IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {fechaFormatoUno, pesosColombianos} from '../../../../00_utilities/common';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {

    constructor(props) {
        super(props);
        this.state = {tipo_proyecto: null}
    }

    render() {
        let data = this.props.data;
        const {
            singular_name,
            permisos_object
        } = this.props;

        const tipos_proyectos_base = _.map(this.props.data, p => p.id_literal.substring(0, 2)).filter((v, i, self) => self.indexOf(v) === i);

        const tipos_proyectos = tipos_proyectos_base.map(t => {
            return {
                tipo: t
            }
        });
        const {tipo_proyecto} = this.state;

        if (tipo_proyecto) {
            data = data.filter(d => d.id_literal.substring(0, 2) === tipo_proyecto)
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
                    noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                    columns={[
                        {
                            Header: "Caracteristicas",
                            columns: [
                                {
                                    Header: "Abierto",
                                    accessor: "abierto",
                                    maxWidth: 60,
                                    Cell: row => <div className='text-center'>
                                        <i
                                            className={`fas fa${row.value ? '-check' : '-times'}-circle`}
                                            style={{color: `${row.value ? 'green' : 'red'}`}}
                                        >
                                        </i>
                                    </div>
                                },
                                {
                                    Header: "Literal",
                                    accessor: "id_literal",
                                    maxWidth: 100,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Nombre Literal",
                                    accessor: "descripcion",
                                    maxWidth: 300,
                                    minWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                    },
                                    Cell: row => {
                                        return (
                                            <div style={{
                                                fontSize: '0.6rem',
                                                whiteSpace: 'normal'
                                            }}>
                                                {row.value}
                                            </div>
                                        )
                                    }
                                },
                                {
                                    Header: "Nombre Proyecto",
                                    accessor: "proyecto_nombre",
                                    maxWidth: 300,
                                    minWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                    },
                                    Cell: row => {
                                        return (
                                            <div style={{
                                                fontSize: '0.6rem',
                                                whiteSpace: 'normal'
                                            }}>
                                                {row.value}
                                            </div>
                                        )
                                    }
                                },
                                {
                                    Header: "Cliente",
                                    accessor: "cliente_nombre",
                                    maxWidth: 300,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Nro. Cotización",
                                    accessor: "cotizacion_nro",
                                    maxWidth: 100,
                                },
                                {
                                    Header: "Nro. OC",
                                    accessor: "orden_compra_nro",
                                    maxWidth: 100,
                                },
                                {
                                    Header: "Fecha OC",
                                    accessor: "orden_compra_fecha",
                                    maxWidth: 150,
                                    Cell: row => <div>{row.value ? fechaFormatoUno(row.value) : ''}</div>
                                },
                                {
                                    Header: "F. E. Pactada",
                                    accessor: "fecha_entrega_pactada",
                                    maxWidth: 150,
                                    Cell: row => <div>{row.value ? fechaFormatoUno(row.value) : ''}</div>
                                },
                                {
                                    Header: "Precio",
                                    accessor: "valor_cliente",
                                    maxWidth: 150,
                                    Cell: row => <div
                                        className='text-right'>{row.value ? pesosColombianos(row.value) : ''}</div>
                                },
                            ]
                        },
                        {
                            Header: "Opciones",
                            columns: [
                                {
                                    Header: "Ver",
                                    maxWidth: 60,
                                    Cell: row =>
                                        <Link to={`/app/proyectos/proyectos/detail/${row.original.proyecto}`}>
                                            <IconButtonTableSee/>
                                        </Link>

                                }
                            ]
                        }
                    ]}
                    defaultPageSize={25}
                    className="-striped -highlight tabla-maestra"
                />
            </Fragment>
        );
    }
}

export default Tabla;