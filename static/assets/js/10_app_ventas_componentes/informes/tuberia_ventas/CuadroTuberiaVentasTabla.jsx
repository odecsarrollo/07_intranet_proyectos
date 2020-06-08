import React, {Fragment, memo} from 'react';
import {Link} from "react-router-dom";
import crudHOC from "../../../00_utilities/components/HOC_CRUD2";
import InformationDisplayDialog from "../../../00_utilities/components/ui/dialog/InformationDisplayDialog";

import Table from "react-table";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import {formatoMoneda} from "../../../00_utilities/common";

const SelectTable = selectTableHOC(Table);

const Tabla = (props) => {
    let data = props.list;
    const {
        selection,
        getTrGroupProps,
        isSelected,
        toggleAll,
        checkboxTable,
        selectAll,
        toggleSelection,
        rowFn,
        singular_name,
        campo_valor,
        moneda,
        son_facturas
    } = props;
    const valor = data.reduce((suma, elemento) => parseFloat(suma) + parseFloat(elemento[campo_valor]), 0);
    return (
        <div>
            <SelectTable
                ref={r => checkboxTable.current = r}
                getTrGroupProps={getTrGroupProps}
                selection={selection}
                selectType="checkbox"
                isSelected={isSelected}
                selectAll={selectAll}
                toggleSelection={toggleSelection}
                toggleAll={toggleAll}
                keyField="id"
                previousText='Anterior'
                nextText='Siguiente'
                pageText='Página'
                ofText='de'
                rowsText='filas'
                getTrProps={rowFn}
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Cliente",
                        accessor: "cliente_nombre",
                        filterable: true,
                        maxWidth: 300,
                        minWidth: 300,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                    },
                    {
                        Header: "Valor",
                        maxWidth: 150,
                        minWidth: 150,
                        Footer: <div className='text-right'>{formatoMoneda(valor, '$', moneda === 'COP' ? 0 : 2)}</div>,
                        Cell: row => <div
                            className='text-right'>{formatoMoneda(row.original[campo_valor], '$', moneda === 'COP' ? 0 : 2)}
                        </div>
                    },
                    {
                        Header: 'Factura',
                        maxWidth: 100,
                        minWidth: 100,
                        show: son_facturas,
                        Cell: row => <div>
                            <Link key={row.original.id}
                                  to={`/app/ventas_componentes/facturas/detail/${row.original.id}`} target={'_blank'}>
                                {row.original.tipo_documento}-{row.original.nro_documento}
                            </Link>
                        </div>
                    },
                    {
                        Header: son_facturas ? 'Facturas' : 'Cotización',
                        maxWidth: 100,
                        minWidth: 100,
                        Cell: row => <div>
                            {!son_facturas ?
                                <Link to={`/app/ventas_componentes/cotizaciones/detail/${row.original.id}`}
                                      target={'_blank'}>
                                    {row.original.nro_consecutivo}
                                </Link> :
                                <Fragment>
                                    {row.original.cotizaciones_componentes.map(n => <div>
                                        <Link key={n.id} to={`/app/ventas_componentes/cotizaciones/detail/${n.id}`}
                                              target={'_blank'}>
                                            {n.nro_consecutivo}
                                        </Link>
                                    </div>)}
                                </Fragment>
                            }
                        </div>
                    },
                ]}
                defaultPageSize={data.length}
                className="-striped -highlight tabla-maestra"
            />
        </div>
    )
};


const CRUD = crudHOC(null, Tabla);
const List = memo((props) => {
    const {campo_valor, list, plural_name, moneda, son_facturas} = props;
    const method_pool = {
        fetchObjectMethod: null,
        deleteObjectMethod: null,
        createObjectMethod: null,
        updateObjectMethod: null,
    };
    return (
        <CRUD
            son_facturas={son_facturas}
            moneda={moneda}
            permisos_object={{list: true, delete: false, change: false, add: false}}
            method_pool={method_pool}
            list={list}
            campo_valor={campo_valor}
            plural_name={plural_name}
            singular_name='Cotizacion'
        />
    )
});

const InformeTunelVentasTabla = memo(props => {
    const {cotizaciones_seleccionardas, is_open, son_facturas, moneda, cerrar, vendedor} = props;
    const columna_valor = son_facturas ? 'venta_bruta' : 'valor_total';
    return <InformationDisplayDialog
        onCerrar={cerrar}
        is_open={is_open}
        fullScreen={true}
        scroll='paper'
        cerrar_text='Cerrar'
        titulo_text={son_facturas ? `Facturas ${vendedor} ${moneda}` : `Cotizaciones ${vendedor} ${moneda}`}
    >
        <List
            son_facturas={son_facturas}
            moneda={moneda}
            list={cotizaciones_seleccionardas}
            campo_valor={columna_valor}
        />
    </InformationDisplayDialog>
});


export default InformeTunelVentasTabla;