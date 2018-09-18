import React from 'react';
import Checkbox from 'material-ui/Checkbox';


const BaseFormProyecto = (props) => {
    const {fases_en_literal} = props;
    const fases_en_proyecto_array = _.map(fases_en_literal, e => e.fase);
    return (
        <div className="row">
            {
                _.map(props.fases, e => {
                    return (
                        <Checkbox
                            key={e.id}
                            className="col-12 col-md-4 col-lg-3"
                            label={e.nombre.toLowerCase()}
                            onCheck={() => props.adicionarQuitarFaseLiteral(e.id)}
                            name={e.nombre}
                            checked={fases_en_proyecto_array.includes(e.id)}
                        />
                    )
                })
            }
        </div>
    )
};

export default BaseFormProyecto;