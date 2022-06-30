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

        // Log in to get an authentication token
        const authState = await authorize(config);
        console.log('Token==>', authState.accessToken)
        ondriveUser(authState.accessToken)
    }

    const fetchTokenV2 = async () => {
        const config = {
            issuer: 'https://login.microsoftonline.com/' + TENANT_ID + '/v2.0',
            clientId: CLIENT_ID,
            redirectUrl: MOBILE_REDIRECT_URL3,
            scopes: ['openid', 'profile', 'email', 'offline_access']
        };

        // Log in to get an authentication token
        const authState = await authorize(config);
        console.log('Token v2==>', JSON.stringify(authState))

    }

    const ondriveUser = async (token) => {
        console.log('Login token: ' + token);
        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/users', {
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


    return (
        <View>
            <Button title='Sign In' onPress={() => fetchTokenV1()} />
            <Button title='Sign In v2' onPress={() => fetchTokenV2()} />
        </View>
    );
}

export default AppAuthView;