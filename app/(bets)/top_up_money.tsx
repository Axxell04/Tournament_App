import ReturnBar from "@/components/ReturnBar";
import { FirebaseContext } from "@/context-providers/auth/FirebaseProvider";
import { CodeContext } from "@/context-providers/code/CodeProvider";
import { User } from "@/interfaces/user";
import { FirestoreService } from "@/services/firestore-service";
import { Camera, CircleUserRound, ClipboardPaste, DollarSign, QrCode } from "@tamagui/lucide-icons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ToastAndroid } from "react-native";

import { WebView } from 'react-native-webview';
import { Button, Input, Paragraph, Spinner, XStack, YStack } from "tamagui";

export default function TopUpMoney () {
    const { auth, money, setMoney, firestore } = useContext(FirebaseContext);
    const { codeScanned, setCodeScanned } = useContext(CodeContext);
    const router = useRouter();

    const [ code, setCode ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ scannerOptIsVisible, setScannerOptIsVisible ] = useState(false);
    const [ base64Image, setBase64Image ] = useState<string | undefined>();
    // const [ result, setResult ] = useState("");
    const webViewRef = useRef<WebView>(null);

    function handleInputCode (text: string) {
        setCode(text);
    }

    async function pasteCode () {
        setCode(await Clipboard.getStringAsync());
    }

    async function processCode () {
        if (!code) {
            ToastAndroid.show("Ingrese un código", ToastAndroid.SHORT);
            return;
        }
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        const resProcess = await fsService.claimCode(auth.currentUser?.uid as string, code.trim());
        if (resProcess) {
            ToastAndroid.show("Código procesado con éxito", ToastAndroid.SHORT);
            setCode("");
        } else if (resProcess === false) {
            ToastAndroid.show("Este código ya ha sido procesado", ToastAndroid.SHORT);
        } else {
            ToastAndroid.show("Error al procesar el código", ToastAndroid.SHORT);
        }
        setLoading(false);

    }
    
    const processCodeOfQR = useCallback(async () => {
        setLoading(true);
        const fsService = new FirestoreService(firestore);
        const resProcess = await fsService.claimCode(auth.currentUser?.uid as string, codeScanned.trim());
        if (resProcess) {
            ToastAndroid.show("Código procesado con éxito", ToastAndroid.SHORT);
            setCodeScanned("");
        } else if (resProcess === false) {
            ToastAndroid.show("Este código ya ha sido procesado", ToastAndroid.SHORT);
        } else {
            ToastAndroid.show("Error al procesar el código", ToastAndroid.SHORT);
        }
        setLoading(false);
    }, [auth.currentUser?.uid, firestore, codeScanned, setCodeScanned]);

    async function pickImage () {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            base64: true
        })

        if (!result.canceled) {
            const base64 = result.assets[0].base64;
            setBase64Image(base64 || undefined);
        }
    }

    async function toggleScannerOptIsVisible () {
        setScannerOptIsVisible(!scannerOptIsVisible);
        if (webViewRef) {
            webViewRef.current?.reload();
        }
    }

    useEffect(() => {
        console.log("CodeScanned: "+codeScanned);
        if (codeScanned) {
            processCodeOfQR()
        }
    }, [processCodeOfQR, codeScanned])

    useFocusEffect(
        useCallback(() => {
            const unsub = onSnapshot(doc(firestore, "users", auth.currentUser?.uid as string), (docSnap) => {
                if (docSnap.exists()) {
                    const user = docSnap.data() as User;
                    setMoney(user.money);
                }
            });
            return () => unsub();
        }, [auth.currentUser, firestore, setMoney])
    )

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://unpkg.com/jsqr/dist/jsQR.js"></script>
    </head>
    <body>
        <h1>Axel</h1>
      <canvas id="canvas" ></canvas>
      <img id="qrImage" />
      <script>
        const image = document.getElementById('qrImage');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        window.onload = () => {
          const base64 = '${base64Image}';
          image.src = "data:image/png;base64," + base64;

          image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            const code = jsQR(imageData.data, image.width, image.height);

            if (code) {
              window.ReactNativeWebView.postMessage(code.data);
            } else {
              window.ReactNativeWebView.postMessage("");
            }
          };
        };
      </script>
    </body>
    </html>
  `;

    return (
        <YStack flex={1} bg={"$background"}>
            <ReturnBar />
            <YStack flex={1} items={"center"} gap={30}>
                <YStack items={"center"} justify={"center"} gap={10}>
                    <XStack gap={10} opacity={0.6}>
                        <CircleUserRound size={25} />
                        <Paragraph fontSize={20}>
                            {auth.currentUser?.displayName}
                        </Paragraph>
                    </XStack>
                    <XStack gap={5}>
                        <DollarSign size={25} color={"$colorFocus"} />
                        <Paragraph fontSize={20}  color={"$colorHover"}>
                            {money}
                        </Paragraph>
                    </XStack>
                </YStack>
                <YStack items={"center"} gap={10}>
                    <Paragraph>
                        Código de recarga
                    </Paragraph>
                    <XStack gap={5}>
                        <Button p={10} chromeless
                            icon={<ClipboardPaste size={25} color={"$color08"} />}
                            onPress={pasteCode}
                            disabled={loading}
                        >
                        </Button>
                        <Input placeholder="96b4e7-141d-46c7-878f" minW={200} maxW={250}
                            value={code}
                            text={"center"} 
                            placeholderTextColor={"unset"} 
                            color={"$colorFocus"} 
                            onChangeText={handleInputCode}
                        
                        />
                        <Button p={10}
                            icon={<ClipboardPaste size={25} />}
                            disabled
                            color={"transparent"}
                            bg={"transparent"}
                        >
                        </Button>
                    </XStack>
                </YStack>
                <YStack gap={20} items={"center"}>
                    <Button bg={"$colorFocus"} color={"$background"} pressStyle={{bg: "$color9", borderColor: "$color"}}
                        disabled={loading}
                        onPress={processCode}
                    >
                        Procesar código
                    </Button>
                    <Button chromeless color={"$colorFocus"}
                        disabled={loading}
                        onPress={toggleScannerOptIsVisible}
                    >
                        Escanear código
                    </Button>
                    {scannerOptIsVisible &&
                    <YStack bg={"$backgroundHover"} p={10} rounded={10} gap={10}>
                        <Button
                            icon={<Camera size={20} color={"$color"} />}
                            onPress={() => router.push("/(bets)/camera_scan")}
                        >
                            Desde la cámara
                        </Button>
                        <Button
                            icon={<QrCode size={20} color={"$color"} />}
                            onPress={pickImage}
                        >
                            Desde una imagen
                        </Button>
                    </YStack>
                    }
                </YStack>
                {loading &&
                <Spinner size="large" color={"$colorFocus"} />
                }
                {(base64Image || true) && (
                <WebView
                    ref={webViewRef}
                    originWhitelist={['*']}
                    source={{ html: htmlContent }}
                    onMessage={(event) => {
                    setCodeScanned(event.nativeEvent.data);
                    setBase64Image(undefined); // Limpiar después de escanear
                    }}
                    style={{ height: 0, width: 0 }}
                    // style={{backgroundColor: "white", width: 100, height: 100}}
                    
                />
                )}                
            </YStack>
        </YStack>
    )
}