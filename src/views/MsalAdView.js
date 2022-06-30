import React, { useState } from 'react';
import { AzureAD } from 'react-aad-msal';
import { authProvider } from '../constants/authProvider';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AzureInstance, AzureLoginView } from '@shedaltd/react-native-azure-ad-2'
import { REACT_SINGLE_APP_CLIENT_ID, REACT_SINGLE_APP_CLIENT_SECRET_VALUE, REACT_SINGLE_APP_REDIRECT_URL } from '../constants/one_drive_credential';


function MsalAdView(props) {

    const [loginSuccess, setLoginSuccess] = useState(false);
    const [azureLoginObject, setAzureLoginObject] = useState({});
    const credentials = {
        client_id: REACT_SINGLE_APP_CLIENT_ID,
        client_secret: REACT_SINGLE_APP_CLIENT_SECRET_VALUE,
        redirect_uri: REACT_SINGLE_APP_REDIRECT_URL,
        scope:
            "User.ReadBasic.All User.Read.All User.ReadWrite.All Mail.Read offline_access",
    };
    const azureInstance = new AzureInstance(credentials);

    const onLoginSuccess = async () => {
        try {
            const result = await azureInstance.getUserInfo();
            setLoginSuccess(true);
            setAzureLoginObject(result);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log("error getting user info");
            console.error(err);
        }
    };

    const signOut = () =>
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: "OK",
                onPress: () => {
                    // RCTNetworking.clearCookies(() => { });
                    setLoginSuccess(false);
                    navigation.navigate("Home");
                },
            },
        ]);

    if (!loginSuccess) {
        return (
            <AzureLoginView
                azureInstance={azureInstance}
                loadingMessage="Requesting access token again"
                onSuccess={onLoginSuccess}
            />
        );
    }

    const { userPrincipalName, givenName } = azureLoginObject;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome {givenName}</Text>
            <Text style={styles.text}>
                You logged into Azure with {userPrincipalName}
            </Text>
            <View style={styles.button}>
                <Button
                    onPress={signOut}
                    title="Sign Out"
                    style={styles.title}
                    color={buttonColour}
                    accessibilityLabel="Sign Out of Azure"
                />
            </View>
        </View>
    );
}

export default MsalAdView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 4,
    },
    title: {
        textAlign: "center",
        marginVertical: 8,
    },
    text: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
});