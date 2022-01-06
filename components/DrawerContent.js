import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, Text, Image} from 'react-native';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Drawer } from 'react-native-paper';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from 'firebase/app';
import 'firebase/firestore';

export function DrawerContent(props) {
  const [user, setUser] = useState([{ uri: "https://icon-library.com/images/user-png-icon/user-png-icon-22.jpg" }, { name: 'User' }, { qtd: 0 }, { qtd: 0 }, { desc: '' }]);
  //props.extraData

  const getUserInfo = () => {
    firebase.firestore().collection(props.extraData + 'user').orderBy('id')
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
      setUser(listInfoObjects);
    })
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  const Logout = () => {
    firebase.auth().signOut().then(() => {
      props.navigation.navigate("Login")
      alert("User desconnected!")
    }).catch((error) => {
      alert(error)
    });
  }

  return(
    <SafeAreaView style={{ flex:1 }}>
      <View style={{ flex:1 }}>
        <View style={{
          backgroundColor: '#212125',
          justifyContent: 'center', 
          height: 180,
          margin: 10,
          marginTop: 0,
          borderRadius: 10
        }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
            <Text style={{ color: '#fffefe', fontSize: 35, fontFamily: 'Righteous_400Regular' }}>Projeto RPG</Text> 
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <View style={{ marginRight: 15 }}> 
              <Image source={{ uri: user[0].uri }} style={{ width: 60, height: 60, borderRadius: 30 }} />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontFamily: 'Righteous_400Regular', fontSize: 20, color: '#fffefe', width: 150 }} >{user[1].name}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="star" size={ 20 } color='#FFD700' />
                <Text style={{ fontFamily: 'Righteous_400Regular', fontSize: 18, color: '#fffefe', marginLeft: 3 }} >{user[2].qtd}</Text>
                <Icon name="fire" size={ 20 } color='#F4A460' style={{ marginLeft: 10 }} />
                <Text style={{ fontFamily: 'Righteous_400Regular', fontSize: 18, color: '#fffefe', marginLeft: 3 }} >{user[3].qtd}</Text>
              </View>
            </View>
          </View>
        </View>
        <DrawerContentScrollView {...props} style={{ borderTopWidth: 0.5, borderTopColor: '#CDC9C9' }}>
            <Drawer.Section>
              <DrawerItem 
                icon={() => (
                  <Icon name="account" size={ 30 } color='#212125' />
                )}  
                label='Perfil'
                labelStyle={styles.labels}
                onPress={() => {props.navigation.navigate('Perfil');}}
                style={{ borderBottomWidth: 0.5, borderBottomColor: '#CDC9C9', borderRadius: 0, marginTop: -20 }}
              />
              <DrawerItem 
                icon={() => (
                  <Icon name="sword" size={ 30 } color='#212125' />
                )}  
                label='Ações'
                labelStyle={styles.labels}
                onPress={() => {props.navigation.navigate('Ações');}}
                style={{ borderBottomWidth: 0.5, borderBottomColor: '#CDC9C9', borderRadius: 0 }}
              />
              <DrawerItem 
                icon={() => (
                  <Icon name="candle" size={ 30 } color='#212125' />
                )}  
                label='Itens'
                labelStyle={styles.labels}
                onPress={() => {props.navigation.navigate('Itens');}}
                style={{ borderBottomWidth: 0.5, borderBottomColor: '#CDC9C9', borderRadius: 0 }}
              />
              <DrawerItem 
                icon={() => (
                  <IconFontAwesome5 name="book" size={ 30 } color='#212125' />
                )}  
                label='Magias'
                labelStyle={styles.labels}
                onPress={() => {}}
                style={{ borderBottomWidth: 0.5, borderBottomColor: '#CDC9C9', borderRadius: 0 }}
              />
              <DrawerItem 
                icon={() => (
                  <Icon name="map" size={ 30 } color='#212125' />
                )}  
                label='Mapas'
                labelStyle={styles.labels}
                onPress={() => {props.navigation.navigate('Mapas');}}
                style={{ borderBottomWidth: 0.5, borderBottomColor: '#CDC9C9', borderRadius: 0 }}
              />
              <DrawerItem 
                icon={() => (
                  <IconFontAwesome5 name="dice-d20" size={ 30 } color='#212125' />
                )}  
                label='Dados'
                labelStyle={styles.labels}
                onPress={() => {}}
                style={{ borderBottomWidth: 0.5, borderBottomColor: '#CDC9C9', borderRadius: 0 }}
              />
              <DrawerItem 
                icon={() => (
                  <Icon name="discord" size={ 30 } color='#212125' />
                )}  
                label='Discord'
                labelStyle={styles.labels}
                onPress={() => Linking.openURL('https://discord.com/channels/385547067315191808/864961439479496735')}
                style={{ borderBottomWidth: 0.5, borderBottomColor: '#CDC9C9', borderRadius: 0 }}
              />
              <DrawerItem 
                icon={() => (
                  <Icon name="logout-variant" size={ 30 } color='#212125' />
                )}  
                label='Logout'
                labelStyle={styles.labels}
                onPress={Logout}
                style={{ borderRadius: 0 }}
              />
            </Drawer.Section>
        </DrawerContentScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInfoSection: {
    flexDirection:'row', 
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14
  },
  column: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center'
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3
  },
  logout: {
    justifyContent: 'flex-end'
  },
  labels: {
    marginLeft: -20,
    fontFamily: 'Righteous_400Regular', 
    fontSize: 20
  }
});