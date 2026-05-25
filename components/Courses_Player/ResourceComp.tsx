import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { HugeiconsIcon } from "@hugeicons/react-native";
import { File01Icon, FileDownloadIcon } from "@hugeicons/core-free-icons";

const ResourceComp = ({title}:{title:string}) => {
  return (
    <View style={styles.container}>
        <View style={styles.document}>
            <HugeiconsIcon icon={File01Icon} size={15} color={'#0000004D'} strokeWidth={1.5} />
             <Text style={styles.title}>{title}</Text>
        </View>

           <TouchableOpacity>
                   <HugeiconsIcon icon={FileDownloadIcon} size={22} color="black" strokeWidth={1.5} />
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