import React, {useEffect, useState} from 'react'
import {View, StyleSheet, Animated, PanResponder} from 'react-native'

export default () => {
    const MAX_SWIPE_DISTANCE = 120;

    const [id, setId] = useState(undefined)

    const [data, setData] = useState([
        {
            id: 1,
            img: 'https://www.pngmart.com/files/3/Husky-PNG-Photos.png',
            desc: 'Husky Siberiano'
        },
        {
            id: 2,
            img: 'https://static.vecteezy.com/system/resources/previews/024/589/174/original/golden-retriever-with-ai-generated-free-png.png',
            desc: 'Golden Retriever'
        },
        {
            id: 3,
            img: 'https://assets.stickpng.com/images/580b57fbd9996e24bc43bbd8.png',
            desc: 'Pastor Alemán'
        },
        {
            id: 4,
            img: 'https://www.pngplay.com/wp-content/uploads/12/Husky-PNG-HD-Photos.png',
            desc: 'Alaskan Husky'
        },
    ])

    useEffect(() => {
        const temporalId = data[0]?.id
        setId(temporalId)
    }, [data])

    const animatedValues = {
        swipeCardAnimation: new Animated.ValueXY(0),
        opacityCardAnimation: new Animated.Value(1),
        backScale: new Animated.Value(0.9),
    }

    const {swipeCardAnimation, opacityCardAnimation, backScale} = animatedValues

    const handleNext = () => {
        Animated.parallel([
            Animated.spring(backScale, {
                toValue: 1,
                friction: 4,
                useNativeDriver: false
            }),
            Animated.timing(opacityCardAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false
            })
        ]).start(() => {
            const nuevos = data.filter(x => x.id !== id)
            setData(nuevos)
        }, () => {
            swipeCardAnimation.setValue({x: 0, y: 0})
            opacityCardAnimation.setValue(1)
            backScale.setValue(0.9)
        })
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => true,
        onPanResponderMove: Animated.event([
            null,
            {
                dx: swipeCardAnimation.x,
                dy: swipeCardAnimation.y
            }
        ],{useNativeDriver: false}),
        onPanResponderRelease: (e, {dx, vx, vy}) => {
            if(Math.abs(dx) > MAX_SWIPE_DISTANCE){
                Animated.decay(swipeCardAnimation, {
                    velocity: {x: vx, y: vy},
                    deceleration: 0.98,
                    useNativeDriver: false
                }).start(handleNext)
            } else {
                Animated.spring(swipeCardAnimation, {
                    toValue: ({x: 0, y: 0}),
                    friction: 4,
                    useNativeDriver: false
                }).start()
            }
        },
    })

    const rotate = swipeCardAnimation.x.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: ['-40deg','0deg','40deg'],
        extrapolate: 'clamp'
    })

    const opacity = swipeCardAnimation.x.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: [0.5, 1, 0.5]
    })

    const animatedCardStyles = {
        opacity: opacityCardAnimation,
        transform: [
            {
                rotate,
            },
            ...swipeCardAnimation.getTranslateTransform()
        ]
    }

    const elementStyle = {
        opacity,
    }

    return(
        <View style={styles.container}>
            {
                data.slice(0,2).reverse().map((x,i,a) => {
                    const isLastItem = i === a.length - 1
                    const isSecondToLast = i === a.length - 2 

                    const cardStyle = isLastItem ? animatedCardStyles : {}
                    const scaleStyle = isSecondToLast ? {transform: [{scale: backScale}]} : {}
                    const contentStyle = isLastItem ? elementStyle : {}

                    return(
                        <Animated.View
                            style={[styles.card, cardStyle, scaleStyle]}
                            key={x.id}
                            {...panResponder.panHandlers}
                        >
                            <Animated.Image 
                                source={{uri: x.img}}
                                style={[{height: 225, width: 180}, contentStyle]}
                                resizeMode='contain'
                            />
                            <View style={styles.footer}>
                                <Animated.Text style={[{fontSize: 18, fontWeight: 'bold', color: '#383838'}, contentStyle]}>{x.desc}</Animated.Text>
                            </View>
                        </Animated.View>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    card: {
        height: 'auto',
        width: '70%',
        borderWidth: 1,
        borderColor: '#f1f1f1',
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'absolute'
    },
    footer: {
        height: 'auto',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    }
})