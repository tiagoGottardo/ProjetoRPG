import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler, Linking, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import { 
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
 } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/app';
import 'firebase/firestore';

export function DrawerContent(props, { route }) {

  const Logout = () => {
    firebase.auth().signOut().then(() => {
      props.navigation.navigate("Login")
      alert("User desconnected!")
    }).catch((error) => {
      alert(error)
    });
  }

  return(

    <View style={{ flex:1 }}>
      <View style={{
        backgroundColor: '#000001', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 100,
        margin: 10,
        borderRadius: 10
      }}>
        <Text style={{ color: 'white', fontSize: 30, fontWeight: '800' }}>Projeto RPG</Text> 
      </View>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem  style={styles.drawerItem} icon={() => (
              <Icon name="account" size={ 30 }/>
            )}  label="Perfil" onPress={() => {props.navigation.navigate('Perfil')}}/>
            <DrawerItem style={styles.drawerItem} icon={() => (
              <Icon name="sword" size={ 30 }/>
            )}  label="Ações" onPress={() => {props.navigation.navigate('Ações')}}/>
            <DrawerItem style={styles.drawerItem} icon={() => (
              <Icon name="candle" size={ 30 }/>
            )}  label="Itens" onPress={() => {props.navigation.navigate('Itens')}}/>
            <DrawerItem style={styles.drawerItem} icon={() => (
              <Icon name="map" size={ 30 }/>
            )}  label="Mapas" onPress={() => {props.navigation.navigate('Mapas')}}/>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem style={styles.logout} icon={() => (
              <Icon name="discord" size={ 30 }/>
            )}  label="Discord" onPress={() => Linking.openURL('https://discord.com/channels/385547067315191808/864961439479496735')}/>
            <DrawerItem style={styles.logout} icon={() => (
              <Icon name="logout-variant" size={ 30 }/>
            )}  label="Logout" onPress={Logout}/>
          </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    flexDirection:'row', 
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14
  },
  column: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center'
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3
  },
  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1
  },
  logout: {
    justifyContent: 'flex-end'
  },
  drawerItem: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1
  }
});