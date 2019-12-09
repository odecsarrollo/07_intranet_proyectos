import React, {memo} from 'react';
import moment from "moment-timezone";
import {MyTextFieldSimple, MyDateTimePickerField} from "../../../../00_utilities/components/ui/forms/fields";
import {MyFormTagModal} from "../../../../00_utilities/components/ui/forms/MyFormTagModal";
import validate from './validate_cobro_crud_form_pago_modal';
import {reduxForm} from "redux-form";


let PagoModal = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        fecha_minima,
    } = props;
    const min = moment(fecha_minima).tz('America/Bogota');
    const now = moment().tz('America/Bogota');
    return (<MyFormTagModal
        onCancel={onCancel}
        onSubmit={handleSubmit(onSubmit)}
        reset={reset}
        initialValues={initialValues}
        submitting={submitting}
        modal_open={modal_open}
        pristine={pristine}
        element_type={''}
    >
        <MyDateTimePickerField
            className='col-12  col-sm-6'
            label='Fecha de Pago'
            label_space_xs={4}
            name='fecha_cobro'
            min={min.toDate()}
            max={now.toDate()}
        />
        <MyTextFieldSimple
            className="col-12"
            nombre='Recibo'
            name='recibo_pago'
            case='U'/>
        <div style={{height: '300px'}}>

        </div>
    </MyFormTagModal>)
});
PagoModal = reduxForm({
    form: "pagoAnticipoForm",
    validate,
    enableReinitialize: true
})(PagoModal);

export default PagoModal;