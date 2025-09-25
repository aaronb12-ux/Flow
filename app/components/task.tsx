import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import tw from "twrnc";
import { supabase } from "../supabaseclient";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "../usercontext";
import { router } from "expo-router";

interface Props {
  name: string;
  completed: boolean;
  id: string;
  onUpdate: React.Dispatch<React.SetStateAction<number>>;
}

const Task = ({ name, completed, id, onUpdate }: Props) => {
  const [holdpress, setholdpress] = useState(false);
  const [currenttask, setCurrentTask] = useState(name);
  const [errorMessage, setErrorMessage] = useState("");
  const [toggleError, setToggleError] = useState(false);
  const [signmodalactive, setSignModalActive] = useState(false)
  const { userId } = useUser();

  // Local state for optimistic updates
  const [localCompleted, setLocalCompleted] = useState(completed);
  const [isToggling, setIsToggling] = useState(false);

  
  const toggleerrormodal = (
    <View
      style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-6`}
    >
      <View
        style={tw`bg-red-900/20 border border-red-400/30 rounded-lg p-4 shadow-xl w-full max-w-sm`}
      >
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-red-300 text-center text-sm flex-1 pr-3`}>
            Error toggling task. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setToggleError(false), setErrorMessage("");
            }}
          >
            <Icon name="close" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );


   const signupmodal = (
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
        Sign up to edit and delete tasks and purchases
      </Text>
      <Text style={tw`text-gray-400 text-sm text-center mb-6`}>
        Create an account to customize and manage your own tasks and purchases
      </Text>
      <View style={tw`flex-row gap-x-5`}>
        <TouchableOpacity 
          style={tw`flex-1 bg-gray-700 rounded-lg py-3`}
          onPress={() => setSignModalActive(false)}
        >
          <Text style={tw`text-gray-300 font-medium text-center`}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={tw`flex-1 bg-blue-400 rounded-lg py-3`}
          onPress={() => {
            setSignModalActive(false);
            router.push({ pathname: "/signup"});
          }}
        >
          <Text style={tw`text-white font-semibold text-center`}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);


  const toggletask = async () => {
    // Prevent double-clicks during API call
    if (isToggling) return;

    const newCompleted = !localCompleted;

    //Optimistic update - change UI immediately
    setLocalCompleted(newCompleted);
    setIsToggling(true);

  
      try {
        const { data, error } = await supabase
          .from("tasks")
          .update({
            is_completed: newCompleted,
          })
          .eq("id", id)
          .select();

        if (error) {
          // Revert optimistic update on error
          setLocalCompleted(!newCompleted);
          throw error;
        } else {
          onUpdate((prev) => prev + 1);
          setErrorMessage("");
        }
      } catch (error) {
        setErrorMessage("error toggling task. please try again");
        setToggleError(true);
      } finally {
        setIsToggling(false);
      }
  
  };

  const updateTask = async () => {

    if (userId && userId !== "dummy") {
      try {
      if (currenttask.length == 0) {
        setErrorMessage("field cannot be empty");
      } else {
        const { data, error } = await supabase
          .from("tasks")
          .update({
            task: currenttask,
          })
          .eq("id", id)
          .select();

        if (error) {
          throw error;
        } else {
          onUpdate((prev) => prev + 1);
          setholdpress(false);
          setErrorMessage("");
        }
      }
    } catch (error) {
      setErrorMessage("error updating task");
    }
    } else {
      setholdpress(false)
      setSignModalActive(true)
      console.log('sign up to edit!')
    }

  };

  const deleteTask = async () => {

    if (userId && userId !== "dummy") {
try {
      const { data, error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      } else {
        onUpdate((prev) => prev + 1);
        setholdpress(false);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("error deleting task");
    }
    } else {
      setholdpress(false)
      setSignModalActive(true)
      console.log('sign up to delete!')
    }
  
  };

  const modalContent = (
    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
      <View
        style={tw`bg-gray-800 p-6 rounded-xl w-80 shadow-2xl border border-gray-700`}
      >
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-100`}>
            Edit or Delete Task
          </Text>
          <TouchableOpacity
            onPress={() => {
              setholdpress(false), setErrorMessage("");
            }}
          >
            <Icon name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={tw`mb-2`}>
          <Text style={tw`text-gray-300 font-medium mb-2`}>Title</Text>
          <TextInput
            style={tw`bg-gray-700 text-gray-100 p-3 rounded-lg border border-gray-600`}
            placeholder="Enter new title..."
            placeholderTextColor="#6b7280"
            onChangeText={setCurrentTask}
            value={currenttask}
          />
        </View>
        <View style={tw`h-8 items-center justify-center`}>
          {errorMessage && (
            <View
              style={tw`bg-red-900/20 border border-red-400/30 rounded-lg px-4 py-1`}
            >
              <Text style={tw`text-red-300 text-center text-sm`}>
                {errorMessage}
              </Text>
            </View>
          )}
        </View>

        <View style={tw`flex-row gap-3 mt-2`}>
          <TouchableOpacity
            onPress={deleteTask}
            style={tw`flex-1 bg-red-600 py-3 rounded-lg`}
          >
            <Text style={tw`text-gray-200 text-center font-semibold`}>
              delete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-1 bg-blue-400 py-3 rounded-lg`}
            onPress={updateTask}
          >
            <Text style={tw`text-white text-center font-semibold`}>update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const holdpressrun = () => {
    setholdpress(true);
    setCurrentTask(name);
  };

  return (
    <View>
      <TouchableOpacity onLongPress={holdpressrun}>
        <View
          style={tw`flex-row items-center justify-between bg-gray-800 p-4 rounded-xl w-85 shadow-2xl border border-gray-700 mt-2 ${
            isToggling ? "opacity-70" : "opacity-100"
          }`}
        >
          <View style={tw`flex-1 mr-4`}>
            <Text
              style={tw`text-white text-base font-medium ${
                localCompleted ? "line-through text-gray-400" : ""
              }`}
            >
              {name}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={tw`w-6 h-6 border-2 ${
                localCompleted
                  ? "bg-green-500 border-green-500"
                  : "border-gray-400"
              } rounded-md flex items-center justify-center`}
              onPress={toggletask}
              disabled={isToggling}
            >
              {localCompleted && (
                <Text style={tw`text-white text-sm font-bold`}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={holdpress} animationType="slide" transparent={true}>
        {modalContent}
      </Modal>

      <Modal visible={toggleError} transparent={true}>
        {toggleerrormodal}
      </Modal>

      <Modal visible={signmodalactive} animationType="slide" transparent={true} >
        {signupmodal}
      </Modal>

    </View>

  );
};

export default Task;
