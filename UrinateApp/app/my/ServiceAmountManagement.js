import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import ErrorPrompt from "../common/ErrorPrompt";
import { BoxShadow } from 'react-native-shadow';
import Nav from "../common/Nav";// 导航组件
export default class ServiceAmountManagement extends Component {
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

            servicePic: '',// 服务金额
            serviceLabelArr: [],// 服务金额数组
            deleteLabelId: '',// 删除标签id
            switchServiceFlag: false,// 删除标签确认框
            servicePicActive: 0,// 当前医生选的标签
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
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
    componentDidMount() {
        // 4获取数据 在 render 后
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        const shadowOpt = {
            width: global.px2dp(345),
            height: global.px2dp(46),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .2,
            x: 0,
            y: 0,
            style: styles.boxShadow,
        }
        return (
            <View style={styles.container}>
                <Nav isLoading={this.state.isLoading} title={"自定义问诊金额"} leftClick={this.goBack.bind(this)} />
                <ScrollView>
                    <BoxShadow setting={shadowOpt}>
                        <View style={styles.addLabelContent}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'请输入服务金额'}
                                placeholderTextColor={global.Colors.placeholder}
                                onChangeText={(text) => this.setState({ servicePic: text })}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                maxLength={8}
                                defaultValue={this.state.servicePic}
                                onBlur={this.servicePicBlur.bind(this)}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.addPriceDocket();
                                }}
                                activeOpacity={.8}
                                style={styles.addLabelClick}
                            >
                                <View style={styles.addLabelBtnBox}>
                                    <Text style={styles.addLabelBtnText}>完成</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </BoxShadow>
                    <View style={styles.labelContent}>
                        {this.renderServiceLabel()}
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
                                    <Text style={styles.switchServiceText}>确定要删除吗？</Text>
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
                                            this.deleteCustomDocket();
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
                        onPress={() => {
                            this.state.servicePicActive == this.state.serviceLabelArr[i].docketValue ?
                                null
                                :
                                this.setState({
                                    deleteLabelId: this.state.serviceLabelArr[i].id,
                                    switchServiceFlag: true,
                                })
                        }}
                        key={i}
                    >
                        {this.state.servicePicActive == this.state.serviceLabelArr[i].docketValue ?

                            <View style={styles.labelBox}>
                                <Text style={styles.labelText}>{this.state.serviceLabelArr[i].docketName}元</Text>
                            </View>
                            :
                            <View style={styles.labelBox}>
                                <Text style={styles.labelText}>{this.state.serviceLabelArr[i].docketName}元</Text>
                                <View style={styles.labelLine}></View>
                                <Image source={require('../images/cross.png')} />
                            </View>
                        }


                    </TouchableOpacity>
                )
            }
        }
        return tempArr;
    }
    // 输入金额失去焦点事件
    servicePicBlur() {
        if (!this.state.servicePic) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入服务金额',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!/^-?[1-9]+[0-9]*$/g.test(this.state.servicePic)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入正整数',
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
    // 添加自定义标签
    addPriceDocket() {
        if (!this.state.servicePic) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入服务金额',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (!/^-?[1-9]+[0-9]*$/g.test(this.state.servicePic)) {
            this.setState({
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入正整数',
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
                isLoading: true,
                ErrorPromptFlag: true,
                ErrorPromptText: '提交中...',
                ErrorPromptImg: require('../images/loading.png'),
            })
            let formData = new FormData();
            formData.append("docketName", this.state.servicePic);
            formData.append("docketValue", this.state.servicePic * 100);
            fetch(requestUrl.addPriceDocket, {
                method: 'POST',
                headers: {
                    
                    "token": global.Token,
                },
                body: formData,
            }).then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        let tempArr = this.state.serviceLabelArr;
                        let flag = true;
                        for (let i = 0; i < tempArr.length; i++) {
                            if (responseData.result.id == tempArr[i].id) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            tempArr.push(responseData.result);
                        }
                        this.setState({
                            servicePic: '',
                            serviceLabelArr: tempArr,
                            isLoading: false,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '添加成功',
                            ErrorPromptImg: require('../images/succeed.png'),
                        })
                        clearTimeout(this.timer)
                        this.timer = setTimeout(() => {
                            this.setState({
                                ErrorPromptFlag: false,
                            })
                        }, global.TimingCount)
                    } else if (responseData.code == 40001) {
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '添加失败，金额重复',
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
                            ErrorPromptText: '添加失败，请重试',
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
    // 删除自定义标签
    deleteCustomDocket() {
        this.setState({
            switchServiceFlag: false,
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("id", this.state.deleteLabelId);
        fetch(requestUrl.deleteCustomDocket, {
            method: 'POST',
            headers: {
                
                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    let tempArr = this.state.serviceLabelArr;
                    for (let i = 0; i < tempArr.length; i++) {
                        if (this.state.deleteLabelId == tempArr[i].id) {
                            tempArr.splice(i, 1);
                        }
                    }
                    this.setState({
                        serviceLabelArr: tempArr,
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
                } else if (responseData.code == 50003) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '系统标签不可删除',
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
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    boxShadow: {
        marginTop: global.px2dp(15),
        marginBottom: global.px2dp(8),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    addLabelContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: global.px2dp(46),
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(4),
    },
    textInput: {
        flex: 1,
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        paddingLeft: global.px2dp(14),
        paddingLeft: global.px2dp(14),
    },
    addLabelBtnBox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: global.px2dp(46),
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    addLabelBtnText: {
        fontSize: global.px2dp(16),
        color: global.Colors.color,
    },
    // 标签部分
    labelContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: global.px2dp(8),
        marginLeft: global.px2dp(15),
    },
    labelBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: global.px2dp(103),
        height: global.px2dp(41),
        backgroundColor: global.Colors.textfff,
        borderColor: global.Colors.colorccc,
        borderWidth: global.Pixel,
        borderRadius: global.px2dp(3),
        marginBottom: global.px2dp(12),
        marginRight: global.px2dp(15),
    },
    labelText: {
        fontSize: global.px2dp(17),
        color: global.Colors.color,
    },
    labelLine: {
        width: global.Pixel,
        height: global.px2dp(18),
        backgroundColor: global.Colors.text999,
        marginRight: global.px2dp(11),
        marginLeft: global.px2dp(9),
    },

    // 删除服务金额确认弹框
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

