import React, {Fragment, useEffect, memo, useState} from 'react';
import * as actions from "../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {pesosColombianos} from "../../../00_utilities/common";
import Typography from '@material-ui/core/Typography';
import {COTIZACIONES} from "../../../permisos";
import InformeTunelVentasTabla from './CuadroTuberiaVentasTabla';

import FormTuberiaVentas from './forms/TuveriaVentaForm'
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const InformeTunelVentas = memo(props => {
    const cotizaciones_permisos = useTengoPermisos(COTIZACIONES);
    const object_list = useSelector(state => state.cotizaciones);
    const [cotizaciones_seleccionardas, setCotizacionesSeleccionadas] = useState(null);
    const dispatch = useDispatch();
    const cargarDatos = (ano = null, mes = null) => {
        dispatch(actions.fetchCotizacionesTuberiaVentasResumen(ano, mes));
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCotizaciones());
        }
    }, []);
    if (!cotizaciones_permisos.informe_uno) {
        return (
            <div>No tiene permisos suficientes para ver este informe</div>
        )
    }

    const orden_estados = {
        'Cita/Generación Interés': {id: 1, nombre: 'Cita/Generación Interés'},
        'Configurando Propuesta': {id: 2, nombre: 'Configurando Propuesta'},
        'Cotización Enviada': {id: 3, nombre: 'Cotización Enviada'},
        'Evaluación Técnica y Económica': {id: 4, nombre: 'Evaluación Técnica y Económica'},
        'Aceptación de Terminos y Condiciones': {id: 5, nombre: 'Aceptación de Terminos y Condiciones'},
        'Cierre (Aprobado)': {id: 6, nombre: 'Cierre Trimestre (Aprobado)'},
        'Aplazado': {id: 7, nombre: 'Aplazado'},
    };
    const cotizaciones = _.map(object_list, e => {
        return {...e, orden: orden_estados[e.estado] ? orden_estados[e.estado].id : 0}
    });


    const cotizaciones_x_orden = _.groupBy(cotizaciones, 'orden');
    const valorTotal = (indice) => {
        const arreglo = cotizaciones_x_orden[indice];
        const total_valor = _.map(arreglo, e => e).reduce((suma, elemento) => {
            const valor = indice === 6 ? elemento.valor_orden_compra_trimestre : elemento.valor_ofertado;
            return parseFloat(suma) + (valor ? parseFloat(valor) : 0)
        }, 0);
        return {total: total_valor, cantidad: _.size(arreglo)}
    };

    const valores_1 = valorTotal(1);
    const valores_2 = valorTotal(2);
    const valores_3 = valorTotal(3);
    const valores_4 = valorTotal(4);
    const valores_5 = valorTotal(5);
    const valores_6 = valorTotal(6);

    const total_valor_mes_actual = () => {
        const arreglo = _.pickBy(cotizaciones, c => (c.valor_orden_compra_mes > 0) && (c.estado === 'Cierre (Aprobado)'));
        const total_valor = _.map(arreglo, e => e).reduce((suma, elemento) => {
            const valor = elemento.valor_orden_compra_mes;
            return parseFloat(suma) + (valor ? parseFloat(valor) : 0)
        }, 0);
        return {total: total_valor, cantidad: _.size(arreglo)}
    };
    const valores_mes = total_valor_mes_actual();


    const valores_totales = _.map(cotizaciones, e => e).reduce((suma, elemento) => {
        const valor = elemento.orden === 6 ? elemento.valor_orden_compra_trimestre : ([3, 4, 5].includes(elemento.orden) ? elemento.valor_ofertado : 0);
        return parseFloat(suma) + (valor ? parseFloat(valor) : 0)
    }, 0);

    const cantidades_totales = _.size(object_list);
    let cuenta_por_colores = [];
    _.mapKeys(_.countBy(cotizaciones, 'color_tuberia_ventas'), (v, k) => {
            cuenta_por_colores = [...cuenta_por_colores, {color: k, cantidad: v}]
        }
    );
    const responsables = _.uniq(_.map(object_list, e => e.responsable_actual_nombre));

    const filtro_cotizaciones = (estado, responsable, mes = false) => {
        let seleccionados = _.pickBy(object_list, c => c.estado === estado && c.responsable_actual_nombre === responsable);
        let campo_valor = 'valor_ofertado';
        if (estado === 'Cierre (Aprobado)') {
            if (mes) {
                campo_valor = 'valor_orden_compra_mes';
                seleccionados = _.pickBy(seleccionados, c => c.valor_orden_compra_mes > 0)
            } else {
                campo_valor = 'valor_orden_compra_trimestre'
            }
        }
        setCotizacionesSeleccionadas({
            lista: _.map(seleccionados),
            responsable,
            estado,
            campo_valor
        });
    };

    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                Informe de Tuberias de Ventas
            </Typography>
            <FormTuberiaVentas onSubmit={(v) => {
                cargarDatos(v.ano, v.mes)
            }}/>
            {cotizaciones_seleccionardas && <InformeTunelVentasTabla
                cotizaciones_seleccionardas={cotizaciones_seleccionardas}
                limpiarLista={() => setCotizacionesSeleccionadas(null)}
            />}
            <div className='p-4'>
                <div className='row'>
                    {
                        cuenta_por_colores.map(e =>
                            <div style={{backgroundColor: e.color}}
                                 className="col-3"
                                 key={e.color}>
                                {e.cantidad}
                            </div>
                        )
                    }
                </div>
            </div>
            <table style={{fontSize: '12px'}} className='table table-responsive table-striped'>
                <thead>
                <tr>
                    <th>Responsable</th>
                    <th>Aplazado</th>
                    {_.map(_.omit(orden_estados, ['Cierre (Aprobado)', 'Aplazado']), e => <th
                        key={e.id}>{e.nombre}</th>)}
                    <th>Cierre (Aprobado) Mes Actual</th>
                    <th>Total de la Tubería</th>
                    <th>Cierre Trimestre (Aprobado)</th>
                </tr>
                </thead>
                <tbody>
                {_.map(responsables, r => {
                    const cotizaciones_x_responsable = _.pickBy(cotizaciones, c => c.responsable_actual_nombre === r);
                    const totalValorOfertado = (index) => _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === index && e.valor_ofertado > 0)), t => parseFloat(t.valor_ofertado)).reduce((uno, dos) => uno + dos, 0);
                    //const totalValorOrdenCompra = (index) => _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === index && e.valor_orden_compra > 0)), t => parseFloat(t.valor_orden_compra)).reduce((uno, dos) => uno + dos, 0);
                    const totalValorOrdenCompraTrimestre = (index) => _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === index && e.valor_orden_compra_trimestre > 0)), t => parseFloat(t.valor_orden_compra_trimestre)).reduce((uno, dos) => uno + dos, 0);
                    const totalValorOrdenCompraMes = (index) => _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === index && e.valor_orden_compra_mes > 0)), t => parseFloat(t.valor_orden_compra_mes)).reduce((uno, dos) => uno + dos, 0);
                    const orden_tres = totalValorOfertado(3);
                    const orden_cuatro = totalValorOfertado(4);
                    const orden_cinco = totalValorOfertado(5);
                    const orden_seis = totalValorOrdenCompraTrimestre(6);
                    const orden_seis_mes = totalValorOrdenCompraMes(6);
                    const total_valor = orden_tres + orden_cuatro + orden_cinco + orden_seis;
                    return <tr key={r ? r : 'Sin Nombre'}>
                        <td className='text-center'>{r}</td>
                        <td className='text-center puntero'
                            onClick={() => filtro_cotizaciones('Aplazado', r)}>
                            <div>
                                {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 7))}
                            </div>
                        </td>
                        <td className='text-center puntero'
                            onClick={() => filtro_cotizaciones('Cita/Generación Interés', r)}>
                            <div>
                                {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 1))}
                            </div>
                        </td>
                        <td className='text-center puntero'
                            onClick={() => filtro_cotizaciones('Configurando Propuesta', r)}>
                            <div>
                                {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 2))}
                            </div>
                            <div>

                            </div>
                        </td>
                        <td className='text-center puntero'
                            onClick={() => filtro_cotizaciones('Cotización Enviada', r)}>
                            <div>
                                {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 3))}
                            </div>
                            <div>
                                {pesosColombianos(orden_tres)}
                            </div>
                        </td>
                        <td className='text-center puntero'
                            onClick={() => filtro_cotizaciones('Evaluación Técnica y Económica', r)}>
                            <div>
                                {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 4))}
                            </div>
                            <div>
                                {pesosColombianos(orden_cuatro)}
                            </div>
                        </td>
                        <td className='text-center puntero'
                            onClick={() => filtro_cotizaciones('Aceptación de Terminos y Condiciones', r)}>
                            <div>
                                {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 5))}
                            </div>
                            <div>
                                {pesosColombianos(orden_cinco)}
                            </div>
                        </td>
                        <td className='text-center puntero'
                            onClick={() => filtro_cotizaciones('Cierre (Aprobado)', r, true)}
                            style={{backgroundColor: 'gray', color: 'white', fontWeight: 'bold'}}>
                            <div>
                                {_.size(_.pickBy(cotizaciones_x_responsable, e => e.valor_orden_compra_mes > 0))}
                            </div>
                            <div>
                                {pesosColombianos(orden_seis_mes)}
                            </div>
                        </td>
                        <td className='text-center' style={{fontWeight: 'bold'}}>
                            <div>
                                {_.size(cotizaciones_x_responsable) - _.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 6))}
                            </div>
                            <div>
                                {pesosColombianos(total_valor - orden_seis)}
                            </div>
                        </td>
                        <td className='text-center puntero' onClick={() => filtro_cotizaciones('Cierre (Aprobado)', r)}>
                            <div>
                                {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 6))}
                            </div>
                            <div>
                                {pesosColombianos(orden_seis)}
                            </div>
                        </td>
                    </tr>
                })}
                </tbody>
                <tfoot>
                <tr style={{fontWeight: 'bold'}}>
                    <td className='text-right'>
                        <div>
                            Cantidad: <br/>
                            Valor:
                        </div>
                    </td>
                    <td className='text-center'>
                        <div>

                        </div>
                    </td>
                    <td className='text-center'>
                        <div>
                            {valores_1.cantidad}<br/>
                        </div>
                    </td>
                    <td className='text-center'>
                        <div>
                            {valores_2.cantidad}<br/>
                        </div>
                    </td>
                    <td className='text-center'>
                        <div>
                            {valores_3.cantidad}<br/>
                            {pesosColombianos(valores_3.total)}
                        </div>
                    </td>
                    <td className='text-center'>
                        <div>
                            {valores_4.cantidad}<br/>
                            {pesosColombianos(valores_4.total)}
                        </div>
                    </td>
                    <td className='text-center'>
                        <div>
                            {valores_5.cantidad}<br/>
                            {pesosColombianos(valores_5.total)}
                        </div>
                    </td>
                    <td className='text-center'
                        style={{backgroundColor: 'gray', color: 'white', fontWeight: 'bold'}}>
                        <div>
                            {valores_mes.cantidad}<br/>
                            {pesosColombianos(valores_mes.total)}
                        </div>
                    </td>
                    <td className='text-center'>
                        <div>
                            {cantidades_totales - valores_6.cantidad}<br/>
                            {pesosColombianos(valores_totales - valores_6.total)}
                        </div>
                    </td>
                    <td className='text-center'>
                        <div>
                            {valores_6.cantidad}<br/>
                            {pesosColombianos(valores_6.total)}
                        </div>
                    </td>
                </tr>
                </tfoot>
            </table>
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});


export default InformeTunelVentas;