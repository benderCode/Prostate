import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, Easing, Animated, ScrollView, FlatList } from 'react-native';
import { regExp } from '../netWork/RegExp';// 正则
import { requestUrl } from '../netWork/Url';// IP地址
import { global } from '../utils/Global';// 常量
import Button from "../common/Button";
import Nav from "../common/Nav";
import UpFile from "../common/UpFile";
import ErrorPrompt from "../common/ErrorPrompt";
import SubmitPrompt from "../common/SubmitPrompt";
import { StackActions, NavigationActions } from 'react-navigation';
import { CachedImage, ImageCache } from "react-native-img-cache";

export default class Approve extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            SubmitPromptFlag: false,// 信息提示盒子
            SubmitPromptTitle: '',
            SubmitPromptText: '',
            SubmitPromptImgUrl: '',

            ErrorPrompt: false,// 提示框 是否显示
            ErrorText: '',// 提示框文字
            ErrorImg: '',// 提示框图片

            userInfo: {},

            hospitalData: [],// 医院数据
            hospitalMask: new Animated.Value(0),
            hospitalMaskFlag: false,

            branchData: [],// 科室数据
            branchMask: new Animated.Value(0),
            branchMaskFlag: false,

            titleData: [],// 职称数据
            titleMask: new Animated.Value(0),
            titleMaskFlag: false,

            signFlag: true,// 是否是第一次认证

            protocolFlag: false,// 是否同意协议

            idCardFront: '',//身份证正面照片 - 资源
            idCardFrontUrl: '',//身份证正面照片 - 地址
            doctorCardFront: '',//医师执业证正面照片 - 资源
            doctorCardFrontUrl: '',//医师执业证正面照片 - 地址
            workCard: '',//手持工牌照片- 资源
            workCardUrl: '',//手持工牌照片 - 地址
            hospitalId: '',//医院ID
            hospitalName: '',//医院ID
            branchId: '',//科室Id
            branchName: '',//科室名字
            titleId: '',//职称ID
            titleName: '',// 职称名字
        }
    }
    componentWillMount() {
        // 2仅调用一次在 render 前
    }
    componentDidMount() {
        // 查医院信息
        fetch(requestUrl.getHospitalJson, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                let temp = [];
                for (const key in responseData.result) {
                    temp.push({
                        id: key,
                        hospitalName: responseData.result[key],
                    })
                }
                this.setState({
                    hospitalData: temp,
                })
            })
            .catch((error) => {
                console.log('error', error);
            });
        // 查职称信息
        fetch(requestUrl.getBranchServiceJson, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                let temp = [];
                for (const key in responseData.result) {
                    temp.push({
                        id: key,
                        branchName: responseData.result[key],
                    })
                }
                this.setState({
                    branchData: temp,
                })
            })
            .catch((error) => {
                console.log('error', error);
            });
        // 查职称信息
        fetch(requestUrl.getDoctorTitleJson, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                let temp = [];
                for (const key in responseData.result) {
                    temp.push({
                        id: key,
                        titleName: responseData.result[key],
                    })
                }
                this.setState({
                    titleData: temp,
                })
            })
            .catch((error) => {
                console.log('error', error);
            });
        // 查询认证信息
        this.getAuthentication();
    }
    // 获取认证信息
    getAuthentication() {
        fetch(requestUrl.getAuthentication, {
            method: 'GET',
            headers: {

                "token": global.Token,
            },
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('responseData', responseData);
                if (responseData.code == 20000) {
                    this.setState({
                        signFlag: false,
                        hospitalId: responseData.result.hospitalId,
                        hospitalName: responseData.result.hospitalName,
                        branchId: responseData.result.branchId,
                        branchName: responseData.result.branchName,
                        titleId: responseData.result.titleId,
                        titleName: responseData.result.titleName,
                        idCardFrontUrl: responseData.result.idCardFront,// 身份证正面
                        doctorCardFrontUrl: responseData.result.doctorCardFront,// 医生执业证 正面
                        workCardUrl: responseData.result.workCard,// 手持工牌
                    })
                } else if (responseData.code == 50000) {
                    this.setState({
                        ErrorPrompt: true,// 提示框 是否显示
                        ErrorText: '认证信息获取失败，请重试',// 提示框文字
                        ErrorImg: require('../images/error.png'),// 提示框图片
                    })
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
                <Nav
                    isLoading={this.state.isLoading}
                    title="认证信息"
                    leftClick={this.goBack.bind(this)} />
                <ScrollView>
                    <View style={styles.itemContent}>
                        {/* title 模块 start */}
                        <View style={styles.titleContent}>
                            <View style={styles.titleLeftBox}>
                                <View style={styles.titleLine}></View>
                                <Text style={styles.titleText}>上传身份证</Text>
                            </View>
                            <Text style={styles.hintText}></Text>
                        </View>
                        {/* title 模块 end */}
                        {/* 上传文件模块 start */}
                        <View style={styles.upFileContent}>
                            {/* 图片获取-start */}
                            <UpFile changeImg={(data) => {
                                this.setState({
                                    idCardFront: data.uri,
                                })
                                // 提交文件资源-获取文件路径
                                let formData = new FormData();
                                formData.append("file", {
                                    uri: data.uri,
                                    type: 'image/jpeg',
                                    name: "fileName.jpg",
                                });
                                formData.append("recordType", 'doctor-sign');
                                fetch(requestUrl.uploadAuthentication, {
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
                                            this.setState({
                                                idCardFrontUrl: responseData.result
                                            })
                                        } else {
                                            this.setState({
                                                ErrorPrompt: true,
                                                ErrorText: '身份证上传失败请重新上传',
                                                ErrorImg: require('../images/error.png'),
                                            });
                                            clearTimeout(this.timer);
                                            this.timer = setTimeout(() => {
                                                this.setState({
                                                    ErrorPrompt: false,
                                                })
                                            }, global.TimingCount)
                                        }
                                    })
                                    .catch((error) => {
                                        console.log('error', error);
                                    });
                            }} />
                            {/* 图片获取-end */}
                            <View style={styles.upFileLine}></View>
                            <View style={styles.upFileBox}>
                                <TouchableOpacity
                                    style={styles.imgBtn}
                                    onPress={() => {
                                        navigate('LookImg', {
                                            data: [this.state.idCardFrontUrl ? this.state.idCardFrontUrl : requestUrl.idCardFrontUrl]
                                        })
                                    }}
                                    activeOpacity={.8}>
                                    <CachedImage
                                        style={styles.idCardImg}
                                        source={this.state.idCardFrontUrl ? { uri: this.state.idCardFrontUrl } : { uri: requestUrl.idCardFrontUrl }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* 上传文件模块 end */}
                    </View>
                    <View style={[styles.itemContent, { paddingRight: 0 }]}>
                        <View style={styles.titleContent}>
                            <View style={styles.titleLeftBox}>
                                <View style={styles.titleLine}></View>
                                <Text style={styles.titleText}>医院信息</Text>
                            </View>
                            <Text style={styles.hintText}></Text>
                        </View>
                        <View style={styles.hospitalInfoContent}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        hospitalMaskFlag: !this.state.hospitalMaskFlag
                                    });
                                    this.state.hospitalMask.setValue(-global.SCREEN_WIDTH);
                                    Animated.timing(this.state.hospitalMask, {
                                        toValue: 0,
                                        duration: 300,
                                        easing: Easing.linear,// 线性的渐变函数
                                    }).start();
                                }}
                                activeOpacity={.8}
                                style={styles.hospitalSelBtn}
                            >
                                <Text style={styles.itemTitle}>所在医院</Text>
                                <Text style={styles.itemValue}>{this.state.hospitalId ? this.state.hospitalName : "请选择"}</Text>
                                <Image style={styles.hospitalSelImg} source={require('../images/arrow_right_grey.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        branchMaskFlag: !this.state.branchMaskFlag
                                    });
                                    this.state.branchMask.setValue(-global.SCREEN_WIDTH);
                                    Animated.timing(this.state.branchMask, {
                                        toValue: 0,
                                        duration: 300,
                                        easing: Easing.linear,// 线性的渐变函数
                                    }).start();
                                }}
                                activeOpacity={.8}
                                style={styles.hospitalSelBtn}
                            >
                                <Text style={styles.itemTitle}>所在科室</Text>
                                <Text style={styles.itemValue}>{this.state.branchId ? this.state.branchName : "请选择"}</Text>
                                <Image style={styles.hospitalSelImg} source={require('../images/arrow_right_grey.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        titleMaskFlag: !this.state.titleMaskFlag
                                    });
                                    this.state.titleMask.setValue(-global.SCREEN_WIDTH);
                                    Animated.timing(this.state.titleMask, {
                                        toValue: 0,
                                        duration: 300,
                                        easing: Easing.linear,// 线性的渐变函数
                                    }).start();
                                }}
                                activeOpacity={.8}
                                style={styles.hospitalSelBtn}
                            >
                                <Text style={styles.itemTitle}>职称</Text>
                                <Text style={styles.itemValue}>{this.state.titleId ? this.state.titleName : "请选择"}</Text>
                                <Image style={styles.hospitalSelImg} source={require('../images/arrow_right_grey.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.itemContent}>
                        <View style={styles.titleContent}>
                            <View style={styles.titleLeftBox}>
                                <View style={styles.titleLine}></View>
                                <Text style={styles.titleText}>医师执业证</Text>
                            </View>
                            <Text style={styles.hintText}>请上传内容页</Text>
                        </View>
                        {/* 上传文件模块 start */}
                        <View style={styles.upFileContent}>
                            {/* 图片获取-start */}
                            <UpFile changeImg={(data) => {
                                this.setState({
                                    doctorCardFront: data.uri,
                                })
                                // 提交文件资源-获取文件路径
                                let formData = new FormData();
                                formData.append("file", {
                                    uri: data.uri,
                                    type: 'image/jpeg',
                                    name: "fileName.jpg",
                                });
                                formData.append("recordType", 'doctor-sign');
                                fetch(requestUrl.uploadAuthentication, {
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
                                            this.setState({
                                                doctorCardFrontUrl: responseData.result
                                            })
                                        } else {
                                            this.setState({
                                                ErrorPrompt: true,
                                                ErrorText: '医师执业证上传失败请重新上传',
                                                ErrorImg: require('../images/error.png'),
                                            });
                                            clearTimeout(this.timer);
                                            this.timer = setTimeout(() => {
                                                this.setState({
                                                    ErrorPrompt: false,
                                                })
                                            }, global.TimingCount)
                                        }
                                    })
                                    .catch((error) => {
                                        console.log('error', error);
                                    });
                            }} />
                            {/* 图片获取-end */}
                            <View style={styles.upFileLine}></View>
                            <View style={styles.upFileBox}>
                                <TouchableOpacity
                                    style={styles.imgBtn}
                                    onPress={() => {
                                        navigate('LookImg', {
                                            data: [this.state.doctorCardFrontUrl ? this.state.doctorCardFrontUrl : requestUrl.doctorCardFrontUrl]
                                        })
                                    }}
                                    activeOpacity={.8}>
                                    <CachedImage
                                        style={styles.certificateImg}
                                        source={this.state.doctorCardFrontUrl ? { uri: this.state.doctorCardFrontUrl } : { uri: requestUrl.doctorCardFrontUrl }}
                                    />
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                    style={styles.imgBtn}
                                    onPress={() => { }}
                                    activeOpacity={.8}>
                                    <CachedImage
                                        style={styles.certificateImg}
                                        source={this.state.doctorCardContrary ? { uri: this.state.doctorCardContrary } : require('../images/example_img.png')}
                                    />
                                </TouchableOpacity> */}
                            </View>
                        </View>
                        {/* 上传文件模块 end */}
                    </View>
                    <View style={styles.itemContent}>
                        <View style={styles.titleContent}>
                            <View style={styles.titleLeftBox}>
                                <View style={styles.titleLine}></View>
                                <Text style={styles.titleText}>手持工牌照</Text>
                            </View>
                            <Text style={styles.hintText}>请上传真实照片</Text>
                        </View>
                        {/* 上传文件模块 start */}
                        <View style={styles.upFileContent}>
                            {/* 图片获取-start */}
                            <UpFile changeImg={(data) => {
                                this.setState({
                                    workCard: data.uri
                                })
                                // 提交文件资源-获取文件路径
                                let formData = new FormData();
                                formData.append("file", {
                                    uri: data.uri,
                                    type: 'image/jpeg',
                                    name: "fileName.jpg",
                                });
                                formData.append("recordType", 'doctor-sign');
                                fetch(requestUrl.uploadAuthentication, {
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
                                            this.setState({
                                                workCardUrl: responseData.result
                                            })
                                        } else {
                                            this.setState({
                                                ErrorPrompt: true,
                                                ErrorText: '手持工牌照上传失败请重新上传',
                                                ErrorImg: require('../images/error.png'),
                                            });
                                            clearTimeout(this.timer);
                                            this.timer = setTimeout(() => {
                                                this.setState({
                                                    ErrorPrompt: false,
                                                })
                                            }, global.TimingCount)
                                        }
                                    })
                                    .catch((error) => {
                                        console.log('error', error);
                                    });
                            }} />
                            {/* 图片获取-end */}
                            <View style={styles.upFileLine}></View>
                            <View style={styles.upFileBox}>
                                <TouchableOpacity
                                    style={styles.imgBtn}
                                    onPress={() => {
                                        navigate('LookImg', {
                                            data: [this.state.workCardUrl ? this.state.workCardUrl : requestUrl.workCardUrl]
                                        })
                                    }}
                                    activeOpacity={.8}>
                                    <CachedImage
                                        style={styles.certificateImg}
                                        source={this.state.workCardUrl ? { uri: this.state.workCardUrl } : { uri: requestUrl.workCardUrl }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* 上传文件模块 end */}
                    </View>
                    {/* 协议-start */}
                    <View style={styles.protocolContent}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                navigate('Protocol');
                            }}
                        >
                            <Text style={styles.protocolText}>查阅并同意<Text style={{ color: global.Colors.color }}>《联盟平台协议》</Text></Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={.8}
                            style={styles.protocolBtn}
                            onPress={() => {
                                this.setState({
                                    protocolFlag: !this.state.protocolFlag,
                                })
                            }}
                        >
                            <Image source={this.state.protocolFlag ? require('../images/protocol_yes.png') : require('../images/protocol_no.png')} />
                        </TouchableOpacity>
                    </View>
                    {/* 协议-end */}
                    <View style={styles.btnBox}>
                        <Button text="提交" click={this.submit.bind(this)} />
                    </View>

                </ScrollView>
                {/* 医院弹层-start */}
                {this.state.hospitalMaskFlag ? <TouchableOpacity
                    style={styles.maskBtn}
                    activeOpacity={1}
                    onPress={() => {
                        this.setState({
                            hospitalMaskFlag: !this.state.hospitalMaskFlag
                        })
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { return false }}
                    >
                        <View style={styles.maskContent}>
                            <Text style={styles.maskTitle}>医院选择</Text>
                            <FlatList
                                style={{}}
                                data={this.state.hospitalData}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => this.hsopitalRenderItem(item)}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity> : null}
                {/* 医院弹层-end */}
                {/* 科室弹层-start */}
                {this.state.branchMaskFlag ? <TouchableOpacity
                    style={styles.maskBtn}
                    activeOpacity={1}
                    onPress={() => {
                        this.setState({
                            branchMaskFlag: !this.state.branchMaskFlag
                        })
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { return false }}
                    >
                        <View style={styles.maskContent}>
                            <Text style={styles.maskTitle}>科室选择</Text>
                            <FlatList
                                style={{}}
                                data={this.state.branchData}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => this.branchRenderItem(item)}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity> : null}
                {/* 科室弹层-end */}
                {/* 职称弹层-start */}
                {this.state.titleMaskFlag ? <TouchableOpacity
                    style={styles.maskBtn}
                    activeOpacity={1}
                    onPress={() => {
                        this.setState({
                            titleMaskFlag: !this.state.titleMaskFlag
                        })
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { return false }}
                    >
                        <View style={styles.maskContent}>
                            <Text style={styles.maskTitle}>职称选择</Text>
                            <FlatList
                                style={{}}
                                data={this.state.titleData}
                                initialNumToRender={20}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => this.titleRenderItem(item)}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity> : null}
                {/* 职称弹层-end */}
                {/* 认证提示信息-start */}
                {this.state.SubmitPromptFlag ?
                    <SubmitPrompt title={this.state.SubmitPromptTitle} text={this.state.SubmitPromptText} imgUrl={this.state.SubmitPromptImgUrl} yesClick={this.confirmYesClick.bind(this)} />
                    : null}
                {/* 认证提示信息-start */}
                {this.state.ErrorPrompt ? <ErrorPrompt text={this.state.ErrorText} imgUrl={this.state.ErrorImg} /> : null}
            </View>
        );
    }
    hsopitalRenderItem = (item) => {
        return (
            <TouchableOpacity
                activeOpacity={.8}
                onPress={() => {
                    this.setState({
                        hospitalMaskFlag: !this.state.hospitalMaskFlag,
                        hospitalName: item.hospitalName,
                        hospitalId: item.id,
                    })
                }}
                style={styles.optionBtn}
                key={item.id}
            >
                <Text style={styles.optionText}>{item.hospitalName}</Text>
            </TouchableOpacity>
        )
    }
    branchRenderItem = (item) => {
        return (
            <TouchableOpacity
                activeOpacity={.8}
                onPress={() => {
                    this.setState({
                        branchMaskFlag: !this.state.branchMaskFlag,
                        branchName: item.branchName,
                        branchId: item.id,
                    })
                }}
                style={styles.optionBtn}
                key={item.id}
            >
                <Text style={styles.optionText}>{item.branchName}</Text>
            </TouchableOpacity>
        )
    }
    titleRenderItem = (item) => {
        return (
            <TouchableOpacity
                activeOpacity={.8}
                onPress={() => {
                    this.setState({
                        titleMaskFlag: !this.state.titleMaskFlag,
                        titleName: item.titleName,
                        titleId: item.id,
                    })
                }}
                style={styles.optionBtn}
                key={item.id}
            >
                <Text style={styles.optionText}>{item.titleName}</Text>
            </TouchableOpacity>
        )
    }
    // 提示框确定按钮
    confirmYesClick() {
        this.setState({
            SubmitPromptFlag: false,
        });
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        this.props.navigation.dispatch(resetAction);
    }
    // 后退事件
    goBack() {
        this.props.navigation.goBack();
    }
    // 提交事件
    submit() {
        if (!this.state.idCardFrontUrl) {
            this.setState({
                ErrorPrompt: true,
                ErrorText: '请上传身份证正面照片',
                ErrorImg: require('../images/error.png'),
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: false,
                })
            }, global.TimingCount)
        } else if (!this.state.hospitalId) {
            this.setState({
                ErrorPrompt: true,
                ErrorText: '请选择所在医院',
                ErrorImg: require('../images/error.png'),
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: false,
                })
            }, global.TimingCount)
        } else if (!this.state.branchId) {
            this.setState({
                ErrorPrompt: true,
                ErrorText: '请选择所在科室',
                ErrorImg: require('../images/error.png'),
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: false,
                })
            }, global.TimingCount)
        } else if (!this.state.titleId) {
            this.setState({
                ErrorPrompt: true,
                ErrorText: '请选择职称',
                ErrorImg: require('../images/error.png'),
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: false,
                })
            }, global.TimingCount)
        } else if (!this.state.doctorCardFrontUrl) {
            this.setState({
                ErrorPrompt: true,
                ErrorText: '请上传医师执业证正面照片',
                ErrorImg: require('../images/error.png'),
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: false,
                })
            }, global.TimingCount)
        } else if (!this.state.workCardUrl) {
            this.setState({
                ErrorPrompt: true,
                ErrorText: '请上传手持工牌照片',
                ErrorImg: require('../images/error.png'),
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: false,
                })
            }, global.TimingCount)
        } else if (!this.state.protocolFlag) {
            this.setState({
                ErrorPrompt: true,
                ErrorText: '请同意联盟平台协议',
                ErrorImg: require('../images/error.png'),
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({
                    ErrorPrompt: false,
                })
            }, global.TimingCount)
        } else {
            if (this.state.signFlag) {
                // 第一次认证
                this.setState({
                    isLoading: true,
                    ErrorPrompt: true,
                    ErrorText: '信息提交中...',
                    ErrorImg: require('../images/loading.png'),
                })
                let formData = new FormData();
                formData.append("idCardFront", this.state.idCardFrontUrl);//身份证正面照片地址
                formData.append("doctorCardFront", this.state.doctorCardFrontUrl);// 医师执业证正面照片地址
                formData.append("workCard", this.state.workCardUrl);// 手持工牌照片地址
                formData.append("hospitalId", this.state.hospitalId);// 医院ID
                formData.append("branchId", this.state.branchId);// 科室ID
                formData.append("titleId", this.state.titleId);// 科室ID
                fetch(requestUrl.addAuthentication, {
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
                                ErrorPrompt: false,
                                confirmFlag: false,
                                SubmitPromptFlag: true,
                                SubmitPromptTitle: '医师认证提交成功',
                                SubmitPromptText: '审核将在1-3工作日完成',
                                SubmitPromptImgUrl: require('../images/succeed_blue.png'),
                            })
                        } else if (responseData.code == 40001) {
                            // 去登录

                        } else if (responseData.code == 50000) {
                            this.setState({
                                ErrorPrompt: true,
                                ErrorText: '服务器繁忙，稍后重试',
                                ErrorImg: require('../images/error.png'),
                            });
                            clearTimeout(this.timer);
                            this.timer = setTimeout(() => {
                                this.setState({
                                    ErrorPrompt: false,
                                })
                            }, global.TimingCount)
                        } else if (responseData.code == 50003) {
                            this.setState({
                                isLoading: false,
                                ErrorPrompt: false,
                                confirmFlag: false,
                                SubmitPromptFlag: true,
                                SubmitPromptTitle: '提交失败',
                                SubmitPromptText: '认证信息已存在',
                                SubmitPromptImgUrl: require('../images/error_red.png'),
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                ErrorPrompt: false,
                                confirmFlag: false,
                                SubmitPromptFlag: true,
                                SubmitPromptTitle: '医师认证提交失败',
                                SubmitPromptText: '请重新试一次',
                                SubmitPromptImgUrl: require('../images/error_red.png'),
                            })
                        }
                    })
                    .catch((error) => {
                        console.log('error', error);
                    });
            } else {
                // 失败后的 重新认证
                this.setState({
                    isLoading: true,
                    ErrorPrompt: true,
                    ErrorText: '信息提交中...',
                    ErrorImg: require('../images/loading.png'),
                })
                let formData = new FormData();
                formData.append("idCardFront", this.state.idCardFrontUrl);//身份证正面照片地址
                formData.append("doctorCardFront", this.state.doctorCardFrontUrl);// 医师执业证正面照片地址
                formData.append("workCard", this.state.workCardUrl);// 手持工牌照片地址
                formData.append("hospitalId", this.state.hospitalId);// 医院ID
                formData.append("branchId", this.state.branchId);// 科室ID
                formData.append("titleId", this.state.titleId);// 科室ID
                fetch(requestUrl.updateAuthentication, {
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
                                ErrorPrompt: false,
                                confirmFlag: false,
                                SubmitPromptFlag: true,
                                SubmitPromptTitle: '医师认证提交成功',
                                SubmitPromptText: '审核将在1-3工作日完成',
                                SubmitPromptImgUrl: require('../images/succeed_blue.png'),
                            })
                        } else if (responseData.code == 40001) {
                            // 去登录

                        } else if (responseData.code == 50000) {
                            this.setState({
                                ErrorPrompt: true,
                                ErrorText: '服务器繁忙，稍后重试',
                                ErrorImg: require('../images/error.png'),
                            });
                            clearTimeout(this.timer);
                            this.timer = setTimeout(() => {
                                this.setState({
                                    ErrorPrompt: false,
                                })
                            }, global.TimingCount)
                        } else if (responseData.code == 50003) {
                            this.setState({
                                isLoading: false,
                                ErrorPrompt: false,
                                confirmFlag: false,
                                SubmitPromptFlag: true,
                                SubmitPromptTitle: '提交失败',
                                SubmitPromptText: '认证信息已存在',
                                SubmitPromptImgUrl: require('../images/error_red.png'),
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                ErrorPrompt: false,
                                confirmFlag: false,
                                SubmitPromptFlag: true,
                                SubmitPromptTitle: '医师认证提交失败',
                                SubmitPromptText: '请重新试一次',
                                SubmitPromptImgUrl: require('../images/error_red.png'),
                            })
                        }
                    })
                    .catch((error) => {
                        console.log('error', error);
                    });
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: global.Colors.bgColor,
    },
    itemContent: {
        marginTop: global.px2dp(15),
        backgroundColor: global.Colors.textfff,
        paddingBottom: global.px2dp(12),
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    // title模块-start
    titleContent: {
        height: global.px2dp(36),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleLeftBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleLine: {
        marginRight: global.px2dp(7),
        width: global.px2dp(3),
        height: global.px2dp(14),
        borderRadius: global.px2dp(2),
        backgroundColor: global.Colors.color5286C2,
    },
    titleText: {
        fontSize: global.px2dp(18),
        color: global.Colors.text333,
    },
    hintText: {
        fontSize: global.px2dp(13),
        color: global.Colors.text999,
    },
    upFileBox: {
        marginLeft: global.px2dp(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    imgBtn: {
        marginRight: global.px2dp(11),
    },
    // title模块 - end
    // 上传文件模块 start
    upFileContent: {
        height: global.px2dp(51),
        flexDirection: 'row',
        alignItems: 'center',
    },
    upFileLine: {
        width: global.px2dp(2),
        height: global.px2dp(38),
        backgroundColor: global.Colors.text999,
    },
    idCardImg: {
        width: global.px2dp(62),
        height: global.px2dp(38),
        borderRadius: global.px2dp(3),
        borderWidth: global.Pixel,
        borderColor: global.Colors.colorbbbbbb,
    },
    certificateImg: {
        width: global.px2dp(61),
        height: global.px2dp(56),
        borderRadius: global.px2dp(4),
        borderWidth: global.Pixel,
        borderColor: global.Colors.colorbbbbbb,
    },
    // 上传文件模块 end
    // 医院信息选择 -start
    hospitalInfoContent: {
        marginLeft: global.px2dp(15),
    },
    hospitalSelBtn: {
        height: global.px2dp(46),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: global.Pixel,
        borderColor: global.Colors.colorccc,
    },
    itemTitle: {
        fontSize: global.px2dp(17),
        color: global.Colors.text555,
    },
    itemValue: {
        flex: 1,
        textAlign: 'right',
        fontSize: global.px2dp(17),
        color: global.Colors.text555,
    },
    hospitalSelImg: {
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },
    // 医院信息选择 - end

    // 协议-start
    protocolContent: {
        backgroundColor: global.Colors.textfff,
        height: global.px2dp(51),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: global.px2dp(15),
        paddingLeft: global.px2dp(15),
        // paddingRight: global.px2dp(15),
    },
    protocolBtn: {
        paddingRight: global.px2dp(15),
        paddingLeft: global.px2dp(15),
        paddingTop: global.px2dp(15),
        paddingBottom: global.px2dp(15),
    },
    protocolText: {
        fontSize: global.px2dp(15),
        color: global.Colors.text555,
    },
    // 协议-end
    // 按钮box
    btnBox: {
        marginTop: global.px2dp(24),
        marginBottom: global.px2dp(24),
        marginLeft: global.px2dp(15),
        marginRight: global.px2dp(15),
    },

    // 弹层-start
    maskBtn: {
        position: 'absolute',
        top: global.NavHeight,
        left: 0,
        zIndex: 1000,
        width: global.SCREEN_WIDTH,
        height: global.IOS ? global.SCREEN_HEIGHT - global.NavHeight : global.SCREEN_HEIGHT - global.NavHeight - global.AndroidCurrentHeight,
        backgroundColor: 'rgba(0,0,0,.5)',
        alignItems: 'flex-end',
    },
    maskContent: {
        flex: 1,
        width: global.SCREEN_WIDTH * .75,
        backgroundColor: global.Colors.textfff,
        paddingLeft: global.px2dp(15),
        paddingRight: global.px2dp(15),
    },
    maskTitle: {
        fontSize: global.px2dp(17),
        color: global.Colors.color3375BD,
        lineHeight: global.px2dp(40),

    },
    optionBtn: {
        borderTopWidth: global.Pixel,
        borderTopColor: global.Colors.text999,
        height: global.px2dp(46),
        justifyContent: 'center',
    },
    optionText: {
        fontSize: global.px2dp(17),
        color: global.Colors.text333,
    },
    // 弹层-end


});

