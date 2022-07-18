import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Avatar, Caption, Drawer, Paragraph, Switch, Title, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import imagePath from '../constants/imagePath';

const screen = Dimensions.get('window')


function DrawerContent({ props, navigation }) {
    const [isDarkTheme, setDarkTheme] = useState(false)
    const toggleTheme = () => {
        setDarkTheme(!isDarkTheme)
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <Image resizeMode='contain' style={{ width: screen.width * 0.8, alignSelf: 'center' }} source={imagePath.appLogo} />
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <Drawer.Section style={styles.bottomDrawerSection}>
                            <DrawerItem icon={({ color, size }) => (
                                <Icon
                                    name='exit-to-app'
                                    color={color}
                                    size={size} />)}
                                label='Sign out'
                                onPress={() => { navigation.popToTop() }}
                            />
                        </Drawer.Section>
                        <DrawerItem
                            activeTintColor='teal'
                            activeBackgroundColor='teal'
                            icon={({ color, size }) => (
                                <Icon
                                    name='download-outline'
                                    color={color}
                                    size={size} />)}
                            label='CSV Download'
                            onPress={() => { navigation.navigate('CSV') }}
                        />
                        <DrawerItem
                            activeTintColor='teal'
                            activeBackgroundColor='teal'
                            icon={({ color, size }) => (
                                <Icon
                                    name='transfer'
                                    color={color}
                                    size={size} />)}
                            label='Parcel List'
                            onPress={() => { navigation.navigate('Parcel') }}
                        />

                    </Drawer.Section>

                </View>
            </DrawerContentScrollView>
            {/* <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem icon={({ color, size }) => (
                    <Icon
                        name='exit-to-app'
                        color={color}
                        size={size} />)}
                    label='Sign out'
                    onPress={() => { }}
                />
            </Drawer.Section> */}
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 20
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    section: {
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3
    },
    drawerSection: {
        marginTop: 16,
    },
    bottomDrawerSection: {
        marginBottom: 16,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }

})

export default DrawerContent;