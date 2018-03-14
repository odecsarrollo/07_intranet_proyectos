import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCombobox,
    MyDateTimePickerField
} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            colaborador: null
        });
    }

    componentDidMount() {
        const {initialValues} = this.props;
        if (initialValues) {
            const {colaborador} = initialValues;
            this.setState({colaborador});
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
            colaboradores_list,
        } = this.props;
        const {colaborador} = this.state;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((v) => onSubmit({...v, colaborador}))}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyCombobox
                    data={_.map(colaboradores_list, e => {
                        return (
                            {
                                id: e.id,
                                nombre: `${e.nombres} ${e.apellidos}`
                            }
                        )
                    })}
                    valuesField='id'
                    textField='nombre'
                    autoFocus={true}
                    onSelect={(e) => this.setState({colaborador: e.id})}
                    name='colaborador'
                    placeholder='Colaborador'
                    filters='contains'
                />
                <MyDateTimePickerField
                    className='col-12 mb-5'
                    name='fecha'
                    nombre='Fecha'
                    dropUp={false}
                />
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