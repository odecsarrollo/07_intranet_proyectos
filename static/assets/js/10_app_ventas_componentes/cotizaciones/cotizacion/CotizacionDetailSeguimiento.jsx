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
import {fechaHoraFormatoUno, formatBytes} from "../../../00_utilities/common";
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
            display: 'inline',
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
            tipo_seguimiento_nombre
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
        return 'thumbs-up'
    };
    const getFecha = () => {
        return fechaHoraFormatoUno(fecha)
    };

    const puede_eliminar = tipo_seguimiento !== 'ENV' && tipo_seguimiento !== 'EST';
    return (
        <Fragment>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <FontAwesomeIcon
                        className={clsx(classes.rightIcon, classes.iconSmall)}
                        icon={getIcono()}
                        size='lg'
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={`${tipo_seguimiento_nombre}`}
                    secondary={
                        <Fragment>
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
                        </Fragment>
                    }
                />
                {
                    puede_eliminar &&
                    <MyDialogButtonDelete
                        onDelete={() => eliminarSeguimiento(id)}
                        element_name='Seguimiento Cotización'
                        element_type='Seguimiento Cotización'
                    />
                }
            </ListItem>
            <Divider variant="inset" component="li"/>
        </Fragment>
    )
});

const CotizacionDetailSeguimiento = memo(props => {
    const classes = useStyles();
    const {seguimientos, cargarDatos, cotizacion_componente} = props;
    const [tipo_seguimiento, setTipoSeguimiento] = useState(null);
    const [show_add_seguimiento, setShowAddSeguimiento] = useState(false);
    const dispatch = useDispatch();
    const adicionarSeguimiento = (v) =>
        dispatch(
            actions.adicionarSeguimientoCotizacionComponente(
                cotizacion_componente.id,
                tipo_seguimiento,
                v.descripcion,
                moment(v.fecha).format('YYYY-MM-DDTHH:mm:00Z'),
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
                cotizacion_componente.id,
                seguimiento_id,
                {
                    callback: () => {
                        cargarDatos()
                    }
                }
            )
        );
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                Seguimiento
            </Typography>
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
            <div>
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
            </div>
            <List className={classes.list.root}>
                {_.orderBy(
                    seguimientos, ['fecha'], ['desc']).map(
                    item =>
                        <CotizacionDetailSeguimientoItem
                            eliminarSeguimiento={eliminarSeguimiento}
                            key={item.id}
                            item={item}
                        />)}
            </List>
        </Fragment>
    )

});

export default CotizacionDetailSeguimiento;