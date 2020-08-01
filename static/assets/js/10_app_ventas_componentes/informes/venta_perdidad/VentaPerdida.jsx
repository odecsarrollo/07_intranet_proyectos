import Button from "@material-ui/core/Button";
import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Pivot2} from '../../../00_utilities/webdatarocks.react';
import * as actions from '../../../01_actions/01_index';

const InformeVentaPerdida = (props) => {
    const dispatch = useDispatch();
    const items_venta_perdida = useSelector(state => state.cotizaciones_componentes_items);
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
    const consultarInformacion = () => {
        setConsulto(false);
        dispatch(actions.fetchItemsCotizacionesComponentesVentasPerdidasPorAnoMes(filtros, {callback: () => setConsulto(true)}));
    };
    useEffect(() => {
        consultarInformacion();
    }, []);
    const data = _.map(items_venta_perdida, item => ({
        Referencia: item.referencia,
        "Descripción": item.descripcion,
        "Estado Cotización": item.cotizacion_estado,
        'Cantidad Perdida': item.cantidad_venta_perdida,
        Motivo: item.razon_venta_perdida,
        'Nro. Cotización': item.cotizacion_nro_consecutivo,
        Canal: item.canal_nombre,
        Mes: new Date(item.modified).getUTCMonth() + 1,
        "Año": new Date(item.modified).getUTCFullYear(),
        "Día": new Date(item.modified).getUTCDate(),
        'Precio Unitario': item.precio_unitario,
        'Moneda': item.cotizacion_moneda,
        Valor: item.cantidad_venta_perdida * item.precio_unitario
    }));
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
                    options: {grid: {type: "classic", showTotals: "off", showGrandTotals: "off"}},
                    formats: [
                        {
                            name: "",
                            thousandsSeparator: '.',
                            decimalSeparator: ',',
                            decimalPlaces: 0,
                            currencySymbol: "$"
                        },
                        {
                            name: "CantidadPerdida",
                            currencySymbol: "",
                            currencySymbolAlign: "left",
                            decimalPlaces: 0,
                            decimalSeparator: ",",
                            isPercent: false,
                            nullValue: "",
                            textAlign: "right",
                            thousandsSeparator: "."
                        }
                    ],
                    slice: {
                        rows: [
                            {
                                "uniqueName": "Moneda",
                                "sort": "asc"
                            },
                            {
                                "uniqueName": "Motivo",
                                "sort": "asc"
                            },
                            {
                                "uniqueName": "Día",
                                "sort": "asc"
                            },
                            {
                                "uniqueName": "Descripción",
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
                                "uniqueName": "Cantidad Perdida",
                                "aggregation": "sum",
                                "format": "CantidadPerdida"
                            },
                            {
                                "uniqueName": "Valor",
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
        </Fragment>
    )
};
export default InformeVentaPerdida;