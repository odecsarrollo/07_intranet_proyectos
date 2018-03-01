import React, {Component, Fragment} from 'react';
import {reduxForm, reset} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCheckboxSimple,
    MySelectField
} from '../../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            salario_fijo: false
        });
    }

    componentDidMount() {
        const {initialValues} = this.props;
        if (initialValues) {
            this.setState({salario_fijo: initialValues.es_salario_fijo})
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
            centros_costos_list,
            modal_open,
            element_type,
        } = this.props;
        const {salario_fijo} = this.state;

        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={element_type}
            >
                <div className="col-12">
                    <div className="row">
                        <MyTextFieldSimple
                            className="col-12 col-md-6"
                            nombre='Cédula'
                            name='cedula'
                            disabled={initialValues && initialValues.es_cguno}
                            case='U'/>
                        <div className="col-12 col-md-6">
                            <div className='pt-3 text-center'>
                                <strong>Usuario: </strong>{initialValues && initialValues.usuario_username}
                            </div>
                        </div>
                    </div>
                </div>
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Nombres'
                    name='nombres'
                    disabled={initialValues && initialValues.es_cguno}
                    case='U'/>

                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Apellidos'
                    name='apellidos'
                    disabled={initialValues && initialValues.es_cguno}
                    case='U'/>

                <MySelectField
                    name='centro_costo'
                    nombre='Centro Costos'
                    className='col-12'
                    options={_.map(centros_costos_list, c => {
                        return (
                            {value: c.id, primaryText: c.nombre}
                        )
                    })}
                />

                <MyCheckboxSimple
                    className="col-12 col-md-6"
                    nombre='Autogestiona Horas'
                    name='autogestion_horas_trabajadas'/>

                <MyCheckboxSimple
                    className="col-12 col-md-6"
                    nombre='En Proyectos'
                    name='en_proyectos'/>

                <MyCheckboxSimple
                    onClick={(e) => this.setState({salario_fijo: e.target.checked})}
                    className="col-12 col-md-6"
                    nombre='Tiene Salario Fijo'
                    name='es_salario_fijo'/>
                {
                    salario_fijo &&
                    <MyTextFieldSimple
                        className="col-12 col-md-6"
                        nombre='Nro. Horas Mes'
                        name='nro_horas_mes'/>
                }
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
    form: "colaboradorForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;