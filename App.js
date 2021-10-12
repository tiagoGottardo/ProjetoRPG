import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

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
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Profile" drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Actions" component={ActionsScreen} />
        <Drawer.Screen name="Items" component={ItemsScreen} />
        <Drawer.Screen name="Maps" component={MapsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}