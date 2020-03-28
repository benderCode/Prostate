import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import ErrorPrompt from "../common/ErrorPrompt";
import LinearGradient from 'react-native-linear-gradient';
import { NavigationEvents } from "react-navigation";

export default class Earnings extends Component {
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

            balance: 0,// 余额
            totleIncome: 0,// 累计收益
            serviceLabelArr: [],// 服务金额标签
            switchServiceFlag: false,
            servicePicActive: 0,// 当前医生的服务金额
            servicePic: 0,// 将要切换服务金额
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        // 查询累计收益
        fetch(requestUrl.getTotleIncome, {
            method: 'GET',
            headers: {
                
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.setState({
                        totleIncome: responseData.result,
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '累计收益查询失败，请重试',
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
        // 查询当前所选价格
        fetch(requestUrl.getPriceInquiryPictureByParams, {
            method: 'GET',
            headers: {
                
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.setState({
                        servicePicActive: responseData.result,
                    })
                } else if (responseData.code == 40004) {
                    this.setState({
                        servicePicActive: 0,
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
    // 查询账号余额
    getBalance() {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '加载中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        fetch(requestUrl.getBalance, {
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
                        balance: responseData.result,
                    })
                } else if (responseData.code == 40004) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        balance: 0,
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
    }
    componentDidMount() {
        // 4获取数据 在 render 后
    }
    render() {
        // 变量声明
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => {
                        this.getBalance();
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
                                } else if (responseData.code == 40004) {
                                    this.setState({
                                        isLoading: false,
                                        ErrorPromptFlag: true,
                                        ErrorPromptText: '还没有标签，编辑标签添加',
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
                        <TouchableOpacity
                            style={styles.goBack}
                            activeOpacity={.8}
                            onPress={() => { goBack(); }}>
                            <Image
                                source={require('../images/arrow_left_white.png')}
                            />
                        </TouchableOpacity>
                        <Text style={styles.navTitle}>收益</Text>
                    </View>
                    <View style={styles.earningsContent}>
                        <View style={styles.earningsBox}>
                            <Text style={styles.earningsValue}>{this.state.balance}</Text>
                            <Text style={styles.earningsText}>账户余额</Text>
                        </View>
                        <View style={styles.earningsLien}></View>
                        <View style={styles.earningsBox}>
                            <Text style={styles.earningsValue}>{this.state.totleIncome}</Text>
                            <Text style={styles.earningsText}>累计诊费收益</Text>
                        </View>
                    </View>
                </LinearGradient>
                <ScrollView>
                    <View style={styles.content}>
                        <TouchableOpacity
                            onPress={() => {
                                navigate("WithdrawDeposit");
                            }}
                            activeOpacity={.8}
                            style={styles.itemBox}
                        >
                            <Image source={require('../images/withdraw_deposit.png')} />
                            <Text style={styles.itemText}>去提现</Text>
                            <Image source={require('../images/arrow_right_grey.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <TouchableOpacity
                            onPress={() => {
                                navigate("EarningsDetails");
                            }}
                            activeOpacity={.8}
                            style={[styles.itemBox, { borderBottomColor: global.Colors.text999, borderBottomWidth: global.Pixel }]}
                        >
                            <Image source={require('../images/earnings_details.png')} />
                            <Text style={styles.itemText}>查看收益明细</Text>
                            <Image source={require('../images/arrow_right_grey.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navigate("CashManagement");
                            }}
                            activeOpacity={.8}
                            style={styles.itemBox}
                        >
                            <Image source={require('../images/cash_management.png')} />
                            <Text style={styles.itemText}>提现管理</Text>
                            <Image source={require('../images/arrow_right_grey.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.serviceContent}>
                        <View style={styles.serviceTopBox}>
                            <Text style={styles.serviceTitle}>服务金额</Text>
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => {
                                    navigate("ServiceAmountManagement");
                                }}
                                style={styles.serviceManagementClick}
                            >
                                <Text style={styles.serviceManagementText}>编辑标签</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.serviceBox}>
                            {this.renderServiceLabel()}
                        </View>
                    </View>
                </ScrollView>
                {/* 切换服务金额弹框 - start */}
                {this.state.switchServiceFlag ?
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.switchServiceMask}
                        onPress={() => {
                            this.setState({
                                switchServiceFlag: !this.state.switchServiceFlag,
                            })
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                        >
                            <View style={styles.switchServiceContent}>
                                <View style={styles.switchServiceTextBox}>
                                    <Text style={styles.switchServiceText}>确定要修改服务金额吗？</Text>
                                </View>
                                <View style={styles.switchServiceBtnBox}>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.setState({
                                                switchServiceFlag: !this.state.switchServiceFlag,
                                            })
                                        }}
                                        style={[styles.switchServiceClick, {
                                            borderRightColor: global.Colors.text999,
                                            borderRightWidth: global.Pixel,
                                        }]}
                                    >
                                        <Text style={[styles.switchServiceBtnText, { color: global.Colors.text666 }]}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.addGoods();
                                        }}
                                        style={styles.switchServiceClick}
                                    >
                                        <Text style={[styles.switchServiceBtnText, { color: global.Colors.color }]}>确认</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null}
                {/* 切换服务金额弹框 - end */}
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View>
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
    // 循环服务标签
    renderServiceLabel() {
        let tempArr = [];
        if (this.state.serviceLabelArr.length > 0) {
            for (let i = 0; i < this.state.serviceLabelArr.length; i++) {
                tempArr.push(
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.serviceBtn}
                        onPress={() => {
                            this.state.servicePicActive == this.state.serviceLabelArr[i].docketValue ?
                                null :
                                this.setState({
                                    servicePic: this.state.serviceLabelArr[i].docketValue,
                                    switchServiceFlag: !this.state.switchServiceFlag,
                                })
                        }}
                        key={i}
                    >
                        <View style={[styles.serviceItem, this.state.servicePicActive == this.state.serviceLabelArr[i].docketValue ? { backgroundColor: global.Colors.color } : null]}>
                            <Text style={[styles.servicePic, this.state.servicePicActive == this.state.serviceLabelArr[i].docketValue ? { color: global.Colors.textfff } : null]}>{this.state.serviceLabelArr[i].docketName}元</Text>
                            <Text style={[styles.serviceText, this.state.servicePicActive == this.state.serviceLabelArr[i].docketValue ? { color: global.Colors.textfff } : null]}>服务金额</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        }
        return tempArr;
    }
    // 修改服务标签
    addGoods() {
        this.setState({
            switchServiceFlag: false,
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("goodsPrice", this.state.servicePic);
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
                        servicePicActive: this.state.servicePic,// 当前医生的服务金额
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    // 导航部分 - start
    linearGradient: {
        width: global.SCREEN_WIDTH,
        height: global.px2dp(171),
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
    earningsContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    earningsBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    earningsValue: {
        fontSize: global.px2dp(26),
        color: global.Colors.textfff,
        lineHeight: global.px2dp(34),
    },
    earningsText: {
        fontSize: global.px2dp(13),
        color: global.Colors.textfff,
        lineHeight: global.px2dp(28),
    },
    earningsLien: {
        width: global.Pixel,
        height: global.px2dp(36),
        backgroundColor: global.Colors.textfff,
    },
    // 导航部分 - end
    content: {
        marginTop: global.px2dp(15),
        borderTopWidth: global.Pixel,
        borderBottomWidth: global.Pixel,
        borderColor: global.Colors.colorccc,
        backgroundColor: global.Colors.textfff,
    },
    itemBox: {
        height: global.px2dp(48),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    itemText: {
        flex: 1,
        marginLeft: global.px2dp(16),
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
    },

    // 服务金额
    serviceContent: {
        marginTop: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    serviceTopBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    serviceTitle: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        lineHeight: global.px2dp(36),
    },
    serviceManagementClick: {
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    serviceManagementText: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        lineHeight: global.px2dp(36),
    },
    serviceBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: global.px2dp(20),
    },
    serviceItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: global.px2dp(77),
        height: global.px2dp(42),
        borderColor: global.Colors.color,
        borderWidth: global.Pixel,
        marginTop: global.px2dp(10),
        marginRight: global.px2dp(8),
        borderRadius: global.px2dp(3),
    },
    servicePic: {
        fontSize: global.px2dp(16),
        color: global.Colors.color,
    },
    serviceText: {
        fontSize: global.px2dp(9),
        color: global.Colors.text6492c8,
    },
    // 服务金额确认弹框
    switchServiceMask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: global.SCREEN_WIDTH,
        height: global.SCREEN_HEIGHT,
        backgroundColor: 'rgba(0,0,0,.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchServiceContent: {
        width: global.px2dp(285),
        height: global.px2dp(128),
        borderRadius: global.px2dp(4),
        backgroundColor: global.Colors.textfff,
        justifyContent: 'space-between',
    },
    switchServiceTextBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        paddingLeft: global.px2dp(30),
        paddingRight: global.px2dp(30),
        borderBottomColor: global.Colors.text999,
        borderBottomWidth: global.Pixel,
    },
    switchServiceText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    switchServiceBtnBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: global.px2dp(45),
    },
    switchServiceClick: {
        flex: 1,
        height: global.px2dp(45),
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchServiceBtnText: {
        fontSize: global.px2dp(17),
    },
});

