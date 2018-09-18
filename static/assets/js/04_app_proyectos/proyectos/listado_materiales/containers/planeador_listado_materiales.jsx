import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import TablaListadoMateriales from '../../listado_materiales/components/listado_materiales_tabla';

class PlaneadorMateriaPrima extends Component {
    componentDidMount() {
        const {id} = this.props.match.params;
        const {
            noCargando,
            cargando,
            notificarErrorAjaxAction,
            fetchLiteral,
        } = this.props;
        cargando();
        fetchLiteral(id, () => noCargando(), notificarErrorAjaxAction)
    }

    render() {
        return (
            <div>
                {
                    _.size(this.props.items_listados_materiales) > 0 &&
                    <TablaListadoMateriales
                        {...this.props}
                        modo_planeador={true}
                    />
                }
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        literal: state.literales[id],
        mis_permisos: state.mis_permisos,
        items_listados_materiales: state.items_listados_materiales,
    }
}

export default connect(mapPropsToState, actions)(PlaneadorMateriaPrima)