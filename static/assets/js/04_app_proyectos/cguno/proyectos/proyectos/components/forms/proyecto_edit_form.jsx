import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import BotoneriaModalForm from '../../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import BaseFormProyecto from './base_form';
import validate from './validate';

class Form extends Component {
    componentDidMount() {
        this.props.fetchClientes();
    }

    componentWillUnmount() {
        this.props.clearClientes();
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onDelete,
            handleSubmit,
            onSubmit,
            onCancel,
            permisos_object,
            clientes_list,
        } = this.props;
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <BaseFormProyecto clientes_list={clientes_list} initialValues={initialValues} permisos_object={permisos_object}/>
                <BotoneriaModalForm
                    onCancel={onCancel}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                    conCerrar={false}
                />
            </form>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {proyecto} = ownProps;
    return {
        initialValues: proyecto
    }
}

Form = reduxForm({
    form: "proyectoEditForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;