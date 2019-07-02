import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox, MyTextFieldSimple} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    render() {
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
            canales_list
        } = this.props;
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
                    className="col-12"
                    nombre='Forma Pago'
                    name='forma'
                    case='U'/>
                <MyCombobox
                    className="col-6"
                    name='canal'
                    busy={false}
                    autoFocus={false}
                    data={_.map(canales_list, e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Canal'
                />
                <MyTextFieldSimple
                    className="col-3"
                    nombre='Porcentaje'
                    name='porcentaje'
                    type='number'/>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "formaPagoCanalForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;