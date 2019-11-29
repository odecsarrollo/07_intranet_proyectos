import React, {Fragment, useState} from 'react';
import {MyDateTimePickerField, MyTextFieldSimple} from "../../../../00_utilities/components/ui/forms/fields";
import BotoneriaModalForm from "../../../../00_utilities/components/ui/forms/botoneria_modal_form";
import {reduxForm} from "redux-form";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import classNames from "classnames";
import {fechaFormatoUno, pesosColombianos} from "../../../../00_utilities/common";
import IconButton from "@material-ui/core/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SiNoDialog from "../../../../00_utilities/components/ui/dialog/SiNoDialog";

let CotizacionOrdenCompraForm = (props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        handleSubmit,
        onDelete,
        classes,
        read_only
    } = props;
    const {to_string, id} = initialValues;
    const [show_limpiar, setShowLimpiar] = useState(false);
    const dispatch = useDispatch();
    const onSubmit = (v) => {
        if (initialValues.id) {
            return dispatch(actions.updateCotizacion(initialValues.id, {...initialValues, ...v}))
        }
    };
    const onSiLimpiarCondicionInicio = () => dispatch(actions.limpiarCondicionInicioCotizacion(id, null, true, {callback: () => setShowLimpiar(false)}));
    const {orden_compra_fecha, valor_orden_compra, orden_compra_nro} = initialValues;
    return <div className={`${read_only ? 'col-12 col-sm-6 col-md-4' : 'col-6'}`}>
        <div className="card p-4 m-1">
            <Typography variant="body1" gutterBottom color="primary">
                ORDEN DE COMPRA
            </Typography>
            {show_limpiar && <SiNoDialog
                onSi={onSiLimpiarCondicionInicio}
                onNo={() => setShowLimpiar(false)}
                is_open={show_limpiar}
                titulo='Limpiar Condición Inicio'
            >
                Desea Limpiar la orden de compra de {to_string}
            </SiNoDialog>}
            {!read_only && <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <MyDateTimePickerField
                        label='Fecha Entregada'
                        label_space_xs={4}
                        max={new Date(2099, 11, 31)}
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
        </div>
    </div>
};
CotizacionOrdenCompraForm = reduxForm({
    form: 'cotizacionOrdenCompraForm',
    enableReinitialize: true
})(CotizacionOrdenCompraForm);

export default CotizacionOrdenCompraForm;