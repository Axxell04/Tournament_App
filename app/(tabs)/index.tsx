import { H4, Image, Paragraph, YStack } from "tamagui";
import "../../global.css";

export default function Index() {
  return (
      <YStack bg="$background" flex={1}>
        <Image source={{
          uri: require("@/assets/images/bg.jpg"),
        }} height={"100%"} width={"100%"}
          position="absolute" t={0} l={0}
        />
        <YStack flex={1}>
          {/* <H4 p={10}>
            Tournament
          </H4> */}
          <YStack bg={"$background04"} mt={"auto"} p={20} gap={20} pb={50}>
            <H4 fontWeight={700}>
              Tournament
            </H4>
            <Paragraph fontSize={20} >
              La casa de los torneos
            </Paragraph>
            <Paragraph fontSize={17}>
              Organiza, compite y gana en los torneos más emocionantes
            </Paragraph>
            <YStack>
              <Paragraph>
                ✅ Torneos 100% competitivos
              </Paragraph>
              <Paragraph>
                ✅ Apuestas con recompensas reales
              </Paragraph>
              <Paragraph>                
                ✅ Estadísticas en vivo
              </Paragraph>
              <Paragraph>                
                ✅ Peleá por el primer lugar
              </Paragraph>
            </YStack>
          </YStack>
        </YStack>
      </YStack>
  );
}
