import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, StatusBar, ScrollView } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import CountDownButton from 'react-native-smscode-count-down';// 倒计时
import Button from "../common/Button";
import ErrorPrompt from "../common/ErrorPrompt";
export default class ForgetPassword extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isEyes: true,// 是否显示密码 true不显示 false显示
            confirmEyes: true,// 确认密码眼睛

            ErrorPrompt: true,// 提示是否显示
            ErrorText: "",// 提示文字
            ErrorImg: '',// 提示图片

            doctorPhoneReg: true,// 手机号是否符合规则
            doctorPasswordReg: true,// 密码是否符合规则
            confirmPasswordReg: true,// 确认密码是否符合规则
            smsCodeReg: true,// 验证码是否符合规则

            doctorPhone: '',// 登录账号
            doctorPassword: '',// 登录密码
            confirmPassword: '',// 确认密码
            smsCode: '',// 验证码
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
            <View style={styles.container}>
                <StatusBar
                    animated={true}//是否动画
                    hidden={false}//是否隐藏
                    backgroundColor={'#000'}//android 设置状态栏背景颜色
                    translucent={false}//android 设置状态栏是否为透明
                    showHideTransition="fade"//IOS状态栏改变时动画 fade:默认 slide
                    networkActivityIndicatorVisible={this.state.isLoading}//IOS设定网络活动指示器(就是那个菊花)是否显示在状态栏。
                    statusBarStyle={"default"}//ios:白底黑字  android:黑底白字
                />
                {/* 导航box-start */}
                <View style={styles.navContent}>
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.goBackBtn}
                        onPress={() => goBack()}>
                        <Image
                            style={styles.goBackImg}
                            source={require('../images/arrow_left_grey.png')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>安全认证</Text>
                </View>
                {/* 导航box-end */}
                <ScrollView
                    keyboardShouldPersistTaps={'handled'}
                >

                    <View style={styles.inputContent}>
                        {/* 手机号start */}
                        <View style={[styles.inputItem, { borderBottomWidth: global.Pixel }, this.state.doctorPhoneReg ? null : styles.errorStyle]}>
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
                        </View>
                        {/* 手机号- end */}
                        {/* 验证码- start */}
                        <View style={[styles.inputItem, this.state.smsCodeReg ? null : styles.errorStyle]}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入验证码'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ smsCode: text })}
                                defaultValue={this.state.smsCode}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                onFocus={this.smsCodeFocus.bind(this)}
                                onBlur={this.smsCodeBlur.bind(this)}
                                maxLength={6}
                            />
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
                                            ErrorText: '请输入手机号',
                                            doctorPhoneReg: false,
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
                                            doctorPhoneReg: false,
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
                                        this.getPasswordSms();
                                        shouldStartCounting(true);
                                    }
                                }}
                                timerEnd={() => {
                                    this.setState({
                                        TimingText: '重新获取'
                                    })
                                }} />
                        </View>
                        {/* 验证码- end */}

                    </View>
                    <View style={styles.inputContent}>
                        {/* 密码 - start */}
                        <View style={[styles.inputItem, { borderBottomWidth: global.Pixel }, this.state.doctorPasswordReg ? null : styles.errorStyle]}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入密码6-10字符（数字+字母）'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ doctorPassword: text })}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'default'}
                                secureTextEntry={this.state.isEyes ? true : false}
                                onFocus={this.doctorPasswordFocus.bind(this)}
                                onBlur={this.doctorPasswordBlur.bind(this)}
                            />
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() =>
                                    this.setState({
                                        isEyes: !this.state.isEyes
                                    })
                                }
                                style={styles.eyesBtn}
                            >
                                <Image
                                    style={styles.eyeImg}
                                    source={this.state.isEyes ? require('../images/eyes_no.png') : require('../images/eyes_yes.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* 密码 - end */}
                        {/* 确认密码 - start */}
                        <View style={[styles.inputItem, this.state.confirmPasswordReg ? null : styles.errorStyle]}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请再次输入密码'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ confirmPassword: text })}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'default'}
                                secureTextEntry={this.state.confirmEyes ? true : false}
                                onFocus={this.confirmPasswordFocus.bind(this)}
                                onBlur={this.confirmPasswordBlur.bind(this)}
                            />
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() =>
                                    this.setState({
                                        confirmEyes: !this.state.confirmEyes
                                    })
                                }
                                style={styles.eyesBtn}
                            >
                                <Image
                                    style={styles.eyeImg}
                                    source={this.state.confirmEyes ? require('../images/eyes_no.png') : require('../images/eyes_yes.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* 确认密码 - end */}
                    </View>
                    {/* 提交按钮box */}
                    <View style={styles.btnBox}>
                        <Button text="完成" click={this.passwordReset.bind(this)} />
                    </View>
                </ScrollView>
                {this.state.ErrorPrompt ? null : <ErrorPrompt text={this.state.ErrorText} imgUrl={this.state.ErrorImg} />}
            </View>
        );
    }
    // 账号焦点
    doctorPhoneFocus() {
        this.setState({
            doctorPhoneReg: true,
        })
    }
    // 账号失去焦点
    doctorPhoneBlur() {
        if (!this.state.doctorPhone) {
            this.setState({
                ErrorPrompt: false,
                doctorPhoneReg: false,
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
                doctorPhoneReg: false,
                ErrorText: '手机号码格式不正确',
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
                doctorPhoneReg: true,
            })
        }
    }
    // 获取验证码
    getPasswordSms() {
        this.setState({
            isLoading: true,
            ErrorPrompt: false,
            doctorPhoneReg: true,
            ErrorText: '正在获取验证码...',
            ErrorImg: require('../images/loading.png')
        })
        fetch(requestUrl.passwordSms + '?passwordPhone=' + this.state.doctorPhone, {
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
                        doctorPhoneReg: false,
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
                        doctorPhoneReg: false,
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
                        doctorPhoneReg: false,
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
    // 验证码焦点
    smsCodeFocus() {
        this.setState({
            smsCodeReg: true,
        })
    }
    // 验证码失去焦点
    smsCodeBlur() {
        if (!this.state.smsCode) {
            this.setState({
                ErrorPrompt: false,
                smsCodeReg: false,
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
                smsCodeReg: false,
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
                smsCodeReg: true,
            })
        }
    }
    // 密码焦点
    doctorPasswordFocus() {
        this.setState({
            doctorPasswordReg: true,
        })
    }
    // 密码焦点
    doctorPasswordBlur() {
        if (!this.state.doctorPassword) {
            this.setState({
                ErrorPrompt: false,
                doctorPasswordReg: false,
                ErrorText: '请输入密码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.setState({
                ErrorPrompt: false,
                doctorPasswordReg: false,
                ErrorText: '密码为6-10个字符（数字+字母）',
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
                doctorPasswordReg: true,
            })
        }
    }


    // 确认密码焦点
    confirmPasswordFocus() {
        this.setState({
            confirmPasswordReg: true,
        })
    }
    // 确认密码失去焦点
    confirmPasswordBlur() {
        if (!this.state.confirmPassword) {
            this.setState({
                ErrorPrompt: false,
                confirmPasswordReg: false,
                ErrorText: '请再次输入密码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_PassWord.test(this.state.confirmPassword)) {
            this.setState({
                ErrorPrompt: false,
                confirmPasswordReg: false,
                ErrorText: '确认密码为6-10个字符（数字+字母）',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (this.state.doctorPassword != this.state.confirmPassword) {
            this.setState({
                ErrorPrompt: false,
                confirmPasswordReg: false,
                ErrorText: '两次密码不一致',
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
                confirmPasswordReg: true,
            })
        }
    }
    // 完成按钮
    passwordReset() {
        if (!this.state.doctorPhone) {
            this.setState({
                ErrorPrompt: false,
                doctorPhoneReg: false,
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
                doctorPhoneReg: false,
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
                smsCodeReg: false,
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
                smsCodeReg: false,
                ErrorText: '验证码格式不正确',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!this.state.doctorPassword) {
            this.setState({
                ErrorPrompt: false,
                doctorPasswordReg: false,
                ErrorText: '请输入密码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_PassWord.test(this.state.doctorPassword)) {
            this.setState({
                ErrorPrompt: false,
                doctorPasswordReg: false,
                ErrorText: '密码为6-10个字符（数字+字母）',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!this.state.confirmPassword) {
            this.setState({
                ErrorPrompt: false,
                confirmPasswordReg: false,
                ErrorText: '请再次输入密码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_PassWord.test(this.state.confirmPassword)) {
            this.setState({
                ErrorPrompt: false,
                confirmPasswordReg: false,
                ErrorText: '确认密码为6-10个字符（数字+字母）',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (this.state.doctorPassword != this.state.confirmPassword) {
            this.setState({
                ErrorPrompt: false,
                confirmPasswordReg: false,
                ErrorText: '两次密码不一致',
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
                ErrorText: '提交中...',
                ErrorImg: require('../images/loading.png')
            })
            let formData = new FormData();
            formData.append("doctorPhone", this.state.doctorPhone);
            formData.append("doctorPassword", this.state.doctorPassword);
            formData.append("smsCode", this.state.smsCode);
            fetch(requestUrl.passwordReset, {
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
                            ErrorText: '密码重置成功',
                            ErrorImg: require('../images/succeed.png')
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                            this.props.navigation.navigate("SignIn")
                        }, global.TimingCount)
                    } else if (responseData.code == 50006) {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            ErrorText: "验证码错误",
                            ErrorImg: require('../images/error.png')
                        })

                    } else {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            ErrorText: "重置密码失败",
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
        flex: 1,
        position: 'relative',
        backgroundColor: global.Colors.bgColor,
        paddingBottom: global.TabBar,
    },
    // 导航Box
    navContent: {
        paddingTop: global.StatusBarHeight,
        height: global.NavHeight,
        backgroundColor: global.Colors.textfff,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: "#a1a1a1",
        borderBottomWidth: global.Pixel,

    },
    goBackBtn: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingBottom: global.px2dp(13),
        paddingTop: global.px2dp(13),
        paddingRight: global.px2dp(15),
        paddingLeft: global.px2dp(15),
    },
    navTitle: {
        fontSize: global.px2dp(19),
        color: global.Colors.text333,
    },
    btnBox: {
        marginTop: global.px2dp(38),
        marginRight: global.px2dp(24),
        marginLeft: global.px2dp(24),
    },
    // 隔离|线
    isolationLine: {
        width: global.Pixel,
        height: global.px2dp(15),
        backgroundColor: global.Colors.text999,
    },
    inputContent: {
        marginTop: global.px2dp(15),
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
        width: global.SCREEN_WIDTH,

    },
    inputItem: {
        height: global.px2dp(48),
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: global.Colors.colorccc,
    },
    textInput: {
        flex: 1,
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        height: global.px2dp(42),
        fontWeight: "500",
        padding: 0,
    },
    errorStyle: {
        borderBottomColor: global.Colors.colorff0000,
        borderBottomWidth: global.Pixel,
    },
    eyesBtn: {
        paddingBottom: global.px2dp(15),
        paddingTop: global.px2dp(15),
        paddingLeft: global.px2dp(28),
        paddingRight: global.px2dp(28),
    }
});

