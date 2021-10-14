import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';

function MapsScreen({ navigation }) {

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

  let imageID = 0;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      imageID++;
        uploadImage(result.uri, ("map"+ imageID))
        .then(() => {
          Alert.alert('Success');
        })
        .catch((error) => {
          Alert.alert(error);
        });
      }
    }

    const uploadImage = async (uri, imageName) => {
      const response = await fetch(uri);
      const blob = await response.blob();

      var ref = firebase.storage().ref().child("images/"+ imageName);
      return ref.put(blob);
    }
  
    return (



    <View style={styles.container}>
    <TouchableOpacity style={styles.addImageButton} onPress={pickImage} >
      <Text style={{ color: 'white', fontSize: 20, fontWeight:"bold", marginTop: -2}}>+</Text>
    </TouchableOpacity>
</View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignSelf: 'flex-end',
    marginBottom: 25,
    marginRight: 25,
  },
  addImageButton: {
    width:60,
    height:60,
    backgroundColor:"#1E90FF",
    borderRadius:30,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default MapsScreen;