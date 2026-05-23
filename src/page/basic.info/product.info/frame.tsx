// src/page/basic.info/product.info/frame.tsx

// 产品信息框架

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
    ConfigProvider
} from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import {
    PlusOutlined,
    ImportOutlined,
    ExportOutlined,
    DeleteOutlined,
    HistoryOutlined,
    SearchOutlined,
    FilterOutlined,
    EditOutlined,
    EyeOutlined,
    AppstoreOutlined,
    DatabaseOutlined,
    ToolOutlined,
    ScheduleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import '../../../css/basic.info/product.info/frame.css';
import { ProductPropertyType } from '../../../config/type';
import { iconMap } from '../product.property/property.form.modal';

const { Search } = Input;

interface ProductInfoProps {
    headerHeight: number;
    productPropertyList: ProductPropertyType[]
}

interface ProductRecord {
    key: string;
    productCode: string;
    productSpec: string;
    unit: string;
    category: string;
    type: string;
    quantity?: number;
}

interface CategoryStat {
    key: string;
    title: string;
    count: number | string;
    icon: string;
    color: string;
    tabKey: string;
}

class _ProductInfo extends React.Component<WithTranslation & ProductInfoProps> {
    private tableContainerRef = React.createRef<HTMLDivElement>();

    state = {
        activeTab: 'raw',
        searchText: '',
        loading: false,
        selectedRowKeys: [] as React.Key[],
        currentPage: 1,
        pageSize: 10,
        tableScrollY: 400,
    };

    // 成品数据
    finishedProducts: ProductRecord[] = [
        { key: '1', productCode: 'XC.3-M3360304T0', productSpec: '电机', unit: '个', category: '成品', type: '生产' },
        { key: '2', productCode: 'M2360332B', productSpec: '绞', unit: 'T', category: '成品', type: '生产' },
        { key: '3', productCode: 'CP0211', productSpec: 'DJ-01', unit: '个', category: '成品', type: '生产' },
        { key: '4', productCode: 'CP0209', productSpec: 'C', unit: 'T', category: '成品', type: '生产' },
        { key: '5', productCode: 'XC.3-M1160304T0', productSpec: '轴承', unit: '个', category: '成品', type: '生产' },
        { key: '6', productCode: 'M2260332B', productSpec: '废丝（有捻）', unit: 'T', category: '成品', type: '生产' },
        { key: '7', productCode: 'CP0038', productSpec: 'ZC-01', unit: '个', category: '成品', type: '生产' },
        { key: '8', productCode: 'CP0032', productSpec: '简', unit: 'T', category: '成品', type: '生产' },
        { key: '9', productCode: 'CP0174', productSpec: '总类', unit: 'T', category: '成品', type: '生产' },
        { key: '10', productCode: 'CP0210', productSpec: 'XC.3-M1160132T0', unit: '个', category: '成品', type: '生产' },
        { key: '11', productCode: 'CP0208', productSpec: 'M1160432B', unit: 'T', category: '成品', type: '生产' },
        { key: '12', productCode: 'CP0037', productSpec: '皮带', unit: '个', category: '成品', type: '生产' },
        { key: '13', productCode: 'CP0031', productSpec: 'PD-01', unit: 'T', category: '成品', type: '生产' },
        { key: '14', productCode: 'CP0191', productSpec: 'XC.3-M3360105T0', unit: '个', category: '成品', type: '生产' },
        { key: '15', productCode: 'CP0207', productSpec: 'M1160332B', unit: 'T', category: '成品', type: '生产' },
        { key: '16', productCode: 'CP0036', productSpec: '废丝', unit: 'T', category: '成品', type: '生产' },
        { key: '17', productCode: 'CP0021', productSpec: 'C', unit: '个', category: '成品', type: '生产' },
    ];

    // 原料数据
    rawProducts: ProductRecord[] = [
        { key: 'r1', productCode: 'YL-001', productSpec: '原料规格1', unit: 'T', category: '原料', type: '采购' },
        { key: 'r2', productCode: 'YL-002', productSpec: '原料规格2', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r3', productCode: 'YL-003', productSpec: '原料规格3', unit: 'T', category: '原料', type: '采购' },
        { key: 'r4', productCode: 'YL-004', productSpec: '原料规格4', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r5', productCode: 'YL-005', productSpec: '原料规格5', unit: 'T', category: '原料', type: '采购' },
        { key: 'r6', productCode: 'YL-006', productSpec: '原料规格6', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r7', productCode: 'YL-007', productSpec: '原料规格7', unit: 'T', category: '原料', type: '采购' },
        { key: 'r8', productCode: 'YL-008', productSpec: '原料规格8', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r9', productCode: 'YL-009', productSpec: '原料规格9', unit: 'T', category: '原料', type: '采购' },
        { key: 'r10', productCode: 'YL-010', productSpec: '原料规格10', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r11', productCode: 'YL-011', productSpec: '原料规格11', unit: 'T', category: '原料', type: '采购' },
        { key: 'r12', productCode: 'YL-012', productSpec: '原料规格12', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r13', productCode: 'YL-013', productSpec: '原料规格13', unit: 'T', category: '原料', type: '采购' },
        { key: 'r14', productCode: 'YL-014', productSpec: '原料规格14', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r15', productCode: 'YL-015', productSpec: '原料规格15', unit: 'T', category: '原料', type: '采购' },
        { key: 'r16', productCode: 'YL-016', productSpec: '原料规格16', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r17', productCode: 'YL-017', productSpec: '原料规格17', unit: 'T', category: '原料', type: '采购' },
        { key: 'r18', productCode: 'YL-018', productSpec: '原料规格18', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r19', productCode: 'YL-019', productSpec: '原料规格19', unit: 'T', category: '原料', type: '采购' },
        { key: 'r20', productCode: 'YL-020', productSpec: '原料规格20', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r21', productCode: 'YL-021', productSpec: '原料规格21', unit: 'T', category: '原料', type: '采购' },
        { key: 'r22', productCode: 'YL-022', productSpec: '原料规格22', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r23', productCode: 'YL-023', productSpec: '原料规格23', unit: 'T', category: '原料', type: '采购' },
        { key: 'r24', productCode: 'YL-024', productSpec: '原料规格24', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r25', productCode: 'YL-025', productSpec: '原料规格25', unit: 'T', category: '原料', type: '采购' },
        { key: 'r26', productCode: 'YL-026', productSpec: '原料规格26', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r27', productCode: 'YL-027', productSpec: '原料规格27', unit: 'T', category: '原料', type: '采购' },
        { key: 'r28', productCode: 'YL-028', productSpec: '原料规格28', unit: 'kg', category: '原料', type: '采购' },
        { key: 'r29', productCode: 'YL-029', productSpec: '原料规格29', unit: 'T', category: '原料', type: '采购' },
        { key: 'r30', productCode: 'YL-030', productSpec: '原料规格30', unit: 'kg', category: '原料', type: '采购' },
    ];

    // 备件数据
    spareProducts: ProductRecord[] = [
        { key: 's1', productCode: 'BJ-001', productSpec: '轴承SKF6204', unit: '个', category: '备件', type: '备件' },
        { key: 's2', productCode: 'BJ-002', productSpec: '三角带B-1800', unit: '条', category: '备件', type: '备件' },
        { key: 's3', productCode: 'BJ-003', productSpec: '电磁阀4V210', unit: '个', category: '备件', type: '备件' },
        { key: 's4', productCode: 'BJ-004', productSpec: '气缸SC50', unit: '个', category: '备件', type: '备件' },
        { key: 's5', productCode: 'BJ-005', productSpec: 'PLC模块', unit: '块', category: '备件', type: '备件' },
    ];

    // 废料数据
    wasteProducts: ProductRecord[] = [
        { key: 'w1', productCode: 'FL-001', productSpec: '废丝（无捻）', unit: 'T', category: '废料', type: '废料' },
        { key: 'w2', productCode: 'FL-002', productSpec: '废丝（有捻）', unit: 'T', category: '废料', type: '废料' },
        { key: 'w3', productCode: 'FL-003', productSpec: '废料边角料', unit: 'T', category: '废料', type: '废料' },
    ];

    // 计划成品数据
    planProducts: ProductRecord[] = [
        { key: 'p1', productCode: 'JH-001', productSpec: '电机生产计划', unit: '个', category: '计划成品', type: '计划' },
        { key: 'p2', productCode: 'JH-002', productSpec: '轴承生产计划', unit: '个', category: '计划成品', type: '计划' },
    ];

    // 分类统计数据
    categoryStats: CategoryStat[] = [
        { key: 'finished', title: '成品（生产）', count: 17, icon: 'AppstoreOutlined', color: '#1890ff', tabKey: 'finished' },
        { key: 'raw', title: '原料', count: 99, icon: 'DatabaseOutlined', color: '#fa8c16', tabKey: 'raw' },
        { key: 'spare', title: '备件', count: 5, icon: 'ToolOutlined', color: '#722ed1', tabKey: 'spare' },
        { key: 'waste', title: '废料', count: 3, icon: 'WasteOutlined', color: '#f5222d', tabKey: 'waste' },
        { key: 'plan', title: '计划成品', count: 2, icon: 'ScheduleOutlined', color: '#13c2c2', tabKey: 'plan' },
    ];

    componentDidMount() {
        this.updateTableScrollY();
        window.addEventListener('resize', this.updateTableScrollY);
        // 使用 MutationObserver 监听容器变化
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

    // 获取图标组件
    getIconComponent = (iconName: string) => {
        return iconMap[iconName] || <AppstoreOutlined />;
    };

    updateTableScrollY = () => {
        if (this.tableContainerRef.current) {
            // 获取表格容器的高度
            const containerHeight = this.tableContainerRef.current.clientHeight;
            // 减去分页栏的大约高度（约72px）
            const paginationHeight = 72;
            // 减去表头的大约高度（约46px）
            const headerHeight = 46;
            const scrollY = Math.max(200, containerHeight - paginationHeight - headerHeight);
            this.setState({ tableScrollY: scrollY });
        }
    };

    getCurrentData = () => {
        const { activeTab } = this.state;
        switch (activeTab) {
            case '1': return this.finishedProducts;
            case '2': return this.rawProducts;
            case '3': return this.spareProducts;
            case '4': return this.wasteProducts;
            case '5': return this.planProducts;
            default: return this.finishedProducts;
        }
    };

    handleAddProduct = () => {
        message.success(this.props.t('添加产品'));
    };

    handleImport = () => {
        message.info(this.props.t('导入数据'));
    };

    handleExport = () => {
        message.info(this.props.t('导出数据'));
    };

    handleDelete = () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            message.warning(this.props.t('请选择要删除的数据'));
            return;
        }
        message.success(this.props.t(`删除 ${selectedRowKeys.length} 条数据`));
        this.setState({ selectedRowKeys: [] });
    };

    handleOperationRecord = () => {
        message.info(this.props.t('查看操作记录'));
    };

    columns: ColumnsType<ProductRecord> = [
        {
            title: '产品编码',
            dataIndex: 'productCode',
            key: 'productCode',
            width: 150,
            fixed: 'left',
            render: (text) => <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{text}</span>
        },
        {
            title: '品种规格',
            dataIndex: 'productSpec',
            key: 'productSpec',
            width: 150,
            ellipsis: true,
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width: 80,
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: '产品类别',
            dataIndex: 'category',
            key: 'category',
            width: 100,
            render: (text) => {
                let color = 'default';
                if (text === '成品') color = 'green';
                if (text === '原料') color = 'orange';
                if (text === '备件') color = 'purple';
                if (text === '废料') color = 'red';
                if (text === '计划成品') color = 'cyan';
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="编辑">
                        <Button type="text" size="small" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="查看">
                        <Button type="text" size="small" icon={<EyeOutlined />} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        this.setState({ selectedRowKeys: newSelectedRowKeys });
    };

    handleTabChange = (tabKey: string) => {
        this.setState({
            activeTab: tabKey,
            currentPage: 1,
            pageSize: 10,
            selectedRowKeys: [],
            searchText: '',
        });
    };

    handleSearch = (value: string) => {
        this.setState({
            searchText: value,
            currentPage: 1,
        });
    };

    render() {
        const { searchText, loading, selectedRowKeys, currentPage, pageSize, tableScrollY } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const data = this.getCurrentData();

        // 过滤数据
        const filteredData = searchText ? data.filter(item =>
            item.productCode.toLowerCase().includes(searchText.toLowerCase()) ||
            item.productSpec.toLowerCase().includes(searchText.toLowerCase())
        ) : data;

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
                    pageSize: size || 10,
                });
                // 分页变化后重新计算滚动高度
                setTimeout(() => this.updateTableScrollY(), 0);
            },
            onShowSizeChange: (current, size) => {
                this.setState({
                    currentPage: 1,
                    pageSize: size,
                });
                // 每页条数变化后重新计算滚动高度
                setTimeout(() => this.updateTableScrollY(), 0);
            },
        };

        return (
            <div className="product-info-wrapper">
                {/* 标题栏 */}
                <div className="product-info-header">
                    <h2 className="product-info-title">全部产品信息</h2>
                    <div className="product-info-user">
                        <span>赵</span>
                    </div>
                </div>

                {/* 操作栏 */}
                <div className="product-info-actions">
                    <Space wrap size="middle">
                        <Button type="primary" icon={<PlusOutlined />} onClick={this.handleAddProduct}>
                            添加
                        </Button>
                        <Button icon={<ImportOutlined />} onClick={this.handleImport}>
                            导入
                        </Button>
                        <Button icon={<ExportOutlined />} onClick={this.handleImport}>
                            导出
                        </Button>
                        <Button icon={<DeleteOutlined />} onClick={this.handleDelete} danger>
                            删除
                        </Button>
                        <Button icon={<HistoryOutlined />} onClick={this.handleOperationRecord}>
                            操作记录
                        </Button>
                    </Space>
                    <Space>
                        <Search
                            placeholder="搜索编码/规格"
                            allowClear
                            onSearch={this.handleSearch}
                            onChange={(e) => !e.target.value && this.handleSearch('')}
                            style={{ width: 260 }}
                            prefix={<SearchOutlined />}
                        />
                        <Button icon={<FilterOutlined />}>筛选</Button>
                    </Space>
                </div>

                {/* 统计卡片 */}
                {this.renderProductInfoStats()}

                {/* 表格区域 */}
                <div className="product-info-table-container" ref={this.tableContainerRef}>
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
                            dataSource={filteredData}
                            loading={loading}
                            pagination={paginationConfig}
                            scroll={{ x: 600, y: tableScrollY }}
                            // scroll={{ x: 600 }}
                            size="middle"
                            bordered
                            rowKey="key"
                            rowClassName={(record) => selectedRowKeys.includes(record.key) ? 'selected-row' : ''}
                        />
                    </ConfigProvider>
                </div>
            </div>
        );
    }

    renderProductInfoStats() {
        const { activeTab } = this.state;
        const { productPropertyList } = this.props;
        this.categoryStats = [];
        for (let i = 0; i < productPropertyList.length; i++) {
            const e = productPropertyList[i];
            this.categoryStats.push({
                key: `${i + 1}`,
                title: e.name,
                count: 0,
                icon: e.icon,
                color: e.color,
                tabKey: `${i + 1}`
            })
        }
        return (
            <div className="product-info-stats">
                {this.categoryStats.map(stat => (
                    <Card
                        key={stat.key}
                        className={`stat-card ${activeTab === stat.tabKey ? 'active' : ''}`}
                        onClick={() => this.handleTabChange(stat.tabKey)}
                        hoverable
                        size="small"
                    >
                        <div className="stat-icon" style={{ color: stat.color }}>
                            {this.getIconComponent(stat.icon)}
                        </div>
                        <div className="stat-content">
                            <div className="stat-title">{stat.title}</div>
                            <div className="stat-number">{stat.count}</div>
                        </div>
                    </Card>
                ))}
            </div>
        )
    }
}

export const ProductInfo = withTranslation()(_ProductInfo);