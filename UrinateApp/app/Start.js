import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { regExp } from './netWork/RegExp';// 正则
import { requestUrl } from './netWork/Url';// IP地址
import { global } from './utils/Global';// 常量
import { Storage } from "./utils/AsyncStorage";
import { CachedImage, ImageCache } from "react-native-img-cache";
import { StackActions, NavigationActions } from 'react-navigation';
export default class Start extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            initializeFlag: false,// 是否是第一次
        }
    }
    componentDidMount() {
        // 判断是否启动过
        Storage.getItem('startFlag', (data) => {
            if (data) {
                // 非第一次启动
                // 判断登录状态
                Storage.removeItem("userInfo", () => { })
                Storage.getItem('token', (data) => {
                    if (data) {
                        global.Token = data;
                        // 通过获取认证状态 判断登录状态
                        fetch(requestUrl.getSignStatus, {
                            method: 'GET',
                            headers: {
                                "token": global.Token,
                            },
                        }).then((response) => response.json())
                            .then((responseData) => {
                                console.log('responseData', responseData);
                                if (responseData.code == 40001) {
                                    // 未登录
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({ routeName: 'SignIn' })],
                                    });
                                    setTimeout(() => {
                                        this.props.navigation.dispatch(resetAction);
                                    }, 1000)
                                } else {
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                                    });
                                    setTimeout(() => {
                                        this.props.navigation.dispatch(resetAction);
                                    }, 1000)
                                }
                            })
                            .catch(
                                (error) => {
                                    console.log('error', error);
                                });
                    } else {
                        // 未登录
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'SignIn' })],
                        });
                        setTimeout(() => {
                            this.props.navigation.dispatch(resetAction);
                        }, 1000)
                    }
                })
            } else {
                // 第一次启动App 设置启动表示 切换为引导页
                Storage.setItem("startFlag", "1");
                this.setState({
                    initializeFlag: true,
                })
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'SignIn' })],
                });
                this.props.navigation.dispatch(resetAction);
            }
        })
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar
                    animated={true}//是否动画
                    hidden={true}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.state.isLoading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                <View style={styles.startImgBox}>
                    <Image
                        resizeMode={"cover"}// cover填满并裁去多余 contain等比例缩放留白 stretch拉伸填充
                        style={styles.startImg}
                        source={{ uri: "https://checking-records-1256660245.cos.ap-beijing.myqcloud.com/startImg.jpg" }}
                    />
                </View>
                {/* {this.state.initializeFlag ?
                    <ScrollView
                        horizontal={true}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        bounces={false}// ios弹性
                    >
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'SignIn' })],
                                });
                                this.props.navigation.dispatch(resetAction);
                            }}
                        >
                        </TouchableOpacity>
                    </ScrollView>
                    :
                    
                } */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    startImgBox: {
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'center',
    },
    startImg: {
        width: global.SCREEN_WIDTH,
        height: global.SCREEN_HEIGHT,
    }
});

