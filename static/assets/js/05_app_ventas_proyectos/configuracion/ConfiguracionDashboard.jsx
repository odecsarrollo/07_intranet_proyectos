import Tab from '@material-ui/core/Tab/index';
import Tabs from '@material-ui/core/Tabs/index';
import Typography from '@material-ui/core/Typography/index';
import React, {Fragment, useState} from 'react';
import CorreoCRUD from "../../00_utilities/components/ui/correos_servicios/correos_aplicaciones/CorreoCRUD";
import CondicionInicioProyectoCrud from "./cotizaciones/condiciones_inicio_proyectos/CondicionInicioProyectoCRUD";

const ContabilidadConfiguracionDashboard = () => {
    const singular_name = 'Configuración';
    const [slideIndex, setSlideIndex] = useState(0);
    return (
        <Fragment>
            <Typography variant="h5" gutterBottom color="primary">
                {singular_name}
            </Typography>
            <Tabs indicatorColor="primary"
                  textColor="primary"
                  onChange={(event, index) => setSlideIndex(index)}
                  value={slideIndex}
            >
                <Tab label="Condiciones Inicio Proyectos"/>
                <Tab label="Correos Not. Inicio Op"/>
                <Tab label="Correos Apertura Op"/>
                <Tab label="Correos Not. Nueva OC"/>
                <Tab label="Correos Not. Reg. Nuevo Pago"/>
            </Tabs>
            {slideIndex === 0 && <CondicionInicioProyectoCrud/>}
            {slideIndex === 1 &&
            <CorreoCRUD aplicacion='CORREO_COTIZACION_NOTIFICACION_INICIO' plural_name='Correos Inicio Proyectos'
                        singular_name='Correo Inicio Proyecto'/>}
            {slideIndex === 2 &&
            <CorreoCRUD aplicacion='CORREO_COTIZACION_APERTURA_OP' plural_name='Correos Aperturas OP'
                        singular_name='Correo Apertura OP'/>}
            {slideIndex === 3 &&
            <CorreoCRUD aplicacion='CORREO_COTIZACION_NUEVA_OC' plural_name='Correos Nueva OC'
                        singular_name='Correo Nueva OC'/>}
            {slideIndex === 4 &&
            <CorreoCRUD aplicacion='CORREO_COTIZACION_REGISTRO_NUEVO_PAGO' plural_name='Correos Registro Nuevo Pago'
                        singular_name='Correo Registro Nuevo Pago'/>}
        </Fragment>
    )
};

export default ContabilidadConfiguracionDashboard;