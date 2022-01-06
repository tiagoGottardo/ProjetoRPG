import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

var deviceWidth = Dimensions.get('window').width;

export default function ({ iconLeft, iconRight, fLeft, fRight, title }) {
    return (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { fLeft() }} style={{ width: (deviceWidth/6), height: (deviceWidth/6), alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={iconLeft} size={deviceWidth/15} color="#fffefe" />
          </TouchableOpacity>
          <Text style={{ fontSize: (deviceWidth/14.4), alignSelf: 'center', alignContent: 'center', fontFamily: 'Righteous_400Regular', color: '#fffefe' }}>
            {title}
          </Text>
          <TouchableOpacity onPress={() => { fRight() }} style={{ width: (deviceWidth/6), height: (deviceWidth/6), alignItems: 'center', justifyContent: 'center' }} >
            <Icon name={iconRight} size={deviceWidth/15} color='#fffefe' />
          </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: (deviceWidth/6),
        flexDirection: 'row',
        backgroundColor: '#212125',
        margin: (deviceWidth/24),
        borderRadius: (deviceWidth/12),
        alignItems: 'center',
        justifyContent: 'space-between'
      }
})