import React from 'react';
import { Button, View } from 'react-native';
import Auth0 from 'react-native-auth0';
const auth0 = new Auth0({ domain: 'dev-9d67eqtm.us.auth0.com', clientId: '0wOYQu78aUCICQjmxY5jgMTE59Dsbjlb' });

function Auth0View(props) {

    function login() {
        auth0
            .webAuth
            .authorize({ scope: 'openid profile email' })
            .then(credentials =>
                // Successfully authenticated
                // Store the accessToken
                // this.setState({ accessToken: credentials.accessToken })
                console.log('AccessToken==>', credentials.accessToken)
            )
            .catch(error => console.log(error));
    }


    return (
        <View>
            <Button
                onPress={login}
                title="Login"

            />
        </View>
    );
}

export default Auth0View;