import React, { useState } from 'react';
import { View, Button, Text, ScrollView, SafeAreaView, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { authorize } from 'react-native-app-auth';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CLIENT_ID, TENANT_ID, REDIRECT_URL, REACT_SINGLE_APP_TENANT_ID, REACT_SINGLE_APP_CLIENT_ID, REACT_SINGLE_APP_REDIRECT_URL, MOBILE_REDIRECT_URL, MOBILE_REDIRECT_URL2, MOBILE_REDIRECT_URL3, MOBILE_REDIRECT_URL4 } from '../constants/one_drive_credential';
import { graphConfig } from '../constants/authConfig';
import RNFetchBlob from 'rn-fetch-blob'
const images = [];
function AppAuthView(props) {
    const [image, setImage] = useState();
    const [uploading, setUploading] = useState(false);
    const [imageType, setImageType] = useState();
    const [imageName, setImageName] = useState();
    const [base64, setBase64] = useState();
    const [accessToken, setAccessToken] = useState();
    const [list, setList] = useState([]);


    const pickSignleFile = async () => {
        // Pick a single file
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
                allowMultiSelection: true
            });
            console.log(
                'PickImage===>', JSON.stringify(results)
            );
            for (const res of results) {
                var track = {
                    url: res.uri,
                    imageName: res.name,
                    imageType: res.type,
                };
                images.push(track)
                setImage(res.uri)
                setImageType(res.type)
                setImageName(res.name)
            }
            setList(images)
            console.log(
                'PickImageSize===>', images.length
            );
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    const cameraLaunch = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchCamera(options, (res) => {
            console.log('Response = ', res);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                const source = { uri: res.uri };
                console.log('response', JSON.stringify(res));
                setImage(res.assets[0].uri)
                console.log('image pick', res.assets[0].uri);
                // this.setState({
                //     filePath: res,
                //     fileData: res.data,
                //     fileUri: res.uri
                // });
            }
        });
    }

    const imageGalleryLaunch = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true,
        };
        launchImageLibrary(options, (res) => {
            console.log('Response = ', res);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                console.log('response', res.assets[0].uri);
                setBase64(res.assets[0].base64)
                setImageType(res.assets[0].type)
                setImage(res.assets[0].uri)
                setImageName(res.assets[0].fileName)
            }
        });
    }

    const fetchTokenV1 = async () => {

        const config = {
            clientId: CLIENT_ID,
            redirectUrl: MOBILE_REDIRECT_URL3,
            scopes: ["User.Read", "Files.ReadWrite"],
            additionalParameters: { prompt: 'select_account' },
            serviceConfiguration: {
                authorizationEndpoint:
                    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            },
        };

        // Log in to get an authentication token

        try {
            const authState = await authorize(config);
            console.log('Token==>', authState.accessToken)
            setAccessToken(authState.accessToken)
            // fileUpload(authState.accessToken)
            // ondriveUser(authState.accessToken)
            // createFile(authState.accessToken)

        } catch (error) {
            console.log(error);
        }

    }

    const ondriveUser = async (token) => {
        console.log('Login token: ' + token);
        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/me', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });
            const result = await response.json();
            console.log('ondriveUser res: ' + JSON.stringify(result));
            if (response.status == 200) {
                // alert(result.token_type)
                console.log('ondriveUser: ' + JSON.stringify(result));
                // ondriveUserByID(token, result.value[0].id)
                getSpecificFolderFiles(token, '1e93e66f-a605-4a5a-8b86-4dd273dc64cd')
                // alert(JSON.stringify(result))
            } else {
                alert(JSON.stringify(result))
            }
        } catch (error) {
            console.log('ondriveUser err: ' + JSON.stringify(error));
            alert(error)

        } finally {
            // setLoading(false);
        }

    }

    const getFiles = async (token, userId) => {
        console.log('getFiles userId: ' + token);
        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });
            const result = await response.json();
            console.log('getFiles res: ' + JSON.stringify(result));
            if (response.status == 200) {
                // alert(result.token_type)
                console.log('getFiles: ' + JSON.stringify(result));
                alert(JSON.stringify(result))
            } else {
                alert(JSON.stringify(result))
            }
        } catch (error) {
            console.log('getFiles err: ' + JSON.stringify(error));
            alert(error)

        } finally {
            // setLoading(false);
        }
    }

    const createFile = async (token) => {
        console.log('createFile token: ' + token);
        var rootUrl = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
        var photoappUrl = 'https://graph.microsoft.com/v1.0/me/drive/root:/photoapp:/children'

        var raw = JSON.stringify({
            "name": "TEST",
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
            console.log('createFile res: ' + JSON.stringify(result));
            if (response.status == 200) {
                // alert(result.token_type)
                console.log('createFile: ' + JSON.stringify(result));
                alert(JSON.stringify(result))
            } else {
                alert(JSON.stringify(result))
            }
        } catch (error) {
            console.log('createFile err: ' + JSON.stringify(error));
            alert(error)

        } finally {
            // setLoading(false);
        }
    }

    const fileUpload = async (token) => {
        console.log('fileUpload token: ' + token);

        var url = 'https://graph.microsoft.com/v1.0/me/drive/items/01YP3BE5LFUJ5GRP4SPZGJZJCY3W4MGN7N:/' + imageName + ':/content'

        // var raw = JSON.stringify({
        //     "@microsoft.graph.conflictBehavior": "replace",
        //     "description": "description",
        //     "fileSystemInfo": { "@odata.type": "microsoft.graph.fileSystemInfo" },
        //     "name": imageName
        // });
        // var photo = image + '/' + imageName
        // const path = image.replace("file://", "");
        // var blob = RNFetchBlob.wrap(path);
        // console.log('Rblob==>', blob);
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    "Content-Type": "multipart/form-data"
                },
                body: image,
            });
            const result = await response.json();
            console.log('fileUpload res: ' + JSON.stringify(result));
            if (response.status == 200) {
                // alert(result.token_type)
                console.log('fileUpload: ' + JSON.stringify(result));
                alert(JSON.stringify(result))
            } else {
                alert(JSON.stringify(result))
            }
        } catch (error) {
            console.log('fileUpload err: ' + JSON.stringify(error));
            alert(error)

        } finally {
            // setLoading(false);
        }
    }
    const upload = async () => {
        console.log('Image l==>', images.length)
        setUploading(true)
        var photoAppFolderID = '01YP3BE5PDD2QV4TVWOJH2BXNNI5CZKI6V:/';
        var childFolderID = '01YP3BE5P77T47UAXC2FC3CE674TTZ3MKG:/';
        for (const res of images) {

            const path = res.url.replace("file://", "");
            var url = 'https://graph.microsoft.com/v1.0/me/drive/items/' + childFolderID + res.imageName + ':/content'
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
        }

        setUploading(false)

    }
    const getSpecificFolderFiles = async (token, userId) => {
        console.log('getSpecificFolderFiles token: ' + token);
        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root:/photoapp:/children', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });
            const result = await response.json();
            console.log('getSpecificFolderFiles res: ' + JSON.stringify(result));
            if (response.status == 200) {
                // alert(result.token_type)
                console.log('getSpecificFolderFiles: ' + JSON.stringify(result));
                alert(JSON.stringify(result))
            } else {
                alert(JSON.stringify(result))
            }
        } catch (error) {
            console.log('getSpecificFolderFiles err: ' + JSON.stringify(error));
            alert(error)

        } finally {
            // setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <Button title='Sign In' onPress={() => fetchTokenV1()} />
            <View style={{ margin: 10 }} />
            {/* <Button title='pick image' onPress={() => pickSignleFile()} /> */}
            <Button title='Pick Image' onPress={() => cameraLaunch()} />
            {/* <Button title='Upload file' onPress={() => fileUpload(accessToken)} /> */}
            <Image style={{ width: 200, height: 200, alignSelf: 'center' }} source={{ uri: image }} />
            <Button title={uploading ? 'Uploading...' : 'Upload'} onPress={() => upload()} />
        </View>
    );
}

export default AppAuthView;