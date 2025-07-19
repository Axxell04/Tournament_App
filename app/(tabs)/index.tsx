import { Text, View } from "react-native";
import { Button } from "tamagui";
import "../../global.css";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-stone-900" >
      <Text className="text-3xl text-amber-400">Inicio</Text>
      <Button size="$2">
        Press here
      </Button>
    </View>
  );
}
