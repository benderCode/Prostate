import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    StatusBar,
    ActivityIndicator,
} from 'react-native';

import { global } from '../utils/Global';
import ImageViewer from 'seer-react-native-image-zoom-viewer';

export default class LookImg extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            imgArr: [],
            index: 0,
        }
    }

    componentWillMount() {
        if (this.props.navigation.state.params) {
            let data = this.props.navigation.state.params;
            let temp = [];
            data.data.map((item, index) => {
                temp.push({ 'url': item })
            });
            this.setState({
                imgArr: temp,
                index: data.index,
            });
        }
    }
    render() {
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={global.IOS ? true : false}//是否隐藏
                    animated={true}//是否动画
                />
                <ImageViewer
                    imageUrls={this.state.imgArr}
                    enableImageZoom={true}
                    flipThreshold={global.SCREEN_WIDTH * .2}
                    maxOverflow={global.SCREEN_WIDTH}
                    loadingRender={() => {
                        return (
                            <View style={{
                                width: global.SCREEN_WIDTH,
                                height: global.IOS ? global.SCREEN_HEIGHT : global.SCREEN_HEIGHT - StatusBar.currentHeight,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <ActivityIndicator
                                    animating={true}
                                    size="large"//small 20  large 36
                                    color={'#bdbdbd'}
                                />
                            </View>
                        )
                    }}
                    saveToLocalByLongPress={false}
                    onClick={() => {
                        // 点击事件
                        goBack();
                    }}
                    index={this.state.index}// 从第几张开始
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: global.SCREEN_WIDTH,
        height: global.IOS ? global.SCREEN_HEIGHT : global.SCREEN_HEIGHT - StatusBar.currentHeight,
        backgroundColor: global.Colors.bgColor,
    },
});
