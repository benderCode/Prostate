import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, StatusBar, TextInput } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import Button from "../common/Button";// 按钮组件
import ErrorPrompt from "../common/ErrorPrompt";// 错误格式提示
import { Storage } from "../utils/AsyncStorage";
import CountDownButton from 'react-native-smscode-count-down';// 倒计时
import { StackActions, NavigationActions } from 'react-navigation';
export default class SignCodeIn extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,// 加载层
            TimingFlag: false,// 是否在倒计时
            TimingText: "获取验证码",// 获取验证码文字

            ErrorPrompt: true,// 提示是否显示
            ErrorText: '',// 提示文字
            ErrorImg: '',// 提示图片

            doctorPhoneFocus: false,// 账号焦点
            smsCodeFocus: false,// 校验码焦点

            phoneReg: true,// 手机号是否符合规则
            smsCodeReg: true,// 验证码是否符合规则

            doctorPhone: '',// 登录账号
            smsCode: '',// 校验码
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
        const { navigate, goBack } = this.props.navigation;
        return (
            <KeyboardAvoidingView
                behavior={global.IOS ? "padding" : null}
                style={{ flex: 1 }}
            >
                <ScrollView
                    keyboardShouldPersistTaps={'handled'}
                    style={styles.container}
                >
                    <StatusBar
                        animated={true}//是否动画
                        hidden={false}//是否隐藏
                        backgroundColor={'#000'}//android 设置状态栏背景颜色
                        translucent={false}//android 设置状态栏是否为透明
                        showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                        networkActivityIndicatorVisible={this.state.isLoading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                        statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                    />
                    {/* logo */}
                    <View style={styles.logoContent}>
                        <Image
                            style={styles.logoImg}
                            source={require('../images/logo.png')}
                        />
                    </View>
                    <View style={styles.loginContent}>
                        <Image
                            style={styles.textLogo}
                            source={require('../images/textLogo.png')}
                        />
                        {/* 单纯输入框 */}
                        <View style={[styles.inputItem, this.state.doctorPhoneFocus ? styles.doctorPhoneItemFocus : null, this.state.phoneReg ? null : styles.errorStyle]}>
                            {this.state.doctorPhoneFocus ? <Text style={styles.inputTitle}>手机号</Text> : null}
                            <View style={styles.inputBox}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={'请输入手机号'}
                                    placeholderTextColor={global.Colors.placeholder}
                                    onChangeText={(text) => this.setState({ doctorPhone: text })}
                                    defaultValue={this.state.doctorPhone}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'numeric'}
                                    onFocus={this.doctorPhoneFocus.bind(this)}
                                    onBlur={this.doctorPhoneBlur.bind(this)}
                                    maxLength={11}
                                />
                                {this.state.doctorPhoneFocus ? <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() =>
                                        this.setState({
                                            doctorPhone: '',
                                        })
                                    }
                                    style={styles.clearBtn}
                                >
                                    <Image
                                        style={styles.clearImg}
                                        source={require('../images/clear.png')}
                                    />
                                </TouchableOpacity> : null}
                            </View>
                        </View>
                        {/* 验证码输入 */}
                        <View style={[styles.inputItem, styles.passwordItem, this.state.smsCodeFocus ? styles.smsCodeFocus : null, this.state.smsCodeReg ? null : styles.errorStyle]}>
                            {this.state.smsCodeFocus ? <Text style={styles.inputTitle}>校验码</Text> : null}
                            <View style={styles.passwordBox}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={'请输入校验码'}
                                    placeholderTextColor={global.Colors.placeholder}
                                    onChangeText={(text) => this.setState({ smsCode: text })}
                                    defaultValue={this.state.smsCode}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'numeric'}
                                    secureTextEntry={this.state.isEyes ? true : false}
                                    maxLength={6}
                                    onFocus={this.smsCodeFocus.bind(this)}
                                    onBlur={this.smsCodeBlur.bind(this)}
                                />
                                <View style={styles.passwordBox}>
                                    {this.state.smsCodeFocus ? <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() =>
                                            this.setState({
                                                smsCode: '',
                                            })
                                        }
                                        style={styles.eyesBtn}
                                    >
                                        <Image
                                            style={styles.eyeImg}
                                            source={require('../images/clear.png')}
                                        />
                                    </TouchableOpacity> : null}
                                    <View style={styles.isolationLine}></View>
                                    <CountDownButton
                                        style={{
                                            // paddingRight: global.px2dp(10),
                                            // paddingLeft: global.px2dp(10),
                                        }}
                                        textStyle={{
                                            fontSize: global.px2dp(15),
                                            color: global.Colors.color,
                                        }}
                                        timerCount={120}
                                        timerTitle={this.state.TimingText}
                                        enable={true}
                                        onClick={(shouldStartCounting) => {
                                            if (!this.state.doctorPhone) {
                                                this.setState({
                                                    ErrorPrompt: false,
                                                    phoneReg: false,
                                                    ErrorText: '请输入手机号',
                                                    ErrorImg: require('../images/error.png')
                                                })
                                                clearTimeout(this.timer);
                                                this.timer = setTimeout(() => {
                                                    this.setState({
                                                        ErrorPrompt: true,
                                                    })
                                                }, global.TimingCount)
                                                shouldStartCounting(false);
                                            } else if (!regExp.Reg_TelNo.test(this.state.doctorPhone)) {
                                                this.setState({
                                                    ErrorPrompt: false,
                                                    phoneReg: false,
                                                    ErrorText: '手机号码格式不正确',
                                                    ErrorImg: require('../images/error.png')
                                                })
                                                clearTimeout(this.timer);
                                                this.timer = setTimeout(() => {
                                                    this.setState({
                                                        ErrorPrompt: true,
                                                    })
                                                }, global.TimingCount)
                                                shouldStartCounting(false);
                                            } else {
                                                this.getLoginSms();
                                                shouldStartCounting(true);
                                            }
                                        }}
                                        timerEnd={() => {
                                            this.setState({
                                                TimingText: '重新获取'
                                            })
                                        }} />
                                </View>
                            </View>
                        </View>
                        {/* 登录按钮 */}
                        <View style={styles.btnBox}>
                            <Button text="登录" click={this.signCodeIn.bind(this)} />
                        </View>
                        {/* 跳转链接 密码登录 新用户注册 */}
                        <View style={styles.hrefContent}>
                            <TouchableOpacity
                                onPress={() => navigate("SignIn")}
                                style={styles.hrefItem}
                            >
                                <Text style={styles.hrefText}>密码登录</Text>
                            </TouchableOpacity>
                            <View style={styles.isolationLine}>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigate("SignUp")}
                                style={styles.hrefItem}
                            >
                                <Text style={styles.hrefText}>新用户注册</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {this.state.ErrorPrompt ? null : <ErrorPrompt text={this.state.ErrorText} imgUrl={this.state.ErrorImg} />}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
    // 账号焦点事件
    doctorPhoneFocus() {
        this.setState({
            doctorPhoneFocus: true,
            phoneReg: true,
        })
    }
    // 账号失去焦点
    doctorPhoneBlur() {
        this.setState({
            doctorPhoneFocus: false,
        })
        if (!this.state.doctorPhone) {
            this.setState({
                phoneReg: false,
                ErrorPrompt: false,
                ErrorText: '请输入手机号',
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_TelNo.test(this.state.doctorPhone)) {
            this.setState({
                phoneReg: false,
                ErrorPrompt: false,
                ErrorText: '手机号码格式不正确',
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else {
            this.setState({
                phoneReg: true,
            })
        }
    }
    // 校验码获得焦点事件
    smsCodeFocus() {
        this.setState({
            smsCodeFocus: true,
            smsCodeReg: true,
        })
    }
    // 校验码失去焦点事件
    smsCodeBlur() {
        this.setState({
            smsCodeFocus: false,
        })
        if (!this.state.smsCode) {
            this.setState({
                smsCodeReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
                ErrorText: '请输入验证码',
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.smsCode)) {
            this.setState({
                smsCodeReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
                ErrorText: '验证码格式错误'
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else {
            this.setState({
                smsCodeReg: true,
            })
        }
    }
    // 获取校验码
    getLoginSms() {
        if (!this.state.doctorPhone) {
            this.setState({
                ErrorPrompt: false,
                phoneReg: false,
                ErrorImg: require('../images/error.png'),
                ErrorText: '请输入手机号',
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_TelNo.test(this.state.doctorPhone)) {
            this.setState({
                ErrorPrompt: false,
                phoneReg: false,
                ErrorImg: require('../images/error.png'),
                ErrorText: '手机号码格式不正确',
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else {
            this.setState({
                phoneReg: true,
                isLoading: true,
                ErrorPrompt: false,
                ErrorImg: require('../images/loading.png'),
                ErrorText: '正在获取验证码...',
            })
            fetch(requestUrl.loginSms + '?loginPhone=' + this.state.doctorPhone, {
                method: 'GET',
                headers: {

                },
            })
                .then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20005) {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            phoneReg: false,
                            ErrorText: '该手机号还未注册',
                            ErrorImg: require('../images/error.png')
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                        }, global.TimingCount)
                    } else if (responseData.code == 20000) {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            ErrorText: '验证码发送成功',
                            ErrorImg: require('../images/succeed.png')
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                        }, global.TimingCount)
                    } else {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            phoneReg: false,
                            ErrorText: '验证码发送失败',
                            ErrorImg: require('../images/error.png')
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                        }, global.TimingCount)
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                });
        }
    }

    // 校验码登录事件
    signCodeIn() {
        if (!this.state.doctorPhone) {
            this.setState({
                ErrorPrompt: false,
                ErrorText: '请输入手机号',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_TelNo.test(this.state.doctorPhone)) {
            this.setState({
                ErrorPrompt: false,
                phoneReg: false,
                ErrorText: '手机号码格式不正确',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!this.state.smsCode) {
            this.setState({
                ErrorPrompt: false,
                ErrorText: '请输入验证码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.smsCode)) {
            this.setState({
                ErrorPrompt: false,
                ErrorText: '验证码格式不正确',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else {
            this.setState({
                isLoading: true,
                ErrorPrompt: false,
                ErrorText: '登录中...',
                ErrorImg: require('../images/loading.png')
            })
            let formData = new FormData();
            formData.append("doctorPhone", this.state.doctorPhone);
            formData.append("smsCode", this.state.smsCode);
            fetch(requestUrl.smsLogin, {
                method: 'POST',
                headers: {

                },
                body: formData,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            ErrorText: '登录成功',
                            ErrorImg: require('../images/succeed.png')
                        })
                        Storage.setItem("token", responseData.result);
                        global.Token = responseData.result;
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'Home' })],
                            });
                            this.props.navigation.dispatch(resetAction);
                        }, global.TimingCount)
                    } else if (responseData.code == 50006) {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            smsCodeReg: false,
                            ErrorText: '验证码错误',
                            ErrorImg: require('../images/error.png')
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                        }, global.TimingCount)
                    } else {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            ErrorText: '登录失败',
                            ErrorImg: require('../images/error.png')
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                        }, global.TimingCount)
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: global.TabBar,
    },
    // logo
    logoContent: {
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: global.px2dp(30),
        paddingTop: global.px2dp(55) + global.StatusBarHeight,
        backgroundColor: global.Colors.bgColor,
    },
    logoImg: {
        width: global.px2dp(264),
        height: global.px2dp(122),
    },
    // 登录主体内容
    loginContent: {
        paddingLeft: global.px2dp(24),
        paddingRight: global.px2dp(24),
    },
    // 文字logo
    textLogo: {
        width: global.px2dp(131),
        height: global.px2dp(31),
        marginTop: global.px2dp(36),
        marginBottom: global.px2dp(36),
    },
    // 登录按钮
    btnBox: {
        marginBottom: global.px2dp(22),
        marginTop: global.px2dp(36),
    },
    // 链接跳转
    hrefContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hrefItem: {
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    hrefText: {
        fontSize: global.px2dp(15),
        color: global.Colors.text777,
    },
    // 隔离|线
    isolationLine: {
        width: global.Pixel,
        height: global.px2dp(15),
        backgroundColor: global.Colors.text999,
    },
    // 纯输入框
    inputItem: {
        borderBottomWidth: global.Pixel,
        borderBottomColor: global.Colors.colorccc,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // 账号输入框
    textInput: {
        flex: 1,
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        height: global.px2dp(42),
        fontWeight: "500",
    },
    inputTitle: {
        paddingTop: global.px2dp(5),
        fontSize: global.px2dp(14),
        color: global.Colors.text999,
    },
    clearBtn: {
        paddingLeft: global.px2dp(10),
        paddingRight: global.px2dp(10),
    },
    // 密码box
    passwordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // 密码右侧box
    passwordBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // 眼睛按钮
    eyesBtn: {
        paddingRight: global.px2dp(14),
        paddingLeft: global.px2dp(14),
    },
    // 忘记密码按钮
    forgetBtn: {
        paddingRight: global.px2dp(10),
        paddingLeft: global.px2dp(10),
    },
    // 忘记密码文字
    forgetText: {
        fontSize: global.px2dp(15),
        color: global.Colors.color,
    },

    // 账号输入焦点样式
    doctorPhoneItemFocus: {
        flexDirection: 'column',
        borderBottomColor: global.Colors.color3b7dc8,
    },
    // 校验码焦点样式
    smsCodeFocus: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomColor: global.Colors.color3b7dc8,
    },
    // 错误样式
    errorStyle: {
        borderBottomColor: global.Colors.colorff0000,
    }
});

