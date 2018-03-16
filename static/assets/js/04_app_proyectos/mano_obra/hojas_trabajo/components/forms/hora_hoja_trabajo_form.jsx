import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCombobox,
    MyDateTimePickerField,
    MyTextFieldSimple,
    MyDropdownList
} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate_horas';
import proyectos_list from "../../../../../viejo_04_app/00_maestras/containers/proyectos/proyectos/proyectos_list";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            proyecto: null
        });
    }

    componentDidMount() {
        const {initialValues, proyectos_list} = this.props;
        if (initialValues) {
            const {proyecto} = initialValues;
            this.setState({proyecto: proyectos_list[proyecto]});
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
            proyectos_list,
            object
        } = this.props;
        const {proyecto} = this.state;

        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((e) => {
                    const cantidad_minutos = (Number(e.horas * 60) + Number(e.minutos));
                    onSubmit({...e, hoja: object.id, cantidad_minutos});
                })}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyCombobox
                    data={_.map(proyectos_list, e => e)}
                    className='col-12'
                    valuesField='id'
                    textField='id_proyecto'
                    autoFocus={true}
                    onSelect={(e) => {
                        this.setState({proyecto: e});
                    }}
                    name='proyecto'
                    onChange={v => v.id}
                    placeholder='Proyecto'
                    caseSensitive={false}
                    minLength={3}
                    filter='contains'
                />
                {
                    proyecto &&
                    proyecto.mis_literales &&
                    <MyCombobox
                        data={_.map(proyecto.mis_literales, e => {
                            return ({
                                id: e.id,
                                descripcion: `${e.id_literal} - ${e.descripcion}`
                            })
                        })}
                        className='col-12'
                        valuesField='id'
                        textField='descripcion'
                        autoFocus={true}
                        name='literal'
                        placeholder='Literales'
                        caseSensitive={false}
                        minLength={3}
                        filter='contains'
                    />
                }
                {
                    <div className='col-12'>
                        <div className="row">
                            <MyTextFieldSimple name='horas' nombre='Horas' className='col-6'/>
                            <MyTextFieldSimple name='minutos' nombre='Minutos' className='col-6'/>
                        </div>
                    </div>
                }
                <div style={{height: '300px'}}>

                </div>
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
    form: "hojaTrabajoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;