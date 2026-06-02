// src/page/basic.info/product/product.info.modal.tsx
// 产品信息弹框组件（添加/编辑产品）

import React from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Upload,
    Button,
    Card,
    Divider,
    Row,
    Col,
    Tabs,
    Collapse
} from 'antd';
import { PlusOutlined, UploadOutlined, MinusCircleOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { withTranslation, WithTranslation } from 'react-i18next';
import '../../../css/common/modal.css';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// 表单数据类型
export interface ProductInfoFormData {
    // 基础信息
    productCode?: string;          // 产品编码（自动生成）
    productName: string;           // 产品名称（批号）
    specModel: string;             // 规格型号（较长/简重）
    unitWeight: number;            // 单重(kg)
    varietySpec: string;           // 品种规格
    productCategory: string;       // 产品类别
    productClassification: string; // 产品归类
    unit: string;                  // 单位
    productAttribute: string;      // 产品属性
    productImages?: string[];      // 产品图片
    defaultWarehouse: string;      // 默认仓库
    supplier: string;              // 供应商
    productIntro?: string;         // 产品简介

    // 价格信息
    purchasePrice?: number;        // 参考采购单价(含税)/元
    salePrice?: number;            // 参考销售单价(含税)/元

    // 库存信息
    safetyStockLower?: number;     // 安全库存下限
    safetyStockUpper?: number;     // 安全库存上限

    // 工序信息
    processTemplateName?: string;  // 工序模板名称

    // 生产环节
    productionSteps?: ProductionStep[]; // 生产环节列表

    // 企业信息
    enterpriseId?: string;         // 选择企业
    enterpriseName?: string;       // 企业名称
    address?: string;              // 地址
    enterpriseIntro?: string;      // 企业简介
    enterpriseImages?: string[];   // 企业环境图片

    // 质量管理信息
    qmTraceRecords?: string;       // 溯源记录信息
    qmInspectionRecords?: string;  // 质检记录信息
    boundTraceCodeCount?: number;  // 被绑定溯源码个数
    stockInspectionReport?: string; // 选择库存质检报告
    stockInspectionNo?: string;    // 库存质检单编号
    inspectionDate?: string;       // 报检日期
}

// 生产环节步骤
export interface ProductionStep {
    key: number;
    processCode: string;    // 工序编码
    title: string;          // 标题
    content: string;        // 内容
    images: string[];       // 图片
}

interface ProductInfoModalProps {
    visible: boolean;
    title: string;
    formData: ProductInfoFormData;
    loading?: boolean;
    onOk: () => void;
    onCancel: () => void;
    onFormDataChange: (newFormData: ProductInfoFormData) => void;
}

// 产品属性选项
const productAttributeOptions = [
    { value: 'finished', label: '成品（生产）' },
    { value: 'raw', label: '原料' },
    { value: 'spare', label: '备件' },
    { value: 'waste', label: '废料' },
    { value: 'planned', label: '计划成品' },
    { value: 'other', label: '其他' },
];

// 产品类别选项（示例，实际应从数据源获取）
const productCategoryOptions = [
    { value: 'electronic', label: '电子产品' },
    { value: 'mechanical', label: '机械设备' },
    { value: 'chemical', label: '化工产品' },
    { value: 'food', label: '食品' },
    { value: 'other', label: '其他' },
];

class _ProductInfoModal extends React.Component<WithTranslation & ProductInfoModalProps> {
    state = {
        isFullscreen: false,  // 全屏状态
    };

    // 切换全屏模式
    toggleFullscreen = () => {
        this.setState({ isFullscreen: !this.state.isFullscreen });
    };

    // 更新表单数据
    updateFormData = (key: keyof ProductInfoFormData, value: any) => {
        const { formData, onFormDataChange } = this.props;
        onFormDataChange({ ...formData, [key]: value });
    };

    // 更新生产环节
    updateProductionSteps = (steps: ProductionStep[]) => {
        this.updateFormData('productionSteps', steps);
    };

    // 添加生产环节步骤
    addProductionStep = () => {
        const { formData } = this.props;
        const currentSteps = formData.productionSteps || [];
        const newStep: ProductionStep = {
            key: Date.now(),
            processCode: '',
            title: '',
            content: '',
            images: [],
        };
        this.updateProductionSteps([...currentSteps, newStep]);
    };

    // 删除生产环节步骤
    removeProductionStep = (key: number) => {
        const { formData } = this.props;
        const currentSteps = formData.productionSteps || [];
        this.updateProductionSteps(currentSteps.filter(step => step.key !== key));
    };

    // 更新单个生产环节步骤
    updateProductionStep = (key: number, field: keyof ProductionStep, value: any) => {
        const { formData } = this.props;
        const currentSteps = formData.productionSteps || [];
        const updatedSteps = currentSteps.map(step =>
            step.key === key ? { ...step, [field]: value } : step
        );
        this.updateProductionSteps(updatedSteps);
    };

    // 上传按钮的通用配置
    getUploadProps = (onChange: (urls: string[]) => void, currentUrls: string[] = []) => ({
        listType: 'picture-card' as const,
        showUploadList: true,
        beforeUpload: (file: File) => {
            const isLt20M = file.size / 1024 / 1024 < 20;
            if (!isLt20M) {
                console.error('图片大小不能超过20MB');
                return false;
            }
            // 这里应该调用实际的上传接口，此处模拟
            const reader = new FileReader();
            reader.onload = (e) => {
                const newUrls = [...currentUrls, e.target?.result as string];
                onChange(newUrls);
            };
            reader.readAsDataURL(file);
            return false;
        },
        onRemove: (file: any) => {
            // 移除图片逻辑
            const newUrls = currentUrls.filter(url => url !== file.url);
            onChange(newUrls);
        },
    });

    render() {
        const { isFullscreen } = this.state;

        const {
            visible,
            title,
            formData,
            loading = false,
            onOk,
            onCancel,
            t
        } = this.props;

        // 从表单数据中解构所有字段
        const {
            // ----- 产品基础信息 -----
            productCode,              // 产品编码（自动生成）
            productName,              // 产品名称（批号）
            specModel,                // 规格型号（较长/简重）
            unitWeight,               // 单重(kg)
            varietySpec,              // 品种规格
            productCategory,          // 产品类别
            productClassification,    // 产品归类
            unit,                     // 单位
            productAttribute,         // 产品属性（成品/原料/备件/废料/计划成品/其他）
            productImages = [],       // 产品图片
            defaultWarehouse,         // 默认仓库
            supplier,                 // 供应商
            productIntro,             // 产品简介

            // ----- 价格信息 -----
            purchasePrice,            // 采购单价（含税）
            salePrice,                // 销售单价（含税）

            // ----- 库存信息 -----
            safetyStockLower,         // 安全库存下限
            safetyStockUpper,         // 安全库存上限

            // ----- 工序信息 -----
            processTemplateName,      // 工序模板名称

            // ----- 生产环节 -----
            productionSteps = [],     // 生产环节步骤列表

            // ----- 企业信息 -----
            enterpriseId,             // 企业ID
            enterpriseName,           // 企业名称
            address,                  // 企业地址
            enterpriseIntro,          // 企业简介
            enterpriseImages = [],    // 企业环境图片

            // ----- 质量管理 -----
            qmTraceRecords,           // 溯源记录
            qmInspectionRecords,      // 质检记录
            boundTraceCodeCount,      // 绑定溯源码数量
            stockInspectionReport,    // 库存质检报告
            stockInspectionNo,        // 质检单编号
            inspectionDate            // 报检日期
        } = formData;

        // 全屏时的样式
        const fullscreenStyle: React.CSSProperties = isFullscreen ? {
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100vw',
            maxWidth: '100vw',
            height: '100vh',
            margin: 0,
            paddingBottom: 0,
        } : {};

        // 全屏时 body 样式 - 移除高度限制，让内容自然滚动
        const fullscreenBodyStyle: React.CSSProperties = isFullscreen ? {
            height: 'calc(100vh - 55px)',  // 减去标题栏高度
            overflowY: 'auto',
            padding: '24px',
        } : { maxHeight: '70vh', overflowY: 'auto', padding: '24px' };

        // 全屏时 Modal 的样式类名
        const modalClassName = isFullscreen ? 'fullscreen-modal' : '';

        return (
            <Modal
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '32px' }}>
                        <span>{title}</span>
                        <span
                            className="modal-icon"
                            style={{
                                cursor: 'pointer',
                                fontSize: '18px',
                                display: 'inline-flex',
                                alignItems: 'center'
                            }}
                        >
                            {
                                isFullscreen ?
                                    <FullscreenExitOutlined onClick={this.toggleFullscreen} /> :
                                    <FullscreenOutlined onClick={this.toggleFullscreen} />
                            }
                        </span>
                    </div>
                }
                open={visible}
                onOk={onOk}
                onCancel={onCancel}
                okText={t('common.confirm')}
                cancelText={t('common.cancel')}
                width={isFullscreen ? '100vw' : 950}
                confirmLoading={loading}
                style={{ top: isFullscreen ? 0 : 20, ...fullscreenStyle }}
                bodyStyle={fullscreenBodyStyle}
                className={modalClassName}
                destroyOnClose
            >
                <Tabs defaultActiveKey="basic" type="card">
                    {/* 产品信息 Tab */}
                    <TabPane tab="产品信息" key="basic">
                        <Card title="产品信息" size="small" style={{ marginBottom: 16 }}>
                            <div style={{ color: '#7d5504', marginBottom: 16, fontSize: 12 }}>
                                提示：如产品类型、型号等数据，在业务经营活动中增减变动较多；建议新建辅助表，作为下方"下拉框"字段的关联数据源，以便维护！
                            </div>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="产品编码" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input value={productCode} placeholder="自动生成无需填写" disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="产品名称（批号）" required labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input
                                            value={productName}
                                            onChange={(e) => this.updateFormData('productName', e.target.value)}
                                            placeholder="请输入产品名称或批号"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="规格型号（较长/简重）" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input
                                            value={specModel}
                                            onChange={(e) => this.updateFormData('specModel', e.target.value)}
                                            placeholder="请输入规格型号"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="单重(kg)" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <InputNumber
                                            value={unitWeight}
                                            onChange={(value) => this.updateFormData('unitWeight', value)}
                                            style={{ width: '100%' }}
                                            min={0}
                                            precision={3}
                                            placeholder="请输入单重"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="品种规格" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input
                                            value={varietySpec}
                                            onChange={(e) => this.updateFormData('varietySpec', e.target.value)}
                                            placeholder="请输入品种规格"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="产品类别" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Select
                                            value={productCategory}
                                            onChange={(value) => this.updateFormData('productCategory', value)}
                                            placeholder="请选择产品类别"
                                            allowClear
                                            showSearch
                                        >
                                            {productCategoryOptions.map(opt => (
                                                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="产品归类" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input
                                            value={productClassification}
                                            onChange={(e) => this.updateFormData('productClassification', e.target.value)}
                                            placeholder="请输入产品归类"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="单位" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input
                                            value={unit}
                                            onChange={(e) => this.updateFormData('unit', e.target.value)}
                                            placeholder="如：个、kg、米"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="产品属性" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Select
                                            value={productAttribute}
                                            onChange={(value) => this.updateFormData('productAttribute', value)}
                                            placeholder="请选择产品属性"
                                        >
                                            {productAttributeOptions.map(opt => (
                                                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="默认仓库" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input
                                            value={defaultWarehouse}
                                            onChange={(e) => this.updateFormData('defaultWarehouse', e.target.value)}
                                            placeholder="请输入默认仓库"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="供应商" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input
                                            value={supplier}
                                            onChange={(e) => this.updateFormData('supplier', e.target.value)}
                                            placeholder="请输入供应商"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="产品图片" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Upload {...this.getUploadProps(
                                            (urls) => this.updateFormData('productImages', urls),
                                            productImages
                                        )}>
                                            <Button icon={<UploadOutlined />}>上传图片</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="产品简介" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <TextArea
                                    value={productIntro}
                                    onChange={(e) => this.updateFormData('productIntro', e.target.value)}
                                    rows={4}
                                    placeholder="请输入产品简介"
                                />
                            </Form.Item>
                        </Card>

                        <Card title="产品价格信息" size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="参考采购单价(含税)/元" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <InputNumber
                                            value={purchasePrice}
                                            onChange={(value) => this.updateFormData('purchasePrice', value)}
                                            style={{ width: '100%' }}
                                            min={0}
                                            precision={2}
                                            placeholder="请输入采购单价"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="参考销售单价(含税)/元" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <InputNumber
                                            value={salePrice}
                                            onChange={(value) => this.updateFormData('salePrice', value)}
                                            style={{ width: '100%' }}
                                            min={0}
                                            precision={2}
                                            placeholder="请输入销售单价"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="库存信息" size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="安全库存下限" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <InputNumber
                                            value={safetyStockLower}
                                            onChange={(value) => this.updateFormData('safetyStockLower', value)}
                                            style={{ width: '100%' }}
                                            min={0}
                                            placeholder="请输入安全库存下限"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="安全库存上限" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <InputNumber
                                            value={safetyStockUpper}
                                            onChange={(value) => this.updateFormData('safetyStockUpper', value)}
                                            style={{ width: '100%' }}
                                            min={0}
                                            placeholder="请输入安全库存上限"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="工序信息" size="small" style={{ marginBottom: 16 }}>
                            <Form.Item label="工序模板名称" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Select
                                    value={processTemplateName}
                                    onChange={(value) => this.updateFormData('processTemplateName', value)}
                                    placeholder="请选择工序模板名称"
                                    allowClear
                                    showSearch
                                >
                                    <Option value="模板A">模板A</Option>
                                    <Option value="模板B">模板B</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        <Card title="生产环节" size="small">
                            <Collapse>
                                {productionSteps.map((step, index) => (
                                    <Panel
                                        header={`步骤 ${index + 1}: ${step.title || '未命名'}`}
                                        key={step.key}
                                        extra={
                                            <MinusCircleOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.removeProductionStep(step.key);
                                                }}
                                            />
                                        }
                                    >
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item label="工序编码">
                                                    <Input
                                                        value={step.processCode}
                                                        onChange={(e) => this.updateProductionStep(step.key, 'processCode', e.target.value)}
                                                        placeholder="请输入工序编码"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={16}>
                                                <Form.Item label="标题">
                                                    <Input
                                                        value={step.title}
                                                        onChange={(e) => this.updateProductionStep(step.key, 'title', e.target.value)}
                                                        placeholder="请输入标题"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item label="内容">
                                            <TextArea
                                                value={step.content}
                                                onChange={(e) => this.updateProductionStep(step.key, 'content', e.target.value)}
                                                rows={3}
                                                placeholder="请输入内容"
                                            />
                                        </Form.Item>
                                        <Form.Item label="图片">
                                            <Upload {...this.getUploadProps(
                                                (urls) => this.updateProductionStep(step.key, 'images', urls),
                                                step.images
                                            )}>
                                                <Button icon={<UploadOutlined />}>上传图片</Button>
                                            </Upload>
                                        </Form.Item>
                                    </Panel>
                                ))}
                            </Collapse>
                            <Button
                                type="dashed"
                                onClick={this.addProductionStep}
                                style={{ width: '100%', marginTop: 16 }}
                                icon={<PlusOutlined />}
                            >
                                添加生产环节
                            </Button>
                            <div style={{ textAlign: 'right', marginTop: 8 }}>
                                <Button type="link" size="small">快速填报</Button>
                            </div>
                        </Card>
                    </TabPane>

                    {/* 企业信息 Tab */}
                    <TabPane tab="企业信息" key="enterprise">
                        <Card title="企业信息" size="small" style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="选择企业" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Select
                                            value={enterpriseId}
                                            onChange={(value) => this.updateFormData('enterpriseId', value)}
                                            placeholder="选择企业"
                                            showSearch
                                        >
                                            <Option value="1">企业A</Option>
                                            <Option value="2">企业B</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="选择数据" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Select placeholder="选择数据" disabled>
                                            <Option value="data1">数据1</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="企业名称" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Input
                                    value={enterpriseName}
                                    onChange={(e) => this.updateFormData('enterpriseName', e.target.value)}
                                    placeholder="请输入企业名称"
                                />
                            </Form.Item>
                            <Form.Item label="地址" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Input
                                    value={address}
                                    onChange={(e) => this.updateFormData('address', e.target.value)}
                                    placeholder="请输入地址"
                                />
                            </Form.Item>
                            <Form.Item label="企业简介" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <TextArea
                                    value={enterpriseIntro}
                                    onChange={(e) => this.updateFormData('enterpriseIntro', e.target.value)}
                                    rows={4}
                                    placeholder="请输入企业简介"
                                />
                            </Form.Item>
                            <Form.Item label="企业环境" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Upload {...this.getUploadProps(
                                    (urls) => this.updateFormData('enterpriseImages', urls),
                                    enterpriseImages
                                )}>
                                    <Button icon={<UploadOutlined />}>选择 拖拽或单击后粘贴图片，单张20MB以内</Button>
                                </Upload>
                            </Form.Item>
                        </Card>
                    </TabPane>

                    {/* 质量管理信息 Tab */}
                    <TabPane tab="质量管理信息" key="quality">
                        <Card title="质量管理信息" size="small" style={{ marginBottom: 16 }}>
                            <Form.Item label="溯源记录信息和质检记录信息" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <TextArea
                                    value={qmTraceRecords}
                                    onChange={(e) => this.updateFormData('qmTraceRecords', e.target.value)}
                                    rows={3}
                                    placeholder="请输入溯源记录信息"
                                />
                                <TextArea
                                    value={qmInspectionRecords}
                                    onChange={(e) => this.updateFormData('qmInspectionRecords', e.target.value)}
                                    rows={3}
                                    placeholder="请输入质检记录信息"
                                    style={{ marginTop: 8 }}
                                />
                            </Form.Item>

                            <Divider />

                            <Form.Item label="被绑定溯源码个数" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <InputNumber
                                    value={boundTraceCodeCount}
                                    onChange={(value) => this.updateFormData('boundTraceCodeCount', value)}
                                    style={{ width: '100%' }}
                                    min={0}
                                    placeholder="请输入被绑定溯源码个数"
                                />
                            </Form.Item>

                            <Form.Item label="选择库存质检报告" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Select
                                    value={stockInspectionReport}
                                    onChange={(value) => this.updateFormData('stockInspectionReport', value)}
                                    placeholder="选择库存质检报告"
                                    allowClear
                                >
                                    <Option value="report1">质检报告1</Option>
                                    <Option value="report2">质检报告2</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="库存质检单编号" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Select
                                    value={stockInspectionNo}
                                    onChange={(value) => this.updateFormData('stockInspectionNo', value)}
                                    placeholder="选择数据"
                                    allowClear
                                    showSearch
                                >
                                    <Option value="NO001">NO001</Option>
                                    <Option value="NO002">NO002</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="报检日期" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Input
                                    value={inspectionDate}
                                    onChange={(e) => this.updateFormData('inspectionDate', e.target.value)}
                                    placeholder="报检日期"
                                    type="date"
                                />
                            </Form.Item>
                        </Card>
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

const ProductInfoModal = withTranslation()(_ProductInfoModal);
export default ProductInfoModal;