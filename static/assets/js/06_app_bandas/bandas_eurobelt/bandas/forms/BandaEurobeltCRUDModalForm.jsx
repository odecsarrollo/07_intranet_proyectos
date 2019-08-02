import React, {memo} from 'react';
import BandaEurobeltBaseForm from './BandaEurobeltBaseForm';
import MyDialogCreate from "../../../../00_utilities/components/ui/dialog/create_dialog";

let ModalForm = memo(props => {
    const {
        modal_open,
        onCancel,
        onSubmit
    } = props;
    return (
        <MyDialogCreate
            element_type='Crear Banda Eurobelt'
            is_open={modal_open}
            fullScreen={true}
        >
            <BandaEurobeltBaseForm
                onCancel={onCancel}
                mostrar_cancelar={true}
                onSubmit={onSubmit}
            />
        </MyDialogCreate>
    )
});

export default ModalForm;