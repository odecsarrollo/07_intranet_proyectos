import React, {Fragment, memo, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import CreateForm from './forms/ProyectoCrearDesdeCotizacionModalForm';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import * as actions from "../../../01_actions/01_index";
import {useDispatch} from "react-redux";

import SiNoDialog from '../../../00_utilities/components/ui/dialog/SiNoDialog';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    iconoDelete: {
        color: theme.palette.primary.dark
    },
    elementNameText: {
        color: theme.palette.primary.dark,
        fontSize: '1rem'
    },
}));

const Lista = (props) => {
    const {list, onSelectItemEdit} = props;
    const para_abrir_carpeta = _.pickBy(list, a => a.abrir_carpeta);
    const para_notificar = _.pickBy(list, a => a.revisar);
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
            {_.size(para_notificar) > 0 &&
            <Fragment>
                <h4 style={{color: 'red'}}>Notificaciones</h4>
                <ul className="list-group puntero" style={{fontSize: '0.7rem', padding: 0, margin: 0}}>
                    {_.map(para_notificar, c =>
                        <li key={c.id} className="list-group-item">
                            <div>
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
                                </IconButton>
                            </div>
                        </li>
                    )}
                </ul>
            </Fragment>
            }
            {_.size(para_abrir_carpeta) > 0 &&
            <Fragment>
                <h4 style={{color: 'red'}}>Para apertura de carpeta</h4>
                <ul className="list-group puntero" style={{fontSize: '0.7rem', padding: 0, margin: 0}}>
                    {_.map(para_abrir_carpeta, c =>
                        <li key={c.id}
                            onClick={() => {
                                onSelectItemEdit(c);
                            }}
                            className="list-group-item">
                            {`${c.unidad_negocio}-${c.nro_cotizacion} ${c.descripcion_cotizacion} (${c.cliente_nombre})`}
                        </li>
                    )}
                </ul>
            </Fragment>
            }
        </Fragment>
    )
};


const CRUD = crudHOC(CreateForm, Lista);

const CotizacionAbrirCarpetaLista = memo(props => {
    const {permisos_object, history} = props;
    let {lista} = props;
    lista = _.pickBy(lista, c => c.abrir_carpeta || c.revisar);
    const dispatch = useDispatch();
    const cargarCotizacionesParaCarpetas = () => dispatch(actions.fetchCotizacionesPidiendoCarpeta());

    const createProyecto = (item, options) => dispatch(actions.createProyecto({...item, en_cguno: false}, options));

    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCotizacion(id, options)),
        deleteObjectMethod: null,
        createObjectMethod: (item, options) => createProyecto(item, options),
        updateObjectMethod: null,
    };

    useEffect(() => {
        cargarCotizacionesParaCarpetas();
        return () => dispatch(actions.clearCotizaciones());
    }, []);

    return (
        <CRUD
            posCreateMethod={(item) => history.push(`/app/proyectos/proyectos/detail/${item.id}`)}
            method_pool={method_pool}
            list={lista}
            permisos_object={permisos_object}
            plural_name=''
            singular_name='Proyecto'
        />
    )
});

export default CotizacionAbrirCarpetaLista;