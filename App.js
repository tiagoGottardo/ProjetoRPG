import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ApiKeys from './components/ApiKeys';
import firebase from 'firebase';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';

import HomeScreen from './routes/home';
import LoginScreen from './routes/login';
import { DataContext } from './components/DataContext';

const Stack = createStackNavigator();

export default function App({ route }) {
  const [data, setData] = useState([]);

  const [loaded] = useFonts({
    Righteous_400Regular
  });

  if(!firebase.apps.length) {
    firebase.initializeApp(ApiKeys.firebaseConfig); 
    firebase.firestore().settings({ experimentalForceLongPolling: true });
  }

  return (
    <DataContext.Provider value={{ data, setData }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataContext.Provider>
  );
}