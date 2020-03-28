import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput, StatusBar, ScrollView, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import ErrorPrompt from "../common/ErrorPrompt";
import LinearGradient from 'react-native-linear-gradient';
import { Storage } from "../utils/AsyncStorage";
import { NavigationEvents } from "react-navigation";
import { CachedImage, ImageCache } from "react-native-img-cache";

export default class DoctorSearch extends Component {
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

            userInfo: {},

            searchText: '',// 搜索文字
            hospitalId: '',// 医院id
            pageSize: 10,//每页多少条
            pageNo: 1,// 页码

            doctorArr: [],// 医生数组
            dataFlag: true,// 是否还有下一页
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        // 2仅调用一次在 render 前
    }
    componentDidMount() {
        Storage.getItem("userInfo", (data) => {
            if (data) {
                this.setState({
                    userInfo: data,
                    signStatus: 'AUTHENTICATION_SUCCESS',
                })
            } else {
                this.setState({
                    isLoading: true,
                    ErrorPromptFlag: true,
                    ErrorPromptText: '加载中...',
                    ErrorPromptImg: require('../images/loading.png'),
                });
                this.getDoctorDetail();
            }
        })
    }
    // 获取个人信息
    getDoctorDetail() {
        fetch(requestUrl.getDoctorDetail, {
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
                    });
                    Storage.setItem("userInfo", responseData.result, (data) => {
                        console.log(data)
                    });
                } else if (responseData == 40004) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '您还未认证',
                        ErrorPromptImg: require('../images/error.png'),
                    })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setState({
                            ErrorPromptFlag: false,
                        })
                    }, global.TimingCount)
                } else if (responseData == 50000) {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '服务器繁忙',
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
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => {
                        this.setState({
                            doctorArr: [],
                            pageNo: 1,
                        })
                        this.findDoctorList(this.state.searchText, 1, this.state.hospitalId);
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
                    colors={global.LinearGradient}
                    style={styles.linearGradient}>
                    <View style={styles.navContent}>
                        <View style={styles.searchBox}>
                            <Image style={styles.searchImg} source={require('../images/search.png')} />
                            <TextInput
                                ref={'search'}
                                style={styles.textInput}
                                placeholder={"请输入医师名字"}
                                placeholderTextColor={global.Colors.placeholder}
                                autoFocus={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        searchText: text.replace(/[^\u4e00-\u9fa5]/gi, '')
                                    });
                                }}
                                onSubmitEditing={() => {
                                    this.setState({
                                        doctorArr: [],
                                        pageNo: 1,
                                    })
                                    this.findDoctorList(this.state.searchText, 1, this.state.hospitalId);
                                }}
                                defaultValue={this.state.searchText}
                                underlineColorAndroid={'transparent'}
                                keyboardType={"default"}
                                enablesReturnKeyAutomatically={true}//ios禁止空确认
                                returnKeyType={'search'}
                            // returnKeyLabel
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                goBack();
                            }}
                            style={styles.navBtn}
                        >
                            <Text style={styles.navText}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                {/* tab切换 - start */}
                <View style={styles.tabContent}>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.setState({
                                hospitalId: '',
                                doctorArr: [],
                                pageNo: 1,
                            })
                            this.findDoctorList(this.state.searchText, 1, '');
                        }}
                        style={styles.itemBtn}
                    >
                        <View style={[styles.itemBox, !this.state.hospitalId ? { borderBottomColor: global.Colors.color } : null]}>
                            <Text style={[styles.itemText, !this.state.hospitalId ? { color: global.Colors.color } : null]}>全部</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => {
                            this.setState({
                                hospitalId: this.state.userInfo.hospitalId,
                                doctorArr: [],
                                pageNo: 1,
                            })
                            this.findDoctorList(this.state.searchText, 1, this.state.userInfo.hospitalId);
                        }}
                        style={styles.itemBtn}
                    >
                        <View style={[styles.itemBox, this.state.hospitalId ? { borderBottomColor: global.Colors.color } : null]}>
                            <Text style={[styles.itemText, this.state.hospitalId ? { color: global.Colors.color } : null]}>本院</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* tab切换 - end */}
                <FlatList
                    style={styles.flatListStyle}
                    data={this.state.doctorArr}
                    // initialNumToRender={10}
                    keyExtractor={item => item.id}
                    // ListFooterComponent={() => {
                    // 尾部组件
                    // }}
                    renderItem={({ item }) => this.doctorRenderItem(item)}
                    // 分隔线
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{
                                height: global.Pixel,
                                backgroundColor: global.Colors.text999,
                            }}></View>
                        )
                    }}
                    onRefresh={() => {
                        this.setState({
                            doctorArr: [],
                            pageNo: 1,
                        })
                        this.findDoctorList(this.state.searchText, 1, this.state.hospitalId);
                    }}//头部刷新组件
                    refreshing={this.state.isRefresh}//加载图标
                    onEndReached={() => this.onEndReached()} // 加载更多
                    onEndReachedThreshold={.2}// 加载更多触发时机
                    ListEmptyComponent={() => {
                        // 无数据时显示的内容
                        return (
                            <View style={styles.noDataBox}>
                                <Image source={require('../images/no_concern.png')} />
                                <Text style={styles.noDataText}>暂无此位医师</Text>
                            </View>
                        )
                    }}
                />
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View>
        );
    }
    doctorRenderItem = (item) => {
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate('DoctorDetails', { doctorId: item.id });
                }
                }
                activeOpacity={.8}
                key={item.id}
            >
                <View style={styles.itemContent}>
                    <CachedImage
                        style={styles.doctorImg}
                        source={item.headImg ? { uri: item.headImg } : require('../images/default_doc_img.png')} />
                    <View style={styles.infoBox}>
                        <Text style={styles.infoName}>{item.doctorName}</Text>
                        <Text style={styles.infoTitle}>{item.titleName}</Text>
                        <Text style={styles.infoHospital}>{item.hospitalName}</Text>
                    </View>
                    {item.areFans ?
                        // 已经关注
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
                        :
                        // 未关注
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                this.focus(item.id);
                            }}
                            style={styles.concernBtn}
                        >
                            <View style={styles.concernBox}>
                                <Image
                                    style={styles.concernImg}
                                    source={require('../images/attention_no.png')} />
                                <Text style={styles.concernText}>关注</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </TouchableOpacity>
        )
    }
    // 加载更多
    onEndReached() {
        if (this.state.dataFlag) {
            this.findDoctorList(this.state.searchText, this.state.pageNo * 1 + 1 + '', this.state.hospitalId);
            this.setState({ pageNo: this.state.pageNo * 1 + 1 + '' });
        }
    }

    // 查医生列表
    findDoctorList(searchText, pageNo, hospitalId) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '加载中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        if (hospitalId) {
            var url = requestUrl.findDoctorList + '?doctorName=' + searchText + '&pageSize=' + this.state.pageSize + '&pageNo=' + pageNo + '&hospitalId=' + hospitalId;
        } else {
            var url = requestUrl.findDoctorList + '?doctorName=' + searchText + '&pageSize=' + this.state.pageSize + '&pageNo=' + pageNo;
        }
        fetch(url, {
            method: 'GET',
            headers: {
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    let newData = responseData.result;
                    for (let i = 0; i < newData.length; i++) {
                        if (newData[i].id == global.Token) {
                            newData.splice(i, 1);
                        }
                    }
                    if (responseData.result.length >= this.state.pageSize) {
                        let temp = this.state.doctorArr;
                        temp = temp.concat(newData);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            doctorArr: temp,
                            dataFlag: true,
                        })
                    } else {
                        let temp = this.state.doctorArr;
                        temp = temp.concat(newData);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            doctorArr: temp,
                            dataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        doctorArr: [],
                    })
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    // 加关注
    focus(doctorId) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '加载中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        let formData = new FormData();
        formData.append("doctorId", doctorId);
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
                    let tempDoctorArr = this.state.doctorArr;
                    for (var i = 0; i < tempDoctorArr.length; i++) {
                        if (tempDoctorArr[i].id == doctorId) {
                            tempDoctorArr[i].areFans = true;
                        }
                    }
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: true,
                        ErrorPromptText: '关注成功',
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
                            tempDoctorArr[i].areFans = false;
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
        flex: 1,
        backgroundColor: global.Colors.textfff,
    },
    linearGradient: {
        paddingTop: global.StatusBarHeight,
        height: global.NavHeight,
    },
    navContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: global.NavHeight - global.StatusBarHeight,
        paddingLeft: global.px2dp(15),
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: global.Colors.textfff,
        height: global.px2dp(28),
        borderRadius: global.px2dp(14),
        paddingLeft: global.px2dp(13),
    },
    searchImg: {
        marginRight: global.px2dp(11),
    },
    textInput: {
        flex: 1,
        padding: 0,
        alignItems: 'center',
        fontSize: global.px2dp(14),
    },
    navBtn: {
        justifyContent: 'center',
        height: global.NavHeight - global.StatusBarHeight,
    },
    navText: {
        color: global.Colors.textfff,
        fontSize: global.px2dp(17),
        paddingRight: global.px2dp(15),
        paddingLeft: global.px2dp(15),
    },
    // 导航 - end
    flatListStyle: {
        // paddingLeft: global.px2dp(15),
        // paddingRight: global.px2dp(15),
        paddingBottom: global.px2dp(15),
    },
    // 列表 item - start
    boxShadow: {
        marginTop: global.px2dp(15),
    },
    itemContent: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
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
    concernBtn: {

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
    },
    // 无数据部分 - end
    // tab部分 - start
    tabContent: {
        height: global.px2dp(40),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: global.Colors.colorccc,
        borderBottomWidth: global.Pixel,
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    itemBtn: {

    },
    itemBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: global.Colors.transparent,
        borderBottomWidth: global.px2dp(3),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
        paddingLeft: global.px2dp(5),
        paddingRight: global.px2dp(5),
    },
    itemText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    }
    // tab部分 - end
});

