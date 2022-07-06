import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, TextInput, View, Dimensions, FlatList } from 'react-native';
import GlobalStyle from '../constants/GlobalStyle';
import { getData } from '../constants/helperFunction';
import { useDispatch, useSelector } from 'react-redux';


const screen = Dimensions.get('window')

// const list = [
//     { id: 1, address: 'Adress 1', details: 'Take New Photo', process: '2', status: 'Yes' },
//     { id: 2, address: 'Adress 2', details: 'Take New Photo', process: '0', status: 'No' },
//     { id: 3, address: 'Adress 3', details: 'Take New Photo', process: '0', status: 'Yes' },
//     { id: 4, address: 'Adress 4', details: 'Take New Photo', process: '0', status: 'No' },
//     { id: 5, address: 'Adress 5', details: 'Take New Photo', process: '1', status: 'Yes' },
//     { id: 6, address: 'Adress 6', details: 'Take New Photo', process: '0', status: 'No' },
//     { id: 7, address: 'Adress 7', details: 'Take New Photo', process: '0', status: 'Yes' },
//     { id: 8, address: 'Adress 8', details: 'Take New Photo', process: '0', status: 'No' }
// ]

function ParcelListView(props) {
    const [list, setList] = useState([]);
    const { csvDataList, status } = useSelector((state) => state.csvData)

    useEffect(() => {
        fetchAddress()
    }, []);

    const fetchAddress = async () => {
        // var addressList = await getData('csv_address')
        // setList(addressList)
        console.log('Fetch===>', csvDataList)
        console.log('List Size==>', csvDataList.length)
    }

    const ChildGrid = (address, detail, process, uploaded) => {
        return (
            <View style={{ flexDirection: 'row', width: screen.width, marginVertical: 4 }}>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{address}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, borderColor: 'grey', borderWidth: 1 }}
                        onPress={() => console.log('Click==>', address)} >
                        <Text style={{ color: 'grey', alignSelf: 'center', textTransform: 'capitalize', fontSize: 10 }}>{detail}</Text>

                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{process}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>{uploaded}</Text>
                </View>
            </View>
        )
    }

    const ListViewGrid = () => {

        return (
            <FlatList keyExtractor={item => item.id} data={csvDataList} renderItem={({ item }) => ChildGrid(item.address, item.details, item.process, item.status)} />
        )
    }


    return (
        <View style={GlobalStyle.container}>


            <View style={{ flexDirection: 'row', marginTop: 0, paddingHorizontal: 8 }}>
                <View>
                    <Text style={{ paddingHorizontal: 8, fontSize: 16 }}>Current</Text>
                    <Text style={{ paddingHorizontal: 8, fontSize: 16 }}>Property List</Text>
                    <Text style={{ paddingHorizontal: 8, fontSize: 12 }}>Select Property To Photograph</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ marginLeft: 8, backgroundColor: '#5d9cec', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}
                        onPress={{}} >
                        <Text style={{ color: 'white', alignSelf: 'center', textTransform: 'uppercase' }}>Upload Photos</Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginLeft: 8, marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5d9cec', padding: 8, borderRadius: 4 }}
                        onPress={{}} >
                        <Text style={{ color: 'white', alignSelf: 'center', textTransform: 'uppercase' }}>Upload CSV</Text>

                    </TouchableOpacity>
                </View>
            </View>
            <View style={GlobalStyle.divider} />
            <View style={{ flexDirection: 'row', height: 24, }}>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>Address</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>Detail</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>Processed</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Text style={{ textTransform: 'uppercase', alignSelf: 'center', fontSize: 12 }}>uploaded</Text>
                </View>
            </View>
            {ListViewGrid()}
        </View>
    );
}

export default ParcelListView;