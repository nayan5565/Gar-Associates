import AsyncStorage from "@react-native-async-storage/async-storage";

import { showMessage } from "react-native-flash-message";

const showError = (msg) => {
    showMessage({
        message: msg,
        icon: 'danger',
        type: "danger",
    });
}
const showSuccess = (msg) => {
    showMessage({
        message: msg,
        icon: 'success',
        type: "success",
    });
}

export {
    showError,
    showSuccess
}

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log('store err==>', e)
        // saving error
    }
}

export const getData = async (key) => {
    var data;
    try {
        const value = await AsyncStorage.getItem(key)
        // console.log('store==>', value)
        if (value !== null) {
            data = value;
        } else data = 'No Data'

    } catch (e) {
        // error reading value
        data = 'err'
    }
    return data;
}

export const millisToMinutesAndSeconds = (millis) => {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" :
        "") + seconds);
}

export const secondsToHms = (d) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

export const secondsToHms2 = (d) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "00:";
    var sDisplay = s > 0 ? s + (s < 10 ? "0" : "") : "00";
    // return hDisplay + mDisplay + sDisplay;
    return (s == 60 ? (m + 1) + ":00" : (m < 10 ? "0" :
        "") + m + ":" + (s < 10 ? "0" :
            "") + s);
}