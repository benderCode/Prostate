// 提交信息 后的提示框 带 按钮
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { global } from "../utils/Global";
export default class SubmitPrompt extends Component {
    static defaultProps = {
        title: '',
        text: '',
        imgUrl: require('../images/error.png'),
        yesClick: () => { },
        noClick: () => { },
        maskClick: () => { }
    };
    render() {
        return (
            <TouchableOpacity
                style={styles.confirmMaskBtn}
                onPress={this.props.maskClick}
                activeOpacity={1}
            >
                <View style={styles.confirmContent}>
                    <View style={styles.confirmBox}>
                        <Image style={styles.confirmImg} source={this.props.imgUrl} />
                        <Text style={styles.confirmTitle}>{this.props.title}</Text>
                        <Text style={styles.confirmText}>{this.props.text}</Text>
                    </View>
                    <View style={styles.confirmBtnBox}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={this.props.yesClick}
                            style={styles.confirmBtn}
                        >
                            <Text style={styles.yesText}>完成</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    // 信息提示框-start
    confirmMaskBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10001,
        width: global.SCREEN_WIDTH,
        height: global.SCREEN_HEIGHT,
        backgroundColor: 'rgba(0,0,0,0)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmContent: {
        width: global.px2dp(285),
        height: global.px2dp(200),
        backgroundColor: global.Colors.textfff,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: global.px2dp(4),
    },
    confirmBox: {
        alignItems: 'center',
    },
    confirmImg: {
        marginTop: global.px2dp(19),
        marginBottom: global.px2dp(10),
    },
    confirmTitle: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        lineHeight: global.px2dp(25),
        fontWeight: '500',
    },
    confirmText: {
        fontSize: global.px2dp(15),
        color: global.Colors.text666,
        lineHeight: global.px2dp(20),
    },
    confirmBtnBox: {
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.text999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBtn: {
        flex: 1,
        height: global.px2dp(43),
        alignItems: 'center',
        justifyContent: 'center',
    },
    yesText: {
        fontSize: global.px2dp(17),
        color: global.Colors.yesColor,
    }
});
