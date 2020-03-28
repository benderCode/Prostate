// 拍照/选择照片 组件
import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { global } from '../utils/Global';

const photoOptions = {
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: .75,
    allowsEditing: false,// ios图片裁剪
    mediaType: 'photo',//photo照片 或 video视频
    noData: false,
    maxWidth: 720,
    maxHeight: 1280,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
};

class UpFile extends Component {
    static defaultProps = {
    };
    constructor(props) {
        super(props);
        this.state = {
            uri: ''
        }
    }
    render() {
        return (
            <TouchableOpacity
                activeOpacity={.8}
                style={styles.upFileBtn}
                onPress={this.openMycamera.bind(this)}
            >
                <Image source={require('../images/camera_blue.png')} />
                <Text style={styles.upFileText}>拍照上传</Text>
            </TouchableOpacity>
        );
    }

    openMycamera = () => {
        ImagePicker.showImagePicker(photoOptions, (response) => {
            if (response.didCancel) {
                return null;
            } else if (response.error) {
                console.log('ImagePicker Error:', response.error)
            } else if (response.customButton) {
                console.log('Usr tapped custom button:', response.customButton)
            } else {
                this.props.changeImg(response);
            }
        })
    }
}
const styles = StyleSheet.create({
    upFileBtn: {
        height: global.px2dp(51),
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: global.px2dp(20),
        paddingLeft: global.px2dp(15),
        paddingTop: global.px2dp(5),
        paddingBottom: global.px2dp(6),
    },
    upFileText: {
        fontSize: global.px2dp(13),
        color: global.Colors.text666,
    },
})
module.exports = UpFile;
