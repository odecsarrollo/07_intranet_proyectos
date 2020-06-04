import React, {memo, Fragment, useState} from "react";
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import CotizacionSeguimientoFormDialog from "./forms/CotizacionSeguimientoFormDialog";
import Typography from '@material-ui/core/Typography';
import clsx from "clsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fechaHoraFormatoUno, fechaToYMD, formatBytes} from "../../../00_utilities/common";
import * as actions from '../../../01_actions/01_index';
import moment from "moment-timezone";

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
    list: {
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        inline: {
            display: 'inline'
        },
    }
}));

const CotizacionDetailSeguimientoItem = memo(props => {
    const classes = useStyles();
    const {
        item: {
            tipo_seguimiento,
            creado_por_username,
            fecha,
            id,
            descripcion,
            tipo_seguimiento_nombre,
            documento_cotizacion_url,
            documento_cotizacion_size,
            documento_cotizacion_version
        },
        eliminarSeguimiento
    } = props;
    const getIcono = () => {
        if (tipo_seguimiento === 'TEL') {
            return 'phone'
        }
        if (tipo_seguimiento === 'ENV') {
            return 'inbox-out'
        }
        if (tipo_seguimiento === 'VIS') {
            return 'suitcase-rolling'
        }
        if (tipo_seguimiento === 'COM') {
            return 'comments'
        }
        if (tipo_seguimiento === 'EST') {
            return 'exchange-alt'
        }
        if (tipo_seguimiento === 'SEG') {
            return 'abacus'
        }
        return 'thumbs-up'
    };
    const getFecha = () => {
        return fechaHoraFormatoUno(fecha)
    };
    const onOpenUrl = (url) => window.open(url, '_blank');

    const puede_eliminar = tipo_seguimiento !== 'ENV' && tipo_seguimiento !== 'EST' && tipo_seguimiento !== 'SEG';
    return (
        <Fragment>
            <ListItem alignItems="flex-start" style={{margin: 0, padding: 0}}>
                <ListItemAvatar>
                    <FontAwesomeIcon
                        className={clsx(classes.rightIcon, classes.iconSmall)}
                        icon={getIcono()}
                        size='lg'
                    />
                </ListItemAvatar>
                <ListItemText
                    style={{margin: 0, padding: 0}}
                    primary={`${tipo_seguimiento_nombre}`}
                    secondary={
                        <Fragment>
                            {documento_cotizacion_url && <Fragment>
                                <FontAwesomeIcon
                                    onClick={() => onOpenUrl(documento_cotizacion_url)}
                                    className='puntero'
                                    icon={'file'}
                                    size={'2x'}
                                />
                                ({formatBytes(documento_cotizacion_size, 2)}) {documento_cotizacion_version &&
                            <Fragment>(v.{documento_cotizacion_version})</Fragment>}
                                <br/>
                            </Fragment>}
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.list.inline}
                                color="textPrimary"
                            >
                                <span><strong>{creado_por_username}</strong> </span>
                            </Typography>
                            {descripcion}<br/>
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.list.inline}
                                color="textPrimary"
                            >
                                <span>{getFecha()} </span>
                            </Typography>
                        </Fragment>}
                />
                {puede_eliminar && <MyDialogButtonDelete
                    onDelete={() => eliminarSeguimiento(id)}
                    element_name='Seguimiento Cotización'
                    element_type='Seguimiento Cotización'
                />}
            </ListItem>
            <Divider variant="middle" component="li"/>
        </Fragment>
    )
});

const CotizacionDetailSeguimiento = memo(props => {
    const classes = useStyles();
    const {seguimientos, cargarDatos, cotizacion_componente, cotizacion_componente: {estado, id}} = props;
    const [tipo_seguimiento, setTipoSeguimiento] = useState(null);
    const [ver_todo, setVerTodo] = useState(null);
    const [show_add_seguimiento, setShowAddSeguimiento] = useState(false);
    const dispatch = useDispatch();
    const adicionarSeguimiento = (v) =>
        dispatch(
            actions.adicionarSeguimientoCotizacionComponente(
                id,
                tipo_seguimiento,
                v.descripcion,
                moment(v.fecha).format('YYYY-MM-DDTHH:mm:00Z'),
                v.fecha_verificacion_proximo_seguimiento ? fechaToYMD(v.fecha_verificacion_proximo_seguimiento) : null,
                {
                    callback: () => {
                        cargarDatos();
                        setShowAddSeguimiento(false);
                        setTipoSeguimiento(null);
                    }
                }
            )
        );

    const eliminarSeguimiento = (seguimiento_id) =>
        dispatch(
            actions.eliminarSeguimientoCotizacionComponente(
                id,
                seguimiento_id,
                {
                    callback: () => {
                        cargarDatos()
                    }
                }
            )
        );
    return (
        <div className='row'>
            {show_add_seguimiento &&
            <CotizacionSeguimientoFormDialog
                initialValues={{fecha: new Date()}}
                cotizacion_componente={cotizacion_componente}
                modal_open={show_add_seguimiento}
                tipo_seguimiento={tipo_seguimiento}
                onCancel={() => setShowAddSeguimiento(false)}
                onSubmit={(v) => adicionarSeguimiento(v)}
                singular_name='Seguimiento Cotización'
            />}
            <div className="col-12">
                <Typography variant="h5" gutterBottom color="primary">
                    Seguimiento
                </Typography>
            </div>
            {estado !== 'INI' &&
            estado !== 'ELI' &&
            <div className='mb-3 col-12'>
                <FontAwesomeIcon
                    icon='comments'
                    size='3x'
                    className='puntero'
                    onClick={() => {
                        setTipoSeguimiento('COM');
                        setShowAddSeguimiento(true);
                    }}
                />
                <FontAwesomeIcon
                    icon='suitcase-rolling'
                    size='3x'
                    className='ml-3 puntero'
                    onClick={() => {
                        setTipoSeguimiento('VIS');
                        setShowAddSeguimiento(true);
                    }}
                />
                <FontAwesomeIcon
                    icon='phone'
                    size='3x'
                    className='ml-3 puntero'
                    onClick={() => {
                        setTipoSeguimiento('TEL');
                        setShowAddSeguimiento(true);
                    }}
                />
                <FontAwesomeIcon
                    icon='abacus'
                    size='3x'
                    className='ml-3 puntero'
                    onClick={() => {
                        setTipoSeguimiento('SEG');
                        setShowAddSeguimiento(true);
                    }}
                />
            </div>}
            <div style={{height: ver_todo ? '100%' : '300px', overflow: ver_todo ? null : 'scroll'}} className='col-12'>
                <List className={classes.list.root}>
                    {_.orderBy(
                        seguimientos, ['id', 'fecha'], ['desc', 'desc']).map(
                        item =>
                            <CotizacionDetailSeguimientoItem
                                eliminarSeguimiento={eliminarSeguimiento}
                                key={item.id}
                                item={item}
                            />)}
                </List>
            </div>
            <div className="col-12 text-right">
                <span onClick={() => setVerTodo(!ver_todo)}
                      className='puntero'>{ver_todo ? 'Ver Menos...' : 'Ver Mas...'}</span>
            </div>
        </div>
    )

});

export default CotizacionDetailSeguimiento;