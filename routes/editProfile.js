import * as React from 'react';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

function EditProfileScreen({ route, navigation }) {
  const [user, setUser] = useState([{ uri: "https://icon-library.com/images/user-png-icon/user-png-icon-22.jpg" }, { name: 'User' }, { qtd: 0 }, { qtd: 0 }, { desc: '' }]);
  const [data, setData] = useState([]);
  const [text, onChangeText] = useState(user[1].name);

  let [fontsLoaded] = useFonts({
    Righteous_400Regular
  });

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
  
  const getStatus = () => {
    firebase.firestore().collection(route.params.idUser + 'status').orderBy('id')
    .onSnapshot((querySnapshot) => {
      let listStatusObjects = [];
      querySnapshot.forEach((doc) => {
        var status = {
          id: doc.data().id,
          title: doc.data().title,
          icon: doc.data().icon,
          color: doc.data().color,
          qtd: doc.data().qtd,
          qtdMax: doc.data().qtdMax,
        };
        listStatusObjects.push(status);
      });
      setData(listStatusObjects);
    })
  }

  const PlusOne = (nameDoc, i) => {
    console.log(nameDoc, i)
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtdMax: data[i].qtdMax++
    })
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtdMax: data[i].qtdMax++
    })
  }

  const MinusOne = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtdMax: (data[i].qtdMax - 1)
    })
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtdMax: (data[i].qtdMax - 1)
    })
  }

  const PlusTen = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtdMax: (data[i].qtdMax + 10)
    })
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: (data[i].qtdMax + 10)
    })
  }

  const MinusTen = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtdMax: (data[i].qtdMax - 10)
    })
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtdMax: (data[i].qtdMax - 10)
    })
  }

  useEffect(() => {
    getStatus();
    getUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { navigation.navigate('Perfil') }} style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name='arrow-left' size={30} color="#fffefe" />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, alignSelf: 'center', alignContent: 'center', fontFamily: 'Righteous_400Regular', color: '#fffefe' }}>
          Editar Perfil
        </Text>
        <TouchableOpacity style={styles.editButton} onPress={() => {}} style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center' }} >
          <Icon name='square-edit-outline' size={30} color='#212125' />
        </TouchableOpacity>
      </View>
      <View style={styles.status}>
        <Text style={{ fontFamily: 'Righteous_400Regular', fontSize: 35, marginBottom: 20, color: '#212125' }}>Status Máximo</Text>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return(
              <View style={{ 
                  backgroundColor: item.color, 
                  width: 370,
                  height: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 50,
                  alignContent: 'space-around',
                  marginBottom: 10,
                  borderWidth: 1
                }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon name={item.icon} size={20} style={{ marginRight: 5, marginLeft: 6 }} />
                  <Text style={styles.title}>{item.title}</Text>
                </View>
                <View style={ { flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                  <Text>{item.qtdMax}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row-reverse', marginRight: 6 }}>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => PlusTen(item.title, item.id)}>
                  <Icon name='plus-box-multiple' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => PlusOne(item.title, item.id)}>
                  <Icon name='plus-box' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => MinusOne(item.title, item.id)}>
                  <Icon name='minus-box' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => MinusTen(item.title, item.id)}>
                  <Icon name='minus-box-multiple' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                  </TouchableOpacity>
                </View>
              </View>
            )}}
        />
      </View>
      <KeyboardAvoidingView style={{ flexDirection: 'row', margin: 10, height: 40, alignItems: 'center', justifyContent: 'center', paddingLeft: 10, borderBottomWidth: 2 }}>
        <Text style={{ fontFamily: 'Righteous_400Regular', fontSize: 30, color: '#212125' }}>
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


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: 65,
    flexDirection: 'row',
    backgroundColor: '#212125',
    margin: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  input: {
    height: 40,
    width: 270,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    color: '#212125',
    fontFamily: 'Righteous_400Regular'
  },
  status: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 4,
  }
})

export default EditProfileScreen;