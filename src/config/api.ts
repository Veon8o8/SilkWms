// src/config/api.ts

// 配置: 服务器接口

/** 服务器地址 */
// export const HOST = 'http://140.143.97.54'
export const HOST = 'http://localhost'
/** 服务器端口 */
// export const PORT = ':51801'
// export const PORT = ''
export const PORT = ':3002'

/** 页面路由根路径 */
export const ROOT = `/mgmt`

/** API根路径 */
export const URL = `${HOST}${PORT}`

/** 权限管理接口(auth). */
export const AuthApi = {
    /** 管理员登录 */
    LOGIN: `${URL}/admin/auth/login`,
    /** 获取管理员列表 */
    LIST: `${URL}/admin/auth/list`,
    /** 创建新的管理员(权限高的能创建低的) */
    CREATE: `${URL}/admin/auth/create`,
    /** 封号管理员 */
    BLOCK: `${URL}/admin/auth/block`,
    /** 解封管理员 */
    UNBLOCK: `${URL}/admin/auth/unblock`,
    /** 编辑管理员(名字，身份) */
    EDIT: `${URL}/admin/auth/edit`,
}

/** 用户管理接口(user). */
export const UserApi = {
    /** 获取用户列表 */
    LIST: `${URL}/admin/user/list`,
    /** 获取用户详情 */
    DETAIL: `${URL}/admin/user/detail`,
    /** 冻结用户 */
    FREEZE: `${URL}/admin/user/freeze`,
    /** 解冻 */
    UNFREEZE: `${URL}/admin/user/unfreeze`,
    /** 封号 */
    BLOCK: `${URL}/admin/user/block`,
    /** 解封 */
    UNBLOCK: `${URL}/admin/user/unblock`,
}

/** 动态管理接口(dynamic). */
export const DynamicApi = {
    /** 获取管理员动态 */
    LIST_ADMIN: `${URL}/admin/dynamic/listAdmin`,
    /** 获取用户动态 */
    LIST_USER: `${URL}/admin/dynamic/listUser`,
}

/** 部门管理接口(department). */
export const DepartmentApi = {
    /** 获取部门列表 */
    LIST: `${URL}/coms/department/list`,
    /** 创建新部门 */
    ADD: `${URL}/coms/department/add`,
    /** 编辑部门 */
    EDIT: `${URL}/coms/department/edit`,
    /** 删除部门 */
    DEL: `${URL}/coms/department/del`,
}

/** 岗位管理接口(position). */
export const PositionApi = {
    /** 获取岗位列表 */
    LIST: `${URL}/coms/position/list`,
    /** 创建新岗位 */
    ADD: `${URL}/coms/position/add`,
    /** 编辑岗位 */
    EDIT: `${URL}/coms/position/edit`,
    /** 删除岗位 */
    DEL: `${URL}/coms/position/del`,
}

/** 员工管理接口(employee). */
export const EmployeeApi = {
    LIST: `${URL}/coms/employee/list`,
    ADD: `${URL}/coms/employee/add`,
    EDIT: `${URL}/coms/employee/edit`,
    DEL: `${URL}/coms/employee/del`,
    DETAIL: `${URL}/coms/employee/detail`,
}

/** 产品属性接口 (product-property). */
export const ProductPropertyApi = {
    /** 添加产品属性: /wms/product-property/add */
    ADD: `${URL}/wms/product-property/add`,
    /** 删除产品属性: /wms/product-property/del */
    DEL: `${URL}/wms/product-property/del`,
    /** 批量删除产品属性: /wms/product-property/batch-del */
    BATCH_DEL: `${URL}/wms/product-property/batch-del`,
    /** 编辑产品属性: /wms/product-property/edit */
    EDIT: `${URL}/wms/product-property/edit`,
    /** 获取产品属性列表: /wms/product-property/list */
    LIST: `${URL}/wms/product-property/list`,
    /** 获取产品属性详情: /wms/product-property/detail */
    DETAIL: `${URL}/wms/product-property/detail`,
    /** 更新产品属性状态: /wms/product-property/update-status */
    UPDATE_STATUS: `${URL}/wms/product-property/update-status`,
    /** 更新产品属性排序: /wms/product-property/update-sort */
    UPDATE_SORT: `${URL}/wms/product-property/update-sort`,
    /** 获取启用的产品属性: /wms/product-property/active-list */
    ACTIVE_LIST: `${URL}/wms/product-property/active-list`,
}

/** 产品规格接口 (product-spec). */
export const ProductSpecApi = {
    /** 添加产品规格: /wms/product-spec/add */
    ADD: `${URL}/wms/product-spec/add`,
    /** 删除产品规格: /wms/product-spec/del */
    DEL: `${URL}/wms/product-spec/del`,
    /** 批量删除产品规格: /wms/product-spec/batch-del */
    BATCH_DEL: `${URL}/wms/product-spec/batch-del`,
    /** 编辑产品规格: /wms/product-spec/edit */
    EDIT: `${URL}/wms/product-spec/edit`,
    /** 获取产品规格列表: /wms/product-spec/list */
    LIST: `${URL}/wms/product-spec/list`,
    /** 获取产品规格详情: /wms/product-spec/detail */
    DETAIL: `${URL}/wms/product-spec/detail`,
    /** 更新产品规格状态: /wms/product-spec/update-status */
    UPDATE_STATUS: `${URL}/wms/product-spec/update-status`,
    /** 更新产品规格排序: /wms/product-spec/update-sort */
    UPDATE_SORT: `${URL}/wms/product-spec/update-sort`,
    /** 获取启用的产品规格: /wms/product-spec/active-list */
    ACTIVE_LIST: `${URL}/wms/product-spec/active-list`,
}

/** 产品单位API */
export const ProductUnitApi = {
    ADD: `${URL}/wms/product-unit/add`,
    DEL: `${URL}/wms/product-unit/del`,
    BATCH_DEL: `${URL}/wms/product-unit/batch-del`,
    EDIT: `${URL}/wms/product-unit/edit`,
    LIST: `${URL}/wms/product-unit/list`,
    DETAIL: `${URL}/wms/product-unit/detail`,
    UPDATE_STATUS: `${URL}/wms/product-unit/update-status`,
    UPDATE_SORT: `${URL}/wms/product-unit/update-sort`,
    ACTIVE_LIST: `${URL}/wms/product-unit/active-list`,
}

// 仓库管理API
export const WarehouseApi = {
    /** 添加仓库: /wms/warehouse/add */
    ADD: `${URL}/wms/warehouse/add`,
    /** 删除仓库: /wms/warehouse/del */
    DEL: `${URL}/wms/warehouse/del`,
    /** 批量删除仓库: /wms/warehouse/batch-del */
    BATCH_DEL: `${URL}/wms/warehouse/batch-del`,
    /** 编辑仓库: /wms/warehouse/edit */
    EDIT: `${URL}/wms/warehouse/edit`,
    /** 获取仓库列表: /wms/warehouse/list */
    LIST: `${URL}/wms/warehouse/list`,
    /** 获取仓库详情: /wms/warehouse/detail */
    DETAIL: `${URL}/wms/warehouse/detail`,
    /** 更新仓库状态: /wms/warehouse/update-status */
    UPDATE_STATUS: `${URL}/wms/warehouse/update-status`,
    /** 更新仓库排序: /wms/warehouse/update-sort */
    UPDATE_SORT: `${URL}/wms/warehouse/update-sort`,
    /** 获取启用的仓库: /wms/warehouse/active-list */
    ACTIVE_LIST: `${URL}/wms/warehouse/active-list`,
}