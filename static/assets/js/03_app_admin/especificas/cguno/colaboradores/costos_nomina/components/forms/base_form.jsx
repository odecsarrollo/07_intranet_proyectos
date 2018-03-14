import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCheckboxSimple,
    MyCombobox
} from '../../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            centro_costo: null
        })
    }

    componentDidMount() {
        const {initialValues} = this.props;
        if (initialValues) {
            const {centro_costo} = initialValues;
            this.setState({centro_costo})
        }
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
            centros_costos_list,
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((e) => onSubmit({...e, centro_costo: this.state.centro_costo}))}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Nombres'
                    name='colaborador_nombres'
                    disabled={initialValues.colaborador_es_cguno}
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Apellidos'
                    name='colaborador_apellidos'
                    disabled={initialValues.colaborador_es_cguno}
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Costo'
                    name='costo'
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Nro. Horas'
                    name='nro_horas_mes'
                />
                <MyCheckboxSimple
                    className="col-12 col-md-6"
                    nombre='Salario Fijo'
                    name='es_salario_fijo'
                />
                <MyCheckboxSimple
                    className="col-12 col-md-6"
                    nombre='No Actualizar'
                    name='modificado'
                />
                <MyCombobox
                    name='centro_costo'
                    busy={false}
                    autoFocus={false}
                    onSelect={(e) => this.setState({centro_costo: e.id})}
                    onChange={() => console.log('cambio')}
                    data={_.map(centros_costos_list, e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    valuesField='id'
                    placeholder='Centro Costo'
                />
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
    form: "algoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;