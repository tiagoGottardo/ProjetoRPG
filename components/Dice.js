import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;

export default function ({ uid }) {
    const [sidesQtd, setSidesQtd] = useState(1);
    const [diceTypes] = useState([4, 6, 8, 10, 12, 20, 100]);
    const [dicesQtd, setDicesQtd] = useState(1);
    const [additional, setAdditional] = useState(0);
    const [uriPlayer, setUriPlayer] = useState('');
    const [lastDice, setLastDice] = useState({});

    const getUserInfo = () => {
        firebase.firestore().collection(uid + 'user').doc('FotoPerfil').get().then((doc) => {
            setUriPlayer(doc.data().uri)
        })
      }
    
      const getRollDice = () => {
        firebase.firestore().collection('dice').orderBy('id', 'desc').onSnapshot((querySnapshot) => {
          var contentDice = [];
          querySnapshot.forEach((doc) => {
            var roll = {
              id: doc.data().id,
              uriPlayer: doc.data().uriPlayer,
              numberDices: doc.data().numberDices,
              numberSides: doc.data().numberSides,
              add: doc.data().add,
              numbersRolled: doc.data().numbersRolled,
              result: doc.data().result
            };
            contentDice.push(roll);
          });
          setLastDice(contentDice);
        })
      }

    const addOrLess = (state, plusMinus) => {
        if (plusMinus == '+') {
            switch (state) {
                case 'sidesQtd': 
                    if (sidesQtd != 6) {
                        setSidesQtd(sidesQtd + 1);
                    }
                break;
                case 'dicesQtd': 
                    setDicesQtd(dicesQtd + 1);
                break;
                case 'additional': 
                    setAdditional(additional + 1);
                break;
            }
        } else {
            switch (state) {
                case 'sidesQtd': 
                    if (sidesQtd != 0) {
                        setSidesQtd(sidesQtd - 1);
                    }
                break;
                case 'dicesQtd':
                    if (dicesQtd != 1) {
                        setDicesQtd(dicesQtd - 1);
                    }
                break;
                case 'additional': 
                    setAdditional(additional - 1);
                break;
            }
        }
    }

    const sendResult = (result, numbersRolled, numberDices, numberSides, add, player_uri) => {
        var stringNumbersRolled = "";
        for(var i = 0; i < numbersRolled.length; i++) {
            if(i == 0) {
                stringNumbersRolled = (numbersRolled[i]);
            } else {
                stringNumbersRolled = (stringNumbersRolled + ', ' + numbersRolled[i]);
            }
            if(i == numbersRolled.length - 1) {
                stringNumbersRolled = (stringNumbersRolled + ".");
            }
        }
        firebase.firestore().collection('dice').doc(`${lastDice[0].id + 1}`).set({
            id: lastDice[0].id + 1,
            uriPlayer: player_uri,
            numberDices: numberDices,
            numberSides: numberSides,
            add: add,
            numbersRolled: stringNumbersRolled,
            result: result
        })

        firebase.firestore().collection('dice').doc(`${lastDice[4].id}`).delete();
    }

    const rollDice = () => {
        var result = 0;
        var numbersRolled = [];
        var thatNumberRolled = 0;
        for(var i = 0; i < dicesQtd; i++) {
            thatNumberRolled = (Math.floor(Math.random() * (diceTypes[sidesQtd])) + 1);
            numbersRolled.push(thatNumberRolled);
            result += thatNumberRolled;
        }
        result += additional
        sendResult(result, numbersRolled, dicesQtd, diceTypes[sidesQtd], additional, uriPlayer);
    }

    useEffect(() => {
        getUserInfo();
        getRollDice();
    }, [])
    return (
        <View style={styles.container}>
            <Text style={styles.bigTitle}>Dados</Text>
            <View style={styles.item}>
                <Text style={styles.littleTitle}>Tipo de dado</Text>
                <View style={styles.plusMinus}>
                    <TouchableOpacity style={styles.buttonLR} onPress={() => { addOrLess('sidesQtd', '-'); }}>
                        <Icon name="caret-left" size={25} style={{ color: '#fffefe' }}/>
                    </TouchableOpacity>
                    <Text style={styles.unidade}>D{diceTypes[sidesQtd]}</Text>
                    <TouchableOpacity style={styles.buttonLR} onPress={() => { addOrLess('sidesQtd', '+'); }}>
                        <Icon name="caret-right" size={25} style={{ color: '#fffefe' }}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.item}>
                <Text style={styles.littleTitle} >Número de dados</Text>
                <View style={styles.plusMinus}>
                    <TouchableOpacity style={styles.buttonPlusMinus} onPress={() => { addOrLess('dicesQtd', '-'); }}>
                        <Icon name="minus" size={20} style={styles.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.unidade}>{dicesQtd}</Text>
                    <TouchableOpacity style={styles.buttonPlusMinus} onPress={() => { addOrLess('dicesQtd', '+'); }}>
                        <Icon name="plus" size={20} style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.item}>
                <Text style={styles.littleTitle}>Complemento</Text>
                <View style={styles.plusMinus}>
                    <TouchableOpacity style={styles.buttonPlusMinus} onPress={() => { addOrLess('additional', '-'); }}>
                        <Icon name="minus" size={15} style={styles.icon}/>
                    </TouchableOpacity>
                    <Text style={styles.unidade}>{additional}</Text>
                    <TouchableOpacity style={styles.buttonPlusMinus} onPress={() => { addOrLess('additional', '+'); }}>
                        <Icon name="plus" size={15} style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity  style={styles.greenButton} disabled={false} onPress={() => { rollDice(); }}>
                {additional == 0
                ?
                <Text style={styles.greenButtonText}>Rolar {dicesQtd}D{diceTypes[sidesQtd]}</Text>
                :
                <View />
                }
                {additional > 0
                    ?
                    <Text style={styles.greenButtonText}>Rolar {dicesQtd}D{diceTypes[sidesQtd]} + {additional}</Text>
                    :
                    <View />
                }
                {additional < 0
                ?
                <Text style={styles.greenButtonText}>Rolar {dicesQtd}D{diceTypes[sidesQtd]} - {(-1)*additional}</Text>
                :
                <View />
                }
                
            </TouchableOpacity>
            <View>
                <Text style={styles.bigTitle}>Histórico de jogadas</Text>
                <ScrollView>
                    <FlatList
                        style={{ alignSelf: 'center', marginBottom: 10, }}
                        data={lastDice}
                        keyExtractor={item => item.title}
                        renderItem={({item}) => {
                            return(
                                <View style={styles.diceContainer}>
                                    <View style={styles.col}>
                                        <View style={styles.viewImage}>
                                            <Image
                                                style={styles.imagePlayer}
                                                source={{ uri: item.uriPlayer }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.col}>
                                        <Text style={styles.result}>{item.result}</Text>
                                        <ScrollView style={styles.roll}>
                                            <Text style={{ fontSize: (deviceWidth/23), color: '#fffefe' }}>{item.numbersRolled}</Text>
                                        </ScrollView>
                                    </View>
                                </View>
                            )
                        }}
                    />
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    result: {
        flex: 1.8,
        fontSize: (deviceWidth/6), 
        color: '#fffefe',
        fontFamily: 'Righteous_400Regular',
        width: (deviceWidth/(36/13)),
        textAlign: 'center',
    },
    col: {
        width: (deviceWidth/(36/15)),
        height: (deviceWidth/(36/12))
    },
    viewImage: {
        width: (deviceWidth/(36/15)),
        justifyContent: 'center',
        alignItems: 'center'
    },
    roll: {
        flex: 1,
        width: (deviceWidth/(36/13.5)),
        padding: 3,
    },
    imagePlayer: {
        height: (deviceWidth/(36/12)),
        width: (deviceWidth/(36/12)),
        borderRadius: (deviceWidth/(36/3)),
        borderColor: "#fffefe",
        borderWidth: 1
    },
    diceContainer: {
        backgroundColor: '#212125',
        flexDirection: 'row',
        borderRadius: (deviceWidth/(36/3)),
        width: (deviceWidth/(36/30)),
        height: (deviceWidth/(36/15)),
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bigTitle: {
        fontFamily: 'Righteous_400Regular',
        fontSize: (deviceWidth/11),
        alignSelf: 'center',
        margin: (deviceWidth/24),
        color: '#212125'
    },
    littleTitle: {
        fontFamily: 'Righteous_400Regular',
        fontSize: (deviceWidth/18),
        alignSelf: 'center',
        color: '#212125',
        flex: 7
    },
    item: {
        flexDirection: 'row',
        marginVertical: 5,
        width: (deviceWidth/(36/30)),
        alignSelf: 'center',
        height: 40
    },
    plusMinus: {
        backgroundColor: '#212125',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        flex: 5
    },
    icon: {
        color: '#212125'
    },
    unidade: {
        color: '#fffefe',
        fontSize: 18
    },
    buttonPlusMinus: {
        backgroundColor: '#fffefe',
        marginHorizontal: 5,
        borderRadius: 10,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonLR: {
        backgroundColor: '#212125',
        marginHorizontal: 5,
        borderRadius: 10,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    greenButton: {
        width: (deviceWidth/(36/30)),
        padding: 10,
        height: (deviceWidth/(36/5)),
        backgroundColor: '#3CB371',
        color: '#212125',
        justifyContent: 'center',
        marginTop: 15,
        alignSelf: 'center',
        marginBottom: 15
    },
    greenButtonText: { 
        alignSelf: 'center', 
        color:'#fffefe',
        fontWeight: 'bold',
        fontSize: (deviceWidth/16) 
    }
})