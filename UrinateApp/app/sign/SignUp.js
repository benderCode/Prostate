import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { global } from "../utils/Global";
import { regExp } from "../netWork/RegExp";
import { requestUrl } from "../netWork/Url";
import Button from "../common/Button";// 按钮
import ErrorPrompt from "../common/ErrorPrompt";
import CountDownButton from 'react-native-smscode-count-down';// 倒计时

export default class SignUp extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,// 状态栏加载图标
            ErrorPrompt: true,// 提示是否显示
            ErrorText: "",// 提示文字
            ErrorImg: '',// 提示图片
            TimingFlag: false,// 是否在倒计时
            TimingText: "获取验证码",// 获取验证码文字

            phoneReg: true,// 手机号校验
            smsCodeReg: true,// 验证码校验
            doctorPasswordReg: true,// 密码校验
            confirmPasswordReg: true,// 确认密码校验

            doctorPhoneFocus: false,// 手机号焦点
            smsCodeFocus: false,// 验证码焦点
            doctorPasswordFocus: false,// 密码焦点
            confirmPasswordFocus: false,// 确认密码焦点

            confirmPassword: '',// 确认密码
            doctorPhone: '',//手机号码
            doctorPassword: '',//6-18位数字英文字母组合
            smsCode: '',//短信验证码
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
                    {/* 后退按钮 */}
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.goBackBtn}
                        onPress={() => goBack()}>
                        <Image
                            style={styles.goBackImg}
                            source={require('../images/arrow_left_grey.png')}
                        />
                    </TouchableOpacity>
                    {/* 主要内容 */}
                    <View style={styles.content}>
                        {/* 文字logo */}
                        <Image
                            style={styles.textLogo}
                            source={require('../images/textLogo.png')}
                        />
                        {/* 手机号-start */}
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
                        {/* 手机号-end */}
                        {/* 验证码-start */}
                        <View style={[styles.inputItem, this.state.smsCodeFocus ? styles.doctorPhoneItemFocus : null, this.state.smsCodeReg ? null : styles.errorStyle]}>
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
                                        style={styles.clearBtn}
                                    >
                                        <Image
                                            style={styles.clearImg}
                                            source={require('../images/clear.png')}
                                        />
                                    </TouchableOpacity> : null}
                                    <View style={styles.isolationLine}></View>
                                    {/* <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() => { this.getRegisterSms() }}
                                    style={styles.forgetBtn}
                                >
                                    <Text style={styles.forgetText}>获取验证码</Text>
                                </TouchableOpacity> */}
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
                                                    ErrorText: '请输入手机号',
                                                    phoneReg: false,
                                                    ErrorPrompt: false,
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
                                                    ErrorText: '手机号码格式不正确',
                                                    phoneReg: false,
                                                    ErrorPrompt: false,
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
                                                this.getRegisterSms();
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
                        {/* 验证码-end */}
                        {/* 密码-start */}
                        <View style={[styles.inputItem, this.state.doctorPasswordFocus ? styles.doctorPhoneItemFocus : null, this.state.doctorPasswordReg ? null : styles.errorStyle]}>
                            {this.state.doctorPasswordFocus ? <Text style={styles.inputTitle}>密码</Text> : null}
                            <View style={styles.passwordBox}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={'请输入密码6-10字符（数字+字母）'}
                                    placeholderTextColor={global.Colors.placeholder}
                                    onChangeText={(text) => this.setState({ doctorPassword: text })}
                                    defaultValue={this.state.doctorPassword}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={true}
                                    keyboardType={'default'}
                                    onFocus={this.doctorPasswordFocus.bind(this)}
                                    onBlur={this.doctorPasswordBlur.bind(this)}
                                />
                                <View style={styles.passwordBox}>
                                    {this.state.doctorPasswordFocus ? <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() =>
                                            this.setState({
                                                doctorPassword: '',
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
                        </View>
                        {/* 密码-end */}
                        {/* 确认密码-start */}
                        <View style={[styles.inputItem, this.state.confirmPasswordFocus ? styles.doctorPhoneItemFocus : null, this.state.confirmPasswordReg ? null : styles.errorStyle]}>
                            {this.state.confirmPasswordFocus ? <Text style={styles.inputTitle}>密码</Text> : null}
                            <View style={styles.passwordBox}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={'请输入密码'}
                                    placeholderTextColor={global.Colors.placeholder}
                                    onChangeText={(text) => this.setState({ confirmPassword: text })}
                                    defaultValue={this.state.confirmPassword}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={true}
                                    keyboardType={'default'}
                                    onFocus={this.confirmPasswordFocus.bind(this)}
                                    onBlur={this.confirmPasswordBlur.bind(this)}
                                />
                                <View style={styles.passwordBox}>
                                    {this.state.confirmPasswordFocus ? <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() =>
                                            this.setState({
                                                confirmPassword: '',
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
                        </View>
                        {/* 确认密码-end */}

                        {/* 注册按钮盒子 */}
                        <View style={styles.btnBox}>
                            <Button text="注册" click={this.signUp.bind(this)} />
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
                ErrorText: '请输入手机号',
                phoneReg: false,
                ErrorPrompt: false,
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
                ErrorText: '手机号码格式不正确',
                phoneReg: false,
                ErrorPrompt: false,
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
    // 验证码获取焦点
    smsCodeFocus() {
        this.setState({
            smsCodeFocus: true,
            smsCodeReg: true,
        })
    }
    // 验证码失去焦点
    smsCodeBlur() {
        this.setState({
            smsCodeFocus: false,
        })
        if (!this.state.smsCode) {
            this.setState({
                ErrorText: '请输入验证码',
                smsCodeReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.smsCode)) {
            this.setState({
                ErrorText: '验证码格式不正确',
                smsCodeReg: false,
                ErrorPrompt: false,
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
                smsCodeReg: true,
            })
        }
    }
    // 密码焦点事件
    doctorPasswordFocus() {
        this.setState({
            doctorPasswordFocus: true,
            doctorPasswordReg: true,
        })
    }
    // 密码失去事件
    doctorPasswordBlur() {
        this.setState({
            doctorPasswordFocus: false,
        })
        if (!this.state.doctorPassword) {
            this.setState({
                ErrorText: '请输入密码',
                doctorPasswordReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.setState({
                ErrorText: '密码为6-10个字符（数字+字母）',
                doctorPasswordReg: false,
                ErrorPrompt: false,
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
                doctorPasswordReg: true,
            })
        }
    }
    // 确认密码获取焦点
    confirmPasswordFocus() {
        this.setState({
            confirmPasswordFocus: true,
            confirmPasswordReg: true,
        })
    }
    // 确认密码失去焦点
    confirmPasswordBlur() {
        this.setState({
            confirmPasswordFocus: false,
        })
        if (!this.state.confirmPassword) {
            this.setState({
                ErrorText: '请再次输入密码',
                confirmPasswordReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_PassWord.test(this.state.confirmPassword)) {
            this.setState({
                ErrorText: '密码为6-10个字符（数字+字母）',
                confirmPasswordReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (this.state.confirmPassword != this.state.doctorPassword) {
            this.setState({
                ErrorText: '两次密码不一致',
                confirmPasswordReg: false,
                ErrorPrompt: false,
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
                confirmPasswordReg: true,
            })
        }
    }
    // 获取验证码
    getRegisterSms() {
        if (!this.state.doctorPhone) {
            this.setState({
                ErrorText: '请输入手机号',
                phoneReg: false,
                ErrorPrompt: false,
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
                ErrorText: '手机号码格式不正确',
                phoneReg: false,
                ErrorPrompt: false,
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
                isLoading: true,
                ErrorText: '正在获取验证码...',
                ErrorPrompt: false,
                ErrorImg: require('../images/loading.png'),
            })
            fetch(requestUrl.registerSms + '?registerPhone=' + this.state.doctorPhone, {
                method: 'GET',
                headers: {

                },
            })
                .then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        this.setState({
                            isLoading: false,
                            ErrorText: '验证码发送成功',
                            ErrorPrompt: false,
                            ErrorImg: require('../images/succeed.png'),
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                        }, global.TimingCount)
                    } else if (responseData.code == 50008) {
                        this.setState({
                            isLoading: false,
                            ErrorText: '手机号码已注册过',
                            ErrorPrompt: false,
                            ErrorImg: require('../images/error.png'),
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                        }, global.TimingCount)
                    } else if (responseData.code == 50000) {
                        this.setState({
                            isLoading: false,
                            ErrorText: '系统异常',
                            ErrorPrompt: false,
                            ErrorImg: require('../images/error.png'),
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                        }, global.TimingCount)
                    } else {

                    }
                })
                .catch((error) => {
                    console.log('error', error);
                });
        }
    }
    // 注册事件
    signUp() {
        if (!this.state.doctorPhone) {
            this.setState({
                ErrorText: '请输入手机号',
                phoneReg: false,
                ErrorPrompt: false,
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
                ErrorText: '手机号码格式不正确',
                phoneReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!this.state.smsCode) {
            this.setState({
                ErrorText: '请输入验证码',
                smsCodeReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.smsCode)) {
            this.setState({
                ErrorText: '验证码格式不正确',
                smsCodeReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!this.state.doctorPassword) {
            this.setState({
                ErrorText: '请输入密码',
                doctorPasswordReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.setState({
                ErrorText: '密码为6-10个字符（数字+字母）',
                doctorPasswordReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!this.state.confirmPassword) {
            this.setState({
                ErrorText: '请再次输入密码',
                confirmPasswordReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_PassWord.test(this.state.confirmPassword)) {
            this.setState({
                ErrorText: '密码为6-10个字符（数字+字母）',
                confirmPasswordReg: false,
                ErrorPrompt: false,
                ErrorImg: require('../images/error.png'),
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (this.state.confirmPassword != this.state.doctorPassword) {
            this.setState({
                ErrorText: '两次密码不一致',
                confirmPasswordReg: false,
                ErrorPrompt: false,
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
                isLoading: true,
                ErrorText: '注册中...',
                ErrorPrompt: false,
                ErrorImg: require('../images/loading.png'),
            })
            let formData = new FormData();
            formData.append("doctorPhone", this.state.doctorPhone);
            formData.append("doctorPassword", this.state.doctorPassword);
            formData.append("smsCode", this.state.smsCode);
            fetch(requestUrl.register, {
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
                            ErrorText: '注册成功',
                            ErrorImg: require('../images/succeed.png'),
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                            this.props.navigation.navigate("SignIn");
                        }, global.TimingCount)
                    } else if (responseData.code == 50006) {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            smsCodeReg: false,
                            ErrorText: '验证码错误',
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
                            isLoading: false,
                            ErrorPrompt: false,
                            ErrorText: '注册失败',
                            ErrorImg: require('../images/error.png'),
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
        flex: 1,
        backgroundColor: global.Colors.colorfff,
        paddingBottom: global.TabBar,
        paddingTop: global.StatusBarHeight,
    },
    // 后退按钮
    goBackBtn: {
        paddingLeft: global.px2dp(24),
        paddingTop: global.px2dp(13),
        paddingRight: global.px2dp(24),
        paddingBottom: global.px2dp(13),
    },
    // 主要内容
    content: {
        paddingRight: global.px2dp(24),
        paddingLeft: global.px2dp(24),
    },
    // 文字logo
    textLogo: {
        width: global.px2dp(131),
        height: global.px2dp(31),
        marginTop: global.px2dp(45),
        marginBottom: global.px2dp(33),
    },
    btnBox: {
        marginTop: global.px2dp(46),
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
    // 密码输入焦点样式
    passwordItemFocus: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomColor: global.Colors.color3b7dc8,
    },
    // 错误样式
    errorStyle: {
        borderBottomColor: global.Colors.colorff0000,
    }
});

