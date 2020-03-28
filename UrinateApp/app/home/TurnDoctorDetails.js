import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, ScrollView, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import Button from "../common/Button";// 按钮组件
import ErrorPrompt from "../common/ErrorPrompt";
import LinearGradient from 'react-native-linear-gradient';
import { BoxShadow } from 'react-native-shadow';
import { CachedImage, ImageCache } from "react-native-img-cache";

export default class DoctorDetails extends Component {
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

            resumeFlag: false,
            gootAtFlag: false,

            doctorId: '',// 医生id
            userInfo: {},
            picturePrice: 0,
            phonePrice: 0,
            videoPrice: 0,
        }
    }
    getInitalState() {
        // 1初始化state
    }
    // 通过id查医生详情
    getDoctorDetailById(doctorId) {
        fetch(requestUrl.getDoctorDetailById + '?doctorId=' + doctorId, {
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
                        userInfo: responseData.result,
                    })
                } else if (responseData.code == 40001) {
                    this.props.navigation.navigate('SignIn');
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '查询失败',
                        ErrorPromptImg: require('../images/error.png'),
                    })
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                        })
                    }, global.TimingCount)
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    componentWillMount() {
        if (this.props.navigation.state.params) {
            let doctorId = this.props.navigation.state.params.doctorId;
            this.setState({
                doctorId: doctorId,// 医生id
                isLoading: true,
                ErrorPromptFlag: true,
                ErrorPromptText: '加载中...',
                ErrorPromptImg: require('../images/loading.png'),
            })
            this.getDoctorDetailById(doctorId);
            fetch(requestUrl.queryListByDoctor + '?doctorId=' + doctorId, {
                method: 'GET',
                headers: {
                    "token": global.Token,
                },
            }).then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        var tempArr = responseData.result;
                        for (var i = 0; i < tempArr.length; i++) {
                            if (tempArr[i].goodsType == "GOODS_INQUIRY_PICTURE") {
                                this.setState({
                                    picturePrice: tempArr[i].goodsPrice
                                })
                            } else if (tempArr[i].goodsType == "GOODS_INQUIRY_PHONE") {
                                this.setState({
                                    phonePrice: tempArr[i].goodsPrice
                                })
                            } else if (tempArr[i].goodsType == "GOODS_INQUIRY_VIDEO") {
                                this.setState({
                                    videoPrice: tempArr[i].goodsPrice
                                })
                            }
                        }
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                        })
                    } else if (responseData.code == 40001) {
                        this.props.navigation.navigate('SignIn');
                    } else {
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '查询失败',
                            ErrorPromptImg: require('../images/error.png'),
                        })
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.setState({
                                isLoading: false,
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
    render() {
        const shadowOpt = {
            width: global.px2dp(346),
            height: global.px2dp(246),
            color: "#000",
            border: 12,
            radius: global.px2dp(6),
            opacity: .1,
            x: 0,
            y: 0,
            style: styles.boxShadow,
        }
        const flodOpt = {
            width: global.px2dp(345),
            height: global.px2dp(32),
            color: "#000",
            border: 12,
            radius: global.px2dp(6),
            opacity: .1,
            x: 0,
            y: 0,
            style: styles.flodShadow,
        }
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
                        <Text style={styles.navTitle}>医生详情</Text>
                    </View>
                </LinearGradient>
                <ScrollView
                    style={styles.scrollView}>
                    <BoxShadow
                        setting={shadowOpt}>
                        <View style={styles.infoContent}>
                            <View style={styles.infoBox}>
                                <CachedImage
                                    style={styles.headImg}
                                    source={this.state.userInfo.headImg ? { uri: this.state.userInfo.headImg } : require('../images/default_doc_img.png')} />
                                <View style={styles.textInfoBox}>
                                    <Text style={styles.textName}>{this.state.userInfo.doctorName}</Text>
                                    <Text style={[styles.textSex, { marginRight: global.px2dp(11), marginLeft: global.px2dp(11) }]}>{this.state.userInfo.doctorSex}</Text>
                                    <Text style={styles.textTitle}>{this.state.userInfo.titleName}</Text>
                                    <Text style={styles.textHospital}>{this.state.userInfo.hospitalName}</Text>
                                </View>
                                {this.state.userInfo.areFans ?
                                    // 已关注
                                    <TouchableOpacity
                                        style={styles.concernBtn}
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.unFocus();
                                        }}
                                    >
                                        <View style={styles.concernBox}>
                                            <Text style={styles.concernText}>取消关注</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    // 未关注
                                    <TouchableOpacity
                                        style={styles.concernBtn}
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.focus();
                                        }}
                                    >
                                        <View style={styles.noConcernBox}>
                                            <Text style={styles.noConcernText}>关注</Text>
                                        </View>
                                    </TouchableOpacity>
                                }

                            </View>
                            <View style={styles.statisticsBox}>
                                <View style={styles.statisticsItem}>
                                    <Text style={styles.statisticsNum}>{this.state.userInfo.patientCount}</Text>
                                    <Text style={styles.statisticsText}>帮助患者</Text>
                                </View>
                                <View style={styles.statisticsLine}></View>
                                <View style={styles.statisticsItem}>
                                    <Text style={styles.statisticsNum}>{this.state.userInfo.hitsCount}</Text>
                                    <Text style={styles.statisticsText}>访问量</Text>
                                </View>
                                <View style={styles.statisticsLine}></View>
                                <View style={styles.statisticsItem}>
                                    <Text style={styles.statisticsNum}>{this.state.userInfo.fansCount}</Text>
                                    <Text style={styles.statisticsText}>关注</Text>
                                </View>
                            </View>
                            <View style={styles.diagnoseWayBox}>
                                <View style={styles.diagnoseWayItem}>
                                    <Image
                                        style={styles.diagnoseWayImg}
                                        source={require('../images/inquiry_img.png')} />
                                    <Text style={styles.diagnoseWayTitle}>图文咨询</Text>
                                    <Text style={styles.diagnoseWayPic}>{this.state.picturePrice == 0 ? "暂未开通" : this.state.picturePrice + '/次'}</Text>
                                </View>
                                <View style={styles.diagnoseWayItem}>
                                    <Image
                                        style={styles.diagnoseWayImg}
                                        source={require('../images/inquiry_tel.png')} />
                                    <Text style={styles.diagnoseWayTitle}>电话咨询</Text>
                                    <Text style={styles.diagnoseWayPic}>{this.state.phonePrice
                                        == 0 ? "暂未开通" : this.state.phonePrice
                                        + '/次'}</Text>
                                </View>
                                <View style={styles.diagnoseWayItem}>
                                    <Image
                                        style={styles.diagnoseWayImg}
                                        source={require('../images/inquiry_video.png')} />
                                    <Text style={styles.diagnoseWayTitle}>视频咨询</Text>
                                    <Text style={styles.diagnoseWayPic}>{this.state.videoPrice == 0 ? "暂未开通" : this.state.videoPrice + '/次'}</Text>
                                </View>
                                {/* <TouchableOpacity
                                    style={styles.diagnoseWayBtn}
                                    activeOpacity={.8}
                                    onPress={() => { }}
                                >
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    </BoxShadow>
                    <View style={[styles.content, this.state.gootAtFlag ? null : { maxHeight: global.px2dp(145), }]}>
                        <View style={styles.titleBox}>
                            <Image
                                style={styles.titleImg}
                                source={require('../images/good_at.png')} />
                            <Text style={styles.titleText}>擅长</Text>
                        </View>
                        <Text style={styles.Value}>{this.state.userInfo.doctorStrong}</Text>
                        {this.state.userInfo.doctorStrong && this.state.userInfo.doctorStrong.length > 50 ?
                            <TouchableOpacity
                                style={[styles.foldBtn, this.state.gootAtFlag ? null : { position: 'absolute' }]}
                                onPress={() => {
                                    this.setState({
                                        gootAtFlag: !this.state.gootAtFlag
                                    })
                                }}
                                activeOpacity={1}
                            >
                                <BoxShadow
                                    setting={flodOpt}>
                                    <View style={styles.foldBox}>
                                        <Text style={styles.foldText}>查看全部</Text>
                                        <Image source={require('../images/fold.png')} style={styles.foldImg} />
                                    </View>
                                </BoxShadow>
                            </TouchableOpacity>
                            : null}
                    </View>
                    <View style={[styles.content, this.state.resumeFlag ? null : { maxHeight: global.px2dp(145), }]}>
                        <View style={styles.titleBox}>
                            <Image
                                style={styles.titleImg}
                                source={require('../images/resume.png')} />
                            <Text style={styles.titleText}>简介</Text>
                        </View>
                        <Text style={styles.Value}>{this.state.userInfo.doctorResume}</Text>
                        {this.state.userInfo.doctorResume && this.state.userInfo.doctorResume.length > 50 ?
                            <TouchableOpacity
                                style={[styles.foldBtn, this.state.resumeFlag ? null : { position: 'absolute' }]}
                                onPress={() => {
                                    this.setState({
                                        resumeFlag: !this.state.resumeFlag
                                    })
                                }}
                                activeOpacity={1}
                            >
                                <BoxShadow
                                    setting={flodOpt}>
                                    <View style={styles.foldBox}>
                                        <Text style={styles.foldText}>查看全部</Text>
                                        <Image source={require('../images/fold.png')} style={styles.foldImg} />
                                    </View>
                                </BoxShadow>
                            </TouchableOpacity>
                            : null}
                    </View>
                    <View style={{ height: global.px2dp(15) }}></View>
                    <View style={styles.btnBox}>
                        <Button text={'申请转给他'} click={this.submit.bind(this)} style={{ borderRadius: global.px2dp(4) }} />
                    </View>
                </ScrollView>
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View >
        );
    }
    submit() {
        global.doctorInfo = this.state.userInfo;
        this.props.navigation.goBack(global.stateKey);
    }
    // 加关注
    focus() {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '加载中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("doctorId", this.state.userInfo.id);
        fetch(requestUrl.focus, {
            method: 'POST',
            headers: {
                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    let tempJSON = this.state.userInfo;
                    tempJSON.areFans = !this.state.userInfo.areFans;
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '关注成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                        userInfo: tempJSON,
                    })
                    this.getDoctorDetailById(this.state.doctorId);
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                    }, global.TimingCount)
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '关注失败',
                        ErrorPromptImg: require('../images/error.png'),
                    })
                    clearTimeout(this.timer);
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

    // 取消关注
    unFocus() {
        let formData = new FormData();
        formData.append("doctorId", this.state.userInfo.id);
        fetch(requestUrl.unFocus, {
            method: 'POST',
            headers: {
                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    let tempJSON = this.state.userInfo;
                    tempJSON.areFans = !this.state.userInfo.areFans;
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '取消关注成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                        userInfo: tempJSON,
                    })
                    this.getDoctorDetailById(this.state.doctorId);
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                    }, global.TimingCount)
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '取消关注失败',
                        ErrorPromptImg: require('../images/error.png'),
                    })
                    clearTimeout(this.timer);
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
    // 导航部分 - start
    linearGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: global.SCREEN_WIDTH,
        height: global.px2dp(200),
    },
    scrollView: {
        position: 'absolute',
        top: global.NavHeight,
        left: 0,
        width: global.SCREEN_WIDTH,
        height: global.IOS ? global.SCREEN_HEIGHT - global.NavHeight : global.SCREEN_HEIGHT - global.NavHeight - StatusBar.currentHeight,
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
    // 按钮盒子 - start
    btnBox: {
        marginTop: global.px2dp(19),
        marginBottom: global.px2dp(14),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    // 按钮盒子 - end
    boxShadow: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginTop: global.px2dp(15),
        // marginTop: global.NavHeight - global.px2dp(200) + global.px2dp(7),
    },
    infoContent: {
        backgroundColor: global.Colors.textfff,
        width: global.px2dp(346),
        height: global.px2dp(246),
        borderRadius: global.px2dp(6),
        paddingLeft: global.px2dp(18),
        paddingRight: global.px2dp(18),
    },
    // 基本信息 - start
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: global.px2dp(10),
        paddingBottom: global.px2dp(10),
    },
    headImg: {
        width: global.px2dp(67),
        height: global.px2dp(67),
        borderRadius: global.px2dp(33),
        marginRight: global.px2dp(15),
    },
    textInfoBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    textName: {
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
        lineHeight: global.px2dp(25),
    },
    textSex: {
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
        lineHeight: global.px2dp(25),
    },
    textTitle: {
        fontSize: global.px2dp(13),
        color: global.Colors.text333,
        lineHeight: global.px2dp(25),
    },
    textHospital: {
        fontSize: global.px2dp(14),
        color: global.Colors.text999,
        lineHeight: global.px2dp(22),
    },
    concernBtn: {

    },
    concernBox: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: global.Pixel,
        borderColor: global.Colors.colorccc,
        width: global.px2dp(64),
        height: global.px2dp(28),
        borderRadius: global.px2dp(14),
    },
    noConcernBox: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: global.Pixel,
        width: global.px2dp(64),
        height: global.px2dp(28),
        borderRadius: global.px2dp(14),
        borderColor: global.Colors.color,
    },
    concernText: {
        fontSize: global.px2dp(12),
        color: global.Colors.text999,
    },
    noConcernText: {
        fontSize: global.px2dp(12),
        color: global.Colors.color,
    },
    // 统计
    statisticsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: global.Colors.colorccc,
        borderTopWidth: global.Pixel,
        borderBottomWidth: global.Pixel,
    },
    statisticsItem: {
        flex: 1,
        height: global.px2dp(60),
        alignItems: 'center',
        justifyContent: 'center',
    },
    statisticsLine: {
        width: global.Pixel,
        height: global.px2dp(25),
        backgroundColor: global.Colors.colorccc,
    },
    statisticsNum: {
        fontSize: global.px2dp(18),
        color: global.Colors.color,
        lineHeight: global.px2dp(22),
    },
    statisticsPic: {
        fontSize: global.px2dp(12),
        color: global.Colors.text999,
        lineHeight: global.px2dp(20),
    },
    // 咨询方式
    diagnoseWayBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    diagnoseWayItem: {
        flex: 1,
        alignItems: 'center',
    },
    diagnoseWayImg: {
        marginTop: global.px2dp(10),
        marginBottom: global.px2dp(4),
    },
    diagnoseWayTitle: {
        fontSize: global.px2dp(14),
        color: global.Colors.text333,
        lineHeight: global.px2dp(20),
    },
    diagnoseWayText: {
        fontSize: global.px2dp(12),
        color: global.Colors.text666,
        lineHeight: global.px2dp(17),
    },
    // 基本信息 - end

    content: {
        position: 'relative',
        width: global.px2dp(345),
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(6),
        marginLeft: global.px2dp(15),
        marginTop: global.px2dp(15),
        marginRight: global.px2dp(15),
        borderWidth: global.Pixel,
        borderColor: global.Colors.colorccc,
        shadowRadius: 7,
        overflow: 'hidden',
    },
    titleBox: {
        height: global.px2dp(33),
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleImg: {
        marginLeft: global.px2dp(9),
        marginRight: global.px2dp(7),
    },
    titleText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    Value: {
        fontSize: global.px2dp(14),
        color: global.Colors.text666,
        lineHeight: global.px2dp(20),
        marginRight: global.px2dp(21),
        marginLeft: global.px2dp(33),
        paddingBottom: global.px2dp(13),
    },
    // 折叠部分 -start
    foldBtn: {
        bottom: - global.Pixel,
        left: 0,
    },
    foldBox: {
        width: global.px2dp(344),
        height: global.px2dp(32),
        backgroundColor: global.Colors.textfff,
        width: global.px2dp(344),
        height: global.px2dp(32),
        borderBottomLeftRadius: global.px2dp(6),
        borderBottomRightRadius: global.px2dp(6),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    foldText: {
        fontSize: global.px2dp(12),
        color: global.Colors.color,
        marginRight: global.px2dp(7),
    },
    // 折叠部分 - end

});

