import React, {Fragment} from 'react';
import Form from './forms/literal_general_form';

const LiteralesProyecto = (props) => {
    const {onUpdateLiteral, onDeleteLiteral, literal, proyecto} = props;
    return (
        <Fragment>
            <Form
                proyecto={proyecto}
                literal={literal}
                onSubmit={onUpdateLiteral}
                onDelete={onDeleteLiteral}
            />
        </Fragment>
    )
};

export default LiteralesProyecto;