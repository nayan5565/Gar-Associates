import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { View, Button, Text, ScrollView, SafeAreaView } from 'react-native';
import React from "react";

export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();



    return (
        <View>
            <Text>GAR Photo App</Text>
            {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </View>

    )

}
export default PageLayout;