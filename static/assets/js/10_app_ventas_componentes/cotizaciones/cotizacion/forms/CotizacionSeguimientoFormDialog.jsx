import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyDateTimePickerField} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

let CotizacionSeguimientoFormDialog = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        tipo_seguimiento,
        cotizacion_componente
    } = props;

    const getIcono = () => {
        if (tipo_seguimiento === 'TEL') {
            return 'phone'
        }
        if (tipo_seguimiento === 'ENV') {
            return 'inbox-out'
        }
        if (tipo_seguimiento === 'VIS') {
            return 'suitcase-rolling'
        }
        if (tipo_seguimiento === 'COM') {
            return 'comments'
        }
        if (tipo_seguimiento === 'EST') {
            return 'exchange-alt'
        }
        return 'thumbs-up'
    };

    const getTipoSeguimientoTextoModal = () => {
        if (tipo_seguimiento === 'TEL') {
            return 'LLAMADA'
        }
        if (tipo_seguimiento === 'VIS') {
            return 'VISITA'
        }
        if (tipo_seguimiento === 'COM') {
            return 'COMENTARIO'
        }
        return 'thumbs-up'
    };

    return (
        <MyFormTagModal
            submit_text_boton={`Crear seguimiento ${getTipoSeguimientoTextoModal()}`}
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type=''
        >
            <div className="col-12">
                <div className="row">
                    {tipo_seguimiento !== 'COM' &&
                    <MyDateTimePickerField
                        time={true}
                        className='col-8'
                        label='Fecha'
                        label_space_xs={4}
                        name='fecha'
                        min={new Date(cotizacion_componente.created)}
                        max={new Date()}
                    />}
                    <div className="col-2">
                        <FontAwesomeIcon
                            icon={getIcono()}
                            size='4x'
                        />
                    </div>
                </div>
            </div>

            <div style={{width: '500px'}}>
                <MyTextFieldSimple
                    className='col-12'
                    name='descripcion'
                    nombre='Descripción'
                    multiline
                    rows={7}
                />
            </div>
        </MyFormTagModal>
    )
});

CotizacionSeguimientoFormDialog = reduxForm({
    form: "cotizacionSeguimientoForm",
    validate,
    enableReinitialize: true
})(CotizacionSeguimientoFormDialog);

export default CotizacionSeguimientoFormDialog;