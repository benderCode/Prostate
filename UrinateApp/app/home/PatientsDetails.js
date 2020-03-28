import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar, TextInput, ScrollView, Keyboard, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import ErrorPrompt from "../common/ErrorPrompt";
import { BoxShadow } from 'react-native-shadow';
import { NavigationEvents } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import { CachedImage, ImageCache } from "react-native-img-cache";
export default class PatientsDetails extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isRefresh: false,

            ErrorPromptFlag: false,
            ErrorPromptText: '',
            ErrorPromptImg: '',

            maskLabelFlag: false,//添加标签弹出
            lableName: '',//创建标签

            patientId: '',// 患者id
            tabActive: 0,// 底部切换焦点
            patientInfo: null,// 患者信息
            patientLabelArr: null,// 患者标签信息
            allLabelArr: '',// 全部标签
            allLabelFlag: false,//

            TurnMaskFlag: false,// 转诊提示框
            doctorInfo: {},// 医生信息

            pageSize: 10,

            reportPageNo: 1,// 上传报告页面
            reportArr: [],// 上传报告数据
            reportDataFlag: true,// 上传报告是否有下一页

            inquiryPageNo: 1,// 问诊页码
            inquiryArr: [],// 问诊数据
            inquiryDataFlag: true,// 问诊是否有下一页

            assessmentPageNo: 1,// 评估结果页码
            assessmentArr: [],// 评估结果数据
            assessmentDataFlag: true,// 评估结果是否有下一页

            examinationPageNo: 1,// 解读结果页码
            examinationArr: [],// 解读结果数据
            examinationDataFlag: true,// 解读结果是否有下一页

            keyFlag: false,
            keyHeight: 0,
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        if (this.props.navigation.state.params) {
            // 患者信息查询
            const patientId = this.props.navigation.state.params.patientId;
            this.setState({
                patientId: patientId,
            })
            fetch(requestUrl.getPatientById + "?patientId=" + patientId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "token": global.Token,
                },
            }).then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        this.setState({
                            patientInfo: responseData.result,
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
                }).catch((error) => {
                    console.log('error', error);
                });
            // 患者标签查询
            fetch(requestUrl.getPatientLabel + '?patientId=' + patientId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "token": global.Token,
                },
            }).then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        this.setState({
                            patientLabelArr: responseData.result,
                        })
                    } else {
                        this.setState({
                            patientLabelArr: [],
                        })
                    }
                }).catch((error) => {
                    console.log('error', error);
                });
            // 查全部标签
            fetch(requestUrl.getLablePatientJson, {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "token": global.Token,
                },
            }).then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        this.setState({
                            allLabelArr: responseData.result,
                            allLabelFlag: true,
                        })
                    } else {
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '标签查询失败，请重试',
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
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow(e) {
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
        // 查上传报告
        this.state.patientId && this.getMedicalReportList(1);
        // 查问诊记录
        this.state.patientId && this.getOrderListByPatient(1);
        this.state.patientId && this.getAssessmentListByPatient(1);
        this.state.patientId && this.getExaminationListByPatient(1);
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        const baseInfoShadowOpt = {
            width: global.px2dp(345),
            height: global.px2dp(73),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .2,
            x: 0,
            y: 0,
            style: styles.baseInfoBoxShadow,
        }

        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => {
                        global.doctorInfo && global.doctorInfo.id ?
                            this.setState({
                                doctorInfo: global.doctorInfo,
                                TurnMaskFlag: true,
                            }) : null
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
                        <Text style={styles.navTitle}>患者详情</Text>
                    </View>
                </LinearGradient>
                <ScrollView style={styles.scrollView}>
                    <BoxShadow
                        setting={baseInfoShadowOpt}>
                        <View style={styles.baseInfoContent}>
                            <View style={styles.baseInfoBox}>
                                <Text style={styles.baseInfoText}>{this.state.patientInfo && this.state.patientInfo.patientName} {this.state.patientInfo && this.state.patientInfo.patientSex} {this.state.patientInfo && this.state.patientInfo.patientAge}岁</Text>
                                {this.state.patientInfo && this.state.patientInfo.patientPhone ? <Text style={styles.telText}>手机号 :{this.state.patientInfo.patientPhone}</Text> : null}
                            </View>
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => {
                                    navigate("TurnContact");
                                }}
                                style={styles.rotatePatientBtn}
                            >
                                <View style={styles.rotatePatientBox}>
                                    <Text style={styles.rotatePatientText}>申请转诊</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </BoxShadow>
                    <View style={styles.content}>
                        <View style={styles.titleBox}>
                            <View style={styles.titleLine}></View>
                            <Text style={styles.titleText}>既往病史</Text>
                        </View>
                        <View style={styles.medicalHistoryItem}>
                            <Text style={styles.medicalHistoryTitle}>正在服用药物</Text>
                            <Text style={styles.medicalHistoryValue}>{
                                this.state.patientInfo && this.state.patientInfo.anamnesisEatingDrugList.map((item, index) => {
                                    return (
                                        <Text key={index}>{item.anamnesisRemark}、</Text>
                                    )
                                })
                            }</Text>
                        </View>
                        <View style={styles.medicalHistoryItem}>
                            <Text style={styles.medicalHistoryTitle}>药物过敏史</Text>
                            <Text style={styles.medicalHistoryValue}>{
                                this.state.patientInfo && this.state.patientInfo.anamnesisAllergyDrugList.map((item, index) => {
                                    return (
                                        <Text key={index}>{item.anamnesisRemark}、</Text>
                                    )
                                })
                            } </Text>
                        </View>
                        <View style={styles.medicalHistoryItem}>
                            <Text style={styles.medicalHistoryTitle}>手术史</Text>
                            <Text style={styles.medicalHistoryValue}>{
                                this.state.patientInfo && this.state.patientInfo.anamnesisSurgicalHistoryList.map((item, index) => {
                                    return (
                                        <Text key={index}>{item.anamnesisRemark}、</Text>
                                    )
                                })
                            } </Text>
                        </View>
                        <View style={styles.medicalHistoryItem}>
                            <Text style={styles.medicalHistoryTitle}>既往病史</Text>
                            <Text style={styles.medicalHistoryValue}>{
                                this.state.patientInfo && this.state.patientInfo.anamnesisIllnessList.map((item, index) => {
                                    return (
                                        <Text key={index}>{item.anamnesisRemark}、</Text>
                                    )
                                })
                            } </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.titleBox}>
                            <View style={styles.titleLine}></View>
                            <Text style={styles.titleText}>患者标签</Text>
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => {
                                    this.setState({
                                        maskLabelFlag: !this.state.maskLabelFlag,
                                    })
                                }}
                                style={styles.addLabelClick}
                            >
                                <Text style={styles.addLabelClickText}>自定义标签</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={styles.labelContent}>
                            {this.state.patientLabelArr ? this.renderPatientLabel() : null}
                        </ScrollView>
                    </View>
                    <View style={styles.swiperContent}>
                        <ScrollView
                            style={styles.tabScrollView}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={styles.tabContent}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            tabActive: 0,
                                        })
                                        this.refs.contentScrollView.scrollTo({
                                            x: global.SCREEN_WIDTH * 0,
                                            animated: true
                                        })
                                    }}
                                    activeOpacity={.8}
                                    style={styles.tabBtn}
                                >
                                    <View style={[styles.tabBox, this.state.tabActive == 0 ? { borderBottomColor: global.Colors.color, } : null]}>
                                        <Text style={[styles.tabText, this.state.tabActive == 0 ? { color: global.Colors.color, } : null]}>上传报告</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            tabActive: 1,
                                        })
                                        this.refs.contentScrollView.scrollTo({
                                            x: global.SCREEN_WIDTH * 1,
                                            animated: true
                                        })
                                    }}
                                    activeOpacity={.8}
                                    style={styles.tabBtn}
                                >
                                    <View style={[styles.tabBox, this.state.tabActive == 1 ? { borderBottomColor: global.Colors.color, } : null]}>
                                        <Text style={[styles.tabText, this.state.tabActive == 1 ? { color: global.Colors.color, } : null]}>问诊记录</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            tabActive: 2,
                                        })
                                        this.refs.contentScrollView.scrollTo({
                                            x: global.SCREEN_WIDTH * 2,
                                            animated: true
                                        })
                                    }}
                                    activeOpacity={.8}
                                    style={styles.tabBtn}
                                >
                                    <View style={[styles.tabBox, this.state.tabActive == 2 ? { borderBottomColor: global.Colors.color, } : null]}>
                                        <Text style={[styles.tabText, this.state.tabActive == 2 ? { color: global.Colors.color, } : null]}>评估记录</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            tabActive: 3,
                                        })
                                        this.refs.contentScrollView.scrollTo({
                                            x: global.SCREEN_WIDTH * 3,
                                            animated: true
                                        })
                                    }}
                                    activeOpacity={.8}
                                    style={styles.tabBtn}
                                >
                                    <View style={[styles.tabBox, this.state.tabActive == 3 ? { borderBottomColor: global.Colors.color, } : null]}>
                                        <Text style={[styles.tabText, this.state.tabActive == 3 ? { color: global.Colors.color, } : null]}>报告解读记录</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        <ScrollView
                            style={styles.contentScrollView}
                            horizontal={true}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            ref={"contentScrollView"}
                            onMomentumScrollEnd={(e) => {
                                this.setState({
                                    tabActive: e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
                                })
                            }}
                        >
                            {/* 上传报告 */}
                            <View style={styles.contentItem}>
                                <Text style={styles.contentTitleText}>上传报告</Text>
                                <FlatList
                                    style={styles.itemBox}
                                    data={this.state.reportArr}
                                    // initialNumToRender={10}
                                    keyExtractor={item => item.date}
                                    renderItem={({ item }) => this.renderReportItem(item)}
                                    onRefresh={() => {
                                        this.setState({
                                            reportPageNo: 1,
                                            reportArr: [],
                                        })
                                        this.getMedicalReportList(1);
                                    }}//头部刷新组件
                                    refreshing={this.state.isRefresh}//加载图标
                                    onEndReached={() => this.onEndReachedReport()} // 加载更多
                                    onEndReachedThreshold={.1}// 加载更多触发时机
                                // ListEmptyComponent={() => {
                                //     // 无数据时显示的内容
                                //     return (
                                //         <View style={styles.noDataBox}>
                                //             <Image source={require('../images/no_patient.png')} />
                                //             <Text style={styles.noDataText}>你暂无患者可查看</Text>
                                //         </View>
                                //     )
                                // }}
                                />
                            </View>
                            {/* 问诊记录 */}
                            <View style={styles.contentItem}>
                                <Text style={styles.contentTitleText}>问诊记录</Text>
                                <FlatList
                                    style={styles.itemBox}
                                    data={this.state.inquiryArr}
                                    // initialNumToRender={10}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => this.renderInquiryItem(item)}
                                    onRefresh={() => {
                                        this.setState({
                                            inquiryPageNo: 1,
                                            inquiryArr: [],
                                        })
                                        this.getOrderListByPatient(1);
                                    }}//头部刷新组件
                                    refreshing={this.state.isRefresh}//加载图标
                                    onEndReached={() => this.onEndReachedInquiry()} // 加载更多
                                    onEndReachedThreshold={.2}// 加载更多触发时机
                                // ListEmptyComponent={() => {
                                //     // 无数据时显示的内容
                                //     return (
                                //         <View style={styles.noDataBox}>
                                //             <Image source={require('../images/no_patient.png')} />
                                //             <Text style={styles.noDataText}>你暂无患者可查看</Text>
                                //         </View>
                                //     )
                                // }}
                                />
                            </View>
                            {/* 评估记录 */}
                            <View style={styles.contentItem}>
                                <Text style={styles.contentTitleText}>评估记录</Text>
                                <FlatList
                                    style={styles.itemBox}
                                    data={this.state.assessmentArr}
                                    // initialNumToRender={10}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => this.renderAssessmentItem(item)}
                                    onRefresh={() => {
                                        this.setState({
                                            assessmentPageNo: 1,
                                            assessmentArr: [],
                                        })
                                        this.getAssessmentListByPatient(1);
                                    }}//头部刷新组件
                                    refreshing={this.state.isRefresh}//加载图标
                                    onEndReached={() => this.onEndReachedAssessment()} // 加载更多
                                    onEndReachedThreshold={.2}// 加载更多触发时机
                                // ListEmptyComponent={() => {
                                //     // 无数据时显示的内容
                                //     return (
                                //         <View style={styles.noDataBox}>
                                //             <Image source={require('../images/no_patient.png')} />
                                //             <Text style={styles.noDataText}>你暂无患者可查看</Text>
                                //         </View>
                                //     )
                                // }}
                                />
                            </View>
                            {/* 解读报告记录 */}
                            <View style={styles.contentItem}>
                                <Text style={styles.contentTitleText}>解读报告记录</Text>
                                <FlatList
                                    style={styles.itemBox}
                                    data={this.state.examinationArr}
                                    // initialNumToRender={10}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => this.renderExaminationItem(item)}
                                    onRefresh={() => {
                                        this.setState({
                                            examinationPageNo: 1,
                                            examinationArr: [],
                                        })
                                        this.getExaminationListByPatient(1);
                                    }}//头部刷新组件
                                    refreshing={this.state.isRefresh}//加载图标
                                    onEndReached={() => this.onEndReachedExamination()} // 加载更多
                                    onEndReachedThreshold={.2}// 加载更多触发时机
                                // ListEmptyComponent={() => {
                                //     // 无数据时显示的内容
                                //     return (
                                //         <View style={styles.noDataBox}>
                                //             <Image source={require('../images/no_patient.png')} />
                                //             <Text style={styles.noDataText}>你暂无患者可查看</Text>
                                //         </View>
                                //     )
                                // }}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
                {this.state.maskLabelFlag ?
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.maskLabel, { height: global.SCREEN_HEIGHT - this.state.keyHeight }]}
                        onPress={() => {
                            this.setState({
                                maskLabelFlag: !this.state.maskLabelFlag
                            })
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                        >
                            <View style={styles.maskLabelContent}>
                                <View style={styles.labelTitleBox}>
                                    <Text style={styles.labelTitleText}>新建自定义标签</Text>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        onPress={() => {
                                            this.setState({
                                                maskLabelFlag: !this.state.maskLabelFlag
                                            })
                                        }}
                                        style={{ paddingRight: global.px2dp(20) }}
                                    >
                                        <Image source={require('../images/close_mask.png')} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={{ maxHeight: global.px2dp(130) }}>
                                    <View style={styles.baseLabelContent}>
                                        {this.state.allLabelFlag && this.renderDoctorLabel()}
                                    </View>
                                </ScrollView>
                                <Text style={styles.separateText}>自定义</Text>
                                <TextInput
                                    style={[styles.textareaStyle]}
                                    placeholder={'请输入用户标签...'}
                                    placeholderTextColor={global.Colors.placeholder}
                                    // multiline={true}
                                    onChangeText={(text) => {
                                        this.setState({
                                            lableName: text.replace(/[^\u4e00-\u9fa5]/gi, ""),
                                        })
                                    }}
                                    defaultValue={this.state.lableName}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'default'}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.creationLabel();
                                    }}
                                    activeOpacity={.8}
                                    style={styles.addLabelBtn}
                                >
                                    <View style={styles.addLabelBox}>
                                        <Text style={styles.addLabelText}>保存</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null}
                {
                    this.state.TurnMaskFlag ?
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.setState({
                                    TurnMaskFlag: !this.state.TurnMaskFlag,
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
                                        <Text style={styles.affirmText}>您确定把{this.state.patientInfo.patientName}转诊给</Text>
                                        <Text style={styles.affirmDoctorText}>{this.state.doctorInfo.hospitalName}-{this.state.doctorInfo.doctorName}</Text>
                                    </View>
                                    <View style={styles.btnBox}>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress={() => {
                                                this.setState({
                                                    TurnMaskFlag: !this.state.TurnMaskFlag,
                                                })
                                            }}
                                            style={[styles.btnClick, { borderRightColor: global.Colors.text999, borderRightWidth: global.Pixel }]}
                                        >
                                            <Text style={styles.noBtnText}>取消</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            onPress={() => {
                                                this.setState({
                                                    TurnMaskFlag: !this.state.TurnMaskFlag,
                                                })
                                                this.turnOrder();
                                            }}
                                            style={styles.btnClick}
                                        >
                                            <Text style={styles.yesBtnText}>确认</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        : null
                }
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View >
        );
    }

    goBack() {
        this.props.navigation.goBack();
    }

    // 渲染医生基础标签
    renderDoctorLabel() {
        let tempArr = [];
        for (let i = 0; i < this.state.allLabelArr.length; i++) {
            tempArr.push(
                <View key={i} style={styles.baseLabelItem}>
                    <View style={styles.baseLabelBox}>
                        <Text style={styles.baseLabelText}>{this.state.allLabelArr[i].docketName}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.deleteLabel(this.state.allLabelArr[i].id)
                        }}
                        style={styles.delLabelBtn}
                    >
                        <Image source={require('../images/del_img.png')} />
                    </TouchableOpacity>
                </View>
            )
        }
        return tempArr;
    }

    // 渲染患者标签
    renderPatientLabel() {
        let tempArr = [];
        for (let j = 0; j < this.state.allLabelArr.length; j++) {
            let flag = false;
            let id = '';
            for (let i = 0; i < this.state.patientLabelArr.length; i++) {
                if (this.state.allLabelArr[j].id == this.state.patientLabelArr[i].stickerId) {
                    flag = true;
                    id = this.state.patientLabelArr[i].id;
                }
            }
            if (flag) {
                tempArr.push(
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.labelBtn}
                        onPress={() => {
                            this.removeLabel(id);
                        }}
                        key={j}
                    >
                        <View style={[styles.labelBox, { backgroundColor: global.Colors.color }]}>
                            <Text style={[styles.labelText, { color: global.Colors.textfff }]}>{this.state.allLabelArr[j].docketName}</Text>
                        </View>
                    </TouchableOpacity>
                )
            } else {
                tempArr.push(
                    <TouchableOpacity
                        activeOpacity={.8}
                        style={styles.labelBtn}
                        onPress={() => {
                            this.addLabel(this.state.allLabelArr[j].id);
                        }}
                        key={j}
                    >
                        <View style={styles.labelBox}>
                            <Text style={styles.labelText}>{this.state.allLabelArr[j].docketName}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        }
        return tempArr;
    }
    // 申请转诊 - start
    turnOrder() {
        this.setState({
            TurnMaskFlag: false,
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("patientId", this.state.patientId);
        formData.append("doctorId", this.state.doctorInfo.id);
        fetch(requestUrl.turnPatient, {
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
                        ErrorPromptText: '申请成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                    })
                    global.doctorInfo = {};
                    global.stateKey = '';
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                        this.props.navigation.goBack();
                    }, global.TimingCount)
                } else if (responseData.code == 60002) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '申请失败，该患者不能转给该意思',
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
                        ErrorPromptText: '申请失败，请重试',
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
    // 申请转诊 - end


    // 添加标签
    addLabel(sticker) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("patientId", this.state.patientId);
        formData.append("sticker", sticker);
        fetch(requestUrl.addLabel, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    // 将新的加入 
                    let tempArr = this.state.patientLabelArr;
                    tempArr.push(responseData.result)
                    this.setState({
                        // patientLabelArr: tempArr,
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '添加成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                    })
                    // 刷新标签展示
                    this.renderPatientLabel();
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
    // 取消标签
    removeLabel(id) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("id", id);
        fetch(requestUrl.removeLabel, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    let tempArr = this.state.patientLabelArr;
                    for (let i = 0; i < tempArr.length; i++) {
                        if (id == tempArr[i].id) {
                            tempArr.splice(i, 1)
                        }
                    }
                    this.setState({
                        patientLabelArr: tempArr,
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '删除成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                    })
                    // 刷新标签展示
                    this.renderPatientLabel();
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
    // 创建标签
    creationLabel() {
        if (!this.state.lableName) {
            this.setState({
                isLoading: false,
                ErrorPromptFlag: true,
                ErrorPromptText: '请输入文字',
                ErrorPromptImg: require('../images/error.png'),
            })
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPromptFlag: false,
                })
            }, global.TimingCount)
        } else if (this.state.lableName.length > 10) {
            this.setState({
                isLoading: false,
                ErrorPromptFlag: true,
                ErrorPromptText: '输入内容过长',
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
            formData.append("docketName", this.state.lableName);
            fetch(requestUrl.creationLabel, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "token": global.Token,
                },
                body: formData,
            }).then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        let tempArr = this.state.allLabelArr;
                        tempArr.push(responseData.result);
                        this.setState({
                            allLabelArr: tempArr,
                            lableName: '',
                            isLoading: false,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '创建成功',
                            ErrorPromptImg: require('../images/succeed.png'),
                        })
                        this.renderDoctorLabel();
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
                            ErrorPromptText: '创建失败，请重试',
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
    // 删除标签
    deleteLabel(id) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '提交中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("id", id);
        fetch(requestUrl.deleteLabel, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                "token": global.Token,
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    let tempArr = this.state.allLabelArr;
                    for (let i = 0; i < tempArr.length; i++) {
                        if (id == tempArr[i].id) {
                            tempArr.splice(i, 1);
                        }
                    }
                    this.setState({
                        allLabelArr: tempArr,
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '删除成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                    })
                    // 刷新基础标签展示
                    this.renderDoctorLabel();
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
                        ErrorPromptText: '系统标签，不可删除',
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

    // 根据患者ID查询 上传报告列表
    getMedicalReportList(pageNo) {
        fetch(requestUrl.getMedicalReportList + '?patientId=' + this.state.patientId + "&pageNo=" + pageNo + "&pageSize=1000", {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    let tempJSON = responseData.result;
                    let tempData = [];
                    for (const key in tempJSON) {
                        let _JSON = {};
                        _JSON["date"] = key;
                        _JSON["imgUrls"] = tempJSON[key];
                        tempData.push(_JSON)
                    }
                    if (tempData.length >= this.state.pageSize) {
                        let temp = this.state.reportArr;
                        temp = temp.concat(tempData);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            reportArr: temp,
                            reportDataFlag: true,
                        })
                    } else {
                        let temp = this.state.reportArr;
                        temp = temp.concat(tempData);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            reportArr: temp,
                            reportDataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        reportDataFlag: false,
                    })
                }
            }).catch((error) => {
                console.log('error', error);
            });
    }
    // 渲染上传报告
    renderReportItem = (item) => {
        let { navigate, goBack } = this.props.navigation;
        let tempArr = [];
        for (let i = 0; i < item.imgUrls.length; i++) {
            let _index = i;
            tempArr.push(
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {
                        navigate("LookImg", {
                            data: item.imgUrls,
                            index: _index,
                        })
                    }}
                    style={styles.imgItem}
                    key={i}
                >
                    <CachedImage style={styles.uploadImg} source={{ uri: item.imgUrls[i] }} />
                </TouchableOpacity>
            )
        }
        return (
            <View key={item.date} style={styles.uploadImgItem}>
                <Text style={styles.uploadImgTitle}>上传时间 {item.date}</Text>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: "wrap",
                }}>
                    {tempArr}
                </View>
                {/* <ScrollView
                    horizontal={true}
                >
                    {tempArr}
                </ScrollView> */}
            </View>
        )
    }
    // 上传报告加载更多
    onEndReachedReport() {
        if (this.state.reportDataFlag) {
            this.getMedicalReportList(this.state.reportPageNo * 1 + 1 + '');
            this.setState({ reportPageNo: this.state.reportPageNo * 1 + 1 + '' });
        }
    }


    // 渲染问诊记录
    renderInquiryItem = (item) => {
        let { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                activeOpacity={.8}
                onPress={() => {
                    navigate("OrderEnd", {
                        orderId: item.id
                    })
                }}
                key={item.id}
            >
                <View style={styles.inquiryItem}>
                    <View style={styles.inquiryTopBox}>
                        <Text style={styles.inquiryLeftText}>{item.patientName} {item.patientSex} {item.patientAge}岁</Text>
                        <Text style={styles.inquiryRightText}>{item.createTime}</Text>
                    </View>
                    <View style={styles.inquiryBottomBox}>
                        <Text style={styles.inquiryValue}>{item.orderDescription}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // 问诊记录加载更多
    onEndReachedInquiry() {
        if (this.state.inquiryDataFlag) {
            this.getOrderListByPatient(this.state.inquiryPageNo * 1 + 1 + '');
            this.setState({ inquiryPageNo: this.state.inquiryPageNo * 1 + 1 + '' });
        }
    }
    // 查询问诊记录
    getOrderListByPatient(pageNo) {
        fetch(requestUrl.getOrderListByPatient + '?patientId=' + this.state.patientId + "&pageNo=" + pageNo + "&pageSize=" + this.state.pageSize, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    if (responseData.result.length >= this.state.pageSize) {
                        let temp = this.state.inquiryArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            inquiryArr: temp,
                            inquiryDataFlag: true,
                        })
                    } else {
                        let temp = this.state.inquiryArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            inquiryArr: temp,
                            inquiryDataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        inquiryDataFlag: false,
                    })
                }
            }).catch((error) => {
                console.log('error', error);
            });
    }


    // 获取评估记录
    getAssessmentListByPatient(pageNo) {
        fetch(requestUrl.getAssessmentListByPatient + '?patientId=' + this.state.patientId + "&pageNo=" + pageNo + "&pageSize=" + this.state.pageSize, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    if (responseData.result.length >= this.state.pageSize) {
                        let temp = this.state.assessmentArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            assessmentArr: temp,
                            assessmentDataFlag: true,

                        })
                    } else {
                        let temp = this.state.assessmentArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            assessmentArr: temp,
                            assessmentDataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        assessmentDataFlag: false,
                    })
                }
            }).catch((error) => {
                console.log('error', error);
            });
    }
    renderAssessmentItem = (item) => {
        let { navigate, goBack } = this.props.navigation;
        return (
            <TouchableOpacity
                key={item.id}
                onPress={() => {
                    navigate("AssessmentDetails", {
                        id: item.id,
                        scoreType: item.scoreType,
                    })
                }}
                activeOpacity={.8}
            >
                <View style={styles.assessmentItem}>
                    <View style={styles.assessmentLeftBox}>
                        <Text style={styles.assessmentNum}>{item.totalScore}</Text>
                        <Text style={styles.assessmentDegree}>{item.caution}</Text>
                    </View>
                    <View style={styles.assessmentLine}></View>
                    <View style={styles.assessmentCenterBox}>
                        <Text style={styles.assessmentResult}>{item.scoreType == "A" ? "慢性前列腺炎" : "前列腺增生"}</Text>
                        <Text style={styles.assessmentTime}>评测时间 :{item.createTime}</Text>
                    </View>
                    <Image source={require('../images/arrow_right_grey.png')} />
                </View>
            </TouchableOpacity>
        )
    }
    onEndReachedAssessment() {
        if (this.state.assessmentDataFlag) {
            this.getAssessmentListByPatient(this.state.assessmentPageNo * 1 + 1 + '');
            this.setState({ assessmentPageNo: this.state.assessmentPageNo * 1 + 1 + '' });
        }
    }


    // 获取解读记录
    getExaminationListByPatient(pageNo) {
        fetch(requestUrl.getExaminationListByPatient + '?patientId=' + this.state.patientId + "&pageNo=" + pageNo + "&pageSize=" + this.state.pageSize, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    if (responseData.result.length >= this.state.pageSize) {
                        let temp = this.state.examinationArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            examinationArr: temp,
                            examinationDataFlag: true,
                        })
                    } else {
                        let temp = this.state.examinationArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            examinationArr: temp,
                            examinationDataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        examinationDataFlag: false,
                    })
                }
            }).catch((error) => {
                console.log('error', error);
            });
    }
    renderExaminationItem = (item) => {
        let { navigate, goBack } = this.props.navigation;
        return (
            <TouchableOpacity
                key={item.id}
                onPress={() => {
                    navigate("ReadDetails", {
                        id: item.id
                    })
                }}
                activeOpacity={.8}
            >
                <View style={styles.examinationItem}>
                    <Text style={styles.examinationTime}>{item.createTime}</Text>
                    <View style={styles.examinationBox}>
                        <Text style={styles.examinationText}>
                            {item.bloodRoutineAnswer ? "血常规/" : ""}
                            {item.digitalRectalAnswer ? "前列腺指/" : ""}
                            {item.expressedProstaticSecretionAnswer ? "前列腺按摩液/" : ""}
                            {item.specificAntigenAnswer ? "特异性抗原/" : ""}
                            {item.ultrasonographyBAnswer ? "B超/" : ""}
                            {item.urineFlowRateAnswer ? "尿流率/" : ""}
                            {item.urineRoutineAnswer ? "尿常规/" : ""}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    onEndReachedExamination() {
        if (this.state.examinationDataFlag) {
            this.getExaminationListByPatient(this.state.examinationPageNo * 1 + 1 + '');
            this.setState({ examinationPageNo: this.state.examinationPageNo * 1 + 1 + '' });
        }
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
        height: global.px2dp(107),
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
    scrollView: {
        position: 'absolute',
        top: global.NavHeight,
        left: 0,
        height: global.IOS ? global.SCREEN_HEIGHT - global.NavHeight : global.SCREEN_HEIGHT - global.NavHeight - global.AndroidCurrentHeight,
    },
    baseInfoBoxShadow: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        marginTop: global.px2dp(8),
    },
    baseInfoContent: {
        backgroundColor: global.Colors.textfff,
        height: global.px2dp(73),
        borderRadius: global.px2dp(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: global.px2dp(14),
        paddingRight: global.px2dp(14),
    },
    baseInfoBox: {

    },
    baseInfoText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    telText: {
        fontSize: global.px2dp(16),
        lineHeight: global.px2dp(25),
        color: global.Colors.text333,
    },
    rotatePatientBox: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: global.px2dp(27),
        height: global.px2dp(27),
        width: global.px2dp(79),
        backgroundColor: global.Colors.color,
    },
    rotatePatientText: {
        fontSize: global.px2dp(12),
        color: global.Colors.textfff,
    },
    // 基本信息-end
    content: {
        marginTop: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
        paddingBottom: global.px2dp(15),
    },
    titleBox: {
        position: 'relative',
        height: global.px2dp(35),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: global.px2dp(15),
    },
    titleLine: {
        width: global.px2dp(3),
        height: global.px2dp(15),
        backgroundColor: global.Colors.color,
    },
    titleText: {
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
        marginLeft: global.px2dp(5),
    },
    addLabelClick: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    addLabelClickText: {
        fontSize: global.px2dp(13),
        lineHeight: global.px2dp(35),
        color: global.Colors.color,
        paddingRight: global.px2dp(21),
    },
    medicalHistoryItem: {
        marginLeft: global.px2dp(22),
        marginRight: global.px2dp(15),
        paddingBottom: global.px2dp(4),
        borderBottomWidth: global.Pixel,
        borderBottomColor: global.Colors.text999,
    },
    medicalHistoryTitle: {
        fontSize: global.px2dp(14),
        color: global.Colors.text666,
        lineHeight: global.px2dp(25),
    },
    medicalHistoryValue: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
        lineHeight: global.px2dp(21),
    },
    labelContent: {
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    labelBox: {
        marginRight: global.px2dp(6),
        marginTop: global.px2dp(10),
        backgroundColor: global.Colors.colorbbd0e7,
        paddingLeft: global.px2dp(10),
        paddingBottom: global.px2dp(10),
        paddingTop: global.px2dp(10),
        paddingRight: global.px2dp(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: global.px2dp(3),
    },
    labelText: {
        fontSize: global.px2dp(13),
        color: global.Colors.text666,
    },
    swiperContent: {
        marginTop: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
    },
    tabScrollView: {
        borderBottomColor: global.Colors.text999,
        borderBottomWidth: global.Pixel,
    },
    tabContent: {
        height: global.px2dp(43),
        flexDirection: 'row',
        alignItems: 'center',

    },
    tabBox: {
        height: global.px2dp(43),
        borderBottomWidth: global.px2dp(2),
        justifyContent: 'center',
        marginRight: global.px2dp(14),
        marginLeft: global.px2dp(14),
        borderBottomColor: global.Colors.transparent,
    },
    tabText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    contentItem: {
        width: global.SCREEN_WIDTH,
        backgroundColor: global.Colors.textfff,
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
        paddingBottom: global.px2dp(19),
    },
    contentTitleText: {
        fontSize: global.px2dp(15),
        color: global.Colors.text333,
        lineHeight: global.px2dp(40),
    },
    // 垂直滚动容器
    itemBox: {
        // height: global.px2dp(238),
        backgroundColor: global.Colors.colorededed,
        // paddingLeft: global.px2dp(8),
        // paddingRight: global.px2dp(8),
        paddingBottom: global.px2dp(8),
        // paddingTop: global.px2dp(8),
    },
    // 上传报告 - start
    uploadImgItem: {
        marginLeft: global.px2dp(8),
        marginRight: global.px2dp(8),
        marginTop: global.px2dp(8),
        backgroundColor: global.Colors.textfff,
    },
    uploadImgTitle: {
        fontSize: global.px2dp(13),
        color: global.Colors.text333,
        paddingLeft: global.px2dp(10),
        paddingRight: global.px2dp(10),
        lineHeight: global.px2dp(33),
        borderBottomWidth: global.Pixel,
        borderBottomColor: global.Colors.text999,
    },
    uploadImg: {
        width: global.px2dp(61),
        height: global.px2dp(56),
        borderWidth: global.Pixel,
        borderColor: global.Colors.textfff,
        borderRadius: global.px2dp(3),
        marginLeft: global.px2dp(6),
        marginRight: global.px2dp(6),
        marginBottom: global.px2dp(12),
        marginTop: global.px2dp(12),
    },
    // 上传报告 - end
    // 问诊记录 - start
    inquiryItem: {
        marginLeft: global.px2dp(8),
        marginRight: global.px2dp(8),
        marginTop: global.px2dp(8),
        backgroundColor: global.Colors.textfff,
    },
    inquiryTopBox: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        height: global.px2dp(35),
        paddingLeft: global.px2dp(10),
        paddingRight: global.px2dp(10),
        borderBottomColor: global.Colors.text999,
        borderBottomWidth: global.Pixel,
    },
    inquiryLeftText: {
        fontSize: global.px2dp(15),
        color: global.Colors.text333,
    },
    inquiryRightText: {
        fontSize: global.px2dp(12),
        color: global.Colors.text999,
    },
    inquiryBottomBox: {
        paddingTop: global.px2dp(7),
        paddingBottom: global.px2dp(7),
        paddingLeft: global.px2dp(10),
        paddingRight: global.px2dp(10),
    },
    inquiryValue: {
        fontSize: global.px2dp(12),
        color: global.Colors.text666,
        lineHeight: global.px2dp(15),
        height: global.px2dp(30),
        overflow: "hidden",
    },
    // 问诊记录 - end
    // 评估记录 - start
    assessmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: global.Colors.textfff,
        height: global.px2dp(64),
        marginLeft: global.px2dp(8),
        marginRight: global.px2dp(8),
        marginTop: global.px2dp(8),
        paddingLeft: global.px2dp(3),
        paddingRight: global.px2dp(13),
    },
    assessmentLeftBox: {
        height: global.px2dp(40),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: global.px2dp(10),
        paddingRight: global.px2dp(10),
    },
    assessmentNum: {
        fontSize: global.px2dp(18),
        color: global.Colors.color398bcb,
    },
    assessmentDegree: {
        fontSize: global.px2dp(14),
        color: global.Colors.color398bcb,
    },
    assessmentLine: {
        width: global.Pixel,
        height: global.px2dp(36),
        backgroundColor: global.Colors.text666,
    },
    assessmentCenterBox: {
        height: global.px2dp(36),
        justifyContent: 'space-between',
        flex: 1,
        marginLeft: global.px2dp(12),
        marginRight: global.px2dp(12),
    },
    assessmentResult: {
        fontSize: global.px2dp(15),
        color: global.Colors.color,
    },
    assessmentTime: {
        fontSize: global.px2dp(12),
        color: global.Colors.text666,
    },
    // 评估记录 - end
    // 解读记录 - start
    examinationItem: {
        backgroundColor: global.Colors.textfff,
        paddingLeft: global.px2dp(14),
        paddingRight: global.px2dp(14),
        marginLeft: global.px2dp(8),
        marginRight: global.px2dp(8),
        marginTop: global.px2dp(8),
    },
    examinationTime: {
        lineHeight: global.px2dp(32),
        fontSize: global.px2dp(14),
        color: global.Colors.color,
    },
    examinationBox: {
        overflow: 'hidden',
        height: global.px2dp(50),
        paddingTop: global.px2dp(5),
        paddingBottom: global.px2dp(5),
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.text999,
    },
    examinationText: {
        fontSize: global.px2dp(13),
        color: global.Colors.text666,
        lineHeight: global.px2dp(18),
    },
    // 解读记录 - end

    // 添加标签 部分 - start
    maskLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: global.SCREEN_WIDTH,

        backgroundColor: 'rgba(0,0,0,.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    maskLabelContent: {
        width: global.px2dp(345),
        height: global.px2dp(375),
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(3),
    },
    labelTitleBox: {
        paddingLeft: global.px2dp(10),
        height: global.px2dp(45),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: global.Colors.bgColor,
        borderBottomColor: global.Colors.colorccc,
        borderBottomWidth: global.Pixel,
    },
    labelTitleText: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
    },
    baseLabelContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: global.px2dp(18),
        paddingRight: global.px2dp(18),
        paddingBottom: global.px2dp(9),
        paddingTop: global.px2dp(5),
    },
    baseLabelItem: {
        position: 'relative',
        paddingRight: global.px2dp(12),
        paddingTop: global.px2dp(12),
    },
    baseLabelBox: {
        position: 'relative',
        left: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
        borderRadius: global.px2dp(6),
        backgroundColor: global.Colors.color,
    },
    delLabelBtn: {
        position: 'absolute',
        top: global.px2dp(3),
        right: global.px2dp(3),
        zIndex: 1,
    },
    baseLabelText: {
        fontSize: global.px2dp(),
        lineHeight: global.px2dp(32),
        color: global.Colors.textfff,
    },
    separateText: {
        fontSize: global.px2dp(15),
        color: global.Colors.text333,
        lineHeight: global.px2dp(42),
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    textareaStyle: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        backgroundColor: global.Colors.bgColor,
        paddingLeft: global.px2dp(8),
        paddingRight: global.px2dp(8),
        paddingTop: global.px2dp(8),
        paddingBottom: global.px2dp(8),
        fontSize: global.px2dp(14),
        lineHeight: global.px2dp(20),
        height: global.px2dp(72),
        // textAlignVertical: 'top'
    },
    addLabelBtn: {
    },
    addLabelBox: {
        width: global.px2dp(250),
        height: global.px2dp(42),
        borderRadius: global.px2dp(5),
        backgroundColor: global.Colors.color,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: global.px2dp(21),
        marginLeft: global.px2dp(48),
    },
    addLabelText: {
        fontSize: global.px2dp(16),
        color: global.Colors.textfff,
    },
    // 添加标签 部分 - end

    // 申请转诊 - start
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
    affirmDoctorText: {
        fontSize: global.px2dp(17),
        color: global.Colors.color,
    },
    btnBox: {
        height: global.px2dp(45),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.text999,
    },
    btnClick: {
        flex: 1,
        height: global.px2dp(45),
        alignItems: 'center',
        justifyContent: 'center',
    },
    noBtnText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text666,
    },
    yesBtnText: {
        fontSize: global.px2dp(17),
        color: global.Colors.color,
    },
    // 申请转诊 - start

});

