import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, StatusBar, Image } from 'react-native';
import ErrorPrompt from "../common/ErrorPrompt";
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import { BoxShadow } from 'react-native-shadow';
import Nav from "../common/Nav";
import { NavigationEvents } from "react-navigation";
import { CachedImage, ImageCache } from "react-native-img-cache";

export default class Contact extends Component {
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

            pageSize: 10,// 每页数量
            pageNo: 1,// 页码

            doctorArr: [],// 医生数组
            dataFlag: true,// 是否有下一页
        }
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container} >
                <NavigationEvents
                    onWillFocus={() => {
                        this.setState({
                            pageNo: 1,
                            doctorArr: [],
                        })
                        this.findStar(1);
                    }}
                />
                <Nav
                    isLoading={this.state.isLoading}
                    title={"我的医生"}
                    leftClick={this.goBack.bind(this)}
                />
                <FlatList
                    style={styles.flatListStyle}
                    data={this.state.doctorArr}
                    initialNumToRender={10}
                    keyExtractor={item => item.id}
                    // ListFooterComponent={() => {
                    // 尾部组件
                    // }}
                    renderItem={({ item }) => this.doctorRenderItem(item)}
                    onRefresh={() => {
                        this.setState({
                            pageNo: 1,
                            doctorArr: [],
                        })
                        this.findStar(1);
                    }}//头部刷新组件
                    refreshing={this.state.isRefresh}//加载图标
                    onEndReached={() => this.onEndReached()} // 加载更多
                    onEndReachedThreshold={.1}// 加载更多触发时机
                    ListEmptyComponent={() => {
                        // 无数据时显示的内容
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../images/no_concern.png')} />
                                <Text style={styles.noDataText}>您还没有关注过医生，快去关注吧</Text>
                                <TouchableOpacity
                                    style={styles.addConcernBtn}
                                    activeOpacity={.8}
                                    onPress={() => { navigate("DoctorSearch"); }}>
                                    <View style={styles.addConcernBox}>
                                        <Text style={styles.addConcernText}>去关注</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View >
        );
    }
    doctorRenderItem = (item) => {
        const shadowOpt = {
            width: global.px2dp(346),
            height: global.px2dp(83),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .1,
            x: 0,
            y: 0,
            style: styles.boxShadow,
        }
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate('DoctorDetails', { doctorId: item.id });
                }}
                activeOpacity={.8}
                key={item.id}
            >
                <BoxShadow
                    setting={shadowOpt}>
                    <View style={styles.itemContent}>
                        <CachedImage
                            style={styles.doctorImg}
                            source={item.headImg ? { uri: item.headImg } : require('../images/default_doc_img.png')} />
                        <View style={styles.infoBox}>
                            <Text style={styles.infoName}>{item.doctorName}</Text>
                            <Text style={styles.infoTitle}>{item.titleName}</Text>
                            <Text style={styles.infoHospital}>{item.hospitalName}</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                this.unFocus(item.id);
                            }}
                            style={styles.concernBtn}
                        >
                            <View style={styles.noConcernBox}>
                                <Image
                                    style={styles.concernImg}
                                    source={require('../images/attention_yes.png')} />
                                <Text style={styles.noConcernText}>已关注</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </BoxShadow>
            </TouchableOpacity>
        )
    }
    goBack() {
        this.props.navigation.goBack();
    }

    // 加载更多
    onEndReached() {
        // 判断是否还有数据 
        if (this.state.dataFlag) {
            this.findStar(this.state.pageNo * 1 + 1 + '');
            this.setState({ pageNo: this.state.pageNo * 1 + 1 + '' });
        }
    }
    // 加载数据
    findStar(pageNo) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '加载中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        fetch(requestUrl.findStar + '?pageSize=' + this.state.pageSize + '&pageNo=' + pageNo, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    if (responseData.result.length >= this.state.pageSize) {
                        let temp = this.state.doctorArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            doctorArr: temp,
                            dataFlag: true,
                        })
                    } else {
                        let temp = this.state.doctorArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            doctorArr: temp,
                            dataFlag: false,
                        })
                    }
                } else if (responseData.code == 40001) {
                    this.props.navigation.navigate('SignIn')
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        doctorArr: [],
                        dataFlag: false,
                    })
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    // 取消关注
    unFocus(doctorId) {
        let formData = new FormData();
        formData.append("doctorId", doctorId);
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
                    let tempDoctorArr = this.state.doctorArr;
                    for (var i = 0; i < tempDoctorArr.length; i++) {
                        if (tempDoctorArr[i].id == doctorId) {
                            tempDoctorArr.splice(i, 1);
                        }
                    }
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '取消关注成功',
                        ErrorPromptImg: require('../images/succeed.png'),
                        doctorArr: tempDoctorArr,
                    })
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
    linearGradient: {
        paddingTop: global.StatusBarHeight,
        height: global.NavHeight,
    },
    navBtn: {
        justifyContent: 'center',
        height: global.NavHeight - global.StatusBarHeight,
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    navContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: global.Colors.textfff,
        height: global.px2dp(28),
        borderRadius: global.px2dp(14),
        paddingLeft: global.px2dp(13),
        paddingRight: global.px2dp(13),
    },
    searchImg: {
        marginRight: global.px2dp(11),
    },
    searchPlaceholderText: {
        flex: 1,
        color: global.Colors.placeholder,
        fontSize: global.px2dp(14),
    },
    searchBtnText: {
        color: global.Colors.color,
        fontSize: global.px2dp(14),
    },
    flatListStyle: {
        paddingBottom: global.px2dp(8),
        paddingTop: global.px2dp(8),
    },
    // 列表 item - start
    boxShadow: {
        marginTop: global.px2dp(8),
        marginBottom: global.px2dp(8),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    itemContent: {
        height: global.px2dp(83),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(6),
    },
    doctorImg: {
        width: global.px2dp(61),
        height: global.px2dp(61),
        borderRadius: global.px2dp(30),
        borderColor: global.Colors.text333,
        borderWidth: global.Pixel,
        marginLeft: global.px2dp(17),
        marginRight: global.px2dp(25),
    },
    infoBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoName: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
        marginRight: global.px2dp(9),
        lineHeight: global.px2dp(23),
    },
    infoTitle: {
        fontSize: global.px2dp(15),
        color: global.Colors.text333,
        lineHeight: global.px2dp(23),
    },
    infoHospital: {
        fontSize: global.px2dp(15),
        color: global.Colors.text555,
        lineHeight: global.px2dp(20),
    },
    concernBox: {
        width: global.px2dp(64),
        height: global.px2dp(29),
        borderColor: global.Colors.color,
        borderWidth: global.Pixel,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: global.px2dp(5),
        marginRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
    },
    noConcernBox: {
        width: global.px2dp(64),
        height: global.px2dp(29),
        borderColor: global.Colors.colorccc,
        borderWidth: global.Pixel,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: global.px2dp(5),
        marginRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
    },
    concernImg: {

    },
    concernText: {
        fontSize: global.px2dp(12),
        color: global.Colors.color,
    },
    noConcernText: {
        fontSize: global.px2dp(12),
        color: global.Colors.text666,
    },
    // 列表 item - end

    // 无数据部分 - start
    noDataBox: {
        marginTop: global.px2dp(99),
        alignItems: 'center',
    },
    noDataText: {
        marginTop: global.px2dp(27),
        marginBottom: global.px2dp(22),
        fontSize: global.px2dp(17),
        color: global.Colors.text666,
    },
    addConcernBtn: {
        width: global.px2dp(168),
        height: global.px2dp(35),
        borderColor: global.Colors.color,
        borderWidth: global.Pixel,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: global.px2dp(6),
    },
    addConcernText: {
        fontSize: global.px2dp(15),
        color: global.Colors.color,
    }
    // 无数据部分 - end

});

