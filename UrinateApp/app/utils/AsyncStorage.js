// key-value 存储
import React, { Component } from 'react';
import {
    AsyncStorage
} from 'react-native';
export let Storage = {
    // 添加
    setItem: (key, value, fn) => {
        AsyncStorage.setItem(key, JSON.stringify(value)).then(() => {
            fn("成功")
        }).catch((error) => {
            fn("失败")
        });
    },
    // 获取
    getItem: (key, fn) => {
        AsyncStorage.getItem(key, (err, result) => {
            fn(JSON.parse(result))
        });
    },
    // 删除
    removeItem: (key, fn) => {
        AsyncStorage.removeItem(key).then(() => {
            fn("成功")
        }).catch((error) => {
            fn("失败")
        });
    },
    // 清除
    clear: (fn) => {
        AsyncStorage.clear().then(() => {
            fn("成功")
        }).catch((error) => {
            fn("失败")
        });
    }
}