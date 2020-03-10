import React, {useState} from "react";
import PropTypes from "prop-types";
import CalendarField from "../../calendarioField";
import Button from "@material-ui/core/Button";

const RangoFechaDate = (props) => {
    const [fecha_inicial, setFechaInicial] = useState(null);
    const [fecha_final, setFechaFinal] = useState(null);
    const {onFiltarPorRangoMethod} = props;
    return <div className='row'>
        <CalendarField
            className='col-12 col-md-4 col-lg-3'
            value={fecha_inicial}
            nombre='Fecha Inicial'
            max={fecha_final}
            onChange={(e, b) => {
                setFechaInicial(b);
            }}/>
        <CalendarField
            className='col-12 col-md-4 col-lg-3'
            value={fecha_final}
            nombre='Fecha Final'
            min={fecha_inicial}
            onChange={(e, b) => {
                setFechaFinal(b);
            }}/>
        {(fecha_inicial && fecha_final) && <Button
            color="primary"
            variant="contained"
            onClick={() => onFiltarPorRangoMethod(fecha_inicial, fecha_final)}
        >
            Buscar
        </Button>
        }
    </div>
};

RangoFechaDate.propTypes = {
    onFiltarPorRangoMethod: PropTypes.func.isRequired,
};

export default RangoFechaDate;