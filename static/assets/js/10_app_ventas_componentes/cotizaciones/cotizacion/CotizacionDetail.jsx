import React, {memo, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../../01_actions/01_index';
import {SinObjeto} from "../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {COTIZACIONES_COMPONENTES} from "../../../permisos";
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

const Detail = memo(props => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const {history} = props;
    const object = useSelector(state => state.cotizaciones_componentes[id]);
    const contactos = useSelector(state => state.clientes_contactos);
    const permisos = useTengoPermisos(COTIZACIONES_COMPONENTES);
    const cargarDatos = () => {
        const cargarContacto = (contacto_id) => dispatch(actions.fetchContactoCliente(contacto_id));
        dispatch(actions.fetchCotizacionComponente(id, {callback: coti => cargarContacto(coti.contacto)}));
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearContactosClientes());
            dispatch(actions.clearCotizacionesComponentes());
            dispatch(actions.clearItemsCotizacionesComponentes());
        }
    }, [id]);

    if (!object) {
        return <SinObjeto/>
    }
    const contacto_cotizacion = contactos[object.contacto];
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

    const editable = object.estado === 'INI';
    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-9">
                            {editable &&
                            <div className="col-12">
                                <CotizacionEdicionList
                                    cotizacion_actual_id={object.id}
                                    cargar={true}
                                />
                            </div>}
                            <div className="col-12">
                                <Typography variant="h5" gutterBottom color="primary">
                                    Items Cotización
                                    {editable && <CotizadorAdicionarItem cotizacion_componente={object}/>}
                                </Typography>
                                <CotizacionDetailItemsTabla
                                    editable={editable}
                                    cotizacion_componente={object}
                                    cargarDatos={cargarDatos}
                                    valor_total={object.valor_total}
                                    cantidad_items={object.cantidad_items}
                                />
                            </div>
                            <div className="col-12">
                                <CotizacionDetailAdjuntoList
                                    cargarDatos={cargarDatos}
                                    cotizacion_componente={object}
                                    en_edicion={object.estado === 'INI'}
                                    adjuntos={object.adjuntos}
                                />
                            </div>
                            <div className="col-12">
                                <CotizacionDetailSeguimiento
                                    seguimientos={object.seguimientos}
                                    cargarDatos={cargarDatos}
                                    cotizacion_componente={object}
                                />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="row">
                                <div className="col-12">
                                    <CotizacionDetailInfo
                                        onDelete={onDeleteCotizacion}
                                        editable={editable}
                                        cotizacion={object}
                                        contacto={contacto_cotizacion}
                                        onSubmitCotizacion={onSubmitCotizacion}
                                        cargarDatos={cargarDatos}
                                    />
                                </div>
                            </div>
                            <CotizacionDetailBotoneriaEstado
                                cargarDatos={cargarDatos}
                                contacto={contacto_cotizacion}
                                cotizacion_componente={object}
                            />
                        </div>
                    </div>
                </div>
                <Button
                    color="primary"
                    onClick={() => imprimirCotizacion()}
                >
                    Imprimir Cotización
                </Button>
                {!object.nro_consecutivo &&
                <Button
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