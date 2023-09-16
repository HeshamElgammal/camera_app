import { Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { SvgXml } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

const Loader = ({ photoUri, setShowBigFrame, images, selectedFrame, setPhotoUri }: any) => {
    // const frameImagePath = 'path_to_your_frame_image.png';
    const [load, setLoad] = useState(false)
    const [shot, setShot] = useState(null)
    const viewShotRef: any = useRef(null);
    const [svgData, setSvgData] = useState(null)
    useEffect(() => {
        setTimeout(() => {
            // handleAddFrame()
            captureAndSave()
        }, 1000);
    }, [])


    const captureAndSave = async () => {
        if (viewShotRef.current) {
            const result = await viewShotRef.current.capture();
            // `result` now contains the combined image as a base64-encoded string or URI.
            // You can save or display it as needed.
            console.log('cap ', result);
            setShot(result)
            handleAddFrame(result)
        }
    };


    // const originalImage = 'path_to_your_original_image.png';

    const handleAddFrame = async (result: any) => {
        // const image = await addFrameToImage();
        let formData = new FormData()
        //   alert(image)
        console.log('resized', photoUri);

        let img = {
            uri: result,
            type: 'image/jpg',
            name: `${new Date(new Date() - Math.random() * (1e+12))}`,
        }
        formData.append('file', img)
        // formData.append('number', (selectedFrame + 1))
        _handleUploadPic(formData)
    };

    const _handleUploadPic = async (form: any) => {
        setLoad(true)
        await axios({
            method: "post",
            url: "https://prima.o-projects.org/api/submit",
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                console.log(response.data);
                setLoad(false)
                setSvgData(response?.data)
            })
            .catch(function (response) {
                //handle error
                console.log(response);
                setLoad(false)

            });

    }
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={[styles.container, { paddingTop: 30 }]}
                onPress={() => {
                    setShowBigFrame(false)
                    setPhotoUri(null)
                    setShot(null)
                    setSvgData(null)
                }}

            >
                {shot ?
                    <ImageBackground
                        //    source={images[selectedFrame]}
                        source={{ uri: photoUri?.uri }}
                        style={[styles.img]}
                        resizeMode='contain'

                    >
                        <Image

                            source={images[selectedFrame]}
                            style={styles.img2}
                            resizeMode='contain'
                        />

                        {!svgData ? null :
                            <SvgXml
                                xml={`
${svgData}
`}
                                style={{ position: "absolute" }}
                            />}
                    </ImageBackground>
                    :
                    <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
                        <ImageBackground
                            // source={images[selectedFrame]}
                            source={{ uri: shot ?? photoUri?.uri }}
                            style={styles.img}
                            resizeMode='contain'
                        >
                            <Image

                                source={images[selectedFrame]}
                                style={styles.img2}
                                resizeMode='contain'
                            />

                            {!svgData ? null :
                                <SvgXml
                                    xml={`
                ${svgData}
                `}
                                    style={{ position: "absolute" }}
                                />
                            }
                        </ImageBackground>
                    </ViewShot>
                }
                <TouchableOpacity style={styles.capture}
                    onPress={() => {
                        setShowBigFrame(false)
                        setPhotoUri(null)
                        setShot(null)
                        setSvgData(null)
                    }}

                >

                    <Text style={styles.text}

                    >Start over</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Loader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#000D19",

    },
    // text: {
    //     fontSize: 24,
    //     color: "#FEFEFE",
    //     textAlign: "center",
    //     marginTop: 30,
    //     position: "absolute",
    //     bottom: 20
    // },
    img: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height / 1.4,
        alignItems: "center",
        justifyContent: "center",
        // borderWidth: 1,
        borderRadius: 5,
        borderColor: "#6A7C7E",
        marginTop: 50

    },
    img2: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height / 1.4,
    },
    capture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#e25201",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 30
    },
    text: {
        fontSize: 28,
        color: "#FEFEFE",
        fontWeight: '700'
    }
})