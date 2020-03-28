import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import Button from "../common/Button";// 按钮组件
import ErrorPrompt from "../common/ErrorPrompt";
import Nav from "../common/Nav";// 导航组件
import CountDownButton from 'react-native-smscode-count-down';// 倒计时

export default class ForgetPayPassword extends Component {
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

            TimingText: '点击发送',

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
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: "加载中...",
            ErrorPromptUrl: require('../images/loading.png'),
        })
        fetch(requestUrl.getUsername, {
            method: 'GET',
            headers: {
                
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.setState({
                        doctorPhone: responseData.result,
                        isLoading: false,
                        ErrorPromptFlag: false,
                        ErrorPromptText: "加载中...",
                        ErrorPromptUrl: require('../images/loading.png'),
                    })
                } else if (responseData.code == 40001) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: "登录超时",
                        ErrorPromptUrl: require('../images/error.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                        this.props.navigation.navigate("SingIn");
                    }, global.TimingCount)
                } else if (responseData.code == 50000) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: "服务器繁忙",
                        ErrorPromptUrl: require('../images/error.png'),
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
                        ErrorPromptText: "服务器繁忙",
                        ErrorPromptUrl: require('../images/error.png'),
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
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Nav
                    isLoading={this.state.isLoading}
                    title={"重置支付密码"}
                    leftClick={this.goBack.bind(this)} />

                <ScrollView>
                    <View style={styles.textContent}>
                        <Text style={styles.text}>为了您的账户安全，请先验证您之前登录</Text>
                        <Text style={styles.text}>过的手机号码:{this.state.doctorPhone.substr(0, 3) + '*****' + this.state.doctorPhone.substr(9, 2)}</Text>
                    </View>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemTitle}>校验码</Text>
                        <TextInput
                            style={[styles.textInput, this.state.smsCodeReg ? null : styles.errorText]}
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
                                this.getPasswordSms();
                                shouldStartCounting(true);
                            }}
                            timerEnd={() => {
                                this.setState({
                                    TimingText: '重新获取'
                                })
                            }} />
                    </View>
                    <View style={styles.inputContent}>
                        {/* 密码 - start */}
                        <View style={[styles.inputItem, { borderBottomWidth: global.Pixel }, this.state.doctorPasswordReg ? null : styles.errorStyle]}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入提现密码'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ doctorPassword: text })}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                maxLength={6}
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
                                placeholder={'请再次输入提现密码'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ confirmPassword: text })}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                maxLength={6}
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
                        <Button text="完 成" style={{ borderRadius: global.px2dp(3) }} click={this.passwordReset.bind(this)} />
                    </View>
                </ScrollView>
                {this.state.ErrorPrompt ? null : <ErrorPrompt text={this.state.ErrorText} imgUrl={this.state.ErrorImg} />}
            </View>
        );
    }
    goBack() {
        this.props.navigation.goBack();
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
        let formData = new FormData();
        formData.append("phoneNumber", this.state.doctorPhone);
        fetch(requestUrl.sendPayPasswordCode, {
            method: 'POST',
            headers: {
                
                "token": global.Token,
            },
            body: formData,
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
                ErrorText: '请输入提现密码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.doctorPassword)) {
            this.setState({
                ErrorPrompt: false,
                doctorPasswordReg: false,
                ErrorText: '提现密码为6位纯数字',
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
                ErrorText: '请再次输入提现密码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.confirmPassword)) {
            this.setState({
                ErrorPrompt: false,
                confirmPasswordReg: false,
                ErrorText: '提现密码为6位纯数字',
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
        } else if (!this.state.doctorPassword) {
            this.setState({
                ErrorPrompt: false,
                doctorPasswordReg: false,
                ErrorText: '请输入提现密码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.doctorPassword)) {
            this.setState({
                ErrorPrompt: false,
                doctorPasswordReg: false,
                ErrorText: '提现密码为6位纯数字',
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
                ErrorText: '请再次输入提现密码',
                ErrorImg: require('../images/error.png')
            })
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: true,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.confirmPassword)) {
            this.setState({
                ErrorPrompt: false,
                confirmPasswordReg: false,
                ErrorText: '提现密码为6位纯数字',
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
            formData.append("paymentPassword", this.state.doctorPassword);
            formData.append("smsCode", this.state.smsCode);
            fetch(requestUrl.paymentPasswordReset, {
                method: 'POST',
                headers: {
                     "token": global.Token,
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
                            ErrorText: '提现密码设置成功',
                            ErrorImg: require('../images/succeed.png')
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPrompt: true,
                            })
                            this.props.navigation.goBack();
                        }, global.TimingCount)
                    } else if (responseData.code == 20001) {
                        this.setState({
                            isLoading: false,
                            ErrorPrompt: false,
                            ErrorText: "验证码错误",
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
    textContent: {
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
        paddingTop: global.px2dp(8),
        paddingBottom: global.px2dp(8),
    },
    text: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        lineHeight: global.px2dp(25),
    },
    itemContent: {
        height: global.px2dp(48),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: global.Colors.textfff,
        borderBottomWidth: global.Pixel,
        borderTopWidth: global.Pixel,
        borderColor: global.Colors.colorccc,
    },
    itemTitle: {
        marginLeft: global.px2dp(17),
        marginRight: global.px2dp(17),
    },
    textInput: {
        flex: 1,
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    isolationLine: {
        width: global.Pixel,
        height: global.px2dp(23),
        backgroundColor: global.Colors.text999,
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
    errorText: {
        color: global.Colors.colorff0000,
    },
    eyesBtn: {
        paddingBottom: global.px2dp(15),
        paddingTop: global.px2dp(15),
        paddingLeft: global.px2dp(28),
        paddingRight: global.px2dp(28),
    }
});
