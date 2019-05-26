<<<<<<< HEAD
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';


import { MyTextFieldSimple, MyFieldFileInput } from '../../../../00_utilities/components/ui/forms/fields';
import { connect } from "react-redux";
import { MyFormTagModal } from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
=======
import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyFieldFileInput} from '../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
>>>>>>> 365d54bba5b2c36a56d65d27ffd19658589a8241
import validate from './validate';

class Form extends Component {
    constructor(props) {
        super(props);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.submitObject = this.submitObject.bind(this);
    }

    onChangeFile(f, v) {
        const archivo = v[0];
    }

    submitObject(v){
        const datos_formulario = _.omit(v, 'imagen');
        let datos_a_subir = new FormData();
        _.mapKeys(datos_formulario, (v, k) => {
            datos_a_subir.append(k, v);
        });
        if (v.imagen) {
            if (typeof v.imagen !== 'string') {
                datos_a_subir.append('imagen', v.imagen[0]);
            }
        }
        return datos_a_subir;
    }

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
            singular_name
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                fullScreen={false}
                onSubmit={handleSubmit(item => 
                    onSubmit(this.submitObject(item))
                )}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <div>
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Codigo'
                        name='codigo'
                        case='U'
                    />
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Stock Minimo'
                        name='stock_min'
                        type="number"
                        case='U'
                    />
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Alto'
                        name='alto'
                        type="number"
                        case='U'
                    />
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Ancho'
                        name='ancho'
                        type="number"
                        case='U'
                    />
                </div>
                <div style={{width: '100%'}}>
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Descripcion'
                        name='descripcion'
                        multiline
                        rows="4"
                        case='U'
                    />
                </div>
                <div style={{paddingTop: '30px', paddingBottom: '30px'}}>
                    <MyFieldFileInput
                        name="imagen"
                        accept="image/png, image/jpeg"
                        onChange={this.onChangeFile} 
                    />
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
    form: "etiquetaForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;