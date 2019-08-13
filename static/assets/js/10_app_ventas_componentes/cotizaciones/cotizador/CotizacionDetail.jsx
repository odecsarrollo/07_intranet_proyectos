import React, {memo, useEffect, useState, Fragment, useContext} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../../01_actions/01_index';
import {SinObjeto} from "../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import {COTIZACIONES_COMPONENTES} from "../../../permisos";
import Typography from "@material-ui/core/Typography";
import CotizacionCRUDFormDialog from './forms/CotizacionCRUDFormDialog.jsx'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CotizacionDetailAddItemNoListaPrecio from "./CotizacionDetailAddItemNoListaPrecio";
import CotizacionDetailItemsTabla from "./CotizacionDetailItemsTabla";

const Detail = memo(props => {
    const [show_cotizacion_informacion_dialog, setShowCotizacionInformacionDialog] = useState(false);
    const [show_adicionar_item, setShowAdicionarItem] = useState(false);
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const object = useSelector(state => state.cotizaciones_componentes[id]);
    const contactos = useSelector(state => state.clientes_contactos);
    const permisos = useTengoPermisos(COTIZACIONES_COMPONENTES);
    const cargarDatos = () => {
        const cargarContacto = (contacto_id) => dispatch(actions.fetchContactoCliente(contacto_id));
        dispatch(actions.fetchCotizacionComponente(id, {callback: coti => cargarContacto(coti.contacto)}));
    };

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

    const eliminarItem = (id_item_cotizacion) => dispatch(actions.eliminarItemCotizacionComponente(id, id_item_cotizacion));
    const cambiarItem = (item) => dispatch(actions.updateItemCotizacionComponente(
        id,
        item,
        {
            callback: () => dispatch(actions.fetchCotizacionComponente(id))
        })
    );

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearContactosClientes());
            dispatch(actions.clearCotizacionesComponentes());
            dispatch(actions.clearItemsCotizacionesComponentes());
        }
    }, []);

    if (!object) {
        return <SinObjeto/>
    }
    const contacto_cotizacion = contactos[object.contacto];
    const onSubmitCotizacion = (v) => dispatch(
        actions.updateCotizacionComponente(
            id,
            v,
            {
                callback: () => {
                    setShowCotizacionInformacionDialog(false);
                    cargarDatos();
                }
            }
        )
    );
    return (
        <ValidarPermisos can_see={permisos.detail} nombre='detalles de cotización'>
            {show_cotizacion_informacion_dialog &&
            <CotizacionCRUDFormDialog
                singular_name={`Contacto Cotización ${object.nro_consecutivo}`}
                initialValues={object}
                modal_open={show_cotizacion_informacion_dialog}
                onCancel={() => {
                    cargarDatos();
                    setShowCotizacionInformacionDialog(false);
                }}
                onSubmit={onSubmitCotizacion}
            />}
            <div className="row">
                <div className="col-8">
                    <div className="col-12">

                    </div>
                    <div className="col-12">
                        <Typography variant="h5" gutterBottom color="primary">
                            Items Cotización
                        </Typography>
                        <CotizacionDetailItemsTabla
                            items={object.items}
                            eliminarItem={eliminarItem}
                            cambiarItem={cambiarItem}
                        />
                        <CotizacionDetailAddItemNoListaPrecio adicionarItem={adicionarItem}/>
                    </div>
                </div>
                <div className="col-4">
                    <Typography variant="h5" gutterBottom color="primary">
                        Datos Cotización {object.nro_consecutivo}
                        <FontAwesomeIcon
                            className='puntero'
                            icon={'edit'}
                            onClick={() => setShowCotizacionInformacionDialog(true)}
                        />
                    </Typography>
                    <Typography variant="body1" gutterBottom color="primary">
                        Cliente: {object.cliente_nombre}
                    </Typography>
                    <Typography variant="body1" gutterBottom color="primary">
                        Ciudad: {`${object.ciudad_nombre} - ${object.departamento_nombre} - ${object.pais_nombre}`}
                    </Typography>
                    {contacto_cotizacion &&
                    <Fragment>
                        <Typography variant="body1" gutterBottom color="primary">
                            Contacto: {contacto_cotizacion.full_nombre}
                        </Typography>
                        {contacto_cotizacion.telefono &&
                        <Typography variant="overline" color="inherit" gutterBottom>
                            Teléfono: {contacto_cotizacion.telefono}
                        </Typography>}<br/>
                        {contacto_cotizacion.telefono_2 &&
                        <Typography variant="overline" color="inherit" gutterBottom>
                            Teléfono 2: {contacto_cotizacion.telefono_2}
                        </Typography>}<br/>
                        {contacto_cotizacion.correo_electronico &&
                        <Typography variant="overline" color="inherit" gutterBottom>
                            Email: {contacto_cotizacion.correo_electronico}
                        </Typography>}<br/>
                        {contacto_cotizacion.correo_electronico_2 &&
                        <Typography variant="overline" color="inherit" gutterBottom>
                            Email 2: {contacto_cotizacion.correo_electronico_2}
                        </Typography>}<br/>
                    </Fragment>
                    }
                </div>
            </div>
        </ValidarPermisos>
    )

});

export default Detail;