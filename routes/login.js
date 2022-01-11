import * as React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addListener } from 'expo-updates';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
      const toCleanContent = navigation.addListener('focus', () => {
        setEmail('')
        setPassword('')
        setErrorLogin('')
      })
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
    <View style = {{ flex: 1, backgroundColor: 'white' }}>
      {userLog?
      <View style={{ flex: 1, backgroundColor: '#212125', alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../assets/iconImage-final.png')} style={{ width: deviceWidth, height: deviceHeight }} />
      </View>
      :
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.title}>Projeto RPG</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Digite seu email"
            type="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize = 'none'
            autoCorrect={false}
            blurOnSubmit={true}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Digite sua senha"
            type="text"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            autoCapitalize = 'none'
            autoCorrect={false}
            blurOnSubmit={true}
          />
          {errorLogin === true
          ?
          <View style={styles.contentAlert}>
            <MaterialCommunityIcons 
              name="alert-circle"
              size={(deviceWidth/(36/2.4))}
              color="#bdbdbd"
            />
            <Text style={styles.warnAlert}>Algo de errado não está certo.</Text>
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
          <TouchableOpacity style={styles.linkToSignup} onPress={() => { navigation.navigate('Signup'); }} >
              <Text style={styles.textLink}>Não tenho uma conta.</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceHeight
  },
  linkToSignup: {
    height: (deviceWidth/(36/5)),
    width: (deviceWidth/(36/20)),
    marginTop: (deviceWidth/(36/1)),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: (deviceWidth/(36/(5/3))),
  },
  textLink: {
    color: '#212125',
    fontSize: (deviceWidth/20),
    fontFamily: 'Righteous_400Regular'
  },
  input: {
    width: (deviceWidth/(36/30)),
    marginTop: (deviceWidth/(36/1)),
    padding: (deviceWidth/(36/1)),
    height: (deviceWidth/(36/5)),
    borderBottomWidth: 1,
    borderBottomColor: "#212125",
    marginLeft: "auto",
    marginRight: "auto",
    color: '#212125'
  },
  title: {
    fontSize: (deviceWidth/8),
    color: "#212125",
    marginBottom: (deviceWidth/(36/4)),
    fontFamily: 'Righteous_400Regular',
    alignSelf: 'center',
    marginTop: (deviceWidth/(36/3))
  },
  buttonLogin: {
    width: (deviceWidth/(36/20)),
    height: (deviceWidth/(36/5)),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212125",
    borderRadius: (deviceWidth/(36/5)),
    marginTop: (deviceWidth/(36/3)),
    alignSelf: 'center'
  },
  textButtonLogin: {
    color: "white",
    fontFamily: 'Righteous_400Regular',
    fontSize: (deviceWidth/16)
  },
  contentAlert: {
    marginTop: (deviceWidth/(36/2)),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  warnAlert: {
    paddingLeft: (deviceWidth/(36/1)),
    color: "#bdbdbd",
    fontSize: (deviceWidth/22),
    alignSelf: 'center'
  }
})

export default LoginScreen;