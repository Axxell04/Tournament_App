import ReturnBar from "@/components/ReturnBar";
import { CodeContext } from "@/context-providers/code/CodeProvider";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext } from "react";
import { Paragraph, YStack } from "tamagui";

export default function CameraScan () {
    const [ cameraPermission, requestCameraPermission ] = useCameraPermissions();
    const { codeScanned, setCodeScanned } = useContext(CodeContext);

    const router = useRouter();

    async function handleQRScanned (scanRes: BarcodeScanningResult) {
        // console.log(scanRes.data);
        setCodeScanned(scanRes.data);
        router.back();
    }

    useFocusEffect(
        useCallback(() => {
            const getCameraPermission = async () => {
                await requestCameraPermission();
            }
            getCameraPermission();

        }, [requestCameraPermission])
    )

    return (
        <YStack flex={1} bg={"$background"}>
            <ReturnBar />
            <YStack flex={1} items={"center"} gap={30}>
                {cameraPermission?.granted &&
                <YStack flex={1} px={20} pb={20} width={"100%"} gap={10}>
                    <CameraView style={{flex: .5, width: "100%", borderRadius: 15}}
                        barcodeScannerSettings={{barcodeTypes: ["qr"]}}
                        onBarcodeScanned={(res) => handleQRScanned(res)}
                    >
                    </CameraView>
                    <Paragraph color={"$color06"} text={"center"}>
                        Enfoque su QR
                    </Paragraph>
                </YStack>
                }
            </YStack>
        </YStack>
    )
}