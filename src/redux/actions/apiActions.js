import { readFile } from "react-native-fs";
import { storeData } from "../../constants/helperFunction";
import { GET_DATA } from "../../constants/types";
import XLSX from 'xlsx'


export const readCsvData = (csvFile) => {
    try {
        return async dispatch => {
            readFile(csvFile, 'ascii')
                .then(res => {
                    const wb = XLSX.read(res, { type: 'binary' })
                    const wsname = wb.SheetNames[0]
                    const ws = wb.Sheets[wsname]
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
                    var temp = []
                    storeData('csv_address', '')
                    for (let i = 1; i < data.length; ++i) {
                        temp.push({
                            id: data[i][0],
                            address: data[i][1],
                            propertyClass: data[i][3],
                            buildStyle: data[i][4],
                            details: 'Take New Photo',
                            process: i % 2 == 0 ? '2' : '0',
                            status: i % 2 == 0 ? 'Yes' : 'No'
                        })
                    }



                    dispatch({
                        type: GET_DATA,
                        payload: temp,
                        status: 'success'
                    })

                    console.log('action csv===>', JSON.stringify(temp))
                    console.log('action csv address size===>', temp.length)
                    storeData('csv_address', JSON.stringify(temp))

                })
        }
    } catch (error) {
        console.log(error);
        return async dispatch => {
            dispatch({
                type: GET_DATA,
                status: 'error'
            })
        }
    }
}