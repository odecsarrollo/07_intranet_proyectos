import React, {useEffect, useState, memo, Fragment} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';
import CobroFormBase from "./forms/CobroFormBase";
import CobroDetailTablaItems from "./CobroDetailTablaItems";
import Literales from "./CobroCRUDLiterales";
import EnviosTabla from "./forms/CobroCRUDFormEnvioTabla";
import Button from "@material-ui/core/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fechaFormatoUno} from "../../../../00_utilities/common";
import PrinJs from "print-js";
import moment from "moment-timezone";
import PagoModal from "./forms/CobroCRUDFormPagoModal";
import CobroDetailDocuento from './CobroDetailDocumentos';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {PROFORMAS_ANTICIPOS} from "../../../../permisos";

const style = {
    tabla: {
        fontSize: '0.7rem',
        tr: {
            td: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
            td_icono: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
            td_numero: {
                margin: 0,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 4,
                paddingRight: 4,
                textAlign: 'right',
                minWidth: '120px'
            },
            th_numero: {
                margin: 0,
                textAlign: 'right',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
            th: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
                minWidth: '120px'
            },
        }
    }
};

const EnviarMensajeAdicional = memo(props => {
    const {is_open, onCerrar, onEnviar} = props;
    const [mensaje_adicional_email, setMensajeAdicionalEmail] = useState('');
    return <Dialog
        fullScreen={false}
        open={is_open}
    >
        <DialogTitle id="responsive-dialog-title">
            <TextField
                style={{width: '600px'}}
                label="Mensaje Adicional Email"
                multiline={true}
                rows={6}
                fullWidth={true}
                onChange={e => setMensajeAdicionalEmail(e.target.value)}
                autoComplete="off"
                value={mensaje_adicional_email}
            />
        </DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions>
            <Button
                color="secondary"
                variant="contained"
                className='ml-3'
                onClick={() => onEnviar(mensaje_adicional_email)}
            >
                Enviar
            </Button>
            <Button
                color="secondary"
                variant="contained"
                className='ml-3'
                onClick={() => onCerrar()}
            >
                Cancelar
            </Button>
        </DialogActions>
    </Dialog>
});

const CobroDetail = memo(props => {
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const cobro = useSelector(state => state.contabilidad_proforma_anticipos[id]);
    const [show_mas_opciones, setMostrarMasOpciones] = useState(false);
    const [show_cobrada_modal, setCobradaModal] = useState(false);
    const [show_mensaje_adicional_email_modal, setShowMensajeAdicionalEmailModal] = useState(false);
    const permisos = useTengoPermisos(PROFORMAS_ANTICIPOS);

    useEffect(() => {
        dispatch(actions.fetchProformaAnticipo(id));
        return () => {
            dispatch(actions.clearProformasAnticipos());
        };
    }, []);

    if (!permisos.detail) {
        return <div>No tiene permisos</div>
    }

    const enviarPorEmail = (mensaje) => {
        const mensaje_exitoso = () => {
            setShowMensajeAdicionalEmailModal(false);
            dispatch(actions.notificarAction('Se ha enviado correctamente', {'title': 'Envío de proforma'}));
        };
        dispatch(actions.enviarProformaAnticipo(cobro.id, mensaje, {callback: mensaje_exitoso}));
    };

    const editar = () => dispatch(actions.cambiarEstadoProformaAnticipo(cobro.id, 'EDICION'));

    const recibida = () => dispatch(actions.cambiarEstadoProformaAnticipo(cobro.id, 'RECIBIDA'));
    const cobrada = (fecha_cobro) => {
        setCobradaModal(false);
        dispatch(actions.cambiarEstadoProformaAnticipo(cobro.id, 'CERRADA', fecha_cobro));
    };

    const imprimirCobro = () => {
        const imprimir_liquidacion = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            PrinJs(url);
        };
        dispatch(actions.printCobroProformaAnticipo(cobro.id, {callback: imprimir_liquidacion}));
    };

    const onSubmit = (v) => {
        dispatch(actions.updateProformaAnticipo(cobro.id, {...v, fecha: moment(v.fecha).format('YYYY-MM-DD')}));
    };

    if (!cobro) {
        return <div>Cargando...</div>
    }

    const fue_recibida = cobro.estado === 'RECIBIDA';
    const puede_enviar = cobro.items.length > 0 && (cobro.email_destinatario_dos || cobro.email_destinatario) && permisos.send_email;
    const esta_cerrada = cobro.estado === 'CERRADA';
    const editable = cobro.editable && permisos.change;
    return (
        <Fragment>
            {
                show_mensaje_adicional_email_modal &&
                <EnviarMensajeAdicional
                    onEnviar={enviarPorEmail}
                    is_open={show_mensaje_adicional_email_modal}
                    onCerrar={() => setShowMensajeAdicionalEmailModal(false)}
                />
            }
            {
                show_cobrada_modal &&
                <PagoModal
                    onCobrada={cobrada}
                    is_open={show_cobrada_modal}
                    onCerrar={() => setCobradaModal(false)}
                    fecha_minima={cobro.fecha}
                />
            }
            <CobroFormBase initialValues={cobro} onSubmit={onSubmit}/>
            <CobroDetailTablaItems editable={editable} cobro={cobro} style={style}/>
            <Literales cobro={cobro}/>
            <CobroDetailDocuento documentos={cobro.documentos} style={style} cobro={cobro}/>
            <EnviosTabla envios={cobro.envios} style={style}/>
            <div className="col-12">
                <Button
                    color="primary"
                    onClick={() => imprimirCobro()}
                    //disabled={!(submitting || pristine)}
                >
                    Imprimir Comprobante
                </Button>
                <FontAwesomeIcon
                    className='puntero'
                    icon={`${show_mas_opciones ? 'minus' : 'plus'}-circle`}
                    onClick={() => setMostrarMasOpciones(!show_mas_opciones)}
                />
                {show_mas_opciones &&
                <Fragment>
                    {
                        !esta_cerrada &&
                        <Button
                            color="primary"
                            className='ml-5'
                            variant="contained"
                            onClick={() => setShowMensajeAdicionalEmailModal(true)}
                            disabled={!puede_enviar}
                        >
                            Enviar
                        </Button>
                    }
                    {
                        !editable &&
                        !esta_cerrada &&
                        <Button
                            color="primary"
                            className='ml-2'
                            variant="contained"
                            onClick={() => editar()}
                            disabled={!permisos.change}
                        >
                            Editar
                        </Button>
                    }
                    {
                        !editable &&
                        !esta_cerrada &&
                        cobro.estado !== 'RECIBIDA' &&
                        <Button
                            variant="contained"
                            color="primary"
                            className='ml-2'
                            onClick={() => recibida()}
                            //disabled={!(submitting || pristine)}
                        >
                            Recibida
                        </Button>
                    }
                    {
                        !editable &&
                        fue_recibida &&
                        !esta_cerrada &&
                        <Button
                            style={{marginLeft: '90px'}}
                            color="secondary"
                            className='ml-2'
                            variant="contained"
                            onClick={() => setCobradaModal(true)}
                            //disabled={!(submitting || pristine)}
                        >
                            Cobrada
                        </Button>
                    }
                </Fragment>
                }
            </div>
            {
                cobro.fecha_cobro &&
                <div>
                    Pagada en {fechaFormatoUno(cobro.fecha_cobro)}
                </div>
            }
        </Fragment>
    )
});

export default CobroDetail;