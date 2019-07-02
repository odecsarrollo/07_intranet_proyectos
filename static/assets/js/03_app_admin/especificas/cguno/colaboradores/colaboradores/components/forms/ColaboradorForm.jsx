import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MySelectField,
    MyCheckboxSimple
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
            modal_open,
            singular_name,
            centros_costos_list,
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                fullScreen={true}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
                f
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

                {
                    (initialValues && initialValues.es_cguno && initialValues.centro_costo_nombre) ?
                        <div className='col-12 mt-2 mb-2'><strong>Centro de
                            Costos: </strong>{initialValues.centro_costo_nombre}
                        </div> :
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
                }

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

                <MyCheckboxSimple
                    onClick={(e) => this.setState({salario_fijo: e.target.checked})}
                    className="col-12 col-md-6"
                    nombre='Es Aprendiz'
                    name='es_aprendiz'/>

                <MyTextFieldSimple
                    className="col-12"
                    nombre='Nro. Horas Mes'
                    name='nro_horas_mes'/>

                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='% Caj. Com'
                    name='porcentaje_caja_compensacion'
                    case='U'/>

                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='% Pens.'
                    name='porcentaje_pension'
                    case='U'/>

                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='% ARL'
                    name='porcentaje_arl'
                    case='U'/>

                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='% Salud'
                    name='porcentaje_salud'
                />

                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='% Prest. Sociales'
                    name='porcentaje_prestaciones_sociales'
                />

                {
                    initialValues && !initialValues.es_cguno &&
                    <Fragment>
                        <MyTextFieldSimple
                            className="col-12 col-md-6"
                            nombre='Base Salario'
                            name='base_salario'
                        />
                        <MyTextFieldSimple
                            className="col-12 col-md-6"
                            nombre='Auxilio Transporte'
                            name='auxilio_transporte'
                        />
                    </Fragment>
                }
            </MyFormTagModal>
        )
    }
}


Form = reduxForm({
    form: "colaboradorForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;