import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const BaseFormProyecto = (props) => {
    const {fases_en_literal, puede_administrar} = props;
    const fases_en_proyecto_array = _.map(fases_en_literal, e => e.fase);
    if (!puede_administrar) {
        return (
            <div>No Tienes permisos para administrar fases del proyecto</div>
        )
    }
    return (
        <div className="row">
            <FormGroup>
                {
                    _.map(props.fases, e => {
                        return (
                            <FormControlLabel
                                key={e.id}
                                control={
                                    <Checkbox
                                        label={e.nombre.toLowerCase()}
                                        onChange={() => props.adicionarQuitarFaseLiteral(e.id)}
                                        name={e.nombre}
                                        checked={fases_en_proyecto_array.includes(e.id)}
                                        color='primary'

                                    />
                                }
                                label={e.nombre}
                            />
                        )
                    })
                }
            </FormGroup>
        </div>
    )
};

export default BaseFormProyecto;