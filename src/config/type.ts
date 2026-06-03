export type ErrResponse = {
    code: number;
    errMsg: string;
    errCode: number;
}

export type SucResponse = {
    code: number;
    data: any;
    message: string;
}

// 定义部门数据类型
export interface DepartmentType {
    depId: number;
    name: string;
    count: number;
    parentId: number;
    parentName: string;
    createTime: string;
}

// 定义岗位数据类型
export interface PositionType {
    posId: number;
    name: string;
    count: number;
    createTime: string;
}

// 定义员工卡片数据类型
export interface EmployeeType {  // 导出供其他组件使用
    id: string;
    code: string;        // 工号
    name: string;        // 姓名
    gender: string;      // 性别
    department: string;  // 部门
    status: string;      // 员工状态
    position: string;    // 岗位
    createTime: string;
    depId: number;
    posId: number;
}

// 紧急联系人类型（与添加面板一致）
export interface EmergencyContactType {
    contact_name: string;
    contact_relationship: string;
    contact_phone: string;
}


// 扩展员工详情类型，包含添加面板的所有字段
export interface EmployeeDetailType extends EmployeeType {
    // 基本信息
    idCard?: string;
    birthDate?: string;
    birthplace?: string;
    householdRegister?: string;
    householdType?: string;
    ethnicity?: string;
    maritalStatus?: string;
    politicalStatus?: string;
    employeePhoto?: string;
    emergencyContacts?: EmergencyContactType[];

    // 通讯信息
    phone?: string;
    email?: string;
    permanentAddress?: string;

    // 用工信息
    employmentType?: string;
    workStartDate?: string;
    entryDate?: string;
    probationDays?: number;
    regularDate?: string;
    probationSalary?: number;
    formalSalary?: number;

    // 汇报关系
    reportTo?: string;
    reportToName?: string;

    // 账户信息
    bankCard?: string;
    bankName?: string;

    // 教育信息
    education?: string;
    school?: string;
    major?: string;
    graduationDate?: string;

    // 提交信息
    submitter?: string;
    submitTime?: string;
}

/** 产品属性类型定义 */
export interface ProductPropertyType {
    /** 主键ID */
    id: number;

    /** 属性名称，如：成品（生产） */
    name: string;

    /** 图标名称，如：AppstoreOutlined */
    icon: string;

    /** 主题色，十六进制颜色值，如：#1890ff */
    color: string;

    /** 排序序号，数字越小越靠前 */
    sortOrder: number;

    /** 状态：0-禁用，1-启用 */
    status: number;

    /** 创建时间 */
    createTime: string;

    /** 更新时间 */
    updateTime: string;
}

/** 规格型号定义 */
export interface ProductSpecType {
    /** 主键ID */
    id: number;

    /** 属性名称，如：成品（生产） */
    name: string;

    /** 排序序号，数字越小越靠前 */
    sortOrder: number;

    /** 状态：0-禁用，1-启用 */
    status: number;

    /** 创建时间 */
    createTime: string;

    /** 更新时间 */
    updateTime: string;
}

// 产品单位类型
export interface ProductUnitType {
    /** 单位ID */
    id: number;

    /** 单位名称，例如：千克、个、包 */
    name: string;

    /** 排序序号，数值越小越靠前 */
    sortOrder: number;

    /** 状态：1-启用，0-禁用 */
    status: number;

    /** 创建时间，格式：YYYY-MM-DD HH:mm:ss */
    createTime: string;

    /** 更新时间，格式：YYYY-MM-DD HH:mm:ss */
    updateTime: string;
}

// 仓库类型
export interface WarehouseType {
    /** 仓库ID */
    id: number;
    /** 仓库名称 */
    name: string;
    /** 仓库编码 */
    code: string;
    /** 仓库地址 */
    address: string;
    /** 状态：1-启用，0-停用 */
    status: number;
    /** 仓库主管 */
    supervisor: string;
    /** 库管归属部门 */
    department: string;
    /** 联系电话 */
    phone: string;
    /** 提交人 */
    submitter?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 备注 */
    remark?: string;
}