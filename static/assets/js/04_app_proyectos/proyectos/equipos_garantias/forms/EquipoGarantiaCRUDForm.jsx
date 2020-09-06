import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyDateTimePickerField} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';


let EquipoGarantiaCRUDForm = memo(props => {
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
            <MyTextFieldSimple
                className="col-12"
                nombre='Descripción'
                name='descripcion'
                case='U'/>
            <MyDateTimePickerField
                className='col-12 mb-5'
                name='fecha_inicial'
                label='Fecha Inicial'
                label_space_xs={4}
                max={new Date(9999, 12, 1)}
                dropUp={false}
            />
            <MyDateTimePickerField
                className='col-12 mb-5'
                name='fecha_final'
                label='Fecha Final'
                label_space_xs={4}
                max={new Date(9999, 12, 1)}
                dropUp={false}
            />
            <div style={{height: '300px'}}>

            </div>
        </MyFormTagModal>
    )
});

EquipoGarantiaCRUDForm = reduxForm({
    form: "equipoGarantiaCRUDForm",
    validate: validate,
    enableReinitialize: true
})(EquipoGarantiaCRUDForm);

export default EquipoGarantiaCRUDForm;