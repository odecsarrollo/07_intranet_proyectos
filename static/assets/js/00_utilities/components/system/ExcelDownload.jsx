import React, {Fragment} from "react";
import ReactExport from "react-data-export";
import Button from "@material-ui/core/Button";

const ExcelDownload = (props) => {
    let {data, name, file_name = 'DownloadedExcel'} = props;
    if (data.length === 0) {
        return <Fragment></Fragment>
    }
    let data_descarga = _.map(data, e => _.pickBy(e, s => !Array.isArray(s) && typeof s !== 'object'));
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
    const data_uno = _.map(data)[0];
    let cabecera = [];
    _.mapKeys(data_uno, (value, key) => {
        cabecera = [...cabecera, key]
    });
    return (
        <ExcelFile
            element={
                <Button
                    color='primary'
                    className='ml-3'
                >
                    Descargar Excel
                </Button>
            }
            filename={file_name}
        >
            <ExcelSheet data={data_descarga} name={name}>
                {
                    cabecera.map(c => <ExcelColumn key={c} label={c} value={c}/>)
                }
            </ExcelSheet>
        </ExcelFile>
    )
};

export default ExcelDownload;