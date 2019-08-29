import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

let CotizacionRechazadaFormDialog = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name
    } = props;
    return (
        <MyFormTagModal
            submit_text_boton='Explicar Razón'
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <div style={{width:'500px'}}>
                <MyTextFieldSimple
                    className='col-12'
                    name='razon_rechazada'
                    nombre='Razón Rechazo'
                    multiline
                    rows={4}
                />
            </div>
        </MyFormTagModal>
    )
});

CotizacionRechazadaFormDialog = reduxForm({
    form: "cotizacionRechazadaForm",
    validate,
    enableReinitialize: true
})(CotizacionRechazadaFormDialog);

export default CotizacionRechazadaFormDialog;