import React, { Component } from 'react';
import { View, Button, ScrollView, SafeAreaView } from 'react-native';

class LandingView extends Component {

    render() {
        return (
            <SafeAreaView style={{ flex: 1, padding: 12 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View>
                        <Button
                            title="One Drive"
                            onPress={() => this.props.navigation.navigate('OneDrive')}
                        />

                        <Button
                            title="One Drive 2"
                            onPress={() => this.props.navigation.navigate('OneDrive2')}
                        />

                        <Button
                            title="App Auth"
                            onPress={() => this.props.navigation.navigate('AppAuth')}
                        />
                        <Button
                            title="Auth0"
                            onPress={() => this.props.navigation.navigate('Auth0')}
                        />

                        <Button
                            title="One Drive Api"
                            onPress={() => this.props.navigation.navigate('Api')}
                        />
                        <Button
                            title="AAD"
                            onPress={() => this.props.navigation.navigate('AAD')}
                        />

                        <Button
                            title="MSAL"
                            onPress={() => this.props.navigation.navigate('MSAL')}
                        />

                    </View>
                </ScrollView>

            </SafeAreaView>



        );
    }
}

export default LandingView;