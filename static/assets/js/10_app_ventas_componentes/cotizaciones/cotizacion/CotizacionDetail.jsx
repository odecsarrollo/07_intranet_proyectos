import React, {memo, useEffect, useState, Fragment} from "react";
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
import CotizacionEnviarFormDialog from './forms/CotizacionEnviarFormDialog'
import CotizacionRechazadaFormDialog from './forms/CotizacionRechazadaFormDialog'
import CotizacionDetailEnvioListItem from './CotizacionDetailEnvioList'
import CotizacionDetailSeguimiento from './CotizacionDetailSeguimiento'
import UploadFileDialogForm from '../../../00_utilities/components/ui/UploadFileDialogForm';
import SiNoDialog from '../../../00_utilities/components/ui/dialog/SiNoDialog';
import PrinJs from "print-js";
import Button from "@material-ui/core/Button";
import {notificarAction} from "../../../01_actions/01_index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
}));

const BotonCotizacion = memo(props => {
    const classes = useStyles();
    const {onClick, nombre, icono = null, color = 'primary'} = props;
    return (
        <Button
            className={classes.button}
            variant="contained"
            color={color}
            onClick={onClick}
        >
            {nombre}
            {icono &&
            <FontAwesomeIcon
                className={clsx(classes.rightIcon, classes.iconSmall)}
                icon={icono}
                size='lg'
            />}
        </Button>
    )
});

const Detail = memo(props => {
    const dispatch = useDispatch();
    const [show_enviar, setShowEnviar] = useState(false);
    const [show_rechazada, setShowRechazada] = useState(false);
    const [show_en_proceso, setShowEnProceso] = useState(false);
    const [show_terminar, setShowTerminar] = useState(false);
    const [show_editar_confirmacion, setShowEditarConfirmacion] = useState(false);
    const [show_envios_cotizacion, setShowEnviosCotizacion] = useState(false);
    const [show_adicionar_ajunto, setShowAdicionarAdjunto] = useState(false);
    const [tipo_adjunto, setTipoAdjunto] = useState(null);
    const {id} = props.match.params;
    const {history} = props;
    const object = useSelector(state => state.cotizaciones_componentes[id]);
    const contactos = useSelector(state => state.clientes_contactos);
    const permisos = useTengoPermisos(COTIZACIONES_COMPONENTES);
    const cargarDatos = () => {
        const cargarContacto = (contacto_id) => dispatch(actions.fetchContactoCliente(contacto_id));
        dispatch(actions.fetchCotizacionComponente(id, {callback: coti => cargarContacto(coti.contacto)}));
    };
    const auth = useSelector(state => state.auth);

    const adicionarItem = (
        tipo_item,
        precio_unitario,
        item_descripcion,
        item_referencia,
        item_unidad_medida,
        item_id = null,
        forma_pago_id = null,
        callback = null
    ) => {
        dispatch(
            actions.adicionarItemCotizacionComponente(
                id,
                tipo_item,
                precio_unitario,
                item_descripcion,
                item_referencia,
                item_unidad_medida,
                item_id,
                forma_pago_id,
                {callback}
            )
        )
    };

    const eliminarItem = (id_item_cotizacion) => dispatch(actions.eliminarItemCotizacionComponente(
        id,
        id_item_cotizacion,
        {
            callback: () => dispatch(actions.fetchCotizacionComponente(id))
        }
    ));
    const cambiarItem = (id_item_cotizacion, item) => dispatch(actions.updateItemCotizacionComponente(
        id_item_cotizacion,
        item,
        {
            callback: () => dispatch(actions.fetchCotizacionComponente(id))
        }
    ));
    const cambiarPosicionItem = (id_item_cotizacion, direccion) => dispatch(actions.cambiarPosicionItemCotizacionComponente(
        id,
        id_item_cotizacion,
        direccion,
        {
            callback: () => dispatch(actions.fetchCotizacionComponente(id))
        }
    ));

    const getTiposDocumentos = () => {
        if (tipo_adjunto === 'imagen') {
            return "image/*"
        } else if (tipo_adjunto === 'archivo') {
            return ".docx, .doc, .xls, .xlsx, .pdf, .pptx, .ppt, .xlsm"
        }
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
    const onDeleteArchivo = (adjunto_id) => dispatch(actions.deleteAdjuntoCotizacionComponente(id, adjunto_id, {callback: () => dispatch(actions.fetchCotizacionComponente(id))}));
    const setEstado = (estado_nuevo, razon_rechazo = null, callback = null) => dispatch(actions.cambiarEstadoCotizacionComponente(id, estado_nuevo, razon_rechazo, {callback}));
    const enviarCotizacion = (valores) => {
        dispatch(actions.enviarCotizacionComponente(
            id,
            valores,
            {
                callback: () => {
                    dispatch(notificarAction('La cotización se ha enviado correctamente'));
                    return setShowEnviar(false);
                }
            })
        )
    };

    const onUploadAdjunto = (e) => {
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            formData.append('tipo', tipo_adjunto);
            dispatch(
                actions.uploadAdjuntoCotizacionComponente(
                    id,
                    formData,
                    {
                        callback:
                            () => {
                                dispatch(actions.notificarAction(`Se ha subido el archivo para el proyecto`));
                                setShowAdicionarAdjunto(false);
                                dispatch(actions.fetchCotizacionComponente(id))
                            }
                    }
                )
            )
        }
    };

    const editable = object.estado === 'INI';
    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
            <div className="row">
                {show_terminar &&
                <SiNoDialog
                    onSi={() => {
                        setEstado(
                            'FIN',
                            null,
                            () => {
                                cargarDatos();
                                setShowTerminar(false);
                            }
                        )
                    }}
                    onNo={() => setShowTerminar(false)}
                    is_open={show_terminar}
                    titulo='Terminar Cotización'
                >
                    Deséa TERMINAR esta cotización?
                </SiNoDialog>}
                {show_editar_confirmacion &&
                <SiNoDialog
                    onSi={() => {
                        setEstado(
                            'INI',
                            null,
                            () => {
                                cargarDatos();
                                setShowEditarConfirmacion(false);
                            }
                        )
                    }}
                    onNo={() => setShowEditarConfirmacion(false)}
                    is_open={show_editar_confirmacion}
                    titulo='Editar Cotización?'
                >
                    Deséa EDITAR esta cotización?
                </SiNoDialog>}
                {show_en_proceso &&
                <SiNoDialog
                    onSi={() => {
                        setEstado(
                            'PRO',
                            null,
                            () => {
                                cargarDatos();
                                setShowEnProceso(false);
                            }
                        )
                    }}
                    onNo={() => setShowEnProceso(false)}
                    is_open={show_en_proceso}
                    titulo='Cambiar a estado en proceso'
                >
                    Deséa pasar esta cotización a estado EN PROCESO?
                </SiNoDialog>}
                {show_rechazada &&
                <CotizacionRechazadaFormDialog
                    singular_name='Cotización Rechazada'
                    modal_open={show_rechazada}
                    onCancel={() => setShowRechazada(false)}
                    onSubmit={(v) => setEstado(
                        'ELI',
                        v.razon_rechazada,
                        () => {
                            cargarDatos();
                            setShowRechazada(false);
                        }
                    )}
                />}
                {show_adicionar_ajunto &&
                <UploadFileDialogForm
                    accept={getTiposDocumentos()}
                    type_element={tipo_adjunto.toUpperCase()}
                    is_open={show_adicionar_ajunto}
                    onCancel={() => {
                        setShowAdicionarAdjunto(false);
                        setTipoAdjunto(null);
                    }}
                    onSubmit={onUploadAdjunto}
                />}

                {show_enviar &&
                <CotizacionEnviarFormDialog
                    auth={auth}
                    singular_name='Cotización'
                    contacto={contacto_cotizacion}
                    modal_open={show_enviar}
                    onCancel={() => setShowEnviar(false)}
                    onSubmit={enviarCotizacion}
                />}
                <div className="col-12">
                    <div className="row">
                        <div className="col-9">
                            {editable &&
                            <div className="col-12">
                                <CotizacionEdicionList cotizacion_actual_id={object.id} cargar={true}/>
                            </div>}
                            <div className="col-12">
                                <Typography variant="h5" gutterBottom color="primary">
                                    Items Cotización
                                    {editable && <CotizadorAdicionarItem adicionarItem={adicionarItem}/>}
                                </Typography>
                                <CotizacionDetailItemsTabla
                                    editable={editable}
                                    items={object.items}
                                    eliminarItem={eliminarItem}
                                    cambiarItem={cambiarItem}
                                    cambiarPosicionItem={cambiarPosicionItem}
                                    valor_total={object.valor_total}
                                    cantidad_items={object.cantidad_items}
                                />
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    {object.estado === 'INI' &&
                                    <Fragment>
                                        <div
                                            className='puntero'
                                            onClick={() => {
                                                setShowAdicionarAdjunto(true);
                                                setTipoAdjunto('archivo');
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={'file'}
                                                size='3x'
                                            />
                                            <FontAwesomeIcon
                                                icon={'arrow-circle-up'}
                                                style={{color: "green", marginLeft: '-10px', marginBottom: '-13px'}}
                                                size='lg'
                                            />
                                        </div>
                                        <div
                                            className='puntero ml-3'
                                            onClick={() => {
                                                setShowAdicionarAdjunto(true);
                                                setTipoAdjunto('imagen');
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={'file-image'}
                                                size='3x'
                                            />
                                            <FontAwesomeIcon
                                                icon={'arrow-circle-up'}
                                                style={{color: "green", marginLeft: '-10px', marginBottom: '-13px'}}
                                                size='lg'
                                            />
                                        </div>
                                    </Fragment>}
                                    <div className="puntero ml-3">
                                        <FontAwesomeIcon
                                            icon={'history'}
                                            onClick={() => setShowEnviosCotizacion(true)}
                                            size='3x'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <CotizacionDetailAdjuntoList
                                    en_edicion={object.estado === 'INI'}
                                    onDeleteArchivo={onDeleteArchivo}
                                    adjuntos={object.adjuntos}
                                />
                            </div>
                            {show_envios_cotizacion &&
                            <div className="col-12">
                                <CotizacionDetailEnvioListItem
                                    onClose={() => setShowEnviosCotizacion(false)}
                                    lista={object.envios_emails}
                                    modal_open={show_envios_cotizacion}
                                />
                            </div>}
                            {object.estado !== 'INI' &&
                            object.estado !== 'ELI' &&
                            <div className="col-12">
                                <CotizacionDetailSeguimiento
                                    seguimientos={object.seguimientos}
                                    cargarDatos={cargarDatos}
                                    cotizacion_componente={object}
                                />
                            </div>}
                        </div>
                        <div className="col-3">
                            <div className="row">
                                <div className="col-12">
                                    <CotizacionDetailInfo
                                        onDelete={onDeleteCotizacion}
                                        editable={editable}
                                        cotizacion={object}
                                        contacto_cotizacion={contacto_cotizacion}
                                        onSubmitCotizacion={onSubmitCotizacion}
                                        cargarDatos={cargarDatos}
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    {object.estado === 'REC' &&
                                    <BotonCotizacion
                                        onClick={() => setShowEnProceso(true)}
                                        icono='thumbs-up'
                                        nombre='En Proceso'
                                    />}
                                    {(object.estado === 'REC' || object.estado === 'PRO') &&
                                    <BotonCotizacion
                                        icono='thumbs-down'
                                        onClick={() => setShowRechazada(true)}
                                        color='secondary'
                                        nombre='Rechazada'
                                    />}
                                    {object.estado === 'REC' &&
                                    <BotonCotizacion
                                        onClick={() => setShowEditarConfirmacion(true)}
                                        nombre='Editar'
                                        icono='edit'/>}
                                    {object.estado === 'ENV' &&
                                    <BotonCotizacion
                                        onClick={() => setEstado('REC', null, () => cargarDatos())}
                                        nombre='Recibida'
                                    />}
                                    {object.estado === 'PRO' &&
                                    <BotonCotizacion
                                        onClick={() => setShowTerminar(true)}
                                        nombre='Terminada'
                                    />}
                                </div>
                            </div>
                            {object.items.length > 0 && object.estado !== 'ELI' && object.estado !== 'FIN' &&
                            <div className="col-12 text-center">
                                <BotonCotizacion
                                    icono='inbox-out'
                                    onClick={() => setShowEnviar(true)}
                                    nombre='Enviar'
                                />
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
                {!object.nro_consecutivo &&
                <Button
                    color="primary"
                    onClick={() => generarNroConsecutivo()}
                >
                    Generar Consecutivo
                </Button>}
            </div>
        </ValidarPermisos>
    )

});

export default Detail;