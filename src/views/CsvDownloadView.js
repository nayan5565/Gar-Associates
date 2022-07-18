import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, TextInput, View, FlatList, Dimensions, Platform, PermissionsAndroid, Alert } from 'react-native';
import { readFile } from 'react-native-fs';
import GlobalStyle from '../constants/GlobalStyle';
import { getData, storeData } from '../constants/helperFunction';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx'
import RNFetchBlob from 'rn-fetch-blob'
import { useDispatch, useSelector } from 'react-redux';
import { deleteAllImage, getAddressFromDB, getAddressFromSP, readCsvData } from '../redux/actions/dbAction';
import { ItemDivider, Loader } from '../constants/CustomWidget';

const screen = Dimensions.get('window')
const csvFilePath = 'https://clearpathinnovations-my.sharepoint.com/personal/testuser_cpimobile_com/_layouts/15/Doc.aspx?sourcedoc=%7B1AF9FDC0-38A1-4CB0-AA63-DC4B6D8CC3E0%7D&file=test%20list.csv'


function CsvDownloadView(props) {
    const dispatch = useDispatch()
    const getCsvData = (csvFile) => dispatch(readCsvData(csvFile))
    const getAddress = () => dispatch(getAddressFromSP())
    const deleteImages = () => dispatch(deleteAllImage())
    const [csvFileName, onCsvFileName] = useState("");
    const [downloading, setDownloading] = useState(false);
    const { csvDataList, status } = useSelector((state) => state.localDB)



    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            getAddress()

        }

        return () => { isMounted = false };
    }, []);

    const readCsvFile = (csvFile) => {
        getCsvData(csvFile)

        // readFile(csvFile, 'ascii')
        //     .then(res => {
        //         const wb = XLSX.read(res, { type: 'binary' })
        //         const wsname = wb.SheetNames[0]
        //         const ws = wb.Sheets[wsname]
        //         const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
        //         var temp = []
        //         storeData('csv_address', '')
        //         for (let i = 1; i < data.length; ++i) {
        //             temp.push({
        //                 id: data[i][0],
        //                 address: data[i][1],
        //                 propertyClass: data[i][3],
        //                 buildStyle: data[i][4],
        //                 details: 'Take New Photo',
        //                 process: '2',
        //                 status: i % 2 == 0 ? 'Yes' : 'No'
        //             })
        //         }
        //         setCsvAddress(temp)
        //         addressList = temp

        //         dispatch({
        //             type: GET_DATA,
        //             payload: addressList,
        //             status: 'success'
        //         })

        //         console.log('csv===>', JSON.stringify(temp))
        //         console.log('csv address size===>', addressList.length)
        //         storeData('csv_address', JSON.stringify(addressList))

        //     })

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
                            propertyClass: data[i][3],
                            buildStyle: data[i][4],
                            details: 'Take New Photo',
                            process: '0',
                            status: ''
                        })
                    }

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
        setDownloading(true)
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
                downloadFile(url)
            } else {
                setDownloading(false)
                alert(JSON.stringify(result))
            }
        } catch (error) {
            setDownloading(false)
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
                    deleteImages()
                    fetchDownloadUrl()
                } else { alert('Storage permission not granted') }
            } catch (error) {
                console.warn(error)
            }
        }
    }

    const downloadFile = (fileUrl) => {
        // setLoading(true)
        // setImage('')
        // setErrMsg('')
        // let imgUrl = 'https://static.scientificamerican.com/sciam/cache/file/EAF12335-B807-4021-9AC95BBA8BEE7C8D_source.jpg'

        // let newImgUri = imgUrl.lastIndexOf('/');
        // let imageName = imgUrl.substring(newImgUri);
        let fileName = '/' + csvFileName;
        console.log('Download url==>', fileUrl)
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
            .fetch("GET", fileUrl, {

            })
            .then((res) => {
                // setLoading(false)
                // setImage(res.path())
                // setErrMsg('')
                // let status = res.info().status;
                // console.log('status==>', status)
                console.log(res, 'end downloaded')
                alert('CSV Download Complete')
                storeData('csv_name', csvFileName)
                storeData('createdFolder', JSON.stringify(false))
                readCsvFile(res.data)
                setDownloading(false)
            })
            .catch((errorMessage, statusCode) => {
                setDownloading(false)
                console.log('errorMessage==>', errorMessage)
            })




    }

    const ChildView = (address, id, propertyClass, buildStyle) => {
        return (
            <View style={{ flexDirection: 'row', backgroundColor: 'white', width: screen.width, marginVertical: 4, paddingHorizontal: 4 }}>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 11 }}>{address}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 11 }}>{id}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 11 }}>{propertyClass}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 11 }}>{buildStyle}</Text>
                </View>

            </View>

        )
    }


    const ListView = () => {
        return (
            <FlatList keyExtractor={item => item.id} ItemSeparatorComponent={ItemDivider} data={csvDataList} renderItem={({ item }) => ChildView(item.address, item.id, item.propertyClass, item.buildStyle)} />
        )
    }

    const BuildTable = () => {
        return (
            <View style={{ flexDirection: 'row', height: 24, }}>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 10 }}>Address</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 10 }}>percel_id</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 10 }}>property_class</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 10 }}>build_style</Text>
                </View>

            </View>
        )
    }

    return (
        <View style={GlobalStyle.container}>
            <Text style={{ paddingHorizontal: 8, marginBottom: 8 }}>Parcel Data Present - Downloading New CSV Will Replace Current Data</Text>
            {ItemDivider()}
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
                style={[GlobalStyle.signinStyle, { marginLeft: 8, marginTop: 8 }]}
                onPress={() => callFileDownload()} >
                <Text >{downloading ? 'Downloading...' : 'Download'}</Text>

            </TouchableOpacity>
            {csvDataList.length > 0 ? BuildTable() : null}
            {csvDataList.length > 0 ? ItemDivider() : null}
            {csvDataList.length > 0 ? ListView() : <Text style={{ alignSelf: 'center' }}>There are no records to display</Text>}
        </View>
    );
}

export default CsvDownloadView;