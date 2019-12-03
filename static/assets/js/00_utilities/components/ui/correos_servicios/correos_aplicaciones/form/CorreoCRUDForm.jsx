import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import {formValueSelector} from 'redux-form'
import {useSelector} from "react-redux/es/hooks/useSelector";

const selector = formValueSelector('correoAplicacionForm');

let CorreoCRUDForm = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name,
    } = props;
    const form_values = useSelector(state => selector(state, 'tipo', ''));
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <MyCombobox
                label_space_xs={3}
                className='col-12 col-md-6'
                name='tipo'
                label='Tipo'
                busy={false}
                autoFocus={false}
                data={[
                    {name: 'From', id: 'FROM'},
                    {name: 'To', id: 'TO'},
                    {name: 'Cc', id: 'CC'},
                    {name: 'Bcc', id: 'BCC'},
                ]}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Seleccionar Tipo...'
            />
            <MyTextFieldSimple
                className="col-12"
                nombre='Email'
                name='email'
                case='U'/>
            {form_values.tipo === 'FROM' && <MyTextFieldSimple
                className="col-12"
                nombre='Alias'
                name='alias_from'
                case='U'/>}
        </MyFormTagModal>
    )
});

CorreoCRUDForm = reduxForm({
    form: "correoAplicacionForm",
    enableReinitialize: true
})(CorreoCRUDForm);

export default CorreoCRUDForm;