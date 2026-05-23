// src/page/basic.info/product.property/property.form.modal.tsx
// 产品属性表单弹框组件（图标选择框支持显示选中图标并跟随主题色）

import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
    AppstoreOutlined,
    DatabaseOutlined,
    ToolOutlined,
    DeleteOutlined,
    ScheduleOutlined,
} from '@ant-design/icons';

export interface ProductPropertyRecord {
    key: string;
    id: string;
    name: string;
    icon: string;
    color: string;
    sortOrder: number;
    status: 'active' | 'inactive';
    createTime: string;
}

export interface FormData {
    name: string;
    icon: string;
    color: string;
    sortOrder: number;
}

interface PropertyFormModalProps {
    visible: boolean;
    title: string;
    formData: FormData;
    loading?: boolean;
    onOk: () => void;
    onCancel: () => void;
    onFormDataChange: (newFormData: FormData) => void;
}

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
    'AppstoreOutlined': <AppstoreOutlined />,
    'DatabaseOutlined': <DatabaseOutlined />,
    'ToolOutlined': <ToolOutlined />,
    'DeleteOutlined': <DeleteOutlined />,
    'ScheduleOutlined': <ScheduleOutlined />,
};

// 图标选项列表（带图标）
const iconOptions = [
    { value: 'AppstoreOutlined', label: '成品图标', icon: <AppstoreOutlined /> },
    { value: 'DatabaseOutlined', label: '原料图标', icon: <DatabaseOutlined /> },
    { value: 'ToolOutlined', label: '备件图标', icon: <ToolOutlined /> },
    { value: 'DeleteOutlined', label: '废料图标', icon: <DeleteOutlined /> },
    { value: 'ScheduleOutlined', label: '计划图标', icon: <ScheduleOutlined /> },
];

// 颜色选项列表（带颜色块）
const colorOptions = [
    { value: '#1890ff', label: '蓝色', color: '#1890ff' },
    { value: '#fa8c16', label: '橙色', color: '#fa8c16' },
    { value: '#722ed1', label: '紫色', color: '#722ed1' },
    { value: '#f5222d', label: '红色', color: '#f5222d' },
    { value: '#13c2c2', label: '青色', color: '#13c2c2' },
    { value: '#52c41a', label: '绿色', color: '#52c41a' },
    { value: '#eb2f96', label: '粉色', color: '#eb2f96' },
];

class _PropertyFormModal extends React.Component<WithTranslation & PropertyFormModalProps> {
    updateFormData = (key: keyof FormData, value: any) => {
        const { formData, onFormDataChange } = this.props;
        onFormDataChange({ ...formData, [key]: value });
    };

    // 获取当前选中的图标组件
    getSelectedIcon = () => {
        const { formData } = this.props;
        return iconMap[formData.icon] || <AppstoreOutlined />;
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

        return (
            <Modal
                title={title}
                open={visible}
                onOk={onOk}
                onCancel={onCancel}
                okText={t('common.confirm')}
                cancelText={t('common.cancel')}
                width={600}
                confirmLoading={loading}
            >
                <Form layout="vertical">
                    <Form.Item
                        label={t('productProperty.form.name')}
                        required
                    >
                        <Input
                            placeholder={t('productProperty.placeholder.name')}
                            value={formData.name}
                            onChange={(e) => this.updateFormData('name', e.target.value)}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item label={t('productProperty.form.icon')} style={{ flex: 1 }}>
                            <Select
                                placeholder={t('productProperty.placeholder.icon')}
                                value={formData.icon}
                                onChange={(value) => this.updateFormData('icon', value)}
                                style={{ width: '100%' }}
                                optionLabelProp="label"
                            >
                                {iconOptions.map((opt) => (
                                    <Select.Option key={opt.value} value={opt.value} label={opt.label}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '18px', color: formData.color }}>
                                                {opt.icon}
                                            </span>
                                            <span>{opt.label}</span>
                                        </span>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label={t('productProperty.form.color')} style={{ flex: 1 }}>
                            <Select
                                placeholder={t('productProperty.placeholder.color')}
                                value={formData.color}
                                onChange={(value) => this.updateFormData('color', value)}
                                style={{ width: '100%' }}
                            >
                                {colorOptions.map((opt) => (
                                    <Select.Option key={opt.value} value={opt.value}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: opt.color,
                                                borderRadius: '4px',
                                                border: '1px solid #d9d9d9'
                                            }} />
                                            <span>{opt.label}</span>
                                            <span style={{ color: '#999', fontSize: '12px' }}>{opt.value}</span>
                                        </span>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item label={t('productProperty.form.sortOrder')}>
                        <Input
                            type="number"
                            placeholder={t('productProperty.placeholder.sortOrder')}
                            value={formData.sortOrder}
                            onChange={(e) =>
                                this.updateFormData('sortOrder', parseInt(e.target.value) || 1)
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const PropertyFormModal = withTranslation()(_PropertyFormModal);
export default PropertyFormModal;
export {
    iconMap
}