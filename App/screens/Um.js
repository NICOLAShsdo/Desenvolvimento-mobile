import React from 'react';
import {View,StyleSheet} from 'react-native';
import Constants from 'expo-constants';

export default function Um() {
    return (
        <View style={styles.container}>
            <View style={style.box1} />
            <View style={styles.box2}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        paddingTop: Constants.statusBarHeight,
    },
box1: {
    flex: 0.5,
    backgroundColor: 'crimson'
},
box2: {
    flex: 0.5,
    backgroundColor: 'salmon',
},

});