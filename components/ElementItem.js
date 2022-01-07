import React, { useContext, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TapGestureHandler } from 'react-native-gesture-handler';

import { SelectedItemContext } from './SelectedItemContext';

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;

const color_primary = "#212125"
const color_secondary = '#fffefe'

export default function ({ title, subtitle, icon, bkg_color, modalizeRef, target_color, description, scrollViewRef, uid }) {
  const { setSelectedItem } = useContext(SelectedItemContext);


  const openModalize = () => {
    modalizeRef?.open();
  }

  const openEditItem = () => {
    setSelectedItem([title, subtitle, description, icon, target_color]);
    scrollViewRef?.scrollToEnd({ animated: false })
    openModalize()
  }

  const upItem = (nameDoc, lTarget_color) => {
    if(lTarget_color == 0) {
      firebase.firestore().collection(uid + 'items').doc(nameDoc).update({
        target_color: 2
      })
    } else {
      firebase.firestore().collection(uid + 'items').doc(nameDoc).update({
        target_color: firebase.firestore.FieldValue.increment(-1)
      })
    }
  }

  const downItem = (nameDoc, lTarget_color) => {
    if(lTarget_color == 2) {
      firebase.firestore().collection(uid + 'items').doc(nameDoc).update({
        target_color: 0
      })
    } else {
      firebase.firestore().collection(uid + 'items').doc(nameDoc).update({
        target_color: firebase.firestore.FieldValue.increment(1)
      })
    }
  }

  return(
      <View style={styles.List} backgroundColor={bkg_color} >
        <TouchableOpacity style={styles.ButtonLeft} onPress={() => { }}>
          <Icon name={icon} size={(deviceWidth/12) - 10} style={styles.IconButton} />
        </TouchableOpacity>
        <TapGestureHandler
          numberOfTaps={1}
          onActivated={() => {openEditItem()}}
        >
          <View style={styles.itemBox}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </TapGestureHandler>
        <View style={{ flex: 2 }}>
          <TouchableOpacity style={styles.ButtonRight} onPress={() => { upItem(title, target_color); }}>
            <Icon name='chevron-up' size={(deviceWidth/14) - 10} style={styles.IconButton} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ButtonRight} onPress={() => { downItem(title, target_color); }}>
            <Icon name='chevron-down' size={(deviceWidth/14) - 10} style={styles.IconButton} />
          </TouchableOpacity>
        </View>
        
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  ButtonLeft: {
    flex: 2,
    height: (deviceWidth/7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonRight: {
    flex: 1,
    width: (deviceWidth/7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconButton: {
    marginRight: 5,
    marginLeft: 5,
    color: color_secondary,
  },
  List: {
    width: (deviceWidth /(36/31)),
    height: (deviceWidth/7),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: (deviceWidth/14),
    marginBottom: (deviceWidth/36),
    borderWidth: 1,
    borderColor: color_primary
  },
  title: {
    marginLeft: 12,
    marginRight: 12,
    fontSize: (deviceWidth/18),
    color: color_secondary,
    fontWeight: 'bold',
  },
  subtitle: {
    marginLeft: 12,
    marginRight: 12,
    fontSize: deviceWidth/30,
    color: color_secondary,
  },
  itemBox: {
    flex: 8,
    height: (deviceWidth/7),
    justifyContent: 'center',
  }
})