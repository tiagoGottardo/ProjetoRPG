import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity } from "react-native";

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;

export default function ({ uid, modalizeRef }) {
    const [text, setText] = useState('');
    const [qtd, setQtd] = useState('');

    const NewAttribute = (nameDoc, newQtd) => {
        firebase.firestore().collection(uid + 'attributes').doc(nameDoc).set({
            title: nameDoc,
            qtd: parseInt(newQtd)
        })
        setText('');
        setQtd('');
        modalizeRef.current?.close();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.bigTitle}>Novo Atributo</Text>
            <TextInput 
                style={styles.inputText}
                placeholder="Type attribute's name."
                type="text"
                value={text}
                onChangeText={setText}
            />
            <View style={{ flexDirection: 'row' }}>
                <TextInput 
                    style={styles.inputQtd}
                    placeholder="Value"
                    type="number"
                    keyboardType="numeric"
                    value={qtd}
                    onChangeText={setQtd}
                />
                {text === "" || qtd === ""
                ?
                <TouchableOpacity style={styles.addButton} disabled={true}>
                    <Text style={styles.addText}>Adicionar Atributo</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.addButton} disabled={false} onPress={() => { NewAttribute(text, qtd); }}>
                    <Text style={styles.addText}>Adicionar Atributo</Text>
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
        fontSize: (deviceWidth/11),
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
    inputQtd: {
        width: (deviceWidth/(36/7)),
        marginTop: (deviceWidth/36),
        fontSize: (deviceWidth/24),
        padding: 10,
        height: (deviceWidth/(36/5)),
        borderBottomWidth: 1,
        borderBottomColor: "#212125",
        marginLeft: "auto",
        color: '#212125',
        textAlign: 'center'
    },
    addButton: {
        width: (deviceWidth/(36/20)),
        marginTop: (deviceWidth/36),
        padding: 10,
        height: (deviceWidth/(36/5)),
        backgroundColor: '#3CB371',
        marginRight: "auto",
        marginLeft: 30,
        color: '#212125',
        justifyContent: 'center',
        marginBottom: 30
    },
    addText: { 
        alignSelf: 'center', 
        color:'#fffefe', 
        fontSize: (deviceWidth/20) 
    }
})
