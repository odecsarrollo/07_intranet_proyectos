import React, {Component} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';
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
            paises_list,
            departamentos_list,
            form_values
        } = this.props;
        const departamentos_list_por_pais = form_values && form_values.pais ? _.pickBy(departamentos_list, e => e.pais === form_values.pais) : null;
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
                    className="col-12"
                    name='pais'
                    busy={false}
                    autoFocus={false}
                    data={_.map(paises_list, e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Paises'
                />
                {
                    departamentos_list_por_pais &&
                    _.size(departamentos_list_por_pais) > 0 &&
                    <MyCombobox
                        className="col-12"
                        name='departamento'
                        busy={false}
                        autoFocus={false}
                        data={_.map(departamentos_list_por_pais, e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Departamentos'
                    />
                }
            </MyFormTagModal>
        )
    }
}

const
    selector = formValueSelector('ciudadesForm');

function

mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    const form_values = selector(state, 'pais', 'departamento');
    return {
        initialValues: item_seleccionado,
        form_values
    }
}

Form = reduxForm({
    form: "ciudadesForm",
    validate,
    enableReinitialize: true
})(Form);

export default (connect(mapPropsToState, null)(Form));