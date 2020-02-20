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
import {
    BANDAS_EUROBELT,
    BANDA_EUROBELT_COMPONENTES,
    BANDA_EUROBELT_CATEGORIAS_DOS,
    BANDA_EUROBELT_COLORES,
    BANDA_EUROBELT_TIPOS,
    BANDA_EUROBELT_SERIES,
    BANDA_EUROBELT_MATERIALES,
    CONFIGURACION_BANDA_EUROBELT
} from '../../permisos/index';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";

const ItemsDashboard = memo((props) => {
    const singular_name = 'Panel Banda Eurobelt';
    const [slideIndex, setSlideIndex] = useState(0);
    const permisos_bandas = useTengoPermisos(BANDAS_EUROBELT);
    const permisos_componentes = useTengoPermisos(BANDA_EUROBELT_COMPONENTES);
    const permisos_categoria_dos = useTengoPermisos(BANDA_EUROBELT_CATEGORIAS_DOS);
    const permisos_colores = useTengoPermisos(BANDA_EUROBELT_COLORES);
    const permisos_tipos = useTengoPermisos(BANDA_EUROBELT_TIPOS);
    const permisos_series = useTengoPermisos(BANDA_EUROBELT_SERIES);
    const permisos_materiales = useTengoPermisos(BANDA_EUROBELT_MATERIALES);
    const permisos_configuracion = useTengoPermisos(CONFIGURACION_BANDA_EUROBELT);
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
            {slideIndex === 0 && <BloqueBandas permisos={permisos_bandas} history={props.history}/>}
            {slideIndex === 1 && <BloqueComponentes permisos={permisos_componentes}/>}
            {slideIndex === 2 && <BloqueTipos permisos={permisos_tipos}/>}
            {slideIndex === 3 && <BloqueMateriales permisos={permisos_materiales}/>}
            {slideIndex === 4 && <BloqueColores permisos={permisos_colores}/>}
            {slideIndex === 5 && <BloqueSeries permisos={permisos_series}/>}
            {slideIndex === 6 && <BloqueCategorias permisos={permisos_categoria_dos}/>}
            {slideIndex === 7 && <Configuracion permisos={permisos_configuracion}/>}
        </Fragment>
    )
});

export default ItemsDashboard;