import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView, StyleSheet, FlatList, Platform, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import { DataContext } from '../components/DataContext';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function EditProfileScreen({ route, navigation }) {
  const [user, setUser] = useState([{ uri: "https://icon-library.com/images/user-png-icon/user-png-icon-22.jpg" }, { name: 'User' }, { qtd: 0 }, { qtd: 0 }, { desc: '' }]);
  const {data} = useContext(DataContext);
  const [text, onChangeText] = useState(user[1].name);

  const editTextInput = () => {
    if (text != user[1].name) {
      firebase.firestore().collection(route.params.idUser + 'user').doc('Nome').update({
        name: text
      })
    }
  }

  const getUserInfo = () => {
    firebase.firestore().collection(route.params.idUser + 'user').orderBy('id')
    .onSnapshot((querySnapshot) => {
      let listInfoObjects = [];
      querySnapshot.forEach((doc) => {
        var userInfo = {
          id: doc.data().id,
          name: doc.data().name,
          qtd: doc.data().qtd,
          uri: doc.data().uri,
          desc: doc.data().desc
        };
        listInfoObjects.push(userInfo);
      });
      onChangeText(listInfoObjects[1].name);
      setUser(listInfoObjects);
    })
  }

  const AddOrLess = (nameDoc, howMuch, addOrLess) => {
    if (addOrLess == "+") {
      firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
        qtdMax: firebase.firestore.FieldValue.increment(howMuch)
      });
    } else {
      firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
        qtdMax: firebase.firestore.FieldValue.increment(-howMuch)
      });
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      > 
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { navigation.navigate('Perfil'); }} style={{ width: (deviceWidth/6), height: (deviceWidth/6), alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='arrow-left' size={deviceWidth/12} color="#fffefe" />
          </TouchableOpacity>
          <Text style={{ fontSize: (deviceWidth/14.4), alignSelf: 'center', alignContent: 'center', fontFamily: 'Righteous_400Regular', color: '#fffefe' }}>
            Editar Perfil
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={() => { }} style={{ width: (deviceWidth/6), height: (deviceWidth/6), alignItems: 'center', justifyContent: 'center' }} >
            <Icon name='' size={deviceWidth/12} color='#fffefe' />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.status}>
            <Text style={styles.titleStatusMax}>Status Máximo</Text>
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return(
                  <View style={styles.statusList} backgroundColor={item.color}>
                    <View style={styles.container} flexDirection='row'>
                      <Icon name={item.icon} size={(deviceWidth/17)} style={styles.statusIcon} />
                      <Text style={styles.title}>{item.title}</Text>
                    </View>
                    <View style={ { flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                      <Text style={styles.title}>{item.qtdMax}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', marginLeft: 3 }}>
                      <TouchableOpacity style={styles.statusButton} onPress={() => AddOrLess(item.title, 10, '+')}>
                        <Icon name='plus-box-multiple' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statusButton} onPress={() => { AddOrLess(item.title, 1, '+');}}>
                        <Icon name='plus-box' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statusButton} onPress={() => AddOrLess(item.title, 1, '-')}>
                        <Icon name='minus-box' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statusButton} onPress={() => AddOrLess(item.title, 10, '-')}>
                        <Icon name='minus-box-multiple' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }}
            />
          </View>
          <KeyboardAvoidingView 
            style={styles.avoidingView}
          >
            <Text style={styles.nomeLabel}>
              Nome:
            </Text>
            <TextInput
              style={styles.input}
              onBlur={editTextInput}
              onChangeText={onChangeText}
              value={text}
            />
          </KeyboardAvoidingView>
        </View>
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
  status: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: deviceWidth/24,
    alignSelf: 'center'
  },
  statusButton: {
    width: (deviceWidth/14),
    height: (deviceWidth/14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3
  },
  statusIconButton: {
    marginRight: 5,
    marginLeft: 5
  },
  statusList: {
    width: (deviceWidth - 50),
    height: (deviceWidth/9),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: (deviceWidth/18),
    alignContent: 'space-around',
    marginBottom: (deviceWidth/36),
    borderWidth: 1
  },
  nomeLabel: {
    fontFamily: 'Righteous_400Regular',
    fontSize: (deviceWidth/ 12),
    color: '#212125',
    width: (deviceWidth/(36/31)*(1/3))
  },
  avoidingView: {
    flexDirection: 'row',
    width: (deviceWidth/(36/31)),
    height: (deviceWidth/9),
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomWidth: 2
  },
  input: {
    height: (deviceWidth/9),
    width: (deviceWidth/(36/31)*(2/3)),
    color: '#212125',
    fontSize: (deviceWidth/ 12),
    fontFamily: 'Righteous_400Regular',
  },
  titleStatusMax: {
    fontFamily: 'Righteous_400Regular',
    fontSize: (deviceWidth/11),
    marginBottom: 20,
    color: '#212125'
  },
  statusIcon: {
    marginRight: 5,
    marginLeft: 7,
    alignSelf: 'center'
  }
})

export default EditProfileScreen;