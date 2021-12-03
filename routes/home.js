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


export default function HomeScreen() {

      if(!firebase.apps.length) {
        firebase.initializeApp(ApiKeys.firebaseConfig); 
        firebase.firestore().settings({ experimentalForceLongPolling: true });
      }

  return (
      <Drawer.Navigator initialRouteName="Mapas" drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Perfil" component={ProfileScreen} />
        <Drawer.Screen name="Ações" component={ActionsScreen} />
        <Drawer.Screen name="Itens" component={ItemsScreen} />
        <Drawer.Screen name="Mapas" component={MapsScreen} />
      </Drawer.Navigator>
  );
}