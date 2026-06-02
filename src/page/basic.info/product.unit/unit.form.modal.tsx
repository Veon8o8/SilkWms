// src/page/basic.info/product.unit/unit.form.modal.tsx
// 产品单位表单弹框组件

import React from 'react';
import { Modal, Form, Input } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';

export interface ProductUnitRecord {
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

interface ProductUnitModalProps {
    visible: boolean;
    title: string;
    formData: FormData;
    loading?: boolean;
    onOk: () => void;
    onCancel: () => void;
    onFormDataChange: (newFormData: FormData) => void;
}

class _ProductUnitModal extends React.Component<WithTranslation & ProductUnitModalProps> {
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
                        label={t('productUnit.form.name')}
                        required
                    >
                        <Input
                            placeholder={t('productUnit.placeholder.name')}
                            value={formData.name}
                            onChange={(e) => this.updateFormData('name', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label={t('productUnit.form.sortOrder')}>
                        <Input
                            type="number"
                            placeholder={t('productUnit.placeholder.sortOrder')}
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

const ProductUnitModal = withTranslation()(_ProductUnitModal);
export default ProductUnitModal;