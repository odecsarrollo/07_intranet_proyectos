import React from 'react';
import PropTypes from "prop-types";
import MyDialogCreate from '../../../../00_utilities/components/ui/dialog/create_dialog';
import BotoneriaModalForm from '../../../../00_utilities/components/ui/forms/botoneria_modal_form';

export const MyFormTagModal = (props) => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        modal_open,
        element_type,
        fullScreen = false,
        fullWidth = false,
        modelStyle,
        mostrar_submit = true,
        mostrar_limpiar = true,
        mostrar_cancelar = true,
        submit_text_boton = null,
    } = props;
    return (
        <MyDialogCreate
            element_type={`${submit_text_boton ? submit_text_boton : initialValues ? 'Editar ' : 'Crear '} ${element_type}`}
            is_open={modal_open}
            fullWidth={fullWidth}
            fullScreen={fullScreen}
            modelStyle={modelStyle}
        >
            <form onSubmit={onSubmit}>
                <div className="row pl-3 pr-5">
                    {props.children}
                </div>
                <div className='p-3'>
                    <BotoneriaModalForm
                        submit_text_boton={submit_text_boton}
                        mostrar_submit={mostrar_submit}
                        mostrar_limpiar={mostrar_limpiar}
                        mostrar_cancelar={mostrar_cancelar}
                        onCancel={onCancel}
                        pristine={pristine}
                        reset={reset}
                        submitting={submitting}
                        initialValues={initialValues}
                    />
                </div>
            </form>
        </MyDialogCreate>
    )
};
MyFormTagModal.propTypes = {
    element_type: PropTypes.string,
    onSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    onCancel: PropTypes.func,
    modal_open: PropTypes.bool,
    reset: PropTypes.func,
    initialValues: PropTypes.any,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
};

export default MyFormTagModal;