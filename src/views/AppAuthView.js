import React from 'react';
import { View, Button, Text, ScrollView, SafeAreaView } from 'react-native';
import { authorize } from 'react-native-app-auth';
import { CLIENT_ID, TENANT_ID, REDIRECT_URL, REACT_SINGLE_APP_TENANT_ID, REACT_SINGLE_APP_CLIENT_ID, REACT_SINGLE_APP_REDIRECT_URL, MOBILE_REDIRECT_URL, MOBILE_REDIRECT_URL2, MOBILE_REDIRECT_URL3, MOBILE_REDIRECT_URL4 } from '../constants/one_drive_credential';

function AppAuthView(props) {

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
            // ondriveUser(authState.accessToken)
            createFile(authState.accessToken)

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

        var raw = JSON.stringify({
            "name": "TEST",
            "folder": {},

        });
        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
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
        <View>
            <Button title='Sign In' onPress={() => fetchTokenV1()} />
            <Button title='Sign In v2' onPress={() => fetchTokenV2()} />
        </View>
    );
}

export default AppAuthView;