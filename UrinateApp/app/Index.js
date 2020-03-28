import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";
import { global } from "./utils/Global";
// 首页tab图标-start
const IndexIcon = require('./images/tab_index.png');
const IndexEleIcon = require('./images/tab_ele_index.png');
const ContactIcon = require('./images/tab_contact.png');
const ContactEleIcon = require('./images/tab_ele_contact.png');
const StudyIcon = require('./images/tab_study.png');
const StudyEleIcon = require('./images/tab_ele_study.png');
const MyIcon = require('./images/tab_my.png');
const MyEleIcon = require('./images/tab_ele_my.png');
// 首页tab图标-end

// 页面引入-start

import Start from "./Start";// 启动页

import SignUp from "./sign/SignUp";// 注册
import SignIn from "./sign/SignIn";// 登录
import SignCodeIn from "./sign/SignCodeIn";// 验证码登录
import ForgetPassword from "./sign/ForgetPassword";// 忘记密码

import Approve from "./approve/Approve";// 认证页面

import IndexTab from "./home/Home";// 工作台
import Patients from "./home/Patients";// 患者列表
import PatientsDetails from "./home/PatientsDetails";// 患者详情
import AssessmentDetails from "./home/AssessmentDetails";// 评估详情
import ReadDetails from "./home/ReadDetails";// 解读详情

import TurnContact from "./home/TurnContact";// 转诊通讯录
import TurnDoctorSearch from "./home/TurnDoctorSearch";// 转诊通讯录搜索页
import TurnDoctorDetails from "./home/TurnDoctorDetails";// 转诊医生详情

import Order from "./home/Order";// 订单
import OrderDetails from "./home/OrderDetails";// 订单详情-待回复
import OrderReception from "./home/OrderReception";// 订单详情-待接收
import OrderDecline from "./home/OrderDecline";// 订单详情-已拒绝
import OrderEnd from "./home/OrderEnd";// 订单详情-已完成
import TurnOrder from "./home/TurnOrder";// 转诊订单
import TurnOrderDetails from "./home/TurnOrderDetails";// 转诊订单详情-待回复
import TurnOrderReception from "./home/TurnOrderReception";// 转诊订单详情-待接收
import TurnOrderDecline from "./home/TurnOrderDecline";// 转诊订单详情-已拒绝
import TurnOrderEnd from "./home/TurnOrderEnd";// 转诊订单详情-已完成

import ContactTab from "./contact/Contact";// 通讯录
import DoctorSearch from "./contact/DoctorSearch";// 通讯录搜索页
import DoctorDetails from "./contact/DoctorDetails";// 医生详情

import StudyTab from "./study/Study";// 直播课
import MyTab from "./my/My";// 个人中心
import Earnings from "./my/Earnings";// 收益
import CashManagement from "./my/CashManagement";// 提现管理
import EarningsDetails from "./my/EarningsDetails";// 收益明细
import WithdrawDeposit from "./my/WithdrawDeposit";// 提现
import ServiceAmountManagement from "./my/ServiceAmountManagement";// 服务金额管理
import UpdatePayPassword from "./my/UpdatePayPassword";// 修改支付密码
import ForgetPayPassword from "./my/ForgetPayPassword";// 忘记支付密码
import Followee from "./my/Followee";// 关注的医生列表页
import PersonalInfo from "./my/PersonalInfo";// 查看个人信息
import HeadImg from "./my/HeadImg";// 头像
import Resume from "./my/Resume";// 简介
import GoodAt from "./my/GoodAt";// 擅长
import Authentication from "./my/Authentication";// 查看认证信息
import Protocol from "./my/Protocol";// 协议
import Setting from "./my/Setting";// 设置
import Feedback from "./my/Feedback";// 反馈
import UpdatePassword from "./my/UpdatePassword";// 修改密码
import SafetyCheckout from "./my/SafetyCheckout";// 重置密码
import About from "./my/About";// 关于

import LookImg from "./common/LookImg";// 查看大图
// 页面引入-end

// tab-start
const TabOptions = (tabBarTitle, normalImage, selectedImage) => {
    const tabBarLabel = tabBarTitle;
    const tabBarIcon = (({ focused }) => {
        return (
            <View style={styles.tabBox}>
                <Image
                    source={focused ? normalImage : selectedImage}
                    style={[styles.tabImg]}
                />
                <Text style={[{
                    color: focused ? '#2c6cb5' : '#999999',
                    paddingTop: Platform.OS === 'ios' ? 4 : 0,
                }, styles.tabText]}>{tabBarTitle}</Text>
            </View>
        )
    });
    const tabBarVisible = true;
    return { tabBarLabel, tabBarIcon, tabBarVisible };
};
const MainView = createBottomTabNavigator({
    TabHomePage: {
        screen: IndexTab,
        navigationOptions: () => TabOptions('工作台', IndexIcon, IndexEleIcon),
    },
    TabContactPage: {
        screen: ContactTab,
        navigationOptions: () => TabOptions('通讯录', ContactIcon, ContactEleIcon),
    },
    // TabStudyPage: {
    //     screen: StudyTab,
    //     navigationOptions: () => TabOptions('直播课', StudyIcon, StudyEleIcon),
    // },
    TabMyPage: {
        screen: MyTab,
        navigationOptions: () => TabOptions('个人中心', MyIcon, MyEleIcon),
    },
}, {
        initialRouteName: "TabHomePage",//第一次加载时初始选项卡路由的routeName
        swipeEnabled: false,//滑动切换
        animationEnabled: false,//点击切换是否有滑动效果
        backBehavior: 'none',//返回键是否回到换到初始路由
        lazy: true,
        tabBarOptions: {
            labelStyle: {//标签栏文字的样式
                padding: 0,
                margin: 0,
                fontSize: 12,
            },
            tabStyle: {//选项卡的样式。
                height: global.IPhoneX ? 50 + global.TabBar : 50,
                paddingBottom: global.IPhoneX ? global.TabBar : 0,
            },
            style: {//标签栏的样式
                // height: 50,
            },
            activeBackgroundColor: 'white',// 活动选项卡的背景颜色(选中)
            activeTintColor: '#2c6cb5',// 活动选项卡的标签和图标颜色(选中)
            inactiveBackgroundColor: 'white',//非活动选项卡的背景颜色。(未选中)
            inactiveTintColor: '#999999',//非活动选项卡的标签和图标颜色。(未选中)
            showIcon: true,
            showLabel: false,
            pressOpacity: 0.8,
            indicatorStyle: {
                height: 0,
            }
        },
    });
// tab 样式
const styles = StyleSheet.create({
    tabBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabImg: {
        width: 22,
        height: 22,
    },
    tabText: {
        fontSize: 12,
    },
});
// tab-end

export default createStackNavigator(
    {
        Start: {
            screen: Start,//启动页
        },
        SignUp: {
            screen: SignUp,//注册
        },
        SignIn: {
            screen: SignIn,//登录
            navigationOptions: {
                gesturesEnabled: false,
            }
        },
        SignCodeIn: {
            screen: SignCodeIn,//验证码登录
        },
        ForgetPassword: {
            screen: ForgetPassword,//忘记密码
        },
        Approve: {
            screen: Approve,//认证页面
        },
        Home: {
            screen: MainView,//工作台
            navigationOptions: {
                header: null,
                // gesturesEnabled: false,
            }
        },
        Patients: {
            screen: Patients,//患者列表
        },
        PatientsDetails: {
            screen: PatientsDetails,//患者详情
        },
        AssessmentDetails: {
            screen: AssessmentDetails,//评估详情
        },
        ReadDetails: {
            screen: ReadDetails,//解读详情
        },
        Order: {
            screen: Order,//订单
        },
        OrderDetails: {
            screen: OrderDetails,//订单详情 待回复
        },
        OrderReception: {
            screen: OrderReception,//订单 待接收
        },
        OrderDecline: {
            screen: OrderDecline,//订单 已拒绝
        },
        OrderEnd: {
            screen: OrderEnd,//订单 已完成
        },
        TurnContact: {
            screen: TurnContact,//转诊通讯录
        },
        TurnDoctorSearch: {
            screen: TurnDoctorSearch,//转诊通讯录搜索页
        },
        TurnDoctorDetails: {
            screen: TurnDoctorDetails,//转诊医生详情
        },
        TurnOrder: {
            screen: TurnOrder,//转诊订单
        },
        TurnOrderDetails: {
            screen: TurnOrderDetails,//转诊订单详情 待回复
        },
        TurnOrderReception: {
            screen: TurnOrderReception,//转诊订单 待接收
        },
        TurnOrderDecline: {
            screen: TurnOrderDecline,//转诊订单 已拒绝
        },
        TurnOrderEnd: {
            screen: TurnOrderEnd,//转诊订单 已完成
        },
        ContactTab: {
            screen: ContactTab,//通讯录
        },
        DoctorSearch: {
            screen: DoctorSearch,// 搜索页
        },
        DoctorDetails: {
            screen: DoctorDetails,// 医生详情
        },
        StudyTab: {
            screen: StudyTab,//直播课
        },
        My: {
            screen: MyTab,// 个人中心
        },
        Earnings: {
            screen: Earnings,// 收益
        },
        WithdrawDeposit: {
            screen: WithdrawDeposit,// 提现
        },
        EarningsDetails: {
            screen: EarningsDetails,// 收益明细/流水
        },
        CashManagement: {
            screen: CashManagement,// 提现管理
        },
        ServiceAmountManagement: {
            screen: ServiceAmountManagement,// 服务金额管理
        },
        UpdatePayPassword: {
            screen: UpdatePayPassword,// 修改支付密码
        },
        ForgetPayPassword: {
            screen: ForgetPayPassword,// 重置支付密码
        },
        Followee: {
            screen: Followee,// 关注的医生
        },
        PersonalInfo: {
            screen: PersonalInfo,// 个人信息查看
        },
        HeadImg: {
            screen: HeadImg,// 头像
        },
        GoodAt: {
            screen: GoodAt,// 擅长
        },
        Resume: {
            screen: Resume,// 简介
        },
        Authentication: {
            screen: Authentication,// 认证信息查看
        },
        Protocol: {
            screen: Protocol,// 协议
        },
        Setting: {
            screen: Setting,// 设置
        },
        Feedback: {
            screen: Feedback,// 反馈
        },
        UpdatePassword: {
            screen: UpdatePassword,// 修改密码
        },
        SafetyCheckout: {
            screen: SafetyCheckout,// 重置密码
        },
        About: {
            screen: About,// 关于
        },
        LookImg: {
            screen: LookImg,// 查看大图
        },
    }, {
        initialRouteName: "Start",
    }
);
