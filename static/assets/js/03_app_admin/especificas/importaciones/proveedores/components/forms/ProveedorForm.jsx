import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyCombobox} from '../../../../../../00_utilities/components/ui/forms/fields';
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
            monedas_list
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
                    nombre='Nombre'
                    name='nombre'
                    case='U'/>
                <MyCombobox
                    className="col-6"
                    name='moneda'
                    busy={false}
                    autoFocus={false}
                    data={_.map(monedas_list, e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Moneda'
                />
                <MyTextFieldSimple
                    className="col-3"
                    nombre='Factor de Importación'
                    name='factor_importacion'
                    type='number'/>
                <MyTextFieldSimple
                    className="col-3"
                    nombre='Factor de Importación Aéreo'
                    name='factor_importacion_aereo'
                    type='number'/>
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
    form: "proveedoresForm",
    validate,
    enableReinitialize: true
})(Form);

export default (connect(mapPropsToState, null)(Form));