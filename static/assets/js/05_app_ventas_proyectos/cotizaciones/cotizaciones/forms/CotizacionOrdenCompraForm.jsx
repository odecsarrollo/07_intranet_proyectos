import React, {Fragment, useState} from 'react';
import {
    MyDateTimePickerField,
    MyFieldFileInput,
    MyTextFieldSimple
} from "../../../../00_utilities/components/ui/forms/fields";
import BotoneriaModalForm from "../../../../00_utilities/components/ui/forms/botoneria_modal_form";
import {reduxForm} from "redux-form";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import classNames from "classnames";
import {fechaFormatoUno, formatBytes, pesosColombianos} from "../../../../00_utilities/common";
import IconButton from "@material-ui/core/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SiNoDialog from "../../../../00_utilities/components/ui/dialog/SiNoDialog";
import moment from 'moment-timezone';

let CotizacionOrdenCompraForm = (props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        handleSubmit,
        classes,
        read_only,
        change
    } = props;
    const {to_string, id, orden_compra_archivo_url, orden_compra_archivo_size, orden_compra_archivo_filename} = initialValues;
    const [show_limpiar, setShowLimpiar] = useState(false);
    const dispatch = useDispatch();

    const submitObject = (values) => {
        let datos_a_subir = new FormData();

        let datos_formulario = {
            orden_compra_fecha: values.orden_compra_fecha,
            valor_orden_compra: values.valor_orden_compra,
            orden_compra_nro: values.orden_compra_nro,
        };
        let {orden_compra_fecha} = datos_formulario;
        if (orden_compra_fecha) {
            if ((typeof orden_compra_fecha) === 'string') {
                orden_compra_fecha = new Date(orden_compra_fecha)
            }
            orden_compra_fecha = moment(orden_compra_fecha).tz('America/Bogota').format('YYYY-MM-DD');
            datos_formulario = {...datos_formulario, orden_compra_fecha};
        }
        _.mapKeys(datos_formulario, (value, key) => {
            if (value) {
                datos_a_subir.append(key, value);
            }
        });
        if (values.orden_compra_archivo) {
            if (typeof values.orden_compra_archivo !== 'string') {
                datos_a_subir.append('orden_compra_archivo', values.orden_compra_archivo[0]);
            }
        }
        return datos_a_subir;
    };

    const onSubmit = (v) => {
        if (initialValues.id) {
            return dispatch(actions.actualizarOrdenCompraCotizacion(initialValues.id, v))
        }
    };

    const onSiLimpiarCondicionInicio = () => dispatch(actions.limpiarCondicionInicioCotizacion(id, null, true, {callback: () => setShowLimpiar(false)}));
    const {orden_compra_fecha, valor_orden_compra, orden_compra_nro, valor_ofertado} = initialValues;
    return <div className={`${read_only ? 'col-12 col-sm-6 col-md-4' : 'col-6'}`}>
        <div className="card p-4 m-1">
            <Typography variant="body1" gutterBottom color="primary">
                ORDEN DE COMPRA <small>(Valor Ofertado: {pesosColombianos(valor_ofertado)} <FontAwesomeIcon
                    className='puntero'
                    icon='paste'
                    onClick={() => change('valor_orden_compra', valor_ofertado)}/>)
            </small>
            </Typography>

            {show_limpiar && <SiNoDialog
                onSi={onSiLimpiarCondicionInicio}
                onNo={() => setShowLimpiar(false)}
                is_open={show_limpiar}
                titulo='Limpiar Condición Inicio'
            >
                Desea Limpiar la orden de compra de {to_string}
            </SiNoDialog>}
            {!read_only && <form onSubmit={handleSubmit((v) => onSubmit(submitObject(v)))}>
                <div className="row">
                    <MyDateTimePickerField
                        label='Fecha Entregada'
                        label_space_xs={4}
                        name='orden_compra_fecha'
                        nombre='Fecha Orden de Compra'
                        className='col-12 col-md-4'
                    />
                    <MyTextFieldSimple
                        nombre='Valor OC'
                        name='valor_orden_compra'
                        className="col-12 col-md-4"
                        type='number'
                    />
                    <MyTextFieldSimple
                        nombre='Nro. Orden Compra'
                        name='orden_compra_nro'
                        className="col-12 col-md-4"
                        case='U'/>
                    <MyFieldFileInput className='col-12 p-2' name="orden_compra_archivo"/>
                    <BotoneriaModalForm
                        conCerrar={false}
                        mostrar_cancelar={false}
                        pristine={pristine}
                        reset={reset}
                        submitting={submitting}
                        initialValues={initialValues}
                    />
                </div>
            </form>}
            {read_only && <Fragment>
                <div className={classNames("col-12", classes.info_archivo)}>
                    Fecha Entrega: {fechaFormatoUno(orden_compra_fecha)}
                </div>
                <div className={classNames("col-12", classes.info_archivo)}>
                    Valor Orden de Compra: {pesosColombianos(valor_orden_compra)}
                </div>
                <div className={classNames("col-12", classes.info_archivo)}>
                    Nro. Orden de Compra: {orden_compra_nro}
                </div>
                <IconButton className={classes.limpiar_boton} onClick={() => setShowLimpiar(true)}>
                    <FontAwesomeIcon
                        className='puntero'
                        icon='eraser'
                        size='xs'
                    />
                </IconButton>
            </Fragment>}
            {orden_compra_archivo_url && <Fragment>
                <a href={orden_compra_archivo_url} target='_blank'>
                    <IconButton className={classes.download_boton}>
                        <FontAwesomeIcon
                            className='puntero'
                            icon='download'
                            size='xs'
                        />
                    </IconButton>
                </a>
                <div
                    className={classNames("col-12", classes.info_archivo)}>Tamaño: {formatBytes(orden_compra_archivo_size)}</div>
                <div className={classNames("col-12", classes.info_archivo)}>Nombre
                    Archivo: {orden_compra_archivo_filename}</div>
            </Fragment>}
        </div>
    </div>
};
CotizacionOrdenCompraForm = reduxForm({
    form: 'cotizacionOrdenCompraForm',
    enableReinitialize: true
})(CotizacionOrdenCompraForm);

export default CotizacionOrdenCompraForm;