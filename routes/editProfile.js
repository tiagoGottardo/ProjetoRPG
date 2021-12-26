import * as React from 'react';
import { TouchableOpacity, View, Text, TextInput, FlatList, StyleSheet, Platform, Touchable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

function EditProfileScreen({ route, navigation }) {

  let [fontsLoaded] = useFonts({
    Righteous_400Regular
  });

  return (
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
  }
})

export default EditProfileScreen;