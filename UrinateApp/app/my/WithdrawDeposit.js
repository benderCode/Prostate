import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Animated, Easing, Keyboard, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import Button from "../common/Button";// 按钮组件
import ErrorPrompt from "../common/ErrorPrompt";
import Nav from "../common/Nav";// 导航组件
import { Storage } from '../utils/AsyncStorage';
import { BoxShadow } from "react-native-shadow";
export default class WithdrawDeposit extends Component {
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
            pic: '',// 打算提现的额度
            errorFlag: false,// 超出提示文字

            weChatAccountInfo: {},// 微信账户信息
            payPass: '',// 支付密码
            payPassFlag: false, // 输入密码模块
            payPassBoxBottom: new Animated.Value(-300),
            keyFlag: false, // 键盘状态
            keyHeight: 0,
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '加载中...',
            ErrorPromptImg: require('../images/loading.png'),
        });
        // 查钱包余额
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
        // 查询是否绑有账号 - start
        fetch(requestUrl.getWeChatAccount, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.setState({
                        accountFlag: true,
                        weChatAccountInfo: responseData.result,
                    })
                } else if (responseData.code == 40004) {
                    this.setState({
                        accountFlag: false,
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
        // 查询是否绑有账号 - end
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow(e) {
        _scrollView.scrollToEnd({
            animated: true
        });
        this.setState({
            keyFlag: true,
            keyHeight: Math.ceil(e.endCoordinates.height),
        })
    }

    _keyboardDidHide(e) {
        this.setState({
            payPassFlag: false,
            keyFlag: false,
            keyHeight: 0,
        })
    }
    render() {
        const shadowOpt = {
            width: global.px2dp(345),
            height: global.px2dp(71),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .2,
            x: 0,
            y: 0,
            style: styles.boxShadow,
        }
        const withdrawalShadowOpt = {
            width: global.px2dp(345),
            height: global.px2dp(171),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .2,
            x: 0,
            y: 0,
            style: styles.boxShadow,
        }
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Nav isLoading={this.state.isLoading} title={"提现"} leftClick={this.goBack.bind(this)} />
                <ScrollView
                    ref={(scrollView) => {
                        _scrollView = scrollView;
                    }}
                    style={styles.scrollView}>
                    <BoxShadow
                        setting={shadowOpt}>
                        {this.state.accountFlag ?
                            <View style={styles.accountContent}>
                                <Image source={require('../images/wechat.png')} />
                                <Text style={styles.accountText}>微信账户</Text>
                                <Image source={require('../images/arrow_right_grey.png')} />
                            </View>
                            :
                            <View style={styles.accountContent}>
                                <Text style={styles.accountText}>您还没有添加提现账户</Text>
                            </View>
                        }
                    </BoxShadow>
                    <BoxShadow
                        setting={withdrawalShadowOpt}>
                        <View style={styles.withdrawalContent}>
                            <View style={[styles.topBox]}>
                                <Text style={styles.balance}>全部余额<Text>{this.state.balance}</Text>元</Text>
                                <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() => {
                                        this.setState({
                                            pic: this.state.balance,
                                        })
                                    }}
                                    style={styles.allBtn}
                                >
                                    <Text style={styles.allText}>全部提现</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.centerBox]}>
                                <Text style={styles.amountTitle}>提现金额</Text>
                                <View style={styles.amountBox}>
                                    <Text style={{ fontSize: global.px2dp(28), color: global.Colors.text333 }}>￥</Text>
                                    <TextInput
                                        style={styles.amountInput}
                                        placeholder={'可提现金额' + this.state.balance}
                                        placeholderTextColor={global.Colors.placeholder}
                                        onChangeText={(text) => this.setState({ pic: text })}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                        defaultValue={this.state.pic}
                                        onFocus={this.picFocus.bind(this)}
                                        onBlur={this.picBlur.bind(this)}
                                        maxLength={11}
                                    />
                                </View>
                            </View>
                            <View style={[styles.bottomBox]}>
                                {this.state.errorFlag ?
                                    <Text style={styles.errorText}>金额超出可提现余额</Text> : <Text></Text>}
                                <Text style={styles.remindText}>预计两个小时到账</Text>
                            </View>
                        </View>
                    </BoxShadow>

                    <View style={styles.btnBox}>
                        <Button style={{ borderRadius: global.px2dp(3) }} text={'确认提现'} click={this.submit.bind(this)} />
                    </View>
                </ScrollView>
                {/* 输入支付密码-start */}
                {this.state.payPassFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ payPassFlag: false, payPass: '' })
                        }}
                        activeOpacity={1}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: global.SCREEN_WIDTH,
                            height: global.SCREEN_HEIGHT,
                            backgroundColor: 'rgba(0,0,0,.4)',
                        }}
                    >
                        <Animated.View style={[styles.writeBox, { bottom: this.state.payPassBoxBottom }]}>
                            <TouchableOpacity
                                onPress={() => {
                                }}
                                activeOpacity={1}
                                style={{ flex: 1 }}
                            >
                                <View style={styles.writeTitleBox}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                payPassFlag: false,
                                            })
                                        }}
                                        activeOpacity={.8}
                                        style={styles.cancelClick}
                                    >
                                        <View style={styles.cancelBox}>
                                            <Text style={styles.cancelText}>取消</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.writeTitle}>请输入支付密码</Text>
                                </View>
                                <View style={styles.payPassContent}>
                                    <TextInput
                                        style={styles.payPass}
                                        placeholderTextColor={'#c7c7cd'}
                                        defaultValue={this.state.payPass.substr(0, 1)}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={1}
                                        caretHidden={true}
                                    >
                                    </TextInput>
                                    <TextInput
                                        style={styles.payPass}
                                        placeholderTextColor={'#c7c7cd'}
                                        defaultValue={this.state.payPass.substr(1, 1)}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={1}
                                        caretHidden={true}
                                    >
                                    </TextInput>
                                    <TextInput
                                        style={styles.payPass}
                                        placeholderTextColor={'#c7c7cd'}
                                        defaultValue={this.state.payPass.substr(2, 1)}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={1}
                                        caretHidden={true}
                                    >
                                    </TextInput>
                                    <TextInput
                                        style={styles.payPass}
                                        placeholderTextColor={'#c7c7cd'}
                                        defaultValue={this.state.payPass.substr(3, 1)}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={1}
                                        caretHidden={true}
                                    >
                                    </TextInput>
                                    <TextInput
                                        style={styles.payPass}
                                        placeholderTextColor={'#c7c7cd'}
                                        defaultValue={this.state.payPass.substr(4, 1)}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={1}
                                        caretHidden={true}
                                    >
                                    </TextInput>
                                    <TextInput
                                        style={styles.payPass}
                                        placeholderTextColor={'#c7c7cd'}
                                        defaultValue={this.state.payPass.substr(5, 1)}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={1}
                                        caretHidden={true}
                                    >
                                    </TextInput>
                                    <TextInput
                                        style={styles.payTextInput}
                                        placeholderTextColor={'#c7c7cd'}
                                        onChangeText={(text) => {
                                            let payText = text.replace(/[^\d]/g, "");
                                            this.setState({
                                                payPass: payText,
                                            });
                                            if (payText.length >= 6) {
                                                this.checkPay(payText);
                                            }
                                        }}
                                        autoFocus={true}
                                        defaultValue={this.state.payPass}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={6}
                                        caretHidden={true}
                                        keyboardType={'numeric'}
                                        onLongPress={() => {
                                            return false;
                                        }}
                                    >
                                    </TextInput>
                                </View>
                                <View style={{ height: global.IOS ? this.state.keyHeight + 50 : 0 }}></View>
                            </TouchableOpacity>
                        </Animated.View>
                    </TouchableOpacity>
                    : null}
                {/* 输入支付密码-end */}
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View >
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
    // 金额输入框获取焦点
    picFocus() {
        this.setState({
            errorFlag: false,
        })
    }
    // 金额输入框失去焦点
    picBlur() {
        if (!this.state.pic) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入提现金额',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!Number(this.state.pic)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '输入内容不合法',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (Number(this.state.pic) > Number(this.state.balance)) {
            this.setState({
                errorFlag: true,
            })
        } else if (this.state.pic.indexOf('.') != -1 && this.state.pic.split('.')[1].length > 2) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '精确到小数点后2位',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        }
    }
    // 提交调出输入支付密码框
    submit() {
        if (!this.state.accountFlag) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请先去添加提现账户',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!this.state.pic) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入提现金额',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!Number(this.state.pic)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '输入内容不合法',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (this.state.pic.indexOf('.') != -1 && this.state.pic.split('.')[1].length > 2) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '精确到小数点后2位',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (Number(this.state.pic) > Number(this.state.balance)) {
            this.setState({
                errorFlag: true,
            })
        } else {
            this.setState({
                payPass: '',// 支付密码
                payPassFlag: true,
            })
            Animated.timing(this.state.payPassBoxBottom, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,// 线性的渐变函数
            }).start();
        }
    }
    // 检验支付密码是否正确
    checkPay(payText) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("paymentPassword", payText);
        fetch(requestUrl.checkPay, {
            method: 'POST',
            headers: {

                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.payment();
                } else if (responseData.code == 40004) {
                    this.setState({
                        payPass: '',
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '提现密码不正确',
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
    // 提现支付方法
    payment() {
        let formData = new FormData();
        formData.append("accountId", this.state.weChatAccountInfo.id);//医生id
        formData.append("orderPrice", this.state.pic * 100);//提现金额
        fetch(requestUrl.addOrderCash, {
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
                        balance: (this.state.balance * 100 - this.state.pic * 100) / 100,
                        payPassFlag: false,
                        payPass: '',
                        pic: '',
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '提现成功',
                        ErrorPromptImg: require('../images/succeed.png'),
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
                        ErrorPromptText: '提现失败，请重试',
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    scrollView: {
        paddingTop: global.px2dp(8),
    },
    boxShadow: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginTop: global.px2dp(8),
        marginBottom: global.px2dp(8),
    },
    accountContent: {
        height: global.px2dp(71),
        backgroundColor: global.Colors.textfff,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: global.px2dp(3),
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    accountText: {
        flex: 1,
        alignItems: 'center',
        color: global.Colors.text333,
        marginLeft: global.px2dp(8),
        fontSize: global.px2dp(17),
    },
    btnBox: {
        marginTop: global.px2dp(27),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },

    withdrawalContent: {
        width: global.px2dp(345),
        height: global.px2dp(171),
        borderRadius: global.px2dp(3),
        backgroundColor: global.Colors.textfff,
        paddingLeft: global.px2dp(21),
        paddingRight: global.px2dp(30),
    },
    topBox: {
        height: global.px2dp(40),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    balance: {
        fontSize: global.px2dp(16),
        color: global.Colors.text666,
    },
    allText: {
        fontSize: global.px2dp(16),
        color: global.Colors.color,
        lineHeight: global.px2dp(40),
    },
    centerBox: {
        flex: 1,
        borderColor: global.Colors.text999,
        borderTopWidth: global.Pixel,
        borderBottomWidth: global.Pixel,
    },
    amountTitle: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        lineHeight: global.px2dp(43),
    },
    amountInput: {
        flex: 1,
        alignItems: 'center',
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
    },
    bottomBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: global.px2dp(40),
    },
    amountBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    errorText: {
        fontSize: global.px2dp(13),
        color: global.Colors.colorff0000,
    },
    remindText: {
        fontSize: global.px2dp(13),
        color: global.Colors.text666,
    },

    // 输入密码
    writeBox: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: global.SCREEN_WIDTH,
        backgroundColor: '#f5f5f5',
    },

    writeTitleBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: global.px2dp(50),
        borderBottomWidth: global.Pixel,
        borderColor: '#bdbdbd',
    },
    writeTitle: {
        fontSize: global.px2dp(16),
        color: '#212121',
    },
    cancelClick: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cancelBox: {
        justifyContent: 'center',
        height: global.px2dp(50),
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    cancelText: {
        fontSize: global.px2dp(14),
        color: '#212121',
    },

    // 密码输入框
    payPassContent: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginTop: global.px2dp(25),
        flexDirection: 'row',
        height: global.px2dp(55),
        borderWidth: global.Pixel,
        borderColor: '#dbdbdb',
        borderRadius: global.px2dp(5),
        overflow: 'hidden',
    },
    payTextInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: global.px2dp(55),
        width: global.SCREEN_WIDTH - global.px2dp(30),
        backgroundColor: 'transparent',
        color: 'transparent',
    },
    payPass: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#dbdbdb',
        textAlign: 'center',
        fontSize: global.px2dp(20),
        backgroundColor: '#FFF',
    },
});

