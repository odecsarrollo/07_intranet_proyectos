import React, {memo, useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../../01_actions/01_index';
import {SinObjeto} from "../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {COTIZACIONES_COMPONENTES} from "../../../permisos";
import Typography from "@material-ui/core/Typography";
import CotizacionDetailAdjuntoList from './CotizacionDetailAdjuntoList.jsx'
import CotizacionEdicionList from './CotizacionEdicionList.jsx'
import CotizacionDetailInfo from './CotizacionDetailInfo.jsx'
import CotizacionDetailItemsTabla from "./CotizacionDetailItemsTabla";
import CotizadorAdicionarItem from './CotizadorAdicionarItem'
import CotizacionEnviarFormDialog from './forms/CotizacionEnviarFormDialog'
import UploadFileDialogForm from '../../../00_utilities/components/ui/UploadFileDialogForm';
import PrinJs from "print-js";
import Button from "@material-ui/core/Button";
import {notificarAction} from "../../../01_actions/01_index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const BotonNuevoEstado = memo(props => {
    const {setEstado, nuevo_estado, nombre} = props;
    return (
        <div className='p-1'>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => setEstado(nuevo_estado)}
            >
                {nombre}
            </Button>
        </div>
    )
});

const Detail = memo(props => {
    const dispatch = useDispatch();
    const [show_enviar, setShowEnviar] = useState(false);
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

    const setEstado = estado_nuevo => dispatch(actions.cambiarEstadoCotizacionComponente(id, estado_nuevo));
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

    console.log(object)

    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
            <div className="row">
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
                    singular_name='Enviar Cotización'
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
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <CotizacionDetailAdjuntoList
                                    adjuntos={object.adjuntos}
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
                                        contacto_cotizacion={contacto_cotizacion}
                                        onSubmitCotizacion={onSubmitCotizacion}
                                        cargarDatos={cargarDatos}
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    {object.estado !== 'INI' && object.estado !== 'ELI' && object.estado !== 'FIN' &&
                                    <BotonNuevoEstado nuevo_estado='INI' setEstado={setEstado} nombre='Editar'/>}
                                    {object.estado === 'ENV' &&
                                    <BotonNuevoEstado nuevo_estado='REC' setEstado={setEstado} nombre='Recibida'/>}
                                    {object.estado === 'REC' &&
                                    <BotonNuevoEstado nuevo_estado='PRO' setEstado={setEstado} nombre='Proceso'/>}
                                    {object.estado === 'REC' || object.estado === 'PRO' &&
                                    <BotonNuevoEstado nuevo_estado='ELI' setEstado={setEstado} nombre='Rechazada'/>}
                                    {object.estado === 'PRO' &&
                                    <BotonNuevoEstado nuevo_estado='FIN' setEstado={setEstado} nombre='Terminada'/>}
                                </div>
                            </div>
                            {object.items.length > 0 && object.estado !== 'ELI' && object.estado !== 'FIN' &&
                            <div className="col-12 text-center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setShowEnviar(true)
                                    }}
                                >
                                    Enviar
                                </Button>
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