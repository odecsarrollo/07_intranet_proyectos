import React, { Component } from 'react';
import { reduxForm } from 'redux-form';


import { MyTextFieldSimple, MyFieldFileInput } from '../../../../00_utilities/components/ui/forms/fields';
import { connect } from "react-redux";
import { MyFormTagModal } from '../../../../00_utilities/components/ui/forms/MyFormTagModal';


import validate from './validate';

class Form extends Component {
    constructor(props) {
        super(props);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.submitObject = this.submitObject.bind(this);
    }

    onChangeFile(f, v) {
        //on Change null
    }

    submitObject(item) {
        const datos_formulario = _.omit(item, 'imagen');
        let datos_a_subir = new FormData();
        _.mapKeys(datos_formulario, (item, key) => {
            datos_a_subir.append(key, item);
        });
        if (item.imagen) {
            if (typeof item.imagen !== 'string') {
                datos_a_subir.append('imagen', item.imagen[0]);
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
                <div style={{ width: '100%' }}>
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Descripcion'
                        name='descripcion'
                        multiline
                        rows="4"
                        case='U'
                    />
                </div>
                <div style={{ width: '100%', textAlign: 'center', paddingTop: '20px' }}>
                    {initialValues && initialValues.imagen && <img src={initialValues.imagen}></img>}
                </div>
                <div style={{ paddingTop: '30px', paddingBottom: '30px' }}>
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

Form = reduxForm({
    form: "adhesivosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;