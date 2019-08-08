import React, {useState, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import BloquePaises from "./paises/PaisCRUD";
import BloqueDepartamentos from "./departamentos/DepartamentoCRUD";
import BloqueCiudades from "./ciudades/CiudadCRUD";
import BloqueCiudadesCatalogos from "./ciudades_cargue_catalogo/CiudadCargueCatalogoCRUD";
import Typography from '@material-ui/core/Typography/index';

const GeografiaDashboard = () => {
    const singular_name = 'Panel Geografia';
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
                <Tab label="Paises"/>
                <Tab label="Departamentos"/>
                <Tab label="Ciudades"/>
                <Tab label="Ciudades Sistemas Informacion"/>
            </Tabs>
            {slideIndex === 0 && <BloquePaises/>}
            {slideIndex === 1 && <BloqueDepartamentos/>}
            {slideIndex === 2 && <BloqueCiudades/>}
            {slideIndex === 3 && <BloqueCiudadesCatalogos/>}
        </Fragment>
    )
};

export default GeografiaDashboard;