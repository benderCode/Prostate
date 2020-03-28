import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import Button from "../common/Button";// 按钮组件
import ErrorPrompt from "../common/ErrorPrompt";
import Nav from "../common/Nav";// 导航组件
export default class UpdatePayPassword extends Component {
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

            checkPay: false,// 旧密码是否正确

            oldPasswordReg: true,//旧密码是否符合规则
            newPasswordReg: true,//新密码是否符合规则
            confirmPasswordReg: true,//确认密码是否符合规则

            oldPassword: '',// 旧密码
            newPassword: '',// 新密码
            confirmPassword: '',// 确认新密码
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
                <Nav isLoading={this.state.isLoading} title={"修改支付密码"} leftClick={this.goBack.bind(this)} />
                <ScrollView>
                    <View style={styles.center}>
                        <View style={styles.itemBox}>
                            <Text style={styles.itemTitle}>旧密码</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入旧密码'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ oldPassword: text })}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                secureTextEntry={true}
                                maxLength={6}
                                onFocus={this.oldPasswordFocus.bind(this)}
                                onBlur={this.oldPasswordBlur.bind(this)}
                            />
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => {
                                    navigate("ForgetPayPassword");
                                }}
                                style={styles.forgetBtn}
                            >
                                <Text style={styles.forgetText}>忘记原密码</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.center}>
                        <View style={styles.itemBox}>
                            <Text style={styles.itemTitle}>新密码</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入新密码'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ newPassword: text })}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                secureTextEntry={true}
                                maxLength={6}
                                onFocus={this.newPasswordFocus.bind(this)}
                                onBlur={this.newPasswordBlur.bind(this)}
                            />
                        </View>
                        <View style={[styles.itemBox, { borderTopWidth: global.Pixel, borderTopColor: global.Colors.text999 }]}>
                            <Text style={styles.itemTitle}>确认密码</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入密码'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ confirmPassword: text })}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                secureTextEntry={true}
                                maxLength={6}
                                onFocus={this.confirmPasswordFocus.bind(this)}
                                onBlur={this.confirmPasswordBlur.bind(this)}
                            />
                        </View>
                    </View>
                    <View style={styles.btnBox}>
                        <Button text={'确 认'} style={{ borderRadius: global.px2dp(3) }} click={this.submit.bind(this)} />
                    </View>
                </ScrollView>
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View>
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
    oldPasswordFocus() {
        this.setState({
            oldPasswordReg: true,
        })
    }
    oldPasswordBlur() {
        if (!this.state.oldPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入旧密码',
                ErrorPromptImg: require('../images/error.png'),
                oldPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.oldPassword)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '旧密码不符合规则',
                ErrorPromptImg: require('../images/error.png'),
                oldPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else {
            let formData = new FormData();
            formData.append("paymentPassword", this.state.oldPassword);
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
                        this.setState({
                            checkPay: true,
                        })
                    } else if (responseData.code == 40004) {
                        this.setState({
                            checkPay: false,
                            isLoading: false,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '旧密码不正确',
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
    newPasswordFocus() {
        this.setState({
            newPasswordReg: true,
        })
    }
    newPasswordBlur() {
        if (!this.state.newPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入新密码',
                ErrorPromptImg: require('../images/error.png'),
                newPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.newPassword)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '新密码不符合规则',
                ErrorPromptImg: require('../images/error.png'),
                newPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        }
    }
    confirmPasswordFocus() {
        this.setState({
            confirmPasswordReg: true,
        })
    }
    confirmPasswordBlur() {
        if (!this.state.confirmPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入确认密码',
                ErrorPromptImg: require('../images/error.png'),
                confirmPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.confirmPassword)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '确认密码不符合规则',
                ErrorPromptImg: require('../images/error.png'),
                confirmPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (this.state.newPassword != this.state.confirmPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '两次密码不一致',
                ErrorPromptImg: require('../images/error.png'),
                confirmPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        }
    }
    submit() {
        if (!this.state.oldPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入旧密码',
                ErrorPromptImg: require('../images/error.png'),
                newPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!this.state.checkPay) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '旧密码不正确',
                ErrorPromptImg: require('../images/error.png'),
                newPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!this.state.newPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入新密码',
                ErrorPromptImg: require('../images/error.png'),
                newPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.newPassword)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '新密码不符合规则',
                ErrorPromptImg: require('../images/error.png'),
                newPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!this.state.newPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入新密码',
                ErrorPromptImg: require('../images/error.png'),
                newPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.newPassword)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '新密码不符合规则',
                ErrorPromptImg: require('../images/error.png'),
                newPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!this.state.confirmPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入确认密码',
                ErrorPromptImg: require('../images/error.png'),
                confirmPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!regExp.Reg_Number.test(this.state.confirmPassword)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '确认密码不符合规则',
                ErrorPromptImg: require('../images/error.png'),
                confirmPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (this.state.newPassword != this.state.confirmPassword) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '两次密码不一致',
                ErrorPromptImg: require('../images/error.png'),
                confirmPasswordReg: false,
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else {
            this.setState({
                isLoading: true,
                ErrorPromptFlag: true,
                ErrorPromptText: '提交中...',
                ErrorPromptImg: require('../images/loading.png'),
            })
            let formData = new FormData();
            formData.append("paymentPassword", this.state.newPassword);
            fetch(requestUrl.updatePay, {
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
                            ErrorPromptText: '修改成功',
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
                            ErrorPromptText: '修改密码失败',
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    center: {
        marginTop: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
    },
    itemBox: {
        height: global.px2dp(47),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    itemTitle: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        width: global.px2dp(80),
    },
    forgetText: {
        fontSize: global.px2dp(13),
        color: global.Colors.color,
    },
    // 账号输入框
    textInput: {
        flex: 1,
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        height: global.px2dp(42),
        fontWeight: "500",
        padding: 0,
    },
    btnBox: {
        marginTop: global.px2dp(37),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
});

