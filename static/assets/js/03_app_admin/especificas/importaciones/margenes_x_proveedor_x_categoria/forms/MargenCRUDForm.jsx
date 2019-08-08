import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
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
            categoria_list,
            proveedor_list
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
                <MyCombobox
                    className="col-6"
                    name='proveedor'
                    busy={false}
                    autoFocus={false}
                    data={_.map(proveedor_list, e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Proveedor'
                />
                <MyCombobox
                    className="col-6"
                    name='categoria'
                    busy={false}
                    autoFocus={false}
                    data={_.map(categoria_list, e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Categoría'
                />
                <MyTextFieldSimple
                    className="col-3"
                    nombre='Margen Deseado'
                    name='margen_deseado'
                    type='number'/>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "margenesForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;