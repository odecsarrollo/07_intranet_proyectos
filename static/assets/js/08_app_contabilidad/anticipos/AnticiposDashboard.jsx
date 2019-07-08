import React, {Fragment, memo, useState} from 'react';
import {connect} from "react-redux";
import * as actions from "../../01_actions/01_index";
import {Titulo} from "../../00_utilities/templates/fragmentos";
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';


import BloqueProformaConfiguracion from "./configuracion/ProformaConfiguracion";
import BloqueProformaCobros from "./anticipos/components/CobroCRUD";

const ItemsDashboard = memo(props => {
    const {contabilidad_proforma_configuracion} = props;
    const [slideIndex, setSlideIndex] = useState(0);
    const singular_name = 'Anticipo';
    const handleChange = (event, value) => setSlideIndex(value);

    return (
        <Fragment>
            <Titulo>{singular_name}</Titulo>
            <Tabs
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                value={slideIndex}
            >
                <Tab label="Anticipos"/>
                <Tab label="Configuracion"/>
            </Tabs>
            {slideIndex === 0 && <BloqueProformaCobros/>}
            {
                slideIndex === 1 &&
                <BloqueProformaConfiguracion
                    initialValues={_.map(contabilidad_proforma_configuracion)[0]}
                />
            }
        </Fragment>
    )
});

function mapPropsToState(state, ownProps) {
    return {
        contabilidad_proforma_configuracion: state.contabilidad_proforma_configuracion
    }
}

export default connect(mapPropsToState, actions)(ItemsDashboard)