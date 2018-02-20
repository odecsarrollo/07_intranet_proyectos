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
            cantidad_literales,
            can_see_costo_presupuestado,
            can_see_precio
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
                element_type='Proyecto'
            >
                <div className="m-2">
                    <div className="row">
                        {cantidad_literales === 0 || !initialValues ?
                            <MyTextFieldSimple
                                className="col-12"
                                nombre='OP Proyecto'
                                name='id_proyecto'
                                case='U'/> :
                            <div className="col-12">
                                <span>{initialValues.id_proyecto}</span>
                            </div>
                        }
                        {
                            can_see_costo_presupuestado &&
                            <MyTextFieldSimple
                                className="col-12"
                                nombre='Costo Presupuestado'
                                name='costo_presupuestado'/>
                        }
                        {
                            can_see_precio &&
                            <MyTextFieldSimple
                                className="col-12"
                                nombre='Precio'
                                name='valor_cliente'
                                case='U'/>

                        }
                        <MyCheckboxSimple
                            className="col-12"
                            nombre='Abierto'
                            name='abierto'/>
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
    form: "proyectoForm",
    onSubmitSuccess: afterSubmit,
    validate,
    asyncValidate,
    asyncBlurFields: ['username'],
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;