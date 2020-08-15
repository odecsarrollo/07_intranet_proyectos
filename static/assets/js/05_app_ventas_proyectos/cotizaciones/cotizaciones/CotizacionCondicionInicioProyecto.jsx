import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import {useSelector} from "react-redux/es/hooks/useSelector";
import {fechaFormatoUno, formatoDinero} from "../../../00_utilities/common";
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import SiNoDialog from "../../../00_utilities/components/ui/dialog/SiNoDialog";
import * as actions from "../../../01_actions/01_index";
import {eliminarOrdenCompraCotizacion} from "../../../01_actions/01_index";
import CotizacionCondicionInicioProyectoItemForm from './forms/CotizacionCondicionInicioProyectoItemForm';
import CotizacionOrdenCompraForm from "./forms/CotizacionOrdenCompraForm";
import OrdenCompraAddForm from "./forms/OrdenCompraAddForm";

const useStyles = makeStyles(theme => ({
    delete_boton: {
        position: 'absolute',
        bottom: '10px',
        right: '10px'
    },
    download_boton: {
        position: 'absolute',
        bottom: '10px',
        right: '40px',
        margin: 0,
        padding: 4,
        color: theme.palette.primary.dark
    },
    limpiar_boton: {
        position: 'absolute',
        bottom: '10px',
        right: '20px',
        margin: 0,
        padding: 4,
        color: theme.palette.primary.dark
    },
    info_archivo: {
        color: theme.palette.primary.dark
    },
}));

const CondicionInicioWrapper = (props) => {
    const {
        children,
        tipo,
        archivo_url,
        onDelete,
        element_name,
        element_type
    } = props;
    const classes = useStyles();
    return <div className='col-12 col-sm-6 col-md-4'>
        <div className="card p-4 m-1">
            <Typography variant="body1" gutterBottom color="primary">
                {tipo}
            </Typography>
            {children}
            {onDelete && <div className={classes.limpiar_boton}>
                <MyDialogButtonDelete
                    onDelete={onDelete}
                    element_name={element_name}
                    element_type={element_type}
                />
            </div>}
            {archivo_url && <a href={archivo_url} target='_blank'>
                <IconButton className={classes.download_boton}>
                    <FontAwesomeIcon
                        className='puntero'
                        icon='download'
                        size='xs'
                    />
                </IconButton>
            </a>}
        </div>
    </div>
}
const CotizacionCondicionInicioProyectoCotizacion = props => {
    const {
        cotizacion,
        cotizacion_documento
    } = props;
    const dispatch = useDispatch();
    const eliminarCotizacion = () => {
        return dispatch(
            actions.deleteArchivoCotizacion(
                cotizacion_documento.id,
                {
                    callback: () => {
                        dispatch(actions.fetchCotizacion(cotizacion.id));
                    }
                }
            )
        )
    };
    const classes = useStyles();
    return <CondicionInicioWrapper
        element_type='Archivo Cotización'
        element_name={cotizacion_documento.nombre_archivo}
        tipo='COTIZACIÓN'
        onDelete={eliminarCotizacion}
        archivo_url={cotizacion_documento.archivo_url}
    >
        <div className={classNames("col-12", classes.info_archivo)}>
            Nombre Documento: {cotizacion_documento.nombre_archivo}
        </div>
    </CondicionInicioWrapper>
}
const CotizacionCondicionInicioProyectoOC = props => {
    const {cotizacion} = props;
    const {orden_compra_fecha, valor_orden_compra, orden_compra_nro, orden_compra_archivo, id} = props.orden_compra;
    const classes = useStyles();
    const dispatch = useDispatch();
    const eliminarOC = () => dispatch(eliminarOrdenCompraCotizacion(cotizacion.id, id));
    return <CondicionInicioWrapper
        element_type='Orden de Compra'
        element_name={`${formatoDinero(valor_orden_compra, '$', 0)}`}
        tipo='ORDEN COMPRA'
        onDelete={eliminarOC}
        archivo_url={orden_compra_archivo}
    >
        <div className={classNames("col-12", classes.info_archivo)}>
            Fecha Entrega: {fechaFormatoUno(orden_compra_fecha)}
        </div>
        <div className={classNames("col-12", classes.info_archivo)}>
            Valor Orden de Compra: {formatoDinero(valor_orden_compra, '$', 0)}
        </div>
        <div className={classNames("col-12", classes.info_archivo)}>
            Nro. Orden de Compra: {orden_compra_nro}
        </div>

    </CondicionInicioWrapper>
};

const CotizacionCondicionInicioProyecto = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [mostrar_add_nueva_orden_compra, setMostrarAddNuevaOrdenCompra] = useState(false);
    const [mostrar_add_nueva_cotizacion, setMostrarAddNuevaCotizacion] = useState(false);
    const [archivo_cotizacion, setArchivoCotizacion] = useState(null);
    const [tempo_base_oc_vieja, setTempoBaseOCVieja] = useState(null);
    const {
        cotizacion,
        cotizacion: {
            mis_documentos,
            pagos_proyectados,
            condiciones_inicio_cotizacion,
            orden_compra_fecha,
            valor_orden_compra,
            orden_compra_nro,
            orden_compra_archivo
        }
    } = props;
    const cerrado = cotizacion.estado === 'Cierre (Aprobado)';
    const cotizaciones_archivos = mis_documentos && mis_documentos.filter(d => d.tipo === 'COTIZACION');
    const requiere_cotizacion = cotizacion.estado === 'Aceptación de Terminos y Condiciones' && mis_documentos.filter(d => d.tipo === 'COTIZACION').length === 0;

    let list = useSelector(state => state.condiciones_inicios_proyectos);
    const read_only_orden_compra = (orden_compra_fecha && valor_orden_compra > 0 && orden_compra_nro && orden_compra_archivo);
    const cargarDatos = () => {
        dispatch(actions.fetchCondicionesIniciosProyectos());
    };

    const onUploadCotizacion = (file, callback) => {
        let formData = new FormData();
        formData.append('archivo', file);
        formData.append('nombre', `COTIZACION_${cotizacion.nro_cotizacion}`);
        formData.append('tipo', 'COTIZACION');
        dispatch(
            actions.uploadArchivoCotizacion(
                cotizacion.id,
                formData,
                {
                    callback:
                        () => {
                            dispatch(
                                actions.fetchCotizacion(
                                    cotizacion.id,
                                    {
                                        callback: () => {
                                            dispatch(actions.notificarAction(`La ha subido la cotizacion ${cotizacion.nro_cotizacion}`));
                                            callback()
                                        }
                                    }
                                )
                            )
                        }
                }
            )
        )
    };


    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCondicionesIniciosProyectos());
        };
    }, []);
    const condiciones_inicio_cotizacion_seleccionadas = _.orderBy(_.map(condiciones_inicio_cotizacion, c => c.condicion_inicio_proyecto), ['require_documento'], ['desc']);
    list = _.map(list, e => ({...e, esta_activo: condiciones_inicio_cotizacion_seleccionadas.includes(e.id)}));
    list = _.orderBy(list, ['esta_activo'], ['desc']);

    return <div className='row'>
        {mostrar_add_nueva_cotizacion && <SiNoDialog
            can_on_si={archivo_cotizacion !== null}
            onSi={() => {
                onUploadCotizacion(archivo_cotizacion, () => {
                    setMostrarAddNuevaCotizacion(false);
                    setArchivoCotizacion(null);
                })
            }}
            onNo={() => setMostrarAddNuevaCotizacion(false)}
            is_open={mostrar_add_nueva_cotizacion}
            titulo='Subir Cotización'
        >
            Deséa Subir esta cotización?
            <div>
                <span>Archivo: </span>
                <input type='file' onChange={(event) => setArchivoCotizacion(event.target.files[0])}/>
            </div>
        </SiNoDialog>}
        {mostrar_add_nueva_orden_compra && <OrdenCompraAddForm
            cotizacion={cotizacion}
            initialValues={tempo_base_oc_vieja}
            modal_open={mostrar_add_nueva_orden_compra}
            singular_name='Orden Compra'
            onCancel={() => {
                setMostrarAddNuevaOrdenCompra(false);
                setTempoBaseOCVieja(null);
            }}
        />}

        {requiere_cotizacion && <div className="col-12" style={{color: 'red'}}>
            Antes de continuar, necesitas al menos tener una cotización!
        </div>}
        <div className="col-12">
            {!requiere_cotizacion && <Button
                className={'mr-2'}
                color="primary"
                variant="contained"
                onClick={() => setMostrarAddNuevaOrdenCompra(true)}
            >
                Adicionar Orden Compra
            </Button>}
            <Button
                color="primary"
                variant="contained"
                onClick={() => setMostrarAddNuevaCotizacion(true)}
            >
                Adicionar Cotización
            </Button>
        </div>
        {cotizaciones_archivos && cotizaciones_archivos.length > 0 && cotizaciones_archivos.map(c =>
            <CotizacionCondicionInicioProyectoCotizacion cotizacion={cotizacion} cotizacion_documento={c} key={c.id}/>
        )}
        {pagos_proyectados && pagos_proyectados.length > 0 && pagos_proyectados.map(p =>
            <CotizacionCondicionInicioProyectoOC cotizacion={cotizacion} orden_compra={p} key={p.id}/>)}
        {(cotizacion.orden_compra_archivo || cotizacion.valor_orden_compra > 0) && <CotizacionOrdenCompraForm
            initialValues={cotizacion}
            read_only={read_only_orden_compra}
            classes={classes}
            setTempoBaseOCVieja={setTempoBaseOCVieja}
            setMostrarAddNuevaOrdenCompra={setMostrarAddNuevaOrdenCompra}
        />}

        {!requiere_cotizacion && <Fragment>
            <div className="col-12">
                <p style={{color: 'red'}}>
                    Aquí debe definir TODOS los documentos que configuran el inicio del proyecto. Automáticamente al
                    guardar
                    el
                    último de ellos se enviará un correo al área de Ingeniería para la apertura de los proyectos
                    correspondientes.
                </p>
            </div>
            {_.map(list, c => {
                const accion = () => c.esta_activo ? dispatch(actions.quitarCondicionInicioProyectoCotizacion(cotizacion.id, c.id)) : dispatch(actions.adicionarCondicionInicioProyectoCotizacion(cotizacion.id, c.id));
                return (
                    <div className='col-12 col-sm-6 col-md-4' key={c.id}>
                        {!c.esta_activo && !cerrado && <FormControlLabel
                            control={
                                <Checkbox
                                    checked={c.esta_activo}
                                    color='primary'
                                    onChange={accion}
                                />
                            }
                            label={c.to_string}
                        />}
                        {c.esta_activo && <CotizacionCondicionInicioProyectoItemForm
                            classes={classes}
                            form={`form-${c.id}`}
                            initialValues={_.mapKeys(condiciones_inicio_cotizacion, 'condicion_inicio_proyecto')[c.id]}
                            onDelete={accion}
                        />}
                    </div>
                )
            })}
        </Fragment>}
    </div>
};

export default CotizacionCondicionInicioProyecto;