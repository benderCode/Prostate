import React, { Component } from 'react';
import {
    Dimensions,
    PixelRatio,
    Platform,
    Alert,
    StatusBar,
    ToastAndroid,
    BackHandler,
    DeviceEventEmitter,
} from 'react-native';
import Colors from './Colors';
import Px2dp from './TextSize';
import { isIphoneX } from 'react-native-iphone-x-helper';
let { height, width } = Dimensions.get('window');
export let global = {
    Token: '',// token
    IOS: Platform.OS === 'ios' ? true : false,// 系统是iOS
    Android: (Platform.OS === 'android'),// 系统是安卓
    SCREEN_WIDTH: width,// 获取屏幕宽度
    SCREEN_HEIGHT: height,// 获取屏幕高度
    PixelRatio: PixelRatio.get(),// 获取屏幕分辨率
    Pixel: 1 / PixelRatio.get(),// 最小线宽
    Colors: Colors,// 常用颜色
    px2dp: Px2dp,// 屏幕适配
    Alert: Alert,// 弹出框
    AndroidCurrentHeight: StatusBar.currentHeight,// android 状态栏高度
    StatusBarHeight: Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : 0,//状态栏高度
    NavHeight: Platform.OS === 'ios' ? (isIphoneX() ? 88 : 64) : 44,// 导航高度
    TabBar: isIphoneX() ? 34 : 0,// tabBar 高度
    IPhoneX: isIphoneX(),// 判断iPhoneX
    TimingCount: 1800,// 提示框显示时间
    LinearGradient: ["#59a9e8", "#2c6cb5"],
    doctorInfo: {},
    stateKey: '',
    serviceTel: "010-6378-6220",// 客服电话
    versionNum: "1.1.0",// 版本号
};

