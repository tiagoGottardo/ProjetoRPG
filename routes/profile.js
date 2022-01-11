import * as React from 'react';
import { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Modalize } from 'react-native-modalize';

import { DataContext } from '../components/DataContext';
import Header from '../components/Header';
import Dice from '../components/Dice';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function ProfileScreen({ route, navigation }) {
  const {data} = useContext(DataContext);
  const [user, setUser] = useState([{ uri: "https://www.colorhexa.com/212125.png" }, { name: 'User' }, { qtd: 0 }, { qtd: 0 }, { desc: '' }]);
  const [text, onChangeText] = useState(user[4].desc);
  const [nameSelected, setNameSelected] = useState(false);
  const [statusSelected, setStatusSelected] = useState(false);
  const [nameInput, onChangeName] = useState('');
  const diceModalizeRef = useRef(null);

  const editTextInput = () => {
    if (text != user[4].desc) {
      firebase.firestore().collection(route.params.idUser + 'user').doc('Descricao').update({
        desc: text
      })
    }
  }

  const editNameInput = () => {
    if (nameInput != user[1].name) {
      firebase.firestore().collection(route.params.idUser + 'user').doc('Nome').update({
        name: nameInput
      })
    }
    setNameSelected(false);
  }

  const flopStatusSelected = () => {
    switch (statusSelected) {
      case false: setStatusSelected(true); break;
      case true: setStatusSelected(false); break;
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
          desc: doc.data().desc,
          permission: doc.data().map
        };
        listInfoObjects.push(userInfo);
      });
      onChangeText(listInfoObjects[4].desc);
      onChangeName(listInfoObjects[1].name);
      setUser(listInfoObjects);
    })
  }
  
  const addOrLess = (nameDoc, howMuch, addOrLess, collection) => {
    if (statusSelected == false || collection == 'user') {
      if (addOrLess == "+") {
        firebase.firestore().collection(route.params.idUser + collection).doc(nameDoc).update({
          qtd: firebase.firestore.FieldValue.increment(howMuch)
        });
      } else {
        firebase.firestore().collection(route.params.idUser + collection).doc(nameDoc).update({
          qtd: firebase.firestore.FieldValue.increment(-howMuch)
        });
      }
    } else {
      if (addOrLess == "+") {
        firebase.firestore().collection(route.params.idUser + collection).doc(nameDoc).update({
          qtdMax: firebase.firestore.FieldValue.increment(howMuch)
        });
      } else {
        firebase.firestore().collection(route.params.idUser + collection).doc(nameDoc).update({
          qtdMax: firebase.firestore.FieldValue.increment(-howMuch)
        });
      }
    }
    
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1
    });

    if (!result.cancelled) {
      uploadImage(result.uri, (route.params.idUser))
      .then(() => {
        alert('Successo', 'Sua imagem modificada!');
      })
      .catch((error) => {
        alert(error);
      });
    }
  }

  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    firebase.storage().ref().child("perfil").child(imageName).delete()
    var refMap = firebase.storage().ref().child("perfil").child(imageName).put(blob).then(() => {
      firebase.storage().ref().child("perfil").child(imageName).getDownloadURL().then((url_image) => {
        editRegistryImage(imageName, url_image);
      });
    });
    return refMap
  } 

  function editRegistryImage(imageName, imageUri) {
    firebase.firestore()
    .collection(route.params.idUser + 'user')
    .doc('FotoPerfil')
    .update({
      uri: imageUri
    });
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need library roll permissions to make this work!');
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ height: (deviceWidth/(36/9)) }}/>
        <TapGestureHandler
          numberOfTaps={2}
          onActivated={pickImage}
        >
          <Image
            style={styles.userImage}
            source={{ uri: user[0].uri }}
          />
        </TapGestureHandler>
          {nameSelected == false
            ?
            <TapGestureHandler
              numberOfTaps={2}
              onActivated={() => setNameSelected(true)}
            >
              <KeyboardAvoidingView style={{ width: (deviceWidth/(36/31)), alignSelf: "center", marginVertical: 15}}>
                <Text style={styles.userName}>{user[1].name}</Text>
              </KeyboardAvoidingView>
            </TapGestureHandler>
            :
            <TextInput
              style={styles.inputName}
              onBlur={editNameInput}
              onChangeText={onChangeName}
              value={nameInput}
              autoCapitalize = 'words'
              blurOnSubmit={true}
              autoCorrect={false}
            />
          }
        <View style={styles.statusLvl}>
          <View backgroundColor='#FFD700' style={styles.statusListLvl}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Icon name='star' size={deviceWidth/18} style={styles.statusIcon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{user[2].qtd}</Text>
            </View>
            <View style={{ flex: 2, flexDirection: 'row-reverse' }}>
              <TouchableOpacity style={styles.statusButton} onPress={() => addOrLess('Nvl', 1, '+', 'user')}>
                <Icon name='plus-box' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusButton} onPress={() => addOrLess('Nvl', 1, '-', 'user')}>
                <Icon name='minus-box' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
              </TouchableOpacity>
            </View>
          </View>
          <View backgroundColor='#F4A460' style={styles.statusListLvl}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Icon name='fire' size={deviceWidth/18} style={styles.statusIcon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{user[3].qtd}</Text>
            </View>
            <View style={{ flex: 2, flexDirection: 'row-reverse' }}>
              <TouchableOpacity style={styles.statusButton} onPress={() => addOrLess('NvlMagia', 1, '+', 'user')}>
                <Icon name='plus-box' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusButton} onPress={() => addOrLess('NvlMagia', 1, '-', 'user')}>
                <Icon name='minus-box' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.status}>
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return(
                <View style={{ width: (deviceWidth/(36/31)), height: (deviceWidth/9), marginBottom: (deviceWidth/30), flexDirection: 'row', borderRadius: (deviceWidth/18) }}>
                  <View style={{ flex: item.qtd, backgroundColor: item.color, alignItems: 'center', justifyContent: 'center' }} />
                  <View style={{ flex: (item.qtdMax - item.qtd) }}/>
                  <View style={{ width: (deviceWidth/(36/31)), height: (deviceWidth/9), justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                    <View style={{ width: (deviceWidth/(36/33)), height: (deviceWidth/6), borderRadius: ((deviceWidth/9) + 20), borderWidth: (deviceWidth/36), borderColor: 'white' }} />
                  </View>
                  <View style={styles.statusList}>
                    <TapGestureHandler
                      numberOfTaps={2}
                      onActivated={flopStatusSelected}
                    >
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Icon name={item.icon} size={(deviceWidth/17)} style={styles.statusIcon} />
                        <Text style={styles.title}>{item.title}</Text>
                      </View>
                    </TapGestureHandler>
                    <View style={ { flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                      <Text style={styles.title}>{item.qtd}/{item.qtdMax}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', marginRight: 3 }}>
                      <TouchableOpacity style={styles.statusButton} onPress={() => addOrLess(item.title, 10, '+', 'status')}>
                        <Icon name='plus-box-multiple' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statusButton} onPress={() => { addOrLess(item.title, 1, '+', 'status')}}>
                        <Icon name='plus-box' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statusButton} onPress={() => addOrLess(item.title, 1, '-', 'status')}>
                        <Icon name='minus-box' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statusButton} onPress={() => addOrLess(item.title, 10, '-', 'status')}>
                        <Icon name='minus-box-multiple' size={(deviceWidth/14) - 10} style={styles.statusIconButton} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}}
          />
        </View>
        <KeyboardAvoidingView>
          <Text style={{ alignSelf: 'center', fontSize: (deviceWidth/16), marginTop: 10, fontFamily: 'Righteous_400Regular', color: '#212125' }}>
            Descrição do personagem
          </Text>
          <TextInput
            style={styles.input}
            onBlur={editTextInput}
            onChangeText={onChangeText}
            value={text}
            multiline = {true}
            numberOfLines = {8}
            blurOnSubmit={true}
            autoCorrect={false}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <Header
          iconLeft='bars'
          iconRight='dice-d20'
          fLeft={() => navigation.openDrawer()}
          fRight={() => { diceModalizeRef.current?.open(); }}
          title="Perfil"
        />
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
    flex: 1,
    backgroundColor: 'white'
  },
  userImage: {
    alignSelf: "center",
    marginTop: 10,
    width: (deviceWidth/(36/20)),
    height: (deviceWidth/(36/20)),
    borderRadius: (deviceWidth/(36/4)),
    borderWidth: 2,
    borderColor: '#212125'
  },
  userName: {
    fontSize: (deviceWidth/11),
    alignSelf: "center",
    fontFamily: 'Righteous_400Regular',
    color: '#212125',
    textAlign: 'center'
  },
  status: {
    alignItems: 'center'
  },
  title: {
    fontSize: deviceWidth/24,
    alignSelf: 'center',
  },
  input: {
    height: (deviceWidth/0.9),
    width: (deviceWidth/(36/31)),
    margin: (deviceWidth/18),
    borderWidth: 3,
    borderColor: '#212125',
    alignSelf: 'center',
    padding: (deviceWidth/36),
    fontSize: (deviceWidth/21.17),
    color: '#212125',
    textAlignVertical: 'top'
  },
  statusList: {
    width: (deviceWidth/(36/31)),
    height: (deviceWidth/9),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: (deviceWidth/18),
    alignContent: 'space-around',
    marginBottom: (deviceWidth/30),
    position: 'absolute',
    borderWidth: 1
  },
  statusIcon: {
    marginRight: 5,
    marginLeft: 7,
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
  statusListLvl: {
    width: (((deviceWidth - 20)/(36/31))/ 2),
    height: (deviceWidth/9),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: deviceWidth/18,
    alignContent: 'space-around',
    marginTop: (deviceWidth/30),
    marginBottom: (deviceWidth/30),
    borderWidth: 1
  },
  statusLvl: { 
    alignSelf: 'center', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: (deviceWidth/(36/31))
  },
  inputName: {
    marginVertical: 15,
    height: (deviceWidth/9),
    width: (deviceWidth/(36/31)),
    alignSelf: 'center',
    color: '#212125',
    fontSize: (deviceWidth/ 11),
    fontFamily: 'Righteous_400Regular',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#212125'
  }
})

export default ProfileScreen;