// src/page/basic.info/product.unit/frame.tsx
// 产品单位框架

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
} from '@ant-design/icons';
import ProductUnitModal, {
    ProductUnitRecord,
    FormData,
} from './unit.form.modal';
import '../../../css/basic.info/product.unit/frame.css';
import { ErrResponse, ProductUnitType, SucResponse } from '../../../config/type';
import { LOCAL_STORAGE } from '../../../config/keys';
import { httpUtil } from '../../../utils/HttpUtil';
import { ProductUnitApi } from '../../../config/api';

const { Search } = Input;

const CLS_NAME = `ProductUnit`;

interface ProductUnitProps {
    headerHeight: number;
    productUnitList: ProductUnitType[];
    getProductUnitList: Function;
}

class _ProductUnit extends React.Component<
    WithTranslation & ProductUnitProps
> {
    state = {
        searchText: '',
        loading: false,
        selectedRowKeys: [] as React.Key[],
        currentPage: 1,
        pageSize: 10,
        modalVisible: false,
        modalTitle: '添加产品单位',
        editingRecord: null as ProductUnitRecord | null,
        formData: {
            name: '',
            sortOrder: 1,
        },
    };

    // 产品单位数据 - 这是统计卡片的数据来源
    unitData: ProductUnitRecord[] = [
        {
            key: '1',
            id: 'unit_001',
            name: '千克',
            sortOrder: 1,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
        {
            key: '2',
            id: 'unit_002',
            name: '个',
            sortOrder: 2,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        },
        {
            key: '3',
            id: 'unit_003',
            name: '包',
            sortOrder: 3,
            status: 'active',
            createTime: '2024-01-15 10:30:00',
        }
    ];

    // 添加产品单位
    handleAdd = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '添加产品单位',
            editingRecord: null,
            formData: {
                name: '',
                sortOrder: this.unitData.length + 1,
            },
        });
    };

    // 编辑产品单位
    handleEdit = (record: ProductUnitRecord) => {
        this.setState({
            modalVisible: true,
            modalTitle: '编辑产品单位',
            editingRecord: record,
            formData: {
                name: record.name,
                sortOrder: record.sortOrder,
            },
        });
    };

    // 删除产品单位
    handleDelete = async (record: ProductUnitRecord) => {
        const DEBUG_ON = true;
        const TAG = `${CLS_NAME}.handleDelete() - `;
        this.setState({ loading: true });
        try {
            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                id: record.id
            };

            const response = await httpUtil.post(ProductUnitApi.DEL, params);

            DEBUG_ON && console.log(TAG, `response:\n`, response);

            if (response?.code === 200) {
                await this.fetchProductUnitList();
                let result = response as SucResponse;
                message.success(result.message || '删除成功');
                console.log(TAG, result.message);
            } else {
                let result = response as ErrResponse;
                message.error(result.errMsg || '删除失败');
                console.error('删除产品单位失败:', result.errMsg);
            }
        } catch (error) {
            console.error('删除产品单位API调用失败:', error);
            message.error('网络请求失败，请稍后重试');
        }
        this.setState({ loading: false, selectedRowKeys: [] });
    };

    // 批量删除 - 使用 Popconfirm 确认
    confirmBatchDelete = async () => {
        const { selectedRowKeys } = this.state;
        const DEBUG_ON = true;
        const TAG = `${CLS_NAME}.confirmBatchDelete() - `;

        this.setState({ loading: true });

        try {
            // 获取选中记录的ID列表
            const ids = this.unitData
                .filter(item => selectedRowKeys.includes(item.key))
                .map(item => parseInt(item.id, 10));

            DEBUG_ON && console.log(TAG, `准备删除的IDs:`, ids);

            if (ids.length === 0) {
                message.warning('未找到要删除的单位ID');
                this.setState({ loading: false });
                return;
            }

            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                ids: ids
            };

            const response = await httpUtil.post(ProductUnitApi.BATCH_DEL, params);

            DEBUG_ON && console.log(TAG, `response:`, response);

            if (response?.code === 200) {
                const result = response as SucResponse;
                message.success(result.message || `成功删除 ${selectedRowKeys.length} 个产品单位`);
                // 清空选中状态
                this.setState({ selectedRowKeys: [] });
                // 刷新列表
                await this.fetchProductUnitList();
            } else {
                const result = response as ErrResponse;
                message.error(result.errMsg || '批量删除失败');
            }
        } catch (error) {
            console.error('批量删除产品单位API调用失败:', error);
            message.error('网络请求失败，请稍后重试');
        } finally {
            this.setState({ loading: false });
        }
    };

    // 保存产品单位（添加/编辑）
    handleSave = async () => {
        const { formData, editingRecord } = this.state;

        // 表单验证
        if (!formData.name.trim()) {
            message.warning('请输入产品单位名称');
            return;
        }

        if (!formData.sortOrder && formData.sortOrder !== 0) {
            message.warning('请输入排序序号');
            return;
        }

        // 验证排序序号为正整数
        if (formData.sortOrder < 0) {
            message.warning('排序序号不能为负数');
            return;
        }

        this.setState({ loading: true });

        try {
            let response;

            if (editingRecord) {
                // 编辑模式：调用编辑接口
                response = await this.updateProductUnit({
                    id: parseInt(editingRecord.id, 10),
                    name: formData.name.trim(),
                    sortOrder: formData.sortOrder
                });

                if (response?.code === 200) {
                    const sucResponse = response as SucResponse;
                    message.success(sucResponse.message || '编辑产品单位成功');

                    // 更新本地数据（可选，提升用户体验）
                    const index = this.unitData.findIndex(item => item.id === editingRecord.id);
                    if (index !== -1) {
                        this.unitData[index] = {
                            ...this.unitData[index],
                            name: formData.name.trim(),
                            sortOrder: formData.sortOrder,
                        };
                    }
                } else {
                    const errResponse = response as ErrResponse;
                    message.error(errResponse?.errMsg || '编辑失败');
                    return;
                }
            } else {
                // 添加模式：调用添加接口
                response = await this.addProductUnit({
                    name: formData.name.trim(),
                    sortOrder: formData.sortOrder
                });

                if (response?.code === 200) {
                    const sucResponse = response as SucResponse;
                    message.success(sucResponse.message || '添加产品单位成功');
                } else {
                    const errResponse = response as ErrResponse;
                    message.error(errResponse?.errMsg || '添加失败');
                    return;
                }
            }

            // 操作成功，关闭弹框、重置表单、刷新列表
            this.setState({
                modalVisible: false,
                editingRecord: null,
                formData: {
                    name: '',
                    sortOrder: 1,
                }
            });

            // 刷新产品单位列表
            await this.fetchProductUnitList();

        } catch (error) {
            console.error('保存产品单位失败:', error);
            message.error('网络错误，请稍后重试');
        } finally {
            this.setState({ loading: false });
        }
    };

    // 添加产品单位接口调用
    addProductUnit = async (data: {
        name: string;
        sortOrder: number;
    }) => {
        const DEBUG_ON = true;
        const TAG = `${CLS_NAME}.addProductUnit() - `;

        try {
            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                name: data.name,
                sort_order: data.sortOrder
            };

            const response = await httpUtil.post(ProductUnitApi.ADD, params);

            DEBUG_ON && console.log(TAG, `request params:`, params);
            DEBUG_ON && console.log(TAG, `response:`, response);

            return response;
        } catch (error) {
            console.error('添加产品单位API调用失败:', error);
            return {
                code: 500,
                errMsg: error instanceof Error ? error.message : '网络请求失败'
            };
        }
    };

    // 编辑产品单位接口调用
    updateProductUnit = async (data: {
        id: number;
        name: string;
        sortOrder: number;
    }) => {
        const DEBUG_ON = true;
        const TAG = `${CLS_NAME}.updateProductUnit() - `;

        try {
            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                id: data.id,
                name: data.name,
                sort_order: data.sortOrder
            };

            const response = await httpUtil.post(ProductUnitApi.EDIT, params);

            DEBUG_ON && console.log(TAG, `request params:`, params);
            DEBUG_ON && console.log(TAG, `response:`, response);

            return response;
        } catch (error) {
            console.error('编辑产品单位API调用失败:', error);
            return {
                code: 500,
                errMsg: error instanceof Error ? error.message : '网络请求失败'
            };
        }
    };

    // 获取产品单位列表（刷新数据）
    fetchProductUnitList = async () => {
        const { getProductUnitList } = this.props;
        if (getProductUnitList) {
            await getProductUnitList();
        }
    };

    // 取消模态框
    handleCancel = () => {
        this.setState({
            modalVisible: false,
            editingRecord: null,
            formData: {
                name: '',
                sortOrder: 1,
            },
        });
    };

    // 更新弹框内的表单数据
    handleFormDataChange = (newFormData: FormData) => {
        this.setState({ formData: newFormData });
    };

    // 表格列定义
    columns: ColumnsType<ProductUnitRecord> = [
        {
            title: '单位名称',
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
                        description={`确定要删除产品单位"${record.name}"吗？`}
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
            <div className="product-unit-wrapper">
                {this.renderTitle()}
                {this.renderOpBar()}
                {this.renderTable()}

                <ProductUnitModal
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
            <div className="product-unit-header">
                <h2 className="product-unit-title">产品单位列表</h2>
                <div className="product-unit-desc">
                    管理产品单位
                </div>
            </div>
        );
    }

    /** 操作栏 */
    renderOpBar() {
        const { selectedRowKeys } = this.state;

        return (
            <div className="product-unit-actions">
                <Space wrap size="middle">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={this.handleAdd}
                    >
                        添加单位
                    </Button>
                    <Popconfirm
                        title="确认批量删除"
                        description={`确定要删除选中的 ${selectedRowKeys.length} 个产品单位吗？`}
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
        );
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

        const { productUnitList } = this.props;
        this.unitData = [];
        for (let i = 0; i < productUnitList.length; i++) {
            const e = productUnitList[i];
            this.unitData.push({
                key: `${i + 1}`,
                id: `${e.id}`,
                name: e.name,
                sortOrder: e.sortOrder,
                status: e.status == 1 ? 'active' : 'inactive',
                createTime: e.createTime,
            });
        }

        let filteredData = [...this.unitData];
        if (searchText) {
            filteredData = filteredData.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = filteredData.slice(start, end);

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
            <div className="product-unit-table-container">
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
        );
    }
}

export const ProductUnit = withTranslation()(_ProductUnit);