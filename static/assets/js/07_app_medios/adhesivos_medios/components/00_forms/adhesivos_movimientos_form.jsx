import React, { Component } from 'react';
import { reduxForm, formValueSelector  } from 'redux-form';
import { MyTextFieldSimple, MyCombobox } from '../../../../00_utilities/components/ui/forms/fields';
import { connect } from "react-redux";
import { MyFormTagModal } from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

import validate from './validate_movimiento_adhesivo';

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
            adhesivos,
            handleSubmit,
            modal_open,
            singular_name,
            tipo
        } = this.props;
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
                <div className="col-12">
                    <MyCombobox
                        data={[{ id: 'E', tipo: 'Entrada' }, { id: 'S', tipo: 'Salida' }]}
                        valuesField='id'
                        textField='tipo'
                        autoFocus={true}
                        name='tipo'
                        placeholder='Tipo de Movimiento'
                        filter='contains'
                    />
                    <MyCombobox
                        data={_.map(adhesivos, e => {
                            return {
                                'codigo': `${e.codigo} - ${e.descripcion} - ${e.disponible} Disponibles`,
                                'id': e.id
                            }
                        })}
                        name='adhesivo'
                        autoFocus={true}
                        textField='codigo'
                        filter='contains'
                        valuesField='id'
                        placeholder='Seleccione el Adhesivos'
                    />
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Cantidad'
                        name='cantidad'
                        type="number"
                    />
                    { tipo == 'S' &&
                        <MyTextFieldSimple
                        className="col-6"
                        nombre='Responsable'
                        name='responsable'
                        type = 'text'
                    />
                    }
                        <MyTextFieldSimple
                        className="col-12"
                        nombre='Descripcion'
                        name='descripcion'
                        multiline
                        rows="4"
                    />
                </div>
            </MyFormTagModal>
        )
    }
}

const selector = formValueSelector('adhesivosMovimientosForm')
function mapPropsToState(state, ownProps) {
    const { item_seleccionado } = ownProps;
    const  tipo = selector(state, 'tipo')
    return {
        initialValues: item_seleccionado,
        tipo
    }
}

Form = reduxForm({
    form: "adhesivosMovimientosForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;