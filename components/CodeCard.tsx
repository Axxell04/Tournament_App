import { Code } from "@/interfaces/code";
import { Check, ClipboardCopy } from "@tamagui/lucide-icons";
import * as Clipboard from 'expo-clipboard';
import { File, Paths } from 'expo-file-system/next';
import * as MediaLibrary from 'expo-media-library';
import { useState } from "react";
import { ToastAndroid } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Button, Paragraph, Stack, XStack, YStack } from "tamagui";

export default function CodeCard ({ code }: { code: Code }) {
    const [ codeSVG, setCodeSVG ] = useState<any>();
    const [ viewQR, setViewQR ] = useState(false);

    function toggleViewQR () {
        setViewQR(!viewQR);
    }

    async function copyCode () {
        await Clipboard.setStringAsync(code.text);
        ToastAndroid.show("Código copiado!", ToastAndroid.SHORT);
    }

    // Download QR Process
    async function getPermission () {
        const { granted } = await MediaLibrary.requestPermissionsAsync();
        return granted;
    }

    async function downloadQR () {
        if (codeSVG) {
            await getPermission();
            codeSVG?.toDataURL(async (data: string) => {
                await createFile(data);
                ToastAndroid.show("QR guardado en galería", ToastAndroid.SHORT);
            });
        }
    }

    async function createFile (qrBase64: string) {
        const qrFile = new File(Paths.document, "QR.jpg");
        qrFile.write(base64ToUintArray(qrBase64));
        await moveToGallery(qrFile.uri);
    }

    async function moveToGallery (uri: string) {
        const permission = await getPermission();
        if (!permission) {
            console.log("Sin los permisos necesarios");
            ToastAndroid.show("Sin los permisos necesarios", ToastAndroid.SHORT);
            return;
        }

        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync("Tournament_Codes");

        if (!album) {
            await MediaLibrary.createAlbumAsync("Tournament_Codes", asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
    }

    function base64ToUintArray (base64: string) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return bytes;
    }

    return (
        <YStack gap={5} bg={"$backgroundHover"} p={10} rounded={15}>
            <XStack gap={5} items={"center"}
                justify={"space-between"} rounded={15}
                onPress={toggleViewQR}
            >
                <Paragraph color={"$color08"}>
                    {code.text}
                </Paragraph>
                {code.claimed 
                ?
                <Stack p={5} bg={"$color"} rounded={10000} borderWidth={1} borderColor={"$color"}>
                    <Check size={20} color={"$background"} />
                </Stack>
                :
                <Stack p={5} bg={"$colorTransparent"} rounded={10000} borderWidth={1} borderColor={"$color"}>
                    <Check size={20} color={"$color"} />
                </Stack>
                }
            </XStack>
            {viewQR &&
            <YStack items={"center"} gap={5}>
                <Paragraph color={"$color08"}>
                    $ {code.value}
                </Paragraph>
                <Button chromeless color={"$color06"}
                    icon={<ClipboardCopy size={20} color={"$color06"} />}
                    onPress={copyCode}
                >
                    Copiar
                </Button>
                <YStack bg={"white"} p={10} rounded={15}>
                    <QRCode 
                        value={code.text}
                        size={200}      
                        getRef={(c) => setCodeSVG(c)}
                    />
                </YStack>
                <Button chromeless color={"$colorFocus"} 
                    onPress={downloadQR}
                >
                    Descargar
                </Button>
            </YStack>
            }
        </YStack>
    )
}