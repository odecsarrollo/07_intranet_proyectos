import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import BaseFormLiteral from './base_form';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import {
    MyTextFieldSimple
} from '../../../../00_utilities/components/ui/forms/fields';


let ModalForm = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        handleSubmit,
        onSubmit,
        onCancel,
        modal_open,
        proyecto,
    } = props;
    let {initialValues} = props;
    if (initialValues) {
        const {descripcion, cotizacion} = item_seleccionado;
        initialValues = {
            descripcion,
            cotizacion
        }
    }
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type='literal'
        >
            <div className="m-2">
                <div className="row">
                    <div className='col-4 mt-4'><strong>{proyecto.id_proyecto} - </strong></div>
                    <MyTextFieldSimple
                        className="col-4"
                        nombre='Literal'
                        name='id_literal_posfix'
                        case='U'/>
                </div>
                <BaseFormLiteral proyecto={proyecto}/>
            </div>
        </MyFormTagModal>
    )
});

ModalForm = reduxForm({
    form: "literalModalForm",
    validate,
    enableReinitialize: true
})(ModalForm);

export default ModalForm;