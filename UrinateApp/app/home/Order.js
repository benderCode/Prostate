import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import ErrorPrompt from "../common/ErrorPrompt";
import Nav from "../common/Nav";// 导航组件
import { BoxShadow } from 'react-native-shadow';
import { NavigationEvents } from "react-navigation";
export default class Order extends Component {
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

            orderArr: [],// 订单数据
            pageNo: 1,// 页码
            pageSize: 10,// 每页数量
            dataFlag: true,// 是否还有下一页

            screenFlag: false,// 切换部分 是否显示
            screenActive: 2,//切换焦点
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        if (this.props.navigation.state.params) {
            if (!this.props.navigation.state.params.activeFlag) {
                this.setState({
                    screenActive: 1,
                })
            }
        }
    }
    componentDidMount() {
        // 4获取数据 在 render 后
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={() => {
                        this.setState({
                            orderArr: [],
                            pageNo: 1,
                        })
                        this.getOrderList(1, this.state.screenActive);
                    }}
                />
                <Nav
                    isLoading={this.state.isLoading}
                    title={"问诊订单"}
                    leftClick={this.goBack.bind(this)}
                    rightClick={this.screen.bind(this)}
                    dom={
                        <View style={styles.screenBox}>
                            <Text style={styles.rightBtnText}>筛选</Text>
                            <Image
                                style={styles.screenImg}
                                source={require('../images/screen.png')} />
                        </View>
                    } />
                {this.state.screenFlag ?
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                screenFlag: !this.state.screenFlag
                            })
                        }}
                        activeOpacity={.8}
                        style={styles.screenMaskBtn}
                    >
                        <TouchableOpacity
                            onPress={() => { }}
                            activeOpacity={1}
                        >
                            <View style={styles.screenContent}>
                                <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() => {
                                        this.setState({
                                            screenActive: 0,
                                            orderArr: [],
                                            pageNo: 1,
                                            screenFlag: !this.state.screenFlag,
                                        })
                                        this.getOrderList(1, 0);
                                    }}
                                    style={styles.screenItemBtn}
                                >
                                    <View style={[styles.screenItem, this.state.screenActive == 0 ? { borderColor: global.Colors.color } : null]}>
                                        <Text style={[styles.screenText, this.state.screenActive == 0 ? { color: global.Colors.color } : null]}>全部</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() => {
                                        this.setState({
                                            screenActive: 1,
                                            orderArr: [],
                                            pageNo: 1,
                                            screenFlag: !this.state.screenFlag,
                                        })
                                        this.getOrderList(1, 1);
                                    }}
                                    style={styles.screenItemBtn}
                                >
                                    <View style={[styles.screenItem, this.state.screenActive == 1 ? { borderColor: global.Colors.color } : null]}>
                                        <Text style={[styles.screenText, this.state.screenActive == 1 ? { color: global.Colors.color } : null]}>待回复</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() => {
                                        this.setState({
                                            screenActive: 2,
                                            orderArr: [],
                                            pageNo: 1,
                                            screenFlag: !this.state.screenFlag,
                                        })
                                        this.getOrderList(1, 2);
                                    }}
                                    style={styles.screenItemBtn}
                                >
                                    <View style={[styles.screenItem, this.state.screenActive == 2 ? { borderColor: global.Colors.color } : null]}>
                                        <Text style={[styles.screenText, this.state.screenActive == 2 ? { color: global.Colors.color } : null]}>待接收</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() => {
                                        this.setState({
                                            screenActive: 3,
                                            orderArr: [],
                                            pageNo: 1,
                                            screenFlag: !this.state.screenFlag,
                                        })
                                        this.getOrderList(1, 3);
                                    }}
                                    style={styles.screenItemBtn}
                                >
                                    <View style={[styles.screenItem, this.state.screenActive == 3 ? { borderColor: global.Colors.color } : null]}>
                                        <Text style={[styles.screenText, this.state.screenActive == 3 ? { color: global.Colors.color } : null]}>已拒绝</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={.8}
                                    onPress={() => {
                                        this.setState({
                                            screenActive: 4,
                                            orderArr: [],
                                            pageNo: 1,
                                            screenFlag: !this.state.screenFlag,
                                        })
                                        this.getOrderList(1, 4);
                                    }}
                                    style={styles.screenItemBtn}
                                >
                                    <View style={[styles.screenItem, this.state.screenActive == 4 ? { borderColor: global.Colors.color } : null]}>
                                        <Text style={[styles.screenText, this.state.screenActive == 4 ? { color: global.Colors.color } : null]}>已完成</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    : null}
                <ScrollView>
                    <FlatList
                        style={styles.flatListStyle}
                        data={this.state.orderArr}
                        initialNumToRender={10}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => this.orderRenderItem(item)}
                        onRefresh={() => {
                            this.setState({
                                orderArr: [],
                                pageNo: 1,
                            })
                            this.getOrderList(1, this.state.screenActive);
                        }}//头部刷新组件
                        refreshing={this.state.isRefresh}//加载图标
                        onEndReached={() => this.onEndReached()} // 加载更多
                        onEndReachedThreshold={.1}// 加载更多触发时机
                        ListEmptyComponent={() => {
                            // 无数据时显示的内容
                            return (
                                <View style={styles.noDataBox}>
                                    <Image source={require("../images/no_order.png")} />
                                    <Text style={styles.noDataText}>您暂无问诊订单</Text>
                                </View>
                            )
                        }}
                    />
                </ScrollView>
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View>
        );
    }
    orderRenderItem = (item) => {
        const { navigate } = this.props.navigation;
        const itemShadowOpt = {
            width: global.px2dp(345),
            height: global.px2dp(191),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .1,
            x: 0,
            y: 0,
            style: styles.itemBoxShadow,
        }
        const hurdleShadowOpt = {
            width: global.px2dp(345),
            height: global.px2dp(36),
            color: "#000",
            border: 8,
            radius: 0,
            opacity: .1,
            x: 0,
            y: 0,
            style: styles.hurdleBoxShadow,
        }
        var orderStatus = '';
        switch (item.orderStatus) {
            case "TO_BE_ANSWERED":
                orderStatus = "待回复"
                break;
            case "TO_BE_ACCEPTED":
                orderStatus = "待接收"
                break;
            case "BE_REJECTED":
                orderStatus = "已拒绝"
                break;
            case "IS_DONE":
                orderStatus = "已完成"
                break;
        }
        return (
            <BoxShadow
                key={item.id}
                setting={itemShadowOpt}>
                <TouchableOpacity
                    onPress={() => {
                        switch (item.orderStatus) {
                            case "TO_BE_ANSWERED":
                                // orderStatus = "待回复"
                                navigate("OrderDetails", {
                                    orderId: item.id
                                });
                                break;
                            case "TO_BE_ACCEPTED":
                                // orderStatus = "待接收"
                                navigate("OrderReception", {
                                    orderId: item.id
                                });
                                break;
                            case "BE_REJECTED":
                                // orderStatus = "已拒绝"
                                navigate("OrderDecline", {
                                    orderId: item.id
                                });
                                break;
                            case "IS_DONE":
                                // orderStatus = "已完成"
                                navigate("OrderEnd", {
                                    orderId: item.id
                                });
                                break;
                        }
                    }}
                    activeOpacity={.8}
                >
                    <View style={styles.itemContent}>
                        <View style={styles.topBox}>
                            <Text style={styles.infoText}>{item.patientSex} | {item.patientAge}岁</Text>
                            <View style={styles.stateBox}>
                                <Text style={styles.stateText}>{orderStatus}</Text>
                            </View>
                        </View>
                        <View style={styles.centerBox}>
                            <Text style={styles.problemDescText}>{item.orderDescription}</Text>
                        </View>
                        <BoxShadow
                            setting={hurdleShadowOpt}>
                            <View style={styles.bottomBox}>
                                <Text style={styles.picText}>￥{item.orderPrice}</Text>
                                <Text style={styles.dateText}>{item.createTime}</Text>
                            </View>
                        </BoxShadow>
                    </View>
                </TouchableOpacity>
            </BoxShadow>
        )
    }
    goBack() {
        this.props.navigation.goBack();
    }
    screen() {
        this.setState({
            screenFlag: !this.state.screenFlag,
        })
    }
    // 加载更多
    onEndReached() {
        // 判断是否还有数据 
        if (this.state.dataFlag) {
            this.getOrderList(this.state.pageNo * 1 + 1 + '', this.state.screenActive);
            this.setState({ pageNo: this.state.pageNo * 1 + 1 + '' });
        }
    }
    getOrderList(pageNo, screenActive) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '加载中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        fetch(requestUrl.inquiryOrder[screenActive] + "?pageNo=" + pageNo + "&pageSize" + this.state.pageSize, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    if (responseData.result.length >= this.state.pageSize) {
                        let temp = this.state.orderArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            orderArr: temp,
                            dataFlag: true,
                        })
                    } else {
                        let temp = this.state.orderArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            orderArr: temp,
                            dataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        dataFlag: false,
                    })
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
    screenBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightBtnText: {
        fontSize: global.px2dp(16),
        color: global.Colors.textfff,
        marginRight: global.px2dp(3),
    },
    // 导航 - end

    flatListStyle: {
        // marginRight: global.px2dp(15),
        // marginLeft: global.px2dp(15),
    },
    // item - start
    itemBoxShadow: {
        marginTop: global.px2dp(8),
        marginBottom: global.px2dp(8),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    itemContent: {
        backgroundColor: global.Colors.textfff,
        borderRadius: global.px2dp(5),
        height: global.px2dp(191),
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    topBox: {
        height: global.px2dp(33),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: global.px2dp(22),
    },
    infoText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    stateBox: {
        width: global.px2dp(81),
        height: global.px2dp(33),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: global.Colors.color,
    },
    stateText: {
        fontSize: global.px2dp(16),
        color: global.Colors.textfff,
    },
    centerBox: {
        marginLeft: global.px2dp(22),
        marginRight: global.px2dp(22),
        paddingTop: global.px2dp(8),
        paddingBottom: global.px2dp(8),
    },
    problemDescText: {
        fontSize: global.px2dp(14),
        color: global.Colors.text666,
        lineHeight: global.px2dp(20),
        maxHeight: global.px2dp(100),
    },
    bottomBox: {
        height: global.px2dp(36),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: global.px2dp(22),
        paddingRight: global.px2dp(16),
        backgroundColor: global.Colors.textfff,
    },
    picText: {
        fontSize: global.px2dp(19),
        color: global.Colors.color,
    },
    dateText: {
        fontSize: global.px2dp(14),
        color: global.Colors.text999,
    },
    noDataBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: global.px2dp(115),
    },
    noDataText: {
        marginTop: global.px2dp(14),
        fontSize: global.px2dp(18),
        color: global.Colors.text666,
    },
    // item - end

    // 筛选部分-start
    screenMaskBtn: {
        position: 'absolute',
        left: 0,
        top: global.NavHeight,
        zIndex: 1001,
        backgroundColor: 'rgba(0,0,0,.6)',
        width: global.SCREEN_WIDTH,
        height: global.SCREEN_HEIGHT - global.NavHeight,
    },
    screenContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: global.Colors.textfff,
        borderBottomLeftRadius: global.px2dp(10),
        borderBottomRightRadius: global.px2dp(10),
        paddingLeft: global.px2dp(11),
        paddingTop: global.px2dp(9),
        paddingBottom: global.px2dp(9),
    },
    screenItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: global.px2dp(110),
        height: global.px2dp(30),
        borderRadius: global.px2dp(15),
        borderColor: global.Colors.colorccc,
        borderWidth: global.Pixel,
        marginTop: global.px2dp(10),
        marginBottom: global.px2dp(10),
        marginRight: global.px2dp(11),
    },
    screenText: {
        fontSize: global.px2dp(15),
        color: global.Colors.text555,
    },
    // 筛选部分-end
});

