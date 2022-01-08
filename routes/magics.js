import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView, StyleSheet, FlatList, Platform, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import { DataContext } from '../components/DataContext';
import Header from '../components/Header';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function MagicsScreen({ route, navigation }) {
  const [user, setUser] = useState([{ uri: "https://icon-library.com/images/user-png-icon/user-png-icon-22.jpg" }, { name: 'User' }, { qtd: 0 }, { qtd: 0 }, { desc: '' }]);
  const {data} = useContext(DataContext);
  const [text, onChangeText] = useState(user[1].name);

  const editTextInput = () => {
    if (text != user[1].name) {
      firebase.firestore().collection(route.params.idUser + 'user').doc('Nome').update({
        name: text
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
      onChangeText(listInfoObjects[1].name);
      setUser(listInfoObjects);
    })
  }

  const AddOrLess = (nameDoc, howMuch, addOrLess) => {
    if (addOrLess == "+") {
      firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
        qtdMax: firebase.firestore.FieldValue.increment(howMuch)
      });
    } else {
      firebase.firestore().collection(route.params.idUser + 'status').doc(nameDoc).update({
        qtdMax: firebase.firestore.FieldValue.increment(-howMuch)
      });
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      > 
        <Header 
          iconLeft='bars'
          iconRight='dice-d20'
          fLeft={() => navigation.openDrawer()} 
          fRight={() => { }} 
          title="Magias"
        />
        <View style={styles.container}>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default MagicsScreen;