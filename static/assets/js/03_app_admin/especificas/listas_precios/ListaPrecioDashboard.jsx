import React, {Fragment, memo, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BloqueFormasPagosCanal from "./formas_pagos_canal/FormaPagoCRUD";
import Typography from "@material-ui/core/Typography";

const ItemsDashboard = memo(props => {
    const singular_name = 'Panel Listas de Precios';
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
                <Tab label="Formas de Pago"/>
            </Tabs>
            {slideIndex === 0 && <BloqueFormasPagosCanal/>}
        </Fragment>
    )
});

export default ItemsDashboard;