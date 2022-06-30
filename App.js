import React, { Component, useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingView from './src/views/LandingView';
import OneDriveView from './src/views/OneDriveView';
import OneDrive2View from './src/views/OneDrive2View';
import AppAuthView from './src/views/AppAuthView';
import OneDriveApi from './src/views/OneDriveApi';
import AzureAdAuthADView from './src/views/AzureAdAuthADView';
import MsalAdView from './src/views/MsalAdView';
import Auth0View from './src/views/Auth0View';

const Stack = createNativeStackNavigator();
const App = () => {

  useEffect(() => {

  }, [])

  return (

    <NavigationContainer >
      <Stack.Navigator initialRouteName="Landing">

        <Stack.Screen name="Landing" component={LandingView} />
        <Stack.Screen name="OneDrive" component={OneDriveView} />
        <Stack.Screen name="OneDrive2" component={OneDrive2View} />
        <Stack.Screen name="AppAuth" component={AppAuthView} />
        <Stack.Screen name="Auth0" component={Auth0View} />
        <Stack.Screen name="Api" component={OneDriveApi} />
        <Stack.Screen name="AAD" component={AzureAdAuthADView} />
        <Stack.Screen name="MSAL" component={MsalAdView} />
      </Stack.Navigator>

    </NavigationContainer>


  );

}

export default App;