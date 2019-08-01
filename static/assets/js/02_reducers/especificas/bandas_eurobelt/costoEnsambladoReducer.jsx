import {COSTO_ENSAMBLADO_BANDA_EUROBELT_TYPES as TYPES} from '../../../01_actions/00_types';
import baseReducer from '../../baseReducer'

export default function (state = [], action) {
    return baseReducer(TYPES, state, action)
}