import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ApiKeys from './components/ApiKeys';
import firebase from 'firebase/app';

import HomeScreen from './routes/home';
import LoginScreen from './routes/login';

const Stack = createStackNavigator();

export default function App({ route }) {

      if(!firebase.apps.length) {
        firebase.initializeApp(ApiKeys.firebaseConfig); 
        firebase.firestore().settings({ experimentalForceLongPolling: true });
      }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}