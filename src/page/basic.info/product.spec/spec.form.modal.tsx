// src/page/basic.info/product.property/property.form.modal.tsx
// 产品规格表单弹框组件

import React from 'react';
import { Modal, Form, Input } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
    AppstoreOutlined,
    DatabaseOutlined,
    ToolOutlined,
    DeleteOutlined,
    ScheduleOutlined,
} from '@ant-design/icons';

export interface ProductSpecRecord {
    key: string;
    id: string;
    name: string;
    sortOrder: number;
    status: 'active' | 'inactive';
    createTime: string;
}

export interface FormData {
    name: string;
    sortOrder: number;
}

interface ProductSpecModalProps {
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

class _ProductSpecModal extends React.Component<WithTranslation & ProductSpecModalProps> {
    updateFormData = (key: keyof FormData, value: any) => {
        const { formData, onFormDataChange } = this.props;
        onFormDataChange({ ...formData, [key]: value });
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
                        label={t('productSpec.form.name')}
                        required
                    >
                        <Input
                            placeholder={t('productSpec.placeholder.name')}
                            value={formData.name}
                            onChange={(e) => this.updateFormData('name', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label={t('productSpec.form.sortOrder')}>
                        <Input
                            type="number"
                            placeholder={t('productSpec.placeholder.sortOrder')}
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

const ProductSpecModal = withTranslation()(_ProductSpecModal);
export default ProductSpecModal;
export {
    iconMap
}