import React, {memo, useState, Fragment} from "react";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

const CotizacionDetailAddItemNoListaPrecio = memo(props => {
    const {adicionarItem} = props;
    const [item_descripcion, setDescripcion] = useState('');
    const [item_referencia, setReferencia] = useState('');
    const [item_unidad_medida, setUnidadMedida] = useState('');
    const [precio_unitario, setPrecioUnitario] = useState('');
    const clearFormulario = () => {
        setDescripcion('');
        setReferencia('');
        setUnidadMedida('');
        setPrecioUnitario('');
    };
    return (
        <div className="row">
            <div className="col-12">
                <TextField
                    fullWidth={true}
                    label='Descripción'
                    value={item_descripcion}
                    onChange={e => setDescripcion(e.target.value.toUpperCase())}
                />
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-4">
                        <TextField
                            fullWidth={true}
                            label='Referencia'
                            value={item_referencia}
                            onChange={e => setReferencia(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div className="col-4">
                        <TextField
                            fullWidth={true}
                            label='Unidad de Medida'
                            value={item_unidad_medida}
                            onChange={e => setUnidadMedida(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div className="col-4">
                        <TextField
                            fullWidth={true}
                            label='Precio Unitario'
                            value={precio_unitario}
                            onChange={e => setPrecioUnitario(e.target.value)}
                            type='number'
                        />
                    </div>
                </div>
            </div>
            {
                precio_unitario !== '' &&
                item_unidad_medida !== '' &&
                item_referencia !== '' &&
                item_descripcion !== '' &&
                <Fragment>
                    <Button
                        color="primary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => adicionarItem(
                            'Otro',
                            precio_unitario,
                            item_descripcion,
                            item_referencia,
                            item_unidad_medida,
                            clearFormulario
                        )}
                    >
                        Adicionar
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        onClick={clearFormulario}
                    >
                        Limpiar
                    </Button>
                </Fragment>
            }
        </div>
    )
});

export default CotizacionDetailAddItemNoListaPrecio;