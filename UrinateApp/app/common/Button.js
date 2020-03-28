// 按钮 组件
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { global } from "../utils/Global";
export default class Button extends Component {
    static defaultProps = {
        click: function () { },
        text: '',
    };
    render() {
        return (
            <View style={styles.btnContent}>
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={this.props.click}
                >
                    <View
                        style={[styles.btnBox, this.props.style]}
                    >
                        <Text style={styles.btnText}>
                            {this.props.text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    // 按钮
    btnContent: {
        flex: 1,
    },
    btnBox: {
        height: global.px2dp(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: global.px2dp(45),
        backgroundColor: global.Colors.color,
    },
    btnText: {
        textAlign: 'center',
        fontSize: global.px2dp(18),
        color: global.Colors.textfff,
        fontWeight: "bold",
    },
});
