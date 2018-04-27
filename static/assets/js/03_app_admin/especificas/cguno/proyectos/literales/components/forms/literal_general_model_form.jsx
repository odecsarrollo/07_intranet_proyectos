import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import BaseFormLiteral from './base_form';
import validate from './validate';
import {MyFormTagModal} from '../../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import {
    MyTextFieldSimple
} from '../../../../../../../00_utilities/components/ui/forms/fields';


class ModelForm extends Component {
    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            handleSubmit,
            onSubmit,
            onCancel,
            modal_open,
            object,
        } = this.props;
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
                        <div className='col-4 mt-4'><strong>{object.id_proyecto} - </strong></div>
                        <MyTextFieldSimple
                            className="col-4"
                            nombre='Literal'
                            name='id_literal_posfix'
                            case='U'/>
                    </div>
                    <BaseFormLiteral proyecto={object}/>
                    <div style={{height: '300px'}}>

                    </div>
                </div>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {object: {orden_compra_nro, orden_compra_fecha, fecha_entrega_pactada, cotizacion_nro}} = ownProps;
    return {
        initialValues: {orden_compra_nro, orden_compra_fecha, fecha_entrega_pactada, cotizacion_nro}
    }
}

ModelForm = reduxForm({
    form: "literalCreateForm",
    validate,
    enableReinitialize: true
})(ModelForm);

ModelForm = (connect(mapPropsToState, null)(ModelForm));

export default ModelForm;