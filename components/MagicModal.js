import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;

export default function ({ title, subtitle, description, icon, modalizeRef, uid }) {
    const [iTitle, onChangeTitle] = useState(title);
    const [iSubtitle, onChangeSubtitle] = useState(subtitle);
    const [iDescription, onChangeDescription] = useState(description);

    const closeModalize = () => {
        modalizeRef?.close();
    }

    const deleteMagic = (nameDoc) => {
        firebase.firestore().collection(uid + 'items').doc(nameDoc).delete()
        closeModalize();
    }

    const setMagic = (ltitle, lsubtitle, ldescription, licon) => {
        if (title != ltitle && title != '') {
            firebase.firestore().collection(uid + 'magics').doc(title).delete()
        }
        if(icon == "") {
            firebase.firestore().collection(uid + 'magics').doc(ltitle).set({
                title: ltitle,
                subtitle: lsubtitle,
                description: ldescription,
                icon: 'application'
            })
        } else {
            firebase.firestore().collection(uid + 'magics').doc(ltitle).set({
                title: ltitle,
                subtitle: lsubtitle,
                description: ldescription,
                icon: licon
            })
        }
        
        closeModalize();
    }

    return (
        <View style={styles.container}>
            {icon != ''
            ? 
                <Text style={styles.bigTitle}>Editar Magia</Text>
            :
                <Text style={styles.bigTitle}>Novo Magia</Text>
            }
            <TextInput 
                style={styles.inputText}
                placeholder="Type title's item."
                type="text"
                value={iTitle}
                onChangeText={onChangeTitle}
            />
            <TextInput 
                style={styles.inputText}
                placeholder="Type subtitle's item."
                type="text"
                value={iSubtitle}
                onChangeText={onChangeSubtitle}
            />
            <TextInput 
                style={styles.inputTextMultiline}
                placeholder="Type description's item."
                value={iDescription}
                multiline = {true}
                numberOfLines = {8}
                onChangeText={onChangeDescription}
            />
            <View style={styles.viewButton}>
                {icon != ''
                ?
                <TouchableOpacity style={styles.delButton} disabled={false} onPress={() => { deleteMagic(title); }} >
                    <Icon name="close-thick" size={30} style={styles.iconButton} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.delButton} disabled={false} onPress={() => { closeModalize(); }} >
                    <Icon name="close-thick" size={30} style={styles.iconButton} />
                </TouchableOpacity>
                } 

                {iTitle == ""
                ?
                <TouchableOpacity style={styles.addButton} disabled={true}>
                    <Icon name="check-bold" size={30} style={styles.iconButton} />
                </TouchableOpacity>
                :
                <TouchableOpacity  style={styles.addButton} disabled={false} onPress={() => { setMagic(iTitle, iSubtitle, iDescription, icon); }}>
                    <Icon name="check-bold" size={30} style={styles.iconButton} />
                </TouchableOpacity>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bigTitle: {
        fontFamily: 'Righteous_400Regular',
        fontSize: (deviceWidth/8),
        alignSelf: 'center',
        margin: (deviceWidth/24),
        color: '#212125'
    },
    inputText: {
        width: (deviceWidth/(36/30)),
        marginTop: (deviceWidth/36),
        padding: 10,
        fontSize: (deviceWidth/24),
        height: (deviceWidth/(36/5)),
        borderBottomWidth: 1,
        borderBottomColor: "#212125",
        marginLeft: "auto",
        marginRight: "auto",
        color: '#212125'
    },
    inputTextMultiline: {
        width: (deviceWidth/(36/30)),
        marginTop: (deviceWidth/36),
        padding: (deviceWidth/36),
        fontSize: (deviceWidth/24),
        height: (deviceWidth/(36/20)),
        borderWidth: 1,
        borderColor: "#212125",
        marginLeft: "auto",
        marginRight: "auto",
        color: '#212125',
        textAlignVertical: 'top',
    },
    addButton: {
        width: ((deviceWidth/(36/15))-10),
        padding: 10,
        height: (deviceWidth/(36/5)),
        backgroundColor: '#3CB371',
        color: '#212125',
        justifyContent: 'center',
        marginBottom: 30
    },
    delButton: {
        width: ((deviceWidth/(36/15))-10),
        padding: 10,
        height: (deviceWidth/(36/5)),
        color: '#212125',
        justifyContent: 'center',
        backgroundColor: '#DC143C'
    },
    viewButton: {
        flexDirection: 'row',
        width: (deviceWidth/(36/30)),
        justifyContent: 'space-between',
        marginTop: (deviceWidth/36),
        alignSelf: 'center'
    },
    iconButton: { 
        alignSelf: 'center', 
        color:'#fffefe', 
    }
})
