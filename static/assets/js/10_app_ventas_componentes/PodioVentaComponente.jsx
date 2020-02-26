import React, {useEffect, useState, Fragment} from 'react';
import * as actions from '../01_actions/01_index';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {pesosColombianos} from "../00_utilities/common";
import InformationDisplayDialog from "../00_utilities/components/ui/dialog/InformationDisplayDialog";
import FacturaCRUDTabla from "../11_app_sistemas_informacion/facturacion/FacturaCRUDTabla";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useTengoPermisos from "../00_utilities/hooks/useTengoPermisos";
import {FACTURAS} from "../permisos";
import IconButton from "@material-ui/core/IconButton";

const PodioVentaComponente = (props) => {
    const dispatch = useDispatch();
    const [ver_sin_definir, setVerSinDefinir] = useState(false);
    const [mostrar_facturacion, setMostrarFacturacion] = useState(false);
    const [facturacion_a_mostrar, setFacturacionAMostrar] = useState(null);
    const [vendedor_seleccionado_filtro, setVendedorSeleccionadoFiltro] = useState(null);
    let facturacion = useSelector(state => state.facturas);
    const permisos_facturas = useTengoPermisos(FACTURAS);
    if (!ver_sin_definir) {
        facturacion = _.pickBy(facturacion, e => e.colaborador);
    }
    let vendedores = _.mapKeys(_.map(facturacion, f => ({
        id: `${f.colaborador ? f.colaborador : -1}`,
        nombre: `${f.colaborador ? f.vendedor_nombre : 'SIN DEFINIR'}`,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    })), 'id');


    facturacion = _.map(_.orderBy(facturacion, ['fecha_documento'], ['asc']), f => {
        const ano = new Date(f.fecha_documento).getFullYear();
        const mes = new Date(f.fecha_documento).getMonth() + 1;
        const lapso = `${ano}-${mes}`;
        const fecha_lapso = new Date(`${ano}/${mes}/01`);
        return {...f, ano, mes, lapso, fecha_lapso}
    });

    facturacion = _.groupBy(facturacion, 'fecha_lapso');
    let facturacion_por_fecha_lapso = {};
    _.mapKeys(facturacion, (v, k) => {
        const ano = new Date(k).getFullYear();
        const mes = new Date(k).getMonth() + 1;
        facturacion_por_fecha_lapso = {
            ...facturacion_por_fecha_lapso,
            [k]: {lapso: `${ano}/${mes}`, facturas_lapso: v, fecha_lapso: k}
        }
    });
    let orden = 0;
    facturacion_por_fecha_lapso = _.map(facturacion_por_fecha_lapso, e => {
        orden += 1;
        return {...e, orden}
    });
    facturacion_por_fecha_lapso = _.map(facturacion_por_fecha_lapso, f => {
        let facturacion_por_colaborador = {};
        _.mapKeys(_.groupBy(f.facturas_lapso.map(e => ({
            ...e,
            colaborador: [e.colaborador ? e.colaborador : -1]
        })), 'colaborador'), (v, k) => {
            const venta_bruta_total_colaborador = v.reduce((uno, dos) => uno + (parseFloat(dos.venta_bruta)), 0);
            facturacion_por_colaborador = {
                ...facturacion_por_colaborador,
                [k]: {
                    id: parseInt(k),
                    facturas_colaborador: v,
                    venta_bruta_total_colaborador,
                    vendedor: vendedores[k].nombre,

                }
            };
        });
        return {...f, facturas_lapso: facturacion_por_colaborador}
    });

    let data_nueva = [];
    _.map(facturacion_por_fecha_lapso, f => {
        let linea = {name: f.lapso, facturas_colaborador: {}};
        _.map(f.facturas_lapso, e => {
            linea = {
                ...linea,
                [e.id ? e.id : -1]: parseFloat((e.venta_bruta_total_colaborador / 1000000).toFixed(2)),
                facturas_colaborador: {...linea.facturas_colaborador, [e.id ? e.id : -1]: e.facturas_colaborador}
            }
        });
        data_nueva = [...data_nueva, linea];
    });
    const onClickBarras = (facturacion) => {
        if (permisos_facturas.list) {
            setMostrarFacturacion(true);
            setFacturacionAMostrar(facturacion);
            setVendedorSeleccionadoFiltro(null);
        }
    };

    useEffect(() => {
        dispatch(actions.fetchFacturasComponentesTrimestre());
    }, []);
    return <div className='row'>
        {mostrar_facturacion && <InformationDisplayDialog
            fullScreen={true}
            is_open={mostrar_facturacion}
            context_text={`Facturación correspondiente al lapso ${facturacion_a_mostrar.name}`}
            cerrar_text='Cerrar'
            titulo_text={`Facturación Periodo ${facturacion_a_mostrar.name}`}
            onCerrar={() => {
                setMostrarFacturacion(false);
                setFacturacionAMostrar(null);
            }}
        >
            <div>Seleccionar Vendedor...</div>
            {_.map(vendedores, ven => {
                const facturacion_colaborador = facturacion_a_mostrar.facturas_colaborador[ven.id];
                if (facturacion_colaborador && facturacion_colaborador.length > 0) {
                    return <div
                        className='puntero'
                        key={ven.id}
                        onClick={() => setVendedorSeleccionadoFiltro(ven.id)}>
                        {ven.nombre} {vendedor_seleccionado_filtro && vendedor_seleccionado_filtro === ven.id &&
                    <FontAwesomeIcon icon={'check'} size='xs'/>}
                    </div>
                }
            })}
            {vendedor_seleccionado_filtro &&
            <FacturaCRUDTabla
                list={facturacion_a_mostrar.facturas_colaborador[vendedor_seleccionado_filtro]}
                permisos_object={permisos_facturas}
            />}
        </InformationDisplayDialog>}
        <div className="col-12">
            <BarChart
                barCategoryGap='20%'
                barGap={0}
                width={500}
                height={200}
                data={data_nueva}
                margin={{
                    top: 30, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid vertical={false}/>
                <XAxis
                    dataKey="name"
                    label={{value: 'Vendedores', position: 'insideBottomRight', offset: 0}}
                />
                <YAxis
                    label={{value: 'Ventas', position: 'insideTop', offset: -25}}
                    unit=' mill.'
                    tickFormatter={e => pesosColombianos(e)}
                />
                <Tooltip/>
                <Legend/>
                {_.map(vendedores, v => {
                        return <Bar
                            onClick={e => onClickBarras(e)}
                            background={true}
                            key={v.id}
                            dataKey={v.id}
                            name={v.nombre}
                            legendType='circle'
                            unit=' Millones'
                            fill={v.color}
                        />
                    }
                )}
            </BarChart>
        </div>
        <div className='col-12 text-center'>
            <FontAwesomeIcon
                className='puntero'
                onClick={() => setVerSinDefinir(!ver_sin_definir)}
                icon={ver_sin_definir ? `eye-slash` : 'eye'}
                size='2x'
            /> {ver_sin_definir ? `Ocultar` : 'Ver'} sin Definir
        </div>
    </div>
};

export default PodioVentaComponente;