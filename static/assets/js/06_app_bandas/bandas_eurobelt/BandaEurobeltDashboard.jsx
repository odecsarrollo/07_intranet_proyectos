import React, {memo, Fragment, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import BloqueBandas from "./bandas/BandaEurobeltCRUD";
import BloqueComponentes from "./componentes/ComponenteCRUD";
import BloqueTipos from "./tipos/TipoBandaCRUD";
import BloqueMateriales from "./materiales/MaterialCRUD";
import BloqueColores from "./colores/ColorCRUD";
import BloqueSeries from "./series/SerieCRUD";
import BloqueCategorias from "./categorias_dos/CategoriaDosCRUD";
import Configuracion from "./configuracion/ConfiguracionBandaEurobelt";
import Typography from "@material-ui/core/Typography";

const ItemsDashboard = memo((props) => {
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
                <Tab label="Bandas"/>
                <Tab label="Componentes"/>
                <Tab label="Tipos"/>
                <Tab label="Materiales"/>
                <Tab label="Colores"/>
                <Tab label="Series"/>
                <Tab label="Categorias Dos"/>
                <Tab label="Configuración"/>
            </Tabs>
            {slideIndex === 0 && <BloqueBandas history={props.history}/>}
            {slideIndex === 1 && <BloqueComponentes/>}
            {slideIndex === 2 && <BloqueTipos/>}
            {slideIndex === 3 && <BloqueMateriales/>}
            {slideIndex === 4 && <BloqueColores/>}
            {slideIndex === 5 && <BloqueSeries/>}
            {slideIndex === 6 && <BloqueCategorias/>}
            {slideIndex === 7 && <Configuracion/>}
        </Fragment>
    )
});

export default ItemsDashboard;