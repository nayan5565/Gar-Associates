import React from "react";
import { View, Button, Text, ScrollView, SafeAreaView } from 'react-native';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../constants/authConfig";

function handleLogin(instance) {
    instance.loginRedirect(loginRequest).catch(e => {
        console.error(e);
    });
}

/**
 * Renders a button to open a pop-up for login
 */

export const SignInButton = () => {
    const { instance } = useMsal();

    return (
        <Button title='Sign In' onPress={() => handleLogin(instance)}>Sign In</Button>
    );
}
export default SignInButton;