// src/page/basic.info/product.spec/frame.tsx
// 规格型号框架

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
    Modal,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import PropertyFormModal, {
    ProductSpecRecord,
    FormData,
} from './spec.form.modal';
import '../../../css/basic.info/product.spec/frame.css';
import { ErrResponse, ProductSpecType, SucResponse } from '../../../config/type';
import { LOCAL_STORAGE } from '../../../config/keys';
import { httpUtil } from '../../../utils/HttpUtil';
import { ProductSpecApi } from '../../../config/api';

const { Search } = Input;

const CLS_NAME = `ProductSpec`;

interface ProductSpecProps {
    headerHeight: number;
    productPropertyList: ProductSpecType[];
    getProductSpecList: Function;
}

class _ProductSpec extends React.Component<
    WithTranslation & ProductSpecProps
> {
    state = {
        searchText: '',
        loading: false,
        selectedRowKeys: [] as React.Key[],
        currentPage: 1,
        pageSize: 10,
        modalVisible: false,
        modalTitle: '添加产品规格',
        editingRecord: null as ProductSpecRecord | null,
        formData: {
            name: '',
            icon: '',
            color: '',
            sortOrder: 1,
        },
    };

    // 产品规格数据 - 这是统计卡片的数据来源
    specData: ProductSpecRecord[] = [
        {
            key: '1',
            id: 'spec_001',
            name: '筒（C类）1000g',
            sortOrder: 1,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
        {
            key: '2',
            id: 'spec_002',
            name: '绞（一等）1.27m/200g',
            sortOrder: 2,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
        {
            key: '3',
            id: 'spec_003',
            name: '绞（二等）1.27m/200g',
            sortOrder: 3,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        }
    ];

    // 添加产品规格
    handleAdd = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '添加产品规格',
            editingRecord: null,
            formData: {
                name: '',
                icon: 'AppstoreOutlined',
                color: '#1890ff',
                sortOrder: this.specData.length + 1,
            },
        });
    };

    // 编辑产品规格
    handleEdit = (record: ProductSpecRecord) => {
        this.setState({
            modalVisible: true,
            modalTitle: '编辑产品规格',
            editingRecord: record,
            formData: {
                name: record.name,
                sortOrder: record.sortOrder,
            },
        });
    };

    // 删除产品规格
    handleDelete = async (record: ProductSpecRecord) => {
        const DEBUG_ON = true
        const TAG = `${CLS_NAME}.handleDelete() - `
        this.setState({ loading: true });
        try {
            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                id: record.id
            }

            // 发送请求
            const response = await httpUtil.post(ProductSpecApi.DEL, params);

            DEBUG_ON && console.log(TAG, `response:\n`, response)

            if (response?.code === 200) {
                await this.fetchProductSpecList()
                let result = response as SucResponse
                message.success(result.message || '删除成功');
                console.log(TAG, result.message)
            } else {
                let result = response as ErrResponse
                message.error(result.errMsg || '删除失败');
                console.error('删除产品规格失败:', result.errMsg);
            }
        }
        catch (error) {
            console.error('删除产品规格API调用失败:', error);
            message.error('网络请求失败，请稍后重试');
        }
        this.setState({ loading: false, selectedRowKeys: [] });
    };

    // 批量删除 - 使用 Popconfirm 确认后调用服务器接口
    confirmBatchDelete = async () => {
        const { selectedRowKeys } = this.state;
        const DEBUG_ON = true;
        const TAG = `${CLS_NAME}.confirmBatchDelete() - `;

        this.setState({ loading: true });

        try {
            // 获取选中记录的ID列表
            const ids = this.specData
                .filter(item => selectedRowKeys.includes(item.key))
                .map(item => parseInt(item.id, 10));

            DEBUG_ON && console.log(TAG, `准备删除的IDs:`, ids);

            if (ids.length === 0) {
                message.warning('未找到要删除的规格ID');
                this.setState({ loading: false });
                return;
            }

            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                ids: ids
            };

            const response = await httpUtil.post(ProductSpecApi.BATCH_DEL, params);

            DEBUG_ON && console.log(TAG, `response:`, response);

            if (response?.code === 200) {
                const result = response as SucResponse;
                message.success(result.message || `成功删除 ${selectedRowKeys.length} 个产品规格`);
                // 清空选中状态
                this.setState({ selectedRowKeys: [] });
                // 刷新列表
                await this.fetchProductSpecList();
            } else {
                const result = response as ErrResponse;
                message.error(result.errMsg || '批量删除失败');
            }
        } catch (error) {
            console.error('批量删除产品规格API调用失败:', error);
            message.error('网络请求失败，请稍后重试');
        } finally {
            this.setState({ loading: false });
        }
    };

    // 保存产品规格（添加/编辑）
    handleSave = async () => {
        const { formData, editingRecord } = this.state;

        // 表单验证 - 只验证名称
        if (!formData.name.trim()) {
            message.warning('请输入产品规格名称');
            return;
        }

        this.setState({ loading: true });

        try {
            if (editingRecord) {
                // 编辑：调用编辑接口
                const response = await this.updateProductSpec({
                    id: parseInt(editingRecord.id, 10),
                    name: formData.name,
                    icon: formData.icon,
                    color: formData.color,
                    sortOrder: formData.sortOrder
                });

                if (response?.code === 200) {
                    const sucResponse = response as SucResponse;
                    message.success(sucResponse.message || '编辑产品规格成功');
                    // 重新获取列表
                    await this.fetchProductSpecList();
                } else {
                    const errResponse = response as ErrResponse;
                    message.error(errResponse?.errMsg || '编辑失败');
                    this.setState({ loading: false });
                    return;
                }
            } else {
                // 添加：调用添加接口
                const response = await this.addProductSpec({
                    name: formData.name,
                    icon: formData.icon,
                    color: formData.color,
                    sortOrder: formData.sortOrder
                });

                if (response?.code === 200) {
                    const sucResponse = response as SucResponse;
                    message.success(sucResponse.message || '添加产品规格成功');
                    // 重新获取列表
                    await this.fetchProductSpecList();
                } else {
                    const errResponse = response as ErrResponse;
                    message.error(errResponse?.errMsg || '添加失败');
                    this.setState({ loading: false });
                    return;
                }
            }

            // 关闭弹框并重置表单
            this.setState({
                loading: false,
                modalVisible: false,
                editingRecord: null,
                formData: {
                    name: '',
                    icon: 'AppstoreOutlined',
                    color: '#1890ff',
                    sortOrder: 1,
                }
            });
        } catch (error) {
            console.error('保存产品规格失败:', error);
            message.error('网络错误，请稍后重试');
            this.setState({ loading: false });
        }
    };

    // 添加产品规格接口调用
    addProductSpec = async (data: {
        name: string;
        icon: string;
        color: string;
        sortOrder: number;
    }) => {
        const DEBUG_ON = true
        const TAG = `${CLS_NAME}.addProductSpec() - `
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
            const response = await httpUtil.post(ProductSpecApi.ADD, params);

            DEBUG_ON && console.log(TAG, `response:\n`, response)

            return response;
        } catch (error) {
            console.error('添加产品规格API调用失败:', error);
            return {
                code: 500,
                errMsg: error instanceof Error ? error.message : '网络请求失败'
            };
        }
    };

    // 编辑产品规格接口调用
    updateProductSpec = async (data: {
        id: number;
        name: string;
        icon: string;
        color: string;
        sortOrder: number;
    }) => {
        const DEBUG_ON = true
        const TAG = `${CLS_NAME}.updateProductSpec() - `
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
            const response = await httpUtil.post(ProductSpecApi.EDIT, params);

            DEBUG_ON && console.log(TAG, `response:\n`, response)

            return response;
        } catch (error) {
            console.error('编辑产品规格API调用失败:', error);
            return {
                code: 500,
                errMsg: error instanceof Error ? error.message : '网络请求失败'
            };
        }
    };

    // 获取产品规格列表
    fetchProductSpecList = async () => {
        // 通知框架刷新产品规格列表
        const { getProductSpecList } = this.props;
        getProductSpecList && getProductSpecList();
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

    // 表格列定义 - 移除了图标和主题色列，规格名称只显示字符串
    columns: ColumnsType<ProductSpecRecord> = [
        {
            title: '规格名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
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
                        description={`确定要删除产品规格"${record.name}"吗？`}
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
            selectedRowKeys,
        } = this.state;

        return (
            <div className="product-spec-wrapper">
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
            <div className="product-spec-header">
                <h2 className="product-spec-title">规格型号列表</h2>
                <div className="product-spec-desc">
                    管理规格型号
                </div>
            </div>
        )
    }

    /** 操作栏 */
    renderOpBar() {
        const { selectedRowKeys } = this.state;

        return (
            <div className="product-spec-actions">
                <Space wrap size="middle">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={this.handleAdd}
                    >
                        添加规格
                    </Button>
                    <Popconfirm
                        title="确认批量删除"
                        description={`确定要删除选中的 ${selectedRowKeys.length} 个产品规格吗？`}
                        onConfirm={this.confirmBatchDelete}
                        okText="确定"
                        cancelText="取消"
                        disabled={selectedRowKeys.length === 0}
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={selectedRowKeys.length === 0}
                        >
                            批量删除
                        </Button>
                    </Popconfirm>
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
        this.specData = []
        for (let i = 0; i < productPropertyList.length; i++) {
            const e = productPropertyList[i];
            this.specData.push({
                key: `${i + 1}`,
                id: `${e.id}`,
                name: e.name,
                sortOrder: e.sortOrder,
                status: e.status == 1 ? 'active' : 'inactive',
                createTime: e.createTime,
            })
        }

        // 过滤数据 - 只根据名称搜索
        let filteredData = [...this.specData];
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
                    currentPage: current,
                    pageSize: size,
                });
            },
        };
        return (
            <div className="product-spec-table-container">
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
                        scroll={{ x: 700 }}
                        size="middle"
                        bordered
                        rowKey="key"
                    />
                </ConfigProvider>
            </div>
        )
    }
}

export const ProductSpec = withTranslation()(_ProductSpec);