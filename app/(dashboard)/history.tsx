import { View, Text, ScrollView } from "react-native";
import { useUser } from "../usercontext";
import { supabase } from "../supabaseclient";
import tw from "twrnc";
import { useEffect, useState } from "react";
import Day from "../components/day";

interface Task {
  id: string;
  userid: string;
  task: string;
  created_at: string;
  is_completed: boolean;
}

interface Purchase {
  id: string;
  userid: string;
  purchase: string;
  created_at: string;
  price: number;
}

interface TaggedTask extends Task {
  type: "task";
}

interface TaggedPurchase extends Purchase {
  type: "purchase";
}

interface Day {
  date: string;
  tasks: TaggedTask[];
  purchases: TaggedPurchase[];
}

type CombinedItem = TaggedTask | TaggedPurchase;

const History = () => {
  const [last30daystasks, setLast30Daystasks] = useState<Task[]>([]); //array of 'Task' objects
  const [last30dayspurchases, setLast30Dayspurchases] = useState<Purchase[]>([]); //array of 'Purchase' objects
  const [loading, setLoading] = useState(false);
  const [errormessage, setErrorMessage] = useState("")

  const { userId } = useUser();

  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const getData = async () => {

      try {
        setLoading(true)
        const [last30tasks, last30purchases] = await Promise.all([
         supabase
          .from("tasks")
          .select("*")
          .eq("userid", userId)
          .gte("created_at", thirtyDaysAgo.toISOString())
          .lte("created_at", yesterday.toISOString()), 

          supabase
          .from("purchases")
          .select("*")
          .eq("userid", userId)
          .gte("created_at", thirtyDaysAgo.toISOString())
          .lte("created_at", yesterday.toISOString())
        ])
      

        if (last30tasks.error) throw last30tasks.error.message;
        if (last30purchases.error) throw last30purchases.error.message;

         if (last30tasks.data) {

          setLast30Daystasks(last30tasks.data)
          setErrorMessage("");
        }
        if (last30purchases.data) {
          setLast30Dayspurchases(last30purchases.data)
          setErrorMessage("");
        }
      } catch (error) {
           setErrorMessage("error loading data. please try again.")
      } finally {
        setLoading(false)
      }
    } 
    getData()
  }, []);
  

  const allItems: CombinedItem[] = [
    ...last30daystasks.map((task) => ({ ...task, type: "task" as const })),
    ...last30dayspurchases.map((purchase) => ({
      ...purchase,
      type: "purchase" as const,
    })),
  ];

  let groupedByDate = allItems
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .reduce((day, item) => {
      const dateKey = new Date(item.created_at).toLocaleString().split(",")[0];

      let dateEntry = day.find((entry) => entry.date === dateKey);

      if (!dateEntry) {
        dateEntry = { date: dateKey, tasks: [], purchases: [] };
        day.push(dateEntry);
      }

      if (item.type === "task") {
        dateEntry.tasks.push(item);
      }

      if (item.type === "purchase") {
        dateEntry.purchases.push(item);
      }

      return day;
    }, [] as Day[]);

    console.log(errormessage)


  return (
    <View style={tw`flex-1 bg-gray-900`}>
      <View style={tw`px-5 pt-15 pb-6`}>
          <Text style={tw`text-4xl font-bold text-gray-50`}>History</Text>
          <Text style={tw`text-base text-gray-400`}>
            View your past 30 days
          </Text>
        </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>

{loading ? (
  <View style={tw`items-center justify-center flex-row mt-61`}>
    <Text style={tw`text-white`}>loading history...</Text>
  </View>
) : errormessage ? (
  <View style={tw`items-center justify-center mt-61`}>
    <Text style={tw`text-red-400`}>{errormessage}</Text>
  </View>
) : (
  <View style={tw`items-center`}>
    {allItems.length === 0 ? (
      <View> 
        <Text style={tw`mt-61 text-white`}>no history to show</Text>
      </View>
    ) : (
      <View>
        {groupedByDate.map((day, index) => (
          <Day 
            key={day.date}
            date={day.date} 
            tasks={day.tasks} 
            purchases={day.purchases} 
          />
        ))}
      </View>
    )}
  </View>
)}
      </ScrollView>
    </View>
  );
};

export default History;
