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
    }

    onChangeFile(f, v) {
        const archivo = v[0];
        const nombre_archivo = archivo.name.split('.')[0];
        console.log(archivo);
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
            singular_name
        } = this.props;
        console.log(initialValues)
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
                <div style={{ paddingTop: '30px', paddingBottom: '30px' }}>
                    {    
                        initialValues  &&
                        <MyFieldFileInput
                            name="imagen"
                            onChange={this.onChangeFile}
                        />
                    }
                </div>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const { item_seleccionado } = ownProps;
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