import React, {useEffect, Fragment, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../01_actions/01_index';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import Button from "@material-ui/core/Button";
import {Pivot2} from '../webdatarocks.react';

const InformeVentaFacturacion = (props) => {
    const dispatch = useDispatch();
    const facturas = useSelector(state => state.facturas);
    const cotizaciones_proyectos = useSelector(state => state.cotizaciones);
    const cotizaciones_componentes = useSelector(state => state.cotizaciones_componentes);
    const date = new Date()
    const [consulto, setConsulto] = useState(true);
    const [filtros, setFiltros] = useState({
        years: [date.getFullYear()],
        months: [date.getMonth() + 1]
    })
    const [years_filtro, setYearsFiltro] = useState([])
    useEffect(() => {
        let new_year = 2017
        let years = [];
        while (new_year <= date.getFullYear()) {
            years = [...years, new_year];
            new_year += 1;
        }
        setYearsFiltro(years);
    }, [])


    let data = [];
    let data_facturacion = _.map(facturas, f => {
        let linea = 'Notas';
        let tipo_documento = f.tipo_documento.toString().replace(' ', '');
        if (['FEY', 'FY', 'NY'].includes(tipo_documento)) {
            linea = 'Proyectos'
        } else if (['FEV', 'FV', 'NV'].includes(tipo_documento)) {
            linea = 'Componentes'
        }
        return ({
            Linea: linea,
            Moneda: 'COP',
            "Tipo Documento": f.tipo_documento,
            "Nro Documento": `${f.tipo_documento}-${f.nro_documento}`,
            "Facturación": f.valor_total_items,
            Cotizaciones: 0,
            Ventas: 0,
            Estado: 'Facturado',
            Cliente: f.cliente_nombre,
            "Cliente Nit": f.cliente_nit,
            Vendedor: f.vendedor_nombre ? `${f.vendedor_nombre} ${f.vendedor_apellido}` : 'Sin Asignar',
            Mes: new Date(f.fecha_documento).getUTCMonth() + 1,
            "Año": new Date(f.fecha_documento).getUTCFullYear(),
            "Día": new Date(f.fecha_documento).getUTCDate()
        })
    });
    let data_cotizaciones_proyectos = _.map(cotizaciones_proyectos, f => {
        const es_venta = f.estado === 'Cierre (Aprobado)';
        return ({
            Linea: 'Proyectos',
            Moneda: 'COP',
            "Tipo Documento": f.unidad_negocio,
            "Nro Documento": `${f.unidad_negocio}-${f.nro_cotizacion}`,
            "Facturación": 0,
            Cotizaciones: 0,
            Ventas: es_venta ? f.valor_orden_compra : f.valor_ofertado,
            Estado: f.estado,
            Cliente: f.cliente_nombre,
            "Cliente Nit": f.cliente_nit,
            Vendedor: f.responsable_actual_nombre ? f.responsable_actual_nombre : 'Sin Asignar',
            Mes: es_venta ? new Date(f.orden_compra_fecha).getUTCMonth() + 1 : 'Cotización',
            "Año": es_venta ? new Date(f.orden_compra_fecha).getUTCFullYear() : 'Cotización',
            "Día": es_venta ? new Date(f.orden_compra_fecha).getUTCDate() : 'Cotización'
        })
    });
    let data_cotizaciones_componentes = _.map(cotizaciones_componentes, f => {
        const es_venta = f.estado === 'PRO' || f.estado === 'FIN';
        return ({
            Linea: 'Componentes',
            "Tipo Documento": 'CB',
            Moneda: f.moneda,
            Estado: f.estado_display,
            "Nro Documento": f.nro_consecutivo,
            "Facturación": 0,
            Ventas: 0,
            Cotizaciones: es_venta ? f.orden_compra_valor : f.valor_total,
            Cliente: f.cliente_nombre,
            "Cliente Nit": f.cliente_nit,
            Vendedor: f.responsable_nombre ? f.responsable_nombre : 'Sin Asignar',
            Mes: es_venta ? new Date(f.orden_compra_fecha).getUTCMonth() + 1 : 'Cotización',
            "Año": es_venta ? new Date(f.orden_compra_fecha).getUTCFullYear() : 'Cotización',
            "Día": es_venta ? new Date(f.orden_compra_fecha).getUTCDate() : 'Cotización'
        })
    });
    data = [...data_facturacion, ...data_cotizaciones_proyectos, ...data_cotizaciones_componentes]
    const [table_state, setTableState] = useState({
        rows: ["vendedor"],
        cols: ['year', 'month', 'tipo'],
        vals: ["valor"],
        aggregatorName: "Sum"
    });
    const consultarInformacion = () => {
        setConsulto(false);
        const cargarCotizaciones = () => dispatch(actions.fetchCotizacionesPorAnoMes(filtros, {callback: () => setConsulto(true)}));
        const cargarComponentes = () => dispatch(actions.fetchCotizacionesComponentesPorAnoMes(filtros, {callback: cargarCotizaciones}));
        dispatch(actions.fetchFacturasPorAnoMes(filtros, {callback: cargarComponentes}));
    };
    useEffect(() => {
        consultarInformacion();
    }, [])
    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-4 col-lg-2">
                    <select
                        style={{width: '100%'}}
                        multiple={true}
                        value={filtros.years}
                        onChange={val => {
                            setFiltros({
                                ...filtros,
                                years: Array.from(val.target.selectedOptions, i => parseInt(i.value))
                            });
                            setConsulto(false)
                        }}
                    >
                        {years_filtro.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className="col-12 col-md-4 col-lg-2">
                    <select
                        style={{width: '100%'}}
                        multiple={true}
                        value={filtros.months}
                        onChange={val => {
                            setFiltros({
                                ...filtros,
                                months: Array.from(val.target.selectedOptions, i => parseInt(i.value))
                            });
                            setConsulto(false)
                        }}
                    >
                        <option value={1}>Enero</option>
                        <option value={2}>Febrero</option>
                        <option value={3}>Marzo</option>
                        <option value={4}>Abril</option>
                        <option value={5}>Mayo</option>
                        <option value={6}>Junio</option>
                        <option value={7}>Julio</option>
                        <option value={8}>Agosto</option>
                        <option value={9}>Septiembre</option>
                        <option value={10}>Octubre</option>
                        <option value={11}>Noviembre</option>
                        <option value={12}>Diciembre</option>
                    </select>
                </div>
            </div>
            {!consulto && <Button
                onClick={consultarInformacion}
                color="primary"
                variant="contained"
            >
                Consultar
            </Button>}
            <Pivot2
                consulto={consulto}
                report={{
                    dataSource: {data},
                    conditions: [{
                        format: {
                            backgroundColor: "#FFFFFF",
                            color: "#F44336",
                            fontFamily: "Arial",
                            fontSize: "12px"
                        }, formula: "#value < 0"
                    }],
                    options: {grid: {type: "classic", showTotals: "off"}},
                    formats: [
                        {
                            name: "",
                            thousandsSeparator: '.',
                            decimalSeparator: ',',
                            decimalPlaces: 0,
                            currencySymbol: "$"
                        }
                    ],
                    slice: {
                        rows: [
                            {
                                "uniqueName": "Linea",
                                "sort": "asc"
                            },
                        ],
                        columns: [
                            {
                                "uniqueName": "Año",
                                "sort": "asc"
                            },
                            {
                                "uniqueName": "Mes",
                                "sort": "asc"
                            }
                        ],
                        measures: [
                            {
                                "uniqueName": "Facturación",
                                "aggregation": "sum"
                            }
                        ],
                        drills: {
                            "drillAll": false
                        }
                    },
                }}
                toolbar={true}
            />
            {/*<PivotTableUI*/}
            {/*    onChange={s => {*/}
            {/*        delete s.data*/}
            {/*        setTableState(s)*/}
            {/*    }}*/}
            {/*    data={data}*/}
            {/*    {...table_state}*/}
            {/*/>*/}
        </Fragment>
    )
};
export default InformeVentaFacturacion;