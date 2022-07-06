import React, { Component } from 'react';
import { View, SafeAreaView, Image, TouchableOpacity, Dimensions, Text, ActivityIndicator } from 'react-native';
import GlobalStyle from '../constants/GlobalStyle';
import imagePath from '../constants/imagePath';
import { authorize } from 'react-native-app-auth';
import { CLIENT_ID, MOBILE_REDIRECT_URL3 } from '../constants/one_drive_credential';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, showSuccess, storeData } from '../constants/helperFunction';

const screen = Dimensions.get('window')

class LandingView extends Component {
    state = { isLogin: false };


    login = async () => {

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
        this.setState({ isLogin: true });
        try {
            const authState = await authorize(config);
            this.setState({ isLogin: false });
            await storeData('token', authState.accessToken)
            // console.log('Login res==>', JSON.stringify(authState))
            this.props.navigation.navigate('Home')
        } catch (error) {
            console.log(error);
        }

    }

    render() {
        return (
            <SafeAreaView style={{ padding: 12 }}>

                <View style={{ alignItems: 'center', marginTop: 32 }}>
                    <Image resizeMode='contain' style={{ width: screen.width * 0.8, alignSelf: 'center' }} source={imagePath.appLogo} />

                    <Text style={{ color: '#656565', marginTop: 10, fontSize: 20, alignSelf: 'center' }}>GAR Photo App</Text>

                    <TouchableOpacity
                        style={GlobalStyle.signinStyle}
                        onPress={() => this.login()} >
                        {this.state.isLogin ? <ActivityIndicator /> : <Text>Sign In {this.state.isLogin}</Text>}

                    </TouchableOpacity>

                    <View style={{ margin: 12 }}></View>
                    <Text style={{ color: '#656565', fontSize: 16, alignSelf: 'center' }}>Log In Required For Access</Text>

                </View>


            </SafeAreaView>



        );
    }
}

export default LandingView;