import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';

let Form = memo(props => {
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
            onCancel={onCancel}
            fullScreen={false}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <MyTextFieldSimple
                className="col-12 col-md-9"
                nombre='Nombre'
                name='nombre'
                case='U'/>
            <MyTextFieldSimple
                className="col-12  col-md-3"
                nombre='Nomenclatura'
                name='nomenclatura'
                case='U'/>
        </MyFormTagModal>
    )
});


Form = reduxForm({
    form: "materialBandasEurobelForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;