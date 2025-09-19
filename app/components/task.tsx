import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import tw from "twrnc";
import { supabase } from "../supabaseclient";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  name: string;
  completed: boolean;
  id: string;
  onUpdate: React.Dispatch<React.SetStateAction<number>>;
}

const Task = ({ name, completed, id, onUpdate }: Props) => {
  //next add feature where if user holds down on task bar, theres an edit and delete option
  const [holdpress, setholdpress] = useState(false);
  const [currenttask, setCurrentTask] = useState(name);
  const [errorMessage, setErrorMessage] = useState("");
  const [toggleError, setToggleError] = useState(false);

 const toggleerrormodal = (
  <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
    <View style={tw`bg-gray-800 p-3 rounded-lg w-75 shadow-xl border border-gray-700 pr-3`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-gray-300 text-sm flex-1 pr-2`}>
          Error toggling task. Please try again.
        </Text>
        <TouchableOpacity onPress={() =>{setToggleError(false), setErrorMessage("")}}>
          <Icon name="close" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
)

  const toggletask = async () => {
    const newCompleted = !completed;
    //if new completed is false, then decrament tasks completed
    //if new completed is true, then incrament tasks completed
    try {
      const { data, error } = await supabase //do modal for this
        .from("tasks")
        .update({
          is_completed: newCompleted,
        })
        .eq("id", id)
        .select();

      if (error) {   
        throw error;
      }
      else {
        onUpdate((prev) => prev + 1);
        setErrorMessage("")
      }

    } catch (error) {
      setErrorMessage("error toggling task. please try again");
      setToggleError(true)
    }
  };

  const updateTask = async () => {
    try {
      if (currenttask.length == 0) {
          setErrorMessage("field cannot be empty")
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
        setErrorMessage("")
      }
      }
    } catch (error) {
      setErrorMessage("error updating task. please try again");
    }
  };

  const deleteTask = async () => {
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
        setErrorMessage("")
      }
    } catch (error) {
      setErrorMessage("error deleting task. please try again");
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
            <Text style={tw`text-red-600 text-center mb-1`}>{errorMessage}</Text>
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
          style={tw`flex-row items-center justify-between bg-gray-800 p-4 rounded-xl w-85 shadow-2xl border border-gray-700 mt-2`}
        >
          <View style={tw`flex-1 mr-4`}>
            <Text
              style={tw`text-white text-base font-medium ${
                completed ? "line-through text-gray-400" : ""
              }`}
            >
              {name}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={tw`w-6 h-6 border-2 ${
                completed ? "bg-green-500 border-green-500" : "border-gray-400"
              } rounded-md flex items-center justify-center`}
              onPress={toggletask}
            >
              {completed && (
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
    </View>
  );
};

export default Task;
