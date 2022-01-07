import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ApiKeys from './components/ApiKeys';
import firebase from 'firebase';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';

import HomeScreen from './routes/home';
import LoginScreen from './routes/login';
import { DataContext } from './components/DataContext';
import { SelectedItemContext } from './components/SelectedItemContext';

const Stack = createStackNavigator();

export default function App({ route }) {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);

  const [loaded] = useFonts({
    Righteous_400Regular
  });

  if(!firebase.apps.length) {
    firebase.initializeApp(ApiKeys.firebaseConfig); 
    firebase.firestore().settings({ experimentalForceLongPolling: true });
  }

  return (
    <SelectedItemContext.Provider value={{ selectedItem, setSelectedItem }}>
      <DataContext.Provider value={{ data, setData }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login' >
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false}} />
          </Stack.Navigator>
        </NavigationContainer>
      </DataContext.Provider>
    </SelectedItemContext.Provider>
  );
}