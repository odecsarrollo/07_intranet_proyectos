import React, {memo, useState} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const NuevoItemModal = memo(props => {
    const {
        is_open,
        onCancel
    } = props;
    const [item, setItem] = useState({
        item: {
            cantidad: 0,
            valor_unitario: 0,
            descripcion: '',
            referencia: '',
        }
    });
    const adicionarItem = () => props.adicionarItem(item);

    const {cantidad = 0, valor_unitario = 0, descripcion, referencia} = item;
    return (
        <Dialog
            open={is_open}
        >
            <DialogTitle id="responsive-dialog-title">
                Add Item
            </DialogTitle>
            <DialogContent>
                <div className="row">
                    <div className="col-4">
                        <TextField
                            fullWidth={true}
                            label='Referencia'
                            margin="normal"
                            name='referencia'
                            value={referencia}
                            onChange={v => setItem({...item, [v.target.name]: v.target.value})}
                        />
                    </div>
                    <div className="col-12">
                        <TextField
                            fullWidth={true}
                            label='Descripción'
                            margin="normal"
                            name='descripcion'
                            multiline={true}
                            rows={4}
                            value={descripcion}
                            onChange={v => setItem({...item, [v.target.name]: v.target.value})}
                        />
                    </div>
                    <div className="col-2">
                        <TextField
                            fullWidth={true}
                            label='Cantidad'
                            margin="normal"
                            name='cantidad'
                            value={cantidad}
                            type='number'
                            onChange={v => setItem({...item, [v.target.name]: v.target.value})}
                        />
                    </div>
                    <div className="col-4">
                        <TextField
                            fullWidth={true}
                            label='Valor Unitario'
                            margin="normal"
                            name='valor_unitario'
                            value={valor_unitario}
                            type='number'
                            onChange={v => setItem({...item, [v.target.name]: v.target.value})}
                        />
                    </div>
                    <div className="col-12">
                        {valor_unitario * cantidad}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    className='ml-3'
                    disabled={valor_unitario <= 0 || cantidad <= 0 || descripcion === ''}
                    onClick={() => adicionarItem()}
                >
                    Adicionar
                </Button>

                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={() => onCancel()}
                >
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
});


NuevoItemModal.propTypes = {
    is_open: PropTypes.bool
};
export default NuevoItemModal;