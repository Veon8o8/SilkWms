// src/page/basic.info/product.property/frame.tsx
// 产品属性框架（已完全移除属性编码和统计数量字段）

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
    Button,
    Input,
    Table,
    Tag,
    Space,
    Tooltip,
    message,
    Popconfirm,
    ConfigProvider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    AppstoreOutlined,
    DatabaseOutlined,
    ToolOutlined,
    DeleteOutlined as WasteOutlined,
    ScheduleOutlined,
} from '@ant-design/icons';
import PropertyFormModal, {
    ProductPropertyRecord,
    FormData,
    iconMap,
} from './property.form.modal';
import '../../../css/basic.info/product.property/frame.css';
import { ErrResponse, ProductPropertyType, SucResponse } from '../../../config/type';
import { LOCAL_STORAGE } from '../../../config/keys';
import { httpUtil } from '../../../utils/HttpUtil';
import { ProductPropertyApi } from '../../../config/api';

const { Search } = Input;

const CLS_NAME = `ProductProperty`;

interface ProductPropertyProps {
    headerHeight: number;
    productPropertyList: ProductPropertyType[];
    getProductPropertyList: Function;
}

class _ProductProperty extends React.Component<
    WithTranslation & ProductPropertyProps
> {
    state = {
        searchText: '',
        loading: false,
        selectedRowKeys: [] as React.Key[],
        currentPage: 1,
        pageSize: 10,
        modalVisible: false,
        modalTitle: '添加产品属性',
        editingRecord: null as ProductPropertyRecord | null,
        formData: {
            name: '',
            icon: '',
            color: '',
            sortOrder: 1,
        },
    };

    // 产品属性数据 - 这是统计卡片的数据来源
    propertyData: ProductPropertyRecord[] = [
        {
            key: '1',
            id: 'prop_001',
            name: '成品（生产）',
            icon: 'AppstoreOutlined',
            color: '#1890ff',
            sortOrder: 1,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
        {
            key: '2',
            id: 'prop_002',
            name: '原料',
            icon: 'DatabaseOutlined',
            color: '#fa8c16',
            sortOrder: 2,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
        {
            key: '3',
            id: 'prop_003',
            name: '备件',
            icon: 'ToolOutlined',
            color: '#722ed1',
            sortOrder: 3,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
        {
            key: '4',
            id: 'prop_004',
            name: '废料',
            icon: 'DeleteOutlined',
            color: '#f5222d',
            sortOrder: 4,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
        {
            key: '5',
            id: 'prop_005',
            name: '计划成品',
            icon: 'ScheduleOutlined',
            color: '#13c2c2',
            sortOrder: 5,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
    ];

    // 获取图标组件
    getIconComponent = (iconName: string) => {
        return iconMap[iconName] || <AppstoreOutlined />;
    };

    // 添加产品属性
    handleAdd = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '添加产品属性',
            editingRecord: null,
            formData: {
                name: '',
                icon: 'AppstoreOutlined',
                color: '#1890ff',
                sortOrder: this.propertyData.length + 1,
            },
        });
    };

    // 编辑产品属性
    handleEdit = (record: ProductPropertyRecord) => {
        this.setState({
            modalVisible: true,
            modalTitle: '编辑产品属性',
            editingRecord: record,
            formData: {
                name: record.name,
                icon: record.icon,
                color: record.color,
                sortOrder: record.sortOrder,
            },
        });
    };

    // 删除产品属性
    handleDelete = async (record: ProductPropertyRecord) => {
        this.setState({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newData = this.propertyData.filter((item) => item.key !== record.key);
        this.propertyData.length = 0;
        this.propertyData.push(...newData);

        message.success(`删除产品属性"${record.name}"成功`);
        this.setState({ loading: false, selectedRowKeys: [] });
    };

    // 批量删除
    handleBatchDelete = async () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            message.warning('请选择要删除的产品属性');
            return;
        }

        this.setState({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newData = this.propertyData.filter(
            (item) => !selectedRowKeys.includes(item.key)
        );
        this.propertyData.length = 0;
        this.propertyData.push(...newData);

        message.success(`成功删除 ${selectedRowKeys.length} 个产品属性`);
        this.setState({ loading: false, selectedRowKeys: [] });
    };

    // 保存产品属性（添加/编辑）
    handleSave = async () => {
        const { formData, editingRecord } = this.state;

        // 表单验证 - 只验证名称
        if (!formData.name.trim()) {
            message.warning('请输入产品属性名称');
            return;
        }

        this.setState({ loading: true });

        try {
            if (editingRecord) {
                // 编辑：调用编辑接口
                const response = await this.updateProductProperty({
                    id: parseInt(editingRecord.key),
                    name: formData.name,
                    icon: formData.icon,
                    color: formData.color,
                    sortOrder: formData.sortOrder
                });

                if (response.success) {
                    // 更新本地数据
                    const index = this.propertyData.findIndex(item => item.key === editingRecord.key);
                    if (index !== -1) {
                        this.propertyData[index] = {
                            ...editingRecord,
                            name: formData.name,
                            icon: formData.icon,
                            color: formData.color,
                            sortOrder: formData.sortOrder,
                        };
                    }
                    message.success('编辑产品属性成功');
                    // 重新获取列表
                    await this.fetchProductPropertyList();
                } else {
                    message.error(response.message || '编辑失败');
                    this.setState({ loading: false });
                    return;
                }
            } else {
                // 添加：调用添加接口
                const response = await this.addProductProperty({
                    name: formData.name,
                    icon: formData.icon,
                    color: formData.color,
                    sortOrder: formData.sortOrder
                });

                if (response.success) {
                    message.success('添加产品属性成功');
                    // 重新获取列表
                    await this.fetchProductPropertyList();
                } else {
                    message.error(response.message || '添加失败');
                    this.setState({ loading: false });
                    return;
                }
            }

            // 关闭弹框并重置表单
            this.setState({
                loading: false,
                modalVisible: false,
                formData: {
                    name: '',
                    icon: 'AppstoreOutlined',
                    color: '#1890ff',
                    sortOrder: 1,
                }
            });
        } catch (error) {
            console.error('保存产品属性失败:', error);
            message.error('网络错误，请稍后重试');
            this.setState({ loading: false });
        }
    };

    // 添加产品属性接口调用
    addProductProperty = async (data: {
        name: string;
        icon: string;
        color: string;
        sortOrder: number;
    }) => {
        const DEBUG_ON = true
        const TAG = `${CLS_NAME}.addProductProperty() - `
        try {
            // 构建请求参数
            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                name: data.name,
                icon: data.icon,
                color: data.color,
                sort_order: data.sortOrder
            }

            // 发送请求
            const response = await httpUtil.post(ProductPropertyApi.ADD, params);

            DEBUG_ON && console.log(TAG, `response:\n`, response)

            if (response?.code === 200) {
                let result = response as SucResponse
                return {
                    success: true,
                    data: result.data,
                    message: result.message
                };
            } else {
                let result = response as ErrResponse
                return {
                    success: false,
                    data: null,
                    message: result.errMsg
                };
            }
        } catch (error) {
            console.error('添加产品属性API调用失败:', error);
            return {
                success: false,
                message: '网络请求失败'
            };
        }
    };

    // 编辑产品属性接口调用
    updateProductProperty = async (data: {
        id: number;
        name: string;
        icon: string;
        color: string;
        sortOrder: number;
    }) => {
        const DEBUG_ON = true
        const TAG = `${CLS_NAME}.updateProductProperty() - `
        try {
            // 构建请求参数
            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                id: data.id,
                name: data.name,
                icon: data.icon,
                color: data.color,
                sort_order: data.sortOrder
            }

            // 发送请求
            const response = await httpUtil.post(ProductPropertyApi.EDIT, params);

            DEBUG_ON && console.log(TAG, `response:\n`, response)

            if (response?.code === 200) {
                let result = response as SucResponse
                return {
                    success: true,
                    data: result.data,
                    message: result.message
                };
            } else {
                let result = response as ErrResponse
                return {
                    success: false,
                    data: null,
                    message: result.errMsg
                };
            }
        } catch (error) {
            console.error('编辑产品属性API调用失败:', error);
            return {
                success: false,
                message: '网络请求失败'
            };
        }
    };

    // 获取产品属性列表
    fetchProductPropertyList = async () => {
        // 通知框架刷新产品属性列表
        const { getProductPropertyList } = this.props;
        getProductPropertyList && getProductPropertyList();
    };

    // 取消模态框
    handleCancel = () => {
        this.setState({
            modalVisible: false,
            editingRecord: null,
            formData: {
                name: '',
                icon: 'AppstoreOutlined',
                color: '#1890ff',
                sortOrder: 1,
            },
        });
    };

    // 更新弹框内的表单数据
    handleFormDataChange = (newFormData: FormData) => {
        this.setState({ formData: newFormData });
    };

    // 表格列定义 - 移除了属性编码和数量/统计列
    columns: ColumnsType<ProductPropertyRecord> = [
        {
            title: '属性名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text, record) => (
                <Space>
                    <span style={{ color: record.color, fontSize: '18px' }}>
                        {this.getIconComponent(record.icon)}
                    </span>
                    <span style={{ fontWeight: 500 }}>{text}</span>
                </Space>
            ),
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            width: 100,
            align: 'center',
            render: (icon, record) => (
                <div style={{ fontSize: '24px', color: record.color }}>
                    {this.getIconComponent(icon)}
                </div>
            ),
        },
        {
            title: '主题色',
            dataIndex: 'color',
            key: 'color',
            width: 120,
            render: (color) => (
                <Space>
                    <div
                        style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: color,
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9',
                        }}
                    />
                    <span>{color}</span>
                </Space>
            ),
        },
        {
            title: '排序',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
            width: 80,
            align: 'center',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'default'}>
                    {status === 'active' ? '启用' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="编辑">
                        <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => this.handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="确认删除"
                        description={`确定要删除产品属性"${record.name}"吗？`}
                        onConfirm={() => this.handleDelete(record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Tooltip title="删除">
                            <Button
                                type="link"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys: newSelectedRowKeys });
    };

    handleSearch = (value: string) => {
        this.setState({
            searchText: value,
            currentPage: 1,
        });
    };

    render() {
        const {
            loading,
            modalVisible,
            modalTitle,
            formData,
        } = this.state;

        return (
            <div className="product-property-wrapper">
                {this.renderTitle()}
                {this.renderOpBar()}
                {this.renderTable()}

                {/* 使用抽取出的弹框组件 */}
                <PropertyFormModal
                    visible={modalVisible}
                    title={modalTitle}
                    formData={formData}
                    loading={loading}
                    onOk={this.handleSave}
                    onCancel={this.handleCancel}
                    onFormDataChange={this.handleFormDataChange}
                />
            </div>
        );
    }

    /** 标题栏 */
    renderTitle() {
        return (
            <div className="product-property-header">
                <h2 className="product-property-title">产品属性列表</h2>
                <div className="product-property-desc">
                    管理产品信息页面的统计卡片数据源
                </div>
            </div>
        )
    }

    /** 操作栏 */
    renderOpBar() {
        return (
            <div className="product-property-actions">
                <Space wrap size="middle">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={this.handleAdd}
                    >
                        添加属性
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={this.handleBatchDelete}
                    >
                        批量删除
                    </Button>
                </Space>
                <Space>
                    <Search
                        placeholder="搜索名称"
                        allowClear
                        onSearch={this.handleSearch}
                        onChange={(e) => !e.target.value && this.handleSearch('')}
                        style={{ width: 260 }}
                        prefix={<SearchOutlined />}
                    />
                </Space>
            </div>
        )
    }

    /** 表格区域 */
    renderTable() {
        const {
            searchText,
            loading,
            selectedRowKeys,
            currentPage,
            pageSize,
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const { productPropertyList } = this.props;
        this.propertyData = []
        for (let i = 0; i < productPropertyList.length; i++) {
            const e = productPropertyList[i];
            this.propertyData.push({
                key: `${i + 1}`,
                id: `${e.id}`,
                name: e.name,
                icon: e.icon,
                color: e.color,
                sortOrder: e.sortOrder,
                status: e.status == 1 ? 'active' : 'inactive',
                createTime: e.createTime,
            })
        }

        // 过滤数据 - 只根据名称搜索
        let filteredData = [...this.propertyData];
        if (searchText) {
            filteredData = filteredData.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        // 分页数据
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = filteredData.slice(start, end);

        // 分页配置
        const paginationConfig = {
            current: currentPage,
            pageSize: pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page: number, size?: number) => {
                this.setState({
                    currentPage: page,
                    pageSize: size || 10,
                });
            },
            onShowSizeChange: (current: number, size: number) => {
                this.setState({
                    currentPage: 1,
                    pageSize: size,
                });
            },
        };
        return (
            <div className="product-property-table-container">
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: '#fafafa',
                            },
                        },
                    }}
                >
                    <Table
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={paginatedData}
                        loading={loading}
                        pagination={paginationConfig}
                        scroll={{ x: 900 }}
                        size="middle"
                        bordered
                        rowKey="key"
                    />
                </ConfigProvider>
            </div>
        )
    }
}

export const ProductProperty = withTranslation()(_ProductProperty);