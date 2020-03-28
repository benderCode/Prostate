import { Dimensions, PixelRatio } from 'react-native';

const TextSize = (size) => {
    let pixelRatio = PixelRatio.get();
    const deviceWidthDp = Dimensions.get('window').width;// 设备宽度
    const deviceHeightDp = Dimensions.get('window').height;// 设备高度
    const uiHeightPx = 375;// 设计图宽度
    return Math.floor(size * deviceWidthDp / uiHeightPx);
};

module.exports = TextSize;