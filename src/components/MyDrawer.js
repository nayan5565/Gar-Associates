import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import DrawerContent from './DrawerContent';
import CsvDownloadView from '../views/CsvDownloadView';
import ParcelListView from '../views/ParcelListView';

const Drawer = createDrawerNavigator();

function MyDrawer() {

    return (

        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} initialRouteName="CSV" useLegacyImplementation='false'>
            <Drawer.Screen name="CSV" component={CsvDownloadView} options={{ headerShown: true, title: 'CSV Download' }} />
            <Drawer.Screen name="Parcel" component={ParcelListView} options={{ headerShown: true, title: 'Parcel List' }} />
        </Drawer.Navigator>


    );
}

export default MyDrawer;