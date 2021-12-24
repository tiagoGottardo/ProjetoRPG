import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ApiKeys from '../components/ApiKeys';
import firebase from 'firebase/app';

import ProfileScreen from './profile';
import ActionsScreen from './actions';
import ItemsScreen from './items';
import MapsScreen from './maps';

import { DrawerContent } from '../components/DrawerContent';

const Drawer = createDrawerNavigator();


export default function HomeScreen({ route, navigation }) {

    let idUser = route.params.idUser
    // initialParams={{ idUser: idUser }}

    if(!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.firebaseConfig); 
      firebase.firestore().settings({ experimentalForceLongPolling: true });
    }


  return (
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        initialRouteName='Perfil'
      >
        <Drawer.Screen name="Perfil" component={ProfileScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Ações" component={ActionsScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Itens" component={ItemsScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Mapas" component={MapsScreen} initialParams={{ idUser: idUser }} />
      </Drawer.Navigator>
  );
}