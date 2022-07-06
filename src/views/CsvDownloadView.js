import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, TextInput, View, FlatList, Dimensions, Platform, PermissionsAndroid, Alert } from 'react-native';
import { readFile } from 'react-native-fs';
import GlobalStyle from '../constants/GlobalStyle';
import { getData, storeData } from '../constants/helperFunction';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx'
import RNFetchBlob from 'rn-fetch-blob'

const screen = Dimensions.get('window')
const csvFilePath = 'https://clearpathinnovations-my.sharepoint.com/personal/testuser_cpimobile_com/_layouts/15/Doc.aspx?sourcedoc=%7B1AF9FDC0-38A1-4CB0-AA63-DC4B6D8CC3E0%7D&file=test%20list.csv'
var addressList = [{ id: '1', address: 'naya' }]

function CsvDownloadView(props) {
    const [csvFileName, onCsvFileName] = useState("");
    const [csvAddress, setCsvAddress] = useState([]);


    useEffect(() => {

    }, []);

    const readCsvFile = (csvFile) => {
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
                        details: 'Take New Photo',
                        process: '2',
                        status: i % 2 == 0 ? 'Yes' : 'No'
                    })
                }
                setCsvAddress(temp)
                addressList = temp
                console.log('csv===>', JSON.stringify(temp))
                console.log('csv address size===>', addressList.length)
                storeData('csv_address', JSON.stringify(addressList))

            })
    }

    const readCsvFromGallery = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            var pickCsvfile = results[0].uri

            readFile(pickCsvfile, 'ascii')
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
                            details: 'Take New Photo',
                            process: '2',
                            status: i % 2 == 0 ? 'Yes' : 'No'
                        })
                    }
                    setCsvAddress(temp)
                    addressList = temp
                    console.log('csv===>', JSON.stringify(temp))
                    console.log('csv address size===>', addressList.length)
                    storeData('csv_address', JSON.stringify(addressList))

                })

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    const fetchDownloadUrl = async () => {
        var token = await getData('token')
        console.log('fileDownload token: ' + token);
        var fileName = csvFileName
        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root:/photoapp/' + fileName + '?$select=content.downloadUrl,id', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });
            const result = await response.json();
            console.log('fileDownload res: ' + JSON.stringify(result));
            if (response.status == 200) {
                // alert(result.token_type)
                console.log('fileDownload: ' + JSON.stringify(result['@microsoft.graph.downloadUrl']));
                var url = result['@microsoft.graph.downloadUrl']
                downloadImage(url)
            } else {
                alert(JSON.stringify(result))
            }
        } catch (error) {
            console.log('fileDownload err: ' + JSON.stringify(error));
            alert(error)

        }
    }

    const createTwoButtonAlert = () =>
        Alert.alert(
            '',
            "Downloading new CSV will replace any existing parcel set. Do you wish to continue?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        var fileExtension = csvFileName.substring(csvFileName.lastIndexOf('.') + 1)

                        if (csvFileName.length < 1 || fileExtension != 'csv') {
                            alert("File format must be CSV, please enter full file name including '.csv' extension. ")
                        } else {
                            checkPermission()
                        }
                    }
                }
            ]
        );

    const callFileDownload = () => {
        createTwoButtonAlert()
    }

    const checkPermission = async () => {
        if (Platform.OS === 'ios') {
            fetchDownloadUrl()

        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                    title: 'Storage Permission Required',
                    message: 'App need access to your storage to download photos'
                }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('storage granted')
                    fetchDownloadUrl()
                } else { alert('Storage permission not granted') }
            } catch (error) {
                console.warn(error)
            }
        }
    }

    const downloadImage = (imgUrl) => {
        // setLoading(true)
        // setImage('')
        // setErrMsg('')
        // let imgUrl = 'https://static.scientificamerican.com/sciam/cache/file/EAF12335-B807-4021-9AC95BBA8BEE7C8D_source.jpg'

        // let newImgUri = imgUrl.lastIndexOf('/');
        // let imageName = imgUrl.substring(newImgUri);
        let fileName = '/' + csvFileName;
        console.log('Download url==>', imgUrl)
        console.log('imageName==>', fileName)

        let dirs = RNFetchBlob.fs.dirs;
        let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] + fileName : dirs.PictureDir + fileName;
        RNFetchBlob.config({
            fileCache: true,
            // appendExt: 'png',
            // indicator: true,
            // IOSBackgroundTask: true,
            // path: path,
            // addAndroidDownloads: {
            //     useDownloadManager: true,
            //     notification: true,
            //     path: path,
            //     description: 'File downloading'
            // },

        })
            .fetch("GET", imgUrl, {

            })
            .then((res) => {
                // setLoading(false)
                // setImage(res.path())
                // setErrMsg('')
                // let status = res.info().status;
                // console.log('status==>', status)
                console.log(res, 'end downloaded')
                alert('CSV Download Complete')
                readCsvFile(res.data)
            })
            .catch((errorMessage, statusCode) => {
                // setLoading(false)
                // setErrMsg('something wrong')
                console.log('errorMessage==>', errorMessage)
            })




    }

    const ChildGrid = (id, address) => {
        return (
            <View style={{ flexDirection: 'row', backgroundColor: 'white', width: screen.width, marginVertical: 4 }}>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{id}</Text>
                </View>

                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{address}</Text>
                </View>

            </View>
        )
    }

    const ListViewGrid = () => {
        return (
            <FlatList keyExtractor={item => item.id} data={csvAddress} renderItem={({ item }) => ChildGrid(item.id, item.address)} />
        )
    }

    return (
        <View style={GlobalStyle.container}>
            <Text style={{ paddingHorizontal: 8 }}>Parcel Data Present - Downloading New CSV Will Replace Current Data</Text>
            <View style={GlobalStyle.divider} />
            <View style={{ flexDirection: 'row', marginTop: 32, paddingHorizontal: 8 }}>
                <Text style={{ marginRight: 12, color: '#656565', fontWeight: '400' }}>Download CSV</Text>
                <TextInput
                    style={GlobalStyle.textInput}
                    onChangeText={onCsvFileName}
                    placeholder=""
                    returnKeyType='next'
                    keyboardType="default"
                    value={csvFileName}
                />
            </View>
            <TouchableOpacity
                style={[GlobalStyle.signinStyle, { marginLeft: 8 }]}
                onPress={() => callFileDownload()} >
                <Text>Download</Text>

            </TouchableOpacity>
            {csvAddress.length > 0 ? ListViewGrid() : <Text style={{ alignSelf: 'center' }}>There are no records to display</Text>}
        </View>
    );
}

export default CsvDownloadView;