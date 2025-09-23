
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";

interface Props {
    message: string,
    setDummyModal: React.Dispatch<React.SetStateAction<boolean>>
}

const SignUpModal = ({message, setDummyModal} : Props) => {

    let modalMessage

    switch (message) {
        case "create":
          modalMessage = "Sign up to create tasks and purchases"
          break;
        default:
          break;
    }
    
    return (
         <View
    style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-6`}
  >
    <View
      style={tw`bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl w-full max-w-sm`}
    >
      <View style={tw`items-center mb-4`}>
        <Icon name="lock-closed" size={32} color="#60a5fa" />
      </View>
      <Text style={tw`text-white text-lg font-semibold text-center mb-2`}>
        {modalMessage}
      </Text>
      <Text style={tw`text-gray-400 text-sm text-center mb-6`}>
        Create an account to customize and manage your own tasks and purchases
      </Text>
      <View style={tw`flex-row gap-x-5`}>
        <TouchableOpacity 
          style={tw`flex-1 bg-gray-700 rounded-lg py-3`}
          onPress={() => setDummyModal(false)}
        >
          <Text style={tw`text-gray-300 font-medium text-center`}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={tw`flex-1 bg-blue-400 rounded-lg py-3`}
          onPress={() => {
            setDummyModal(false);
            router.push({ pathname: "/signup"});
          }}
        >
          <Text style={tw`text-white font-semibold text-center`}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
    )
}

export default SignUpModal