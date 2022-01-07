import * as React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';



function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorLogin, setErrorLogin] = React.useState('');
  const [userLog, setUserLog] = React.useState(true);
  
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home", { idUser: user.uid });
      } else {
        setUserLog(false)
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
  return(
    <View style = {{ flex: 1 }}>
      {userLog?
      <View style={{ flex: 1, backgroundColor: '#212125', alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../assets/iconImage-final.png')} style={{ width: 200, height: 200 }} />
      </View>
      :
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
      }
    </View>
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
    borderBottomColor: "#212125",
    marginLeft: "auto",
    marginRight: "auto",
    color: '#212125'
  },
  title: {
    fontSize: 50,
    color: "#212125",
    marginBottom: 40,
    fontFamily: 'Righteous_400Regular'
  },
  buttonLogin: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212125",
    borderRadius: 50,
    marginTop: 30
  },
  textButtonLogin: {
    color: "white",
    fontFamily: 'Righteous_400Regular',
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