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
  const [deleteconfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggingout, setLoggingOut] = useState(false)

  // Simplified error states
  const [dataError, setDataError] = useState("");
  const [modalError, setModalError] = useState("");
  const [logoutError, setLogoutError] = useState("");

  const { userId } = useUser();

  const resetFields = () => {
    setShowPasswordModal(false);
    setNewPassword1("");
    setNewPassword2("");
    setConfirmation(true);
    setModalError("");
  };

  const handledelete = async () => {
    setModalError("");
    
    try {
      const { error } = await supabase.rpc("delete_user_account");

      if (error) {
        throw error;
      } else {
        setShowDeleteConfirm(false);
        router.push({ pathname: "/" });
      }
    } catch (error) {
      setModalError("error deleting account");
    }
  };

  const handlelogout = async () => {
    setLogoutError("");
    setLoggingOut(true)
    
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      } else {
        router.push({ pathname: "/" });
      }
    } catch (error) {
      setLogoutError("error logging out. please try again.");
    } finally {
      setLoggingOut(false)
    }
  };

  const resetPassword = async () => {
    setModalError("");
    
    if (newpassword1.length === 0 || newpassword2.length === 0) {
      setModalError("password must be at least 6 characters");
      return;
    }
    
    if (newpassword1 !== newpassword2) {
      setModalError("entries do not match");
      return;
    }
    
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
        setModalError("password must be at least 6 characters");
      } 
      else if (error === "New password should be different from the old password.") {
        setModalError("new password must be different")
      }
      
      else {
        setModalError("error updating password");
      }
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

        <View style={tw`h-8 items-center justify-center`}>
          {modalError && (
            <View style={tw`bg-red-900/20 border border-red-400/30 rounded-lg px-2 py-1`}>
              <Text style={tw`text-red-300 text-center text-sm`}>
                {modalError}
              </Text>
            </View>
          )}
        </View>

        <View style={tw`flex-row gap-3 mt-2`}>
          <TouchableOpacity
            onPress={() => {
              setShowDeleteConfirm(false), setModalError("");
            }}
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

  const logoutmodal = (
  <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-6 z-5`}>
     <View style={tw`items-center justify-center mx-4`}>
      <View style={tw`bg-white/10 border border-white/20 rounded-lg px-4 py-3`}>
        <Text style={tw`text-white text-center text-sm`}>
          logging out...
        </Text>
      </View>
    </View>
  </View>
)

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
              value={newpassword1}
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
              value={newpassword2}
              onChangeText={setNewPassword2}
            />
          </View>
          
          <View style={tw`h-8 items-center justify-center`}>
            {modalError && (
              <View style={tw`bg-red-900/20 border border-red-400/30 rounded-lg px-1 py-1`}>
                <Text style={tw`text-red-300 text-center text-sm`}>
                  {modalError}
                </Text>
              </View>
            )}
          </View>

          <View style={tw`flex-row gap-3 mt-2`}>
            <TouchableOpacity
              onPress={() => {
                setShowPasswordModal(false);
                setModalError("");
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
      if (!userId) {
        setDataError("failed getting profile information. check your internet");
        return;
      }
      
      setDataError("");
      setLoading(true);

      try {
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
        setDataError("failed getting profile information. please try again");
        console.log("error fetching user creation date and email. please try again");
      } finally {
        setLoading(false);
      }
    };
    
    getEmailandDate();
  }, [userId]);


  if (userId === "dummy") {
    return (
  <View style={tw`flex-1 bg-gray-900`}>
    {/* Header */}
    <View style={tw`px-5 pt-15 pb-6`}>
      <Text style={tw`text-4xl font-bold text-gray-50`}>Profile</Text>
      <Text style={tw`text-base text-gray-400`}>
        Sign up to save your progress
      </Text>
    </View>

    <View>
      {/* Guest Profile Card */}
      <View style={tw`mx-5 mb-6`}>
        <View style={tw`bg-gray-800 rounded-xl p-6`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`bg-blue-400 rounded-full p-4 mr-4`}>
              <Icon name="person" size={32} color="#ffffff" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-300 text-lg font-semibold`}>Guest User</Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>
                Browsing anonymously
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sign Up CTA */}
      <View style={tw`mx-5 mb-6`}>
        <View style={tw`bg-gray-900 rounded-xl p-6`}>
          <Text style={tw`text-white text-lg font-bold mb-2 ml-6`}>
            Want to save your progress?
          </Text>
          <Text style={tw`text-blue-100 text-sm mb-4`}>
            Create an account to keep track of your data!
          </Text>
          <TouchableOpacity style={tw`bg-blue-400 rounded-lg py-3 px-4`}
          onPress={() => router.push({ pathname: "/signup"})}
          >
            <Text style={tw`text-white font-semibold text-center`}>
              Sign Up Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Auth Options */}
      <View style={tw`px-5`}>
        <Text style={tw`text-xl font-bold text-gray-100 mb-4`}>
          Get Started
        </Text>

        <View style={tw`bg-gray-800 rounded-xl`}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/signup"})}
            style={tw`flex-row items-center p-4 border-b border-gray-700`}
          >
            <Icon name="person-add" size={24} color="#60a5fa" />
            <Text style={tw`text-gray-100 ml-3 flex-1`}>
              Create Account
            </Text>
            <Icon name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => router.push({ pathname: "/signin"})}
            style={tw`flex-row items-center p-4`}
          >
            <Icon name="log-in" size={24} color="#9ca3af" />
            <Text style={tw`text-gray-100 ml-3 flex-1`}>
              Sign In
            </Text>
            <Icon name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);
  }

  return (
    <View style={tw`flex-1 bg-gray-900`}>
      {/* Header */}
      <View style={tw`px-5 pt-15 pb-6`}>
        <Text style={tw`text-4xl font-bold text-gray-50`}>Profile</Text>
        <Text style={tw`text-base text-gray-400`}>
          Manage your account
        </Text>
      </View>

      {dataError ? (
        <View style={tw`items-center justify-center mt-6 mx-4`}>
          <View style={tw`bg-red-900/20 border border-red-400/30 rounded-lg px-4 py-3`}>
            <Text style={tw`text-red-300 text-center text-sm`}>
              {dataError}
            </Text>
          </View>
        </View>
      ) : (
        <View>
          <View style={tw`mx-5 mb-6`}>
            <View style={tw`bg-gray-800 rounded-xl p-6`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`bg-blue-400 rounded-full p-4 mr-4`}>
                  <Icon name="person" size={32} color="#ffffff" />
                </View>
                <View style={tw`flex-1`}>
                  {loading ? (
                    <View>
                      <Text style={tw`ml-5 text-white`}>
                        loading profile data...
                      </Text>
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

          <View style={tw`px-5`}>
            <Text style={tw`text-xl font-bold text-gray-100 mb-4`}>
              Settings
            </Text>

            <View style={tw`bg-gray-800 rounded-xl`}>
              <TouchableOpacity
                style={tw`flex-row items-center p-4 border-b border-gray-700`}
                onPress={() => {
                  setShowPasswordModal(true), setModalError("");
                }}
              >
                <Icon name="person-circle" size={24} color="#9ca3af" />
                <Text style={tw`text-gray-100 ml-3 flex-1`}>
                  Change Password
                </Text>
                <Icon name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-row items-center p-4 border-b border-gray-700`}
                onPress={() => {
                  setShowDeleteConfirm(true), setModalError("");
                }}
              >
                <Icon name="trash" size={24} color="#6b7280" />
                <Text style={tw`text-gray-100 ml-3 flex-1`}>
                  Delete Account
                </Text>
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

            <View style={tw`h-8 items-center justify-center mt-4`}>
              {logoutError && (
                <View style={tw`bg-red-900/20 border border-red-400/30 rounded-lg px-2 py-1`}>
                  <Text style={tw`text-red-300 text-center text-sm`}>
                    {logoutError}
                  </Text>
                </View>
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

          <Modal
            visible={confirmation}
            animationType="slide"
            transparent={true}
          >
            {confirmationmodal}
          </Modal>

          <Modal
            visible={deleteconfirm}
            animationType="slide"
            transparent={true}
          >
            {deleteconfirmationmodal}
          </Modal>

          <Modal
              visible={loggingout}
              transparent={true}
          >
                {logoutmodal}
        </Modal>

        </View>
      )}
    </View>
  );
};

export default Profile;