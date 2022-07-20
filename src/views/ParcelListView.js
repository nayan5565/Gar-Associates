import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, TextInput, View, Dimensions, FlatList, Image } from 'react-native';
import GlobalStyle from '../constants/GlobalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { ImageView, ItemDivider, Loader, VerticalGap } from '../constants/CustomWidget';
import RNFetchBlob from 'rn-fetch-blob';
import { checkConnected, ConvertToCSV, createFolderApi, getData, getUnique, storeData, tokenRefresh } from '../constants/helperFunction';
import { getImageData, getImageLength, pickMultipleFile, getAllImage, updateImage } from '../redux/actions/dbAction';

const screen = Dimensions.get('window')
var totalPendingImage = 0;

function ParcelListView({ navigation }) {
    const dispatch = useDispatch()
    const fetchImageList = (itemData, index) => dispatch(pickMultipleFile(itemData, index))
    const getImages = () => dispatch(getAllImage())
    const updateUploadedImage = (item, index, number, uploadStatus) => dispatch(updateImage(item, index, number, uploadStatus))
    // const { csvDataList, status, selectAddress } = useSelector((state) => state.csvData)
    const { csvDataList, status, selectAddress, imageList } = useSelector((state) => state.localDB)
    const [uploading, setUploading] = useState(false);
    const [allUpdated, setAllUploaded] = useState(false);
    const [isTakeImageView, setIsTakeImageView] = useState(false);
    const [fileUploadNumber, setFileUploadNumber] = useState(1);
    const [selectedItem, setSelectedItem] = useState();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [csvUploading, setCsvUploading] = useState(false);
    // const [totalPendingImage, setTotalPendingImage] = useState(0);

    useEffect(() => {
        getImages()
    }, []);

    // const pickMultipleFile = async (pickAddress) => {
    //     setAddress(pickAddress)
    //     // setShowImage(true)
    //     try {
    //         const results = await DocumentPicker.pickMultiple({
    //             type: [DocumentPicker.types.images],
    //             allowMultiSelection: true
    //         });
    //         console.log(
    //             'PickImage===>', JSON.stringify(results)
    //         );
    //         setImageList([])

    //         var pickImage = [];
    //         for (const res of results) {
    //             var track = {
    //                 url: res.uri,
    //                 imageName: res.name,
    //                 imageType: res.type,
    //             };
    //             console.log(
    //                 'PickImage add===>', res.uri
    //             );
    //             pickImage.push(track)
    //             setImageList(prev => ([...prev, track]))
    //             // setImage(res.uri)
    //             // setImageType(res.type)
    //             // setImageName(res.name)
    //         }
    //         // setList(images)
    //         // console.log(
    //         //     'PickImage===>', list[0].url
    //         // );
    //         // setShowImage(false)
    //         images = pickImage
    //         // setImageList(images)
    //         console.log('Image len==>', images.length)
    //         console.log(
    //             'PickImage2===>', images[0].url
    //         );
    //     } catch (err) {
    //         if (DocumentPicker.isCancel(err)) {
    //             // User cancelled the picker, exit any dialogs or menus and move on
    //         } else {
    //             throw err;
    //         }
    //     }
    // }

    const createFolder = async () => {
        var isNetwork = await checkConnected()
        if (!isNetwork) {
            alert('Network connection lost!!')
            return
        }
        const pendingImages = imageList.filter(e => e.status === 'pending');
        // setTotalPendingImage(pendingImages.length)
        // console.log('totalPending==>', pendingImages.length)
        totalPendingImage = pendingImages.length
        console.log('totalPendingHook==>', totalPendingImage)
        if (totalPendingImage > 0) {
            setAllUploaded(false)
            setUploading(true)
            setFileUploadNumber(1)
            var folderCreated = await getData('createdFolder')
            var folderID = await getData('newFolderID')
            if (folderCreated == 'true') {

                // alert(folderID)
                if (folderID != 'No Data' && folderID != '') {
                    upload(folderID)
                }

            } else {
                var fileName = await getData('csv_name')
                var folderName = fileName.split('.')[0]
                var token = await getData('token')
                // console.log('createFile token: ' + token);
                var rootUrl = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
                var photoappUrl = 'https://graph.microsoft.com/v1.0/me/drive/root:/photoapp:/children'

                var raw = JSON.stringify({
                    "name": folderName.toLocaleLowerCase(),
                    "folder": {},
                    "@microsoft.graph.conflictBehavior": "rename"

                });
                try {
                    const response = await fetch(photoappUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: raw,
                    });
                    const result = await response.json();
                    console.log('createFile res: ' + response.status);
                    if (response.status == 201) {
                        console.log('createFile: ' + JSON.stringify(result));
                        // alert(createdFolerId)
                        storeData('newFolderID', result.id)
                        storeData('createdFolder', JSON.stringify(true))
                        upload(result.id)
                    } else if (response.status == 401) {
                        // alert('Token expired!!Please login again!!')
                        // setAllUploaded(false)
                        // setUploading(false)
                        // navigation.popToTop()
                        // alert('Token expired!! refreshing token')
                        var token = await tokenRefresh()
                        createFolder()
                        return
                    } else {
                        var folderID = await getData('newFolderID')
                        if (folderID == 'No Data') {
                            setAllUploaded(false)
                            setUploading(false)
                            alert(JSON.stringify(result))
                        } else {
                            upload(folderID)
                        }

                    }
                } catch (error) {
                    var folderID = await getData('newFolderID')
                    if (folderID == 'No Data') {
                        setAllUploaded(false)
                        setUploading(false)
                        console.log('createFile err: ' + JSON.stringify(error));
                        alert(error)
                    } else {
                        upload(folderID)
                    }
                }
            }
        }

    }

    const upload = async (createdFolerId) => {
        var accessToken = await getData('token')
        // console.log('Image l==>', imageList.length)
        // console.log('upload token==>', accessToken)

        var photoAppFolderID = '01YP3BE5PDD2QV4TVWOJH2BXNNI5CZKI6V:/';
        var childFolderID = '01YP3BE5P77T47UAXC2FC3CE674TTZ3MKG:/';
        var newFolderId = createdFolerId + ':/'
        // console.log('folderID==>', newFolderId)
        var number = 1;
        var imageName = '';
        var addressStatus = 'Yes';
        var extractIndex = 0;
        var extractImageIndex = 0;
        const uniqueAddress = getUnique(imageList, 'address')

        for (const ads of uniqueAddress) {
            var numberByAddress = 1;
            extractIndex = csvDataList.findIndex(e => e.address === ads.address);

            const imagesByAddress = imageList.filter(e => e.address === ads.address && e.status === 'pending');
            // console.log('imagesByAddress==>', imagesByAddress.length)
            if (imagesByAddress.length > 0) {
                const uploadedImages = imageList.filter(e => e.address === ads.address && e.status === 'uploaded');
                if (uploadedImages.length > 0) {
                    numberByAddress = uploadedImages[uploadedImages.length - 1].imageNumber
                    numberByAddress = numberByAddress + 1
                }
                for (const res of imagesByAddress) {
                    var isNetwork = await checkConnected()
                    if (!isNetwork) {
                        alert('Network connection lost!!')
                        return
                    }
                    var extc = res.imageName.substring(res.imageName.lastIndexOf('.'))
                    if (numberByAddress > 1)
                        imageName = res.address + ' ' + numberByAddress + extc
                    else imageName = res.address + extc
                    // console.log('Image name==>', imageName)
                    const path = res.imageUrl;
                    var url = 'https://graph.microsoft.com/v1.0/me/drive/items/' + newFolderId + imageName + ':/content'
                    let response = await RNFetchBlob.fetch(
                        "PUT",
                        url,
                        {
                            Accept: "application/json",
                            'Authorization': 'Bearer ' + accessToken,
                            "Content-Type": "multipart/form-data"
                        },
                        RNFetchBlob.wrap(decodeURIComponent(path))
                    );
                    console.log('response.status==>', response.respInfo.status)
                    console.log('response===>', JSON.stringify(response))
                    extractImageIndex = imageList.findIndex(e => e.id === res.id);
                    var uploadStatus = 'pending';
                    if (response.respInfo.status === 201) {
                        uploadStatus = 'uploaded'
                    } else {

                        //401 is expired token
                        // alert('Token expired!!Please login again!!')

                        if (response.respInfo.status === 401) {
                            // alert('Token expired!! refreshing token')
                            var token = await tokenRefresh()
                            console.log('get ref token==>', token)
                            var folderID = await getData('newFolderID')
                            upload(folderID)
                            // navigation.popToTop()
                        } else if (response.respInfo.status === 404) {
                            //404 is folder not found
                            storeData('newFolderID', '')
                            storeData('createdFolder', JSON.stringify(false))
                            createFolder()
                        } else {
                            addressStatus = 'No'
                            setAllUploaded(false)
                            setUploading(false)
                        }

                        return
                    }
                    updateUploadedImage(res, extractImageIndex, numberByAddress, uploadStatus)
                    if (response.respInfo.status === 201) {
                        numberByAddress++;
                    }

                    number++;
                    setFileUploadNumber(number)
                }
                // console.log('Change index', extractIndex)
                // console.log('Change data', csvDataList[extractIndex])
                var item = {
                    ...csvDataList[extractIndex],
                    photoUploaded: csvDataList[extractIndex].process,
                    status: addressStatus
                }
                // console.log('Change data2==>', item)
                csvDataList[extractIndex] = item

                storeData('csv_address', JSON.stringify(csvDataList))
            } else console.log('no pending image')

        }
        setUploading(false)
        setAllUploaded(true)
        alert('All image successfully uploaded')
    }

    const uploadCsv = async (csvFile) => {
        var accessToken = await getData('token')
        var folderID = await getData('newFolderID')
        var newFolderId = folderID + ':/'
        console.log('folderID==>', accessToken)

        var isNetwork = await checkConnected()
        if (!isNetwork) {
            alert('Network connection lost!!')
            setCsvUploading(false)
            return
        }
        var fileName = await getData('csv_name')
        var folderName = fileName.split('.')[0]
        let tempDate = new Date()
        let fDate = (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + '-' + tempDate.getFullYear()
        let fTime = tempDate.getHours() + '-' + tempDate.getMinutes() + '-' + tempDate.getSeconds()
        let dateTime = fDate + '_' + fTime
        var amPm = 'AM'
        if (tempDate.getHours() > 11)
            amPm = 'PM'

        var csvFileName = folderName.toLocaleLowerCase() + '_' + dateTime + '_' + amPm + '.csv'
        console.log(csvFileName)
        // console.log('Image name==>', imageName)
        const path = csvFile;
        var url = 'https://graph.microsoft.com/v1.0/me/drive/items/' + newFolderId + csvFileName + ':/content'
        let response = await RNFetchBlob.fetch(
            "PUT",
            url,
            {
                Accept: "application/json",
                'Authorization': 'Bearer ' + accessToken,
                "Content-Type": "multipart/form-data"
            },
            RNFetchBlob.wrap(decodeURIComponent(path))
        );
        console.log('response.status==>', response.respInfo.status)
        // console.log('response===>', JSON.stringify(response))
        setCsvUploading(false)
        if (response.respInfo.status === 201) {
            alert('CSV uploaded as ' + csvFileName)
        } else {
            //401 is expired token
            if (response.respInfo.status === 401) {
                // alert('Token expired!! refreshing token')
                // navigation.popToTop()
                var token = await tokenRefresh()
                console.log('get ref token==>', token)
                uploadCsv(path)
            } else if (response.respInfo.status === 404) {
                //404 is folder not found

            }
        }


    }


    const writeCSV = async (csvDataList) => {
        try {
            setCsvUploading(true)
            var HEADER = 'PARCEL_ID,ADDRESS, PRINT_KEY, PROPERTY_CLASS, BUILD_STYLE, SFLA, LAT, LONG, PHOTOS_TAKEN, PHOTOS_UPLOADED,  ALL_PHOTOS_UPLOADED\n';

            const FILE_PATH = `${RNFetchBlob.fs.dirs.DownloadDir}/data.csv`;
            const csvString = `${HEADER}${ConvertToCSV(csvDataList)}`;
            RNFetchBlob.fs
                .writeFile(FILE_PATH, csvString, "utf8")
                .then(() => {
                    console.log(`wrote file ${FILE_PATH}`);
                    uploadCsv(FILE_PATH)

                })
                .catch(error => { alert(error); setCsvUploading(false) });

        } catch (error) {
            // Error retrieving data
            alert(error)
        }
    };

    const ChildView = (item, index) => {
        return (
            <View style={{ flexDirection: 'row', width: screen.width, marginVertical: 4, paddingHorizontal: 6, }}>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{item.address}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, borderColor: 'grey', borderWidth: 1 }}
                        // onPress={() => { fetchImageList(item, index) }} >
                        onPress={() => { setIsTakeImageView(true), setSelectedItem(item), setSelectedIndex(index) }} >
                        <Text style={{ color: 'grey', alignSelf: 'center', textTransform: 'capitalize', fontSize: 10 }}>Take New Photo</Text>

                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, alignSelf: 'center', }}>

                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{item.process}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{item.status == 'NO PHOTOS TAKEN' ? '' : item.status}</Text>
                </View>
            </View>
        )

    }

    const ListView = () => {

        return (
            <FlatList keyExtractor={item => item.id} ItemSeparatorComponent={ItemDivider} data={csvDataList} renderItem={({ item, index }) => ChildView(item, index)} />
        )
    }

    const BuildTable = () => {
        return (
            <View style={{ flexDirection: 'row', height: 24, }}>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>Address</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>Detail</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>Processed</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>uploaded</Text>
                </View>
            </View>
        )
    }
    const UploadingText = () => {

        return (

            <Text style={{ color: 'white' }}>Image uploading {fileUploadNumber}/{totalPendingImage} </Text>

        )
    }

    const UploadTopView = () => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 0, paddingHorizontal: 8 }}>
                <View>
                    <Text style={{ paddingHorizontal: 8, fontSize: 16 }}>Current</Text>
                    <Text style={{ paddingHorizontal: 8, fontSize: 16 }}>Property List</Text>
                    <Text style={{ paddingHorizontal: 8, fontSize: 12 }}>Select Property To Photograph</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ marginLeft: 8, backgroundColor: '#5d9cec', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                        onPress={() => createFolder()} >
                        {uploading ? allUpdated ? null : UploadingText() : <Text style={{ color: 'white', alignSelf: 'center', textTransform: 'uppercase' }}>Upload Photos</Text>}

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginLeft: 8, marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5d9cec', padding: 8, borderRadius: 4 }}
                        onPress={async () => {
                            // var fileName = await getData('csv_name')
                            // var folderName = fileName.split('.')[0]
                            // alert(folderName)

                            // storeData('createdFolder', JSON.stringify(true))
                            // var folderCreated = await getData('createdFolder')

                            // const csvL = csvDataList[extractIndex]
                            // const newPost = imageList.filter(e => e.address === '168 N Long St');

                            // const uniqueAddress = getUnique(imageList, 'address')
                            // let list = imageList
                            // let unique = []
                            // list.forEach(item => {
                            //     if (!unique.includes(item.address)) {
                            //         unique.push(item.address)
                            //     }
                            // })

                            // alert(uniqueAddress[0].address)
                            // var extractIndex = 0;
                            // for (const ads of uniqueAddress) {
                            //     extractIndex = csvDataList.findIndex(e => e.address === ads.address);
                            //     const imagesByAddress = imageList.filter(e => e.address === ads.address && e.status === 'uploaded');
                            //     var number = imagesByAddress[imagesByAddress.length - 1].imageNumber
                            //     console.log('uniq address==>', ads.address)
                            //     console.log('uniq len==>', uniqueAddress.length)
                            //     // console.log('imagesByAddress==>', JSON.stringify(imagesByAddress))
                            //     for (const res of imagesByAddress) {
                            //         console.log('status==>', res.imageNumber)
                            //     }
                            // }

                            var folderID = await getData('newFolderID')
                            if (folderID != 'No Data')
                                writeCSV(csvDataList)
                            else {
                                setCsvUploading(true)
                                await createFolderApi()
                                writeCSV(csvDataList)
                            }
                            // var token = await tokenRefresh()
                            // console.log('get ref token==>', token)

                        }} >
                        <Text style={{ color: 'white', alignSelf: 'center', textTransform: 'uppercase' }}>{csvUploading ? 'Uploading...' : 'Upload CSV'}</Text>

                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const TakeImageView = (item, index) => {
        var imagesByAddress = []
        if (imageList.length > 0)
            imagesByAddress = imageList.filter(e => e.address === item.address);
        return (
            <View style={{ paddingHorizontal: 12 }}>
                <View style={{ flexDirection: 'row', width: screen.width, justifyContent: 'space-between' }} >
                    <TouchableOpacity
                        style={{ paddingHorizontal: 8, paddingVertical: 8, borderRadius: 4, borderColor: 'grey', borderWidth: 1 }}
                        // onPress={() => { fetchImageList(item, index) }} >
                        onPress={() => { setIsTakeImageView(false) }} >
                        <Text style={{ color: 'grey', alignSelf: 'center', textTransform: 'capitalize', fontSize: 12 }}>Return To Parcel List</Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 12, paddingVertical: 8, marginRight: 24, borderRadius: 4, borderColor: 'green', backgroundColor: 'green', borderWidth: 1 }}
                        onPress={() => { fetchImageList(item, index) }} >
                        <Text style={{ color: 'white', alignSelf: 'center', textTransform: 'capitalize', fontSize: 12 }}>Take Photo</Text>

                    </TouchableOpacity>
                </View>
                {VerticalGap(8)}
                {/* <Text>ID: {item.id}</Text> */}
                <View style={{ alignItems: 'center' }}>
                    <Text>Address: {item.address}</Text>
                    <Text>Property Class: {item.propertyClass}</Text>
                    <Text>Building Class: {item.buildStyle}</Text>
                    <Text>SFLA: {item.SFLA}</Text>
                    <Text>Lat, Long: {item.LAT}, {item.LONG}</Text>
                    {VerticalGap(8)}
                    <Text>Number Of Images: {imagesByAddress.length}</Text>
                    <Text>Last Image Taken:</Text>

                    {imagesByAddress.length > 0 ? ImageView(imagesByAddress[imagesByAddress.length - 1].imageUrl) : null}
                </View>

            </View>
        )
    }

    const ParcelView = () => {
        return (
            <View >
                {UploadTopView()}
                {VerticalGap(12)}
                {ItemDivider()}
                {VerticalGap(8)}
                {BuildTable()}
                {ItemDivider()}
                {ListView()}
            </View>
        )
    }

    return (
        <View style={GlobalStyle.container}>
            {isTakeImageView ? TakeImageView(selectedItem, selectedIndex) : ParcelView()}
        </View>
    );
}

export default ParcelListView;