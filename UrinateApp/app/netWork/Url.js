// const IP = "http://192.168.0.222";//
const IP = "http://www.qlxlm.com";//
export let requestUrl = {
    "idCardFrontUrl": 'https://checking-records-1256660245.cos.ap-beijing.myqcloud.com/IdCardSample.jpg',// 身份证示例图片
    "doctorCardFrontUrl": 'https://checking-records-1256660245.cos.ap-beijing.myqcloud.com/WorkLicenseCardSample.jpg',// 医生执业证示例图片
    "workCardUrl": 'https://checking-records-1256660245.cos.ap-beijing.myqcloud.com/HandIdCardSample.jpg',// 手持身份证示例图片
    "startImgUrl": 'https://checking-records-1256660245.cos.ap-beijing.myqcloud.com/startImg.jpg',// 启动页图片
    "IP": IP,
    // 登录注册
    "register": IP + "/api-user/doctor/register",// 注册接口
    "login": IP + "/api-user/doctor/login",// 密码登陆接口
    "registerSms": IP + "/api-user/doctor/registerSms",// 注册获取短信验证码
    "smsLogin": IP + "/api-user/doctor/smsLogin",// 验证码登陆接口
    "loginSms": IP + "/api-user/doctor/loginSms",// 登陆获取短信验证码
    "passwordSms": IP + "/api-user/doctor/passwordSms",// 修改密码获取短信验证码
    "passwordReset": IP + "/api-user/doctor/passwordReset",// 重置 登陆密码
    "getUsername": IP + "/api-user/doctor/getUsername",// 获取用户登陆手机号
    "updatePassword": IP + "/api-user/doctor/updatePassword",// 根据旧密码修改密码
    "logOut": IP + "/api-user/doctor/logOut",// 退出登陆


    // 文件上传
    "uploadAuthentication": IP + "/api-third/cos/upload",// 上传认证图片接口
    "uploadHeadImg": IP + "/api-third/cos/upload",// 上传医生头像接口


    // 认证相关
    "addAuthentication": IP + "/api-user/doctor/sign/add",// 提交认证信息
    "getAuthentication": IP + "/api-user/doctor/sign/get",// 查询认证信息
    "updateAuthentication": IP + "/api-user/doctor/sign/update",// 认证失败重新提交资料
    "getSignStatus": IP + "/api-user/doctor/sign/getSignStatus",// 认证状态查询
    "getIdCardInfo": IP + "/api-user/doctor/detail/getIdCardInfo",// 查询身份证信息


    // 静态缓存数据
    "getDoctorTitleJson": IP + "/api-stata/cache/static/getDoctorTitleJson",// 医生职称查询
    "getBranchServiceJson": IP + "/api-stata/cache/static/getBranchServiceJson",// 科室信息查询
    "getHospitalJson": IP + "/api-stata/cache/static/getHospitalJson",// 查询医院信息

    // 个人中心
    "getDoctorDetail": IP + "/api-user/doctor/detail/getDoctorDetail",// 医生查询个人信息
    "updateDoctorDetail": IP + "/api-user/doctor/detail/updateDoctorDetail",// 医生修改个人信息
    // "updateDoctorDetail": IP + "/api-stata/docket/getInquiryDocketList",// 查医生服务标签
    "findDoctorList": IP + "/api-user/doctor/detail/findDoctorList",// 条件查询医生列表
    "addFeedback": IP + "/api-stata/feedback/add",// 添加反馈意见
    "queryCount": IP + "/api-goods/goods/inquiry/queryCount",// 医生问诊服务数量查询
    "getDoctorCount": IP + "/api-statistic/count/getDoctorCount",// 医生统计数据查询
    "queryListByToken": IP + "/api-goods/goods/inquiry/queryListByToken",// 根据token查询问诊服务列表
    "queryListByDoctor": IP + "/api-goods/goods/inquiry/queryListByDoctor",// 根医生ID查询问诊服务列表
    "addGoods": IP + "/api-goods/goods/inquiry/add",// 添加服务


    // 通讯录
    "getDoctorDetailById": IP + "/api-user/doctor/detail/getDoctorDetailById",// 其他用户查询医生信息
    "focus": IP + "/api-user/fansStar/focus",// 关注接口
    "unFocus": IP + "/api-user/fansStar/unFocus",// 取消关注
    "findStar": IP + "/api-user/doctor/detail/findStar",// 查询关注的医生

    // 首页
    "getClickAndInquiry": IP + "/api-statistic/statistic/getClickAndInquiry",// 查询访问量 帮助量

    // 问诊
    "inquiryOrder": [
        IP + "/api-order/order/inquiry/getAllOrderList",//查询全部订单列表
        IP + "/api-order/order/inquiry/getAnsweredOrderList",// 查询待回复订单列表
        IP + "/api-order/order/inquiry/getAcceptedOrderList",// 查询待接受订单列表
        IP + "/api-order/order/inquiry/getBeRejectedOrderList",// 查询已拒绝订单列表
        IP + "/api-order/order/inquiry/getIsDoneOrderList",// 查询已完成订单列表
    ],// 问诊订单列表
    "turnOrderList": [
        IP + "/api-order/order/inquiry/getAllTurnOrderList",//查询全部转诊订单列表
        IP + "/api-order/order/inquiry/getAnsweredTurnOrderList",// 查询待回复转诊订单列表
        IP + "/api-order/order/inquiry/getAcceptedTurnOrderList",// 查询待接受转诊订单列表
        IP + "/api-order/order/inquiry/getBeRejectedTurnOrderList",// 查询已拒绝转诊订单列表
        IP + "/api-order/order/inquiry/getIsDoneTurnOrderList",// 查询已完成转诊订单列表
    ],// 转诊订单列表
    "getOrder": IP + "/api-order/order/inquiry/getOrder",// 订单详情
    "getBaseInfoById": IP + "/api-record/patient/getBaseInfoById",// 跟据患者ID查询患者基本信息
    "getByGroupNumber": IP + "/api-archive/medical/report/getByGroupNumber",// 根据档案编号 查询 文件档案路径
    "getByArchive": IP + "/api-assessmen/record/inquiry/getByArchive",// 查询 问诊 回复
    "addDraft": IP + "/api-assessmen/record/inquiry/addDraft",// 添加问诊回复草稿
    "addFinal": IP + "/api-assessmen/record/inquiry/addFinal",// 添加问诊最终回复
    "rejectedOrder": IP + "/api-order/order/inquiry/rejectedOrder",// 拒绝问诊订单
    "acceptedOrder": IP + "/api-order/order/inquiry/acceptedOrder",// 接受问诊订单
    "turnOrder": IP + "/api-order/order/inquiry/turnOrder",// 申请转诊

    // 患者管理
    "getLablePatientJson": IP + "/api-stata/docket/getPatientDocketList",// 根据token查询患者标签信息
    "findPatientList": IP + "/api-record/patient/findPatientList",// 查询患者列表

    "getAcceptedTurnPatientList": IP + "/api-record/userPatient/getAcceptedTurnPatientList",// 查询 带接受 转诊 患者列表
    "acceptedPatient": IP + "/api-record/userPatient/acceptedPatient",// 同意 接受转诊 患者
    "rejectedPatient": IP + "/api-record/userPatient/rejectedPatient",// 拒绝  接受转诊 患者

    "getPatientById": IP + "/api-record/patientAnamnesis/getPatientById",// 根据患者ID查询病历信息
    "getPatientLabel": IP + "/api-record/patient/sticker/get",// 患者标签查询
    "getMedicalReportList": IP + "/api-archive/medical/report/getMedicalReportList",// 根据患者id查 上传报告
    "getOrderListByPatient": IP + "/api-order/order/inquiry/getOrderListByPatient",// 根据患者id查 问诊记录
    "getAssessmentListByPatient": IP + "/api-assessmen/assessment/getAssessmentListByPatient",// 根据患者ID查询 评估结果列表
    "getExaminationListByPatient": IP + "/api-assessmen/medicalExamination/getExaminationListByPatient",// 根据患者ID查询化验单解读结果列表
    "addLabel": IP + "/api-record/patient/sticker/add",// 患者标签添加
    "removeLabel": IP + "/api-record/patient/sticker/remove",// 患者标签删除
    "creationLabel": IP + "/api-stata/docket/addPatientDocket",// 医生添加 自定义标签
    "deleteLabel": IP + "/api-stata/docket/deleteCustomDocket",// 医生删除 自定义标签
    "turnPatient": IP + "/api-record/userPatient/turnPatient",// 转诊 患者

    // 评估详情
    "nihAnswer": IP + "/api-assessmen/patientNihCpsiScore/getById",// 前列腺炎 nih 的答案
    "nihTopic": IP + "/api-stata/nihCpsi/getAll",// 前列腺炎 nih 的题目

    "ipssAnswer": IP + "/api-assessmen/patientIpssScore/getById",// 前列腺 ipss 增生答案
    "ipssTopic": IP + "/api-stata/ipss/getAll",// 前列腺 ipss 增生题目

    "getExaminationDetails": IP + "/api-assessmen/medicalExamination/getById",// 根据 ID查询化验单解读结果


    // 收益
    "weChatCode": IP + "/api-user/login/weChat",// 微信权限
    "getBalance": IP + "/api-wallet/doctorWallet/getBalance",// 查询余额
    "getBalanceList": IP + "/api-wallet/dealRecord/getList",// 分页查询收支明 列表
    "isExist": IP + "/api-wallet/paymentSign/isExist",// 检测是否有支付密码
    "savePay": IP + "/api-wallet/paymentSign/save",// 新增支付密码
    "updatePay": IP + "/api-wallet/paymentSign/update",// 修改支付密码
    "checkPay": IP + "/api-wallet/paymentSign/check",// 校验支付密码
    "sendPayPasswordCode": IP + "/api-third/sms/sendPayPasswordCode",// 支付密码找回 短信验证码
    "paymentPasswordReset": IP + "/api-wallet/paymentSign/paymentPasswordReset",// 重设 支付 密码
    "getWeChatAccount": IP + "/api-wallet/account/getWeChatAccount",// 查询 微信 账号
    "addWeChatAccount": IP + "/api-wallet/account/addWeChatAccount",// 添加微信 账号
    "deleteWeChatAccount": IP + "/api-wallet/account/deleteWeChatAccount",// 删除微信 账号
    "addOrderCash": IP + "/api-order/order/cash/addOrderCash",// 创建提现订单

    "getPriceDocketList": IP + "/api-stata/docket/getPriceDocketList",// 查询 价格标签 列表
    "getPriceInquiryPictureByParams": IP + "/api-goods/goods/inquiry/getPriceInquiryPictureByParams",// 查询已选图文问诊价格
    "addPriceDocket": IP + "/api-stata/docket/addPriceDocket",// 自定义添加 价格标签
    "deleteCustomDocket": IP + "/api-stata/docket/deleteCustomDocket",// 删除自定义 标签
    "appAdd": IP + "/api-user/weChat/appAdd",// 添加微信用户信息
    "getTotleIncome": IP + "/api-statistic/statistic/getTotleIncome",// 查询累计收益
    // "login": IP + "login",// 注册接口
    // "login": IP + "login",// 注册接口
};