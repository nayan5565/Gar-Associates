import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, TextInput, View } from 'react-native';
import GlobalStyle from '../constants/GlobalStyle';

function CsvDownloadView(props) {
    const [phone, onChangePhone] = useState("");
    return (
        <View style={GlobalStyle.container}>
            <Text style={{ paddingHorizontal: 8 }}>Parcel Data Present - Downloading New CSV Will Replace Current Data</Text>
            <View style={GlobalStyle.divider} />
            <View style={{ flexDirection: 'row', marginTop: 32, paddingHorizontal: 8 }}>
                <Text style={{ marginRight: 12, color: '#656565', fontWeight: '400' }}>Download CSV</Text>
                <TextInput
                    style={GlobalStyle.textInput}
                    onChangeText={onChangePhone}
                    placeholder=""
                    returnKeyType='next'
                    keyboardType="default"
                    value={phone}
                />
            </View>
            <TouchableOpacity
                style={[GlobalStyle.signinStyle, { marginLeft: 8 }]}
                onPress={{}} >
                <Text>Download</Text>

            </TouchableOpacity>
        </View>
    );
}

export default CsvDownloadView;