import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;

export default function ({ title, iconModalizeRef, uid, col }) {
    const [icons, setIcons] = useState([]);

    const getIcons = () => {
        firebase.firestore().collection('icons').orderBy('name')
        .onSnapshot((querySnapshot) => {
          let listIconObjects = [];
          querySnapshot.forEach((doc) => {
            var icon = {
              name: doc.data().name
            };
            listIconObjects.push(icon);
          });
          setIcons(listIconObjects);
        })
    }

    const editIcon = (iconSelected) => {
        console.log(uid, col, title);
        firebase.firestore().collection(uid + col).doc(title).update({
            icon: iconSelected
        })
        iconModalizeRef?.close()
    }

    useEffect(() => {
        getIcons();
    }, [])

    return(
        <View style={styles.container}>
            <Text style={styles.bigTitle}>Icons</Text>
            <FlatList
                style={{ alignSelf: 'center', marginBottom: (deviceWidth/(36/1)), width: (deviceWidth/(36/32))}}
                data={icons}
                numColumns={6}
                keyExtractor={item => item.name}
                renderItem={({item}) => {
                return(
                    <View style={styles.icon}>
                        <TouchableOpacity style={styles.Button} onPress={() => { editIcon(item.name) }}>
                            <Icon name={item.name} size={(deviceWidth/(36/3.8))} style={styles.IconButton} />
                        </TouchableOpacity>
                    </View>
                )
            }}
            />
        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    icon: {
        margin: 4
    },
    Button: {
        width: (deviceWidth/(36/4.5)),
        height: (deviceWidth/(36/4.5)),
        alignItems: 'center',
        justifyContent: 'center',
    },
    IconButton: {
        color: '#212125'
    },
    bigTitle:{
        fontFamily: 'Righteous_400Regular',
        fontSize: (deviceWidth/8),
        alignSelf: 'center',
        margin: (deviceWidth/24),
        color: '#212125'
    }
})