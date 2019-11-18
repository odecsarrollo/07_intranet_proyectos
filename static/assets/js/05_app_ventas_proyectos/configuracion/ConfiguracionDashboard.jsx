import React, {useState, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import CondicionInicioProyectoCrud from "./cotizaciones/condiciones_inicio_proyectos/CondicionInicioProyectoCRUD";
import Typography from '@material-ui/core/Typography/index';

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
            </Tabs>
            {slideIndex === 0 && <CondicionInicioProyectoCrud/>}
        </Fragment>
    )
};

export default ContabilidadConfiguracionDashboard;