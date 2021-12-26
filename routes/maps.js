import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { TapGestureHandler } from 'react-native-gesture-handler';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function MapsScreen({ navigation, route }) {
  const [data, setData] = useState([]);

  const getMaps = () => {
    firebase.firestore()
    .collection(route.params.idUser + 'maps')
    .orderBy('name')
    .get()
    .then((snapshot) => {
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
    .catch((e) => {
      console.log(e);
    });
  }

    function addRegistryMap(mapName, mapUri) {

      firebase.firestore()
      .collection(route.params.idUser + 'maps')
      .add({
        name: mapName,
        uri: mapUri
      });
      getMaps();
    }

    function delRegistryMap(mapId, mapName) {
      firebase.storage().ref().child("images").child(mapName).delete()
      firebase.firestore()
      .collection(route.params.idUser + 'maps')
      .doc(mapId)
      .delete();
      alert("You image was deleted!")
      getMaps();
    }

  useEffect(() => {
    getMaps();
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
          getMaps();
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
                  <TapGestureHandler
                    numberOfTaps={2}
                    onActivated={() => {
                      delRegistryMap(item.id, item.name)
                    }}
                  >
                    <Image source={{ uri: item.uri }} style={styles.imageBackground} />
                  </TapGestureHandler>
                    
                </View>
            )}}
            showsHorizontalScrollIndicator={false}
          />
      <View style={styles.viewButton} >
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage} >
        <Icon name='image-plus' size={20} color='#fffefe' />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { navigation.openDrawer(); }} style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name='menu' size={30} color="#fffefe" />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, alignSelf: 'center', alignContent: 'center', fontFamily: 'Righteous_400Regular', color: '#fffefe' }}>
          Mapas
        </Text>
        <TouchableOpacity style={styles.editButton} onPress={() => {}} style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center' }} >
          <Icon name='square-edit-outline' size={30} color='#212125' />
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
    height: 65,
    flexDirection: 'row',
    backgroundColor: '#212125',
    margin: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    width: (deviceWidth - 30),
    alignSelf: 'center'
  }
});


export default MapsScreen;