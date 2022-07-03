import React, { Component, useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingView from './src/views/LandingView';
import AppAuthView from './src/views/AppAuthView';
import OneDriveApi from './src/views/OneDriveApi';

const Stack = createNativeStackNavigator();
const App = () => {

  useEffect(() => {

  }, [])

  return (

    <NavigationContainer >
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingView} />
        <Stack.Screen name="AppAuth" component={AppAuthView} />
        <Stack.Screen name="Api" component={OneDriveApi} />
      </Stack.Navigator>

    </NavigationContainer>


  );

}

export default App;