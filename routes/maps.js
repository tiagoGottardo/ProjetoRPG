import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, FlatList, Dimensions, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { TapGestureHandler } from 'react-native-gesture-handler';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function MapsScreen({ navigation, route }) {
  const [data, setData] = useState([]);
  const [mapPermission, setMapPermission] = useState(false);

  const getMapPermission = () => {
    firebase.firestore().collection(route.params.idUser + 'user').orderBy('id')
    .onSnapshot((querySnapshot) => {
      let listInfoObjects = [];
      querySnapshot.forEach((doc) => {
        var userInfo = {
          id: doc.data().id,
          permission: doc.data().map
        };
        listInfoObjects.push(userInfo);
      });
      setMapPermission(listInfoObjects[5].permission)
    })
  }

  const getMaps = () => {
    firebase.firestore()
    .collection('maps')
    .orderBy('name')
    .onSnapshot((snapshot) => {
      let listMapObjects = [];
          snapshot.forEach((doc) => {
          const map = {
            id: doc.id,
            name: doc.data().name,
            uri: doc.data().uri
          };
          listMapObjects.push(map);
        });
        setData(listMapObjects);
    })
  }

    function addRegistryMap(mapName, mapUri) {

      firebase.firestore()
      .collection('maps')
      .add({
        name: mapName,
        uri: mapUri
      });
    }

    function delRegistryMap(mapId, mapName) {
      firebase.storage().ref().child("images").child(mapName).delete()
      firebase.firestore()
      .collection('maps')
      .doc(mapId)
      .delete();
      alert("You image was deleted!")
    }

  useEffect(() => {
    getMaps();
    getMapPermission();
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need library roll permissions to make this work!');
        }
      }
    });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1
    });

    var imageEndName = Date.now();

    if (!result.cancelled) {
        uploadImage(result.uri, ("map" + imageEndName))
        .then(() => {
          alert('Success', 'Your was uploaded!');
        })
        .catch((error) => {
          alert(error);
        });
      }
    }

    const uploadImage = async (uri, mapName) => {
      const response = await fetch(uri);
      const blob = await response.blob();

      var refMap = firebase.storage().ref().child("images").child(mapName).put(blob).then(() => {
        firebase.storage().ref().child("images").child(mapName).getDownloadURL().then((url_image) => {
          addRegistryMap(mapName, url_image);
        });
        
      });

      return refMap
    } 

    return (
    
    <View style={styles.container}>
        <FlatList
            data={data}
            keyExtractor={(item) => item.name}
            renderItem={({item}) => {
              return (
                <View style={styles.container}>
                  {mapPermission == true
                  ?
                  <TapGestureHandler
                  numberOfTaps={2}
                  onActivated={() => {
                    delRegistryMap(item.id, item.name)
                  }}
                  >
                    <Image source={{ uri: item.uri }} style={styles.imageBackground} />
                  </TapGestureHandler>
                  :
                  <Image source={{ uri: item.uri }} style={styles.imageBackground} />
                  }
                  
                </View>
            )}}
            showsHorizontalScrollIndicator={false}
          />
      {mapPermission == true
      ?
      <View style={styles.viewButton} >
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage} >
          <Icon name='folder-plus' size={deviceWidth/15} color='#fffefe' />
        </TouchableOpacity>
      </View>
      :
      <View />
      }
      <View style={styles.header}>
          <TouchableOpacity onPress={() => { navigation.openDrawer(); }} style={{ width: (deviceWidth/6), height: (deviceWidth/6), alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='bars' size={deviceWidth/15} color="#fffefe" />
          </TouchableOpacity>
          <Text style={{ fontSize: (deviceWidth/14.4), alignSelf: 'center', alignContent: 'center', fontFamily: 'Righteous_400Regular', color: '#fffefe' }}>
            Mapas
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={() => {}} style={{ width: (deviceWidth/6), height: (deviceWidth/6), alignItems: 'center', justifyContent: 'center' }} >
            <Icon name='dice-d20' size={deviceWidth/15} color='#fffefe' />
          </TouchableOpacity>
      </View>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addImageButton: {
    width:60,
    height:60,
    backgroundColor:"#212125",
    borderRadius:30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 30
  },
  imageBackground:{
    flex:1,
    width: deviceWidth,
    height: deviceHeight,
    resizeMode: "cover"
  },
  header: {
    height: (deviceWidth/6),
    flexDirection: 'row',
    backgroundColor: '#212125',
    borderRadius: (deviceWidth/12),
    justifyContent: 'space-between',
    position: 'absolute',
    alignSelf: 'center',
    marginTop: (deviceWidth/12),
    width: (deviceWidth - (deviceWidth/12))
  },

});


export default MapsScreen;