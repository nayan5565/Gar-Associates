import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView, SafeAreaView } from 'react-native';
import AzureAuth from 'react-native-azure-auth';
import * as msal from "@azure/msal-browser";
import { MsalAuthenticationTemplate, useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { CLIENT_ID, FILE_UPLOAD_APP_CLIENT_ID } from '../constants/one_drive_credential';

// import { logger } from 'handlebars';
// import { format } from 'prettier'
// import { } from '@env'
// import { Client } from "@microsoft/microsoft-graph-client";
// import { oneDriveAPI } from 'onedrive-api';


// const oneDriveAPI = require("onedrive-api");
// const { Client } = require("@microsoft/microsoft-graph-client");
// const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
// const { DeviceCodeCredential } = require("@azure/identity");

const azureAuth = new AzureAuth({
    clientId: 'a9652519-9f20-41fd-970f-28de005e09e2'
});



// const loginRequest = {
//     scopes: ["User.ReadWrite"]
// }

// let accountId = "";



function OneDriveView(props) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const accessToken = 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IjdjSldOd0hSR0V4aVc3c0pwRjhvYktydnkwRmRLQk44Y0cwemhIM3M5cmsiLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mOGNkZWYzMS1hMzFlLTRiNGEtOTNlNC01ZjU3MWU5MTI1NWEvIiwiaWF0IjoxNjU0MzIzNjY1LCJuYmYiOjE2NTQzMjM2NjUsImV4cCI6MTY1NDQxMDM2NSwiYWlvIjoiRTJaZ1lEalc2aDR1dTlkNWJrMzhET1c2K2JIM0FBPT0iLCJhcHBfZGlzcGxheW5hbWUiOiJEZW1vQXBwIiwiYXBwaWQiOiIzZTQzNzM5Yi03ZTc1LTRlNzQtYWNhMy03YzYyNzNkY2Q5NDYiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mOGNkZWYzMS1hMzFlLTRiNGEtOTNlNC01ZjU3MWU5MTI1NWEvIiwiaWR0eXAiOiJhcHAiLCJyaCI6IjAuQVQ0QU1lX04tQjZqU2t1VDVGOVhIcEVsV2dNQUFBQUFBQUFBd0FBQUFBQUFBQUFCQUFBLiIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJXVyIsInRpZCI6ImY4Y2RlZjMxLWEzMWUtNGI0YS05M2U0LTVmNTcxZTkxMjU1YSIsInV0aSI6IkhNTjZLYlRmcEVLblJMdjlzdlVIQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjA5OTdhMWQwLTBkMWQtNGFjYi1iNDA4LWQ1Y2E3MzEyMWU5MCJdLCJ4bXNfdGNkdCI6MTMzODMzNjY4NX0.WGAUf_IvXK8T36cHv3pZLQGpdS1T9lF9POsplE-X3l-_PM8F5CyVAgmjemSf2h2NzKv_O-X66ZLdwLDwAYC6-xdU1-a8Bjn8M_ongCyVosIttiwdkZuCmNpe2T8bZAThLWiFPg4x-tvXNjJfsrXN4BjruhkFmohFJoA1sRGTqKwUksvJUkGrPJyxIf0l-ZU0ozlWeqBPFyCq4Pem74xJFA-IraWjp_lkz1xtegtoMH9SznrA73uCdZRO29jgiQtuT1UxHrx27NXfCE_LbFYq_cuEV-1zrDkB3yyG2wmYqd9rVx7oWPL0t_v7RfrJHlofra0cpPb1kkFRhAMItzejfQ';


    async function authencationAzu() {
        try {
            let tokens = await azureAuth.webAuth.authorize({ scope: 'openid profile User.Read Mail.Read' })
            // this.setState({ accessToken: tokens.accessToken });
            let info = await azureAuth.auth.msGraphRequest({ token: tokens.accessToken, path: '/me' })
            // this.setState({ user: info.displayName, userId: tokens.userId })
            console.log('Token==>', tokens)
            console.log('Info==>', info)
            alert('Token==>', tokens + ' info==>' + info)
        } catch (error) {
            console.log(error)
            alert('error==>', JSON.stringify(error))
        }
    }


    //not working yet
    const microsoftLogin = () => {
        const config = {
            auth: {
                clientId: CLIENT_ID,
                redirectUri: "com.myapp://oauth/redirect/", //defaults to application start page
                postLogoutRedirectUri: "com.myapp://oauth/redirect/"
            }
        }
        const myMsal = new msal.PublicClientApplication(config);
        myMsal.loginPopup(loginRequest)
            .then(function (loginResponse) {
                accountId = loginResponse.account.homeAccountId;
                // Display signed-in user content, call API, etc.
            }).catch(function (error) {
                //login failure
                console.log(error);
            });
    }

    //not working
    const callMSA = async () => {


        const credential = new DeviceCodeCredential('f8cdef31-a31e-4b4a-93e4-5f571e91255a', '25e7c69e-b86c-44db-b4b1-04dad9041469', 'BI58Q~jEJozZzrIQpkTLU-rGBEvME12jkj0FlcGF');
        const authProvider = new TokenCredentialAuthenticationProvider(credential, {
            scopes: ["user.read"]
        });

        const client = Client.initWithMiddleware({
            debugLogging: true,
            authProvider
            // Use the authProvider object to create the class.
        });
        try {
            let userDetails = await client.api("/me").get();
            console.log('userDetails==>', userDetails);
        } catch (error) {
            console.error('userDetails err==>', error);
            throw error;
        }
    }



    // function WelcomeUser() {
    //     const { accounts } = useMsal();
    //     const username = accounts[0].username;
    //     console.log('name==>', username);
    //     return <Text>Welcome, {username}</Text>
    // }
    async function signInClickHandler(instance) {
        // instance.loginPopup();
        const msalConfig = {
            auth: {
                clientId: FILE_UPLOAD_APP_CLIENT_ID
            }
        };
        const request = { scopes: ["openid", "profile"] }
        const msalInstance = new msal.PublicClientApplication(msalConfig);

        await msalInstance.loginPopup();
        await msalInstance.acquireTokenPopup(request);
    }

    //not working
    // SignInButton Component returns a button that invokes a popup login when clicked
    function SignInButton() {
        // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
        const { instance } = useMsal();

        return <Button title='Sign In' onPress={() => signInClickHandler(instance)} />
    };
    useEffect(() => {

    }, []);
    function WelcomeUser() {
        const { accounts } = useMsal();
        const username = accounts[0].username;

        return <Text>Welcome, {username}</Text>
    }
    return (
        <>
            <View style={{ marginTop: 24 }}></View>
            <Button
                title="Azure Login"
                onPress={() => authencationAzu()}
            />
            <View style={{ marginTop: 24 }}></View>
            <Button
                title="Microsoft Login"
                onPress={() => microsoftLogin()}
            />
            <View style={{ marginTop: 24 }}></View>
            <Button
                title="MSA Login"
                onPress={() => callMSA()}
            />
            <View style={{ marginTop: 24 }}></View>
            <AuthenticatedTemplate>
                <Text>This will only render if a user is signed-in.</Text>
                <WelcomeUser />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Text>This will only render if a user is not signed-in.</Text>
                <SignInButton />
            </UnauthenticatedTemplate>
        </>

    );
}

export default OneDriveView;