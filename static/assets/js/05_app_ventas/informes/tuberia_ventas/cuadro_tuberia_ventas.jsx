import React, {Component, Fragment} from 'react';
import * as actions from "../../../01_actions/01_index";
import {connect} from "react-redux";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {permisosAdapter, pesosColombianos} from "../../../00_utilities/common";
import {
    COTIZACIONES as permisos_view
} from "../../../00_utilities/permisos/types";

import FormTuberiaVentas from './forms/tuberia_ventas_form'

class InformeTunelVentas extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearCotizaciones();
    }

    cargarDatos(ano = null, trimestre = null) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarCotizaciones = () => this.props.fetchCotizacionesTuberiaVentasResumen(ano, trimestre, () => noCargando(), notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarCotizaciones, notificarErrorAjaxAction)

    }

    render() {
        const {mis_permisos} = this.props;
        const cotizaciones_permisos = permisosAdapter(mis_permisos, permisos_view);
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
            'Cierre (Aprobado)': {id: 6, nombre: 'Cierre (Aprobado)'},
        };
        const cotizaciones = _.map(this.props.object_list, e => {
            return {...e, orden: orden_estados[e.estado] ? orden_estados[e.estado].id : 0}
        });


        const cotizaciones_x_orden = _.groupBy(cotizaciones, 'orden');
        const valorTotal = (indice) => {
            const total_valor = _.map(indice, e => e).reduce((suma, elemento) => {
                const valor = indice === 6 ? elemento.valor_orden_compra : elemento.valor_ofertado;
                return parseFloat(suma) + (valor ? parseFloat(valor) : 0)
            }, 0);
            return {total: total_valor, cantidad: _.size(indice)}
        };

        const valores_1 = valorTotal(cotizaciones_x_orden[1]);
        const valores_2 = valorTotal(cotizaciones_x_orden[2]);
        const valores_3 = valorTotal(cotizaciones_x_orden[3]);
        const valores_4 = valorTotal(cotizaciones_x_orden[4]);
        const valores_5 = valorTotal(cotizaciones_x_orden[5]);
        const valores_6 = valorTotal(cotizaciones_x_orden[6]);

        const total_valor_mes_actual = () => {
            const arreglo = _.pickBy(cotizaciones, c => c.valor_orden_compra_mes > 0);
            const total_valor = _.map(arreglo, e => e).reduce((suma, elemento) => {
                const valor = elemento.valor_orden_compra_mes;
                return parseFloat(suma) + (valor ? parseFloat(valor) : 0)
            }, 0);
            return {total: total_valor, cantidad: _.size(arreglo)}
        };
        const valores_mes = total_valor_mes_actual();


        const valores_totales = _.map(this.props.object_list, e => e).reduce((suma, elemento) => {
            const valor = elemento.orden === 6 ? elemento.valor_orden_compra : elemento.valor_ofertado;
            return parseFloat(suma) + (valor ? parseFloat(valor) : 0)
        }, 0);

        const cantidades_totales = _.size(this.props.object_list);
        let cuenta_por_colores = [];
        _.mapKeys(_.countBy(cotizaciones, 'color_tuberia_ventas'), (v, k) => {
                cuenta_por_colores = [...cuenta_por_colores, {color: k, cantidad: v}]
            }
        );
        const responsables = _.uniq(_.map(this.props.object_list, e => e.responsable_actual_nombre));

        return (
            <Fragment>
                <div>Informe de Tuberias de Ventas</div>
                <FormTuberiaVentas onSubmit={(v) => {
                    this.cargarDatos(v.ano, v.trimestre)
                }}/>
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
                        {_.map(orden_estados, e => <th key={e.id}>{e.nombre}</th>)}
                        <th>Total</th>
                        <th>Cierre (Aprobado) Mes Actual</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(responsables, r => {
                        const cotizaciones_x_responsable = _.pickBy(cotizaciones, c => c.responsable_actual_nombre === r);
                        const orden_tres = _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === 3 && e.valor_ofertado > 0)), t => parseFloat(t.valor_ofertado)).reduce((uno, dos) => uno + dos, 0);
                        const orden_cuatro = _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === 4 && e.valor_ofertado > 0)), t => parseFloat(t.valor_ofertado)).reduce((uno, dos) => uno + dos, 0);
                        const orden_cinco = _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === 5 && e.valor_ofertado > 0)), t => parseFloat(t.valor_ofertado)).reduce((uno, dos) => uno + dos, 0);
                        const orden_seis = _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === 6 && e.valor_orden_compra > 0)), t => parseFloat(t.valor_orden_compra)).reduce((uno, dos) => uno + dos, 0);
                        const orden_seis_mes = _.map(_.pickBy(cotizaciones_x_responsable, e => (e.orden === 6 && e.valor_orden_compra_mes > 0)), t => parseFloat(t.valor_orden_compra_mes)).reduce((uno, dos) => uno + dos, 0);
                        const total_valor = orden_tres + orden_cuatro + orden_cinco + orden_seis;
                        return <tr key={r ? r : 'Sin Nombre'}>
                            <td className='text-center'>{r}</td>
                            <td className='text-center'>
                                <div>
                                    {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 1))}
                                </div>
                            </td>
                            <td className='text-center'>
                                <div>
                                    {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 2))}
                                </div>
                                <div>

                                </div>
                            </td>
                            <td className='text-center'>
                                <div>
                                    {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 3))}
                                </div>
                                <div>
                                    {pesosColombianos(orden_tres)}
                                </div>
                            </td>
                            <td className='text-center'>
                                <div>
                                    {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 4))}
                                </div>
                                <div>
                                    {pesosColombianos(orden_cuatro)}
                                </div>
                            </td>
                            <td className='text-center'>
                                <div>
                                    {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 5))}
                                </div>
                                <div>
                                    {pesosColombianos(orden_cinco)}
                                </div>

                            </td>
                            <td className='text-center'>
                                <div>
                                    {_.size(_.pickBy(cotizaciones_x_responsable, e => e.orden === 6))}
                                </div>
                                <div>
                                    {pesosColombianos(orden_seis)}
                                </div>
                            </td>
                            <td className='text-center' style={{fontWeight: 'bold'}}>
                                <div>
                                    {_.size(cotizaciones_x_responsable)}
                                </div>
                                <div>
                                    {pesosColombianos(total_valor)}
                                </div>
                            </td>
                            <td className='text-center'
                                style={{backgroundColor: 'gray', color: 'white', fontWeight: 'bold'}}>
                                <div>
                                    {_.size(_.pickBy(cotizaciones_x_responsable, e => e.valor_orden_compra_mes > 0))}
                                </div>
                                <div>
                                    {pesosColombianos(orden_seis_mes)}
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
                        <td className='text-center'>
                            <div>
                                {valores_6.cantidad}<br/>
                                {pesosColombianos(valores_6.total)}
                            </div>
                        </td>
                        <td className='text-center'>
                            <div>
                                {cantidades_totales}<br/>
                                {pesosColombianos(valores_totales)}
                            </div>
                        </td>
                        <td className='text-center' style={{backgroundColor: 'gray', color: 'white', fontWeight: 'bold'}}>
                            <div>
                                {valores_mes.cantidad}<br/>
                                {pesosColombianos(valores_mes.total)}
                            </div>
                        </td>
                    </tr>
                    </tfoot>
                </table>
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </Fragment>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        object_list: state.cotizaciones,
    }
}

export default connect(mapPropsToState, actions)(InformeTunelVentas)