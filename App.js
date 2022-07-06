import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingView from './src/views/LandingView';
import AppAuthView from './src/views/AppAuthView';
import OneDriveApi from './src/views/OneDriveApi';
import MyDrawer from './src/components/MyDrawer';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './src/redux/reducer/rootReducer';

const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createNativeStackNavigator();
const App = () => {


  return (

    <Provider store={store}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingView} options={{ headerShown: false }} />
          <Stack.Screen name="One Drive" component={AppAuthView} />
          <Stack.Screen name="Api" component={OneDriveApi} />
          <Stack.Screen name="Home" component={MyDrawer} options={{ headerShown: false }} />
        </Stack.Navigator>

      </NavigationContainer>
    </Provider>


  );

}

export default App;