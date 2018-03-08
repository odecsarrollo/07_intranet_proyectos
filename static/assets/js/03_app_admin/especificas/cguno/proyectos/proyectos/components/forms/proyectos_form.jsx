import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCheckboxSimple} from '../../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
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
            permisos_object,
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
                element_type={singular_name}
            >
                <div className="m-2">
                    <div className="row">
                        {!initialValues || initialValues.mis_literales.length === 0 ?
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
                            permisos_object.costo_presupuestado &&
                            <MyTextFieldSimple
                                className="col-12"
                                nombre='Costo Presupuestado'
                                name='costo_presupuestado'/>
                        }
                        {
                            permisos_object.valor &&
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
    form: "proyectosForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;