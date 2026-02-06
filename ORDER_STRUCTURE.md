# 统一订单确认页架构设计

## 核心原则
无论是「购买」「续费」「升级」「增购」,订单确认页的信息架构必须保持一致,让用户建立统一的心智模型。

## 统一订单数据模型

```typescript
interface UnifiedOrder {
  // 订单类型标识
  type: 'purchase' | 'renewal' | 'upgrade' | 'expansion';
  orderTitle: string; // 订单标题: "购买新应用" | "版本续费" | "版本升级" | "增购账号"
  
  // 产品信息
  product: {
    id: string;
    name: string;          // 产品名称
    icon: string;          // 图标样式类
    category: string;      // 分类标签
  };
  
  // 定价信息(核心)
  pricing: {
    unitPrice: number;     // 单价
    quantity: number;      // 数量
    duration: {            // 时长信息
      value: number;
      unit: 'year' | 'upgrade' | 'seat';
      label: string;       // 展示文本
    };
    subtotal: number;      // 小计
    discount: number;      // 优惠金额
    discountRate?: string; // 折扣力度标签 (如 "9折")
    finalAmount: number;   // 应付金额
  };
  
  // 当前状态(若适用)
  currentStatus?: {
    version?: string;      // 当前版本
    expiryDate?: string;   // 当前到期时间
    remainingDays?: number;// 剩余天数
    seats?: number;        // 当前账号数
  };
  
  // 购买后状态
  afterPurchase: {
    version?: string;      // 购买后版本
    expiryDate?: string;   // 购买后到期时间
    totalValidDays?: number;// 总有效天数
    seats?: number;        // 购买后账号数
    note?: string;         // 特殊说明
  };
  
  // 额外载荷
  payload?: any;
}
```

## 订单确认页视觉结构

```
┌─────────────────────────────────────┐
│ 【顶部】订单标题                      │
│  └─ 购买新应用 / 版本续费 / 版本升级  │
├─────────────────────────────────────┤
│ 【产品卡片】                          │
│  ┌─ Icon ─┬─ 产品名称               │
│  │        │  分类标签                │
│  └────────┴──────────────────────────│
├─────────────────────────────────────┤
│ 【定价明细】                          │
│  单价      ¥1,980 × 2年              │
│  小计      ¥3,960                    │
│  优惠     -¥396 (9折)                │
│  ─────────────────────────           │
│  应付金额  ¥3,564                    │
├─────────────────────────────────────┤
│ 【状态对比】(仅续费/升级显示)        │
│  当前: 到期 2025-12-31 (剩余 340天)  │
│  购买后: 到期 2027-12-31 (1070天)    │
├─────────────────────────────────────┤
│ 【支付方式选择】                      │
│  微信 / 支付宝 / 对公 / 余额         │
└─────────────────────────────────────┘
```

## 各场景映射

### 1. 购买新应用
- type: 'purchase'
- orderTitle: '购买新应用'
- currentStatus: null (无当前状态)
- afterPurchase: 显示到期时间

### 2. 版本续费
- type: 'renewal'
- orderTitle: '版本续费'
- currentStatus: 显示当前到期时间和剩余天数
- afterPurchase: 显示延长后的到期时间

### 3. 版本升级
- type: 'upgrade'
- orderTitle: '版本升级'
- currentStatus: 显示当前版本和到期时间
- afterPurchase: 显示升级后版本,注明"剩余有效期不变"

### 4. 增购账号
- type: 'expansion'
- orderTitle: '增购账号'
- currentStatus: 显示当前账号数
- afterPurchase: 显示增购后总账号数

## 实施优先级
1. 先重构数据模型 (修改 initiateXXX 函数)
2. 再重构订单确认页 UI (Modal 内容区)
3. 最后统一支付完成逻辑
