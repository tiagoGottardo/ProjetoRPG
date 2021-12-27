import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ApiKeys from '../components/ApiKeys';
import firebase from 'firebase/app';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';

import ProfileScreen from './profile';
import EditProfileScreen from './editProfile'
import ActionsScreen from './actions';
import ItemsScreen from './items';
import MapsScreen from './maps';

import { DrawerContent } from '../components/DrawerContent';

const Drawer = createDrawerNavigator();


export default function HomeScreen({ route, navigation }) {

    let [fontsLoaded] = useFonts({
      Righteous_400Regular
    });

    let idUser = route.params.idUser

    if(!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.firebaseConfig); 
      firebase.firestore().settings({ experimentalForceLongPolling: true });
    }

  return (
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} extraData={idUser} />}
        initialRouteName='Perfil'
        screenOptions={{
          headerShown: false
        }}
      >
        <Drawer.Screen name="Perfil" component={ProfileScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Ações" component={ActionsScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Itens" component={ItemsScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Mapas" component={MapsScreen} initialParams={{ idUser: idUser }} />
        <Drawer.Screen name="Editar Perfil" component={EditProfileScreen} initialParams={{ idUser: idUser }}/>
        <Drawer.Screen name="Drawer" component={DrawerContent} initialParams={{ idUser: idUser }}/>
      </Drawer.Navigator>
  );
}