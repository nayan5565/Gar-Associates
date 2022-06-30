import React from 'react';
import { View } from 'react-native';
import { AzureAdInstance, AzureAdView } from 'react-native-azure-ad-auth';
import { FILE_UPLOAD_APP_CLIENT_ID, FILE_UPLOAD_APP_CLIENT_SECRET_VALUE, FILE_UPLOAD_APP_REDIRECT_URL, FILE_UPLOAD_APP_TENANT_ID } from '../constants/one_drive_credential';

// Constant credentials from Azure AD registration
var credentials = {
    authority: 'https://login.microsoftonline.com/' + FILE_UPLOAD_APP_TENANT_ID,
    client_id: FILE_UPLOAD_APP_CLIENT_ID,
    client_secret: FILE_UPLOAD_APP_CLIENT_SECRET_VALUE,
    redirect_uri: FILE_UPLOAD_APP_REDIRECT_URL,
    scope: 'openid user.read offline_access'
};

function AzureAdAuthADView() {
    const azureAdInstance = new AzureAdInstance(credentials);

    const onLoginSuccess = () => {
        azureAdInstance.getUserInfo().then(result => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        })
    }

    onLoginCancel = () => {
        // Show cancel message
    }
    return (
        <View>
            <AzureAdView
                azureAdInstance={this.azureAdInstance}
                loadingMessage="Requesting access token"
                onSuccess={onLoginSuccess}
                onCancel={onLoginCancel}
            />
        </View>
    );
}

export default AzureAdAuthADView;