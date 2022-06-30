import React from "react";
import { useMsal } from "@azure/msal-react";
import { View, Button, Text, ScrollView, SafeAreaView } from 'react-native';

function handleLogout(instance) {
    instance.logoutRedirect().catch(e => {
        console.error(e);
    });
}

/**
 * Renders a button which, when selected, will open a popup for logout
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    return (
        <Button title='Sign Out' onPress={() => handleLogout(instance)}>Sign Out</Button>
    );
}

export default SignOutButton;