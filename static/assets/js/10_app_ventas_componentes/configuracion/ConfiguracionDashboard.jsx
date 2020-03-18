import React, {useState, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import CorreoCRUD from "../../00_utilities/components/ui/correos_servicios/correos_aplicaciones/CorreoCRUD";
import Typography from '@material-ui/core/Typography/index';

const ComponenteConfiguracionDashboard = () => {
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
                <Tab label="Correos Verificación Items Personalizados"/>
            </Tabs>
            {slideIndex === 0 && <CorreoCRUD aplicacion='CORREO_COTIZACION_COMPONENTE_VERIFICAR_ITEM_PERSONALIZADO'
                                             plural_name=''
                                             singular_name='Correo Verificación Item Personalizado'
                                             exclude_tipo_correo={['FROM', 'BCC']}/>}
        </Fragment>
    )
};

export default ComponenteConfiguracionDashboard;