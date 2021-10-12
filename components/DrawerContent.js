import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';
import { 
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple
 } from 'react-native-paper';
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function DrawerContent(props) {
  return(

    <View style={{flex:1}}>
      <DrawerContentScrollView {...props}>
         <View style={styles.drawerContent}>
              <View style={styles.userInfoSection}>
                  <View style={{flexDirection:'column', marginTop: 15, alignItems: 'center'}}>
                    <Avatar.Image
                        source={require('../assets/user.png')}
                        size={150}
                    />
                    <View>
                          <Title style={styles.title}>Armando da Silva</Title>
                        </View>
                          <View>
                          <View style={styles.section}>
                                  <Paragraph style={[styles.paragraph, styles.caption]}>16/21</Paragraph>
                                  <Icon name="heart" size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                                  <Caption style={styles.caption}>Life</Caption>
                          </View>
                          <View style={styles.section}>
                              <Paragraph style={[styles.paragraph, styles.caption]}>08/19</Paragraph>
                              <Icon name="emoticon-excited-outline" size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                              <Caption style={styles.caption}>Sanity</Caption>
                          </View>
                            <View style={styles.section}>
                                  <Paragraph style={[styles.paragraph, styles.caption]}>03/03</Paragraph>
                                  <Icon name="arm-flex" size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                                  <Caption style={styles.caption}>Constitution</Caption>
                            </View>
                       </View>
                    </ View>
                </View>
            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem icon={() => (
                  <Icon name="account" size={ 20 }/>
              )}  label="Profile" onPress={() => {props.navigation.navigate('Profile')}}/>

            <DrawerItem icon={() => (
                  <Icon name="sword" size={ 20 }/>
              )}  label="Actions" onPress={() => {props.navigation.navigate('Actions')}}/>

            <DrawerItem icon={() => (
                  <Icon name="candle" size={ 20 }/>
              )}  label="Items" onPress={() => {props.navigation.navigate('Items')}}/>

            <DrawerItem icon={() => (
                  <Icon name="map" size={ 20 }/>
              )}  label="Maps" onPress={() => {props.navigation.navigate('Maps')}}/>
                </Drawer.Section>
            </View>
      </DrawerContentScrollView>
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
  drawerSection: {
    marginTop: 15
  },
});