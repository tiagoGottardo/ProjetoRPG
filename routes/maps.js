import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Image, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
    .collection(route.params.idUser)
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
      .collection(route.params.idUser)
      .add({
        name: mapName,
        uri: mapUri
      });
      getMaps();
    }

    function delRegistryMap(mapId, mapName) {
      firebase.storage().ref().child("images").child(mapName).delete()
      firebase.firestore()
      .collection(route.params.idUser)
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
          />
      <View style={styles.viewButton} >
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage} >
          <Text style={styles.plus}>+</Text>
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
    backgroundColor:"#1E90FF",
    borderRadius:30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
  imageBackground:{
    flex:1,
    width: deviceWidth,
    height: deviceHeight,
    resizeMode: "cover"
  },
  viewButton: {
    flex: 1, 
    flexDirection: 'column-reverse', 
    alignItems: 'flex-end', 
    marginRight: 25
  },
  plus: {
    color: 'white', 
    fontSize: 20, 
    fontWeight:"bold"
  }
});


export default MapsScreen;