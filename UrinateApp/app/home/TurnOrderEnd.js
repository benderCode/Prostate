import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, ScrollView, TextInput } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import LinearGradient from "react-native-linear-gradient";// 
import ErrorPrompt from "../common/ErrorPrompt";
import { BoxShadow } from 'react-native-shadow';
import { CachedImage, ImageCache } from "react-native-img-cache";

export default class TurnOrderEnd extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            ErrorPromptFlag: false,
            ErrorPromptText: '',
            ErrorPromptImg: '',

            orderInfo: null,// 订单信息
            patientInfo: null,// 患者信息
            orderImgArr: [],// 订单图片
            draftInfo: {},// 草稿信息
            replyText: '',// 回复信息
        }
    }
    componentWillMount() {
        if (this.props.navigation.state.params) {
            // 查询订单信息 - start
            const orderId = this.props.navigation.state.params.orderId;
            let formData = new FormData();
            formData.append("orderId", orderId);
            fetch(requestUrl.getOrder, {
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
                            orderInfo: responseData.result,
                        })
                        let patientId = responseData.result.patient;
                        // 查患者信息
                        fetch(requestUrl.getBaseInfoById + '?patientId=' + patientId, {
                            method: 'GET',
                            headers: {

                                "token": global.Token,
                            },
                        }).then((response) => response.json())
                            .then((responseData) => {
                                console.log('responseData', responseData);
                                if (responseData.code == 20000) {
                                    let idCard = responseData.result.patientCard.substr(0, 3) + "***********" + responseData.result.patientCard.substr(responseData.result.patientCard.length - 4, responseData.result.patientCard.length);
                                    responseData.result.patientCard = idCard;
                                    this.setState({
                                        patientInfo: responseData.result,
                                    })
                                } else {
                                    this.setState({
                                        isLoading: false,
                                        ErrorPromptFlag: true,
                                        ErrorPromptText: '查询失败，请重试',
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
                        let patientArchive = responseData.result.patientArchive;// 订单编号
                        // 查询图片信息
                        fetch(requestUrl.getByGroupNumber + '?groupNumber=' + patientArchive, {
                            method: 'GET',
                            headers: {

                                "token": global.Token,
                            },
                        }).then((response) => response.json())
                            .then((responseData) => {
                                console.log('responseData', responseData);
                                if (responseData.code == 20000) {
                                    this.setState({
                                        orderImgArr: responseData.result,
                                    })
                                } else {
                                    this.setState({
                                        isLoading: false,
                                        ErrorPromptFlag: true,
                                        ErrorPromptText: '查询失败，请重试',
                                        ErrorPromptImg: require('../images/error.png'),
                                    })
                                    clearTimeout(this.timer)
                                    this.timer = setTimeout(() => {
                                        this.setState({
                                            ErrorPromptFlag: false,
                                        })
                                    }, global.TimingCount)
                                }
                            }).catch((error) => {
                                console.log('error', error);
                            });
                        // 查询草稿信息
                        fetch(requestUrl.getByArchive + '?archive=' + patientArchive, {
                            method: 'GET',
                            headers: {

                                "token": global.Token,
                            },
                        }).then((response) => response.json())
                            .then((responseData) => {
                                console.log('responseData', responseData);
                                if (responseData.code == 20000) {
                                    this.setState({
                                        draftInfo: responseData.result,
                                        replyText: responseData.result.inquiryAnswer,
                                    })
                                } else {
                                    this.setState({
                                        draftInfo: {},
                                    })
                                }
                            }).catch((error) => {
                                console.log('error', error);
                            });
                    } else {
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '查询失败，请重试',
                            ErrorPromptImg: require('../images/error.png'),
                        })
                        clearTimeout(this.timer)
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPromptFlag: false,
                            })
                        }, global.TimingCount)
                    }
                }).catch((error) => {
                    console.log('error', error);
                });
            // 查询订单信息 - end
        }
    }
    componentDidMount() {
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
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
                        <TouchableOpacity
                            style={styles.goBack}
                            activeOpacity={.8}
                            onPress={() => { goBack(); }}>
                            <Image
                                source={require('../images/arrow_left_white.png')}
                            />
                        </TouchableOpacity>
                        <Text style={styles.navTitle}>订单详情</Text>
                    </View>
                </LinearGradient>
                <ScrollView style={styles.scrollView}>
                    {/* 基本信息 - start */}
                    <View style={styles.infoContent}>
                        <View style={styles.infoTopBox}>
                            <View style={styles.infoTextBox}>
                                <Text style={styles.infoText}>{this.state.patientInfo ? this.state.patientInfo.patientName : "患者名"} {this.state.patientInfo ? this.state.patientInfo.patientSex : null} {this.state.patientInfo ? this.state.patientInfo.patientAge : null}岁</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => { }}
                                style={styles.yesBtn}
                            >
                                <View style={styles.yesBox}>
                                    <Text style={styles.yesText}>订单已完成</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoBottomBox}>
                            {this.state.patientInfo && this.state.patientInfo.patientTel ? <Text style={styles.infoValue}>手机号 :{this.state.patientInfo.patientTel}</Text> : null}
                            <Text style={styles.infoValue}>身份证号 :{this.state.patientInfo ? this.state.patientInfo.patientCard : null}</Text>
                            <Text style={styles.infoValue}>创建时间 :{this.state.patientInfo ? this.state.patientInfo.createTime : null}</Text>
                        </View>
                    </View>
                    {/* 基本信息 - end */}
                    <View style={styles.descContent}>
                        <View style={styles.titleContent}>
                            <View style={styles.titleLeftBox}>
                                <View style={styles.titleLine}></View>
                                <Text style={styles.titleText}>问题描述</Text>
                            </View>
                        </View>
                        <View style={styles.problemBox}>
                            <Text style={styles.problemText}>{this.state.orderInfo ? this.state.orderInfo.orderDescription : null}</Text>
                        </View>
                        <View style={styles.lastItem}>
                            <Text style={styles.picText}>￥{this.state.orderInfo ? this.state.orderInfo.orderPrice / 100 : null}</Text>
                        </View>
                    </View>
                    <View style={styles.imgContent}>
                        <View style={styles.titleContent}>
                            <View style={styles.titleLeftBox}>
                                <View style={styles.titleLine}></View>
                                <Text style={styles.titleText}>附件拍照</Text>
                            </View>
                        </View>
                        <ScrollView
                            horizontal={true}
                            style={styles.annexContent}>
                            {this.state.orderImgArr.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        key={index}
                                        onPress={() => {
                                            navigate('LookImg', {
                                                data: this.state.orderImgArr,
                                                index: index,
                                            })
                                        }}
                                        style={styles.annexBtn}
                                    >
                                        <CachedImage style={styles.annexImg} source={{ uri: item }} />
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <View style={styles.importContent}>
                        <View style={styles.titleContent}>
                            <View style={styles.titleLeftBox}>
                                <View style={styles.titleLine}></View>
                                <Text style={styles.titleText}>医生回复</Text>
                            </View>
                        </View>
                        <ScrollView style={styles.textareaScroll}>
                            <Text>{this.state.replyText}</Text>
                        </ScrollView>
                    </View>
                </ScrollView>
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View >
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    // 导航部分 - start
    linearGradient: {
        height: global.px2dp(126),
    },
    scrollView: {
        position: 'absolute',
        top: global.NavHeight,
        height: global.IOS ? global.SCREEN_HEIGHT - global.NavHeight : global.SCREEN_HEIGHT - global.NavHeight - global.AndroidCurrentHeight,
    },
    navContent: {
        position: 'relative',
        height: global.NavHeight,
        paddingTop: global.StatusBarHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goBack: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingLeft: global.px2dp(15),
        paddingTop: global.px2dp(13),
        paddingRight: global.px2dp(15),
        paddingBottom: global.px2dp(13),
    },
    navTitle: {
        fontSize: global.px2dp(19),
        color: global.Colors.textfff,
    },
    // 导航部分 - end

    // 基本信息 - start
    infoContent: {
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(5),
        width: global.px2dp(345),
        height: global.px2dp(114),
        marginTop: global.px2dp(8),
        marginRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
        marginBottom: global.px2dp(8),
    },
    infoTopBox: {
        height: global.px2dp(35),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
        borderBottomWidth: global.Pixel,
        borderBottomColor: global.Colors.text999,
    },
    infoTextBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    infoBottomBox: {
        flex: 1,
        marginLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
        paddingBottom: global.px2dp(6),
        paddingTop: global.px2dp(6),
        justifyContent: 'space-around',
    },
    infoValue: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        lineHeight: global.px2dp(21),
    },
    annexContent: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    annexBtn: {

    },
    annexImg: {
        width: global.px2dp(45),
        height: global.px2dp(45),
        borderRadius: global.px2dp(5),
        borderWidth: global.Pixel,
        borderColor: global.Colors.colorccc,
        marginLeft: global.px2dp(8),
        marginRight: global.px2dp(8),
        marginBottom: global.px2dp(8),
    },
    // 基本信息 - end
    // 图片盒子
    imgContent: {
        width: global.px2dp(345),
        height: global.px2dp(96),
        borderRadius: global.px2dp(5),
        backgroundColor: global.Colors.textfff,
        marginTop: global.px2dp(8),
        marginRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
        marginBottom: global.px2dp(8),
    },
    // 描述 盒子
    descContent: {
        width: global.px2dp(345),
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(5),
        marginTop: global.px2dp(8),
        marginRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
        marginBottom: global.px2dp(8),
    },
    // 回复盒子
    importContent: {
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(5),
        marginTop: global.px2dp(8),
        marginRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
        marginBottom: global.px2dp(8),
    },
    problemBox: {
    },
    problemText: {
        fontSize: global.px2dp(15),
        color: global.Colors.text666,
        lineHeight: global.px2dp(21),
        marginLeft: global.px2dp(22),
        marginRight: global.px2dp(16),
        marginBottom: global.px2dp(10),
    },
    picText: {
        fontSize: global.px2dp(19),
        color: global.Colors.color,
    },
    // title模块-start
    titleContent: {
        height: global.px2dp(36),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    titleLeftBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleLine: {
        marginRight: global.px2dp(7),
        width: global.px2dp(3),
        height: global.px2dp(14),
        borderRadius: global.px2dp(2),
        backgroundColor: global.Colors.color5286C2,
    },
    titleText: {
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
    },
    hintText: {
        fontSize: global.px2dp(13),
        color: global.Colors.text999,
    },
    upFileBox: {
        marginLeft: global.px2dp(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    imgBtn: {
        marginRight: global.px2dp(11),
    },
    // title模块 - end
    lastItem: {
        height: global.px2dp(43),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
        borderTopColor: global.Colors.text999,
        borderTopWidth: global.Pixel,
    },
    importBtnBox: {
        height: global.px2dp(53),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.colorccc,
        backgroundColor: global.Colors.textfff,
    },
    yesBtn: {

    },
    yesBox: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: global.Colors.color,
        borderRadius: global.px2dp(13),
        paddingLeft: global.px2dp(13),
        paddingRight: global.px2dp(13),
    },
    yesText: {
        fontSize: global.px2dp(13),
        color: global.Colors.textfff,
        lineHeight: global.px2dp(27),
    },
    draftBtn: {

    },
    draftBox: {
        width: global.px2dp(79),
        height: global.px2dp(27),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(13),
        borderColor: global.Colors.text999,
        borderWidth: global.Pixel,
    },
    draftText: {
        fontSize: global.px2dp(13),
        color: global.Colors.text888,
    },
    // 输入框样式 - start
    textareaScroll: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginBottom: global.px2dp(15),
        backgroundColor: global.Colors.bgColor,
        paddingLeft: global.px2dp(8),
        paddingRight: global.px2dp(8),
        paddingTop: global.px2dp(8),
        paddingBottom: global.px2dp(8),
    },
    replyText: {
        fontSize: global.px2dp(14),
        lineHeight: global.px2dp(20),
        color: global.Colors.text333,
    }
    // 输入框样式 - start
});

