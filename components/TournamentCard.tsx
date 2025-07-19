import { Text, View } from "react-native"

export default function TournamentCard ({name}: {name: string}) {
    return (
        <View className="flex-row gap-2">
            <View className="bg-amber-300 p-4 w-[200px] h-[100px] rounded-md">
                <Text className="text-center">
                    Torneo {name}
                </Text>
            </View>
        </View>
    )
}