import React from "react";
import { ActivityIndicator, PermissionsAndroid, Platform, View } from "react-native";

export const ItemDivider = () => {
    return (
        <View
            style={{
                height: 1,
                width: "100%",
                backgroundColor: "#eaeaea",
            }}
        />
    );
}
export const VerticalGap = (gap) => {
    return (
        <View
            style={{
                marginVertical: gap
            }}
        />
    );
}
export const Loader = (color, size) => {
    return (
        <ActivityIndicator color={color} size={size} />
    )
}