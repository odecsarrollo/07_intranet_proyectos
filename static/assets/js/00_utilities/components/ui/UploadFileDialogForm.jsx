import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyFieldFileInput} from '../../../00_utilities/components/ui/forms/fields';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';


let UploadFileDialogForm = memo(props => {
    const onChangeFile = (f, v) => {
        const archivo = v[0];
        const nombre_archivo = archivo.name.split('.')[0];
        props.change('nombre_archivo', nombre_archivo.toUpperCase());
    };

    const {
        handleSubmit,
        onSubmit,
        onCancel,
        submitting,
        pristine,
        initialValues,
        is_open,
        type_element,
        accept
    } = props;
    return (
        <Dialog
            fullScreen={false}
            open={is_open}
        >
            <DialogTitle id="responsive-dialog-title">
                Subir {type_element}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <MyTextFieldSimple
                            className="col-11"
                            nombre='Nombre'
                            name='nombre_archivo'
                            case='U'/>
                        {
                            !initialValues &&
                            <MyFieldFileInput
                                accept={accept}
                                name="archivo"
                                className='col-12'
                                onChange={onChangeFile}
                            />
                        }
                    </div>
                    {props.children}
                    <Button
                        color="primary"
                        variant="contained"
                        type='submit'
                        disabled={submitting || pristine}
                    >
                        Guardar
                    </Button>
                    <Button
                        onClick={onCancel}
                        color="secondary"
                        variant="contained"
                    >
                        Cancelar
                    </Button>
                </form>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    )
});

UploadFileDialogForm = reduxForm({
    form: "uploadFileForm",
    //validate,
    enableReinitialize: true
})(UploadFileDialogForm);


export default UploadFileDialogForm;