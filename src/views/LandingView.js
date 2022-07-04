import React, { Component } from 'react';
import { View, Button, ScrollView, SafeAreaView } from 'react-native';

class LandingView extends Component {

    render() {
        return (
            <SafeAreaView style={{ flex: 1, padding: 12 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View>

                        <Button
                            title="App Auth"
                            onPress={() => this.props.navigation.navigate('One Drive')}
                        />
                        <View style={{ margin: 12 }}></View>
                        {/* <Button
                            title="One Drive Api"
                            onPress={() => this.props.navigation.navigate('Api')}
                        /> */}

                    </View>
                </ScrollView>

            </SafeAreaView>



        );
    }
}

export default LandingView;