import React, {Fragment} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Checkbox from '@material-ui/core/Checkbox';

const MiembrosLista = (props) => {
    const {
        quitarMiembro,
        editarMiembro,
        miembros_literales_list,
        table_style,
        puede_administrar
    } = props;
    return (
        <table
            className='table table-responsive table-striped'
            style={table_style.table}
        >
            <thead>
            <tr>
                <th style={table_style.th}>
                    Id
                </th>
                <th style={table_style.th}>
                    Usuario
                </th>
                {
                    puede_administrar &&
                    <Fragment>
                        <th style={table_style.th}>
                            Edit. Tareas
                        </th>
                        <th style={table_style.th}>
                            Elim. Tareas
                        </th>
                        <th style={table_style.th}>
                            Add. Tareas
                        </th>
                        <th style={table_style.th}>
                            Admon. Fases
                        </th>
                        <th style={table_style.th}>
                            Admin. Miembros
                        </th>
                        <th style={table_style.th}>
                            Eliminar
                        </th>
                    </Fragment>
                }
            </tr>
            </thead>
            <tbody>
            {
                _.map(miembros_literales_list, m => {
                    return (
                        <tr key={m.id}>
                            <td style={table_style.td}>
                                {m.usuario}
                            </td>
                            <td style={table_style.td}>
                                {m.usuario_nombres} {m.usuario_apellidos}
                            </td>
                            {
                                puede_administrar &&
                                <Fragment>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={m.puede_editar_tareas}
                                            onClick={() => editarMiembro(m, {puede_editar_tareas: !m.puede_editar_tareas})}
                                        />
                                    </td>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={m.puede_eliminar_tareas}
                                            onClick={() => editarMiembro(m, {puede_eliminar_tareas: !m.puede_eliminar_tareas})}
                                        />
                                    </td>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={m.puede_adicionar_tareas}
                                            onClick={() => editarMiembro(m, {puede_adicionar_tareas: !m.puede_adicionar_tareas})}
                                        />
                                    </td>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={m.puede_administrar_fases}
                                            onClick={() => editarMiembro(m, {puede_administrar_fases: !m.puede_administrar_fases})}
                                        />
                                    </td>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={m.puede_administrar_miembros}
                                            onClick={() => editarMiembro(m, {puede_administrar_miembros: !m.puede_administrar_miembros})}
                                        />
                                    </td>
                                    <td style={table_style.td}>
                                        <FontAwesomeIcon
                                            icon={'trash'}
                                            className='puntero'
                                            onClick={() => quitarMiembro(m.usuario)}
                                        />
                                    </td>
                                </Fragment>
                            }
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
    )
};

export default MiembrosLista;