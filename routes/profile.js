import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['VirtualizedLists']);

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function ProfileScreen({ route, navigation }) {
  const [data, setData] = useState([]);
  const [user, setUser] = useState([{ uri: "https://icon-library.com/images/user-png-icon/user-png-icon-22.jpg" }, { name: 'User' }, { qtd: 0 }, { qtd: 0 }, { desc: '' }]);
  const [text, onChangeText] = useState(user[4].desc);

  useFonts({
    Righteous_400Regular
  });

  const editTextInput = () => {
    if (text != user[4].desc) {
      firebase.firestore().collection(route.params.idUser + 'user').doc('Descricao').update({
        desc: text
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
      onChangeText(listInfoObjects[4].desc);
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

  const PlusOneLvl = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'user').doc(nameDoc).update({
      qtd: user[i].qtd++
    })
    firebase.firestore().collection(route.params.idUser + 'user').doc(nameDoc).update({
      qtd: user[i].qtd++
    })
  }

  const MinusOneLvl = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'user').doc(nameDoc).update({
      qtd: user[i].qtd--
    })
    firebase.firestore().collection(route.params.idUser + 'user').doc(nameDoc).update({
      qtd: user[i].qtd--
    })
  }

  const PlusOne = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: data[i].qtd++
    })
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: data[i].qtd++
    })
  }

  const MinusOne = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: (data[i].qtd - 1)
    })
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: (data[i].qtd - 1)
    })
  }

  const PlusTen = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: (data[i].qtd + 10)
    })
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: (data[i].qtd + 10)
    })
  }

  const MinusTen = (nameDoc, i) => {
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: (data[i].qtd - 10)
    })
    firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
      qtd: (data[i].qtd - 10)
    })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1
    });

    if (!result.cancelled) {
      uploadImage(result.uri, ("photoPerfil"))
      .then(() => {
        alert('Success', 'Your was uploaded!');
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
    getStatus();
    getUserInfo();
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need library roll permissions to make this work!');
        }
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { navigation.openDrawer(); }} style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='menu' size={30} color="#fffefe" />
          </TouchableOpacity>
          <Text style={{ fontSize: 25, alignSelf: 'center', alignContent: 'center', fontFamily: 'Righteous_400Regular', color: '#fffefe' }}>
            Perfil
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={() => {navigation.navigate('Editar Perfil')}} style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center' }} >
            <Icon name='square-edit-outline' size={30} color='#fffefe' />
          </TouchableOpacity>
        </View>
        <TapGestureHandler
          numberOfTaps={2}
          onActivated={pickImage}
        >
          <Image
            style={styles.userImage}
            source={{ uri: user[0].uri }}
          />
        </TapGestureHandler>
        <Text style={styles.userName}>{user[1].name}</Text>
        <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', width: (deviceWidth - 50) }}>
          <View style={{ 
            backgroundColor: "#FFD700",
            width: ((deviceWidth - 60)/ 2),
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 20,
            alignContent: 'space-around',
            marginTop: 15,
            borderWidth: 1
          }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Icon name='star' size={20} style={{ marginRight: 4, marginLeft: 6 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "500", marginTop: 5, alignSelf: 'center' }}>{user[2].qtd}</Text>
            </View>
            <View style={{ flex: 2, flexDirection: 'row-reverse', marginRight: 6 }}>
              <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => PlusOneLvl('Nvl', 2)}>
                <Icon name='plus-box' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => MinusOneLvl('Nvl', 2)}>
                <Icon name='minus-box' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ 
            backgroundColor: "#F4A460",
            width: ((deviceWidth - 60)/ 2),
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 20,
            alignContent: 'space-around',
            marginTop: 15,
            borderWidth: 1
          }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Icon name='fire' size={20} style={{ marginRight: 4, marginLeft: 6 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "500", marginTop: 5, alignSelf: 'center' }}>{user[3].qtd}</Text>
            </View>
            <View style={{ flex: 2, flexDirection: 'row-reverse', marginRight: 6 }}>
              <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => PlusOneLvl('NvlMagia', 3)}>
                <Icon name='plus-box' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => MinusOneLvl('NvlMagia', 3)}>
                <Icon name='minus-box' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
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
                <View style={{ width: (deviceWidth - 50), height: 40, marginBottom: 10, flexDirection: 'row', borderRadius: 20 }}>
                  <View style={{ flex: item.qtd, backgroundColor: item.color, alignItems: 'center', justifyContent: 'center' }} />
                  <View style={{ flex: (item.qtdMax - item.qtd) }}/>
                  <View style={{ width: (deviceWidth - 50), height: 40, justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>
                    <View style={{ width: (deviceWidth - 30), height: 60, borderRadius: 30, borderWidth: 10, borderColor: 'white' }} />
                  </View>
                  <View style={{
                      width: (deviceWidth - 50),
                      height: 40,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 20,
                      marginBottom: 10,
                      justifyContent: 'space-around',
                      position: 'absolute',
                      borderWidth: 1,
                    }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <Icon name={item.icon} size={20} style={{ marginRight: 5, marginLeft: 6 }} />
                      <Text style={styles.title}>{item.title}</Text>
                    </View>
                    <View style={ { flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                      <Text>{item.qtd}/{item.qtdMax}</Text>
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
                </View>
              )}}
          />
        </View>
        <KeyboardAvoidingView>
          <Text style={{ alignSelf: 'center', fontSize: (deviceWidth/20), marginTop: 10, fontFamily: 'Righteous_400Regular', color: '#212125' }}>
            Descrição do personagem
          </Text>
          <TextInput
            style={styles.input}
            onBlur={editTextInput}
            onChangeText={onChangeText}
            value={text}
            multiline = {true}
            numberOfLines = {8}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  editButton: {
    width:30,
    height: 30,
    backgroundColor:"#212125",
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    alignSelf: "center",
    marginTop: 10,
    width: (deviceWidth - 200),
    height: (deviceWidth - 200),
    borderRadius: (deviceWidth - 200)
  },
  userName: {
    fontSize: (deviceWidth/ 14),
    alignSelf: "center",
    marginTop: 15,
    fontFamily: 'Righteous_400Regular',
    color: '#212125'
  },
  status: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 4,
  },
  input: {
    height: 400,
    width: (deviceWidth - 60),
    margin: 20,
    borderWidth: 3,
    borderColor: '#212125',
    alignSelf: 'center',
    padding: 10,
    fontSize: 17,
    color: '#212125'
  },
  header: {
    height: 65,
    flexDirection: 'row',
    backgroundColor: '#212125',
    margin: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default ProfileScreen;