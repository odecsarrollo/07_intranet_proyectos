import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import {MyTextFieldSimple, MyCombobox} from '../../../00_utilities/components/ui/forms/fields';
import { connect } from "react-redux";
import { MyFormTagModal } from '../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate_computador';

class Form extends Component {
    constructor(props) {
        super(props);
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

        const marcas = [
            {id:1, value:'SONY'},
            {id:2, value:'TOSHIBA'},
            {id:3, value:'LENOVO'},
            {id:4, value:'ASUS'},
            {id:5, value:'DELL'},
            {id:6, value:'MAC'}
            ];
        const procesadores = [
            {id:1, value:'CORE I3'},
            {id:2, value:'CORE I5'},
            {id:3, value:'CORE I7'},
            {id:4, value:'AMD'}
        ];
        const tipos = [
            {id:1, value:'ESCRITORIO'},
            {id:2, value:'PORTATIL'},
        ];
        const estados = [
            {id:1, value:'EN PRODUCCIÓN'},
            {id:2, value:'FUERA DE PRODUCCIÓN'},
        ];
        return (
            <MyFormTagModal
                onCancel={onCancel}
                fullScreen={false}
                onSubmit={handleSubmit}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <div className='col-12'>
                    <MyTextFieldSimple
                        className="col-12"
                        nombre='Nombre Computador'
                        name='nombre'
                        case='U'
                    />
                    <MyCombobox
                        className='col-12'
                        data={marcas}
                        valuesField='id'
                        textField='value'
                        autoFocus={true}
                        name='marca'
                        placeholder='Marca'
                        filter='contains'
                    />
                    <MyTextFieldSimple
                        className="col-12"
                        nombre='Referencia'
                        name='referencia'
                        case='U'
                    />
                    <MyTextFieldSimple
                        className="col-12"
                        nombre='Serial'
                        name='serial'
                        case='U'
                    />
                    <MyCombobox
                        className="col-12"
                        data={procesadores}
                        valuesField='id'
                        textField='value'
                        autoFocus={true}
                        name='procesador'
                        placeholder='Procesador'
                        filter='contains'
                    />
                    <MyCombobox
                        className="col-12"
                        data={tipos}
                        valuesField='id'
                        textField='value'
                        autoFocus={true}
                        name='tipo'
                        placeholder='Tipo'
                        filter='contains'
                    />
                    <MyCombobox
                        className="col-12"
                        data={estados}
                        valuesField='id'
                        textField='value'
                        autoFocus={true}
                        name='estado'
                        placeholder='Estado'
                        filter='contains'
                    />

                    <MyTextFieldSimple
                        className="col-12"
                        nombre='Descripcion'
                        name='descripcion'
                        multiline
                        rows="4"
                        case='U'
                    />
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
    form: "computadoresForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;