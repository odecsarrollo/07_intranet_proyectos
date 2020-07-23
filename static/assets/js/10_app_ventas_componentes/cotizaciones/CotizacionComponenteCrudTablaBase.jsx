import {makeStyles} from "@material-ui/core";
import React, {Fragment, memo, useState} from "react";
import {useDispatch} from "react-redux";

import {Link} from "react-router-dom";
import Table from "react-table";

import selectTableHOC from "react-table/lib/hoc/selectTable";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import {fechaToYMD, formatoMoneda} from "../../00_utilities/common";
import MyDialogButtonDelete from '../../00_utilities/components/ui/dialog/delete_dialog';
import SiNoDialog from "../../00_utilities/components/ui/dialog/SiNoDialog";
import IconButtonTableSee from "../../00_utilities/components/ui/icon/table_icon_button_detail";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import * as actions from '../../01_actions/01_index';
import {CLIENTES} from "../../permisos";

const useStyles = makeStyles(theme => ({
    texto_largo: {
        fontSize: '0.7rem',
        whiteSpace: 'normal'
    },
}));

const FechaProximoSeguimiento = props => {
    const {
        cotizacion,
        setCotizacionSeleccionada
    } = props;
    const dispatch = useDispatch();
    const [fecha_proximo_seguimiento_descripcion, setFechaProximoSeguimientoDescripcion] = useState('');
    const [fecha_proximo_seguimiento, setFechaProximoSeguimiento] = useState(null);
    return <SiNoDialog
        can_on_si={fecha_proximo_seguimiento !== null && fecha_proximo_seguimiento_descripcion.replace(/^\s+|\s+$/g, "") !== ''}
        onSi={() => {
            dispatch(
                actions.cambiarFechaProximoSeguimientoCotizacionComponente(
                    cotizacion.id,
                    fecha_proximo_seguimiento_descripcion,
                    fechaToYMD(fecha_proximo_seguimiento),
                    {
                        callback: () => {
                            setCotizacionSeleccionada(null)
                        }
                    }
                ))
        }}
        onNo={() => {
            setCotizacionSeleccionada(null);
        }}
        is_open={true}
        titulo='Cambiar fecha próximo seguimiento'
    >
        Deséa cambiar la fecha de próximo seguimiento
        a <strong>{cotizacion.nro_consecutivo}</strong>?
        <div>
            <label><strong>Fecha próximo Seguimiento</strong></label>
            <DateTimePicker
                onChange={(v) => setFechaProximoSeguimiento(v)}
                format={"YYYY-MM-DD"}
                time={false}
                max={new Date(3000, 1, 1)}
                min={new Date()}
                value={fecha_proximo_seguimiento}
            />
        </div>
        <div>
            <label><strong>Motivo</strong></label>
            <textarea
                onChange={(event) => setFechaProximoSeguimientoDescripcion(event.target.value)}
                value={fecha_proximo_seguimiento_descripcion}
                rows={10}
                style={{width: '100%'}}
            />
        </div>
        <div style={{height: '100px'}}/>
    </SiNoDialog>
}

const SelectTable = selectTableHOC(Table);

const Tabla = memo(props => {
    const data = _.map(_.pickBy(_.orderBy(props.list, ['nro_consecutivo'], ['desc']), e => e.estado !== 'INI'));
    const {
        singular_name,
        onDelete = null,
        permisos_object,
        nro_filas = 100,
        selection,
        getTrGroupProps,
        isSelected,
        toggleAll,
        checkboxTable,
        selectAll,
        toggleSelection,
        rowFn,
    } = props;
    const classes = useStyles();
    const permisos_cliente = useTengoPermisos(CLIENTES);
    const [cotizacion_seleccionada, setCotizacionSeleccionada] = useState(null);
    const columns = [
        {
            Header: "Caracteristicas",
            columns: [
                {
                    Header: "Id",
                    accessor: "id",
                    maxWidth: 40
                },
                {
                    Header: "#",
                    accessor: "nro_consecutivo",
                    maxWidth: 70,
                    filterable: true
                },
                {
                    Header: "Cliente",
                    accessor: "cliente_nombre",
                    maxWidth: 250,
                    minWidth: 250,
                    filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                    filterable: true,
                    Cell: row => <div className={classes.texto_largo}>
                        {permisos_cliente.detail ?
                            <Link to={`/app/ventas_componentes/clientes/detail/${row.original.cliente}`}
                                  target='_blank'>
                                {row.value}
                            </Link> : row.value}
                    </div>
                },
                {
                    Header: "Estado",
                    accessor: "estado_display",
                    maxWidth: 80,
                    minWidth: 80
                },
                {
                    Header: "Ciudad",
                    accessor: "ciudad_nombre",
                    maxWidth: 250,
                    minWidth: 250,
                    filterable: true,
                    filterMethod: (filter, row) => `${row._original.pais_nombre}-${row._original.departamento_nombre}-${row._original.ciudad_nombre}`.includes(filter.value.toUpperCase()),
                    Cell: row => `${row.original.pais_nombre}-${row.original.departamento_nombre}-${row.original.ciudad_nombre}`
                },
                {
                    Header: "Contacto",
                    maxWidth: 200,
                    minWidth: 200,
                    filterable: true,
                    accessor: "contacto",
                    filterMethod: (filter, row) => `${row._original.contacto_nombres} ${row._original.contacto_apellidos}`.includes(filter.value.toUpperCase()),
                    Cell: row => `${row.original.contacto_nombres} ${row.original.contacto_apellidos}`
                },
                {
                    Header: "Responsable",
                    accessor: "responsable_username",
                    maxWidth: 80,
                    minWidth: 80,
                    filterable: true,
                    filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                },
                {
                    Header: "Estado",
                    accessor: "estado_display",
                    maxWidth: 100,
                    filterable: true,
                    filterMethod: (filter, row) => {
                        return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    Cell: row => {
                        const estado = row.original.estado;
                        const puede_cambiar_estado = ['PRO', 'ENV', 'REC', 'APL'].includes(estado);
                        return (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '2px',
                                }}
                                className={puede_cambiar_estado ? 'puntero' : ''}
                                onClick={puede_cambiar_estado ? () => setCotizacionSeleccionada(row.original.id) : null}
                            >
                                <div
                                    style={{
                                        width: `${row.original.porcentaje_seguimineto > 100 ? 100 : row.original.porcentaje_seguimineto}%`,
                                        height: '100%',
                                        padding: '2px',
                                        backgroundColor: row.original && row.original.color_seguimiento,
                                        borderRadius: '2px',
                                        transition: 'all .2s ease-out'
                                    }}
                                >
                                    {row.value}
                                    {
                                        row.original.porcentaje_seguimineto > 0 &&
                                        <div className='text-right'>
                                            {row.original.porcentaje_seguimineto}%
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    }
                },
                {
                    Header: "Creado Por",
                    accessor: "creado_por_username",
                    maxWidth: 80,
                    minWidth: 80,
                    filterable: true,
                    filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                },
                {
                    Header: "Moneda",
                    accessor: "moneda",
                    maxWidth: 80,
                    minWidth: 80,
                    filterable: true,
                    filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                },
                {
                    Header: "Valor Total",
                    accessor: "valor_total",
                    maxWidth: 80,
                    minWidth: 80,
                    Cell: row => <div
                        className='text-right'>{formatoMoneda(row.value, '$', row.original.moneda === 'COP' ? 0 : 2)}</div>
                },
            ]
        },
        {
            Header: "Opciones",
            columns: [
                {
                    Header: "Elimi.",
                    show: onDelete && permisos_object.delete,
                    maxWidth: 45,
                    Cell: row =>
                        !row.original.es_cguno &&
                        onDelete &&
                        <MyDialogButtonDelete
                            onDelete={() => {
                                onDelete(row.original)
                            }}
                            element_name={`${row.original.to_string}`}
                            element_type={singular_name}
                        />

                },
                {
                    Header: "Ver",
                    show: permisos_object.detail,
                    maxWidth: 60,
                    Cell: row =>
                        <Link to={`/app/ventas_componentes/cotizaciones/detail/${row.original.id}`}>
                            <IconButtonTableSee/>
                        </Link>

                }
            ]
        }
    ]
    return <Fragment>
        {cotizacion_seleccionada && <FechaProximoSeguimiento
            setCotizacionSeleccionada={setCotizacionSeleccionada}
            cotizacion_seleccionada={cotizacion_seleccionada}
            cotizacion={props.list[cotizacion_seleccionada]}
        />}
        {checkboxTable && <SelectTable
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
            noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
            data={data}
            columns={columns}
            defaultPageSize={nro_filas}
            className="-striped -highlight tabla-maestra"
        />}
        {!checkboxTable && <Table
            data={data}
            columns={columns}
            defaultPageSize={nro_filas}
            className="-striped -highlight tabla-maestra"
        />}
    </Fragment>
});

export default Tabla;