import { Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { supabase } from "./supabaseclient";
import { useUser } from "./usercontext";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Signup = () => {
  const { setUserId } = useUser();     

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alreadyregistered, setAlreadyRegistered] = useState(false);
  const [badpassword, setBadPassWord] = useState(false);
  const [bademail, setBadEmail] = useState(false);
  const [errormessage, setErrorMessage] = useState("");

  const handleSignupError = (error: any) => {
    console.log(error.message)
    switch (error.message) {
      case "User already registered":
        setAlreadyRegistered(true);
        setErrorMessage("Email already exists");
        break;
      case "Password should be at least 6 characters.":
        setBadPassWord(true);
        setErrorMessage("Password should be at least 6 characters");
        break;
      case "Unable to validate email address: invalid format":
        setBadEmail(true);
        setErrorMessage("Invalid email format");
        break;
      default:
        setErrorMessage(error.message || "Signup failed. Please try again.");
    }
  };

  const signupuser = async () => {
    try {
      setAlreadyRegistered(false);
      setBadPassWord(false);
      setBadEmail(false);
      setErrorMessage("");

      const { data, error } = await supabase.auth.signUp(

        {
          email: email,
          password: password,
        }
      );

      if (error) {
        handleSignupError(error);
        console.log('error')
      }

      if (!data.user) {
        return
      }

      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        created_at: new Date(),
      });

      if (profileError) {
        console.error("Error creating profile: ", profileError);
        setErrorMessage("Account created but profile set up failed.");
        return;
      }
      setUserId(data.user.id);
      router.push({ pathname: "/(dashboard)/homepage" });
    } catch (error) {
      console.error("Unexpected error during signup: ", error);
      setErrorMessage("An unexpected error occured. Please try again.");
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-900`}>
      {/* Background effects */}
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
        {/* Back button */}

        {/* Logo section */}
        <View style={tw`items-center mb-12`}>
          <View
            style={tw`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl justify-center items-center mb-4 shadow-xl`}
          >
            <View style={tw`flex-row`}>
              <Ionicons name="wallet" size={14} color="#60A5FA" />
              <Ionicons name="checkmark-circle" size={14} color="#34D399" />
            </View>
          </View>
          <Text style={tw`text-2xl font-bold text-white mb-2`}>
            Create Account
          </Text>
          <Text style={tw`text-gray-400 text-center`}>
            Join Flow to manage your money and tasks
          </Text>
          <Text style={tw`text-red-600 text-center mt-2`}>{errormessage}</Text>
        </View>

        {/* Form section */}
        <View style={tw`mb-8`}>
          {/* Email input */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row`}>
              <Text style={tw`text-gray-300 text-sm mb-2 ml-1 `}>
                Email Address
              </Text>
              {alreadyregistered && (
                <Text style={tw`text-red-600 ml-1 mb-2 mt-.5`}>
                  
                </Text>
              )}
              {bademail && (
                <Text style={tw`text-red-600 ml-1 mb-2 mt-.5`}>
                  
                </Text>
              )}
            </View>
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
            <View style={tw`flex-row`}>
              <Text style={tw`text-gray-300 text-sm mb-2 ml-1 `}>Password</Text>
              {badpassword && (
                <Text style={tw`text-red-600 ml-1 mb-2 mt-.5`}>
                  {errormessage}
                </Text>
              )}
            </View>
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
                placeholder="Create a password"
                placeholderTextColor="#6B7280"
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Signup button */}
          <TouchableOpacity
            onPress={signupuser}
            style={tw`bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-2xl shadow-xl mb-6`}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white text-lg font-semibold text-center`}>
              Create
            </Text>
          </TouchableOpacity>

     
        </View>

        {/* Login link */}
        <View style={tw`items-center`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-gray-400`}>Already have an account? </Text>
            <View>
              <TouchableOpacity>
                <Link href={"/signin"} style={tw`text-blue-400 font-semibold`}>
                  Sign In
                </Link>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Signup;
