import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const deviceWidth = Dimensions.get('window').width;

function SignupScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorSignup, setErrorSignup] = React.useState('');

  useEffect(() => {
    const toCleanContent = navigation.addListener('focus', () => {
      setEmail('')
      setPassword('')
      setErrorSignup('')
    })
  }, [])

  const signupFirebase = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        createPlayerDatabase(user.uid);
        navigation.navigate("Home", { idUser: user.uid });
    })
    .catch((error) => {
        setErrorSignup(true)
        var errorCode = error.code;
        var errorMessage = error.message;
    });

    const createPlayerDatabase = (user) => {
        firebase.firestore().collection('players').doc(user).set({
            uidPlayer: user
        })
        firebase.firestore().collection(user + "user").doc('Descricao').set({
            desc: '',
            id: '4'
        })
        firebase.firestore().collection(user + "user").doc('FotoPerfil').set({
            uri: 'https://firebasestorage.googleapis.com/v0/b/projetorpg-1362c.appspot.com/o/perfil%2FP9ovxhRlU1TQFRg83regSWGLiBs1?alt=media&token=5ad43503-4a2a-483f-93bb-c4bf35985ac3',
            id: '0'
        })
        firebase.firestore().collection(user + "user").doc('Nome').set({
            name: 'Nome',
            id: '1'
        })
        firebase.firestore().collection(user + "user").doc('Nvl').set({
            qtd: 1,
            id: '2'
        })
        firebase.firestore().collection(user + "user").doc('NvlMagia').set({
            qtd: 1,
            id: '3'
        })
        firebase.firestore().collection(user + "user").doc('Permission').set({
            map: false,
            id: '5'
        })
        firebase.firestore().collection(user + "status").doc('Dinheiro').set({
            color: '#3CB371',
            icon: 'cash',
            id: '1',
            qtd: 2500,
            qtdMax: 2500,
            title: "Dinheiro"
        })
        firebase.firestore().collection(user + "status").doc('Mana').set({
            color: '#7B68EE',
            icon: 'water',
            id: '3',
            qtd: 100,
            qtdMax: 100,
            title: "Mana"
        })
        firebase.firestore().collection(user + "status").doc('Sanidade').set({
            color: '#20B2AA',
            icon: 'brain',
            id: '2',
            qtd: 100,
            qtdMax: 100,
            title: "Sanidade"
        })
        firebase.firestore().collection(user + "status").doc('Vida').set({
            color: '#EE272C',
            icon: 'heart',
            id: '0',
            qtd: 100,
            qtdMax: 100,
            title: "Vida"
        })
        firebase.firestore().collection(user + "mod").doc('Carisma').set({
            id: '5',
            qtd: 5,
            title: 'Carisma'
        })
        firebase.firestore().collection(user + "mod").doc('Presença').set({
            id: '0',
            qtd: 5,
            title: 'Presença'
        })
        firebase.firestore().collection(user + "mod").doc('Agilidade').set({
            id: '2',
            qtd: 5,
            title: 'Agilidade'
        })
        firebase.firestore().collection(user + "mod").doc('Força').set({
            id: '1',
            qtd: 5,
            title: 'Força'
        })
        firebase.firestore().collection(user + "mod").doc('Intelecto').set({
            id: '3',
            qtd: 5,
            title: 'Intelecto'
        })
        firebase.firestore().collection(user + "mod").doc('Sabedoria').set({
            id: '4',
            qtd: 5,
            title: 'Sabedoria'
        })
        firebase.firestore().collection(user + "magics").doc('Clique aqui').set({
            description: '',
            icon: 'anchor',
            subtitle: 'Para ver ou editar sua magia.',
            title: 'Clique aqui'
        })
        firebase.firestore().collection(user + "items").doc('Clique aqui').set({
            description: '',
            icon: 'pistol',
            subtitle: 'Para ver ou editar seu item.',
            title: 'Clique aqui',
            target_color: 0
        })
        const atributos = ["Destreza", "Pontaria", "Atletismo", "Pilotagem A - moto", "Pilotagem B - carro", "Pilotagem C - caminhões", "Pilotagem D - aviões e helicópteros", "Pilotagem E - barcos e lanchas", "Furtividade", "Intuição", "Luta", "Mecânica", "Medicina", "Preparação", "Terapia", "Percepção", "Lábia", "Constituição", "Investigação", "Acalmar", "Burocracia", "Disfarce", "Elogiar", "Flertar", "Interrogação", "Intimidar", "Negociar", "Análise", "Antropologia", "Astronomia", "Balística", "Coletar evidência", "Criptografia", "Dispositivos explosivos", "Entomologia", "Ensinar", "Fotografia", "Química", "Recuperação de dados", "Usar computadores", "Arqueologia", "Arquitetura", "Curiosidade", "Ocultismo", "História", "Leis", "Linguagens", "Psicologia"];
        for(var i = 0; i < atributos.length; i++ )
        firebase.firestore().collection(user + "attributes").doc(atributos[i]).set({
            qtd: 5,
            title: atributos[i],
        })
    }

  }
  return(
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Crie sua conta</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu email"
          type="text"
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
        {errorSignup === true
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
          <Text style={styles.textButtonLogin}>Signup</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity
          disabled={false}
          onPress={signupFirebase}
          style={styles.buttonLogin}
        >
          <Text style={styles.textButtonLogin}>Signup</Text>
        </TouchableOpacity>
        }
        <TouchableOpacity style={styles.linkToSignup} onPress={() => { navigation.navigate('Login'); }} >
          <Text style={styles.textLink}>Já tenho uma conta.</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    fontSize: (deviceWidth/9),
    color: "#212125",
    marginBottom: (deviceWidth/(36/4)),
    fontFamily: 'Righteous_400Regular'
  },
  buttonLogin: {
    width: (deviceWidth/(36/20)),
    height: (deviceWidth/(36/5)),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212125",
    borderRadius: (deviceWidth/(36/5)),
    marginTop: (deviceWidth/(36/3))
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
    fontSize: (deviceWidth/22)
  }
})

export default SignupScreen;