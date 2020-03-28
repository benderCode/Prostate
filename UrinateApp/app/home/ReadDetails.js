import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import ErrorPrompt from "../common/ErrorPrompt";
import Nav from "../common/Nav";// 导航组件
export default class ReadDetails extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,

            ErrorPromptFlag: false,
            ErrorPromptText: '',
            ErrorPromptImg: '',

            activeTab: 0,
            medicalExaminationRemark: '',// 总的结果

            detailsFlag: true,

            navArr: [],
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        if (this.props.navigation.state.params) {
            this.setState({
                isLoading: true,
                ErrorPromptFlag: true,
                ErrorPromptText: '加载中...',
                ErrorPromptImg: require('../images/loading.png'),
            })
            fetch(requestUrl.getExaminationDetails + "?id=" + this.props.navigation.state.params.id, {
                method: 'GET',
                headers: {
                    
                    "token": global.Token,
                },
            }).then((response) => response.json())
                .then((responseData) => {
                    console.log('responseData', responseData);
                    if (responseData.code == 20000) {
                        let navArr = [];
                        if (responseData.result.bloodRoutineAnswer) {
                            navArr.push({
                                name: "血常规",
                                value: responseData.result.bloodRoutineRemark,
                            })
                        }
                        if (responseData.result.digitalRectalAnswer) {
                            // 前列腺指诊
                            navArr.push({
                                name: "前列腺指诊",
                                value: responseData.result.digitalRectalRemark,
                            })
                        }
                        if (responseData.result.expressedProstaticSecretionAnswer) {
                            // 前列腺按摩液
                            navArr.push({
                                name: "前列腺按摩液",
                                value: responseData.result.expressedProstaticSecretionRemark,
                            })
                        }
                        if (responseData.result.specificAntigenAnswer) {
                            // 特异性抗原
                            navArr.push({
                                name: "特异性抗原",
                                value: responseData.result.specificAntigenRemark,
                            })
                        }
                        if (responseData.result.ultrasonographyBAnswer) {
                            // B超
                            navArr.push({
                                name: "B超",
                                value: responseData.result.ultrasonographyBRemark,
                            })
                        }
                        if (responseData.result.urineFlowRateAnswer) {
                            // 尿流率
                            navArr.push({
                                name: "尿流率",
                                value: responseData.result.urineFlowRateRemark,
                            })
                        }
                        if (responseData.result.urineRoutineAnswer) {
                            // 尿常规
                            navArr.push({
                                name: "尿常规",
                                value: responseData.result.urineRoutineRemark,
                            })
                        }
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            medicalExaminationRemark: responseData.result.medicalExaminationRemark.replace(regExp.RegHtmlLabel, ''),
                            navArr: navArr,
                        })
                    } else {
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: true,
                            ErrorPromptText: '加载失败，请重试',
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
    componentDidMount() {
        // 4获取数据 在 render 后
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Nav isLoading={this.state.isLoading} title={"解读报告详情"} leftClick={this.goBack.bind(this)} />
                <ScrollView>
                    <View style={styles.reportContent}>
                        <View style={styles.titleBox}>
                            <View style={styles.titleLine}></View>
                            <Text style={styles.titleText}>化验单结果</Text>
                        </View>
                        <Text style={styles.value}>{this.state.medicalExaminationRemark}</Text>
                    </View>
                    {this.state.detailsFlag ?
                        <View style={styles.minuteContent}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={styles.navScroll}
                            >
                                {this.state.navArr && this.state.navArr.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    activeTab: index,
                                                })
                                                this.refs.bodyScroll.scrollTo({
                                                    x: (global.SCREEN_WIDTH - global.px2dp(30)) * index,
                                                    animated: true
                                                })
                                            }}
                                            key={index}
                                            activeOpacity={.8}
                                            style={styles.navItemClick}
                                        >
                                            <View style={[styles.navBox, this.state.activeTab == index ? { borderBottomColor: global.Colors.color } : null]}>
                                                <Text style={[styles.navText, this.state.activeTab == index ? { color: global.Colors.color } : null]}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                            <ScrollView
                                ref={"bodyScroll"}
                                horizontal={true}
                                pagingEnabled={true}
                                showsHorizontalScrollIndicator={false}
                                style={styles.bodyScroll}
                                onMomentumScrollEnd={(e) => {
                                    this.setState({
                                        activeTab: e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
                                    })
                                }}
                            >
                                {this.state.navArr && this.state.navArr.map((item, index) => {
                                    return (
                                        <View style={styles.bodyItem} key={index}>
                                            <Text style={styles.bodyTitle}>{item.name}</Text>
                                            <Text style={styles.bodyText}>{item.value}</Text>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View>
                        : null}
                </ScrollView>
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View>
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    reportContent: {
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(5),
        marginLeft: global.px2dp(15),
        marginTop: global.px2dp(15),
        marginRight: global.px2dp(15),
        paddingTop: global.px2dp(5),
    },
    titleBox: {
        height: global.px2dp(30),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: global.px2dp(7),
    },
    titleLine: {
        width: global.px2dp(3),
        height: global.px2dp(16),
        backgroundColor: global.Colors.color,
        borderRadius: global.px2dp(3),
    },
    titleText: {
        fontSize: global.px2dp(17),
        color: global.Colors.color,
        marginLeft: global.px2dp(4),
    },
    value: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        lineHeight: global.px2dp(21),
        marginLeft: global.px2dp(14),
        marginRight: global.px2dp(9),
        marginBottom: global.px2dp(15),
    },

    minuteContent: {
        marginTop: global.px2dp(15),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(5),
    },
    navScroll: {
        borderBottomColor: global.Colors.colorccc,
        borderBottomWidth: global.Pixel,
    },
    navBox: {
        height: global.px2dp(42),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: global.px2dp(2),
        borderBottomColor: global.Colors.transparent,
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    navText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    bodyScroll: {
        height: global.px2dp(360),
        paddingBottom: global.px2dp(15),
    },
    bodyItem: {
        width: global.SCREEN_WIDTH - global.px2dp(30),
        paddingLeft: global.px2dp(10),
        paddingRight: global.px2dp(10),
    },
    bodyTitle: {
        lineHeight: global.px2dp(43),
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
    },
    bodyText: {
        fontSize: global.px2dp(16),
        color: global.Colors.text666,
        lineHeight: global.px2dp(20),
    },
});

