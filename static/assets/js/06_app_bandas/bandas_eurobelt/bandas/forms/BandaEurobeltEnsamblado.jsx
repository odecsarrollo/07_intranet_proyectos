import React, {memo, useState} from 'react';
import Typography from "@material-ui/core/Typography";

const BandaEurobeltEnsamblado = memo(props => {
    const {
        componentes,
        configuracion,
        empujador_tipo,
        con_aleta,
        con_empujador
    } = props;
    const [categoria_a_agregar, setCategoriaAAgregar] = useState(null);
    const id_categoria_empujador = configuracion ? configuracion.categoria_empujador : null;
    const id_categoria_aleta = configuracion ? configuracion.categoria_aleta : null;
    const id_categoria_modulo = configuracion ? configuracion.categoria_modulo : null;
    const id_categoria_tapa = configuracion ? configuracion.categoria_tapa : null;
    const id_categoria_varilla = configuracion ? configuracion.categoria_varilla : null;
    let componentes_a_agregar = _.pickBy(componentes, c => c.categoria === categoria_a_agregar);
    if (categoria_a_agregar === id_categoria_empujador) {
        componentes_a_agregar = _.pickBy(componentes, c => c.categoria === id_categoria_empujador && c.tipo_banda === empujador_tipo);
    }
    console.log(componentes_a_agregar);
    return (
        <div className='col-12'>
            <Typography variant="h4" color="primary" noWrap>
                Ensamblado
            </Typography>
            <div className="row pl-4">
                {con_empujador &&
                <div className="col-12">
                    <Typography variant="h6" color="primary" noWrap
                                onClick={() => setCategoriaAAgregar(id_categoria_empujador)}>
                        Empujadores
                    </Typography>
                </div>}
                {con_aleta &&
                <div className="col-12">
                    <Typography variant="h6" color="primary" noWrap
                                onClick={() => setCategoriaAAgregar(id_categoria_aleta)}>
                        Aletas
                    </Typography>
                </div>}
                <div className="col-12">
                    <Typography variant="h6" color="primary" noWrap
                                onClick={() => setCategoriaAAgregar(id_categoria_modulo)}>
                        Modulos
                    </Typography>
                </div>
                <div className="col-12">
                    <Typography variant="h6" color="primary" noWrap
                                onClick={() => setCategoriaAAgregar(id_categoria_varilla)}>
                        Varilla
                    </Typography>
                </div>
                <div className="col-12">
                    <Typography variant="h6" color="primary" noWrap
                                onClick={() => setCategoriaAAgregar(id_categoria_tapa)}>
                        Tapa
                    </Typography>
                </div>
            </div>
        </div>
    )
});

export default BandaEurobeltEnsamblado;