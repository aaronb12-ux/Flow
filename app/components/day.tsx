import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useState } from "react";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  date: string;
  tasks: Array<Task>;
  purchases: Array<Purchase>;
}

interface Purchase {
  id: string;
  userid: string;
  purchase: string;
  created_at: string;
  price: number;
}

interface Task {
  id: string;
  userid: string;
  task: string;
  created_at: string;
  is_completed: boolean;
}

const Day = ({ date, tasks, purchases }: Props) => {
  const [showmodal, setShowModal] = useState(false);

  const get_purchase_total = () => {
      
    let total_purchase_amount = 0
    for (const item of purchases) {
      total_purchase_amount += item.price
    }

    return total_purchase_amount
  }

  const total = get_purchase_total()

  const modalContent = //modal
    (
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
      >
        <View
          style={tw`bg-gray-800 px-4 py-4 rounded-xl w-80 shadow-2xl border border-gray-700`}
        >
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View></View>

            <View>
              <Text style={tw`text-white font-medium ml-5`}>{date}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Icon name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Tasks Section */}
          <View style={tw`mb-5`}>
          <View style={tw`flex flex-col h-50`}>
             <View style={tw`flex-row items-center mb-3`}>
              <Text style={tw`text-gray-200 font-semibold ml-2`}>Tasks Completed</Text>
            </View>
            <ScrollView>

            {tasks.length != 0 ? <View> 
            
            {tasks.map((task, index) => (
              <View
                style={tw`bg-gray-700 p-3 rounded-lg flex-row items-center mt-2`}
                key={task.id}
              >
                <Text style={tw`text-gray-200 flex-1`}>{task.task}</Text>
              </View>
            ))}
        
            </View> : <View 
            key={null}
            style={tw`flex-row items-center justify-center`}>
                   <Text style={tw`text-white`}>No tasks done this day</Text>
                </View>}
                </ScrollView>
           </View>
          </View>

          {/* Purchases Section */}
          <View style={tw`mb-4`}>
             <View style={tw`flex flex-col h-50`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-gray-200 font-semibold ml-2`}>
                  Purchases
                </Text>
              </View>
              <Text style={tw`text-sm text-gray-400`}>${total} total</Text>
            </View>
            <ScrollView>
            <View style={tw`space-y-2`}>
              {purchases.length != 0 ? <View>
                {purchases.map((purchase, index) => (
                <View key={purchase.id}
                  style={tw`bg-gray-700 p-3 rounded-lg flex-row justify-between items-center mt-2`}
                >
                  <Text style={tw`text-gray-200`}>{purchase.purchase}</Text>
                  <Text style={tw`text-gray-300 font-medium`}>
                    ${purchase.price}
                  </Text>
                </View>
              ))}
                
                </View> : <View style={tw`flex-row items-center justify-center`}
                key={null}
                >
                   <Text style={tw`text-white`}>No purchases made this day</Text>
                </View>
              }
            </View>
            </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  //add feature where if they hold on the bar, then a modal pops up showing their tasks and purchases for the day

  return (
    <View>
      <TouchableOpacity
        onLongPress={() => setShowModal(true)}
        style={tw`flex-row items-center justify-between bg-gray-800 p-4 rounded-xl w-85 shadow-2xl border border-gray-700 mt-2`}
      >
        <Text style={tw`text-white text-xl font-medium`}>{date}</Text>
      </TouchableOpacity>

      <Modal visible={showmodal} animationType="slide" transparent={true}>
        {modalContent}
      </Modal>
    </View>
  );
};

export default Day;
