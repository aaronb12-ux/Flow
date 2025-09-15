import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import { supabase } from "../supabaseclient";
import tw from "twrnc";

interface Props {
  id: string;
  name: string;
  price: number;
  onUpdate: React.Dispatch<React.SetStateAction<number>>;
}

const Purchase = ({ name, id, price, onUpdate }: Props) => {
  const [purchased, setPurchased] = useState(false);
  const [holdpress, setholdpress] = useState(false);
  const [currentname, setCurrentName] = useState(name);
  const [currentprice, setCurrentPrice] = useState(price.toString());
  const [errorMessage, setErrorMessage] = useState("");

  const holdpressrun = () => {
    setholdpress(true);
    setCurrentPrice(price.toString());
    setCurrentName(name);
  };

  const updatePurchase = async () => {
    try {
      if (currentname.length === 0 || currentprice.length === 0) {
        setErrorMessage("fields cannot be empty");
      } else {
        const { data, error } = await supabase
          .from("purchases")
          .update({
            purchase: currentname,
            price: currentprice,
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
      setErrorMessage("error updating purchase. please try again");
    }
  };

  const deletePurchase = async () => {
    try {
      const { data, error } = await supabase
        .from("purchases")
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
      setErrorMessage("error deleting purchase. please try again");
    }
  };

  const modalContent = (
    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
      <View
        style={tw`bg-gray-800 p-6 rounded-xl w-80 shadow-2xl border border-gray-700`}
      >
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <Text style={tw`text-xl font-bold text-gray-100`}>
            Edit or Delete Purchase
          </Text>
          <TouchableOpacity
            onPress={() => {
              setholdpress(false), setErrorMessage("");
            }}
          >
            <Icon name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-300 font-medium mb-2`}>Title</Text>
          <TextInput
            style={tw`bg-gray-700 text-gray-100 p-3 rounded-lg border border-gray-600`}
            placeholder="Enter title..."
            placeholderTextColor="#6b7280"
            value={currentname}
            onChangeText={setCurrentName}
          />
        </View>

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-300 font-medium mb-2`}>Amount</Text>
          <TextInput
            style={tw`bg-gray-700 text-gray-100 p-3 rounded-lg border border-gray-600`}
            placeholder="$0.00"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={currentprice.toString()}
            onChangeText={setCurrentPrice}
          />
        </View>

        <View style={tw`h-8 items-center justify-center`}>
          {errorMessage && (
            <Text style={tw`text-red-600 text-center`}>{errorMessage}</Text>
          )}
        </View>

        <View style={tw`flex-row gap-3 mt-2`}>
          <TouchableOpacity
            onPress={deletePurchase}
            style={tw`flex-1 bg-red-600 py-3 rounded-lg`}
          >
            <Text style={tw`text-gray-200 text-center font-semibold`}>
              delete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-1 bg-blue-400 py-3 rounded-lg`}
            onPress={updatePurchase}
          >
            <Text style={tw`text-white text-center font-semibold`}>update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      <TouchableOpacity onLongPress={holdpressrun}>
        <View
          style={tw`flex-row items-center justify-between bg-gray-800 p-4 rounded-xl w-85 shadow-2xl border border-gray-700 mt-2`}
        >
          <View style={tw`flex-1 mr-4`}>
            <Text
              style={tw`text-white text-base font-medium ${
                purchased ? "line-through text-gray-400" : ""
              }`}
            >
              {name}
            </Text>
          </View>
          <View>
            <Text style={tw`text-gray-400 text-sm mt-1`}>${price}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal visible={holdpress} animationType="slide" transparent={true}>
        {modalContent}
      </Modal>
    </View>
  );
};

export default Purchase;
