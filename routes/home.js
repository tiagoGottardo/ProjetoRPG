import * as React from 'react';
import { useContext, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import firebase from 'firebase/app';

import { DrawerContent } from '../components/DrawerContent';
import ApiKeys from '../components/ApiKeys';
import { DataContext } from '../components/DataContext';

import ProfileScreen from './profile';
import EditProfileScreen from './editProfile';
import ActionsScreen from './actions';
import ItemsScreen from './items';
import MapsScreen from './maps';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['VirtualizedLists']);
LogBox.ignoreLogs(['Each child in']);

const Drawer = createDrawerNavigator();

export default function HomeScreen({ route }) {
  const { setData } = useContext(DataContext);

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

  useEffect(() => {
    getStatus();
  }, [])

  let idUser = route.params.idUser

  if(!firebase.apps.length) {
    firebase.initializeApp(ApiKeys.firebaseConfig); 
    firebase.firestore().settings({ experimentalForceLongPolling: true });
  }

  return (
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} extraData={idUser} />}
        initialRouteName='Itens'
        screenOptions={{
          headerShown: false
        }}
      >
        <Drawer.Screen name="Perfil" component={ProfileScreen} initialParams={{ idUser: idUser }}/>
        <Drawer.Screen name="Ações" component={ActionsScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Itens" component={ItemsScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Mapas" component={MapsScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Editar Perfil" component={EditProfileScreen} initialParams={{ idUser: idUser }} options={{ swipeEnabled: false }}/>
      </Drawer.Navigator>
  );
}