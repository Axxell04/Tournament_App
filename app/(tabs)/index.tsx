import { Link } from "expo-router";
import { H2, Paragraph, YStack } from "tamagui";
import "../../global.css";

export default function Index() {
  return (
      <YStack bg="$background" flex={1}>
        <H2 color={"$yellow11"} text={"center"}>Inicio</H2>
        <Paragraph>
          Este es el inicio
        </Paragraph>
        <Link href={"/login"}>
          <Paragraph>
            Ir al login
          </Paragraph>
        </Link>
      </YStack>
  );
}
