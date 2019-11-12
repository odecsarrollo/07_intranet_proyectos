import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    MyTextFieldSimple,
    MyCheckboxSimple, MyCombobox
} from '../../../../00_utilities/components/ui/forms/fields';
import * as actions from '../../../../01_actions/01_index.jsx';


const BaseFormLiteral = (props) => {
    const {initialValues = null} = props;
    const dispatch = useDispatch();
    const disenadores = useSelector(state => state.usuarios);
    useEffect(() => {
        dispatch(actions.fetchUsuarios());
    }, []);
    return (
        <div className='row'>
            {
                (
                    (initialValues && !initialValues.en_cguno) ||
                    (!initialValues)
                )
                &&
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Descripción'
                    name='descripcion'
                    case='U'/>
            }
            <MyCombobox
                className="col-12"
                name='disenador'
                busy={false}
                autoFocus={false}
                label='Diseñador Asignado'
                data={_.map(disenadores, e => {
                    return {
                        'name': e.to_string,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Diseñador'
            />
            {
                initialValues &&
                <MyCheckboxSimple
                    className="col-12"
                    nombre='Abierto'
                    name='abierto'/>
            }
        </div>
    )
};

export default BaseFormLiteral;