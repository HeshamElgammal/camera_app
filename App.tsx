import { Dimensions, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { Camera, useCameraDevices } from 'react-native-vision-camera'
import Loader from './src/components/Loader'
import Items from './src/components/Items'
import { RNCamera } from 'react-native-camera';
import Img1 from './src/assets/1.png'
import Img2 from './src/assets/2.png'
import Img3 from './src/assets/3.png'
import Img4 from './src/assets/4.png'
import ImageResizer from 'react-native-image-resizer';

// ...


const App = () => {
  const [camera, setCamera] = useState<any>(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [listImgs, setListImgs] = useState([
    Img1,
    Img2,
    Img3,
    Img4,
  ])
  const [photoUri, setPhotoUri] = useState(null);
  const [showTimer, setShowTimer] = useState(false);

  const [showBigFrame, setShowBigFrame] = useState(false);
  const onScanResult = (e: any) => { }
  const [count, setCount] = useState<any>(null);

  useEffect(() => {
    let countdownInterval: any;

    if (count !== null && count > 0) {
      countdownInterval = setInterval(() => {
        setCount(count - 1);
      }, 1000); // 1000 milliseconds = 1 second
    } else if (count === 0) {
      // Perform your action here after reaching 0
      clearInterval(countdownInterval);
      // Example action: show an alert
      takePicture()
      setCount(null)

    }

    // Clean up the interval when the component unmounts or when count changes
    return () => clearInterval(countdownInterval);
  }, [count]);

  const startCountdown = () => {
    setShowTimer(true)
    setCount(3); // Start the countdown from 3 when the button is pressed
  };
  const takePicture = () => {
    const options = {
      quality: 1, // Adjust the quality as needed
      width: 2000, // Set the desired width
      height: 2000, // Set the desired height
    };
    camera.takePictureAsync(options)
      .then((result: any) => {
        // setPhotoUri(result);
        setShowTimer(false)
        resizeImage(result?.uri)
        console.log(result);
      })
      .catch((error: any) => {
        console.error('Error taking picture:', error);
      });

  }

  const resizeImage = async (uri: any) => {
    const resizedImage: any = await ImageResizer.createResizedImage(uri, 2350, 3000, 'JPEG', 100);
    setPhotoUri(resizedImage)
    setShowBigFrame(true)


    return resizedImage.uri;
  };
  return (
    showBigFrame ?
      <Loader
        photoUri={photoUri}
        images={listImgs}
        selectedFrame={selectedFrame}
        setShowBigFrame={setShowBigFrame}
        setPhotoUri={setPhotoUri}
      /> :
      <SafeAreaView
        style={styles.container}
      >

        <View style={styles.container2}>
          <RNCamera
            ref={setCamera}
            pictureSize='2000'
            captureAudio={false}
            onBarCodeRead={e => onScanResult(e)}
            type={RNCamera.Constants.Type.front}
            flashMode={
              RNCamera.Constants.FlashMode.off
            }
            // onPictureTaken={}
            ratio='2000'
            shouldRasterizeIOS
            style={{ flex: 1 }}>
            <View style={{
              position: "absolute",
              zIndex: 100,
              width: "100%",
              alignItems: "center",
              bottom: 40,
              justifyContent: 'center',
            }}>
              <TouchableOpacity onPress={startCountdown} style={styles.capture}>
                <Text style={styles.text}> Snap </Text>
              </TouchableOpacity>
            </View>

          </RNCamera>
          {/*绘制扫描遮罩*/}
        </View>
        <Items
          photoUri={photoUri}
          images={listImgs}
          selectedFrame={selectedFrame}
          setSelectedFrame={setSelectedFrame}
          setShowBigFrame={setShowBigFrame}
        />
        <>
          {showTimer ? <View style={styles.counter}>
            <Text style={[styles.text, { fontSize: 60 }]}>
              {count}
            </Text>
          </View> : null}
        </>
      </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000"
  },
  container2: {
    width: '100%',
    height: Dimensions.get('window').height / 1,
    // backgroundColor: "#a00",
    // marginTop: "18%"
  },
  capture: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#e25201",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 28,
    color: "#FEFEFE",
    fontWeight: '700'
  },
  counter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#7777",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 11000
  }
})