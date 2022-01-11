import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;

export default function ({ title, subtitle, description, icon, target_color, modalizeRef, uid }) {
    const [iTitle, onChangeTitle] = useState(title);
    const [iSubtitle, onChangeSubtitle] = useState(subtitle);
    const [iDescription, onChangeDescription] = useState(description);

    const closeModalize = () => {
        modalizeRef?.close();
    }

    const deleteItem = (nameDoc) => {
        firebase.firestore().collection(uid + 'items').doc(nameDoc).delete()
        closeModalize();
    }

    const setItem = (ltitle, lsubtitle, ldescription, licon, ltarget_color) => {
        if (title != ltitle && title != '') {
            firebase.firestore().collection(uid + 'items').doc(title).delete()
        }
        if(icon == "") {
            firebase.firestore().collection(uid + 'items').doc(ltitle).set({
                title: ltitle,
                subtitle: lsubtitle,
                description: ldescription,
                icon: 'application',
                target_color: 0
            })
        } else {
            firebase.firestore().collection(uid + 'items').doc(ltitle).set({
                title: ltitle,
                subtitle: lsubtitle,
                description: ldescription,
                icon: licon,
                target_color: ltarget_color
            })
        }
        
        closeModalize();
    }


    return (
        <View style={styles.container}>
            {icon != ''
            ? 
                <Text style={styles.bigTitle}>Editar Item</Text>
            :
                <Text style={styles.bigTitle}>Novo Item</Text>
            }
            <TextInput 
                style={styles.inputText}
                placeholder="Digite o título do item."
                type="text"
                value={iTitle}
                onChangeText={onChangeTitle}
            />
            <TextInput 
                style={styles.inputText}
                placeholder="Digite o subtítulo do item."
                type="text"
                value={iSubtitle}
                onChangeText={onChangeSubtitle}
            />
            <TextInput 
                style={styles.inputTextMultiline}
                placeholder="Digite a descrição do item."
                value={iDescription}
                multiline = {true}
                numberOfLines = {8}
                onChangeText={onChangeDescription}
            />
            <View style={styles.viewButton}>
                {target_color == 0 || target_color == 1 || target_color == 2
                ?
                <TouchableOpacity style={styles.delButton} disabled={false} onPress={() => { deleteItem(title); }} >
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
                <TouchableOpacity  style={styles.addButton} disabled={false} onPress={() => { setItem(iTitle, iSubtitle, iDescription, icon, target_color); }}>
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
