import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import validate from './validate';
import FormBaseCotizacion from '../forms/base_cotizacion_form';
import BotoneriaModalForm from '../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import {MyCombobox, MyDropdownList} from '../../../../../00_utilities/components/ui/forms/fields';

class Form extends Component {
    componentDidMount() {
        const {noCargando, cargando, notificarErrorAjaxAction, item_seleccionado} = this.props;
        cargando();
        const cargarResponsable = () => {
            if (item_seleccionado.responsable) {
                this.props.fetchUsuario(item_seleccionado.responsable, () => noCargando(), notificarErrorAjaxAction)
            } else {
                noCargando();
            }
        };
        this.props.fetchUsuariosxPermiso('gestionar_cotizacion', cargarResponsable, notificarErrorAjaxAction);
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            handleSubmit,
            onCancel,
            usuarios_list
        } = this.props;
        return (
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <div className="row pl-3 pr-5">
                    <FormBaseCotizacion item={initialValues}/>
                    <MyCombobox
                        data={_.map(usuarios_list, u => {
                            return (
                                {
                                    name: `${u.first_name} ${u.last_name}`,
                                    id: u.id
                                }
                            )
                        })}
                        name='responsable'
                        textField='name'
                        valuesField='id'
                        className='col-12'
                    />
                </div>
                <BotoneriaModalForm
                    onCancel={onCancel}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
            </form>
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
    form: "cotizacionEditForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;