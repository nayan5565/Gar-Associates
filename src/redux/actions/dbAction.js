import { readFile } from "react-native-fs";
import { getData, storeData } from "../../constants/helperFunction";
import XLSX from 'xlsx'
import { openDatabase } from 'react-native-sqlite-storage';
import { GET_IMAGE_DB, SAVE_CSV_DB, SAVE_IMAGE_DB } from '../../constants/types';
import DocumentPicker from 'react-native-document-picker';

const tableName = 'address_list';

export const db = openDatabase({
    name: 'GA_DB',
    location: 'default',
},
    () => { },
    error => { console.log(error) }
);

export const createTable = () => {
    db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
            + "ImageList "
            + "(id INTEGER PRIMARY KEY AUTOINCREMENT, imageUrl TEXT, imageName TEXT, imageType TEXT, address TEXT);"
        )
    })
}

export const createAddressTable = () => {
    db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS "
            + "address_list "
            + "(id INTEGER PRIMARY KEY, address TEXT, propertyClass TEXT, buildStyle TEXT, process TEXT, status TEXT);"
        )
    })
}


export const readCsvData = (csvFile) => {
    createAddressTable()
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
                            process: '0',
                            status: ''
                        })
                        saveCsvAddress(data[i][0], data[i][1], data[i][3], data[i][4], '0', '')

                    }

                    // saveTodoItems(temp)

                    dispatch({
                        type: SAVE_CSV_DB,
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
                type: SAVE_CSV_DB,
                status: 'error'
            })
        }
    }
}

const saveCsvAddress = async (id, address, propertyClass, buildStyle, process, status) => {
    await db.transaction(async (tx) => {

        await tx.executeSql("INSERT INTO address_list (id, address, propertyClass,buildStyle, process, status ) VALUES (?,?,?,?,?,?)",
            [id, address, propertyClass, buildStyle, process, status],
            (tx, results) => {

                console.log('Save DB')
            },
            error => {
                dispatch({
                    type: SAVE_IMAGE_DB,
                    imageStatus: 'error'
                }), console.log('getting error: ' + error.message); console.log('Save error: ' + error.message)
            }
        );

    })
}


export const saveTodoItems = (todoItems) => {
    const insertQuery =
        `INSERT OR REPLACE INTO ${tableName}(id, address, propertyClass,buildStyle, process, status) values` +
        todoItems.map(i => `(${i.id}, '${i.address}, '${i.propertyClass}, '${i.buildStyle}, '${i.process}, '${i.status}')`).join(',');

    return db.executeSql(insertQuery);
};

export const getAddressFromSP = () => {
    try {
        return async dispatch => {
            var adressList = []
            var adress = await getData('csv_address')
            if (adress != 'No Data') {
                adressList = JSON.parse(adress, [])
                console.log('csvAdd===>', adressList)
                console.log('csvAddL===>', adressList.length)
                // saveTodoItems(adressList)
                dispatch({
                    type: SAVE_CSV_DB,
                    payload: adressList,
                    status: 'success'
                })
            } else {
                dispatch({
                    type: SAVE_CSV_DB,
                    payload: [],
                    status: 'error'
                })
            }


        }
    } catch (error) {
        console.log(error);
        return async dispatch => {
            dispatch({
                type: SAVE_CSV_DB,
                status: 'error'
            })
        }
    }
}

export const getAddressFromDB = () => {
    try {
        return async dispatch => {
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM address_list', [],

                    (tx, results) => {
                        var len = results.rows.length;
                        // console.log("len: " + JSON.stringify(results.rows.item(0)))
                        var addressData = [];
                        if (len > 0) {

                            for (var i = 0; i < len; i++) {
                                var item = results.rows.item(i);
                                addressData.push({ id: item.id, address: item.address, propertyClass: item.propertyClass, buildStyle: item.buildStyle, process: item.process, status: item.status })
                            }

                        }
                        console.log('db addressData===>', addressData.length)
                        dispatch({
                            type: SAVE_CSV_DB,
                            payload: addressData,
                            status: 'success'
                        })
                    },
                    error => {
                        dispatch({
                            type: SAVE_CSV_DB,
                            status: 'error'
                        });
                        console.log('getting error: ' + error.message)
                    }
                );

            })
        }
    } catch (error) {
        console.log(error);
        return async dispatch => {
            dispatch({
                type: SAVE_CSV_DB,
                status: 'error'
            })
        }
    }
}

export const getImageData = (address) => {
    return async dispatch => {
        console.log('db address===>', address)
        db.transaction((tx) => {
            console.log('db address2===>', address)
            tx.executeSql('SELECT * FROM ImageList WHERE address = ?', [address],

                (tx, results) => {
                    var len = results.rows.length;
                    // console.log("len: " + JSON.stringify(results.rows.item(0)))
                    var images = [];
                    if (len > 0) {

                        for (var i = 0; i < len; i++) {
                            var item = results.rows.item(i);
                            images.push({ id: item.id, imageUrl: item.imageUrl, imageName: item.imageName, imageType: item.imageType, address: item.address })
                        }

                    }
                    console.log('db Image===>', images.length)
                    dispatch({
                        type: GET_IMAGE_DB,
                        payload: images,
                        status: 'success'
                    })
                },
                error => {
                    dispatch({
                        type: GET_IMAGE_DB,
                        status: 'error'
                    });
                    console.log('getting error: ' + error.message)
                }
            );

        })


    }

}

export const getImageLength = (address) => {

    let imageCount = 0
    db.transaction((tx) => {
        // console.log('db address2===>', address)
        tx.executeSql('SELECT * FROM ImageList WHERE address = ?', [address],

            (tx, results) => {
                var len = results.rows.length;

                imageCount = len
            },
            error => {
                imageCount = 0
                console.log('getting error: ' + error.message)
                // return imageCount
            }
        );

    })

    // console.log('db imageCount2===>', imageCount)
    return imageCount

}

export const pickMultipleFile = (itemData, index) => {
    createTable()
    try {
        return async dispatch => {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
                // mode: 'open',
                copyTo: 'documentDirectory',
                allowMultiSelection: true
            });
            console.log(
                'PickImage===>', JSON.stringify(results)
            );


            var pickImage = [];
            for (const res of results) {
                var track = {
                    url: res.fileCopyUri,
                    imageName: res.name,
                    imageType: res.type,
                };
                console.log(
                    'PickImage add===>', res.fileCopyUri
                );
                pickImage.push(track)
                await db.transaction(async (tx) => {

                    await tx.executeSql("INSERT INTO ImageList (imageUrl, imageName, imageType, address ) VALUES (?,?,?,?)",
                        [res.fileCopyUri, res.name, res.type, itemData.address],
                        (tx, results) => {

                            console.log('Save DB')
                        },
                        error => {
                            dispatch({
                                type: SAVE_IMAGE_DB,
                                imageStatus: 'error'
                            }), console.log('getting error: ' + error.message); console.log('Save error: ' + error.message)
                        }
                    );

                })

            }

            db.transaction((tx) => {
                console.log('db address2===>', itemData.address)
                tx.executeSql('SELECT * FROM ImageList WHERE address = ?', [itemData.address],

                    (tx, results) => {
                        var len = results.rows.length;
                        // console.log("len: " + JSON.stringify(results.rows.item(0)))
                        var images = [];
                        if (len > 0) {

                            for (var i = 0; i < len; i++) {
                                var item = results.rows.item(i);
                                images.push({ id: item.id, imageUrl: item.imageUrl, imageName: item.imageName, imageType: item.imageType, address: item.address })
                            }

                        }
                        console.log('db Image===>', images.length)
                        var item2 = {
                            ...itemData,
                            process: images.length,
                            status: 'No'
                        }
                        dispatch({
                            type: SAVE_IMAGE_DB,
                            payload: images,
                            selectAddress: item2.address,
                            item: item2,
                            index: index,
                            imageStatus: 'success'
                        });
                    },
                    error => {
                        dispatch({
                            type: SAVE_IMAGE_DB,
                            status: 'error'
                        });
                        console.log('getting error: ' + error.message)
                    }
                );

            })


        }
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            dispatch({
                type: SAVE_IMAGE_DB,
                imageStatus: 'User Cancel'
            })
        } else {
            dispatch({
                type: SAVE_IMAGE_DB,
                imageStatus: err
            })
            throw err;
        }
    }
}

export const saveImage = (imageUri, imageName, imageType, address) => {
    return async dispatch => {
        createTable()
        await db.transaction(async (tx) => {

            await tx.executeSql("INSERT INTO ImageList (imageUri, imageName, imageType, address ) VALUES (?,?,?,?)",
                [imageUri, imageName, imageType, address],
                (tx, results) => {
                    var images = [];
                    dispatch({
                        type: SAVE_IMAGE_DB,
                        status: 'success'
                    }), console.log('Save DB')
                },
                error => {
                    dispatch({
                        type: SAVE_IMAGE_DB,
                        status: 'error'
                    }), console.log('getting error: ' + error.message); console.log('Save error: ' + error.message)
                }
            );

        })

    }

}

export const getAllImage = () => {
    return async dispatch => {
        db.transaction((tx) => {

            tx.executeSql('SELECT * FROM ImageList', [],

                (tx, results) => {
                    var len = results.rows.length;
                    // console.log("len: " + JSON.stringify(results.rows.item(0)))
                    var images = [];
                    if (len > 0) {

                        for (var i = 0; i < len; i++) {
                            var item = results.rows.item(i);
                            images.push({ id: item.id, imageUrl: item.imageUrl, imageName: item.imageName, imageType: item.imageType, address: item.address })
                        }

                    }
                    console.log('db all Image===>', images.length)

                    dispatch({
                        type: GET_IMAGE_DB,
                        payload: images,
                        imageStatus: 'success'
                    });
                },
                error => {
                    dispatch({
                        type: GET_IMAGE_DB,
                        status: 'error'
                    });
                    console.log('getting error: ' + error.message)
                }
            );

        })
    }
}