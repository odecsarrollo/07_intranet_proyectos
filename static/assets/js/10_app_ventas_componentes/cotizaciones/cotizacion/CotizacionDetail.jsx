import React, {memo, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../../01_actions/01_index';
import {SinObjeto} from "../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {COTIZACIONES_COMPONENTES, CLIENTES} from "../../../permisos";
import Typography from "@material-ui/core/Typography";
import CotizacionDetailAdjuntoList from './CotizacionDetailAdjuntoList.jsx'
import CotizacionEdicionList from '../CotizacionEdicionList.jsx'
import CotizacionDetailInfo from './CotizacionDetailInfo.jsx'
import CotizacionDetailItemsTabla from "./CotizacionDetailItemsTabla";
import CotizadorAdicionarItem from './CotizadorAdicionarItem'
import CotizacionDetailSeguimiento from './CotizacionDetailSeguimiento'
import PrinJs from "print-js";
import Button from "@material-ui/core/Button";
import CotizacionDetailBotoneriaEstado from "./CotizacionDetailBotoneriaEstado";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import HistoricoPrecio from "../../../03_app_admin/especificas/clientes/clientes/ClienteHistoricoPrecios";

const Detail = memo(props => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const {history} = props;
    const cotizaciones = useSelector(state => state.cotizaciones_componentes);
    const cotizacion = cotizaciones[id];
    const contactos = useSelector(state => state.clientes_contactos);
    const permisos = useTengoPermisos(COTIZACIONES_COMPONENTES);
    const permisos_clientes = useTengoPermisos(CLIENTES);
    const cargarDatos = () => {
        const cargarContacto = (
            contacto_id
        ) => dispatch(actions.fetchContactoCliente(contacto_id));
        dispatch(actions.fetchCotizacionComponente(
            id, {
                callback: coti => cargarContacto(coti.contacto)
            })
        );
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearContactosClientes());
            dispatch(actions.clearCotizacionesComponentes());
            dispatch(actions.clearItemsCotizacionesComponentes());
        }
    }, [id]);
    if (!cotizacion) {
        return <SinObjeto/>
    }
    const contacto_cotizacion = contactos[cotizacion.contacto];
    const onSubmitCotizacion = (v, callback) => dispatch(
        actions.updateCotizacionComponente(
            id,
            v,
            {
                callback: () => {
                    cargarDatos();
                    callback();
                }
            }
        )
    );
    const imprimirCotizacion = () => {
        const imprimir = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        dispatch(actions.printCotizacionComponente(id, {callback: imprimir}));
    };
    const generarNroConsecutivo = () => dispatch(actions.asignarNroConsecutivoCotizacionComponente(id));
    const onDeleteCotizacion = () => dispatch(actions.deleteCotizacionComponente(id, {callback: () => history.push('/app/ventas_componentes/cotizaciones/list')}));

    const editable = cotizacion.estado === 'INI';
    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-9">
                            {editable && <div className="col-12">
                                <CotizacionEdicionList
                                    cotizacion_actual_id={cotizacion.id}
                                    cargar={true}
                                />
                            </div>}
                            <div className="col-12">
                                <Typography variant="h5" gutterBottom color="primary">
                                    Items Cotización
                                    {editable && <CotizadorAdicionarItem cotizacion_componente={cotizacion}/>}
                                </Typography>
                                <CotizacionDetailItemsTabla
                                    editable={editable}
                                    cotizacion_componente={cotizacion}
                                    cargarDatos={cargarDatos}
                                    valor_total={cotizacion.valor_total}
                                    cantidad_items={cotizacion.cantidad_items}
                                />
                            </div>
                            <div className="col-12">
                                <CotizacionDetailAdjuntoList
                                    cargarDatos={cargarDatos}
                                    cotizacion_componente={cotizacion}
                                    en_edicion={cotizacion.estado === 'INI'}
                                    adjuntos={cotizacion.adjuntos}
                                />
                            </div>
                            <div className="col-12">
                                <CotizacionDetailSeguimiento
                                    seguimientos={cotizacion.seguimientos}
                                    cargarDatos={cargarDatos}
                                    cotizacion_componente={cotizacion}
                                />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="row">
                                <div className="col-12">
                                    <CotizacionDetailInfo
                                        onDelete={onDeleteCotizacion}
                                        editable={editable}
                                        cotizacion={cotizacion}
                                        contacto={contacto_cotizacion}
                                        onSubmitCotizacion={onSubmitCotizacion}
                                        cargarDatos={cargarDatos}
                                    />
                                </div>
                            </div>
                            <CotizacionDetailBotoneriaEstado
                                cargarDatos={cargarDatos}
                                contacto={contacto_cotizacion}
                                cotizacion_componente={cotizacion}
                            />
                            {permisos_clientes.consultar_historico_precios && <div>
                                Consulte aquí los precios anteriores...
                                <HistoricoPrecio
                                    id_cotizacion_ignorar={cotizacion.id}
                                    cliente={{id: cotizacion.cliente, to_string: cotizacion.cliente_nombre}}/>
                            </div>}

                        </div>
                    </div>
                </div>
                <Button
                    color="primary"
                    onClick={() => imprimirCotizacion()}
                >
                    Imprimir Cotización
                </Button>
                {!cotizacion.nro_consecutivo && <Button
                    color="primary"
                    onClick={() => generarNroConsecutivo()}
                >
                    Generar Consecutivo
                </Button>}
            </div>
            <CargarDatos cargarDatos={cargarDatos}/>
        </ValidarPermisos>
    )

});

export default Detail;