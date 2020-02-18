import React, {Fragment, memo, useState, useEffect} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ClienteDetailDashboardInfo from "./ClienteDetailDashboardInfo";
import BloqueContactos from "./ClienteDetailDashboardCRUDContactos";
import BloqueFacturaciones from "./ClienteDetailDashboardFacturacion";
import BloqueCotizaciones from "./ClienteDetailDashboardCotizaciones";
import BloqueProyectos from "./ClienteDetailDashboardProyectos";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {CLIENTES} from "../../../../permisos";
import * as actions from '../../../../01_actions/01_index';

const ClienteDetailDashboard = memo(props => {
    const [slideIndex, setSlideIndex] = useState(0);
    const {id} = props.match.params;
    const dispatch = useDispatch();
    const cliente = useSelector(state => state.clientes[id]);
    const permisos = useTengoPermisos(CLIENTES);
    const cargarDatos = (callback = null) => {
        dispatch(actions.fetchCliente(id, {callback}));
    };
    useEffect(() => {
        cargarDatos();
    }, []);
    if (!cliente) {
        return <div>Cargando...</div>
    }
    const singular_name = cliente.to_string;
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                {singular_name}
            </Typography>
            <ClienteDetailDashboardInfo cliente={cliente}/>
            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={(event, index) => setSlideIndex(index)}
                  value={slideIndex}
            >
                <Tab label="Contactos"/>
                <Tab label="Facturacion"/>
                <Tab label="Cotizaciones Componentes"/>
                <Tab label="Proyectos"/>
            </Tabs>
            {slideIndex === 0 && <BloqueContactos cliente_id={cliente.id} cargarCliente={cargarDatos}/>}
            {slideIndex === 1 && <BloqueFacturaciones cliente_id={cliente.id} cargarCliente={cargarDatos}/>}
            {slideIndex === 2 && <BloqueCotizaciones cliente_id={cliente.id} cargarCliente={cargarDatos}/>}
            {slideIndex === 3 && <BloqueProyectos cliente_id={cliente.id} cargarCliente={cargarDatos}/>}
        </Fragment>
    )
});

export default ClienteDetailDashboard;