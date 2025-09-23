import { Text, View, TextInput, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { supabase } from "./supabaseclient";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUser } from "./usercontext";
import { UserProvider } from "./usercontext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUser();
  const [badCredentials, setBadCredentials] = useState("");
  const [signingin, setSigningIn] = useState(false)

  const signinuser = async () => {
    
    try {
      setSigningIn(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error.message
      }

      if (!data.user) {
        throw "user error"
      } else {
        setUserId(data.user.id);
        router.push({ pathname: "/(dashboard)/homepage" });
      }
    } catch (error) {
        if (error === "Invalid login credentials"){
          setBadCredentials("Invalid login credentials")
          return
        };
        if (error === "missing email or phone"){
          setBadCredentials("fields cannot be blank")
          return
        }
        else {
          setBadCredentials("error logging in user. check your internet.")
          return
        }
    } finally {
      setSigningIn(false)
    }
  };


   const signinmodal = (
  <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-6 z-5`}>
     <View style={tw`items-center justify-center mx-4`}>
      <View style={tw`bg-white/10 border border-white/20 rounded-lg px-4 py-3`}>
        <Text style={tw`text-white text-center text-sm`}>
          signing in...
        </Text>
      </View>
    </View>
  </View>
)

  return (
    <UserProvider>
      <View style={tw`flex-1 bg-gray-900`}>
        <View
          style={tw`absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10`}
        />

        {/* Floating particles */}
        <View
          style={tw`absolute top-20 left-8 w-2 h-2 bg-blue-400 rounded-full opacity-40`}
        />
        <View
          style={tw`absolute top-32 right-12 w-1 h-1 bg-purple-400 rounded-full opacity-60`}
        />
        <View
          style={tw`absolute top-80 left-16 w-1.5 h-1.5 bg-green-400 rounded-full opacity-30`}
        />

        <View style={tw`flex-1 justify-center px-6`}>
          {/* Logo section */}
          <View style={tw`items-center mb-4`}>
            <View
              style={tw`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl justify-center items-center mb-4 shadow-xl`}
            >
              <View style={tw`flex-row`}>
                <Ionicons name="wallet" size={14} color="#60A5FA" />
                <Ionicons name="checkmark-circle" size={14} color="#34D399" />
              </View>
            </View>
            <Text style={tw`text-2xl font-bold text-white mb-2`}>Sign In</Text>
             
             
             
          <View style={tw`h-10 justify-center`}>
{badCredentials && (
  <View style={tw`bg-red-900/20 border border-red-400/30 rounded-lg px-3 py-2 mx-2`}>
    <Text style={tw`text-red-300 text-center text-sm leading-relaxed`}>
      {badCredentials}
    </Text>
  </View>
)}
</View>
           
          </View>

          {/* Form section */}
          <View style={tw`mb-8`}>
            {/* Email input */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-gray-300 text-sm mb-2 ml-1`}>
                Email Address
              </Text>
              <View
                style={tw`bg-gray-800 rounded-2xl px-4 py-4 flex-row items-center border-2 border-gray-700`}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#9CA3AF"
                  style={tw`mr-3`}
                />
                <TextInput
                  style={[
                    tw`flex-1 text-white text-base`,
                    {
                      lineHeight: 20, // Explicit line height
                      textAlignVertical: "center", // Android alignment
                      includeFontPadding: false, // Remove Android font padding
                    },
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password input */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-gray-300 text-sm mb-2 ml-1`}>Password</Text>
              <View
                style={tw`bg-gray-800 rounded-2xl px-4 py-4 flex-row items-center border-2 border-gray-700`}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9CA3AF"
                  style={tw`mr-3`}
                />
                <TextInput
                  style={[
                    tw`flex-1 text-white text-base`,
                    {
                      lineHeight: 20, // Explicit line height
                      textAlignVertical: "center", // Android alignment
                      includeFontPadding: false, // Remove Android font padding
                    },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Signup button */}
            <TouchableOpacity
              onPress={signinuser}
              style={tw`bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-2xl shadow-xl mb-6`}
              activeOpacity={0.8}
            >
              <Text style={tw`text-white text-lg font-semibold text-center`}>
                Sign In
              </Text>
            </TouchableOpacity>

          </View>

          <View style={tw`items-center`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-gray-400`}>Dont have an account? </Text>
              <View>
                <TouchableOpacity>
                  <Link
                    href={"/signup"}
                    style={tw`text-blue-400 font-semibold`}
                  >
                    Create one here
                  </Link>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <Modal
                      visible={signingin}
                      transparent={true}
                  >
                        {signinmodal}
                </Modal>
      </View>
    </UserProvider>
  );
};

export default Signin;
