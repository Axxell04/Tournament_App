import TournamentCard from "@/components/TournamentCard";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import "../../global.css";

export default function Tournaments () {
    let cards = ["1", "2", "3", "4", "5", "6", 7, 8, 9, 10, 11, 12, 13, 14, 15];
    return (
        <View className="flex-1 justify-center items-center bg-stone-900">
            <Text className="text-3xl text-amber-400">
                Torneos
            </Text>
            <View className="flex-1 w-full items-center p-4">
                <View className="border border-amber-400 w-full rounded-md p-2">
                    <Text className="text-amber-500 text-center p-1">
                        Torneos Actuales
                    </Text>
                    <FlatList
                        data={cards}
                        renderItem={(item) => <TournamentCard name={item.item.toString()} />}
                        keyExtractor={(_, idx) => idx.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 8, flexDirection: "row", gap: 4 }}
                    />
                </View>
                <View className="mt-auto">
                    <TouchableOpacity className="p-2 rounded-full bg-amber-400">
                        <MaterialIcons size={30} name="add" color={"#1c1917"} />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal 
                transparent={true}
                visible={true}
            >   
                <BlurView experimentalBlurMethod="dimezisBlurView" 
                    tint="dark" 
                    className="flex-1"
                    intensity={60}
                >
                    <View className="flex-1 justify-center items-center ">
                        <View className="flex-col items-center bg-stone-800 p-5 border border-r-stone-700 border-b-stone-700 border-t-amber-400 border-l-amber-400 rounded-md w-[300]">
                            <Text className="text-amber-500">
                                Modal
                            </Text>
                            <View className="gap-3 items-center">
                                <TextInput className="text-amber-300" placeholder="Ingrese el nombre" placeholderTextColor={"#a8a29e"} />
                                <TouchableOpacity className="bg-amber-400 rounded-md py-1 px-5">
                                    <Text className="text-stone-800">
                                        Crear
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="border border-amber-400 rounded-full p-2 mt-3">
                                    <MaterialIcons size={25} name="close" color={"#fbbf24"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </View>
    )
}