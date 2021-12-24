import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { TapGestureHandler } from 'react-native-gesture-handler';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';


function ProfileScreen({ route }) {
  const [data, setData] = useState([]);
  const [user, setUser] = useState([{ uri: "https://icon-library.com/images/user-png-icon/user-png-icon-22.jpg" }, { name: 'User' }, { qtd: 0 }, { qtd: 0 }]);

  const getUserInfo = () => {
    firebase.firestore().collection(route.params.idUser + 'user').orderBy('id')
    .onSnapshot((querySnapshot) => {
      let listInfoObjects = [];
      querySnapshot.forEach((doc) => {
        var userInfo = {
          id: doc.data().id,
          name: doc.data().name,
          qtd: doc.data().qtd,
          uri: doc.data().uri
        };
        listInfoObjects.push(userInfo);
      });
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
    //firebase.storage().ref().child("perfil").child(imageName).delete()
    var refMap = firebase.storage().ref().child("perfil").child(imageName).put(blob).then(() => {
      firebase.storage().ref().child("perfil").child(imageName).getDownloadURL().then((url_image) => {
        editRegistryImage(imageName, url_image);
        //getMaps();
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
    //getMaps();
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
    <View style={styles.container}>
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
      <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', width: 370 }}>
        <View style={{ 
          backgroundColor: "#FFD700",
          width: 180,
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 50,
          alignContent: 'space-around',
          marginTop: 15,
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
          width: 180,
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 50,
          alignContent: 'space-around',
          marginTop: 15,
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
              <View style={{ 
                  backgroundColor: item.color, 
                  width: 370,
                  height: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 50,
                  alignContent: 'space-around',
                  marginBottom: 10,
                  border: 100,  
                }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon name={item.icon} size={20} style={{ marginRight: 5, marginLeft: 6 }} />
                  <Text style={styles.title}>{item.title}</Text>
                </View>
                <View style={ { flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                  <View>
                    <Text>{item.qtd}</Text>
                  </View>
                  <Text>/</Text>
                  <View>
                    <Text>{item.qtdMax}</Text>
                  </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  userImage: {
    alignSelf: "center",
    marginTop: 25,
    width: 250,
    height: 250,
    borderRadius: 250
  },
  userName: {
    fontSize: 25,
    alignSelf: "center",
    marginTop: 15,
    fontWeight: "bold"
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
})

export default ProfileScreen;