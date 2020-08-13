import React, {Fragment, memo, useState} from 'react';
import {fechaFormatoUno} from "../../../00_utilities/common";
import {Link} from 'react-router-dom'
import CotizacionDetailInfoValoresTable from './CotizacionDetailInfoValoresTable';
import CotizacionDetailInfoLiteral from './CotizacionDetailInfoLiteral';
import CotizacionDetailInfoProyecto from './CotizacionDetailInfoProyecto';
import CotizacionDetailInfoCotizacionAdicional from './CotizacionDetailInfoCotizacionAdicional';
import DialogSeleccionar from "../../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import * as actions from "../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import Button from "@material-ui/core/Button";

const CotizacionInfo = memo(props => {
    const dispatch = useDispatch();
    const {object, object: {estado}, permisos_cotizacion} = props;
    const [open_convertir_en_adicional, setOpenConvertirEnAdicional] = useState(null);
    const {cotizacion_inicial} = object;
    let cotizaciones_list = useSelector(state => state.cotizaciones);
    const estados_para_convertir_a_adicional = ['Aceptación de Terminos y Condiciones', 'Cierre (Aprobado)'];
    cotizaciones_list = _.pickBy(cotizaciones_list, c => !c.cotizacion_inicial && c.id !== object.id && estados_para_convertir_a_adicional.includes(c.estado) && object.cliente === c.cliente);
    const buscarCotizacion = (busqueda) => dispatch(actions.fetchCotizacionesxParametro(`${busqueda}`, {
        limpiar_coleccion: false,
        preserve_items: [object.id]
    }));
    const convertirEnInicial = (cotizacion_inicial_id) => dispatch(actions.convertirEnAdicionalCotizacion(object.id, cotizacion_inicial_id, {callback: () => setOpenConvertirEnAdicional(false)}));
    return (
        <div className="row">
            {open_convertir_en_adicional && <DialogSeleccionar
                min_caracteres={3}
                placeholder='Cotización a Relacionar'
                id_text='id'
                selected_item_text='numero_cotizacion'
                onSearch={buscarCotizacion}
                onSelect={convertirEnInicial}
                onCancelar={() => setOpenConvertirEnAdicional(false)}
                listado={_.map(cotizaciones_list, e => ({
                    numero_cotizacion: `${e.unidad_negocio}-${e.nro_cotizacion}`,
                    id: e.id
                }))}
                onUnMount={() => {
                    dispatch(actions.fetchCotizacion(object.id, {
                        callback: () => dispatch(actions.clearCotizaciones({omit_items: [object.id]}))
                    }))
                }}
                open={open_convertir_en_adicional}
                select_boton_text='Seleccionar como inicial'
                titulo_modal={'Convertir en Adicional'}
            />}
            <div className="col-12 col-lg-6">
                <strong>Descripción: </strong> {object.descripcion_cotizacion}
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <strong>Cliente: </strong> {object.cliente_nombre}
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                <strong>Contacto: </strong>
                {object.contacto_cliente_nombre &&
                <Fragment>
                    <Link
                        to={`/app/ventas_proyectos/clientes/detail/${object.cliente}`}>{object.contacto_cliente_nombre}
                    </Link><br/>
                </Fragment>}
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Fecha Inicio
                            Proyecto: </strong>{object.condiciones_inicio_fecha_ultima ? fechaFormatoUno(object.condiciones_inicio_fecha_ultima) : 'Sin Definir'}
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Días Pactados Entrega Proyecto: </strong>{object.dias_pactados_entrega_proyecto}
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                        <strong>Fecha Entrega
                            Proyecto: </strong>{object.fecha_entrega_pactada ? fechaFormatoUno(object.fecha_entrega_pactada) : 'Sin Definir'}
                    </div>
                </div>
            </div>
            {cotizacion_inicial && <div className="col-12">
                <strong>Cotización Inicial: </strong>
                <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${cotizacion_inicial.id}`}>
                    {cotizacion_inicial.unidad_negocio}-{cotizacion_inicial.nro_cotizacion}
                </Link>
            </div>}
            <div className="col-12 col-lg-4">
                <CotizacionDetailInfoValoresTable cotizacion={object}/>
            </div>
            {estado === 'Cierre (Aprobado)' &&
            <Fragment>
                {object.es_adicional &&
                <div className="col-12 col-sm-6 col-md-8 col-lg-4">
                    <CotizacionDetailInfoLiteral cotizacion={object} permisos_cotizacion={permisos_cotizacion}/>
                </div>}

                {!object.es_adicional &&
                <Fragment>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                        <CotizacionDetailInfoProyecto cotizacion={object} permisos_cotizacion={permisos_cotizacion}/>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                        <CotizacionDetailInfoCotizacionAdicional cotizacion={object}/>
                    </div>
                </Fragment>}
            </Fragment>}

            {!object.cotizacion_inicial &&
            permisos_cotizacion.cotizacion_convertir_en_adicional &&
            estados_para_convertir_a_adicional.includes(object.estado) &&
            <div className="col-12">
                <Button
                    color="primary"
                    variant="contained"
                    className='ml-3'
                    onClick={() => setOpenConvertirEnAdicional(true)}
                >
                    Convertir en Adicional
                </Button>
            </div>}
            {object.responsable_nombres &&
            <div className='col-12'>
                <strong>Encargado: </strong> {object.responsable_nombres} {object.responsable_apellidos}
                <br/></div>}

            {object.observacion &&
            <div className='col-12'><strong>Observación: </strong> {object.observacion}</div>}
        </div>
    )
});

export default CotizacionInfo;