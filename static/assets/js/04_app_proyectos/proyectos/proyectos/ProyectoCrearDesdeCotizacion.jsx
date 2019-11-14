import React, {Fragment, memo, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import clsx from 'clsx';

import CreateForm from './forms/ProyectoCrearDesdeCotizacionModalForm';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import * as actions from "../../../01_actions/01_index";
import {useDispatch, useSelector} from "react-redux";

import SiNoDialog from '../../../00_utilities/components/ui/dialog/SiNoDialog';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {COTIZACIONES} from "../../../permisos";
import Badge from "@material-ui/core/Badge/Badge";

const useStyles = makeStyles(theme => ({
    element_div: {
        fontSize: '0.7rem',
        borderLeft: '1px solid black',
        borderRight: '1px solid black',
        borderTop: '1px solid black',
        padding: '3px'
    },
    iconoDelete: {
        color: theme.palette.primary.dark
    },
    elementNameText: {
        color: theme.palette.primary.dark,
        fontSize: '1rem'
    },
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const Lista = (props) => {
    let {list, onSelectItemEdit, permisos_object} = props;
    list = _.orderBy(list, ['nro_cotizacion'], ['desc']);
    const para_abrir_carpeta = _.pickBy(list, a => !a.revisada && a.abrir_carpeta);
    const para_notificar = _.pickBy(list, a => !a.revisada && a.notificar);
    const [show_verificar, setShowVerificar] = useState(false);
    const [notificacion_seleccionada, setNotificacionSeleccionada] = useState(null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const onAbrirModal = id_cotizacion => {
        setShowVerificar(true);
        setNotificacionSeleccionada(id_cotizacion);
    };
    const onNo = () => {
        setShowVerificar(false);
        setNotificacionSeleccionada(null);
    };
    const onSi = () => dispatch(actions.setRevisadoCotizacion(notificacion_seleccionada, {callback: () => onNo()}));
    return (
        <Fragment>
            {show_verificar &&
            <SiNoDialog
                onSi={onSi}
                onNo={onNo}
                is_open={show_verificar}
                titulo='Eliminar notificación'
            >
                Desea eliminar la notificación?
            </SiNoDialog>}
            <div className={classes.root}>
                {_.size(para_notificar) > 0 &&
                permisos_object.list_cotizaciones_notificaciones_consecutivo_proyectos &&
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<FontAwesomeIcon
                            icon='chevron-down'
                            size='xs'
                        />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        Notificaciones <Badge className='ml-3' badgeContent={_.size(para_notificar)} color="secondary"/>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className='row'>
                            {_.map(para_notificar, c =>
                                <div className={clsx(classes.element_div, 'col-12')} key={c.id}>
                                    <span>Se ha creado una cotización adicional </span>
                                    <Link
                                        to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${c.id}`}>
                                        ({c.unidad_negocio}-{c.nro_cotizacion})
                                    </Link>
                                    <span> para la cotización </span>
                                    <Link
                                        to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${c.cotizacion_inicial}`}>
                                        ({c.cotizacion_inicial_unidad_negocio}-{c.cotizacion_inicial_nro})
                                    </Link>
                                    {permisos_object.eliminar_cotizacion_notificacion_consecutivo_proyectos &&
                                    <IconButton
                                        style={{
                                            margin: 0,
                                            padding: 4,
                                        }}
                                        onClick={() => onAbrirModal(c.id)}
                                    >
                                        <FontAwesomeIcon
                                            className={classes.iconoDelete}
                                            icon={'trash'}
                                            size='sm'
                                        />
                                    </IconButton>}
                                </div>
                            )}
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>}
                {_.size(para_abrir_carpeta) > 0 &&
                permisos_object.list_cotizaciones_abrir_carpeta &&
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<FontAwesomeIcon
                            icon='chevron-down'
                            size='xs'
                        />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        Para apertura de carpeta <Badge className='ml-3' badgeContent={_.size(para_abrir_carpeta)}
                                                        color="secondary"/>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className='row'>
                            {_.map(para_abrir_carpeta, c =>
                                <div
                                    className={clsx(classes.element_div, `col-12`)}
                                    key={c.id}>
                                    {`${c.unidad_negocio}-${c.nro_cotizacion} ${c.descripcion_cotizacion} `}<strong>({c.cliente_nombre})</strong>
                                    {permisos_object.rel_cotizacion_proyecto &&
                                    <IconButton
                                        style={{
                                            margin: 0,
                                            marginLeft: '2px',
                                            padding: 4,
                                        }}
                                        onClick={() => {
                                            if (permisos_object.rel_cotizacion_proyecto) {
                                                onSelectItemEdit(c)
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            className={classes.iconoDelete}
                                            icon='link'
                                            size='sm'
                                        />
                                    </IconButton>}
                                    {permisos_object.eliminar_cotizacion_notificacion_consecutivo_proyectos &&
                                    <IconButton
                                        style={{
                                            margin: 0,
                                            marginLeft: '2px',
                                            padding: 4,
                                        }}
                                        onClick={() => onAbrirModal(c.id)}
                                    >
                                        <FontAwesomeIcon
                                            className={classes.iconoDelete}
                                            icon={'trash'}
                                            size='sm'
                                        />
                                    </IconButton>}
                                </div>
                            )}
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                }
            </div>
        </Fragment>
    )
};


const CRUD = crudHOC(CreateForm, Lista);

const CotizacionAbrirCarpetaLista = memo(props => {
    const {cargarDatosConsecutivoProyectos} = props;
    const permisos_object = useTengoPermisos(COTIZACIONES);
    let lista = useSelector(state => state.cotizaciones);
    lista = _.pickBy(lista, c => !c.revisada);
    const dispatch = useDispatch();

    const createProyecto = (item, options) => dispatch(actions.createProyecto({...item, en_cguno: false}, options));

    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCotizacion(id, options)),
        deleteObjectMethod: null,
        createObjectMethod: (item, options) => createProyecto(item, options),
        updateObjectMethod: null,
    };
    const cargarDatos = (callback) => dispatch(actions.fetchCotizacionesPidiendoCarpeta({callback}));

    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearCotizaciones());
    }, []);

    return (
        <CRUD
            posCreateMethod={(item) => {
                window.open(`/app/proyectos/proyectos/detail/${item.id}`, "_blank");
                cargarDatos(cargarDatosConsecutivoProyectos);
            }}
            method_pool={method_pool}
            list={lista}
            permisos_object={{
                ...permisos_object,
                add: false,
                delete: false,
                change: true,
                list: true
            }}
            plural_name=''
            singular_name='Proyecto'
        />
    )
});

export default CotizacionAbrirCarpetaLista;