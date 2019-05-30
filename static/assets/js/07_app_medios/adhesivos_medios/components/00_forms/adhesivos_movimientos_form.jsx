import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { MyTextFieldSimple, MyCombobox } from '../../../../00_utilities/components/ui/forms/fields';
import { connect } from "react-redux";
import { MyFormTagModal } from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

class Form extends Component {



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
            singular_name
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
                <div>
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
                        name='adhesivo'
                        busy={false}
                        autoFocus={false}
                        data={_.map(adhesivos, e => {
                            return {
                                'codigo': e.codigo,
                                'id': e.id
                            }
                        })}
                        textField='codigo'
                        filter='contains'
                        valuesField='id'
                        placeholder='Adhesivos'
                    />
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Cantidad'
                        name='cantidad'
                        type="number"
                        case='U'
                    />
                    <MyTextFieldSimple
                        className="col-6"
                        nombre='Responsable'
                        name='responsable'
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
    form: "adhesivosMovimientosForm",
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;