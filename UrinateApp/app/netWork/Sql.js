export let sql = {
    deleteUser: "delete from user",// 清空 user 表
    dropUser: "drop table user",// 删除 user 表
    dropTitle: "drop table title",// 删除 user 表
    dropBranch: "drop table branch",// 删除 user 表
    insertUserSign: "INSERT INTO user(id,signStatus)" + " values(?,?)",// 插入认证状态
    updateUserSign: "UPDATE user SET signStatus = ? WHERE id = ?",// 更新 user 认证状态
    selectUser: "select * from user",// 查询 user
};