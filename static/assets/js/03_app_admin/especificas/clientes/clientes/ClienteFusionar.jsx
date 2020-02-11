import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ClienteFusionarForm from './ClienteFusionarForm';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    boton_fusionar: {
        cursor: 'pointer'
    }
}));

const FusionarCliente = (props) => {
    const {list} = props;
    const classes = useStyles();
    const [mostrar_fusionar, setMostrarFusionar] = useState(false);
    return (
        <div>
            <FontAwesomeIcon
                icon='address-book'
                className={classes.boton_fusionar}
                size='lg'
                onClick={() => setMostrarFusionar(true)}
            /> Fusionar Clientes
            {mostrar_fusionar && <ClienteFusionarForm
                modal_open={mostrar_fusionar}
                list={list}
                onCancel={() => setMostrarFusionar(false)}
            />}
        </div>
    )
};

export default FusionarCliente;