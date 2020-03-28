// 导航组件
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, ScrollView, } from 'react-native';
import { global } from '../utils/Global';// 常量
import LinearGradient from 'react-native-linear-gradient';
export default class signIn extends Component {
    static defaultProps = {
        leftClick: function () { },
        rightClick: function () { },
        title: '',
        isLoading: false,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        // 2仅调用一次在 render 前
    }
    componentDidMount() {
        // 4获取数据 在 render 后
    }
    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                // locations={[0, 1]}
                colors={global.LinearGradient}
                style={styles.linearGradient}>
                <StatusBar
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.props.isLoading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//状态栏样式 default	默认（IOS为白底黑字、Android为黑底白字）
                    barStyle={"default"}// 状态栏文本的颜色。
                />
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.leftBtn}
                        activeOpacity={.8}
                        onPress={this.props.leftClick}>
                        <Image source={require('../images/arrow_left_white.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <TouchableOpacity
                        style={styles.rightBtn}
                        activeOpacity={.8}
                        onPress={this.props.rightClick}>
                        {this.props.dom}
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: global.NavHeight,
        paddingTop: global.StatusBarHeight,
    },
    leftBtn: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingLeft: global.px2dp(15),
        paddingTop: global.px2dp(13),
        paddingRight: global.px2dp(15),
        paddingBottom: global.px2dp(13),
    },
    title: {
        fontSize: global.px2dp(19),
        color: global.Colors.textfff,
    },
    rightBtn: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        minWidth: global.px2dp(40),
        paddingLeft: global.px2dp(15),
        paddingTop: global.px2dp(13),
        paddingRight: global.px2dp(15),
        paddingBottom: global.px2dp(13),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

