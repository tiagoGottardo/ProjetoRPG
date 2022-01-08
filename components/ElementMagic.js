import React, { useContext, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TapGestureHandler } from 'react-native-gesture-handler';

import { SelectedMagicContext } from "./SelectedMagicContext";

import firebase from 'firebase/app';
import 'firebase/firestore';

var deviceWidth = Dimensions.get('window').width;

const color_primary = "#4B0082"
const color_secondary = '#fffefe'

export default function ({ title, subtitle, icon, bkg_color, modalizeRef, iconModalizeRef, description, uid }) {
  const { setSelectedMagic } = useContext(SelectedMagicContext);


  const openModalize = () => {
    modalizeRef?.open();
  }

  const openEditItem = () => {
    setSelectedMagic([title, subtitle, description, icon]);
    openModalize()
  }

  const openEditIcon = () => {
    setSelectedMagic([title, subtitle, description, icon]);
    iconModalizeRef?.open();
  }

  return(
      <View style={styles.List} backgroundColor={bkg_color} >
        <TouchableOpacity style={styles.ButtonLeft} onPress={() => { openEditIcon(); }}>
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
    borderColor: color_primary,
    elevation: 5
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
    marginBottom: (deviceWidth/140)
  },
  itemBox: {
    flex: 8,
    height: (deviceWidth/7),
    justifyContent: 'center',
  }
})