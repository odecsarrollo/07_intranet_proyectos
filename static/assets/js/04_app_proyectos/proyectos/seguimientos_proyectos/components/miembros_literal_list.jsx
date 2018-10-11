import React, {Fragment} from 'react';

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
                                        <i
                                            className={`far ${m.puede_editar_tareas ? 'fa-check-square' : 'fa-square'}`}
                                            onClick={() => editarMiembro(m, {puede_editar_tareas: !m.puede_editar_tareas})}
                                        >
                                        </i>
                                    </td>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <i
                                            className={`far ${m.puede_eliminar_tareas ? 'fa-check-square' : 'fa-square'}`}
                                            onClick={() => editarMiembro(m, {puede_eliminar_tareas: !m.puede_eliminar_tareas})}
                                        >
                                        </i>
                                    </td>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <i
                                            className={`far ${m.puede_adicionar_tareas ? 'fa-check-square' : 'fa-square'}`}
                                            onClick={() => editarMiembro(m, {puede_adicionar_tareas: !m.puede_adicionar_tareas})}
                                        >
                                        </i>
                                    </td>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <i
                                            className={`far ${m.puede_administrar_fases ? 'fa-check-square' : 'fa-square'}`}
                                            onClick={() => editarMiembro(m, {puede_administrar_fases: !m.puede_administrar_fases})}
                                        >
                                        </i>
                                    </td>
                                    <td style={table_style.td} className='text-center puntero'>
                                        <i
                                            className={`far ${m.puede_administrar_miembros ? 'fa-check-square' : 'fa-square'}`}
                                            onClick={() => editarMiembro(m, {puede_administrar_miembros: !m.puede_administrar_miembros})}
                                        >
                                        </i>
                                    </td>
                                    <td style={table_style.td}>
                                        <i className='far fa-trash puntero'
                                           onClick={() => quitarMiembro(m.usuario)}></i>
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