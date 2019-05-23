import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { MyTextFieldSimple, MyFieldFileInput, MyFieldInputColor } from '../../../../00_utilities/components/ui/forms/fields';
import { connect } from "react-redux";
import { MyFormTagModal } from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';

class Form extends Component {
    constructor(props) {
        super(props);
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    onChangeFile(f, v) {
        const archivo = v[0];
        const nombre_archivo = archivo.name.split('.')[0];
        //this.props.change('nombre_archivo', nombre_archivo.toUpperCase());
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
            singular_name,
            tipos_list,
            materiales_list,
            colores_list,
            series_list,
            categorias_list
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
                        case='U'
                    />
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Alto'
                        name='alto'
                        case='U'
                    />
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Ancho'
                        name='ancho'
                        case='U'
                    />
                </div>
                <div style={{width: '100%' }}>
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Descripcion'
                        name='descripcion'
                        multiline
                        rows="4"
                        case='U'
                    />
                </div>
                <div style={{ paddingTop: '30px', paddingBottom: '30px' }}>
                    <MyFieldFileInput
                        name="imagen"
                        onChange={this.onChangeFile}
                    />
                </div>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "etiquetaForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;