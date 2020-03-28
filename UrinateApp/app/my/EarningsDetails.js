import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import ErrorPrompt from "../common/ErrorPrompt";
import Nav from "../common/Nav";// 导航组件
export default class EarningsDetails extends Component {
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


            pageNo: 1,
            pageSize: 10,
            earningsArr: [],
            dataFlag: true,
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        this.getBalanceList(1);
    }
    componentDidMount() {
        // 4获取数据 在 render 后
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Nav isLoading={this.state.isLoading} title={"流水明细"} leftClick={this.goBack.bind(this)} />
                <Text style={styles.earningsTitle}>全部流水</Text>
                <FlatList
                    style={styles.flatListStyle}
                    data={this.state.earningsArr}
                    // initialNumToRender={20}
                    keyExtractor={item => item.id}
                    // ListFooterComponent={() => {
                    // 尾部组件
                    // }}
                    renderItem={({ item }) => this.renderItem(item)}
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
                            pageNo: 1,
                            earningsArr: [],
                        })
                        this.getBalanceList(1);
                    }}//头部刷新组件
                    refreshing={this.state.isRefresh}//加载图标
                    onEndReached={() => this.onEndReached()} // 加载更多
                    onEndReachedThreshold={.1}// 加载更多触发时机
                    ListEmptyComponent={() => {
                        // 无数据时显示的内容
                        return (
                            <View style={styles.noDataBox}>
                                <Text style={styles.noDataText}>暂无记录</Text>
                            </View>
                        )
                    }}
                />
                {this.state.ErrorPromptFlag ? <ErrorPrompt text={this.state.ErrorPromptText} imgUrl={this.state.ErrorPromptImg} /> : null}
            </View>
        );
    }
    renderItem = (item) => {
        return (
            <View style={styles.itemBox}>
                <View style={styles.leftBox}>
                    <Text style={styles.type}>{item.dealType == "EXPEND_TYPE" ? "提现" : null}{item.dealType == "INCOME_TYPE" ? "收入" : null}</Text>
                    <Text style={styles.time}>{item.createTime}</Text>
                </View>
                <Text style={[styles.pic, { color: item.dealType == "INCOME_TYPE" ? global.Colors.color : global.Colors.text333, }]}>{item.dealType == "EXPEND_TYPE" ? "-" : null}{item.dealType == "INCOME_TYPE" ? "+" : null}{item.dealAmount}</Text>
            </View >
        )
    }
    goBack() {
        this.props.navigation.goBack();
    }

    getBalanceList(pageNo) {
        this.setState({
            isLoading: true,
            ErrorPromptFlag: true,
            ErrorPromptText: '加载中...',
            ErrorPromptImg: require('../images/loading.png'),
        })
        fetch(requestUrl.getBalanceList + "?pageNo=" + pageNo + "&pageSize" + this.state.pageSize, {
            method: 'GET',
            headers: {
                
                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    if (responseData.result.length >= this.state.pageSize) {
                        let temp = this.state.earningsArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            earningsArr: temp,
                            dataFlag: true,
                        })
                    } else {
                        let temp = this.state.earningsArr;
                        temp = temp.concat(responseData.result);
                        this.setState({
                            isLoading: false,
                            ErrorPromptFlag: false,
                            earningsArr: temp,
                            dataFlag: false,
                        })
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        ErrorPromptFlag: false,
                        earningsArr: [],
                    })
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    onEndReached() {
        if (this.state.dataFlag) {
            this.getBalanceList(this.state.pageNo * 1 + 1 + '');
            this.setState({ pageNo: this.state.pageNo * 1 + 1 + '' });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    earningsTitle: {
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
        lineHeight: global.px2dp(55),
        paddingLeft: global.px2dp(15),
    },
    flatListStyle: {
        backgroundColor: global.Colors.textfff,
    },
    itemBox: {
        height: global.px2dp(63),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: global.px2dp(15),
        marginLeft: global.px2dp(15),
    },
    leftBox: {

    },
    type: {
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
        lineHeight: global.px2dp(24),
    },
    time: {
        fontSize: global.px2dp(13),
        color: global.Colors.text999,
        lineHeight: global.px2dp(22),
    },
    pic: {
        fontSize: global.px2dp(19),
    },

    noDataBox: {
        flex: 1,
    },
    noDataText: {
        marginTop: global.px2dp(80),
        fontSize: global.px2dp(14),
        color: global.Colors.text666,
        textAlign: 'center',
    },
});

