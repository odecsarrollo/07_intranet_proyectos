import React, {Component} from 'react';
import CalendarField from './calendarioField';
import PropTypes from "prop-types";

class FechasRangoFiltro extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            filtro_fecha_min: null,
            filtro_fecha_max: null
        });
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        const {metodoBusquedaFechas} = this.props;
        const {filtro_fecha_min, filtro_fecha_max} = this.state;
        metodoBusquedaFechas(filtro_fecha_min, filtro_fecha_max);
    }

    render() {
        const {filtro_fecha_min, filtro_fecha_max} = this.state;
        const {className} = this.props;
        return (
            <div className={className}>
                <form onSubmit={this.onSubmit}>
                    <div className="row">
                        <CalendarField
                            className='col-md-6'
                            value={filtro_fecha_min}
                            nombre='Fecha Inicial'
                            onChange={(e, b) => {
                                this.setState({filtro_fecha_min: b});
                                if (filtro_fecha_max < b) {
                                    this.setState({filtro_fecha_max: b})
                                }
                            }}/>
                        {
                            filtro_fecha_min &&
                            <CalendarField
                                className='col-md-6' nombre='Fecha Final'
                                value={filtro_fecha_max}
                                min={filtro_fecha_min}
                                onChange={(e, b) => {
                                    this.setState({filtro_fecha_max: b});
                                }}/>
                        }
                        {
                            filtro_fecha_max &&
                            <div className="col-md-12">
                                <input type="submit" className='btn btn-primary' value="Buscar"></input>
                            </div>
                        }
                    </div>
                </form>
            </div>
        )
    }
};

FechasRangoFiltro.propTypes = {
    metodoBusquedaFechas: PropTypes.func,
    className: PropTypes.string
};

export default FechasRangoFiltro;