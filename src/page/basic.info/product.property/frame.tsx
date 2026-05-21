// src/page/basic.info/product.property/frame.tsx

// 产品属性框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
    Button,
    Input,
    Card,
    Table,
    Tag,
    Space,
    Tooltip,
    message,
    Modal,
    Form,
    Popconfirm,
    ConfigProvider
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
    ScheduleOutlined
} from '@ant-design/icons';
import '../../../css/basic.info/product.property/frame.css';

const { Search } = Input;

interface ProductPropertyProps {
    headerHeight: number;
}

interface ProductPropertyRecord {
    key: string;
    id: string;
    name: string;
    code: string;
    count: number | string;
    icon: string;
    color: string;
    sortOrder: number;
    status: 'active' | 'inactive';
    createTime: string;
}

class _ProductProperty extends React.Component<WithTranslation & ProductPropertyProps> {
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
            code: '',
            count: '',
            icon: '',
            color: '',
            sortOrder: 1,
        }
    };

    // 产品属性数据 - 这是统计卡片的数据来源
    propertyData: ProductPropertyRecord[] = [
        {
            key: '1',
            id: 'prop_001',
            name: '成品（生产）',
            code: 'finished',
            count: 17,
            icon: 'AppstoreOutlined',
            color: '#1890ff',
            sortOrder: 1,
            status: 'active',
            createTime: '2024-01-15 10:30:00'
        },
        {
            key: '2',
            id: 'prop_002',
            name: '原料',
            code: 'raw',
            count: '99',
            icon: 'DatabaseOutlined',
            color: '#fa8c16',
            sortOrder: 2,
            status: 'active',
            createTime: '2024-01-15 10:30:00'
        },
        {
            key: '3',
            id: 'prop_003',
            name: '备件',
            code: 'spare',
            count: 5,
            icon: 'ToolOutlined',
            color: '#722ed1',
            sortOrder: 3,
            status: 'active',
            createTime: '2024-01-15 10:30:00'
        },
        {
            key: '4',
            id: 'prop_004',
            name: '废料',
            code: 'waste',
            count: 3,
            icon: 'DeleteOutlined',
            color: '#f5222d',
            sortOrder: 4,
            status: 'active',
            createTime: '2024-01-15 10:30:00'
        },
        {
            key: '5',
            id: 'prop_005',
            name: '计划成品',
            code: 'plan',
            count: 2,
            icon: 'ScheduleOutlined',
            color: '#13c2c2',
            sortOrder: 5,
            status: 'active',
            createTime: '2024-01-15 10:30:00'
        }
    ];

    // 图标映射
    iconMap: Record<string, React.ReactNode> = {
        'AppstoreOutlined': <AppstoreOutlined />,
        'DatabaseOutlined': <DatabaseOutlined />,
        'ToolOutlined': <ToolOutlined />,
        'DeleteOutlined': <WasteOutlined />,
        'ScheduleOutlined': <ScheduleOutlined />,
    };

    // 获取图标组件
    getIconComponent = (iconName: string) => {
        return this.iconMap[iconName] || <AppstoreOutlined />;
    };

    // 添加产品属性
    handleAdd = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '添加产品属性',
            editingRecord: null,
            formData: {
                name: '',
                code: '',
                count: '',
                icon: 'AppstoreOutlined',
                color: '#1890ff',
                sortOrder: this.propertyData.length + 1,
            }
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
                code: record.code,
                count: String(record.count),
                icon: record.icon,
                color: record.color,
                sortOrder: record.sortOrder,
            }
        });
    };

    // 删除产品属性
    handleDelete = async (record: ProductPropertyRecord) => {
        this.setState({ loading: true });
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        const newData = this.propertyData.filter(item => item.key !== record.key);
        // 更新数据源
        this.propertyData.length = 0;
        this.propertyData.push(...newData);

        message.success(`删除产品属性"${record.name}"成功`);
        this.setState({
            loading: false,
            selectedRowKeys: []
        });
    };

    // 批量删除
    handleBatchDelete = async () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            message.warning('请选择要删除的产品属性');
            return;
        }

        this.setState({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));

        const newData = this.propertyData.filter(item => !selectedRowKeys.includes(item.key));
        this.propertyData.length = 0;
        this.propertyData.push(...newData);

        message.success(`成功删除 ${selectedRowKeys.length} 个产品属性`);
        this.setState({
            loading: false,
            selectedRowKeys: []
        });
    };

    // 保存产品属性（添加/编辑）
    handleSave = async () => {
        const { formData, editingRecord } = this.state;

        // 表单验证
        if (!formData.name.trim()) {
            message.warning('请输入产品属性名称');
            return;
        }
        if (!formData.code.trim()) {
            message.warning('请输入属性编码');
            return;
        }

        this.setState({ loading: true });
        await new Promise(resolve => setTimeout(resolve, 500));

        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        if (editingRecord) {
            // 编辑：更新现有记录
            const index = this.propertyData.findIndex(item => item.key === editingRecord.key);
            if (index !== -1) {
                this.propertyData[index] = {
                    ...editingRecord,
                    name: formData.name,
                    code: formData.code,
                    count: isNaN(Number(formData.count)) ? formData.count : Number(formData.count),
                    icon: formData.icon,
                    color: formData.color,
                    sortOrder: formData.sortOrder,
                };
            }
            message.success('编辑产品属性成功');
        } else {
            // 添加：新增记录
            const newRecord: ProductPropertyRecord = {
                key: String(Date.now()),
                id: `prop_${Date.now()}`,
                name: formData.name,
                code: formData.code,
                count: isNaN(Number(formData.count)) ? formData.count : Number(formData.count),
                icon: formData.icon,
                color: formData.color,
                sortOrder: formData.sortOrder,
                status: 'active',
                createTime: timeStr,
            };
            this.propertyData.push(newRecord);
            message.success('添加产品属性成功');
        }

        // 按排序顺序重新排列
        this.propertyData.sort((a, b) => a.sortOrder - b.sortOrder);

        this.setState({
            loading: false,
            modalVisible: false,
            formData: {
                name: '',
                code: '',
                count: '',
                icon: 'AppstoreOutlined',
                color: '#1890ff',
                sortOrder: 1,
            }
        });
    };

    // 取消模态框
    handleCancel = () => {
        this.setState({
            modalVisible: false,
            editingRecord: null,
            formData: {
                name: '',
                code: '',
                count: '',
                icon: 'AppstoreOutlined',
                color: '#1890ff',
                sortOrder: 1,
            }
        });
    };

    // 表格列定义
    columns: ColumnsType<ProductPropertyRecord> = [
        {
            title: '属性名称',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (text, record) => (
                <Space>
                    <span style={{ color: record.color, fontSize: '18px' }}>
                        {this.getIconComponent(record.icon)}
                    </span>
                    <span style={{ fontWeight: 500 }}>{text}</span>
                </Space>
            )
        },
        {
            title: '属性编码',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: '数量/统计',
            dataIndex: 'count',
            key: 'count',
            width: 100,
            align: 'center',
            render: (count) => <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{count}</span>
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
            )
        },
        {
            title: '主题色',
            dataIndex: 'color',
            key: 'color',
            width: 100,
            render: (color) => (
                <Space>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: color,
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9'
                    }} />
                    <span>{color}</span>
                </Space>
            )
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
            width: 160,
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
            )
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
                            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
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
        const { searchText, loading, selectedRowKeys, currentPage, pageSize, modalVisible, modalTitle, formData } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        // 过滤数据
        let filteredData = [...this.propertyData];
        if (searchText) {
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.code.toLowerCase().includes(searchText.toLowerCase())
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

        // 图标选项
        const iconOptions = [
            { value: 'AppstoreOutlined', label: '成品图标', icon: <AppstoreOutlined /> },
            { value: 'DatabaseOutlined', label: '原料图标', icon: <DatabaseOutlined /> },
            { value: 'ToolOutlined', label: '备件图标', icon: <ToolOutlined /> },
            { value: 'DeleteOutlined', label: '废料图标', icon: <WasteOutlined /> },
            { value: 'ScheduleOutlined', label: '计划图标', icon: <ScheduleOutlined /> },
        ];

        // 颜色选项
        const colorOptions = [
            { value: '#1890ff', label: '蓝色', color: '#1890ff' },
            { value: '#fa8c16', label: '橙色', color: '#fa8c16' },
            { value: '#722ed1', label: '紫色', color: '#722ed1' },
            { value: '#f5222d', label: '红色', color: '#f5222d' },
            { value: '#13c2c2', label: '青色', color: '#13c2c2' },
            { value: '#52c41a', label: '绿色', color: '#52c41a' },
            { value: '#eb2f96', label: '粉色', color: '#eb2f96' },
        ];

        return (
            <div className="product-property-wrapper">
                {/* 标题栏 */}
                <div className="product-property-header">
                    <h2 className="product-property-title">产品属性列表</h2>
                    <div className="product-property-desc">
                        管理产品信息页面的统计卡片数据源
                    </div>
                </div>

                {/* 操作栏 */}
                <div className="product-property-actions">
                    <Space wrap size="middle">
                        <Button type="primary" icon={<PlusOutlined />} onClick={this.handleAdd}>
                            添加属性
                        </Button>
                        <Button danger icon={<DeleteOutlined />} onClick={this.handleBatchDelete}>
                            批量删除
                        </Button>
                    </Space>
                    <Space>
                        <Search
                            placeholder="搜索名称/编码"
                            allowClear
                            onSearch={this.handleSearch}
                            onChange={(e) => !e.target.value && this.handleSearch('')}
                            style={{ width: 260 }}
                            prefix={<SearchOutlined />}
                        />
                    </Space>
                </div>

                {/* 表格区域 */}
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
                            scroll={{ x: 1000 }}
                            size="middle"
                            bordered
                            rowKey="key"
                        />
                    </ConfigProvider>
                </div>

                {/* 添加/编辑模态框 */}
                <Modal
                    title={modalTitle}
                    open={modalVisible}
                    onOk={this.handleSave}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                    width={600}
                    confirmLoading={loading}
                >
                    <Form layout="vertical">
                        <Form.Item label="属性名称" required>
                            <Input
                                placeholder="请输入属性名称，如：成品（生产）"
                                value={formData.name}
                                onChange={(e) => this.setState({
                                    formData: { ...formData, name: e.target.value }
                                })}
                            />
                        </Form.Item>

                        <Form.Item label="属性编码" required>
                            <Input
                                placeholder="请输入属性编码，如：finished"
                                value={formData.code}
                                onChange={(e) => this.setState({
                                    formData: { ...formData, code: e.target.value }
                                })}
                            />
                        </Form.Item>

                        <Form.Item label="统计数量">
                            <Input
                                placeholder="请输入统计数量，如：17 或 99+"
                                value={formData.count}
                                onChange={(e) => this.setState({
                                    formData: { ...formData, count: e.target.value }
                                })}
                            />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item label="图标" style={{ flex: 1 }}>
                                <select
                                    className="ant-select-selector"
                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d9d9d9' }}
                                    value={formData.icon}
                                    onChange={(e) => this.setState({
                                        formData: { ...formData, icon: e.target.value }
                                    })}
                                >
                                    {iconOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </Form.Item>

                            <Form.Item label="主题色" style={{ flex: 1 }}>
                                <select
                                    className="ant-select-selector"
                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d9d9d9' }}
                                    value={formData.color}
                                    onChange={(e) => this.setState({
                                        formData: { ...formData, color: e.target.value }
                                    })}
                                >
                                    {colorOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </Form.Item>
                        </div>

                        <Form.Item label="排序序号">
                            <Input
                                type="number"
                                placeholder="数字越小越靠前"
                                value={formData.sortOrder}
                                onChange={(e) => this.setState({
                                    formData: { ...formData, sortOrder: parseInt(e.target.value) || 1 }
                                })}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export const ProductProperty = withTranslation()(_ProductProperty);