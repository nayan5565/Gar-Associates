import React, { useState } from 'react';
import { View, Button, Text, ScrollView, SafeAreaView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { authorize } from 'react-native-app-auth';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CLIENT_ID, TENANT_ID, REDIRECT_URL, REACT_SINGLE_APP_TENANT_ID, REACT_SINGLE_APP_CLIENT_ID, REACT_SINGLE_APP_REDIRECT_URL, MOBILE_REDIRECT_URL, MOBILE_REDIRECT_URL2, MOBILE_REDIRECT_URL3, MOBILE_REDIRECT_URL4 } from '../constants/one_drive_credential';
import { graphConfig } from '../constants/authConfig';
import { Buffer } from "buffer";
import RNFetchBlob from 'rn-fetch-blob'
import { decode as atob, encode as btoa } from 'base-64'

// var Buffer = require("@craftzdog/react-native-buffer").Buffer;

function AppAuthView(props) {
    const [image, setImage] = useState();
    const [imageType, setImageType] = useState();
    const [imageName, setImageName] = useState();
    const [base64, setBase64] = useState();
    const [accessToken, setAccessToken] = useState();


    const pickSignleFile = async () => {
        // Pick a single file
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.images],
            });
            console.log(
                'PickImage===>', JSON.stringify(res)
            );
            setImage(res.uri)
            setImageType(res.type)
            setImageName(res.name)
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
                const source = { uri: res.uri };
                console.log('response', res.assets[0].uri);
                setBase64(res.assets[0].base64)
                setImageType(res.assets[0].type)
                setImage(res.assets[0].uri)
                setImageName(res.assets[0].fileName)
                // this.setState({
                //     filePath: res,
                //     fileData: res.data,
                //     fileUri: res.uri
                // });
            }
        });
    }

    const fetchTokenV1 = async () => {
        const config = {
            issuer: 'https://login.microsoftonline.com/' + REACT_SINGLE_APP_TENANT_ID,
            clientId: REACT_SINGLE_APP_CLIENT_ID,
            redirectUrl: MOBILE_REDIRECT_URL3,
            scopes: ['profile'],
            grantTypes: 'client_credentials',
            // additionalParameters: {
            //     resource: 'your-resource'
            // }
        };

        const config2 = {
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
            const authState = await authorize(config2);
            console.log('Token==>', authState.accessToken)
            setAccessToken(authState.accessToken)
            // fileUpload(authState.accessToken)
            // ondriveUser(authState.accessToken)
            // createFile(authState.accessToken)

        } catch (error) {
            console.log(error);
        }

    }

    const fetchTokenV2 = async () => {
        const config = {
            issuer: 'https://login.microsoftonline.com/' + TENANT_ID + '/v2.0',
            clientId: CLIENT_ID,
            redirectUrl: MOBILE_REDIRECT_URL3,
            scopes: ['openid', 'profile', 'email', 'offline_access']
        };
        const config2 = {
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
            const authState = await authorize(config2);
            console.log('Token v2==>', JSON.stringify(authState))
            ondriveUser(authState.accessToken)
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
                body: 'data:image/jpeg;base64,' + base64,
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
        const path = image.replace("file://", "");
        const formData = [];
        formData.push({
            name: "photo",
            filename: `photo.jpg`,
            data: RNFetchBlob.wrap(path)
        });
        var url = 'https://graph.microsoft.com/v1.0/me/drive/items/01YP3BE5LFUJ5GRP4SPZGJZJCY3W4MGN7N:/' + imageName + ':/content'
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

        console.log('response===>', JSON.stringify(response))
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

    const b64toBlob = async (sliceSize) => {
        // Convert Base64 data to Blob form and return
        // contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(base64);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: imageType });
        // const base64 = 'iVBORw0KGgoAAAANSUhEU ....'
        // const buffer = Buffer.from(base64);

        // const blob = new Blob([buffer], { type: 'image/jpeg' })

        // var url = "data:image/jpeg;base64," + base64

        // var url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="

        // const res = await fetch(url);
        // var base642 = base64.split(';');
        // let your_bytes = Buffer.from(base642, "base64");
        // const blob = new Blob([your_bytes], { type: 'image/jpeg' })
        // console.log('Blob==>', blob)

        // const RNFS = require("react-native-fs");
        // response.uri from react-native-camera
        // RNFS.readFile(image, "base64").then(data => {
        //     // binary data
        //     console.log('RNFS==>', data);
        // });
        // const path = image.replace("file://", "");
        // var blob = RNFetchBlob.wrap(path);
        console.log('Rblob==>', blob);
        callMsGraphFileUpload(accessToken, 'PhotoApp', imageName, blob)
        // return blob;

    }
    const callMsGraphFileUpload = async (accessToken, parent_id, filename, blob) => {
        /*
        Uploads a file to user's OneDrive account
        
        PARAMS: 
        accessToken, bearer token for connecting to Microsoft Graph
        parent_id, id for parent folder ("PhotoApp")
        filename, name for file being uploaded
        blob, binary stream of file
    
        RETURN:
        Promise, promise from call to MS Graph endpoint
        
        */

        const headers = new Headers();
        const bearer = `Bearer ${accessToken}`;

        headers.append("Authorization", bearer);

        const options = {
            method: "PUT",
            headers: headers,
            body: blob
        };


        var graph_endpoint = graphConfig.graphMeItemUploadEndpoint.replace("PARENT_ID", parent_id).replace("FILE_NAME", filename);

        // try {
        //     const response = await fetch(graph_endpoint, options);
        //     const result = await response.json();
        //     console.log('callMsGraphFileUpload res: ' + JSON.stringify(result));
        //     if (response.status == 200) {
        //         // alert(result.token_type)
        //         console.log('callMsGraphFileUpload: ' + JSON.stringify(result));
        //         alert(JSON.stringify(result))
        //     } else {
        //         alert(JSON.stringify(result))
        //     }
        // } catch (error) {
        //     console.log('callMsGraphFileUpload err: ' + JSON.stringify(error));
        //     alert(error)

        // }

        return fetch(graph_endpoint, options)
            .then(response => console.log('callMsGraphFileUpload==>', JSON.stringify(response.json())))
            .catch(error => console.log(error))
    }

    return (
        <View>
            <Button title='Sign In' onPress={() => fetchTokenV1()} />
            <Button title='pick image' onPress={() => pickSignleFile()} />
            <Button title='Pick single file' onPress={() => imageGalleryLaunch()} />
            <Button title='Upload file' onPress={() => fileUpload(accessToken)} />
            <Button title='Upload file blob' onPress={() => upload()} />
        </View>
    );
}

export default AppAuthView;