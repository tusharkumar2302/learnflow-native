import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OverViewTxt = ({title,value}:{title:string,value:string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleTxt}>{title}</Text>
      <Text style={styles.descripTxt}>{value}</Text>
    </View>
  )
}

export default OverViewTxt

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:16
    },
    titleTxt:{
        color:'#00000066',
        fontSize:16,
        fontFamily:'Teachers-Medium',
        fontWeight:'500'
    },
    descripTxt:{
        color:'Teachers-Medium',
         fontSize:16,
        fontFamily:'Teachers-Medium',
        fontWeight:'500'
    }
})