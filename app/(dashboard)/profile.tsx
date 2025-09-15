import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import { useUser } from "../usercontext";
import { supabase } from "../supabaseclient";
import { router } from "expo-router";

const Profile = () => {
  const [useremail, setUserEmail] = useState("");
  const [usermonth, setUserMonth] = useState("");
  const [useryear, setUserYear] = useState("");
  const [showpasswordmodal, setShowPasswordModal] = useState(false);
  const [newpassword1, setNewPassword1] = useState("");
  const [newpassword2, setNewPassword2] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [errormessage, setErrorMessage] = useState("");
  const [deleteconfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useUser();

  const resetFields = () => {
    setShowPasswordModal(false);
    setNewPassword1("");
    setNewPassword2("");
    setConfirmation(true);
    setErrorMessage("")
  };

  const handledelete = async () => {
    try {
      const { error } = await supabase.rpc("delete_user_account");

      if (error) {
        throw error;
      } else {
        setShowDeleteConfirm(false);
        router.push({ pathname: "/" });
        setErrorMessage("")
      }
    } catch (error) {
      setErrorMessage("error deleting account")
    }
  };

  const handlelogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      } else {
        router.push({ pathname: "/" });
        setErrorMessage("")
      }
    } catch (error) {
      setErrorMessage("error logging out. please try again.")
    }
  };

  const resetPassword = async () => {
    
    if (newpassword1.length === 0 || newpassword2.length === 0) {
         setErrorMessage("password must be at least 6 characters");
    }
    
    else if (newpassword1 === newpassword2) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          password: newpassword1,
        });

        if (error) {
          throw error.message;
        }
        resetFields();
      } catch (error) {

        if (error === "Password should be at least 6 characters.") {
          setErrorMessage("password must be at least 6 characters ")
        } else {
          setErrorMessage("error updating password. please try again.")
        }
        
      }
    } else if (newpassword1 !== newpassword2) {
      setErrorMessage("entries dont match");
    }
  };

  const deleteconfirmationmodal = (
    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
      <View
        style={tw`bg-gray-800 p-6 rounded-xl w-72 shadow-2xl border border-gray-700`}
      >
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold text-gray-100 text-center`}>
            Confirm Action
          </Text>
          <Text style={tw`text-gray-300 text-center mt-2`}>
            Are you sure you want to continue?
          </Text>
        </View>

          <View style={tw`h-5 items-center justify-center -mt-2`}>
          {errormessage && (
            <Text style={tw`text-red-600 text-center`}>{errormessage}</Text>
          )}
        </View>

        <View style={tw`flex-row gap-3 py-2`}>
          <TouchableOpacity
            onPress={() => {setShowDeleteConfirm(false), setErrorMessage("")}}
            style={tw`flex-1 bg-gray-600 py-3 rounded-lg`}
          >
            <Text style={tw`text-gray-200 text-center font-semibold`}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-1 bg-red-500 py-3 rounded-lg`}
            onPress={handledelete}
          >
            <Text style={tw`text-white text-center font-semibold`}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const confirmationmodal = (
    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
      <View
        style={tw`bg-gray-800 p-6 rounded-xl w-72 shadow-2xl border border-gray-700`}
      >
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold text-gray-100 text-center`}>
            Success!
          </Text>
          <Text style={tw`text-gray-300 text-center mt-2`}>
            Your password has been updated
          </Text>
        </View>

        <View style={tw`flex-row gap-3`}>
          <TouchableOpacity
            onPress={() => setConfirmation(false)}
            style={tw`flex-1 bg-gray-600 py-3 rounded-lg`}
          >
            <Text style={tw`text-gray-200 text-center font-semibold`}>
              return
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const modalContent = //modal
    (
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
      >
        <View
          style={tw`bg-gray-800 p-6 rounded-xl w-80 shadow-2xl border border-gray-700`}
        >
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-xl font-bold text-gray-100`}>
              Change Password
            </Text>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-300 font-medium mb-2`}>New Password</Text>
            <TextInput
              style={tw`bg-gray-700 text-gray-100 p-3 rounded-lg border border-gray-600`}
              placeholder="Enter new password..."
              placeholderTextColor="#6b7280"
              secureTextEntry={true}
              onChangeText={setNewPassword1}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-gray-300 font-medium mb-2`}>
              Confirm Password
            </Text>
            <TextInput
              style={tw`bg-gray-700 text-gray-100 p-3 rounded-lg border border-gray-600`}
              placeholder="Confirm new password..."
              placeholderTextColor="#6b7280"
              secureTextEntry={true}
              onChangeText={setNewPassword2}
            />
          </View>
          <View style={tw`flex items-center justify-center`}>
            <Text style={tw`text-red-600 font-bold text-xs`}>
              {errormessage}
            </Text>
          </View>

          <View style={tw`flex-row gap-3 mt-6`}>
            <TouchableOpacity
              onPress={() => {
                setShowPasswordModal(false);
                setErrorMessage("");
              }}
              style={tw`flex-1 bg-gray-600 py-3 rounded-lg`}
            >
              <Text style={tw`text-gray-200 text-center font-semibold`}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-1 bg-blue-400 py-3 rounded-lg`}
              onPress={resetPassword}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

  useEffect(() => {
    const getEmailandDate = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("users")
          .select("email, created_at")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }

        setUserEmail(data.email);
        const date = data.created_at;

        setUserMonth(new Date(date).toDateString().split(" ")[1]);
        setUserYear(new Date(date).toDateString().split(" ")[3]);
        
      } catch (error) {
          console.log("error fetching user creation date and email");
      } finally {
        setLoading(false);
      }
    };
    getEmailandDate();
  }, []);

  return (
    <View style={tw`flex-1 bg-gray-900`}>
      {/* Header */}
      <View style={tw`px-5 pt-15 pb-6`}>
        <Text style={tw`text-4xl font-bold text-gray-50`}>Profile</Text>
        <Text style={tw`text-base text-gray-400`}>
          Manage your account and view your progress
        </Text>
      </View>

      {/* User Info Card */}
      <View style={tw`mx-5 mb-6`}>
        <View style={tw`bg-gray-800 rounded-xl p-6`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`bg-blue-400 rounded-full p-4 mr-4`}>
              <Icon name="person" size={32} color="#ffffff" />
            </View>
            <View style={tw`flex-1`}>
              {loading ? (
                <View>
                  {" "}
                  <Text style={tw`ml-5 text-white`}>
                    loading profile data...
                  </Text>{" "}
                </View>
              ) : (
                <View>
                  <Text style={tw`text-gray-400`}>{useremail}</Text>
                  <Text style={tw`text-gray-500 text-sm mt-1`}>
                    Member since {usermonth} {useryear}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={tw`px-5`}>
        <Text style={tw`text-xl font-bold text-gray-100 mb-4`}>Settings</Text>

        <View style={tw`bg-gray-800 rounded-xl`}>
          <TouchableOpacity
            style={tw`flex-row items-center p-4 border-b border-gray-700`}
            onPress={() => {setShowPasswordModal(true), setErrorMessage("")}}
          >
            <Icon name="person-circle" size={24} color="#9ca3af" />
            <Text style={tw`text-gray-100 ml-3 flex-1`}>Change Password</Text>
            <Icon name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center p-4 border-b border-gray-700`}
            onPress={() => {setShowDeleteConfirm(true), setErrorMessage("")}}
          >
            <Icon name="trash" size={24} color="#6b7280" />
            <Text style={tw`text-gray-100 ml-3 flex-1`}>Delete Account</Text>
            <Icon name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-row items-center p-4`}
            onPress={handlelogout}
          >
            <Icon name="log-out" size={24} color="#f87171" />
            <Text style={tw`text-red-400 ml-3 flex-1`}>Logout</Text>
            <Icon name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          
        </View>
        
          <View style={tw` items-center justify-center `}>
          {errormessage === "error logging out. please try again." && (
            <Text style={tw`text-red-600 text-center`}>{errormessage}</Text>
          )}
        </View>

      </View>


      <Modal
        visible={showpasswordmodal}
        animationType="slide"
        transparent={true}
      >
        {modalContent}
      </Modal>

      <Modal visible={confirmation} animationType="slide" transparent={true}>
        {confirmationmodal}
      </Modal>

      <Modal visible={deleteconfirm} animationType="slide" transparent={true}>
        {deleteconfirmationmodal}
      </Modal>
    </View>
  );
};

export default Profile;
