import React, {useEffect, useState} from "react";
import PivotTableUI from 'react-pivottable/PivotTableUI';
import {useDispatch, useSelector} from "react-redux";
import {
    clearOrdenesComprasCotizacionesAcuerdosPagos,
    fetchOrdenesComprasCotizacionesAcuerdosPagosInformeGerencial
} from "../../01_actions/especificas/cotizaciones/ordenesCompraCotizacionAcuerdoPagoAction";
import {Pivot2} from "../webdatarocks.react";

const InformeAcuerdoPagoProyecto = props => {
    const acuerdos_pagos = useSelector(state => state.cotizaciones_ordenes_compras_acuerdos_pagos);
    const [consulto, setConsulto] = useState(true);
    const motivos_nuevo_nombre = {
        'Anticipo': '1. Anticipo',
        'Aprobación de Planos': '2. Aprobación de Planos',
        'Avance de Obra': '3. Avance de Obra',
        'Pruebas Fat': '4. Pruebas Fat',
        'Contra Entrega': '5. Contra Entrega',
        'Instalación': '6. Instalación',
        'Aceptación de Proyecto': '7. Aceptación de Proyecto',
    }
    const data = _.map(acuerdos_pagos, a => ({
        ...a,
        motivo: motivos_nuevo_nombre[a.motivo],
        por_cobrar: a.valor_proyectado - a.recaudo,
        proyectos: a.proyectos.map(p =>
            `${p.id_proyecto}-${p.nombre ? p.nombre : 'NOMBRE SIN DEFINIR'}`
        ).toString().replace(',', '\n')
    }))
    const [table_state, setTableState] = useState({
        rows: ["cliente_nombre"],
        cols: ['orden_compra_fecha', 'motivo'],
        vals: ["por_cobrar"],
        aggregatorName: "Sum"
    });
    const dispatch = useDispatch();
    useEffect(() => {
        setConsulto(false);
        dispatch(fetchOrdenesComprasCotizacionesAcuerdosPagosInformeGerencial({callback: () => setConsulto(true)}));
        return () => dispatch(clearOrdenesComprasCotizacionesAcuerdosPagos());
    }, [])
    return <div>
        {/*<Pivot2*/}
        {/*    consulto={consulto}*/}
        {/*    report={{*/}
        {/*        dataSource: {data},*/}
        {/*        options: {grid: {type: "classic", showTotals: "off"}},*/}
        {/*        formats: [*/}
        {/*            {*/}
        {/*                name: "",*/}
        {/*                thousandsSeparator: '.',*/}
        {/*                decimalSeparator: ',',*/}
        {/*                decimalPlaces: 0,*/}
        {/*                currencySymbol: "$"*/}
        {/*            }*/}
        {/*        ],*/}
        {/*        slice: {*/}
        {/*            rows: [*/}
        {/*                {*/}
        {/*                    "uniqueName": "orden_compra_nro",*/}
        {/*                    "sort": "asc"*/}
        {/*                },*/}
        {/*                {*/}
        {/*                    "uniqueName": "cliente_nombre",*/}
        {/*                    "sort": "asc"*/}
        {/*                },*/}
        {/*                {*/}
        {/*                    "uniqueName": "proyectos",*/}
        {/*                    "sort": "asc"*/}
        {/*                },*/}
        {/*            ],*/}
        {/*            columns: [*/}
        {/*                {*/}
        {/*                    "uniqueName": "motivo",*/}
        {/*                    "sort": "asc"*/}
        {/*                }*/}
        {/*            ],*/}
        {/*            measures: [*/}
        {/*                {*/}
        {/*                    "uniqueName": "valor_proyectado",*/}
        {/*                    "aggregation": "sum"*/}
        {/*                }*/}
        {/*            ],*/}
        {/*            drills: {*/}
        {/*                "drillAll": false*/}
        {/*            }*/}
        {/*        },*/}
        {/*    }}*/}
        {/*    toolbar={true}*/}
        {/*/>*/}
        <PivotTableUI
            onChange={s => {
                delete s.data
                setTableState(s)
            }}
            data={data}
            {...table_state}
        />
    </div>
}

export default InformeAcuerdoPagoProyecto;