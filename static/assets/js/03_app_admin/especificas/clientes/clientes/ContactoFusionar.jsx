import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ContactoFusionarForm from './ContactoFusionarForm';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    boton_fusionar: {
        cursor: 'pointer'
    }
}));

const FusionarContacto = (props) => {
    const {contactos, cargarContactos} = props;
    const classes = useStyles();
    const [mostrar_fusionar, setMostrarFusionar] = useState(false);
    return (
        <div>
            <FontAwesomeIcon
                icon='address-book'
                className={classes.boton_fusionar}
                size='lg'
                onClick={() => setMostrarFusionar(true)}
            /> Fusionar Contactos
            {mostrar_fusionar && <ContactoFusionarForm
                modal_open={mostrar_fusionar}
                list={contactos}
                cargarContactos={cargarContactos}
                onCancel={() => setMostrarFusionar(false)}
            />}
        </div>
    )
};

export default FusionarContacto;