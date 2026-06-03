// src/page/basic.info/warehouse.info/frame.tsx
// 仓库管理框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
    Button,
    Input,
    Table,
    Space,
    Tooltip,
    message,
    Popconfirm,
    ConfigProvider,
    Switch,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
    PlusOutlined,
    ExportOutlined,
    DeleteOutlined,
    HistoryOutlined,
    SearchOutlined,
    EditOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import '../../../css/basic.info/warehouse/frame.css';
import { ErrResponse, WarehouseType, SucResponse } from '../../../config/type';
import { LOCAL_STORAGE } from '../../../config/keys';
import { httpUtil } from '../../../utils/HttpUtil';
import { WarehouseApi } from '../../../config/api';
import WarehouseModal, { WarehouseFormData, WarehouseRecord } from './warehouse.form.modal';

const { Search } = Input;

const CLS_NAME = `Warehouse`;

interface WarehouseProps {
    headerHeight: number;
    warehouseList: WarehouseType[];
    getWarehouseList: Function;
}

class _Warehouse extends React.Component<WithTranslation & WarehouseProps> {
    private tableContainerRef = React.createRef<HTMLDivElement>();

    state = {
        searchText: '',
        loading: false,
        selectedRowKeys: [] as React.Key[],
        currentPage: 1,
        pageSize: 20,
        tableScrollY: 400,
        // 弹框相关状态
        modalVisible: false,
        modalTitle: '添加仓库',
        modalLoading: false,
        editingRecord: null as WarehouseRecord | null,
        modalFormData: {
            warehouseName: '',
            warehouseCode: '',
            warehouseAddress: '',
            warehouseStatus: 1,
            warehouseSupervisor: '',
            supervisorDepartment: '',
            contactPhone: '',
            remark: '',
        } as WarehouseFormData,
    };

    // 仓库数据（静态数据，实际应从 props 或 API 获取）
    warehouseData: WarehouseRecord[] = [];

    componentDidMount() {
        this.updateTableScrollY();
        window.addEventListener('resize', this.updateTableScrollY);
        const observer = new ResizeObserver(() => {
            this.updateTableScrollY();
        });
        if (this.tableContainerRef.current) {
            observer.observe(this.tableContainerRef.current);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateTableScrollY);
    }

    /** 更新表格滚动高度 */
    updateTableScrollY = () => {
        if (this.tableContainerRef.current) {
            const containerHeight = this.tableContainerRef.current.clientHeight;
            const paginationHeight = 72;
            const headerHeight = 46;
            const scrollY = Math.max(200, containerHeight - paginationHeight - headerHeight);
            this.setState({ tableScrollY: scrollY });
        }
    };

    /** 打开添加仓库弹框 */
    handleAdd = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '添加仓库',
            editingRecord: null,
            modalFormData: {
                warehouseName: '',
                warehouseCode: '',
                warehouseAddress: '',
                warehouseStatus: 1,
                warehouseSupervisor: '',
                supervisorDepartment: '',
                contactPhone: '',
                remark: '',
            }
        });
    };

    /** 打开编辑仓库弹框 */
    handleEdit = (record: WarehouseRecord) => {
        this.setState({
            modalVisible: true,
            modalTitle: '编辑仓库',
            editingRecord: record,
            modalFormData: {
                warehouseName: record.warehouseName,
                warehouseCode: record.warehouseCode,
                warehouseAddress: record.warehouseAddress,
                warehouseStatus: record.warehouseStatus,
                warehouseSupervisor: record.warehouseSupervisor,
                supervisorDepartment: record.supervisorDepartment,
                contactPhone: record.contactPhone,
                remark: record.remark || '',
            }
        });
    };

    /** 删除仓库 */
    handleDelete = async (record: WarehouseRecord) => {
        const DEBUG_ON = true;
        const TAG = `${CLS_NAME}.handleDelete() - `;
        this.setState({ loading: true });
        try {
            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                id: parseInt(record.id, 10)
            };
            const response = await httpUtil.post(WarehouseApi.DEL, params);
            DEBUG_ON && console.log(TAG, `response:\n`, response);
            if (response?.code === 200) {
                const sucResponse = response as SucResponse;
                message.success(sucResponse.message || '删除成功');
                await this.fetchWarehouseList();
            } else {
                const errResponse = response as ErrResponse;
                message.error(errResponse?.errMsg || '删除失败');
            }
        } catch (error) {
            console.error('删除仓库API调用失败:', error);
            message.error('网络请求失败');
        }
        this.setState({ loading: false, selectedRowKeys: [] });
    };

    /** 批量删除 - 调用服务器接口 */
    confirmBatchDelete = async () => {
        const { selectedRowKeys } = this.state;
        const DEBUG_ON = true;
        const TAG = `${CLS_NAME}.confirmBatchDelete() - `;

        this.setState({ loading: true });

        try {
            // 获取选中记录的ID列表
            const ids = this.getCurrentDataSource()
                .filter(item => selectedRowKeys.includes(item.key))
                .map(item => parseInt(item.id, 10));

            DEBUG_ON && console.log(TAG, `准备删除的IDs:`, ids);

            if (ids.length === 0) {
                message.warning('未找到要删除的仓库ID');
                this.setState({ loading: false });
                return;
            }

            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                ids: ids
            };

            const response = await httpUtil.post(WarehouseApi.BATCH_DEL, params);

            DEBUG_ON && console.log(TAG, `response:`, response);

            if (response?.code === 200) {
                const sucResponse = response as SucResponse;
                message.success(sucResponse.message || `成功删除 ${selectedRowKeys.length} 个仓库`);
                // 清空选中状态
                this.setState({ selectedRowKeys: [] });
                // 刷新列表
                await this.fetchWarehouseList();
            } else {
                const errResponse = response as ErrResponse;
                message.error(errResponse?.errMsg || '批量删除失败');
            }
        } catch (error) {
            console.error('批量删除仓库API调用失败:', error);
            message.error('网络请求失败，请稍后重试');
        } finally {
            this.setState({ loading: false });
        }
    };

    /** 导出数据 */
    handleExport = () => {
        message.info('导出数据功能开发中');
    };

    /** 操作记录 */
    handleOperationRecord = () => {
        message.info('查看操作记录');
    };

    /** 状态切换 */
    handleStatusChange = async (checked: boolean, record: WarehouseRecord) => {
        this.setState({ loading: true });
        try {
            const params = {
                token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                id: parseInt(record.id, 10),
                status: checked ? 1 : 0
            };
            const response = await httpUtil.post(WarehouseApi.UPDATE_STATUS, params);
            if (response?.code === 200) {
                const sucResponse = response as SucResponse;
                message.success(sucResponse.message || `已${checked ? '启用' : '停用'}`);
                await this.fetchWarehouseList();
            } else {
                const errResponse = response as ErrResponse;
                message.error(errResponse?.errMsg || '状态更新失败');
            }
        } catch (error) {
            console.error('更新仓库状态失败:', error);
            message.error('网络请求失败');
        }
        this.setState({ loading: false });
    };

    /** 保存仓库（添加/编辑） */
    handleSave = async () => {
        const { modalFormData, editingRecord } = this.state;

        // 表单验证
        if (!modalFormData.warehouseName?.trim()) {
            message.warning('请输入仓库名称');
            return;
        }
        if (!modalFormData.warehouseAddress?.trim()) {
            message.warning('请输入仓库地址');
            return;
        }
        if (!modalFormData.warehouseSupervisor?.trim()) {
            message.warning('请选择仓库主管');
            return;
        }
        if (!modalFormData.supervisorDepartment?.trim()) {
            message.warning('请选择库管归属部门');
            return;
        }
        if (!modalFormData.contactPhone?.trim()) {
            message.warning('请输入联系电话');
            return;
        }

        this.setState({ modalLoading: true });

        try {
            let response;
            if (editingRecord) {
                // 编辑
                const params = {
                    token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                    id: parseInt(editingRecord.id, 10),
                    name: modalFormData.warehouseName,
                    address: modalFormData.warehouseAddress,
                    status: modalFormData.warehouseStatus,
                    supervisor: modalFormData.warehouseSupervisor,
                    department: modalFormData.supervisorDepartment,
                    phone: modalFormData.contactPhone,
                    remark: modalFormData.remark,
                };
                response = await httpUtil.post(WarehouseApi.EDIT, params);
            } else {
                // 添加
                const params = {
                    token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
                    name: modalFormData.warehouseName,
                    address: modalFormData.warehouseAddress,
                    supervisor: modalFormData.warehouseSupervisor,
                    department: modalFormData.supervisorDepartment,
                    phone: modalFormData.contactPhone,
                    remark: modalFormData.remark,
                };
                response = await httpUtil.post(WarehouseApi.ADD, params);
            }

            if (response?.code === 200) {
                const sucResponse = response as SucResponse;
                message.success(sucResponse.message || (editingRecord ? '编辑成功' : '添加成功'));
                this.setState({
                    modalVisible: false,
                    modalLoading: false,
                    editingRecord: null,
                    modalFormData: {
                        warehouseName: '',
                        warehouseCode: '',
                        warehouseAddress: '',
                        warehouseStatus: 1,
                        warehouseSupervisor: '',
                        supervisorDepartment: '',
                        contactPhone: '',
                        remark: '',
                    }
                });
                await this.fetchWarehouseList();
            } else {
                const errResponse = response as ErrResponse;
                message.error(errResponse?.errMsg || '操作失败');
                this.setState({ modalLoading: false });
            }
        } catch (error) {
            console.error('保存仓库失败:', error);
            message.error('网络请求失败');
            this.setState({ modalLoading: false });
        }
    };

    /** 取消弹框 */
    handleCancel = () => {
        this.setState({
            modalVisible: false,
            editingRecord: null,
        });
    };

    /** 更新弹框表单数据 */
    handleFormDataChange = (newFormData: WarehouseFormData) => {
        this.setState({ modalFormData: newFormData });
    };

    /** 获取仓库列表 */
    fetchWarehouseList = async () => {
        const { getWarehouseList } = this.props;
        if (getWarehouseList) {
            await getWarehouseList();
        }
    };

    /** 获取当前数据源 */
    getCurrentDataSource = (): WarehouseRecord[] => {
        const { warehouseList } = this.props;
        if (warehouseList && warehouseList.length > 0) {
            return warehouseList.map((item, index) => ({
                key: `${item.id || index + 1}`,
                id: `${item.id}`,
                warehouseName: item.name,
                warehouseCode: item.code,
                warehouseAddress: item.address,
                warehouseStatus: item.status,
                statusText: item.status === 1 ? '启用' : '停用',
                subWarehouse: '关联子表',
                warehouseSupervisor: item.supervisor,
                supervisorDepartment: item.department,
                contactPhone: item.phone,
                submitter: item.submitter || '',
                submitTime: item.createTime || '',
                remark: item.remark || '',
            }));
        }
        return [...this.warehouseData];
    };

    /** 表格列定义 */
    columns: ColumnsType<WarehouseRecord> = [
        {
            title: '仓库名称',
            dataIndex: 'warehouseName',
            key: 'warehouseName',
            width: 120,
            fixed: 'left',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
        },
        {
            title: '仓库编码',
            dataIndex: 'warehouseCode',
            key: 'warehouseCode',
            width: 100,
        },
        {
            title: '仓库地址',
            dataIndex: 'warehouseAddress',
            key: 'warehouseAddress',
            width: 280,
            ellipsis: true,
        },
        {
            title: '仓库容量/立方',
            dataIndex: 'warehouseCapacity',
            key: 'warehouseCapacity',
            width: 120,
            align: 'center',
            render: (text) => text ? `${text} m³` : '-',
        },
        {
            title: '仓库状态',
            dataIndex: 'warehouseStatus',
            key: 'warehouseStatus',
            width: 100,
            render: (status, record) => (
                <Switch
                    checked={status === 1}
                    checkedChildren="启用"
                    unCheckedChildren="停用"
                    onChange={(checked) => this.handleStatusChange(checked, record)}
                />
            ),
        },
        {
            title: '仓库主管',
            dataIndex: 'warehouseSupervisor',
            key: 'warehouseSupervisor',
            width: 100,
        },
        {
            title: '库管归属部门',
            dataIndex: 'supervisorDepartment',
            key: 'supervisorDepartment',
            width: 120,
        },
        {
            title: '联系电话',
            dataIndex: 'contactPhone',
            key: 'contactPhone',
            width: 120,
        },
        {
            title: '提交人',
            dataIndex: 'submitter',
            key: 'submitter',
            width: 100,
        },
        {
            title: '提交时间',
            dataIndex: 'submitTime',
            key: 'submitTime',
            width: 160,
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
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
                    <Tooltip title="查看">
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="确认删除"
                        description={`确定要删除仓库"${record.warehouseName}"吗？`}
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

    /** 行选择变化 */
    onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys: newSelectedRowKeys });
    };

    /** 搜索 */
    handleSearch = (value: string) => {
        this.setState({
            searchText: value,
            currentPage: 1,
        });
    };

    render() {
        const {
            searchText,
            loading,
            selectedRowKeys,
            currentPage,
            pageSize,
            tableScrollY,
            modalVisible,
            modalTitle,
            modalLoading,
            modalFormData,
            editingRecord
        } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        // 获取数据源
        const sourceData = this.getCurrentDataSource();

        // 过滤数据
        let filteredData = [...sourceData];
        if (searchText) {
            filteredData = filteredData.filter(
                (item) =>
                    item.warehouseName.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.warehouseCode.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // 分页数据
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = filteredData.slice(start, end);

        // 分页配置
        const paginationConfig: TablePaginationConfig = {
            current: currentPage,
            pageSize: pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => {
                this.setState({
                    currentPage: page,
                    pageSize: size || 20,
                });
                setTimeout(() => this.updateTableScrollY(), 0);
            },
            onShowSizeChange: (current, size) => {
                this.setState({
                    currentPage: 1,
                    pageSize: size,
                });
                setTimeout(() => this.updateTableScrollY(), 0);
            },
        };

        return (
            <div className="warehouse-wrapper">
                {/* 标题栏 */}
                <div className="warehouse-header">
                    <div>
                        <h2 className="warehouse-title">管理全部仓库信息</h2>
                        <div className="warehouse-desc">管理全部仓库信息</div>
                    </div>
                </div>

                {/* 操作栏 */}
                <div className="warehouse-actions">
                    <Space wrap size="middle">
                        <Button type="primary" icon={<PlusOutlined />} onClick={this.handleAdd}>
                            添加
                        </Button>
                        <Button icon={<ExportOutlined />} onClick={this.handleExport}>
                            导出
                        </Button>
                        <Button icon={<HistoryOutlined />} onClick={this.handleOperationRecord}>
                            操作记录
                        </Button>
                        <Popconfirm
                            title="确认批量删除"
                            description={`确定要删除选中的 ${selectedRowKeys.length} 个仓库吗？`}
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
                            placeholder="搜索仓库名称/编码"
                            allowClear
                            onSearch={this.handleSearch}
                            onChange={(e) => !e.target.value && this.handleSearch('')}
                            style={{ width: 260 }}
                            prefix={<SearchOutlined />}
                        />
                        <Button>筛选</Button>
                    </Space>
                </div>

                {/* 表格区域 */}
                <div className="warehouse-table-container" ref={this.tableContainerRef}>
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
                            scroll={{ x: 1400, y: tableScrollY }}
                            size="middle"
                            bordered
                            rowKey="key"
                        />
                    </ConfigProvider>
                </div>

                {/* 添加/编辑仓库弹框 */}
                <WarehouseModal
                    visible={modalVisible}
                    title={modalTitle}
                    formData={modalFormData}
                    editingRecord={editingRecord}
                    loading={modalLoading}
                    onOk={this.handleSave}
                    onCancel={this.handleCancel}
                    onFormDataChange={this.handleFormDataChange}
                />
            </div>
        );
    }
}

export const Warehouse = withTranslation()(_Warehouse);