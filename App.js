import * as React from 'react';
import { Button, ImageBackgroundComponent, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ApiKeys from './components/ApiKeys';
import * as firebase from 'firebase';

import ProfileScreen from './routes/profile';
import ActionsScreen from './routes/actions';
import ItemsScreen from './routes/items';
import MapsScreen from './routes/maps';

import { DrawerContent } from './components/DrawerContent';

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {

      if(!firebase.apps.length) { 
        firebase.initializeApp(ApiKeys.firebaseConfig); 
        firebase.firestore().settings({ experimentalForceLongPolling: true });
      }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Perfil" drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Perfil" component={ProfileScreen} />
        <Drawer.Screen name="Ações" component={ActionsScreen} />
        <Drawer.Screen name="Itens" component={ItemsScreen} />
        <Drawer.Screen name="Mapas" component={MapsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}