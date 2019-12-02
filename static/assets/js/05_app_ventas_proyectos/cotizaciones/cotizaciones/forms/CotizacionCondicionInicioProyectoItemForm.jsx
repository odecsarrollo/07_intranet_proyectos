import React, {Fragment, useState} from 'react';
import classNames from 'classnames';
import {
    MyDateTimePickerField,
    MyFieldFileInput
} from "../../../../00_utilities/components/ui/forms/fields";
import BotoneriaModalForm from "../../../../00_utilities/components/ui/forms/botoneria_modal_form";
import {reduxForm} from "redux-form";
import Typography from "@material-ui/core/Typography";
import MyDialogButtonDelete from "../../../../00_utilities/components/ui/dialog/delete_dialog";
import * as actions from "../../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import IconButton from "@material-ui/core/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fechaFormatoUno, formatBytes} from "../../../../00_utilities/common";
import moment from "moment-timezone";
import SiNoDialog from "../../../../00_utilities/components/ui/dialog/SiNoDialog";
import validate from './condicion_inicio_proyecto_cotizacion_validate';

let CotizacionCondicionInicioProyectoItemForm = (props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        handleSubmit,
        onDelete,
        classes
    } = props;
    const {
        to_string,
        require_documento,
        documento_url,
        size,
        fecha_entrega,
        filename,
        condicion_inicio_proyecto,
        cotizacion_proyecto,
        condicion_especial
    } = initialValues;
    const read_only = (require_documento && documento_url && fecha_entrega) || (!require_documento && fecha_entrega);
    const [show_limpiar, setShowLimpiar] = useState(false);
    const dispatch = useDispatch();
    const onSubmit = (v) => {
        if (initialValues.id) {
            const cargarCotizacion = () => dispatch(actions.fetchCotizacion(cotizacion_proyecto));
            return dispatch(actions.updateCondicionInicioProyectoCotizacion(initialValues.id, v, {callback: cargarCotizacion}))
        }
    };
    const onSiLimpiarCondicionInicio = () => dispatch(actions.limpiarCondicionInicioCotizacion(cotizacion_proyecto, condicion_inicio_proyecto, null, {callback: () => setShowLimpiar(false)}));
    const submitObject = (item) => {
        let datos_a_subir = new FormData();
        let datos_formulario = _.omit(item, 'documento');
        let {fecha_entrega} = datos_formulario;
        if (fecha_entrega) {
            if ((typeof fecha_entrega) === 'string') {
                fecha_entrega = new Date(fecha_entrega)
            }
            fecha_entrega = moment(fecha_entrega).tz('America/Bogota').format('YYYY-MM-DD');
            datos_formulario = {...datos_formulario, fecha_entrega};
        }
        _.mapKeys(datos_formulario, (item, key) => {
            datos_a_subir.append(key, item);
        });
        if (item.documento) {
            if (typeof item.documento !== 'string') {
                datos_a_subir.append('documento', item.documento[0]);
            }
        }
        return datos_a_subir;
    };
    return <div className="row card p-4 m-1" style={{border: `${condicion_especial ? '1px solid red' : ''}`}}>
        <Typography variant="body1" gutterBottom color="primary">
            {to_string}
        </Typography>
        {show_limpiar && <SiNoDialog
            onSi={onSiLimpiarCondicionInicio}
            onNo={() => setShowLimpiar(false)}
            is_open={show_limpiar}
            titulo='Limpiar Condición Inicio'
        >
            Desea Limpiar condición de inicio {to_string}
        </SiNoDialog>}
        {!read_only && <Fragment>
            <form
                onSubmit={handleSubmit(v => onSubmit(submitObject(v)))}
            >
                <MyDateTimePickerField
                    className={`col-12`}
                    name='fecha_entrega'
                    dropUp={false}
                    label='Fecha Engregado'
                    label_space_xs={4}
                />
                {require_documento && <MyFieldFileInput className='col-12 p-2' name="documento"/>}
                <MyDialogButtonDelete
                    className={classes.delete_boton}
                    onDelete={onDelete}
                    element_name={to_string}
                    element_type='Condicion Inicio'
                />
                <BotoneriaModalForm
                    conCerrar={false}
                    mostrar_cancelar={false}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
                {condicion_especial &&
                <div style={{color: 'red'}}>Esta condición notificará para apertura de la orden independientemente las
                    otras se cumplan o no.</div>}
            </form>
        </Fragment>}
        {read_only && <Fragment>
            <div className={classNames("col-12", classes.info_archivo)}>
                Fecha Entrega: {fechaFormatoUno(fecha_entrega)}
            </div>
            <IconButton className={classes.limpiar_boton} onClick={() => setShowLimpiar(true)}>
                <FontAwesomeIcon
                    className='puntero'
                    icon='eraser'
                    size='xs'
                />
            </IconButton>
            {documento_url && <Fragment>
                <a href={documento_url} target='_blank'>
                    <IconButton className={classes.download_boton}>
                        <FontAwesomeIcon
                            className='puntero'
                            icon='download'
                            size='xs'
                        />
                    </IconButton>
                </a>
                <div className={classNames("col-12", classes.info_archivo)}>Nombre Archivo: {filename}</div>
                <div className={classNames("col-12", classes.info_archivo)}>Tamaño: {formatBytes(size)}</div>
            </Fragment>}
        </Fragment>}
    </div>
};
CotizacionCondicionInicioProyectoItemForm = reduxForm({
    validate,
    enableReinitialize: true
})(CotizacionCondicionInicioProyectoItemForm);

export default CotizacionCondicionInicioProyectoItemForm;