// 显示3秒 提示框 组件
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { global } from "../utils/Global";
export default class ErrorPrompt extends Component {
    static defaultProps = {
        text: '手机号格式错误',
        imgUrl: require('../images/error.png'),
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Image
                        style={styles.img}
                        source={this.props.imgUrl ? this.props.imgUrl : require('../images/error.png')}
                    />
                    <Text style={styles.text}>{this.props.text}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: global.SCREEN_WIDTH,
        height: global.SCREEN_HEIGHT,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10001,
        alignItems: 'center',
    },
    content: {
        position: 'absolute',
        top: global.SCREEN_HEIGHT * .3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.56)',
        borderRadius: 6,
        paddingRight: global.px2dp(15),
        paddingLeft: global.px2dp(15),
        paddingBottom: global.px2dp(15),
        minWidth: global.px2dp(120),
    },
    img: {
        width: global.px2dp(34),
        height: global.px2dp(34),
        marginTop: global.px2dp(16),
        marginBottom: global.px2dp(20),
    },
    text: {
        fontSize: global.px2dp(16),
        color: global.Colors.textfff,
    }
});
