import React, {memo, Fragment, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import BloqueComponentes from "./componentes/ComponenteCRUD";
import BloqueTipos from "./tipos/TipoBandaCRUD";
import BloqueMateriales from "./materiales/MaterialCRUD";
import BloqueColores from "./colores/ColorCRUD";
import BloqueSeries from "./series/SerieCRUD";
import BloqueCategorias from "./categorias_dos/CategoriaDosCRUD";
import Configuracion from "./configuracion/ConfiguracionBandaEurobelt";
import Typography from "@material-ui/core/Typography";

const ItemsDashboard = memo(() => {
    const singular_name = 'Panel Banda Eurobelt';
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
                <Tab label="Componentes"/>
                <Tab label="Tipos"/>
                <Tab label="Materiales"/>
                <Tab label="Colores"/>
                <Tab label="Series"/>
                <Tab label="Categorias Dos"/>
                <Tab label="Configuración"/>
            </Tabs>
            {slideIndex === 0 && <BloqueComponentes/>}
            {slideIndex === 1 && <BloqueTipos/>}
            {slideIndex === 2 && <BloqueMateriales/>}
            {slideIndex === 3 && <BloqueColores/>}
            {slideIndex === 4 && <BloqueSeries/>}
            {slideIndex === 5 && <BloqueCategorias/>}
            {slideIndex === 6 && <Configuracion/>}
        </Fragment>
    )
});

export default ItemsDashboard;