import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Items = ({ photoUri, selectedFrame, setSelectedFrame, images, setShowBigFrame }: any) => {
    const _handlePress = (num: any) => {
        setSelectedFrame(num)
        // setShowBigFrame(true)
    }
    return (
        <View style={styles.container}>
            {images?.map((item: any, index: any) => <TouchableOpacity
                onPress={() => {
                    _handlePress(index)
                }}
                style={{
                    borderWidth: 1,
                    borderColor: "#FFFF",
                    marginLeft: 10

                }}
            >
                <ImageBackground
                    source={item}
                    style={styles.img}
                    resizeMode='stretch'
                >
                    {selectedFrame == (index) && <Image
                        source={{ uri: photoUri?.uri }}
                        style={styles.img2}
                    />}
                </ImageBackground>
            </TouchableOpacity>)}

        </View>
    )
}

export default Items

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "18%",
        position: "absolute",
        zIndex: 10000,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        top:"40%",
        // paddingHorizontal: "2%"
    },
    img: {
        width: 220,
        height: 310,
        alignItems: "center",
        justifyContent: "center",
        // borderWidth: 1,
        borderRadius: 5,
        // borderColor: "#FFF",
    },
    img2: {
        width: "80%",
        height: "80%"
    }
})