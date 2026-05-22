import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

const ResourceComp = ({title}:{title:string}) => {
  return (
    <View style={styles.container}>
        <View style={styles.document}>
            <Ionicons name='document-text' size={15} color={'#0000004D'}></Ionicons>
             <Text style={styles.title}>{title}</Text>
        </View>
           
           <TouchableOpacity>
                   <MaterialIcons name="file-download" size={22} color="black" />
           </TouchableOpacity>
     
    </View>
  )
}

export default ResourceComp

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:16,
        alignItems:'center'
    },
    document:{
        flexDirection:'row',
        gap:5,
         alignItems:'center'
    },
    title:{
        fontFamily:'Teachers-Medium',
        fontSize:16,
        fontWeight:'500',
        color:'#0000008C'
    }

})