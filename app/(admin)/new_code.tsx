import ReturnBar from "@/components/ReturnBar";
import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { FirestoreService } from "@/services/firestore-service";
import { CircleUserRound } from "@tamagui/lucide-icons";
import * as Clipboard from 'expo-clipboard';
import * as Crypto from "expo-crypto";
import { File, Paths } from 'expo-file-system/next';
import * as MediaLibrary from 'expo-media-library';
import { useContext, useState } from "react";
import { ToastAndroid } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Button, Input, Paragraph, Spinner, XStack, YStack } from "tamagui";

export default function NewCode () {
    const { auth, firestore } = useContext(FirebaseContext);

    const [ codeValue, setCodeValue ] = useState("");
    const [ codeText, setCodeText ] = useState("");
    const [ codeSVG, setCodeSVG ] = useState<any>();
    const [ loading, setLoading ] = useState(false);
    
    function handleInputCodeValue (text: string) {
        setCodeValue(text);
    }

    async function genNewCode () {
        if (!codeValue) {
            ToastAndroid.show("Ingrese un valor para el código", ToastAndroid.SHORT);
            return;
        }
        setLoading(true);
        const code = Crypto.randomUUID(); 
        setCodeText(code);
        const fsService = new FirestoreService(firestore);
        await fsService.addCode({
            value: parseFloat(codeValue),
            text: code,
            ownerId: auth.currentUser?.uid as string,
            claimed: false,
            createdAt: (new Date()).toISOString()
        })
        setLoading(false);
        setCodeValue("");
        // setCodeText("");
        // setCodeSVG(undefined);
        ToastAndroid.show("Código generado", ToastAndroid.SHORT);
    }

    async function getPermission () {
        const { granted } = await MediaLibrary.requestPermissionsAsync();
        return granted;
    }

    async function copyCode () {
        await Clipboard.setStringAsync(codeText);
        ToastAndroid.show("Código copiado!", ToastAndroid.SHORT);
    }

    async function downloadQR () {
        if (codeSVG) {
            await getPermission();
            codeSVG?.toDataURL(async (data: string) => {
                await createFile(data);
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
        <YStack flex={1} bg={"$background"}>
            <ReturnBar />
            <YStack flex={1} items={"center"} gap={30}>
                <YStack items={"center"} justify={"center"} gap={5}>
                    <Paragraph color={"$color06"}>
                        Administrador
                    </Paragraph>                
                    <XStack gap={10} opacity={0.7}>
                        <CircleUserRound size={25} />
                        <Paragraph fontSize={20}>
                            {auth.currentUser?.displayName}
                        </Paragraph>
                    </XStack>
                </YStack>
                <YStack items={"center"} gap={5}>
                    <Paragraph>
                        Valor
                    </Paragraph>
                    <Input placeholder="$$$" minW={100} value={codeValue}
                        text={"center"} 
                        keyboardType="numeric" 
                        placeholderTextColor={"unset"} 
                        color={"$colorFocus"} 
                        maxLength={4}
                        onChangeText={(t) => handleInputCodeValue(t)}
                    />
                    <Button mt={5} bg={"$colorFocus"} color={"$background"} pressStyle={{bg: "$color9", borderColor: "$color"}}
                        onPress={genNewCode}
                    >
                        Generar código
                    </Button>
                </YStack>
                {loading &&
                <Spinner size="large" color={"$colorFocus"} />
                }
                {(codeText && !loading) &&
                <YStack items={"center"} gap={5}>
                    <Paragraph onPress={copyCode}>
                        {codeText}
                    </Paragraph>
                    <YStack bg={"white"} p={10} rounded={15}>
                        <QRCode 
                            value={codeText}
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
        </YStack>
    )
}