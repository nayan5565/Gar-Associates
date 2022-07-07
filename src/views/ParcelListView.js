import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, TextInput, View, Dimensions, FlatList } from 'react-native';
import GlobalStyle from '../constants/GlobalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { ItemDivider, Loader, VerticalGap } from '../constants/CustomWidget';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import { getData } from '../constants/helperFunction';
import { pickMultipleFile } from '../redux/actions/apiActions';


const screen = Dimensions.get('window')

// const list = [
//     { id: 1, address: 'Adress 1', details: 'Take New Photo', process: '2', status: 'Yes' },
//     { id: 2, address: 'Adress 2', details: 'Take New Photo', process: '0', status: 'No' },
//     { id: 3, address: 'Adress 3', details: 'Take New Photo', process: '0', status: 'Yes' },
//     { id: 4, address: 'Adress 4', details: 'Take New Photo', process: '0', status: 'No' },
//     { id: 5, address: 'Adress 5', details: 'Take New Photo', process: '1', status: 'Yes' },
//     { id: 6, address: 'Adress 6', details: 'Take New Photo', process: '0', status: 'No' },
//     { id: 7, address: 'Adress 7', details: 'Take New Photo', process: '0', status: 'Yes' },
//     { id: 8, address: 'Adress 8', details: 'Take New Photo', process: '0', status: 'No' }
// ]

function ParcelListView(props) {
    const dispatch = useDispatch()
    const fetchImageList = (itemData, index) => dispatch(pickMultipleFile(itemData, index))
    const { csvDataList, status, imageList, selectAddress } = useSelector((state) => state.csvData)
    const [uploading, setUploading] = useState(false);
    const [allUpdated, setAllUploaded] = useState(false);
    const [fileUploadNumber, setFileUploadNumber] = useState(1);
    const [itemIndex, setItemIndex] = useState(0);
    // const [imageList, setImageList] = useState([]);
    var images = [];

    useEffect(() => {
        // fetchAddress()
    }, []);

    const fetchAddress = async () => {
        // var addressList = await getData('csv_address')
        // setList(addressList)
        console.log('Fetch===>', csvDataList)
        console.log('List Size==>', csvDataList.length)
    }

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

    const createFile = async () => {
        setAllUploaded(false)
        setUploading(true)
        setFileUploadNumber(1)
        var token = await getData('token')
        // console.log('createFile token: ' + token);
        var rootUrl = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
        var photoappUrl = 'https://graph.microsoft.com/v1.0/me/drive/root:/photoapp:/children'

        var raw = JSON.stringify({
            "name": "Nayan",
            "folder": {},

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
                upload(result.id)
            } else {
                alert(JSON.stringify(result))
            }
        } catch (error) {
            console.log('createFile err: ' + JSON.stringify(error));
            alert(error)

        }
    }

    const upload = async (createdFolerId) => {

        var accessToken = await getData('token')
        console.log('Image l==>', imageList.length)
        // console.log('upload token==>', accessToken)

        var photoAppFolderID = '01YP3BE5PDD2QV4TVWOJH2BXNNI5CZKI6V:/';
        var childFolderID = '01YP3BE5P77T47UAXC2FC3CE674TTZ3MKG:/';
        var newFolderId = createdFolerId + ':/'
        console.log('folderID==>', newFolderId)
        var number = 1;
        var imageName = '';
        for (const res of imageList) {
            var extc = res.imageName.substring(res.imageName.lastIndexOf('.'))
            if (number > 1)
                imageName = selectAddress + ' ' + number + extc
            else imageName = selectAddress + extc
            console.log('Image name==>', imageName)
            const path = res.url.replace("file://", "");
            var url = 'https://graph.microsoft.com/v1.0/me/drive/items/' + newFolderId + imageName + ':/content'
            let response = await RNFetchBlob.fetch(
                "PUT",
                url,
                {
                    Accept: "application/json",
                    'Authorization': 'Bearer ' + accessToken,
                    "Content-Type": "multipart/form-data"
                },
                RNFetchBlob.wrap(path)
            );
            console.log('Image==>', res.url)
            console.log('response===>', JSON.stringify(response))
            number++;


            setFileUploadNumber(number)
        }


        var item = {
            ...csvDataList[itemIndex],
            status: 'Yes'
        }
        csvDataList[itemIndex] = item
        console.log('Change index', itemIndex)
        console.log('Change data', csvDataList[itemIndex])
        setUploading(false)
        setAllUploaded(true)
        alert('All image successfully uploaded')
    }

    const ChildView = (item, index) => {
        return (
            <View style={{ flexDirection: 'row', width: screen.width, marginVertical: 4 }}>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{item.address}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, borderColor: 'grey', borderWidth: 1 }}
                        onPress={() => { fetchImageList(item, index), setItemIndex(index) }} >
                        <Text style={{ color: 'grey', alignSelf: 'center', textTransform: 'capitalize', fontSize: 10 }}>{item.details}</Text>

                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{item.process}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{item.status}</Text>
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

            <Text style={{ color: 'white' }}>Image uploading {fileUploadNumber}/{imageList.length} </Text>

        )
    }

    return (
        <View style={GlobalStyle.container}>


            <View style={{ flexDirection: 'row', marginTop: 0, paddingHorizontal: 8 }}>
                <View>
                    <Text style={{ paddingHorizontal: 8, fontSize: 16 }}>Current</Text>
                    <Text style={{ paddingHorizontal: 8, fontSize: 16 }}>Property List</Text>
                    <Text style={{ paddingHorizontal: 8, fontSize: 12 }}>Select Property To Photograph</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ marginLeft: 8, backgroundColor: '#5d9cec', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                        onPress={() => createFile()} >
                        {uploading ? allUpdated ? null : UploadingText() : <Text style={{ color: 'white', alignSelf: 'center', textTransform: 'uppercase' }}>Upload Photos</Text>}

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginLeft: 8, marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5d9cec', padding: 8, borderRadius: 4 }}
                        onPress={() => createFile()} >
                        <Text style={{ color: 'white', alignSelf: 'center', textTransform: 'uppercase' }}>Upload CSV</Text>

                    </TouchableOpacity>
                </View>
            </View>
            {VerticalGap(12)}
            {ItemDivider()}
            {VerticalGap(8)}
            {BuildTable()}
            {ItemDivider()}
            {ListView()}
        </View>
    );
}

export default ParcelListView;