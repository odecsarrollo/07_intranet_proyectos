import React, {Component, Fragment} from 'react';
import {reduxForm, reset} from 'redux-form';
import {MyTextFieldSimple, MyCheckboxSimple} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import asyncValidate from './asyncValidate';

const afterSubmit = (result, dispatch) => {
    dispatch(reset('usuarioForm'));
};

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
            handleClose,
            modal_open,
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={() => {
                    onCancel();
                    reset()
                }}
                onSubmit={handleSubmit(onSubmit)}
                handleClose={handleClose}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type='Usuario'
            >
                <div className="m-2">
                    <div className="row">
                        <MyTextFieldSimple
                            className="col-12"
                            nombre='Cédula'
                            name='cedula'
                            case='U'/>

                        <MyTextFieldSimple
                            className="col-12"
                            nombre='Nombres'
                            name='nombres'
                            case='U'/>

                        <MyTextFieldSimple
                            className="col-12"
                            nombre='Apellidos'
                            name='apellidos'
                            case='U'/>

                        <MyCheckboxSimple
                            className="col-12"
                            nombre='Autogestiona Horas'
                            name='autogestion_horas_trabajadas'/>

                        <MyCheckboxSimple
                            className="col-md-12"
                            nombre='En Proyectos'
                            name='en_proyectos'/>
                    </div>
                </div>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}


Form = reduxForm({
    form: "usuarioForm",
    onSubmitSuccess: afterSubmit,
    validate,
    asyncValidate,
    asyncBlurFields: ['username'],
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;