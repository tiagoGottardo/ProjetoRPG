import * as React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Touchable } from 'react-native';
import firebase from 'firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorLogin, setErrorLogin] = React.useState('');

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        navigation.navigate("Home", { idUser: user.uid })
      }
    });
  }, []);

  const loginFirebase = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {

      let user = userCredential.user;
      navigation.navigate("Home", { idUser: user.uid })
  
    })
    .catch((error) => {
      setErrorLogin(true)
      let errorCode = error.code;
      let errorMessage = error.message;
    });
  }

      return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Projeto RPG</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your email"
        type="text"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Enter your password"
        type="text"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      {errorLogin === true
      ?
      <View style={styles.contentAlert}>
        <MaterialCommunityIcons 
           name="alert-circle"
           size={24}
           color="#bdbdbd"
        />
        <Text style={styles.warnAlert}>Invalid email or password</Text>
      </View>
      :
      <View></View>
      }

      {email === "" || password === ""
      ?
      <TouchableOpacity
        disabled={true}
        style={styles.buttonLogin}
      >
        <Text style={styles.textButtonLogin}>Login</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity
        disabled={false}
        onPress={loginFirebase}
        style={styles.buttonLogin}
      >
        <Text style={styles.textButtonLogin}>Login</Text>
      </TouchableOpacity>
      }

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 0 : 50,
  }, 
  input: {
    width: 300,
    marginTop: 10,
    padding: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginLeft: "auto",
    marginRight: "auto",
    color: 'black'
  },
  title: {
    fontSize: 48,
    color: "black",
    marginBottom: 40,
    fontWeight: "bold",
  },
  buttonLogin: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 50,
    marginTop: 30
  },
  textButtonLogin: {
    color: "white",
    fontSize: 20
  },
  contentAlert: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  warnAlert: {
    paddingLeft: 10,
    color: "#bdbdbd",
    fontSize: 16
  }
})

export default LoginScreen;