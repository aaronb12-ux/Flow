import { Text, View, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import tw from 'twrnc';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "./supabaseclient";
import { useUser } from "./usercontext";
import { router } from "expo-router";

export default function Index() {

  const { setUserId } = useUser();
  const [loading, setLoading] = useState(true)

  useEffect(() => {

     const checkIfLoggedIn = async () => {
      
      try {
        const { data, error} = await supabase.auth.getUser()

        if (error?.message === "Auth session missing!") {
          throw error.message
        } else if (data.user) {
          //current user session
          console.log('setting user and pushing to homepage')
          setUserId(data.user.id)
          setLoading(false)
          router.push({ pathname: "/(dashboard)/homepage" });
        }
      } catch (error) {
        //no current signed in user. send to homepage but show sample daya
        setUserId("dummy")
        setLoading(false)
        router.push({pathname: "/(dashboard)/homepage"})
        return
      }      
  }

  checkIfLoggedIn()
  }, [])


  if (loading) {
    return (
    <View style={tw`flex-1 bg-gray-900 justify-center items-center`}>
      {/* Simple gradient overlay */}
      <View style={tw`absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20`} />
      
      {/* Logo */}
      <View style={tw`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl justify-center items-center mb-6`}>
        <View style={tw`flex-row`}>
          <Ionicons name="wallet" size={16} color="#60A5FA" />
          <Ionicons name="checkmark-circle" size={16} color="#34D399" />
        </View>
      </View>

      {/* App name */}
      <Text style={tw`text-3xl font-bold text-white mb-4`}>
        Flow
      </Text>
    </View>
  );
  }

  return (
    <View style={tw`flex-1 bg-gray-900`}>
      {/* Background gradient overlay */}
      <View style={tw`absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20`} />
      
      {/* Floating particles effect */}
      <View style={tw`absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60`} />
      <View style={tw`absolute top-40 right-16 w-1 h-1 bg-green-400 rounded-full opacity-40`} />
      <View style={tw`absolute top-60 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50`} />
      <View style={tw`absolute bottom-60 right-10 w-2 h-2 bg-blue-300 rounded-full opacity-30`} />
      
      <View style={tw`flex-1 justify-center items-center px-6`}>
        {/* Logo/Icon Section */}
        <Animated.View 
        >
          <View style={tw`w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl justify-center items-center shadow-2xl`}>
            <View style={tw`flex-row`}>
              <Ionicons name="wallet" size={20} color="#60A5FA" />
              <Ionicons name="checkmark-circle" size={20} color="#34D399" />
            </View>
          </View>
        </Animated.View>

        {/* Main Title */}
        <Animated.View     
        >
          <Text style={tw`text-5xl font-bold text-white text-center mb-2`}>
            Flow
          </Text>
          <Text style={tw`text-lg text-gray-300 text-center font-light`}>
            Manage Your Money & Tasks
          </Text>
        </Animated.View>

        {/* Feature highlights */}
        <Animated.View
          
        >
          <View style={tw`flex-row justify-center space-x-8 mb-8`}>
            <View style={tw`items-center`}>
              <View style={tw`w-12 h-12 bg-blue-500/20 rounded-2xl justify-center items-center mb-2`}>
                <Ionicons name="trending-up" size={24} color="#60A5FA" />
              </View>
              <Text style={tw`text-gray-300 text-sm`}>Finance</Text>
            </View>
            
            <View style={tw`items-center`}>
              <View style={tw`w-12 h-12 bg-green-500/20 rounded-2xl justify-center items-center mb-2`}>
                <Ionicons name="list" size={24} color="#34D399" />
              </View>
              <Text style={tw`text-gray-300 text-sm`}>Tasks</Text>
            </View>
            
          </View>
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View
          
        >
          {/* Primary CTA */}
          <Link href="/signup" asChild>
            <TouchableOpacity 
              style={tw`w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-8 rounded-2xl shadow-xl mb-4`}
              activeOpacity={0.8}
            >
              <Text style={tw`text-white text-lg font-semibold text-center`}>
                Get Started Here
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Secondary CTA */}
          <View>
            <TouchableOpacity 
              style={tw`w-full border-2 border-gray-600 py-4 px-8 rounded-2xl mb-8`}
              activeOpacity={0.7}
            >
              <Link href={'/signin'} style={tw`text-gray-300 text-lg font-medium text-center`}>
                Sign In
              </Link>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Bottom tagline */}
        <Animated.View
        >
        </Animated.View>
      </View>
    </View>
  );
}
