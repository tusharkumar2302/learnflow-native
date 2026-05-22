import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

export default function SignUp() {
  return (
     <LinearGradient
      colors={['#0B0B0D','#191321']}
      start={{x:0,y:0}}
      end={{x:1,y:1}}
      style={styles.formContainer}
      
      >
      
      <View style={{}}>
        
        <View style={{alignItems:'center', gap:5}}>
              <Text style={styles.SignUpTitle}>Sign Up</Text>
        <Text style={styles.credentialText}>Enter your Zuperior Credentials</Text>
        </View>
      

        <View style={[styles.inputContainer,{paddingHorizontal:0}]}>
            <View style={{ backgroundColor: '#CAA2FC26', height:'100%', borderRadius:15, justifyContent:'center',alignItems:'center'}} >
               <Text style={styles.countryCode}>🇺🇸 +1</Text>  
            </View>
         
         <View style={{ backgroundColor: '#CAA2FC26', borderRadius:15, flex:1}} >
            <TextInput
            placeholder="Phone Number / Email"
            placeholderTextColor="#FFFFFF40"
            style={styles.input}
          /> 
         </View>
         
        </View>

        <View style={[styles.inputContainer,{backgroundColor:'#CAA2FC26', marginVertical:8}]}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#FFFFFF40"
            secureTextEntry
            style={styles.input}
          />
          <Ionicons name="eye-off-outline" size={20} color="#FFFFFF40" />
          {/* <Image source={require('@/assets/icons/eye.png')} style={{height:20,width:20}}></Image> */}
        </View>

        <View style={[styles.inputContainer,{backgroundColor:'#CAA2FC26', marginVertical:3}]}>
          <TextInput
            placeholder="Confirm your password"
            placeholderTextColor="#FFFFFF40"
            secureTextEntry
            style={styles.input}
          />
          <Ionicons name="eye-off-outline" size={20} color="#FFFFFF40" />
          {/* <Image source={require('@/assets/icons/eye.png')} style={{height:20,width:20}}></Image> */}
        </View>

   
      {/* <TouchableOpacity style={{backgroundColor:''}}>
          <Text style={styles.forgotText}>*Forgot your password?</Text>
        </TouchableOpacity> */}

    
        
        <TouchableOpacity style={styles.GetOtpButton} onPress={()=>{}} >
          <Text style={styles.GetOtpText}>Get OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestButton}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <Text style={{ color: '#aaa',fontSize:12 }}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={{ color: '#CAA2FC',textDecorationLine: 'underline', }}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
      </LinearGradient>
  )
}


const styles = StyleSheet.create({
    container: {
  flex:1,
    backgroundColor: '#E6C9F5', // light purple
    paddingHorizontal: 12,
    paddingTop: 60,
    
  },
  heading: {
    fontSize: 55,
    fontWeight: '600',
    color: '#000',
    textAlign: 'left',
    marginTop:0,
    marginLeft:20
  },
  subheading: {
    fontSize: 17,
    color: '#333',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 0,
    marginLeft:20
  },
  image: {
    width: '100%',
    height: 240,
    alignSelf: 'center',
    marginBottom: 20,
    position:'relative',
   
  },
  formContainer: {
  //  backgroundColor: '#000',
    borderRadius: 30,
    padding: 15,
   position:'absolute',
   left:0,
  
   top:"16%",
    width:'100%'
  },
  SignUpTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  credentialText: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   // backgroundColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 3,
   height:37,
   gap:7
  },
  countryCode: {
    color: '#FFFFFFBF',
   // marginRight: 8,
   padding:10
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 10,
    
  },
  forgotText: {
    color: '#CAA2FC',
    fontSize: 12,
    textAlign: 'left',
   // marginTop: 4,

    marginBottom: 6,
    fontWeight:'600'
  },
  GetOtpButton: {
    backgroundColor: '#CAA2FC',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  GetOtpText: {
    color: '#000000CC',
    fontWeight: 'bold',
  },
  guestButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  guestText: {
    color: '#000000A6',
    fontWeight: 'bold',
    
  },
})