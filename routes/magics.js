import * as React from 'react';
import { useEffect, useState, useContext, useRef } from 'react';
import { TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView, StyleSheet, FlatList, Platform, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modalize } from 'react-native-modalize';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';


import Header from '../components/Header';
import ElementMagic from '../components/ElementMagic';
import MagicModal from '../components/MagicModal';
import { SelectedMagicContext } from '../components/SelectedMagicContext';
import IconsSelectorModal from '../components/IconsSelectorModal';


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function MagicsScreen({ route, navigation }) {
  const [magics, setMagics] = useState([]);
  const {selectedMagic, setSelectedMagic} = useContext(SelectedMagicContext);
  const modalizeRef = useRef(null);
  const iconModalizeRef = useRef(null);

  const openModalize = () => {
    modalizeRef.current?.open();
  }

  const newMagic = () => {
    setSelectedMagic(['', '', '', '']);
    openModalize();
  }

  const getMagics = () => {
    firebase.firestore().collection(route.params.idUser + 'magics').orderBy('title')
    .onSnapshot((querySnapshot) => {
      let listMagicObjects = [];
      querySnapshot.forEach((doc) => {
        var magic = {
          icon: doc.data().icon,
          title: doc.data().title,
          subtitle: doc.data().subtitle,
          description: doc.data().description
        };
        listMagicObjects.push(magic);
      });
      setMagics(listMagicObjects);
    })
  }

  useEffect(() => {
    getMagics();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      > 
        <Header 
          iconLeft='bars'
          iconRight='dice-d20'
          fLeft={() => navigation.openDrawer()} 
          fRight={() => { }} 
          title="Magias"
        />
        <FlatList
          style={{ alignSelf: 'center', marginBottom: 10, }}
          data={magics}
          keyExtractor={item => item.title}
          renderItem={({item}) => {
            return(
              <ElementMagic
                icon={item.icon} 
                title={item.title} 
                subtitle={item.subtitle} 
                bkg_color='#8A2BE2' 
                modalizeRef={modalizeRef.current}  
                iconModalizeRef={iconModalizeRef.current}
                description={item.description}
                uid={route.params.idUser} 
              />
            )
          }}
        />
        <View style={styles.container}>
          
        </View>
      </ScrollView>
      <View style={styles.addView}>
          <TouchableOpacity style={styles.addButton} onPress={() => { newMagic(); }}>
            <Text style={styles.addText}>Nova Magia</Text>
          </TouchableOpacity>
        </View>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
        >
          <MagicModal 
            title={selectedMagic[0]} 
            subtitle={selectedMagic[1]} 
            description={selectedMagic[2]}
            icon={selectedMagic[3]} 
            modalizeRef={modalizeRef.current} 
            uid={route.params.idUser} 
          />
        </Modalize>
        <Modalize
          ref={iconModalizeRef}
          adjustToContentHeight={true}
        >
          <IconsSelectorModal
            iconModalizeRef={iconModalizeRef.current}
            title={selectedMagic[0]}
            uid={route.params.idUser}
            col="magics"
          />
        </Modalize>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listText: {
    color: '#212125',
    fontFamily: 'Righteous_400Regular',
    fontSize: (deviceWidth/11),
    marginLeft: (deviceWidth/36)
  },
  listView: {
    marginBottom: 20,
    flexDirection: 'row',
    width: (deviceWidth /(36/31)),
    alignSelf: 'center'
  },
  listIcon: {
    color: '#212125'
  },
  line: {
    height: 1,
    backgroundColor: '#212125'
  },
  addView: { 
    width: (deviceWidth), 
    height: (deviceWidth/6), 
    backgroundColor: '#3CB371', 
    alignSelf: 'center', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  addButton: { 
    flexDirection: 'row', 
    width: (deviceWidth/(36/31)), 
    height: (deviceWidth/9), 
    justifyContent: 'center' 
  },
  addText: { 
    alignSelf: 'center', 
    color:'#fffefe',
    fontWeight: 'bold',
    fontSize: (deviceWidth/16) 
  }
})

export default MagicsScreen;