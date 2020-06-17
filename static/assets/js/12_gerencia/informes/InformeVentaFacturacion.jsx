import React, {useEffect, Fragment, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../01_actions/01_index';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import Button from "@material-ui/core/Button";

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
        const tipo_documento = f.tipo_documento.toString().replace(' ', '');
        if (['FEY', 'FY'].includes(tipo_documento)) {
            linea = 'Proyectos'
        } else if (['FEV', 'FV'].includes(tipo_documento)) {
            linea = 'Componentes'
        }
        return ({
            origen: 'Facturación',
            linea,
            moneda: 'COP',
            tipo_documento: f.tipo_documento,
            nro_documento: `${f.tipo_documento}-${f.nro_documento}`,
            valor: f.venta_bruta,
            cliente: f.cliente_nombre,
            cliente_nit: f.cliente_nit,
            vendedor: f.vendedor_nombre ? `${f.vendedor_nombre} ${f.vendedor_apellido}` : 'Sin Asignar',
            month: new Date(f.fecha_documento).getUTCMonth() + 1,
            year: new Date(f.fecha_documento).getUTCFullYear(),
            day: new Date(f.fecha_documento).getUTCDate()
        })
    });
    let data_cotizaciones_proyectos = _.map(cotizaciones_proyectos, f => {
        const es_venta = f.estado === 'Cierre (Aprobado)';
        return ({
            origen: es_venta ? 'Ventas' : 'Cotizaciones',
            linea: 'Proyectos',
            moneda: 'COP',
            tipo_documento: f.unidad_negocio,
            nro_documento: `${f.unidad_negocio}-${f.nro_cotizacion}`,
            valor: es_venta ? f.valor_total_orden_compra_cotizaciones : f.valor_ofertado,
            estado: f.estado,
            cliente: f.cliente_nombre,
            cliente_nit: f.cliente_nit,
            vendedor: f.responsable_actual_nombre ? f.responsable_actual_nombre : 'Sin Asignar',
            month: es_venta ? new Date(f.orden_compra_fecha).getUTCMonth() + 1 : 'COTI.',
            year: es_venta ? new Date(f.orden_compra_fecha).getUTCFullYear() : 'COTI.',
            day: es_venta ? new Date(f.orden_compra_fecha).getUTCDate() : 'COTI.'
        })
    });
    let data_cotizaciones_componentes = _.map(cotizaciones_componentes, f => {
        const es_venta = f.estado === 'PRO';
        return ({
            origen: es_venta ? 'Ventas' : 'Cotizaciones',
            linea: 'Componentes',
            tipo_documento: 'CB',
            moneda: f.moneda,
            estado: f.estado,
            nro_documento: f.nro_consecutivo,
            valor: f.valor_total,
            cliente: f.cliente_nombre,
            cliente_nit: f.cliente_nit,
            vendedor: f.responsable_nombre ? f.responsable_nombre : 'Sin Asignar',
            month: es_venta ? new Date(f.orden_compra_fecha).getUTCMonth() + 1 : 'COTI.',
            year: es_venta ? new Date(f.orden_compra_fecha).getUTCFullYear() : 'COTI.',
            day: es_venta ? new Date(f.orden_compra_fecha).getUTCDate() : 'COTI.'
        })
    });
    data = [...data_facturacion, ...data_cotizaciones_proyectos, ...data_cotizaciones_componentes]
    const [table_state, setTableState] = useState({
        rows: ["vendedor"],
        cols: ['year', 'month'],
        vals: ["valor"],
        aggregatorName: "Sum"
    });
    const consultarInformacion = () => {
        dispatch(actions.fetchFacturasPorAnoMes(filtros, {callback: () => setConsulto(true)}));
        dispatch(actions.fetchCotizacionesPorAnoMes(filtros, {callback: () => setConsulto(true)}));
        dispatch(actions.fetchCotizacionesComponentesPorAnoMes(filtros, {callback: () => setConsulto(true)}));
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
            <PivotTableUI
                onChange={s => {
                    delete s.data
                    setTableState(s)
                }}
                data={data}
                {...table_state}
            />
        </Fragment>
    )
};
export default InformeVentaFacturacion;