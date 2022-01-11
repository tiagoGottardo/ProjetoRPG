import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modalize } from 'react-native-modalize';
import { TapGestureHandler } from 'react-native-gesture-handler';

import NewAttribute from '../components/NewAttribute';
import Header from '../components/Header';
import Dice from '../components/Dice';

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function ActionsScreen({ navigation, route }) {
  const [mod, setMod] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const modalizeRef = useRef(null);
  const diceModalizeRef = useRef(null);

  const openModalize = () => {
    modalizeRef.current?.open();
  }

  const deleteAttribute = (nameDoc) => {
    firebase.firestore().collection(route.params.idUser + 'attributes').doc(nameDoc).delete()
  }

  const getMod = () => {
    firebase.firestore().collection(route.params.idUser + 'mod').orderBy('id')
    .onSnapshot((querySnapshot) => {
      let listModObjects = [];
      querySnapshot.forEach((doc) => {
        var mods = {
          id: doc.data().id,
          title: doc.data().title,
          qtd: doc.data().qtd,
        };
        listModObjects.push(mods);
      });
      setMod(listModObjects);
    })
  }

  const getAttributes = () => {
    firebase.firestore().collection(route.params.idUser + 'attributes').orderBy('title')
    .onSnapshot((querySnapshot) => {
      let listAttObjects = [];
      querySnapshot.forEach((doc) => {
        var att = {
          title: doc.data().title,
          qtd: doc.data().qtd,
        };
        listAttObjects.push(att);
      });
      setAttributes(listAttObjects);
    })
  }

  const AddOrLess = (nameDoc, collection, addOrLess) => {
    if (addOrLess == "+") {
      firebase.firestore().collection(route.params.idUser + collection).doc(nameDoc).update({
        qtd: firebase.firestore.FieldValue.increment(1)
      });
    } else {
      firebase.firestore().collection(route.params.idUser + collection).doc(nameDoc).update({
        qtd: firebase.firestore.FieldValue.increment(-1)
      });
    }
  }

  useEffect(() => {
    getMod();
    getAttributes();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ height: (deviceWidth/(36/8)) }}/>
        <Text style={styles.bigTitle}>Modificadores</Text>
        <FlatList
          style={{ alignSelf: 'center', marginBottom: 10 }}
          data={mod}
          keyExtractor={item => item.title}
          renderItem={({item}) => {
            return(
              <View style={styles.List}>
                <View style={{ flex: 10 }} flexDirection='row'>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
                <View style={ { flex: 2, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                  <Text style={styles.title}>{item.qtd}</Text>
                </View>
                <View style={{ flex: 3, flexDirection: 'row-reverse', marginLeft: 3 }}>
                  <TouchableOpacity style={styles.Button} onPress={() => { AddOrLess(item.title, 'mod', '+');}}>
                    <Icon name='plus-box' size={(deviceWidth/14) - 10} style={styles.IconButton} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Button} onPress={() => AddOrLess(item.title, 'mod', '-')}>
                    <Icon name='minus-box' size={(deviceWidth/14) - 10} style={styles.IconButton} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        />
        <View style={styles.line} />
        <Text style={styles.bigTitle} >Atributos</Text>
        <FlatList
          style={{ alignSelf: 'center', marginBottom: 10, }}
          data={attributes}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return(
              <View style={styles.List}>
                <TapGestureHandler
                  numberOfTaps={2}
                  onActivated={() => deleteAttribute(item.title)}
                >
                  <View style={{ flex: 10 }} flexDirection='row'>
                    <Text style={styles.title}>{item.title}</Text>
                  </View>
                </TapGestureHandler>
                <View style={ { flex: 2, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                  <Text style={styles.title}>{item.qtd}</Text>
                </View>
                <View style={{ flex: 3, flexDirection: 'row-reverse', marginLeft: 3 }}>
                  <TouchableOpacity style={styles.Button} onPress={() => { AddOrLess(item.title, 'attributes', '+');}}>
                    <Icon name='plus-box' size={(deviceWidth/14) - 10} style={styles.IconButton} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.Button} onPress={() => AddOrLess(item.title, 'attributes', '-')}>
                    <Icon name='minus-box' size={(deviceWidth/14) - 10} style={styles.IconButton} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        />
      </ScrollView>
      <Header 
            iconLeft='bars' 
            iconRight="dice-d20"
            fLeft={() => navigation.openDrawer()} 
            fRight={() => { diceModalizeRef.current?.open(); }}
            title="Ações"
        />
      <View style={styles.addView}>
          <TouchableOpacity style={styles.addButton} onPress={() => { openModalize(); }}>
            <Text style={styles.addText}>Novo Atributo</Text>
          </TouchableOpacity>
        </View>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
        >
          <NewAttribute uid={route.params.idUser} modalizeRef={modalizeRef} />
        </Modalize>
        <Modalize
          ref={diceModalizeRef}
          snapPoint={deviceHeight}
        >
          <Dice uid={route.params.idUser} />
        </Modalize>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: (deviceWidth/6),
    flexDirection: 'row',
    backgroundColor: '#212125',
    margin: (deviceWidth/24),
    marginBottom: 0,
    borderRadius: (deviceWidth/12),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bigTitle: {
    fontFamily: 'Righteous_400Regular',
    fontSize: (deviceWidth/11),
    alignSelf: 'center',
    margin: (deviceWidth/24),
    color: '#212125'
  },
  line: {
    height: 1,
    backgroundColor: '#212125'
  },
  Button: {
    width: (deviceWidth/14),
    height: (deviceWidth/14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3
  },
  IconButton: {
    marginRight: 5,
    marginLeft: 5,
    color: '#fffefe'
  },
  List: {
    width: (deviceWidth /(36/31)),
    height: (deviceWidth/(36/5)),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: (deviceWidth/18),
    alignContent: 'space-around',
    marginBottom: (deviceWidth/36),
    backgroundColor: '#212125',
    elevation: 3
  },
  title: {
    marginLeft: 12,
    fontSize: deviceWidth/24,
    alignSelf: 'center',
    color: '#fffefe'
  },
  addView: { 
    width: (deviceWidth), 
    height: (deviceWidth/6), 
    backgroundColor: '#3CB371', 
    alignSelf: 'center', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  addButton: { 
    flexDirection: 'row', 
    width: (deviceWidth/(36/31)), 
    height: (deviceWidth/9), 
    justifyContent: 'center' 
  },
  addText: { 
    alignSelf: 'center', 
    color:'#fffefe', 
    fontSize: (deviceWidth/18) 
  }
})


export default ActionsScreen;