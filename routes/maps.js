import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ImageBackground, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

function MapsScreen({ navigation }) {
  const [data, setData] = useState([]);
  const database = firebase.firestore();

  const getMaps = () => {
    database
    .collection('maps')
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
      database
      .collection('maps')
      .add({
        name: mapName,
        uri: mapUri
      });
      getMaps();
    }

    function delRegistryMap(mapId, mapName) {
      firebase.storage().ref().child("images").child(mapName).delete()
      database
      .collection('maps')
      .doc(mapId)
      .delete();
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
    })();
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
          Alert.alert('Success', 'Your was uploaded!');
        })
        .catch((error) => {
          Alert.alert(error);
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
        <View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.name}
            renderItem={({item}) => {
              return (
                <View style={{ flex: 1 }}>
                    <ImageBackground source={{ uri: item.uri }} style={styles.imageBackground}>
                      <TouchableOpacity style={styles.delImageButton} onPress={()=>delRegistryMap(item.id, item.name)}>
                        <Icon name="trash" size={20} color="#FFF" />
                      </TouchableOpacity>
                    </ImageBackground>
                </View>
            )}}
          />
        </View>
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
  delImageButton: {
    width:40,
    height:40,
    backgroundColor:"red",
    borderRadius:20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  imageBackground:{
    flex:1, 
    resizeMode: "cover", 
    aspectRatio: 0.5,
    alignItems: 'flex-end',
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