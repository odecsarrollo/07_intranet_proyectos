import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import BotoneriaModalForm from '../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import validate from './validate';


class Form extends Component {
    render() {
        const {
            handleSubmit,
            onSubmit,
            onCancel,
            pristine,
            submitting,
            initialValues,
            reset,
        } = this.props;
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="col-12 p-3">
                    <h5>Adicionar Elemento</h5>
                    <MyTextFieldSimple
                        className="col-8 col-md-5"
                        nombre='Código'
                        name='codigo'
                        case='U'/>
                    <MyTextFieldSimple
                        className="col-4 col-md-3"
                        nombre='Código CGUno'
                        name='item_cguno_id'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12"
                        nombre='Descripción'
                        name='descripcion'
                        case='U'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Material'
                        name='material'
                        case='U'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Medida Material'
                        name='cantidad_material'
                        case='U'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-2"
                        nombre='Cant.'
                        name='cantidad'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-5"
                        nombre='Proceso'
                        name='proceso'
                        case='U'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-5"
                        nombre='Acabado'
                        name='acabado'
                        case='U'/>
                    <BotoneriaModalForm
                        onCancel={onCancel}
                        pristine={pristine}
                        reset={reset}
                        submitting={submitting}
                        initialValues={initialValues}
                    />
                </div>
            </form>
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
    form: "addItemListadoMaterialesForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;