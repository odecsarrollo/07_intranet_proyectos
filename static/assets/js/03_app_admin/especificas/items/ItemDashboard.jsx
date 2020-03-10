import React, {Fragment, memo, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import BloqueCategorias from "./categorias/CategoriaCRUDList";
import BloqueItemsVentas from "./items_ventas_catalogo_productos/ItemVentaCatalogoCRUD";
import BloqueUnidadesMedidas from "./unidades_medidas/UnidadMedidaCatalogoCRUD";
import Typography from "@material-ui/core/Typography";

const ItemsDashboard = memo(props => {
    const singular_name = 'Panel Items';
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
                <Tab label="Categorías"/>
                <Tab label="Unidades Medidas"/>
                <Tab label="Items Ventas Catalogo"/>
            </Tabs>
            {slideIndex === 0 && <BloqueCategorias/>}
            {slideIndex === 1 && <BloqueUnidadesMedidas/>}
            {slideIndex === 2 && <BloqueItemsVentas/>}
        </Fragment>
    )
});

export default ItemsDashboard;