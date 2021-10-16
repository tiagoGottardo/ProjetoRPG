import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';

function MapsScreen({ navigation }) {
  const database = firebase.firestore();
  const [map, setMap] = useState([]);

  useEffect(() => {
    database.collection("maps").onSnapshot((query)=> {
      const list = []
      query.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id })
      })
      setMap(list)
    })
  }, [])



  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need library roll permissions to make this work!');
        }
      }
    })();
  }, []);

  let imageID = Date.now();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    var imageEndName = Date.now();

    if (!result.cancelled) {
        uploadImage(result.uri, ("map"+ imageEndName))
        .then(() => {
          Alert.alert('Success');
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
          console.log("Uri: "+ url_image);
        });
      });

      return refMap
    }

  
    return (



    
    <View style={styles.container}>
      <View>
        <Image
            source={{ uri: "#" }}
            style={{ width: 300, height: 300 }}
          />
      </View>
      <View style={ { flex: 1, flexDirection: 'column-reverse', alignItems: 'flex-end', marginRight: 25, } } >
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage} >
          <Text style={{ color: 'white', fontSize: 20, fontWeight:"bold", marginTop: -2}}>+</Text>
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
    position: 'absolute',
    marginBottom: 25
  }
});


export default MapsScreen;