import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox} from '../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../00_utilities/components/ui/forms/MyFormTagModal';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";


let FacturaCRUDForm = memo(props => {
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
    } = props;
    console.log(initialValues)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchColaboradoresnVendedores());
        return () => dispatch(actions.clearColaboradoresn());
    }, []);
    const colaboradores = useSelector(state => state.colaboradoresn);
    return (
        <MyFormTagModal
            fullWidth={true}
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <MyCombobox
                className="col-12"
                name='colaborador'
                label={'Vendedor Real'}
                label_space_xs={4}
                busy={false}
                autoFocus={false}
                data={_.map(colaboradores, c => ({
                    'name': c.to_string,
                    'id': c.id
                }))}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Vendedor'
            />
            <div style={{height: '300px'}}>

            </div>
        </MyFormTagModal>
    )
});

FacturaCRUDForm = reduxForm({
    form: "facturaForm",
    validate: validate,
    enableReinitialize: true
})(FacturaCRUDForm);

export default FacturaCRUDForm;