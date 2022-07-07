import { Dimensions, StyleSheet } from "react-native";

const screen = Dimensions.get('window')

export default StyleSheet.create({
    bottomCard: {
        backgroundColor: 'green',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    divider: {
        backgroundColor: '#6c757d',
        height: 1,
        width: screen.width,
        marginTop: 8,
    },
    whiteText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'GreatVibes-Regular'
    },
    signinStyle: {
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eaeaea',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        marginTop: 32
    },


    textInput: {
        width: screen.width * 0.6,
        marginTop: Platform.OS === 'ios' ? 0 : -12,

        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'grey',
        paddingHorizontal: 16,
        paddingVertical: 7,

    },
    action: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        color: '#05375a',
    },

    container: {
        width: screen.width,
        alignItems: 'flex-start',
        paddingVertical: 16,
        flex: 1,
        backgroundColor: 'white'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#222831',
        justifyContent: 'center',
        alignItems: 'center',
    }

})