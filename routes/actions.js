import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;

function ActionsScreen({ navigation, route }) {
  const [mod, setMod] = useState([]);

  const getMod = () => {
    firebase.firestore().collection(route.params.idUser + 'mod').orderBy('id')
    .onSnapshot((querySnapshot) => {
      let listModObjects = [];
      querySnapshot.forEach((doc) => {
        var mod = {
          id: doc.data().id,
          title: doc.data().title,
          qtd: doc.data().qtd,
        };
        listModObjects.push(mod);
      });
      setMod(listModObjects);
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
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { navigation.openDrawer(); }} style={{ width: (deviceWidth/6), height: (deviceWidth/6), alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='menu' size={deviceWidth/12} color="#fffefe" />
          </TouchableOpacity>
          <Text style={{ fontSize: (deviceWidth/14.4), alignSelf: 'center', alignContent: 'center', fontFamily: 'Righteous_400Regular', color: '#fffefe' }}>
            Ações
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={() => { }} style={{ width: (deviceWidth/6), height: (deviceWidth/6), alignItems: 'center', justifyContent: 'center' }} >
            <Icon name='dice-d20' size={deviceWidth/12} color='#fffefe' />
          </TouchableOpacity>
        </View>
        <Text style={styles.bigTitle}>Modificadores</Text>
        <FlatList
          style={{ alignSelf: 'center', marginBottom: 10, }}
          data={mod}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return(
              <View style={styles.List}>
                <View style={styles.container} flexDirection='row'>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
                <View style={ { flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                  <Text style={styles.title}>{item.qtd}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row-reverse', marginLeft: 3 }}>
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
      </ScrollView>
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
    borderRadius: (deviceWidth/12),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bigTitle: {
    fontFamily: 'Righteous_400Regular',
    fontSize: (deviceWidth/11),
    alignSelf: 'center',
    marginBottom: 20,
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
    width: (deviceWidth - 50),
    height: (deviceWidth/9),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: (deviceWidth/18),
    alignContent: 'space-around',
    marginBottom: (deviceWidth/36),
    backgroundColor: '#212125'
  },
  title: {
    marginLeft: 12,
    fontSize: deviceWidth/24,
    alignSelf: 'center',
    color: '#fffefe'
  }
})


export default ActionsScreen;