import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

const BuquedaTextoPorMetodo = (props) => {
    const [parametro_busqueda, setParametroBusqueda] = useState('');
    const {placeholder, onBuscar} = props;
    return <div className='row'>
        <div className="col-12 col-md-4">
            <TextField
                placeholder={placeholder}
                fullWidth={true}
                margin="normal"
                value={parametro_busqueda}
                onChange={(e) => setParametroBusqueda(e.target.value)}
            />
        </div>
        <div className="col-12 col-md-3">
            <Button
                color='primary'
                variant="contained"
                disabled={parametro_busqueda === ''}
                onClick={() => onBuscar(parametro_busqueda)}
            >Buscar</Button>
        </div>
    </div>

};
BuquedaTextoPorMetodo.propTypes = {
    placeholder: PropTypes.string.isRequired,
    onBuscar: PropTypes.func.isRequired,
};
export default BuquedaTextoPorMetodo;