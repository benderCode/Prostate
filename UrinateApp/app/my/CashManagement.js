import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, Easing, Keyboard, TextInput, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import ErrorPrompt from "../common/ErrorPrompt";
import Nav from "../common/Nav";// 导航组件
import { BoxShadow } from "react-native-shadow";
import * as wechat from 'react-native-wechat';
export default class CashManagement extends Component {
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


            maskFlag: false,

            payFlag: false,// 是否有支付密码
            accountFlag: false,// 是否有绑账户
            weChatAccountInfo: {},// 微信账号信息
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
    componentDidMount() {
        wechat.registerApp('wxaeaf9ecd369f0592');
        // 查询是否有提现密码 - start
        fetch(requestUrl.isExist, {
            method: 'GET',
            headers: {
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.setState({
                        payFlag: responseData.result,
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
        // 查询是否有提现密码 - end
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

    }
    render() {
        const addAccountShadowOpt = {
            width: global.px2dp(345),
            height: global.px2dp(42),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .1,
            x: 0,
            y: 0,
            style: styles.boxShadow,
        }
        const shadowOpt = {
            width: global.px2dp(345),
            height: global.px2dp(75),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .1,
            x: 0,
            y: 0,
            style: styles.boxShadow,
        }
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Nav isLoading={this.state.isLoading} title={"提现管理"} leftClick={this.goBack.bind(this)} />
                <ScrollView
                    ref={(scrollView) => {
                        _scrollView = scrollView;
                    }}
                >
                    {this.state.payFlag ?
                        <View style={styles.content}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate("UpdatePayPassword");
                                }}
                                activeOpacity={.8}
                                style={[styles.itemBtn, {
                                    borderBottomColor: global.Colors.text999, borderBottomWidth: global.Pixel
                                }]}
                            >
                                <Image source={require('../images/change_password.png')} />
                                <Text style={styles.itemText}>修改提现密码</Text>
                                <Image source={require('../images/arrow_right_grey.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigate("ForgetPayPassword");
                                }}
                                activeOpacity={.8}
                                style={styles.itemBtn}
                            >
                                <Image source={require('../images/forget_password.png')} />
                                <Text style={styles.itemText}>忘记提现密码</Text>
                                <Image source={require('../images/arrow_right_grey.png')} />
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.content}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        payPassFlag: true,
                                    })
                                    Animated.timing(this.state.payPassBoxBottom, {
                                        toValue: 0,
                                        duration: 300,
                                        easing: Easing.linear,// 线性的渐变函数
                                    }).start();
                                }}
                                activeOpacity={.8}
                                style={styles.itemBtn}
                            >
                                <Image source={require('../images/set_pay.png')} />
                                <Text style={styles.itemText}>设置提现密码</Text>
                                <Image source={require('../images/arrow_right_grey.png')} />
                            </TouchableOpacity>
                        </View>
                    }
                    <Text style={styles.accountTitle}>账户管理</Text>
                    {this.state.accountFlag ?
                        <BoxShadow
                            setting={shadowOpt}>
                            <View style={styles.accountContent}>
                                <Image style={styles.weChatImg} source={require('../images/wechat.png')} />
                                <Text style={styles.accountType}>微信账户</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            maskFlag: !this.state.maskFlag,
                                        })
                                    }}
                                    activeOpacity={.8}
                                    style={styles.bindBtn}
                                >
                                    <View style={styles.bindBox}>
                                        <Text style={styles.bindText}>删除</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </BoxShadow>
                        :
                        <View>
                            <Text style={styles.addAccountHint}>暂无账号绑定请点击“添加微信账户”</Text>
                            <BoxShadow
                                setting={addAccountShadowOpt}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.addWeChat();
                                    }}
                                    activeOpacity={.8}
                                    style={styles.addAccountBtn}
                                >
                                    <View style={styles.addAccountBox}>
                                        <Image style={styles.addAccountImg} source={require('../images/add_account.png')} />
                                        <Text style={styles.addAccountText}>添加微信账户</Text>
                                    </View>
                                </TouchableOpacity>
                            </BoxShadow>
                        </View>
                    }
                    <Text style={styles.accountHint}>目前只支持微信账户绑定，给您带来不便请谅解</Text>
                </ScrollView>
                {/* 删除账户-start */}
                {this.state.maskFlag ?
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
                                    <Text style={styles.affirmText}>确定删除此次账户？</Text>
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
                                        <Text style={styles.noBtn}>否</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.deleteWeChat();
                                        }}
                                        style={styles.btnClick}
                                    >
                                        <Text style={styles.yesBtn}>是</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null}
                {/* 删除账户-end */}
                {/* 设置支付密码-start */}
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
                                    <Text style={styles.writeTitle}>请设置支付密码</Text>
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
                                                this.setPay(payText);
                                            }
                                        }}
                                        autoFocus={true}
                                        defaultValue={this.state.payPass}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        maxLength={6}
                                        caretHidden={true}
                                        keyboardType={'numeric'}
                                    // onLongPress={() => {
                                    //     return false;
                                    // }}
                                    >
                                    </TextInput>
                                </View>
                                <View style={{ height: global.IOS ? this.state.keyHeight + 50 : 0 }}></View>
                            </TouchableOpacity>
                        </Animated.View>
                    </TouchableOpacity>
                    : null}
                {/* 设置支付密码-end */}
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View>
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
    // 设置支付密码
    setPay(text) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("paymentPassword", text);
        fetch(requestUrl.savePay, {
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
                        payFlag: true,
                        payPass: '',
                        payPassFlag: false,
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '设置成功',
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
                        payPass: '',
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '设置失败，请重试',
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
    // 添加账户
    addWeChat = () => {
        wechat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                let scope = 'snsapi_userinfo';
                let state = 'wechat_sdk_demo';
                wechat.sendAuthRequest(scope, state)
                    .then(responseCode => {
                        if (responseCode.errCode == 0) {
                            this.setState({
                                isLoading: true,
                                ErrorPromptFlag: true,
                                ErrorPromptText: '授权中...',
                                ErrorPromptImg: require('../images/loading.png'),
                            });
                            fetch("https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxaeaf9ecd369f0592&secret=65131551996b322bd12bde7140b06ecd&code=" + responseCode.code + "&grant_type=authorization_code", {
                                method: 'GET',
                            }).then((response) => response.json()).then((responseData) => {
                                console.log('responseData', responseData);
                                // 获取微信个人信息
                                fetch("https://api.weixin.qq.com/sns/userinfo?access_token=" + responseData.access_token + "&openid=" + responseData.openid, {
                                    method: 'GET',
                                }).then((response) => response.json()).then((responseData) => {
                                    console.log('responseData', responseData);
                                    this.appAdd(JSON.stringify(responseData))
                                }).catch((error) => {
                                    console.log('error', error);
                                });
                            }).catch((error) => {
                                console.log('error', error);
                            });
                        }
                    })
                    .catch(err => {
                        this.setState({
                            isLoading: true,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '授权失败',
                            ErrorPromptImg: require('../images/error.png'),
                        })
                        clearTimeout(this.timer)
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPromptFlag: false,
                            })
                        }, global.TimingCount)
                    })
            } else {
                // 未安装微信
                global.Alert.alert("", '没有安装微信，请您安装微信之后再试');
            }
        });
    }
    // 发 用户信息 到后台
    appAdd(jsonStr) {
        let formData = new FormData();
        formData.append("jsonStr", jsonStr);
        fetch(requestUrl.appAdd, {
            method: 'POST',
            headers: {

                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json()).then((responseData) => {
            console.log('responseData', responseData);
            if (responseData.code == 20000) {
                // 添加账户
                this.addWeChatAccount(responseData.result.openid);
            } else {
                this.setState({
                    isLoading: false,
                    ErrorPromptFlag: true,
                    ErrorPromptText: '绑定失败，请重试',
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
    }
    // 添加账户
    addWeChatAccount(openid) {
        let formData = new FormData();
        formData.append("accountNumber", openid);
        fetch(requestUrl.addWeChatAccount, {
            method: 'POST',
            headers: {

                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json()).then((responseData) => {
            console.log('responseData', responseData);
            if (responseData.code == 20000) {
                let tempJson = this.state.weChatAccountInfo;
                tempJson["id"] = responseData.result;
                this.setState({
                    weChatAccountInfo: tempJson,
                    accountFlag: true,
                    isLoading: false,
                    ErrorPromptFlag: true,
                    ErrorPromptText: '绑定成功',
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
                    ErrorPromptText: '绑定失败，请重试',
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
    }
    // 删除账户
    deleteWeChat() {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("id", this.state.weChatAccountInfo.id);
        fetch(requestUrl.deleteWeChatAccount, {
            method: 'POST',
            headers: {

                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                this.setState({
                    maskFlag: false,
                })
                if (responseData.code == 20000) {
                    this.setState({
                        accountFlag: false,
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '删除成功',
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
                        ErrorPromptText: '删除失败，请重试',
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
        position: 'relative',
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    content: {
        backgroundColor: global.Colors.textfff,
        marginTop: global.px2dp(15),
        paddingLeft: global.px2dp(15),
    },
    itemBtn: {
        height: global.px2dp(46),
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: global.px2dp(15),
    },
    itemText: {
        flex: 1,
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        marginLeft: global.px2dp(15),
    },
    // 添加账号
    boxShadow: {
        marginTop: global.px2dp(8),
        marginBottom: global.px2dp(8),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    addAccountHint: {
        fontSize: global.px2dp(15),
        color: global.Colors.text333,
        lineHeight: global.px2dp(37),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginBottom: global.px2dp(8),
    },
    addAccountBox: {
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(3),
        height: global.px2dp(42),
        flexDirection: 'row',
        alignItems: 'center',
    },
    addAccountImg: {
        marginLeft: global.px2dp(19),
        marginRight: global.px2dp(10),
    },
    addAccountText: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
    },
    // 账号管理title
    accountTitle: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        lineHeight: global.px2dp(45),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    // 账号展示
    accountContent: {
        height: global.px2dp(75),
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(3),
        flexDirection: 'row',
        alignItems: 'center',
    },
    weChatImg: {
        marginLeft: global.px2dp(17),
        marginRight: global.px2dp(16),
    },
    accountType: {
        flex: 1,
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        marginRight: global.px2dp(11),
    },
    bindBox: {
        marginRight: global.px2dp(10),
        marginLeft: global.px2dp(10),
        width: global.px2dp(71),
        height: global.px2dp(30),
        borderWidth: global.Pixel,
        borderColor: global.Colors.colorff0000,
        borderRadius: global.px2dp(3),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bindText: {
        fontSize: global.px2dp(14),
        color: global.Colors.colorff0000,
    },
    // 账号支持类型提示
    accountHint: {
        fontSize: global.px2dp(12),
        color: global.Colors.text999,
        lineHeight: global.px2dp(16),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
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
        height: global.px2dp(44),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.text999,
    },
    btnClick: {
        flex: 1,
        height: global.px2dp(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    noBtn: {
        fontSize: global.px2dp(17),
        color: global.Colors.text666,
    },
    yesBtn: {
        fontSize: global.px2dp(17),
        color: global.Colors.color,
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

