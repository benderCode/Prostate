import React, {
    Component
} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
    }
    getInitalState() {
        // 1初始化state
    }
    componentWillMount() {
        console.log(this.props)
        // 2仅调用一次在 render 前
    }
    componentDidMount() {
        // 4获取数据 在 render 后
    }
    render() {
        // 3 渲染 render
        // 变量声明
        // const {navigate, goBack} = this.props.navigation;

        return (<View style={styles.container} >
            <Text>直播</Text>
            <TouchableOpacity activeOpacity={.8}
                onPress={() => {}}>
                <Text>点击</Text>
            </TouchableOpacity>
        </View>);
    }
    
}

const styles = StyleSheet.create({

});

