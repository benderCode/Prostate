import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, ScrollView, } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import Button from "../common/Button";// 按钮组件
import Nav from "../common/Nav";// 导航组件
export default class About extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
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
                <Nav title={"关于"} leftClick={this.goBack.bind(this)} />
                <ScrollView>
                    <View style={styles.content}>
                        <Image style={styles.imgLogo} source={require('../images/img_logo.png')} />
                        <Text style={styles.name}>栗子医学</Text>
                        <Text style={styles.versionNumber}>版本号{global.versionNum}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.itemBtn}
                        activeOpacity={.8}
                        onPress={() => { }}>
                        <Text style={styles.itemTitle}>评价</Text>
                        <Image source={require('../images/arrow_right_grey.png')} />
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.copyBox}>
                    <Text style={styles.copyText}>copyright &copy; 2018</Text>
                    <Text style={styles.copyText}>北京安智杰科技有限公司</Text>
                </View>
            </View>
        );
    }
    goBack() {
        this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    content: {
        alignItems: 'center',
    },
    imgLogo: {
        marginTop: global.px2dp(36),
        marginBottom: global.px2dp(13),
    },
    name: {
        fontSize: global.px2dp(20),
        color: global.Colors.color,
        marginBottom: global.px2dp(12),
    },
    versionNumber: {
        fontSize: global.px2dp(14),
        color: global.Colors.text333,
        marginBottom: global.px2dp(31),
    },
    itemBtn: {
        height: global.px2dp(49),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: global.px2dp(15),
        paddingLeft: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
    },
    itemTitle: {
        fontSize: global.px2dp(16),
        color: global.Colors.text333,
    },

    // 版权-satrt
    copyBox: {
        alignItems: 'center',
        marginBottom: global.px2dp(30),
        marginTop: global.px2dp(20),
    },
    copyText: {
        fontSize: global.px2dp(12),
        color: global.Colors.text999,
        lineHeight: global.px2dp(17),
    }
    // 版权-end

});

