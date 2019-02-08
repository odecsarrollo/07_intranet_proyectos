import React from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = _.orderBy(this.props.data, ['orden'], ['asc']);
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object
        } = this.props;


        return (
            <ReactTable
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Orden",
                                accessor: "orden",
                                maxWidth: 50,
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre",
                                maxWidth: 400,
                            },
                            {
                                Header: "Color",
                                accessor: "color",
                                maxWidth: 200,
                                Cell: row => {
                                    const color_letra = row.original.letra_color;
                                    const color_letra_borde = color_letra === 'black' ? 'white' : 'black';
                                    return <div style={{
                                        backgroundColor: `${row.value}`,
                                        color: `${row.original.letra_color}`,
                                        paddingLeft: '10px',
                                        textShadow: `-1px 0 ${color_letra_borde}, 0 1px ${color_letra_borde}, 1px 0 ${color_letra_borde}, 0 -1px ${color_letra_borde}`
                                    }}
                                    >{row.value}</div>
                                }
                            },
                            {
                                Header: "Color Letra",
                                accessor: "letra_color",
                                maxWidth: 80,
                                Cell: row => <div style={{backgroundColor: `${row.value}`}}>{row.value}</div>
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            // {
                            //     Header: "Activo",
                            //     accessor: "is_active",
                            //     show: permisos_object.make_user_active,
                            //     maxWidth: 60,
                            //     Cell: row => (
                            //         <Checkbox
                            //             checked={row.value}
                            //             onCheck={() => updateItem({...row.original, is_active: !row.value})}
                            //         />
                            //     )
                            // },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 60,
                                Cell: row =>
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={row.original.nombre}
                                        element_type={singular_name}
                                    />

                            },
                            {
                                Header: "Editar",
                                show: permisos_object.change,
                                maxWidth: 60,
                                Cell: row =>
                                    <IconButtonTableEdit
                                        onClick={() => {
                                            onSelectItemEdit(row.original);
                                        }}/>

                            },
                            // {
                            //     Header: "Ver",
                            //     show: permisos_object.detail,
                            //     maxWidth: 60,
                            //     Cell: row =>
                            //         <Link to={`/app/admin/algos/detail/${row.original.id}`}>
                            //             <IconButtonTableSee/>
                            //         </Link>
                            //
                            // }
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;