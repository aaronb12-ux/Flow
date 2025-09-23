// @ts-ignore
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import { supabase } from "../supabaseclient";
import Task from "../components/task";
import Purchase from "../components/purchase";
import { useUser } from "../usercontext";
import SignUpModal from '../components/signupmodal'

interface Task {
  id: string;
  task: string;
  created_at: string;
  is_completed: boolean;
}

interface Purchase {
  id: string;
  purchase: string;
  price: number;
  created_at: string;
}

const Homepage = () => {
  //all variables and states
  const { userId } = useUser();
  const [activeTab, setActiveTab] = useState("tasks");
  const [activemodal, setActiveModal] = useState(false);
  const [currenttitle, setCurrentTitle] = useState("");
  const [currentprice, setCurrentPrice] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [newSubmit, setNewSubmit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [modalError, setModalError] = useState("");
  const [dummymodal, setDummyModal] = useState(false)

  const clearFields = () => {
    setActiveModal(false);
    setNewSubmit(newSubmit + 1);
    setCurrentPrice("");
    setCurrentTitle("");
    setModalError("");
  };

  const getDummyData = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from('dummy_tasks').select("*").eq("is_initial", true)
    
        if (data) {
          setTasks(data)
        }
        if (error) {
          throw error
        }
      } catch (error) {
        console.log('error getting initial tasks', error)
      } finally {
        setLoading(false)
      }
  }


  const checkForDailyReset = async () => {
    if (!userId) return;

    try {
      //Get user's last login
      const { data, error } = await supabase
        .from("users")
        .select("last_login")
        .eq("id", userId)
        .single();

      if (error) throw error;

      //Compare dates using local timezone
      const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
      const lastLoginDate = new Date(data.last_login)
        .toLocaleDateString('en-CA');

      //Only reset if it's a different day
      if (lastLoginDate !== today) {
        //Delete incomplete tasks only (keep completed for 30-day history)
        await supabase
          .from("tasks")
          .delete()
          .eq("is_completed", false)
          .eq("userid", userId);

        //Clean up tasks older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        await supabase
          .from("tasks")
          .delete()
          .lt("created_at", thirtyDaysAgo.toISOString())
          .eq("userid", userId);

        //Update last login date
        await supabase
          .from("users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", userId);

        //Clear local state
        setTasks([]);
        setPurchases([]);
      }
    } catch (error) {
      console.error("Error in daily reset:", error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      if (userId && userId !== "dummy") {
        await checkForDailyReset(); // Wait for reset to complete first
      } 
      else {
        await getDummyData();
      }
    };
    
    initializeApp();
  }, [userId]);

  useEffect(() => {
    //logic for getting tasks and purchases for user on every render

    const beginning_of_today = new Date();
    beginning_of_today.setHours(0, 0, 0, 0);

    const end_of_today = new Date();
    end_of_today.setHours(23, 59, 59, 999);

    const date_queries = {
      start_time: beginning_of_today.toISOString(),
      end_time: end_of_today.toISOString(),
    };

    //only set loading on initial app load
    const getTodaysData = async (userId: string | null) => {

      if (userId === "dummy") {
        console.log('returning from getting todays data. dummy user')
        return
      }
      
      if (!userId) {
        setDataError("error loading todays data. please try again.");
        return;
      }

      if (newSubmit <= 0) {
        setLoading(true);
      }

      setDataError("");

      try {
        //consecutive api calls in promise.all
        const [purchasesResult, tasksResult] = await Promise.all([
          supabase
            .from("purchases")
            .select("*")
            .gte("created_at", date_queries.start_time)
            .lte("created_at", date_queries.end_time)
            .eq("userid", userId)
            .order("created_at", { ascending: true }),

          supabase
            .from("tasks")
            .select("*")
            .gte("created_at", date_queries.start_time)
            .lte("created_at", date_queries.end_time)
            .eq("userid", userId)
            .order("created_at", { ascending: true }),
        ]);

        if (purchasesResult.error) throw purchasesResult.error.message;
        if (tasksResult.error) throw tasksResult.error.message;

        if (purchasesResult.data) {
          setPurchases(purchasesResult.data);
        }
        if (tasksResult.data) {
          setTasks(tasksResult.data);
        }
      } catch (error) {
        setDataError("error loading todays data. please try again.");
      } finally {
        setLoading(false);
      }
    };

    getTodaysData(userId);

  }, [newSubmit, userId]);

  const submitData = async () => {
    if (!userId) {
      setModalError("error submitting data");
      return;
    }

    if (userId === "dummy") {
      setActiveModal(false)
      setDummyModal(true)
    }

    setModalError("");

    if (activeTab === "tasks") {
      //if user submits a new task
      try {
        //bad title
        if (currenttitle.length === 0 && userId !== "dummy") {
          setModalError("field cannot be empty");
          return;
        } else {
          const { data, error } = await supabase.from("tasks").insert({
            task: currenttitle,
            userid: userId,
            is_completed: false,
          });

          if (error) {
            throw error;
          } else {
            clearFields();
          }
        }
      } catch (error) {
        setModalError("error submitting task");
      }
    } else {
      try {
        if (currenttitle.length === 0 || currentprice.length === 0) {
          setModalError("fields cannot be empty");
          return;
        } else {
          const { data, error } = await supabase.from("purchases").insert({
            purchase: currenttitle,
            userid: userId,
            price: currentprice,
          });

          if (error) {
            throw error;
          } else {
            clearFields();
          }
        }
      } catch (error) {
        setModalError("error submitting purchase");
      }
    }
  };

  const handleCreate = () => {
    if (activeTab === "tasks") {
      setActiveModal(true);
    } else {
      setActiveModal(true);
    }
  };

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
              {activeTab === "tasks" ? "Create Task" : "Add Purchase"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setActiveModal(false), setModalError("");
              }}
            >
              <Icon name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View style={tw`mb-2`}>
            <Text style={tw`text-gray-300 font-medium mb-2`}>Title</Text>
            <TextInput
              style={tw`bg-gray-700 text-gray-100 p-3 rounded-lg border border-gray-600`}
              placeholder="Enter title..."
              placeholderTextColor="#6b7280"
              onChangeText={setCurrentTitle}
            />
          </View>

          {activeTab === "finance" && (
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-300 font-medium mb-2`}>Amount</Text>
              <TextInput
                style={tw`bg-gray-700 text-gray-100 p-3 rounded-lg border border-gray-600`}
                placeholder="$0.00"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                returnKeyType="done"  // Shows "Done" button
                onSubmitEditing={() => {
                Keyboard.dismiss();
                }}
                onChangeText={setCurrentPrice}
              />
            </View>
          )}

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
                setActiveModal(false), setModalError("");
              }}
              style={tw`flex-1 bg-gray-600 py-3 rounded-lg`}
            >
              <Text style={tw`text-gray-200 text-center font-semibold`}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-1 bg-blue-400 py-3 rounded-lg`}
              onPress={() => submitData()}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                {activeTab === "tasks" ? "Create" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

  const getEmptyStateContent = () => {
    if (activeTab === "tasks") {
      return {
        icon: "checkmark-circle-outline",
        title: "No tasks yet",
        subtitle: "Create your first task to get started",
        buttonText: "Create Task",
        buttonIcon: "add",
      };
    } else {
      return {
        icon: "wallet-outline",
        title: "No purchases yet",
        subtitle: "Start tracking your daily expenses",
        buttonText: "Add Purchase",
        buttonIcon: "card-outline",
      };
    }
  };

  const content = getEmptyStateContent();

  return (
    <View style={tw`flex-1 bg-gray-900 px-5 pt-15`}>
      <View style={tw`mb-10`}>
        <View style={tw`flex-row items-center justify-between static`}>
          <Text style={tw`text-4xl font-bold text-gray-50`}>
            {activeTab === "tasks" ? "Tasks" : "Finance"}
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-400 rounded-xl shadow-lg p-3`}
            onPress={handleCreate}
          >
            <Icon name={content.buttonIcon} size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={tw`text-base text-gray-400`}>
          {activeTab === "tasks"
            ? "Stay organized and get things done"
            : "Track your daily spending habits"}
        </Text>
      </View>

      {/* Toggle Switch */}
      <View style={tw`flex-row bg-gray-800 rounded-xl p-1`}>
        <TouchableOpacity
          style={tw`flex-1 py-3 rounded-lg ${
            activeTab === "tasks" ? "bg-blue-400" : ""
          }`}
          onPress={() => setActiveTab("tasks")}
        >
          <Text
            style={tw`text-center font-semibold ${
              activeTab === "tasks" ? "text-white" : "text-gray-400"
            }`}
          >
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3 rounded-lg ${
            activeTab === "finance" ? "bg-blue-400" : ""
          }`}
          onPress={() => setActiveTab("finance")}
        >
          <Text
            style={tw`text-center font-semibold ${
              activeTab === "finance" ? "text-white" : "text-gray-400"
            }`}
          >
            Finance
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1 mt-2`}>
        {(activeTab === "tasks" &&
          (loading ||
            dataError ||
            (tasks && tasks.length > 0))) ||
        (activeTab === "finance" &&
          (loading ||
            dataError ||
            (purchases && purchases.length > 0))) ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={tw``}>
              {activeTab === "tasks" &&
                (dataError ? (
                  <View style={tw`items-center justify-center`}>
                    <View style={tw`items-center justify-center mt-6 mx-4`}>
      <View style={tw`bg-red-900/20 border border-red-400/30 rounded-lg px-4 py-3`}>
        <Text style={tw`text-red-300 text-center text-sm`}>
          error loading today's tasks. please try again
        </Text>
      </View>
    </View>
                  </View>
                ) : loading ? (
                  <View style={tw`items-center justify-center mt-50`}>
                    <Text style={tw`text-white`}>loading tasks...</Text>
                  </View>
                ) : (
                  tasks.map((task, index) => (
                    <Task
                      key={task.id}
                      name={task.task}
                      completed={task.is_completed}
                      id={task.id}
                      onUpdate={setNewSubmit}
                    />
                  ))
                ))}
              {activeTab === "finance" &&
                (dataError ? (
                  <View style={tw`items-center justify-center`}>
                    <View style={tw`items-center justify-center mt-6 mx-4`}>
      <View style={tw`bg-red-900/20 border border-red-400/30 rounded-lg px-4 py-3`}>
        <Text style={tw`text-red-300 text-center text-sm`}>
          error loading todays purchases. please try again.
        </Text>
      </View>
    </View>
                  </View>
                ) : loading ? (
                  <View style={tw`items-center justify-center mt-50`}>
                    <Text style={tw`text-white`}>loading purchases...</Text>
                  </View>
                ) : (
                  purchases.map((purchase, index) => (
                    <Purchase
                      key={purchase.id}
                      name={purchase.purchase}
                      id={purchase.id}
                      price={purchase.price}
                      onUpdate={setNewSubmit}
                    />
                  ))
                ))}
            </View>
          </ScrollView>
        ) : (
          // Your original custom UI shows when arrays are empty AND not loading/error
          <View style={tw`flex-1 items-center justify-center mb-15`}>
            <Icon name={content.icon} size={80} color="#6b7280" />
            <Text style={tw`text-2xl font-semibold text-gray-100 mt-5 mb-2`}>
              {content.title}
            </Text>
            <Text style={tw`text-base text-gray-500 text-center`}>
              {content.subtitle}
            </Text>
          </View>
        )}
      </View>

      <Modal visible={activemodal} animationType="slide" transparent={true}>
        {modalContent}
      </Modal>

      <Modal visible={dummymodal} animationType="slide" transparent={true}>
        <SignUpModal
          message="create"
          setDummyModal={setDummyModal}
        />
      </Modal>
    </View>
  );
};

export default Homepage;