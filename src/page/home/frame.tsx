// src/page/home/frame.tsx

// 主页框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface FrameHomeProps {
    headerHeight: number;
    departmentList: any[];
    positionList: any[];
}

class _FrameHome extends React.Component<WithTranslation & FrameHomeProps> {
    render() {
        return (
            <></>
        )
    }
}
export const FrameHome = withTranslation()(_FrameHome);