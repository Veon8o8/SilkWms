// src/page/basic.info/warehouse.info/warehouse.form.modal.tsx
// 仓库管理表单弹框组件（添加/编辑仓库）

import React from 'react';
import {
    Modal,
    Form,
    Input,
    Radio,
    Button,
    message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { withTranslation, WithTranslation } from 'react-i18next';
import '../../../css/common/modal.css';

const { TextArea } = Input;

// 仓库表单数据类型
export interface WarehouseFormData {
    /** 仓库名称 */
    warehouseName: string;
    /** 仓库编码（自动生成） */
    warehouseCode: string;
    /** 仓库地址 */
    warehouseAddress: string;
    /** 仓库状态：1-启用，0-停用 */
    warehouseStatus: number;
    /** 仓库主管 */
    warehouseSupervisor: string;
    /** 库管归属部门 */
    supervisorDepartment: string;
    /** 联系电话 */
    contactPhone: string;
    /** 备注 */
    remark?: string;
}

// 仓库记录类型（用于表格展示）
export interface WarehouseRecord {
    key: string;
    id: string;
    warehouseName: string;
    warehouseCode: string;
    warehouseAddress: string;
    warehouseStatus: number;
    statusText: string;
    subWarehouse?: string;
    warehouseSupervisor: string;
    supervisorDepartment: string;
    contactPhone: string;
    submitter: string;
    submitTime: string;
    remark?: string;
}

interface WarehouseModalProps {
    visible: boolean;
    title: string;
    formData: WarehouseFormData;
    editingRecord?: WarehouseRecord | null;
    loading?: boolean;
    onOk: () => void;
    onCancel: () => void;
    onFormDataChange: (newFormData: WarehouseFormData) => void;
}

// 模拟成员数据（实际应从API获取）
const mockMembers = [
    { id: '1', name: '张三', department: '仓库部', phone: '13300000000' },
    { id: '2', name: '李四', department: '仓库部', phone: '13300000001' },
    { id: '3', name: '长生线业', department: '仓库部', phone: '13300000001' },
];

// 模拟部门数据
const mockDepartments = [
    { id: '1', name: '仓库部' },
    { id: '2', name: '采购部' },
    { id: '3', name: '生产部' },
];

class _WarehouseModal extends React.Component<WithTranslation & WarehouseModalProps> {
    /** 更新表单数据 */
    updateFormData = (key: keyof WarehouseFormData, value: any) => {
        const { formData, onFormDataChange } = this.props;
        onFormDataChange({ ...formData, [key]: value });
    };

    /** 选择成员 */
    handleSelectMember = () => {
        // 实际应打开成员选择弹窗，这里使用模拟选择
        message.info('选择成员功能开发中，实际应弹出成员选择器');
        // 模拟选择第一个成员
        const member = mockMembers[0];
        this.updateFormData('warehouseSupervisor', member.name);
        this.updateFormData('supervisorDepartment', member.department);
        this.updateFormData('contactPhone', member.phone);
    };

    /** 选择部门 */
    handleSelectDepartment = () => {
        message.info('选择部门功能开发中，实际应弹出部门选择器');
        const department = mockDepartments[0];
        this.updateFormData('supervisorDepartment', department.name);
    };

    render() {
        const {
            visible,
            title,
            formData,
            loading = false,
            onOk,
            onCancel,
            t
        } = this.props;

        const {
            warehouseName,
            warehouseCode,
            warehouseAddress,
            warehouseStatus,
            warehouseSupervisor,
            supervisorDepartment,
            contactPhone,
            remark,
        } = formData;

        // 表单布局配置
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        return (
            <Modal
                title={title}
                open={visible}
                onOk={onOk}
                onCancel={onCancel}
                okText={t('common.confirm')}
                cancelText={t('common.cancel')}
                width={700}
                confirmLoading={loading}
                destroyOnClose
            >
                <div className="warehouse-modal-form">
                    {/* 仓库信息区块 */}
                    <div className="form-section">
                        <div className="form-section-title">仓库信息</div>
                        <Form layout="horizontal" {...formItemLayout}>
                            <Form.Item label="仓库名称" required>
                                <Input
                                    placeholder="请输入仓库名称"
                                    value={warehouseName}
                                    onChange={(e) => this.updateFormData('warehouseName', e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item label="仓库编码">
                                <Input
                                    placeholder="自动生成无需填写"
                                    value={warehouseCode}
                                    disabled
                                />
                            </Form.Item>

                            <Form.Item label="仓库地址" required>
                                <Input.Group compact>
                                    <Button style={{ width: '30%' }}>请选择地址</Button>
                                    <Input
                                        style={{ width: '70%' }}
                                        placeholder="请填写详细地址"
                                        value={warehouseAddress}
                                        onChange={(e) => this.updateFormData('warehouseAddress', e.target.value)}
                                    />
                                </Input.Group>
                            </Form.Item>

                            <Form.Item label="仓库状态">
                                <Radio.Group
                                    value={warehouseStatus}
                                    onChange={(e) => this.updateFormData('warehouseStatus', e.target.value)}
                                >
                                    <Radio value={1}>启用</Radio>
                                    <Radio value={0}>停用</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </div>

                    {/* 库管信息区块 */}
                    <div className="form-section">
                        <div className="form-section-title">库管信息</div>
                        <Form layout="horizontal" {...formItemLayout}>
                            <Form.Item label="仓库主管" required>
                                <Input.Group compact>
                                    <Input
                                        style={{ width: '80%' }}
                                        placeholder="请选择仓库主管"
                                        value={warehouseSupervisor}
                                        onChange={(e) => this.updateFormData('warehouseSupervisor', e.target.value)}
                                    />
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={this.handleSelectMember}
                                    >
                                        选择成员
                                    </Button>
                                </Input.Group>
                            </Form.Item>

                            <Form.Item label="库管归属部门" required>
                                <Input.Group compact>
                                    <Input
                                        style={{ width: '80%' }}
                                        placeholder="请选择部门"
                                        value={supervisorDepartment}
                                        onChange={(e) => this.updateFormData('supervisorDepartment', e.target.value)}
                                    />
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={this.handleSelectDepartment}
                                    >
                                        选择部门
                                    </Button>
                                </Input.Group>
                            </Form.Item>

                            <Form.Item label="联系电话" required>
                                <Input
                                    placeholder="请输入联系电话"
                                    value={contactPhone}
                                    onChange={(e) => this.updateFormData('contactPhone', e.target.value)}
                                />
                            </Form.Item>
                        </Form>
                    </div>

                    {/* 备注区块 */}
                    <div className="form-section">
                        <div className="form-section-title">其他信息</div>
                        <Form layout="horizontal" {...formItemLayout}>
                            <Form.Item label="备注">
                                <TextArea
                                    rows={3}
                                    placeholder="请输入备注信息"
                                    value={remark}
                                    onChange={(e) => this.updateFormData('remark', e.target.value)}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Modal>
        );
    }
}

const WarehouseModal = withTranslation()(_WarehouseModal);
export default WarehouseModal;