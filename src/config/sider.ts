// src/config/sider.ts

import {
    // 子菜单图标
    BarChartOutlined,      // 仓储统计
    TableOutlined,         // 出入库明细
    AppstoreOutlined,
    ProductOutlined,       // 产品信息
    ShopOutlined,     // 仓库信息
    EnvironmentOutlined,   // 仓位信息
    InboxOutlined,         // 入库单
    ExportOutlined,
    HomeOutlined,
    FolderOutlined,
    AuditOutlined,
    ApartmentOutlined,        // 出库单
} from '@ant-design/icons';

// 配置: 侧边栏菜单项配置

/** 菜单键 */
export const MENU_KEY = {
    // 首页
    Home: "Home",

    // 仓储统计看板
    Dashboard: "Dashboard",
    // 仓储统计看板 - 子菜单
    StorageStats: "StorageStats",        // 仓储统计看板
    InOutDetails: "InOutDetails",        // 出入库明细看板

    // 基础信息维护
    BaseInfo: "BaseInfo",
    // 基础信息维护 - 子菜单
    ProductSpec: "ProductSpec",    // 规格型号
    ProductProperty: "ProductProperty", // 产品属性
    ProductInfo: "ProductInfo",         // 产品信息
    WarehouseInfo: "WarehouseInfo",     // 仓库信息
    LocationInfo: "LocationInfo",       // 仓位信息

    // 产品出入库管理
    ProductInOut: "ProductInOut",
    // 产品出入库管理 - 子菜单
    InboundOrder: "InboundOrder",       // 入库单
    OutboundOrder: "OutboundOrder",     // 出库单

    // 库存调拨管理
    StockTransfer: "StockTransfer",

    // 库存盘点管理
    StockCheck: "StockCheck",
};

/** 主菜单项 */
export const MENU = [
    { key: MENU_KEY.Home, label: 'front-page', icon: HomeOutlined },
    { key: MENU_KEY.Dashboard, label: 'storage-stats-board', icon: FolderOutlined },
    { key: MENU_KEY.BaseInfo, label: 'basic-info-maintenance', icon: FolderOutlined },
    { key: MENU_KEY.ProductInOut, label: 'product-in-out-management', icon: FolderOutlined },
    { key: MENU_KEY.StockTransfer, label: 'inventory-allocation', icon: ApartmentOutlined },
    { key: MENU_KEY.StockCheck, label: 'inventory-counting', icon: AuditOutlined },
];

/** 子菜单项 */
export const SUBMENU = [
    [],  // 首页（无子菜单）
    [    // 仓储统计看板
        { key: MENU_KEY.StorageStats, label: 'storage-stats', icon: BarChartOutlined },
        { key: MENU_KEY.InOutDetails, label: 'in-out-details', icon: TableOutlined },
    ],
    [    // 基础信息维护
        { key: MENU_KEY.ProductSpec, label: 'specification-model', icon: AppstoreOutlined },
        { key: MENU_KEY.ProductProperty, label: 'product-property', icon: AppstoreOutlined },
        { key: MENU_KEY.ProductInfo, label: 'product-info', icon: ProductOutlined },
        { key: MENU_KEY.WarehouseInfo, label: 'warehouse-info', icon: ShopOutlined },
        { key: MENU_KEY.LocationInfo, label: 'location-info', icon: EnvironmentOutlined },
    ],
    [    // 产品出入库管理
        { key: MENU_KEY.InboundOrder, label: 'inbound-order', icon: InboxOutlined },
        { key: MENU_KEY.OutboundOrder, label: 'outbound-order', icon: ExportOutlined },
    ],
    [],  // 库存调拨管理（无子菜单）
    [],  // 库存盘点管理（无子菜单）
];