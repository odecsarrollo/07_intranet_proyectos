import React, {memo} from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {formatoMoneda, pesosColombianos} from "../../../../00_utilities/common";
import Checkbox from "@material-ui/core/Checkbox";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list && prevProps.origen_seleccionado === nextProps.origen_seleccionado
}

const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['to_string'], ['asc']);
    const origenes = [
        {indice: 1, nombre: 'Lista Precios', codigo: 'LP_INTRANET'},
        {indice: 2, nombre: 'Sistema Información', codigo: 'SIS_INF'},
    ];
    const {
        singular_name,
        onDelete,
        updateItem,
        onSelectItemEdit,
        permisos_object,
        setOrigenSeleccionado,
        origen_seleccionado
    } = props;
    return (
        <div>
            <div>
                Tipo:
                <div className="row">
                    {_.map(origenes, e =>
                        <div
                            key={e.codigo} className="col-12 col-sm-6 col-md-3 col-lg-1 puntero"
                            onClick={() => setOrigenSeleccionado(e.codigo)}
                            style={{color: `${e.codigo === origen_seleccionado ? 'red' : ''}`}}
                        >
                            {e.nombre}
                        </div>)}
                </div>
            </div>

            <ReactTable
                data={data}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Id",
                                accessor: "id",
                                maxWidth: 70
                            },
                            {
                                Header: "Nombre",
                                maxWidth: 300,
                                minWidth: 300,
                                accessor: "to_string",
                                filterable: true,
                                filterMethod: (filter, row) => row._original.to_string.includes(filter.value.toUpperCase()),
                                Cell: row => <div style={{
                                    fontSize: '0.8rem',
                                    whiteSpace: 'normal'
                                }}>{row.value}</div>
                            },
                            {
                                Header: "Referencia",
                                maxWidth: 110,
                                accessor: 'referencia',
                                filterable: true,
                                filterMethod: (filter, row) => row._original.referencia.includes(filter.value.toUpperCase())
                            },
                            {
                                Header: "Proveedor",
                                accessor: "proveedor_nombre",
                                maxWidth: 100,
                                minWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            },
                            {
                                Header: "Categoria",
                                accessor: "categoria_nombre",
                                maxWidth: 150,
                                minWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            },
                            {
                                Header: "U.M",
                                maxWidth: 80,
                                accessor: "unidad_medida",
                                Cell: row => row.value
                            },
                            {
                                Header: "Costo Mon.",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "costo",
                                Cell: row => <div className='text-right'>
                                    {row.value} {row.original.moneda_nombre}
                                </div>
                            },
                            {
                                Header: "FI",
                                maxWidth: 40,
                                minWidth: 40,
                                accessor: "proveedor_importacion_fi",
                                Cell: row => <div className='text-right'>
                                    {row.value}
                                </div>
                            },
                            {
                                Header: "Costo",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "costo_cop",
                                Cell: row => <div className='text-right'
                                                  style={{color: row.original.costo_a_usar === row.value ? 'red' : ''}}>
                                    {pesosColombianos(row.value)} COP
                                </div>
                            },
                            {
                                Header: "Costo Siesa",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "costo_sistema_informacion",
                                Cell: row => <div className='text-right'
                                                  style={{color: row.original.costo_a_usar === row.value ? 'red' : ''}}
                                >
                                    {row.original.item_sistema_informacion ? (row.value > 0 ? `${pesosColombianos(row.value)} COP` : 'N.A') : 'N.A'}
                                </div>
                            },
                            {
                                Header: "FI Aer.",
                                maxWidth: 50,
                                minWidth: 50,
                                accessor: "proveedor_importacion_fi_aereo",
                                Cell: row => <div className='text-right'>
                                    {row.value}
                                </div>
                            },
                        ]
                    },
                    {
                        Header: "PESOS COLOMBIANOS",
                        columns: [
                            {
                                Header: "TRM",
                                maxWidth: 80,
                                accessor: "moneda_tasa",
                                Cell: row => <div className='text-right'>
                                    {pesosColombianos(row.value)} COP
                                </div>
                            },
                            {
                                Header: "Cos. Aereo",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "costo_cop_aereo",
                                Cell: row => <div className='text-right'>
                                    {pesosColombianos(row.value)} COP
                                </div>
                            },
                            {
                                Header: "MGN",
                                maxWidth: 50,
                                minWidth: 50,
                                accessor: "margen_deseado",
                                Cell: row => <div className='text-right'>
                                    {row.value}%
                                </div>
                            },
                            {
                                Header: "Pre. Base.",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "precio_base",
                                Cell: row => <div className='text-right'>
                                    {pesosColombianos(row.value)} COP
                                </div>
                            },
                            {
                                Header: "Pre. Bas. Aer",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "precio_base_aereo",
                                Cell: row => <div className='text-right'>
                                    {pesosColombianos(row.value)} COP
                                </div>
                            },
                        ]
                    },
                    {
                        Header: "DOLARES AMERICANOS",
                        columns: [
                            {
                                Header: "TRM",
                                maxWidth: 80,
                                accessor: "moneda_tasa_usd",
                                Cell: row => <div className='text-right'>
                                    {formatoMoneda(row.value, '$', 2)} USD
                                </div>
                            },
                            {
                                Header: "Costo USD",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "costo_usd",
                                Cell: row => <div className='text-right'
                                                  style={{color: row.original.costo_a_usar === row.value ? 'red' : ''}}>
                                    {formatoMoneda(row.value, '$', 2)} USD
                                </div>
                            },
                            {
                                Header: "Cos. Aereo USD",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "costo_usd_aereo",
                                Cell: row => <div className='text-right'>
                                    {formatoMoneda(row.value, '$', 2)} USD
                                </div>
                            },
                            {
                                Header: "MGN",
                                maxWidth: 50,
                                minWidth: 50,
                                accessor: "margen_deseado",
                                Cell: row => <div className='text-right'>
                                    {row.value}%
                                </div>
                            },
                            {
                                Header: "Pre. Base. USD",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "precio_base_usd",
                                Cell: row => <div className='text-right'>
                                    {formatoMoneda(row.value, '$', 2)} USD
                                </div>
                            },
                            {
                                Header: "Pre. Bas. Aer",
                                maxWidth: 90,
                                minWidth: 90,
                                accessor: "precio_base_aereo_usd",
                                Cell: row => <div className='text-right'>
                                    {formatoMoneda(row.value, '$', 2)} USD
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
                                maxWidth: 45,
                                Cell: row =>
                                    row.original.origen === 'LP_INTRANET' &&
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={`${row.original.to_string}`}
                                        element_type={singular_name}
                                    />

                            },
                            {
                                Header: "Activo",
                                accessor: "activo",
                                maxWidth: 50,
                                Cell: row => (
                                    <div className='text-center' style={{width: '100%'}}>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={row.value}
                                            onChange={() => updateItem({...row.original, activo: !row.value})}
                                        />
                                    </div>
                                )
                            },
                            {
                                Header: "Editar",
                                show: permisos_object.change,
                                maxWidth: 45,
                                Cell: row =>
                                    <IconButtonTableEdit
                                        onClick={() => {
                                            onSelectItemEdit(row.original);
                                        }}/>

                            }
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        </div>
    )
}, areEqual);

export default Tabla;