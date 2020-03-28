import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, ScrollView, TextInput } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import LinearGradient from "react-native-linear-gradient";// 
import ErrorPrompt from "../common/ErrorPrompt";
import { BoxShadow } from 'react-native-shadow';
import { CachedImage, ImageCache } from "react-native-img-cache";

export default class OrderReception extends Component {
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

            labelText: '',

            maskFlag: false,
            maskLabelFlag: false,

            orderInfo: null,// 订单信息
            patientInfo: null,// 患者信息
            orderImgArr: [],// 订单图片
        }
    }
    getInitalState() {
        // 1初始化state
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

                    <View style={styles.btnContent}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    maskFlag: !this.state.maskFlag,
                                })
                            }}
                            activeOpacity={.8}
                            style={[styles.operateBtnClick]}
                        >
                            <View style={[styles.operateBtnBox, { backgroundColor: global.Colors.colorccc }]}>
                                <Text style={[styles.operateBtnText, { color: global.Colors.text666 }]}>拒绝</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.acceptedOrder();
                            }}
                            activeOpacity={.8}
                            style={[styles.operateBtnClick]}
                        >
                            <View style={[styles.operateBtnBox, { backgroundColor: global.Colors.color }]}>
                                <Text style={[styles.operateBtnText, { color: global.Colors.textfff }]}>同意</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: global.px2dp(15) }}></View>
                </ScrollView>
                {
                    this.state.maskFlag ?
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.setState({
                                    maskFlag: !this.state.maskFlag,
                                })
                            }}
                            style={styles.maskContent}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { }}
                            >
                                <View style={styles.affirmContent}>
                                    <View style={styles.affirmBox}>
                                        <Text style={styles.affirmText}>你确定拒绝回复{this.state.patientInfo.patientName}吗?</Text>
                                    </View>
                                    <View style={styles.btnBox}>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress={() => {
                                                this.setState({
                                                    maskFlag: !this.state.maskFlag,
                                                })
                                            }}
                                            style={[styles.btnClick, { borderRightColor: global.Colors.text999, borderRightWidth: global.Pixel }]}
                                        >
                                            <Text style={styles.noBtnText}>否</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress={() => {
                                                this.setState({
                                                    maskFlag: !this.state.maskFlag,
                                                })
                                                this.rejectedOrder();
                                            }}
                                            style={styles.btnClick}
                                        >
                                            <Text style={styles.yesBtnText}>是</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        : null
                }
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View >
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
    // 接收订单 - start
    acceptedOrder() {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("orderId", this.state.orderInfo.id);
        fetch(requestUrl.acceptedOrder, {
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
                        ErrorPromptText: '接收成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                        this.props.navigation.goBack();
                    }, global.TimingCount)
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '接收失败，请重试',
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
    // 接收订单 - end
    // 拒绝订单 - start
    rejectedOrder() {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("orderId", this.state.orderInfo.id);
        fetch(requestUrl.rejectedOrder, {
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
                        ErrorPromptText: '拒绝成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                        this.props.navigation.goBack();
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
                        })
                    }, global.TimingCount)
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    // 拒绝订单 - end
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
        height: global.px2dp(96),
        borderRadius: global.px2dp(5),
        backgroundColor: global.Colors.textfff,
        width: global.px2dp(345),
        marginTop: global.px2dp(8),
        marginRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
        marginBottom: global.px2dp(8),
    },
    // 描述 盒子
    descContent: {
        backgroundColor: global.Colors.textfff,
        justifyContent: 'space-between',
        borderRadius: global.px2dp(5),
        marginTop: global.px2dp(8),
        marginRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
        marginBottom: global.px2dp(8),
    },
    problemScroll: {
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

    btnContent: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginTop: global.px2dp(25),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    operateBtnBox: {
        width: global.px2dp(154),
        height: global.px2dp(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: global.px2dp(5),
    },
    operateBtnText: {
        fontSize: global.px2dp(16),
    },

    // 确认删除
    maskContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        width: global.SCREEN_WIDTH,
        height: global.SCREEN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    affirmContent: {
        width: global.px2dp(285),
        height: global.px2dp(126),
        borderRadius: global.px2dp(3),
        backgroundColor: global.Colors.textfff,
    },
    affirmBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    affirmText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    btnBox: {
        height: global.px2dp(45),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.text999,
    },
    btnClick: {
        flex: 1,
        height: global.px2dp(45),
        alignItems: 'center',
        justifyContent: 'center',
    },
    noBtnText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text666,
    },
    yesBtnText: {
        fontSize: global.px2dp(17),
        color: global.Colors.color,
    },
});

