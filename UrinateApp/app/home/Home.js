import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, ScrollView, BackHandler } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import LinearGradient from 'react-native-linear-gradient';
import ErrorPrompt from "../common/ErrorPrompt";
import { BoxShadow } from 'react-native-shadow';
import { Storage } from "../utils/AsyncStorage";
import QRCode from 'react-native-qrcode';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            ErrorPromptFlag: false,
            ErrorPromptText: '',
            ErrorPromptImg: '',

            userInfo: {},
            signStatus: '',// 认证状态
            QRCodeContentFlag: false,

            maskContentFlag: false,
            serviceLabelArr: [],// 服务金额数组
            goodsPrice: 0,

            approveMaskFlag: false,//未认证弹框

            clickCount: 0,// 访问量
            inquiryCount: 0,// 帮助患者量
            acceptedOrderCount: 0,//待接受 问诊订单 数量  
            acceptedTurnOrderCount: 0,// 待接受 转诊订单 数量
            acceptedTurnPatientCount: 0,// 待接受 转诊患者 数量
        }
    }

    // 获取后台认证状态
    getSignStates() {
        fetch(requestUrl.getSignStatus, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    // 认证成功
                    this.setState({
                        signStatus: 'AUTHENTICATION_SUCCESS'
                    })
                    // 查询当前所选服务金额
                    this.getPriceInquiryPictureByParams();
                    // 获取个人信息
                    this.getDoctorDetail();
                    // 查询服务量
                    this.getClickAndInquiry();
                } else if (responseData.code == 40002) {
                    // 认证中
                    this.setState({
                        signStatus: 'AUTHENTICATION_PROGRESS',
                        ErrorPromptFlag: false,
                        isLoading: false,
                    })
                    Storage.removeItem("userInfo", () => { })
                } else if (responseData.code == 40003) {
                    // 认证信息审核失败
                    this.setState({
                        signStatus: 'AUTHENTICATION_FAILED',
                        ErrorPromptFlag: false,
                        isLoading: false,
                    })
                    Storage.removeItem("userInfo", () => { })
                } else if (responseData.code == 40004) {
                    // 认证信息未填写
                    this.setState({
                        signStatus: 'AUTHENTICATION_EMPTY',
                        ErrorPromptFlag: false,
                        isLoading: false,
                    })
                    Storage.removeItem("userInfo", () => { })
                } else if (responseData.status == 500) {
                    // 服务器异常
                    this.setState({
                        signStatus: 'SERVICE_ERROR',
                        ErrorPromptFlag: false,
                        isLoading: false,
                    })
                    Storage.removeItem("userInfo", () => { })
                } else {
                    this.setState({
                        signStatus: 'AUTHENTICATION_EMPTY',
                        ErrorPromptFlag: false,
                        isLoading: false,
                    })
                    Storage.removeItem("userInfo", () => { })
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    // 获取个人信息
    getDoctorDetail() {
        fetch(requestUrl.getDoctorDetail, {
            method: 'GET',
            headers: {
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        userInfo: responseData.result,
                    });
                    Storage.setItem("userInfo", responseData.result, (data) => {
                        console.log(data)
                    });
                } else if (responseData == 40004) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '您还未认证',
                        ErrorPromptImg: require('../images/error.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                    }, global.TimingCount)
                } else if (responseData == 50000) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '服务器繁忙',
                        ErrorPromptImg: require('../images/error.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                    }, global.TimingCount)
                } else if (responseData == 40001) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '服务器异常，请重新登录',
                        ErrorPromptImg: require('../images/error.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'SignIn' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                    }, global.TimingCount)
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    // 设置金额
    addGoods() {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("goodsPrice", this.state.goodsPrice);
        formData.append("goodsType", "GOODS_INQUIRY_PICTURE");
        fetch(requestUrl.addGoods, {
            method: 'POST',
            headers: {
                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '提交成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                            maskContentFlag: !this.state.maskContentFlag,
                        })
                    }, global.TimingCount)
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '提交失败，请重试',
                        ErrorPromptImg: require('../images/error.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                            maskContentFlag: !this.state.maskContentFlag,
                        })
                    }, global.TimingCount)
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    // 查询当前所选服务金额
    getPriceInquiryPictureByParams() {
        fetch(requestUrl.getPriceInquiryPictureByParams, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                // 为选择服务金额
                if (responseData.code == 40004) {
                    this.setState({
                        maskContentFlag: true,
                    })
                    // 查询价格标签
                    fetch(requestUrl.getPriceDocketList, {
                        method: 'GET',
                        headers: {

                            "token": global.Token,
                        },
                    }).then((response) => response.json())
                        .then((responseData) => {
                            console.log('responseData', responseData);
                            if (responseData.code == 20000) {
                                this.setState({
                                    isLoading: false,
                                    ErrorPromptFlag: false,
                                    serviceLabelArr: responseData.result,// 服务金额数组
                                })
                            } else {
                                this.setState({
                                    isLoading: false,
                                    ErrorPromptFlag: true,
                                    ErrorPromptText: '服务标签查询失败，请重试',
                                    ErrorPromptImg: require('../images/error.png'),
                                })
                                clearTimeout(this.timer)
                                this.timer = setTimeout(() => {
                                    this.setState({
                                        ErrorPromptFlag: false,
                                    })
                                }, global.TimingCount)
                            }
                        })
                        .catch((error) => {
                            console.log('error', error);
                        });
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    // 横幅 医院 科室 信息
    scrollText() {
        if (this.state.signStatus == "AUTHENTICATION_SUCCESS") {
            return (<Text style={styles.scrollText}>{this.state.userInfo.hospitalName} {this.state.userInfo.branchName}</Text>)
        } else {
            return (<Text style={styles.scrollText}>你好！欢迎来到栗子医学</Text>)
        }
    }
    headTextHtml() {
        if (this.state.signStatus == "AUTHENTICATION_SUCCESS") {
            return (<Text style={styles.headText}>{this.state.userInfo.doctorName}医生工作站</Text>)
        } else if (this.state.signStatus == "AUTHENTICATION_EMPTY") {
            return (
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {
                        this.props.navigation.navigate('Approve');
                    }}
                >
                    <Text style={styles.headText}>你暂时还未认证，请先 <Text style={{ color: global.Colors.color347fc2 }}>去认证</Text></Text>
                </TouchableOpacity>
            )
        } else if (this.state.signStatus == "AUTHENTICATION_FAILED") {
            return (
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {
                        this.props.navigation.navigate('Approve');
                    }}
                >
                    <Text style={styles.headText}>认证失败，请重新 <Text style={{ color: global.Colors.color347fc2 }}>去认证</Text></Text>
                </TouchableOpacity>
            )
        } else if (this.state.signStatus == "AUTHENTICATION_PROGRESS") {
            return (<Text style={styles.headText}>认证信息审核中...</Text>)
        } else if (this.state.signStatus == "SERVICE_ERROR") {
            return (<Text style={styles.headText}>服务器维护中...</Text>)
        }
    }
    // 渲染服务标签
    renderServiceLabel() {
        let tempArr = [];
        if (this.state.serviceLabelArr.length > 0) {
            for (let i = 0; i < this.state.serviceLabelArr.length; i++) {
                tempArr.push(
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.setState({
                                goodsPrice: this.state.serviceLabelArr[i].docketValue,
                            })
                        }}
                        style={styles.amountItem}
                        key={i}
                    >
                        <View style={[styles.amountBox, this.state.goodsPrice == this.state.serviceLabelArr[i].docketValue ? { backgroundColor: global.Colors.color } : null]}>
                            <Text style={[styles.picText, this.state.goodsPrice == this.state.serviceLabelArr[i].docketValue ? { color: global.Colors.textfff } : null]}>{this.state.serviceLabelArr[i].docketName}元</Text>
                            <Text style={[styles.descText, this.state.goodsPrice == this.state.serviceLabelArr[i].docketValue ? { color: global.Colors.textfff } : null]}>问诊金额</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        }
        return tempArr;
    }
    // 查询服务量
    getClickAndInquiry() {
        fetch(requestUrl.getClickAndInquiry, {
            method: 'GET',
            headers: {
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                if (responseData.code == 20000) {
                    this.setState({
                        clickCount: responseData.result.clickCount,
                        inquiryCount: responseData.result.inquiryCount,
                        acceptedOrderCount: responseData.result.acceptedOrderCount,//待接受 问诊订单 数量  
                        acceptedTurnOrderCount: responseData.result.acceptedTurnOrderCount,// 待接受 转诊订单 数量
                        acceptedTurnPatientCount: responseData.result.acceptedTurnPatientCount,// 待接受 转诊患者 数量
                    })
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    // 查询三模块角标

    render() {
        const shadowOpt = {
            width: global.px2dp(340),
            height: global.px2dp(258),
            color: "#000",
            border: 20,
            radius: 0,
            opacity: .2,
            x: 0,
            y: 0,
            style: styles.boxShadow,
        }
        const { navigate, goBack } = this.props.navigation;
        return (
            <ScrollView
                style={styles.container}
                alwaysBounceVertical={true}// ios不满一屏时弹性
                bounces={false}// ios弹性
            >
                <NavigationEvents
                    onWillFocus={() => {
                        Storage.getItem("userInfo", (data) => {
                            if (data) {
                                this.setState({
                                    userInfo: data,
                                    signStatus: 'AUTHENTICATION_SUCCESS',
                                })
                                // 查询服务量
                                this.getClickAndInquiry();
                            } else {
                                this.setState({
                                    isLoading: true,
                                    ErrorPromptFlag: true,
                                    ErrorPromptText: '加载中...',
                                    ErrorPromptImg: require('../images/loading.png'),
                                });
                                this.getSignStates();
                            }
                        })
                    }}
                />
                <StatusBar
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.state.isLoading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//状态栏样式 default	默认（IOS为白底黑字、Android为黑底白字）
                    barStyle={"default"}// 状态栏文本的颜色。
                />
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    // locations={[0, 1]}
                    colors={global.LinearGradient}
                    style={styles.linearGradient}>
                    <View style={styles.navContent}>
                        <Image
                            style={styles.allianceName}
                            source={require('../images/alliance_name.png')}
                        />
                        <View style={styles.separateLine}></View>
                        <TouchableOpacity
                            style={styles.QRCodeBtn}
                            activeOpacity={.8}
                            onPress={() => {
                                if (this.state.signStatus != "AUTHENTICATION_SUCCESS") {
                                    // 不是 认证成功
                                    if (this.state.signStatus == "SERVICE_ERROR") {
                                        this.setState({
                                            isLoading: false,
                                            ErrorPromptFlag: true,
                                            ErrorPromptText: '服务器维护中...',
                                            ErrorPromptImg: require('../images/error.png'),
                                        })
                                        clearTimeout(this.timer)
                                        this.timer = setTimeout(() => {
                                            this.setState({
                                                ErrorPromptFlag: false,
                                            })
                                        }, global.TimingCount)
                                    } else {
                                        this.setState({
                                            approveMaskFlag: !this.state.approveMaskFlag,
                                        })
                                    }
                                } else {
                                    this.setState({
                                        QRCodeContentFlag: !this.state.QRCodeContentFlag
                                    })
                                }
                            }}>
                            <Image
                                source={require('../images/qr_code_btn.png')}
                            />
                            <Text style={styles.QRCodeText}>我的二维码</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <BoxShadow
                    setting={shadowOpt}>
                    <View style={styles.content}>
                        {/* 条幅-start */}
                        <View style={styles.scrollContent}>
                            {this.scrollText()}
                            <View style={styles.offcutBox}></View>
                        </View>
                        {/* 条幅-end */}

                        <View style={styles.headContent}>
                            <View style={styles.titleLine}></View>
                            <View style={styles.headBox}>
                                {this.headTextHtml()}
                            </View>
                        </View>
                        {/* 统计部分-start */}
                        <View style={styles.statisticsContent}>
                            <View style={styles.statisticsItem}>
                                <Text style={[styles.statisticsNum, { color: this.state.signStatus == "AUTHENTICATION_SUCCESS" ? global.Colors.color : global.Colors.text555, fontSize: this.state.signStatus == "AUTHENTICATION_SUCCESS" ? global.px2dp(20) : global.px2dp(12) }]}>{this.state.signStatus == "AUTHENTICATION_SUCCESS" ? this.state.clickCount : "暂无数据"}</Text>
                                <Text style={styles.statisticsText}>访问量</Text>
                            </View>
                            <View style={styles.statisticsLine}></View>
                            <View style={styles.statisticsItem}>
                                <Text style={[styles.statisticsNum, { color: this.state.signStatus == "AUTHENTICATION_SUCCESS" ? global.Colors.color : global.Colors.text555, fontSize: this.state.signStatus == "AUTHENTICATION_SUCCESS" ? global.px2dp(20) : global.px2dp(12) }]}>{this.state.signStatus == "AUTHENTICATION_SUCCESS" ? this.state.inquiryCount : "暂无数据"}</Text>
                                <Text style={styles.statisticsText}>已帮助患者</Text>
                            </View>
                        </View>
                        {/* 统计部分-end */}

                        {/* 三大模块-start */}
                        <View style={styles.moduleContent}>
                            <TouchableOpacity
                                style={styles.moduleBtn}
                                activeOpacity={.8}
                                onPress={() => {
                                    if (this.state.signStatus != "AUTHENTICATION_SUCCESS") {
                                        // 不是 认证成功
                                        if (this.state.signStatus == "SERVICE_ERROR") {
                                            this.setState({
                                                isLoading: false,
                                                ErrorPromptFlag: true,
                                                ErrorPromptText: '服务器维护中...',
                                                ErrorPromptImg: require('../images/error.png'),
                                            })
                                            clearTimeout(this.timer)
                                            this.timer = setTimeout(() => {
                                                this.setState({
                                                    ErrorPromptFlag: false,
                                                })
                                            }, global.TimingCount)
                                        } else {
                                            this.setState({
                                                approveMaskFlag: !this.state.approveMaskFlag,
                                            })
                                        }
                                    } else {
                                        // activeFlag 是否有待接收的订单
                                        navigate('Order', {
                                            activeFlag: this.state.acceptedOrderCount > 0 ? true : false,
                                        });
                                    }
                                }}>
                                <Image
                                    style={styles.moduleImg}
                                    source={require('../images/inquiry.png')}
                                />
                                <Text style={styles.moduleText}>问诊</Text>
                                {this.state.acceptedOrderCount > 0 ? <View style={styles.countBox}>
                                    <Text style={styles.countText}>{this.state.acceptedOrderCount > 99 ? "99+" : this.state.acceptedOrderCount}</Text>
                                </View> : null}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.moduleBtn}
                                activeOpacity={.8}
                                onPress={() => {
                                    if (this.state.signStatus != "AUTHENTICATION_SUCCESS") {
                                        // 不是 认证成功
                                        if (this.state.signStatus == "SERVICE_ERROR") {
                                            this.setState({
                                                isLoading: false,
                                                ErrorPromptFlag: true,
                                                ErrorPromptText: '服务器维护中...',
                                                ErrorPromptImg: require('../images/error.png'),
                                            })
                                            clearTimeout(this.timer)
                                            this.timer = setTimeout(() => {
                                                this.setState({
                                                    ErrorPromptFlag: false,
                                                })
                                            }, global.TimingCount)
                                        } else {
                                            this.setState({
                                                approveMaskFlag: !this.state.approveMaskFlag,
                                            })
                                        }
                                    } else {
                                        navigate('Patients');
                                    }
                                }}>
                                <Image
                                    style={styles.moduleImg}
                                    source={require('../images/patient.png')}
                                />
                                <Text style={styles.moduleText}>患者管理</Text>
                                {this.state.acceptedTurnPatientCount > 0 ? <View style={styles.countBox}>
                                    <Text style={styles.countText}>{this.state.acceptedTurnPatientCount > 99 ? "99+" : this.state.acceptedTurnPatientCount}</Text>
                                </View> : null}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.moduleBtn}
                                activeOpacity={.8}
                                onPress={() => {
                                    if (this.state.signStatus != "AUTHENTICATION_SUCCESS") {
                                        // 不是 认证成功
                                        if (this.state.signStatus == "SERVICE_ERROR") {
                                            this.setState({
                                                isLoading: false,
                                                ErrorPromptFlag: true,
                                                ErrorPromptText: '服务器维护中...',
                                                ErrorPromptImg: require('../images/error.png'),
                                            })
                                            clearTimeout(this.timer)
                                            this.timer = setTimeout(() => {
                                                this.setState({
                                                    ErrorPromptFlag: false,
                                                })
                                            }, global.TimingCount)
                                        } else {
                                            this.setState({
                                                approveMaskFlag: !this.state.approveMaskFlag,
                                            })
                                        }
                                    } else {
                                        // activeFlag 是否有待接收的订单
                                        navigate('TurnOrder', {
                                            activeFlag: this.state.acceptedTurnOrderCount > 0 ? true : false,
                                        });
                                    }
                                }}>
                                <Image
                                    style={styles.moduleImg}
                                    source={require('../images/shift_examine.png')}
                                />
                                <Text style={styles.moduleText}>转诊管理</Text>
                                {this.state.acceptedTurnOrderCount > 0 ? <View style={styles.countBox}>
                                    <Text style={styles.countText}>{this.state.acceptedTurnOrderCount > 99 ? "99+" : this.state.acceptedTurnOrderCount}</Text>
                                </View> : null}
                            </TouchableOpacity>
                        </View>
                        {/* 三大模块-end */}

                    </View>
                </BoxShadow>
                <View style={styles.titleBox}>
                    <View style={styles.titleLine}></View>
                    <Text style={styles.titleText}>院内公告</Text>
                </View>
                <View style={styles.bannerContent}>
                    <Image style={styles.bannerImg} source={require('../images/banner.png')} />
                </View>
                {/* 二维码 */}
                {this.state.QRCodeContentFlag ?
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({
                                QRCodeContentFlag: !this.state.QRCodeContentFlag
                            })
                        }}
                        style={styles.maskContent}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                        >
                            <View style={styles.QRCodeContent}>
                                <View style={styles.QRTitleBox}>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        style={styles.closeBtn}
                                        onPress={() => {
                                            this.setState({
                                                QRCodeContentFlag: !this.state.QRCodeContentFlag
                                            })
                                        }}
                                    >
                                        <Text style={styles.closeText}>返回</Text>
                                    </TouchableOpacity>
                                </View>
                                <Image
                                    style={styles.QCHeadImg}
                                    source={this.state.userInfo.headImg ? { uri: this.state.userInfo.headImg } : require('../images/default_doc_img.png')} />
                                <Text style={styles.QCDoctorName}>{this.state.userInfo.doctorName}</Text>
                                <Text style={styles.QCDoctorTitle}>{this.state.userInfo.titleName}</Text>
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#fff', '#999', '#fff']}
                                    style={{
                                        width: global.px2dp(225),
                                        height: global.Pixel,
                                        // height: global.px2dp(5),
                                        marginTop: global.px2dp(8),
                                        marginBottom: global.px2dp(8),
                                        backgroundColor: 'red',
                                    }}>
                                </LinearGradient>

                                <View style={styles.countContent}>
                                    <View style={styles.countItem}>
                                        <Text>{this.state.clickCount}</Text>
                                        <Text>访问量</Text>
                                    </View>
                                    <View style={styles.countLine}></View>
                                    <View style={styles.countItem}>
                                        <Text>{this.state.inquiryCount}</Text>
                                        <Text>已帮助患者</Text>
                                    </View>
                                </View>
                                <View style={styles.QRImgBox}>
                                    <QRCode
                                        value={"http://www.qlxlm.com/chestnut/doctorDetails/DoctorDetails.html?" + global.Token}
                                        size={140}
                                        bgColor='#000'
                                        fgColor='white' />
                                </View>
                                <Text style={styles.QRText}>微信扫一扫</Text>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null}
                {/* 设置服务金额 */}
                {this.state.maskContentFlag ?
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({
                                maskContentFlag: !this.state.maskContentFlag
                            })
                        }}
                        style={styles.maskContent}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                        >
                            <View style={styles.amountContent}>
                                <View style={styles.amountTitleBox}>
                                    <Text style={styles.amountTitleText}>请选择你的服务金额</Text>
                                </View>
                                <View style={styles.amountCenterBox}>
                                    {this.renderServiceLabel()}
                                </View>
                                <View style={styles.amountBtnBox}>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.setState({
                                                maskContentFlag: !this.state.maskContentFlag,
                                            })
                                        }}
                                        style={[styles.amountBtn, styles.noBtn]}
                                    >
                                        <Text style={[styles.btnText, styles.noBtnText]}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.addGoods();
                                        }}
                                        style={[styles.amountBtn, styles.yesBtn]}
                                    >
                                        <Text style={[styles.btnText, styles.yesBtnText]}>确认</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null}
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
                {/* 去认证弹框 */}
                {this.state.approveMaskFlag ?
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({
                                approveMaskFlag: !this.state.approveMaskFlag
                            })
                        }}
                        style={styles.approveMask}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                        >
                            <View style={styles.approveContent}>
                                <Text style={styles.approveTitle}>认证信息</Text>
                                <Text style={styles.approveText}>该功能需要实名认证之后才能继续使用，请先进行认证</Text>
                                <View style={styles.approveBtnBox}>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.setState({
                                                approveMaskFlag: !this.state.approveMaskFlag
                                            })
                                        }}
                                        style={[styles.approveBtnClick, {
                                            borderRightColor: global.Colors.colorccc,
                                            borderRightWidth: global.Pixel,
                                        }]}
                                    >
                                        <Text style={[styles.approveBtnText, { color: global.Colors.text666, }]}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // AUTHENTICATION_PROGRESS,//认证中
                                            // AUTHENTICATION_SUCCESS,//认证成功
                                            // AUTHENTICATION_FAILED, //认证失败
                                            // AUTHENTICATION_EMPTY //未填写认证信息
                                            if (this.state.signStatus == "AUTHENTICATION_FAILED" || this.state.signStatus == "AUTHENTICATION_EMPTY") {
                                                // 认证失败 未认证 去认证页面
                                                navigate("Approve");
                                            } else if (this.state.signStatus == "AUTHENTICATION_PROGRESS") {
                                                // 认证中 去查看信息页
                                                navigate("Authentication");
                                            }
                                            this.setState({
                                                approveMaskFlag: !this.state.approveMaskFlag
                                            })
                                        }}
                                        activeOpacity={.8}
                                        style={styles.approveBtnClick}
                                    >
                                        <Text style={[styles.approveBtnText, { color: global.Colors.color }]}>去认证</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        height: global.SCREEN_HEIGHT,
        backgroundColor: global.Colors.textfff,
    },
    linearGradient: {
        paddingTop: global.StatusBarHeight,
        height: global.px2dp(143) + global.StatusBarHeight,
    },
    navContent: {
        paddingLeft: global.px2dp(10),
        paddingRight: global.px2dp(10),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: global.px2dp(30),
        marginBottom: global.px2dp(23),
    },
    separateLine: {
        width: global.Pixel,
        height: global.px2dp(34),
        backgroundColor: global.Colors.textfff,
    },
    QRCodeBtn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    QRCodeText: {
        marginTop: global.px2dp(5),
        fontSize: global.px2dp(12),
        color: global.Colors.textfff,
    },

    // 主体部分
    boxShadow: {
        marginTop: global.px2dp(-45),
        marginBottom: global.px2dp(6),
        marginLeft: global.px2dp(20),
    },
    content: {
        width: global.px2dp(340),
        height: global.px2dp(258),
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(5),
        // shadowColor: '#000',
        // shadowOffset: {width: 0, height: 0 },
        // shadowRadius: 6,
        // shadowOpacity: .2,
    },
    // 条幅-start
    scrollContent: {
        position: 'relative',
        justifyContent: 'center',
        maxWidth: global.px2dp(257),
        height: global.px2dp(32),
        borderTopRightRadius: global.px2dp(16),
        borderBottomRightRadius: global.px2dp(16),
        marginLeft: global.px2dp(-5),
        marginTop: global.px2dp(12),
        backgroundColor: global.Colors.color347fc2,
        overflow: 'hidden',
    },
    scrollText: {
        paddingLeft: global.px2dp(13),
        color: global.Colors.textfff,
        fontSize: global.px2dp(17),
    },
    offcutBox: {
        position: 'absolute',
        bottom: global.px2dp(-5),
        left: 0,
        width: 0,
        height: 0,
        borderColor: global.Colors.color,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderLeftColor: 'transparent',
        transform: [{ rotate: '45deg' }],
        borderRadius: 6,
        borderTopWidth: global.px2dp(6),
        borderBottomWidth: global.px2dp(6),
        borderRightWidth: global.px2dp(6),
        borderLeftWidth: global.px2dp(6),
    },
    // 条幅-end

    // 统计部分
    statisticsContent: {
        marginRight: global.px2dp(22),
        marginLeft: global.px2dp(22),
        height: global.px2dp(60),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: "#cdcdcd",
        borderTopWidth: global.Pixel,
        borderBottomWidth: global.Pixel,
        // borderRightColor: "transparent",
        // borderWidth: global.Pixel,
        // borderStyle: 'dotted',
    },
    statisticsItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statisticsNum: {
        fontSize: global.px2dp(20),
    },
    statisticsText: {
        marginTop: global.px2dp(9),
        fontSize: global.px2dp(10),
        color: global.Colors.text999,
    },
    statisticsLine: {
        backgroundColor: global.Colors.colorccc,
        width: global.px2dp(2),
        height: global.px2dp(18),
    },
    // 三大模块 -start
    moduleContent: {
        marginRight: global.px2dp(22),
        marginLeft: global.px2dp(22),
        height: global.px2dp(100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    moduleBtn: {
        position: 'relative',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    moduleImg: {
        marginBottom: global.px2dp(9),
    },
    moduleText: {
        color: global.Colors.text333,
        fontSize: global.px2dp(13),
    },
    countBox: {
        position: 'absolute',
        top: global.px2dp(3),
        right: global.px2dp(15),
        alignItems: 'center',
        justifyContent: 'center',
        width: global.px2dp(22),
        height: global.px2dp(14),
        backgroundColor: global.Colors.colorFD2C2D,
        borderTopRightRadius: global.px2dp(6),
        borderBottomRightRadius: global.px2dp(6),
        borderTopLeftRadius: global.px2dp(6),
    },
    countText: {
        fontSize: global.px2dp(10),
        color: global.Colors.textfff,
    },
    // 三大模块 - end
    // 大标题-start
    headContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: global.px2dp(15),
        marginTop: global.px2dp(18),
        marginBottom: global.px2dp(16),
    },
    headBox: {
        alignItems: 'center',
    },
    headText: {
        fontSize: global.px2dp(16),
        color: global.Colors.text555,
    },
    // 大标题-end
    // 标题-院内公告 -start
    titleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginBottom: global.px2dp(18),
        marginTop: global.px2dp(18),
    },
    titleLine: {
        backgroundColor: global.Colors.color,
        width: global.px2dp(3),
        height: global.px2dp(15),
        borderRadius: global.px2dp(3),
        marginRight: global.px2dp(7),
    },
    titleText: {
        fontSize: global.px2dp(16),
        color: global.Colors.text555,
    },
    // 标题-院内公告 - end

    // 轮播图
    bannerContent: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginBottom: global.px2dp(20),
    },
    bannerImg: {
        width: global.px2dp(346),
    },
    // 二维码 box - start
    maskContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: global.SCREEN_WIDTH,
        height: global.SCREEN_HEIGHT,
        backgroundColor: 'rgba(0,0,0,.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    QRCodeContent: {
        overflow: 'hidden',
        alignItems: 'center',
        width: global.px2dp(273),
        height: global.px2dp(376),
        borderRadius: global.px2dp(5),
        backgroundColor: global.Colors.textfff,
    },
    QRTitleBox: {
        width: global.px2dp(273),
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: global.px2dp(50),
        backgroundColor: global.Colors.color,
    },
    closeBtn: {
    },
    closeText: {
        fontSize: global.px2dp(14),
        lineHeight: global.px2dp(50),
        color: global.Colors.textfff,
        paddingRight: global.px2dp(17),
        paddingLeft: global.px2dp(17),
    },
    QCHeadImg: {
        width: global.px2dp(70),
        height: global.px2dp(70),
        borderColor: global.Colors.textfff,
        borderWidth: global.Pixel,
        borderRadius: global.px2dp(35),
        marginTop: - global.px2dp(35),
        marginBottom: global.px2dp(7),
    },
    QCDoctorName: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        lineHeight: global.px2dp(23),
    },
    QCDoctorTitle: {
        fontSize: global.px2dp(15),
        color: global.Colors.text333,
        lineHeight: global.px2dp(22),
    },
    countContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: global.px2dp(190),
        height: global.px2dp(36),
    },
    countItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    countLine: {
        height: global.px2dp(17),
        width: global.Pixel,
        backgroundColor: global.Colors.colorccc,
    },
    QRImgBox: {
        width: global.px2dp(150),
        height: global.px2dp(150),
        borderWidth: global.Pixel,
        borderColor: global.Colors.text999,
        borderRadius: global.px2dp(5),
        padding: global.px2dp(3),
        marginTop: global.px2dp(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    QRText: {
        fontSize: global.px2dp(13),
        color: global.Colors.text999,
        lineHeight: global.px2dp(32),
    },
    // 二维码 box - end

    // 金额选择 -start
    amountContent: {
        position: 'relative',
        justifyContent: 'space-between',
        width: global.px2dp(340),
        height: global.px2dp(250),
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(5),
        overflow: 'hidden',
    },
    amountTitleBox: {
        height: global.px2dp(48),
        justifyContent: 'center',
        paddingLeft: global.px2dp(15),
        backgroundColor: global.Colors.bgColor,
    },
    amountTitleText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    amountCenterBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: global.px2dp(10),
    },
    amountItem: {

    },
    amountBox: {
        width: global.px2dp(89),
        height: global.px2dp(42),
        borderWidth: global.Pixel,
        borderColor: global.Colors.color,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: global.px2dp(10),
        marginBottom: global.px2dp(10),
        marginRight: global.px2dp(10),
        marginLeft: global.px2dp(10),
        borderRadius: global.px2dp(3),
    },
    picText: {
        fontSize: global.px2dp(16),
        color: global.Colors.color,
    },
    descText: {
        fontSize: global.px2dp(9),
        color: "#6492c8",
    },
    amountBtnBox: {
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.colorccc,
        height: global.px2dp(47),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    amountBtn: {
        height: global.px2dp(47),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noBtn: {
        borderRightWidth: global.Pixel,
        borderRightColor: global.Colors.colorccc,
    },
    btnText: {
        fontSize: global.px2dp(17),
    },
    noBtnText: {
        color: global.Colors.text666,
    },
    yesBtnText: {
        color: global.Colors.color,
    },
    // 金额选择 - end

    // 认证信息 - start
    approveMask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: global.SCREEN_WIDTH,
        height: global.SCREEN_HEIGHT,
        backgroundColor: "rgba(0,0,0,.6)",
        alignItems: 'center',
        justifyContent: 'center',
    },
    approveContent: {
        width: global.px2dp(300),
        height: global.px2dp(170),
        backgroundColor: global.Colors.textfff,
        justifyContent: 'space-between',
        borderRadius: global.px2dp(4),
    },
    approveTitle: {
        marginTop: global.px2dp(17),
        textAlign: 'center',
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
    },
    approveText: {
        fontSize: global.px2dp(16),
        color: global.Colors.text666,
        textAlign: 'center',
        marginLeft: global.px2dp(40),
        marginRight: global.px2dp(40),
        lineHeight: global.px2dp(22),
    },
    approveBtnBox: {
        height: global.px2dp(48),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.colorcccccc,
    },
    approveBtnClick: {
        flex: 1,
        height: global.px2dp(48),
        alignItems: 'center',
        justifyContent: 'center',
    },
    approveBtnText: {
        fontSize: global.px2dp(17),
    }
});

