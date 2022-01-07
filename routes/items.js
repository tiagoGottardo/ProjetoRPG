import * as React from 'react';
import { useEffect, useState, useRef, useContext } from 'react';
import { View, Dimensions, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modalize } from 'react-native-modalize';

import Header from '../components/Header';
import ElementItem from '../components/ElementItem';
import ItemModal from '../components/ItemModal';
import IconsSelectorModal from '../components/IconsSelectorModal';
import { SelectedItemContext } from '../components/SelectedItemContext';

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height

function ItemsScreen({ navigation, route }) {
  const [handItems, setHandItems] = useState([]);
  const [bagItems, setBagItems] = useState([]);
  const [homeItems, setHomeItems] = useState([]);
  const { selectedItem, setSelectedItem } = useContext(SelectedItemContext);
  const modalizeRef = useRef(null);
  const iconModalizeRef = useRef(null);
  const scrollViewRef = useRef(null);

  const openModalize = () => {
    modalizeRef.current?.open();
  }

  const newItem = () => {
    setSelectedItem(['', '', '', '', '']);
    scrollViewRef.current?.scrollToEnd({ animated: false })
    openModalize();
  }

  const getItems = () => {
    firebase.firestore().collection(route.params.idUser + 'items')
    .onSnapshot((querySnapshot) => {
      let listHandObjects = [];
      let listBagObjects = [];
      let listHomeObjects = [];
      querySnapshot.forEach((doc) => {
        var item = {
          icon: doc.data().icon,
          title: doc.data().title,
          subtitle: doc.data().subtitle,
          description: doc.data().description,
          target_color: doc.data().target_color,
        };
        switch (doc.data().target_color) {
          case 0: listHandObjects.push(item); break;
          case 1: listBagObjects.push(item); break;
          case 2: listHomeObjects.push(item); break;
        }
      });
      setHandItems(listHandObjects);
      setBagItems(listBagObjects);
      setHomeItems(listHomeObjects);
    })
  }

  useEffect(() => {
    getItems();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
      >
        <Header 
          iconLeft='bars' 
          iconRight="dice-d20"
          fLeft={() => navigation.openDrawer()} 
          fRight={() => {}}
          title="Itens"
        />
        <View style={styles.listView}>
          <Icon name="hand" size={deviceWidth/9} style={styles.listIcon} />
          <Text style={styles.listText}>Em mãos</Text>
        </View>
        <FlatList
          style={{ alignSelf: 'center', marginBottom: 10, }}
          data={handItems}
          keyExtractor={item => item.title}
          renderItem={({item}) => {
            return(
              <ElementItem 
                icon={item.icon} 
                title={item.title} 
                subtitle={item.subtitle} 
                bkg_color='#212125' 
                modalizeRef={modalizeRef.current}  
                iconModalizeRef={iconModalizeRef.current}
                description={item.description} 
                target_color={item.target_color} 
                scrollViewRef={scrollViewRef.current} 
                uid={route.params.idUser} 
              />
            )
          }}
        />
        <View style={styles.line} />
        <View style={styles.listView} marginTop={20}>
          <Icon name="bag-personal" size={deviceWidth/9} style={styles.listIcon} />
          <Text style={styles.listText}>Na Mochila</Text>
        </View>
        <FlatList
          style={{ alignSelf: 'center', marginBottom: 10, }}
          data={bagItems}
          keyExtractor={item => item.title}
          renderItem={({item}) => {
            return(
              <ElementItem 
                icon={item.icon} 
                title={item.title} 
                subtitle={item.subtitle} 
                bkg_color='#212125' 
                modalizeRef={modalizeRef.current}  
                iconModalizeRef={iconModalizeRef.current}
                description={item.description} 
                target_color={item.target_color} 
                scrollViewRef={scrollViewRef.current} 
                uid={route.params.idUser} 
              />
            )
          }}
        />
        <View style={styles.line} />
        <View style={styles.listView} marginTop={20}>
          <Icon name="home" size={deviceWidth/9} style={styles.listIcon} />
          <Text style={styles.listText}>Fora de alcance</Text>
        </View>
        <FlatList
          style={{ alignSelf: 'center', marginBottom: 10, }}
          data={homeItems}
          keyExtractor={item => item.title}
          renderItem={({item}) => {
            return(
              <ElementItem 
                icon={item.icon} 
                title={item.title} 
                subtitle={item.subtitle} 
                bkg_color='#212125' 
                modalizeRef={modalizeRef.current}
                iconModalizeRef={iconModalizeRef.current}
                description={item.description} 
                target_color={item.target_color} 
                scrollViewRef={scrollViewRef.current} 
                uid={route.params.idUser} 
              />
            )
          }}
        />
        <View style={styles.addView}>
          <TouchableOpacity style={styles.addButton} onPress={() => { newItem(); }}>
            <Text style={styles.addText}>Novo Item</Text>
          </TouchableOpacity>
        </View>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
        >
          <ItemModal 
            title={selectedItem[0]} 
            subtitle={selectedItem[1]} 
            description={selectedItem[2]} 
            icon={selectedItem[3]} 
            target_color={selectedItem[4]} 
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
            title={selectedItem[0]}
            uid={route.params.idUser}
          />
        </Modalize>
      </ScrollView>
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

export default ItemsScreen;