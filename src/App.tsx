import React, { useState } from 'react';
import { 
  ShoppingBag, Star, Zap, Package, 
  AlertCircle, CheckCircle2, X, Plus, Layout, ShieldCheck, TrendingUp, 
  Image as ImageIcon, Crown, Wallet, ArrowRight, ChevronRight, 
  FileText, Receipt, Settings, Clock, Info, 
  QrCode, Smartphone, Building2, 
  Monitor, Activity, 
  Smile, 
  BookOpen, Wifi, Power, 
  RefreshCw, MessageSquare
} from 'lucide-react';

// --- Imported Constants & Data ---
import { 
  USER_PROFILE, 
  VERSION_LEVELS, 
  INITIAL_INVOICE_INFO, 
  INITIAL_TRANSACTIONS, 
  PRODUCTS 
} from './constants/products';


// --- COMPONENTS ---

const Button = ({ variant = 'primary', className = '', children, onClick, disabled }: any) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants: any = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
        outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
        wechat: "bg-[#07C160] text-white hover:bg-[#06ad56] border-none shadow-sm",
        alipay: "bg-[#1677FF] text-white hover:bg-[#1363d6] border-none shadow-sm",
        corporate: "bg-slate-700 text-white hover:bg-slate-800 border-none shadow-sm"
    };
    return (
        <button type="button" className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>
    );
};

const Modal = ({ isOpen, onClose, children, title, maxWidth = "max-w-3xl", zIndex = 50 }: any) => {
    if (!isOpen) return null;
    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center bg-black/60 p-4`} 
            style={{ zIndex }}
            onClick={(e) => { if(e.target === e.currentTarget) onClose(); }} 
        >
            <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col relative will-change-transform`}>
                {/* Floating Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-[60] w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all flex items-center justify-center shadow-sm"
                >
                    <X size={18} />
                </button>
                
                {title && (
                    <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>
                )}
                <div className="overflow-y-auto flex-grow scroll-smooth relative">
                    {children}
                </div>
            </div>
        </div>
    );
};

const SimpleMarkdown = ({ content }: { content: string }) => {
    const lines = content.trim().split('\n');
    return (
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
        {lines.map((line, idx) => {
            const trimLine = line.trim();
            if (!trimLine) return null;
            
            // 二级标题 ## - 主标题，大号加粗，蓝色左边框强调
            if (trimLine.startsWith('## ')) {
                return (
                    <h2 key={idx} className="text-gray-900 font-black text-xl mt-10 mb-4 first:mt-0 border-l-4 border-blue-500 pl-4 leading-tight">
                        {trimLine.replace('## ', '')}
                    </h2>
                );
            }
            
            // 三级标题 ### - 章节标题，中号加粗，灰色背景条
            if (trimLine.startsWith('### ')) {
                return (
                    <h3 key={idx} className="text-gray-800 font-bold text-base mt-8 mb-3 bg-gradient-to-r from-blue-50 to-transparent px-3 py-2 rounded-l-lg border-l-2 border-blue-400">
                        {trimLine.replace('### ', '')}
                    </h3>
                );
            }
            
            // 图片占位符
            if (trimLine.startsWith('![')) {
                const altText = trimLine.match(/!\[(.*?)\]/)?.[1] || "Image";
                return (
                    <div key={idx} className="my-6 bg-slate-100 rounded-lg h-48 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={32} className="mb-2 opacity-50"/>
                        <span className="text-xs font-medium">{altText}</span>
                        <span className="text-[10px] mt-1">(此处为产品实景/界面演示图)</span>
                    </div>
                );
            }
            
            // 引用块
            if (trimLine.startsWith('> ')) {
                return (
                    <div key={idx} className="pl-4 border-l-4 border-gray-300 italic text-gray-500 my-4 bg-gray-50 p-3 rounded-r">
                        {trimLine.replace('> ', '')}
                    </div>
                );
            }
            
            // 无序列表 - 开头（蓝色圆点强调重点）
            if (trimLine.startsWith('- ')) {
                return (
                    <div key={idx} className="flex items-start gap-2 ml-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <span>{trimLine.replace('- ', '').replace(/\*\*(.*?)\*\*/g, (_m, p1) => p1)}</span>
                    </div>
                );
            }
            
            // 无序列表 * 开头（灰色圆点次要信息）
            if (trimLine.startsWith('* ')) {
                return (
                    <div key={idx} className="flex items-start gap-2 ml-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                        <span>{trimLine.replace('* ', '').replace(/\*\*(.*?)\*\*/g, (_m, p1) => p1)}</span>
                    </div>
                );
            }
            
            // 普通段落（支持加粗）
            const parts = trimLine.split(/(\*\*.*?\*\*)/);
            return (
                <p key={idx} className="leading-relaxed">
                    {parts.map((part, i) => 
                        part.startsWith('**') 
                            ? <strong key={i} className="text-gray-900 font-bold">{part.slice(2, -2)}</strong> 
                            : part
                    )}
                </p>
            );
        })}
        </div>
    );
};

// --- COMPONENTS ---

const StoreView = ({ products, userProfile, onSelectProduct, onShowRenewal, onShowUpgrade }: any) => {
    const [bizFilter, setBizFilter] = useState('all');
    
    const BIZ_CATEGORIES = [
        { id: 'all', label: '全部应用' },
        { id: 'growth', label: '增加收入' },
        { id: 'efficiency', label: '提高效率' },
        { id: 'safety', label: '合规省心' },
        { id: 'hardware', label: '硬件设备' }
    ];

    const filteredProducts = products
        .filter((p: any) => {
            if (bizFilter === 'all') return true;
            if (bizFilter === 'hardware') return p.type === 'hardware';
            if (bizFilter === 'growth') return p.tags.some((t: string) => t.includes('获客') || t.includes('增收') || t.includes('客单') || t.includes('引流'));
            if (bizFilter === 'efficiency') return p.tags.some((t: string) => t.includes('效率') || t.includes('秩序') || t.includes('自动') || t.includes('管理'));
            if (bizFilter === 'safety') return p.tags.some((t: string) => t.includes('安全') || t.includes('合规') || t.includes('风控') || t.includes('隐私'));
            return true;
        })
        .sort((a: any, b: any) => {
            if (a.isOwned !== b.isOwned) return a.isOwned ? 1 : -1;
            return (b.purchasedCount || 0) - (a.purchasedCount || 0);
        });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Version Dashboard - Synced with Wallet style */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="flex-1 p-8 bg-gradient-to-br from-white to-blue-50/30">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                    <Crown size={32} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">当前版本</div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-black text-gray-900">{userProfile.currentVersion}</h2>
                                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100 font-bold">运行中</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button className="h-10 px-8 text-sm font-bold shadow-blue-100" onClick={onShowRenewal}>续费</Button>
                                <Button variant="secondary" className="h-10 px-6 text-sm font-bold bg-white" onClick={onShowUpgrade}>升级</Button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-80 p-8 flex flex-col justify-center bg-gray-50/30">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">有效期至</span>
                                <span className="font-bold text-gray-900">2025-12-31</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">已购应用</span>
                                <span className="font-bold text-gray-900">{products.filter((p: any) => p.isOwned).length} 套</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Biz Filter - Synced with "My Apps" style */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">挑选新应用</h3>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {BIZ_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setBizFilter(cat.id)}
                                className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${
                                    bizFilter === cat.id 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    共 {filteredProducts.length} 个项目
                </div>
            </div>

            {/* 3. Product Grid - Compact & Lightweight */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p: any) => (
                    <div 
                        key={p.id} 
                        className={`group bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col p-5 ${
                            p.isOwned 
                            ? 'border-gray-50 opacity-70 grayscale-[0.5]' 
                            : 'border-gray-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50'
                        }`}
                        onClick={() => onSelectProduct(p)}
                    >
                        <div className="flex gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-xl ${p.imageColor} flex items-center justify-center text-gray-700 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0`}>
                                {p.type === 'software' ? <Smartphone size={24} /> : <Activity size={24} />}
                            </div>
                            <div className="flex-1 min-w-0 relative">
                                <h4 className="text-sm font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600">{p.title}</h4>
                                <div className="flex items-center gap-2">
                                    {p.trialDays && !p.isOwned && (
                                        <span className="text-[9px] bg-blue-50 text-blue-600 font-black px-1.5 py-0.5 rounded border border-blue-100">
                                            {p.trialDays}天试用
                                        </span>
                                    )}
                                    {p.isOwned && (
                                        <span className="text-[9px] bg-gray-100 text-gray-400 font-bold px-1.5 py-0.5 rounded">正在使用</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 h-10">{p.description}</p>

                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex flex-col">
                                {p.isOwned ? (
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">已有权益</span>
                                ) : (
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-lg font-black text-gray-900 font-mono">{p.price === 0 ? '免费' : p.price}</span>
                                        {p.price > 0 && <span className="text-[10px] text-gray-400">/年</span>}
                                    </div>
                                )}
                                <div className="text-[9px] text-gray-400 font-medium">
                                    {p.purchasedCount?.toLocaleString()} 位同行已购
                                </div>
                            </div>
                            <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HistoryOrderView = ({ balance, transactions, onShowRecharge, onShowWithdraw, onShowInvoiceConfig, onShowOrderDetail, onShowBatchInvoice }: any) => (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
        {/* 1. Account Summary Dashboard - Style synced with StoreView's system card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Balance Area (Primary Focus) */}
                <div className="flex-1 p-8 bg-gradient-to-br from-white to-blue-50/30">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">当前可用余额</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-gray-900">¥</span>
                                <span className="text-4xl font-black text-gray-900 font-mono tracking-tight">{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button className="h-10 px-8 text-sm font-bold shadow-blue-100" onClick={onShowRecharge}>充值</Button>
                            <Button variant="secondary" className="h-10 px-4 text-sm font-bold bg-white" onClick={onShowWithdraw}>提现</Button>
                        </div>
                    </div>
                </div>

                {/* Monthly Stats (Contextual Info) */}
                <div className="w-full md:w-80 p-8 flex flex-col justify-center bg-gray-50/30">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><TrendingUp size={16} className="rotate-180"/></div>
                                <span className="text-xs text-gray-500 font-medium">本月支出</span>
                            </div>
                            <span className="text-sm font-black text-gray-900 font-mono">¥ 1,240.00</span>
                        </div>
                        <div className="flex items-center justify-between group cursor-pointer" onClick={onShowBatchInvoice}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><Receipt size={16}/></div>
                                <span className="text-xs text-gray-500 font-medium group-hover:text-orange-600 transition-colors">待开发票</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-orange-600">
                                <span className="text-sm font-black font-mono">¥ 850.00</span>
                                <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Transaction Management Area */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">收支明细</h3>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button className="px-3 py-1 text-[10px] font-bold bg-white text-blue-600 rounded shadow-sm">全部记录</button>
                        <button className="px-3 py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600">支出</button>
                        <button className="px-3 py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600">充值</button>
                    </div>
                </div>
                <Button variant="ghost" className="h-8 px-3 text-[11px] text-gray-500" onClick={onShowInvoiceConfig}>
                    <Settings size={14} /> 发票抬头设置
                </Button>
            </div>

            {/* List based on the same logic as "My Apps" card list but more concise */}
            <div className="grid grid-cols-1 gap-3">
                {transactions.map((t: any) => (
                    <div 
                        key={t.id} 
                        className="group bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between"
                        onClick={() => onShowOrderDetail(t)}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            {/* Visual Category Icon - Consistently Styled */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                t.type === 'recharge' ? 'bg-green-50 text-green-600' : 
                                t.type === 'withdrawal' ? 'bg-slate-50 text-slate-400' : 
                                'bg-blue-50 text-blue-600'
                            }`}>
                                {t.type === 'recharge' ? <Plus size={20}/> : t.type === 'withdrawal' ? <ArrowRight size={20} className="rotate-180"/> : <ShoppingBag size={18}/>}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-bold text-gray-900 truncate">{t.item}</h4>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${
                                        t.status === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                    }`}>
                                        {t.status === 'success' ? 'SUCCESS' : 'PENDING'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                    <span className="font-mono">{t.orderNo}</span>
                                    <span>•</span>
                                    <span>{t.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 pl-6">
                            {/* Financial Data - Clearly prominent */}
                            <div className="text-right">
                                <div className={`text-lg font-black font-mono tracking-tighter ${t.type === 'recharge' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {t.type === 'recharge' ? '+' : '-'} ¥{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                    {t.type === 'recharge' ? '充值到账' : t.type === 'withdrawal' ? '余额提现' : '应用订购支出'}
                                </div>
                            </div>

                            {/* Secondary Actions / Status */}
                            <div className="flex items-center gap-3 w-24 justify-end">
                                {t.type === 'expense' && !t.invoiced && (
                                    <button 
                                        type="button" 
                                        className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-100 hover:bg-orange-100 transition-colors"
                                        onClick={(e) => { e.stopPropagation(); alert('发起开票申请...'); }}
                                    >
                                        申请开票
                                    </button>
                                )}
                                {t.invoiced && (
                                    <div className="text-[10px] text-gray-300 font-bold flex items-center gap-1">
                                        <CheckCircle2 size={12}/> 已开票
                                    </div>
                                )}
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Control - Standardised with store logic */}
            <div className="pt-4 text-center">
                <button className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 mx-auto">
                    <RefreshCw size={12} /> 加载更多历史账单
                </button>
            </div>
        </div>
    </div>
);

const OrdersView = ({ products, onSelectProduct, onShowAuthModal, onShowRenewal }: any) => {
    const [filter, setFilter] = useState<'all' | 'expiring'>('all');
    
    const ownedProducts = products
        .filter((p: any) => p.isOwned)
        .filter((p: any) => filter === 'all' || p.purchaseInfo?.status === 'expiring')
        .sort((a: any, b: any) => (a.purchaseInfo?.daysLeft || 9999) - (b.purchaseInfo?.daysLeft || 9999));
    
    const expiringCount = products.filter((p: any) => p.isOwned && p.purchaseInfo?.status === 'expiring').length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Actionable Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                    onClick={() => setFilter('all')}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${filter === 'all' ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'bg-white/50 border-gray-100 hover:bg-white shadow-sm'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Package size={24}/>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 font-medium">已启用服务</div>
                        <div className="text-2xl font-black text-gray-900">{products.filter((p: any) => p.isOwned).length} <span className="text-xs font-normal text-gray-400 ml-1">个</span></div>
                    </div>
                </div>
                
                <div 
                    onClick={() => setFilter('expiring')}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${filter === 'expiring' ? 'bg-orange-50 border-orange-500 shadow-md ring-1 ring-orange-500/20' : 'bg-white/50 border-gray-100 hover:bg-white shadow-sm'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${filter === 'expiring' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'}`}>
                        <Clock size={24}/>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 font-medium">即将到期 / 待续费</div>
                        <div className="text-2xl font-black text-orange-600">
                            {expiringCount} <span className="text-xs font-normal text-gray-400 ml-1">个</span>
                            {expiringCount > 0 && <span className="ml-3 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full animate-bounce">需处理</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* List Header & Global Entry */}
            <div className="flex justify-between items-center px-2 pt-2">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black text-gray-900">
                        {filter === 'expiring' ? '待续费清单' : ' 我的应用列表'}
                    </h2>
                    {filter !== 'all' && (
                        <button onClick={() => setFilter('all')} className="text-[10px] text-blue-600 font-bold hover:underline">返回全部</button>
                    )}
                </div>
                <Button variant="outline" className="text-xs h-8 bg-white border-gray-200" onClick={onShowAuthModal}>
                    <ShieldCheck size={14} className="text-blue-600" /> 门店使用情况
                </Button>
            </div>

            {/* Application Card List */}
            <div className="grid grid-cols-1 gap-4">
                {ownedProducts.length > 0 ? (
                    ownedProducts.map((p: any) => {
                        const isExpiring = p.purchaseInfo?.status === 'expiring';
                        return (
                            <div 
                                key={p.id} 
                                className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                                    isExpiring 
                                    ? 'border-orange-200 shadow-orange-100/50 shadow-lg ring-1 ring-orange-500/5 hover:border-orange-400' 
                                    : 'border-gray-100 hover:border-blue-400 shadow-sm hover:shadow-xl'
                                }`}
                                onClick={() => onSelectProduct(p)}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Product Basic Info */}
                                        <div className="flex gap-4 min-w-[280px]">
                                            <div className={`w-16 h-16 rounded-2xl ${p.imageColor} flex items-center justify-center text-gray-700 shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                                                {p.type === 'software' ? <Smartphone size={32} /> : <Activity size={32} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${isExpiring ? 'bg-orange-500 text-white animate-pulse' : 'bg-green-100 text-green-700'}`}>
                                                        {isExpiring ? '● 即将到期' : '● 运行中'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1"><Monitor size={12}/> {p.type === 'hardware' ? '硬件设备' : '系统软件'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expiry & Metrics */}
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-gray-400 italic">有效期至: <span className="text-gray-900 not-italic">{p.purchaseInfo?.expiryDate}</span></span>
                                                    {p.purchaseInfo?.daysLeft && p.purchaseInfo.daysLeft < 30 && (
                                                        <span className="text-red-500 font-bold">仅剩 {p.purchaseInfo.daysLeft} 天</span>
                                                    )}
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-1000 ${isExpiring ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${Math.min(100, (p.purchaseInfo?.daysLeft || 0) / 3.65)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {p.scope === 'all_stores' ? (
                                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-bold uppercase">全门店通用</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-1">
                                                            {p.purchaseInfo?.authorizedStores?.slice(0, 2).map((s: string) => (
                                                                <span key={s} className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100 truncate max-w-[80px] font-medium">{s}</span>
                                                            ))}
                                                            {p.purchaseInfo?.authorizedStores && p.purchaseInfo.authorizedStores.length > 2 && (
                                                                <span className="text-[10px] text-gray-400 font-bold">+{p.purchaseInfo.authorizedStores.length - 2}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="lg:col-span-2">
                                                {p.purchaseInfo?.usageMetrics ? (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {p.purchaseInfo.usageMetrics.map((metric: any, idx: number) => (
                                                            <div key={idx} className="bg-gray-50/50 p-3 rounded-xl border border-gray-50 group-hover:bg-white group-hover:border-blue-50 transition-colors">
                                                                <div className="flex justify-between items-center mb-1.5">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{metric.label}</span>
                                                                    <span className="text-xs font-black text-gray-900 font-mono">{metric.value}</span>
                                                                </div>
                                                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-blue-400 rounded-full transition-all duration-700" style={{ width: `${metric.percent}%` }}></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-50 rounded-2xl bg-gray-50/20">
                                                        <span className="text-[10px] text-gray-300 font-medium flex items-center gap-2"><Activity size={12}/> 系统监测中...</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Area - Smart Buttons */}
                                        <div className="flex lg:flex-col items-center justify-center gap-2.5 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 min-w-[160px]">
                                            {isExpiring && (
                                                <Button 
                                                    className="w-full lg:w-36 bg-orange-500 hover:bg-orange-600 text-white text-xs h-10 font-black shadow-lg shadow-orange-100 animate-in slide-in-from-right-2" 
                                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); onShowRenewal(); }}
                                                >
                                                    <RefreshCw size={14} /> 立即续费
                                                </Button>
                                            )}
                                            <Button 
                                                className={`w-full lg:w-36 text-xs h-10 font-bold transition-all ${isExpiring ? 'bg-gray-900 hover:bg-black text-white shadow-sm' : 'bg-gray-900 hover:bg-black text-white'}`} 
                                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); alert(`正在进入 ${p.title} 管理后台...`); }}
                                            >
                                                前往设置
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Package size={32} />
                        </div>
                        <h3 className="text-gray-900 font-bold">暂无相关应用</h3>
                        <p className="text-sm text-gray-400 mt-1">切换筛选条件或前往选购中心看看</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- APP LOGIC ---

export default function AppStoreDemo() {
    const [activeTab, setActiveTab] = useState('store'); 
    const [balance, setBalance] = useState(USER_PROFILE.balance);
    const [transactions, setTransactions] = useState<any[]>(INITIAL_TRANSACTIONS);

    // Modals
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [activeDetailTab, setActiveDetailTab] = useState('detail-intro');
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [showInvoiceConfigModal, setShowInvoiceConfigModal] = useState(false);
    const [showInvoiceApplyModal, setShowInvoiceApplyModal] = useState<string | null>(null);
    const [showBatchInvoiceModal, setShowBatchInvoiceModal] = useState(false);
    const [showConsultQRModal, setShowConsultQRModal] = useState(false);
    const [showOrderDetailModal, setShowOrderDetailModal] = useState<any>(null);
    
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);
    
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [viewingGuide, setViewingGuide] = useState<any>(null);
    const [viewingDevice, setViewingDevice] = useState<any>(null);

    const [pendingOrder, setPendingOrder] = useState<any>(null);
    const [orderDuration, setOrderDuration] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('wechat'); 
    const [invoiceInfo, setInvoiceInfo] = useState(INITIAL_INVOICE_INFO);
    const [rechargeAmount, setRechargeAmount] = useState<number | null>(null);
    const [withdrawAmount, setWithdrawAmount] = useState<number | null>(null);
    
    const PRICING: Record<string, number> = { "基础版": 2599, "专业版": 4799, "旗舰版": 9799, "大客户版": 26800 };

    const checkCompatibility = (requiredVersion: string) => {
        const userLevel = VERSION_LEVELS[USER_PROFILE.currentVersion] || 1;
        const reqLevel = VERSION_LEVELS[requiredVersion] || 1;
        return userLevel >= reqLevel;
    };

    const updateOrderDuration = (years: number) => {
        setOrderDuration(years);
        if (!pendingOrder) return;

        const unitPrice = pendingOrder.pricing.unitPrice;
        const subtotal = unitPrice * years;
        // 1年不打折, 2年9折, 3年8折
        const discountRate = years === 3 ? 0.8 : years === 2 ? 0.9 : 1;
        const discountLabel = years === 3 ? '8折' : years === 2 ? '9折' : null;
        const discount = subtotal * (1 - discountRate);
        const finalAmount = subtotal - discount;

        // 计算到期日期
        let newExpiryDate = '';
        let totalValidDays = 0;

        if (pendingOrder.type === 'renewal') {
            newExpiryDate = `${2025 + years}-12-31`;
            totalValidDays = 340 + (years * 365);
        } else if (pendingOrder.type === 'purchase') {
            const date = new Date();
            date.setFullYear(date.getFullYear() + years);
            newExpiryDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            totalValidDays = years * 365;
        } else if (pendingOrder.type === 'upgrade') {
            const diff = pendingOrder.payload.difference;
            const fullPrice = pendingOrder.payload.fullPrice;
            const extraYears = years - 1;
            
            const extraSubtotal = fullPrice * extraYears;
            const discountRate = years === 3 ? 0.8 : years === 2 ? 0.9 : 1;
            const discountLabel = years === 3 ? '8折' : years === 2 ? '9折' : null;
            
            const subtotal = diff + extraSubtotal;
            const discount = extraSubtotal * (1 - discountRate);
            const finalAmount = subtotal - discount;

            newExpiryDate = `${2025 + extraYears}-12-31`;
            
            setPendingOrder((prev: any) => ({
                ...prev,
                pricing: {
                    ...prev.pricing,
                    quantity: years,
                    duration: { ...prev.pricing.duration, value: years, label: years === 1 ? '仅升级' : `升级并续费 ${extraYears} 年` },
                    subtotal,
                    discount,
                    discountRate: discountLabel,
                    finalAmount
                },
                afterPurchase: {
                    ...prev.afterPurchase,
                    expiryDate: newExpiryDate,
                    note: years === 1 ? '升级后剩余有效期不变' : `升级并续费至 ${newExpiryDate}`
                }
            }));
            return; // 提前返回，因为升级逻辑比较特殊
        }

        setPendingOrder((prev: any) => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                quantity: years,
                duration: { ...prev.pricing.duration, value: years, label: `${years} 年` },
                subtotal,
                discount,
                discountRate: discountLabel,
                finalAmount
            },
            afterPurchase: {
                ...prev.afterPurchase,
                expiryDate: newExpiryDate,
                totalValidDays
            }
        }));
    };

    const handlePaymentConfirm = () => {
        if (!pendingOrder) return;
        const finalAmount = pendingOrder.pricing.finalAmount;
        
        // 充值订单特殊处理
        if (pendingOrder.type === 'recharge') {
            // 充值成功，增加余额
            setBalance(prev => prev + finalAmount);
            const newTransaction = {
                id: `t${Date.now()}`,
                orderNo: `REC${Date.now()}`,
                date: new Date().toLocaleString(),
                item: '账户余额充值',
                type: 'recharge',
                amount: finalAmount,
                originalPrice: finalAmount,
                discount: 0,
                status: 'success',
                deliveryStatus: 'delivered',
                invoiced: false,
                paymentMethod: getPaymentMethodLabel(paymentMethod),
                snapshot: { period: '永久有效' }
            };
            setTransactions(prev => [newTransaction, ...prev]);
            setShowPurchaseModal(false);
            setPendingOrder(null);
            
            setTimeout(() => {
                alert(`🎉 充值成功！\n\n¥${finalAmount.toFixed(2)} 已到账，当前余额 ¥${(balance + finalAmount).toFixed(2)}`);
            }, 500);
            return;
        }
        
        // 其他订单类型的处理
        if (paymentMethod === 'balance' && balance < finalAmount) return;
        if (paymentMethod === 'balance') setBalance(prev => prev - finalAmount);

        const newTransaction = {
            id: `t${Date.now()}`,
            orderNo: `${pendingOrder.type === 'purchase' ? 'ORD' : pendingOrder.type === 'renewal' ? 'REN' : 'UPG'}${Date.now()}`,
            date: new Date().toLocaleString(),
            item: pendingOrder.product.name + (pendingOrder.type === 'renewal' ? ' (续费)' : pendingOrder.type === 'upgrade' ? ' (升级)' : ''),
            type: 'expense',
            amount: finalAmount,
            originalPrice: pendingOrder.pricing.subtotal,
            discount: pendingOrder.pricing.discount,
            status: paymentMethod === 'corporate' ? 'pending' : 'success',
            deliveryStatus: paymentMethod === 'corporate' ? 'processing' : 'delivered',
            invoiced: false,
            paymentMethod: getPaymentMethodLabel(paymentMethod),
            snapshot: {
                period: `${pendingOrder.pricing.quantity} ${pendingOrder.pricing.duration.unit === 'year' ? '年' : '次'}`,
                seats: pendingOrder.type === 'upgrade' ? 20 : 1,
                expiryDate: pendingOrder.afterPurchase.expiryDate,
                features: pendingOrder.payload?.features || []
            }
        };

        setTransactions(prev => [newTransaction, ...prev]);
        setShowPurchaseModal(false);
        
        setTimeout(() => {
            let msg = '';
            if (paymentMethod === 'corporate') {
                msg = "📝 订单提交成功！\n\n款项到达专属账户后，系统将自动为您激活服务，您可随时在【已购应用】中查看。";
            } else {
                if (pendingOrder.type === 'renewal') msg = `🎉 续费成功！\n\n有效期已延长至 ${2025 + (pendingOrder.payload?.years || 1)}-12-31`;
                else if (pendingOrder.type === 'upgrade') msg = `🎉 升级成功！\n\n欢迎使用${pendingOrder.title.split(' ')[0]}，新权益已生效。`;
                else {
                    const isHardware = pendingOrder.payload?.features?.some((f: string) => f.includes('打印') || f.includes('盒子') || f.includes('检测'));
                    msg = isHardware ? `🎉 支付成功！

硬件设备将尽快发货，请留意短信通知。` : `🎉 支付成功！

请前往【已购功能】查看。`;
                }
            }
            alert(msg);
        }, 500);
        
        if (selectedProduct) setSelectedProduct(null);
        setPendingOrder(null);
    };

    const initiateAppPurchase = (product: any) => {
        setOrderDuration(3);
        const unitPrice = product.price;
        const years = 3;
        const subtotal = unitPrice * years;
        const discount = subtotal * 0.2; // 3年8折
        const finalAmount = subtotal - discount;

        const orderData = {
            type: 'purchase',
            orderTitle: '购买新应用',
            product: {
                id: product.id,
                name: product.title,
                icon: product.imageColor,
                category: product.type === 'software' ? '软件应用' : '硬件设备'
            },
            pricing: {
                unitPrice: product.price,
                quantity: years,
                duration: { value: years, unit: 'year', label: `${years} 年` },
                subtotal: subtotal,
                discount: discount,
                discountRate: '8折',
                finalAmount: finalAmount
            },
            currentStatus: null,
            afterPurchase: {
                expiryDate: `${new Date().getFullYear() + years}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
                totalValidDays: years * 365
            },
            payload: { features: product.features }
        };
        setPendingOrder(orderData);
        setPaymentMethod('wechat'); 
        setShowPurchaseModal(true);
    };

    const initiateRenewal = () => {
        setOrderDuration(3); 
        const currentPrice = PRICING[USER_PROFILE.currentVersion] || 1980;
        const years = 3;
        const subtotal = currentPrice * years;
        const discount = subtotal * 0.2; // 3年8折
        const finalAmount = subtotal - discount;
        
        const orderData = {
            type: 'renewal',
            orderTitle: '版本续费',
            product: {
                id: 'system',
                name: USER_PROFILE.currentVersion,
                icon: 'bg-blue-600',
                category: '系统版本'
            },
            pricing: {
                unitPrice: currentPrice,
                quantity: years,
                duration: { value: years, unit: 'year', label: `${years} 年` },
                subtotal: subtotal,
                discount: discount,
                discountRate: '8折',
                finalAmount: finalAmount
            },
            currentStatus: {
                expiryDate: '2025-12-31',
                remainingDays: 340
            },
            afterPurchase: {
                expiryDate: `${2025 + years}-12-31`,
                totalValidDays: 340 + (years * 365)
            },
            payload: { years: years }
        };
        setPendingOrder(orderData);
        setPaymentMethod('wechat'); 
        setShowPurchaseModal(true);
    };

    const initiateUpgrade = (targetVersion: string, price: number) => {
        setOrderDuration(3); 
        const targetFullPrice = PRICING[targetVersion] || 0;
        const years = 3;
        const extraYears = years - 1;
        const extraSubtotal = targetFullPrice * extraYears;
        const subtotal = price + extraSubtotal;
        const discount = extraSubtotal * 0.2; // 续费部分8折
        const finalAmount = subtotal - discount;

        const orderData = {
            type: 'upgrade',
            orderTitle: '版本升级',
            product: {
                id: 'system',
                name: targetVersion,
                icon: 'bg-amber-500',
                category: '系统版本'
            },
            pricing: {
                unitPrice: price, 
                quantity: years,
                duration: { value: years, unit: 'year', label: `升级并续费 ${extraYears} 年` },
                subtotal: subtotal,
                discount: discount,
                discountRate: '8折',
                finalAmount: finalAmount
            },
            currentStatus: {
                version: USER_PROFILE.currentVersion,
                expiryDate: '2025-12-31'
            },
            afterPurchase: {
                version: targetVersion,
                expiryDate: `${2025 + extraYears}-12-31`,
                note: `升级并续费至 ${2025 + extraYears}-12-31`
            },
            payload: { 
                target: targetVersion, 
                difference: price, 
                fullPrice: targetFullPrice 
            }
        };
        setPendingOrder(orderData);
        setPaymentMethod('wechat'); 
        setShowUpgradeModal(false); 
        setShowPurchaseModal(true);
    };

    const handleWithdraw = () => {
        if (!withdrawAmount || withdrawAmount > balance) return;
        setBalance(prev => prev - withdrawAmount);
        setTransactions(prev => [{ id: `t${Date.now()}`, orderNo: `WTH${Date.now()}`, date: new Date().toLocaleString(), item: '余额提现', type: 'withdrawal', amount: withdrawAmount, status: 'pending', deliveryStatus: 'none', invoiced: false, paymentMethod: '原路退回/对公账户' }, ...prev]);
        setShowWithdrawModal(false); 
        setWithdrawAmount(null);
        // 显示提现成功对话框
        setShowWithdrawSuccessModal(true);
    };

    const getPaymentMethodLabel = (method: string) => {
        switch(method) { case 'wechat': return '微信支付'; case 'alipay': return '支付宝'; case 'corporate': return '对公转账'; case 'balance': return '账户余额'; default: return '未知'; }
    };

    const handleRecharge = () => {
        if (!rechargeAmount) return;
        // 充值走订单流程
        const rechargeOrder = {
            type: 'recharge' as const,
            orderTitle: '账户余额充值',
            product: {
                id: 'balance_recharge',
                name: '账户余额',
                category: '充值服务',
                icon: 'bg-green-500'
            },
            pricing: {
                unitPrice: rechargeAmount,
                quantity: 1,
                subtotal: rechargeAmount,
                discount: 0,
                discountRate: null,
                finalAmount: rechargeAmount
            },
            payload: { amount: rechargeAmount }
        };
        setPendingOrder(rechargeOrder);
        setShowRechargeModal(false);
        setRechargeAmount(null);
        setShowPurchaseModal(true);
    };

    const handleApplyInvoice = (transactionId: string) => {
        setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, invoiced: true } : t));
        setShowInvoiceApplyModal(null); setShowOrderDetailModal(null); alert("发票申请已提交。");
    };

    // --- Views ---







    return (
        <div className="bg-slate-50 text-gray-800 font-sans min-h-screen">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Layout size={18} /></div>
                        应用中心
                    </div>
                    <nav className="hidden md:flex h-full">
                        <button type="button" onClick={() => setActiveTab('store')} className={`px-4 h-full border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'store' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}><ShoppingBag size={16} /> 选购中心</button>
                        <button type="button" onClick={() => setActiveTab('orders')} className={`px-4 h-full border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'orders' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}><Package size={16} /> 我的应用</button>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div 
                            className={`flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-lg transition-all ${activeTab === 'wallet' ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50 border border-transparent'}`} 
                            onClick={() => setActiveTab('wallet')}
                            title="点击进入财务中心"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeTab === 'wallet' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                                <Wallet size={16} />
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">账户余额</div>
                                <div className={`text-sm font-black font-mono leading-none ${activeTab === 'wallet' ? 'text-blue-600' : 'text-gray-900'}`}>¥{balance.toFixed(2)}</div>
                            </div>
                            <ChevronRight size={14} className={`text-gray-300 transition-transform ${activeTab === 'wallet' ? 'rotate-90 text-blue-400' : ''}`} />
                        </div>
                    </div>
                </div>
            </div>

            <main className="p-6">
                <div className="max-w-[1200px] mx-auto">
                {activeTab === 'store' && <StoreView 
                    products={PRODUCTS} 
                    userProfile={USER_PROFILE} 
                    onSelectProduct={setSelectedProduct} 
                    onShowRenewal={initiateRenewal} 
                    onShowUpgrade={() => setShowUpgradeModal(true)} 
                />}
                {activeTab === 'wallet' && <HistoryOrderView 
                    balance={balance} 
                    transactions={transactions} 
                    onShowRecharge={() => setShowRechargeModal(true)} 
                    onShowWithdraw={() => setShowWithdrawModal(true)} 
                    onShowInvoiceConfig={() => setShowInvoiceConfigModal(true)} 
                    onShowOrderDetail={setShowOrderDetailModal}
                    onShowBatchInvoice={() => setShowBatchInvoiceModal(true)}
                />}
                {activeTab === 'orders' && <OrdersView 
                    products={PRODUCTS} 
                    onSelectProduct={setSelectedProduct} 
                    onShowAuthModal={() => setShowAuthModal(true)} 
                    onShowRenewal={initiateRenewal}
                />}
                </div>
            </main>

            {/* --- MODALS --- */}
            <Modal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} title="" maxWidth="max-w-4xl">
                <div className="flex flex-col md:flex-row min-h-[500px] max-h-[90vh] bg-white overflow-hidden">
                    {/* 左侧：订单明细 */}
                    <div className="w-full md:w-2/3 bg-white border-r border-gray-100 p-8 overflow-y-auto custom-scrollbar">
                        {pendingOrder && (
                            <div className="space-y-8">
                                {/* 订单标题 */}
                                <div className="border-b border-gray-100 pb-4">
                                    <h3 className="text-xl font-black text-gray-900">{pendingOrder.orderTitle}</h3>
                                    <p className="text-xs text-gray-400 mt-1">请仔细核对订单信息后进行支付</p>
                                </div>

                                {/* 产品信息 */}
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl ${pendingOrder.product.icon} flex items-center justify-center text-white font-black shadow-inner`}>
                                            {pendingOrder.product.icon.includes('blue') ? <Crown size={24}/> : <Zap size={24}/>}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{pendingOrder.product.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] bg-white text-gray-500 px-2 py-0.5 rounded border border-gray-200 inline-block">{pendingOrder.product.category}</span>
                                                <span className="text-xs font-bold text-blue-600">¥ {pendingOrder.pricing.unitPrice.toFixed(2)}/年</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 续费年数选择 - 购买、续费、升级均显示 */}
                                {(pendingOrder.type === 'purchase' || pendingOrder.type === 'renewal' || pendingOrder.type === 'upgrade') && (
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">选择续费年数</h5>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[3, 2, 1].map(year => {
                                                const isActive = orderDuration === year;
                                                const discount = year === 3 ? '限时 8 折' : year === 2 ? '限时折扣' : null;
                                                const isMostPopular = year === 3;
                                                
                                                return (
                                                    <div 
                                                        key={year}
                                                        onClick={() => updateOrderDuration(year)}
                                                        className={`cursor-pointer relative group transition-all duration-300 rounded-2xl p-4 border-2 flex flex-col items-center justify-center gap-1 ${
                                                            isActive 
                                                            ? 'border-orange-400 bg-orange-50 shadow-md transform scale-[1.02]' 
                                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                                        }`}
                                                    >
                                                        {isMostPopular && (
                                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-[9px] font-bold text-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">最划算</div>
                                                        )}
                                                        <div className={`text-xl font-black ${isActive ? 'text-orange-600' : 'text-gray-900'}`}>{year} 年</div>
                                                        {discount && (
                                                            <div className={`text-[10px] font-bold ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>{discount}</div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-3 italic">* 增购账号暂不享受折扣优惠</p>
                                    </div>
                                )}

                                {/* 定价明细 */}
                                <div>
                                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">定价明细</h5>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">{pendingOrder.type === 'upgrade' ? '升级/续费金额' : '续费金额'}</span>
                                            <div className="text-right">
                                                <div className="font-mono text-gray-900 font-bold">¥ {pendingOrder.pricing.subtotal.toFixed(2)}</div>
                                                <div className="text-[10px] text-gray-400">
                                                    {pendingOrder.type === 'upgrade' ? (
                                                        <>¥ {pendingOrder.payload.difference.toFixed(2)} (补差) {orderDuration > 1 && `+ ¥ ${pendingOrder.payload.fullPrice.toFixed(2)} (年费) × ${orderDuration - 1} (续费年数)`}</>
                                                    ) : (
                                                        <>¥ {pendingOrder.pricing.unitPrice.toFixed(2)} (年费) × {pendingOrder.pricing.quantity} (年数)</>
                                                    )}
                                                    {pendingOrder.pricing.discountRate && ` × ${pendingOrder.pricing.discountRate}(折扣)`}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {pendingOrder.type === 'renewal' && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">增购账号金额</span>
                                                <div className="text-right">
                                                    <div className="font-mono text-gray-900 font-bold">¥ 0.00</div>
                                                    <div className="text-[10px] text-gray-400">使用过程中，额外购买账号的续费金额</div>
                                                </div>
                                            </div>
                                        )}

                                        {pendingOrder.pricing.discount > 0 && (
                                            <div className="flex justify-between items-center text-sm bg-orange-50/50 p-2 rounded-lg border border-orange-100/50">
                                                <span className="text-orange-600 font-bold flex items-center gap-1">
                                                    <Zap size={12} /> 限时优惠
                                                </span>
                                                <span className="font-mono text-orange-600 font-bold">- ¥ {pendingOrder.pricing.discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                            <span className="font-black text-gray-900 text-base">应付金额</span>
                                            <div className="text-right">
                                                <span className="text-3xl font-black text-orange-600 font-mono italic">¥ {pendingOrder.pricing.finalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 状态对比 */}
                                {pendingOrder.currentStatus && (
                                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">服务期限对比</h5>
                                        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
                                            {/* 当前 */}
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
                                                <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-gray-400 border border-gray-100 rounded">当前状态</div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-black text-gray-900">
                                                        {pendingOrder.currentStatus.version || USER_PROFILE.currentVersion}
                                                    </span>
                                                    <span className="text-xs text-gray-500">到期: {pendingOrder.currentStatus.expiryDate}</span>
                                                    {pendingOrder.currentStatus.remainingDays && (
                                                        <span className="text-[10px] text-gray-400">剩余 {pendingOrder.currentStatus.remainingDays} 天</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>

                                            {/* 购买后 */}
                                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 relative ring-2 ring-blue-500/10">
                                                <div className="absolute -top-3 left-4 bg-blue-600 px-2 text-[10px] font-bold text-white rounded shadow-sm">购买后</div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-black text-blue-700">
                                                        {pendingOrder.afterPurchase.version || pendingOrder.product.name}
                                                    </span>
                                                    <span className="text-xs text-blue-600 font-bold">到期: {pendingOrder.afterPurchase.expiryDate}</span>
                                                    {pendingOrder.afterPurchase.totalValidDays && (
                                                        <span className="text-[10px] text-blue-400 font-medium">共 {pendingOrder.afterPurchase.totalValidDays} 天有效</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {pendingOrder.afterPurchase.note && (
                                            <div className="flex items-start gap-2 mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                <Info size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">{pendingOrder.afterPurchase.note}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 右侧：支付方式 */}
                    <div className="w-full md:w-1/3 bg-gray-50 p-8 flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">选择支付方式</div>
                        <div className="space-y-3 mb-8">
                            <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPaymentMethod('wechat'); }} 
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${paymentMethod === 'wechat' ? 'bg-white shadow-sm ring-2 ring-green-500' : 'bg-white/50 hover:bg-white text-gray-600'}`}
                            >
                                <Smartphone size={20} className="text-[#07C160]" />
                                <span className={`font-medium ${paymentMethod === 'wechat' ? 'text-gray-900' : ''}`}>微信支付</span>
                            </button>
                            <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPaymentMethod('alipay'); }} 
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${paymentMethod === 'alipay' ? 'bg-white shadow-sm ring-2 ring-blue-500' : 'bg-white/50 hover:bg-white text-gray-600'}`}
                            >
                                <QrCode size={20} className="text-[#1677FF]" />
                                <span className={`font-medium ${paymentMethod === 'alipay' ? 'text-gray-900' : ''}`}>支付宝</span>
                            </button>
                            <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPaymentMethod('corporate'); }} 
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${paymentMethod === 'corporate' ? 'bg-white shadow-sm ring-2 ring-slate-500' : 'bg-white/50 hover:bg-white text-gray-600'}`}
                            >
                                <Building2 size={20} className="text-slate-600" />
                                <span className={`font-medium ${paymentMethod === 'corporate' ? 'text-gray-900' : ''}`}>对公转账</span>
                            </button>
                            <div className="my-2 border-t border-gray-200"></div>
                            <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPaymentMethod('balance'); }} 
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${paymentMethod === 'balance' ? 'bg-white shadow-sm ring-2 ring-orange-500' : 'bg-white/50 hover:bg-white text-gray-600'}`}
                            >
                                <Wallet size={20} className="text-orange-500" />
                                <div className="flex-1">
                                    <div className={`font-medium ${paymentMethod === 'balance' ? 'text-gray-900' : ''}`}>账户余额</div>
                                    <div className="text-xs text-gray-400">可用: ¥{balance.toFixed(2)}</div>
                                </div>
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                        {(paymentMethod === 'wechat' || paymentMethod === 'alipay') && (
                            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className={`w-48 h-48 mx-auto border-2 rounded-xl flex items-center justify-center mb-4 ${paymentMethod === 'wechat' ? 'border-green-100 bg-green-50' : 'border-blue-100 bg-blue-50'}`}><QrCode size={80} className={`opacity-20 ${paymentMethod === 'wechat' ? 'text-green-600' : 'text-blue-600'}`} /></div>
                                <p className="text-gray-500 text-sm mb-6">请使用{paymentMethod === 'wechat' ? '微信' : '支付宝'}扫一扫</p>
                                <Button className={`w-48 ${paymentMethod === 'wechat' ? 'bg-[#07C160] hover:bg-[#06ad56]' : 'bg-[#1677FF] hover:bg-[#1363d6]'}`} onClick={handlePaymentConfirm}>我已完成支付</Button>
                            </div>
                        )}
                        {paymentMethod === 'corporate' && (
                            <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">收款单位</div>
                                        <div className="text-sm font-bold text-gray-900 select-all">成都字节流科技有限公司</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">银行账户</div>
                                        <div className="text-lg font-black text-blue-600 font-mono select-all tracking-tight break-all">1289142611106015183710464</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">开户银行</div>
                                            <div className="text-xs font-bold text-gray-900">招商银行成都新光路支行</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">开户行号</div>
                                            <div className="text-xs font-bold text-gray-900 font-mono">308651020040</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                                    <div className="flex gap-3">
                                        <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-blue-700 leading-relaxed">
                                            该账户为您的专属汇款通道，系统将在收到款项后<span className="font-bold underline mx-1">自动激活</span>服务，无需上传凭证。
                                        </p>
                                    </div>
                                </div>

                                <Button variant="corporate" className="w-full h-12 text-base shadow-lg shadow-slate-200" onClick={handlePaymentConfirm}>
                                    我已完成转账
                                </Button>
                            </div>
                        )}
                        {paymentMethod === 'balance' && (
                            <div className="w-full max-w-sm text-center animate-in fade-in zoom-in-95 duration-300">
                                {balance >= (pendingOrder?.pricing.finalAmount || 0) ? (
                                    <>
                                        <div className="bg-green-50 text-green-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">余额充足</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
                                            <div className="flex justify-between mb-2"><span className="text-gray-500">当前余额</span><span className="text-gray-900">¥ {balance.toFixed(2)}</span></div>
                                            <div className="flex justify-between mb-2"><span className="text-gray-500">扣除金额</span><span className="text-red-600 font-bold">- ¥ {pendingOrder?.pricing.finalAmount.toFixed(2)}</span></div>
                                            <div className="border-t border-gray-200 pt-2 flex justify-between"><span className="text-gray-500">支付后剩余</span><span className="text-green-600 font-bold">¥ {(balance - (pendingOrder?.pricing.finalAmount || 0)).toFixed(2)}</span></div>
                                        </div>
                                        <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handlePaymentConfirm}>确认扣款支付</Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-red-50 text-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><X size={32} /></div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">余额不足</h3>
                                        <div className="flex gap-3 mt-6"><Button variant="secondary" className="flex-1" onClick={() => setShowPurchaseModal(false)}>取消</Button><Button className="flex-1" onClick={() => { setShowPurchaseModal(false); setShowRechargeModal(true); }}>去充值</Button></div>
                                    </>
                                )}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Upgrade Modal */}
            <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="" maxWidth="max-w-6xl">
                <div className="flex flex-col bg-white relative">
                    {/* Header: Fixed Top */}
                    <div className="flex-shrink-0 p-10 border-b border-gray-100 bg-white z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 mb-2 font-display">版本升级中心</h2>
                                <p className="text-sm text-gray-500">当前版本：<span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-1">{USER_PROFILE.currentVersion}</span></p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">升级权益</span>
                                <span className="text-sm text-gray-600 font-medium italic">补差价升级，即刻生效</span>
                            </div>
                        </div>
                    </div>

                    {/* Body: No scroll unless necessary */}
                    <div className="p-10 pb-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Pro */}
                            <div className="group border border-gray-200 rounded-3xl p-8 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-300 relative bg-white flex flex-col">
                                <div className="mb-6">
                                    <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">推荐大中型诊所</div>
                                    <div className="text-2xl font-black text-gray-900 mb-4">专业版</div>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-black text-gray-900">¥ 4799</span>
                                        <span className="text-sm text-gray-400">/年</span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6">提供更深度的经营管理与多账号协作能力，满足连锁机构运营需求。</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["多机构管理", "深度财务报表", "会员营销体系", "5个管理员账号"].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle2 size={16} className="text-green-500" /> {f}
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full h-12 rounded-xl bg-gray-900 hover:bg-black text-white font-bold" onClick={() => initiateUpgrade("专业版", 2200)}>
                                    补差价升级 (¥2200)
                                </Button>
                            </div>

                            {/* Flagship */}
                            <div className="group border-2 border-amber-400 rounded-3xl p-8 shadow-xl shadow-amber-50 relative transform md:scale-105 bg-white z-20 flex flex-col">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
                                <div className="mb-6">
                                    <div className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">全方位解决方案</div>
                                    <div className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">旗舰版 <Crown size={20} className="text-amber-500 fill-current"/></div>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-black text-gray-900">¥ 9799</span>
                                        <span className="text-sm text-gray-400">/年</span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6">含 LIS 系统与开放平台接入，实现全流程数字化闭环管理。</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["含 LIS/PACS 系统", "OpenAPI 开放接口", "智能审方体系", "无限账号数量"].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle2 size={16} className="text-amber-500" /> {f}
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none text-white font-bold shadow-lg shadow-amber-100" onClick={() => initiateUpgrade("旗舰版", 7200)}>
                                    补差价升级 (¥7200)
                                </Button>
                            </div>

                            {/* Enterprise */}
                            <div className="group border border-gray-100 rounded-3xl p-8 hover:border-gray-300 transition-all duration-300 relative bg-gray-50 flex flex-col">
                                <div className="mb-6">
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">深度定制需求</div>
                                    <div className="text-2xl font-black text-gray-900 mb-4">大客户版</div>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-black text-gray-900">¥ 26800</span>
                                        <span className="text-sm text-gray-400">/年</span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6">针对有深度业务定制需求的集团客户，提供私有化部署与专属顾问。</p>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {["私有化部署支持", "专属客户经理", "深度业务定制", "SLA 服务保障"].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckCircle2 size={16} className="text-gray-400" /> {f}
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full h-12 rounded-xl border-gray-300 text-gray-600 font-bold hover:bg-white" onClick={() => initiateUpgrade("大客户版", 24201)}>
                                    补差价升级 (¥24201)
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Product Detail Modal (Modern Split Layout) */}
            {selectedProduct && !showPurchaseModal && (
                <Modal 
                    isOpen={!!selectedProduct} 
                    onClose={() => { setSelectedProduct(null); setIsHeaderScrolled(false); setActiveDetailTab('detail-intro'); }} 
                    title="" 
                    maxWidth="max-w-5xl"
                >
                    <div className="flex flex-col h-[85vh] bg-white relative">
                        {/* Header: Product Info (Sticky with dynamic layout) */}
                        <div className={`z-20 bg-white border-b border-gray-100 flex-shrink-0 transition-all duration-300 will-change-transform ${isHeaderScrolled ? 'shadow-md' : ''}`}>
                            <div className={`pl-8 pr-16 transition-all duration-300 ${isHeaderScrolled ? 'py-3' : 'py-8'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`rounded-xl transition-all duration-300 ${selectedProduct.imageColor} flex items-center justify-center shadow-inner ${isHeaderScrolled ? 'w-10 h-10' : 'w-20 h-20'}`}>
                                            <ImageIcon size={isHeaderScrolled ? 20 : 36} className="text-gray-700"/>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="flex items-center gap-3">
                                                <h2 className={`font-bold text-gray-900 transition-all duration-300 ${isHeaderScrolled ? 'text-lg' : 'text-2xl'}`}>
                                                    {selectedProduct.title}
                                                </h2>
                                                {selectedProduct.trialDays && (
                                                    <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-100 whitespace-nowrap">
                                                        {selectedProduct.trialDays}天免费体验
                                                    </span>
                                                )}
                                            </div>
                                            {/* Subtitle - Hidden when scrolled */}
                                            <p className={`text-gray-500 leading-relaxed text-sm mt-1 overflow-hidden transition-all duration-300 ${isHeaderScrolled ? 'max-h-0 opacity-0 mt-0' : 'max-h-20 opacity-100 mt-2 max-w-xl'}`}>
                                                {selectedProduct.description}
                                            </p>

                                            {/* Actions Container - Dynamic Alignment */}
                                            {!isHeaderScrolled && (
                                                <div className="flex items-center gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <button 
                                                        onClick={() => setShowConsultQRModal(true)}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:border-blue-300 hover:bg-white transition-all group"
                                                    >
                                                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white shadow-sm bg-blue-50">
                                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Consultant" className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">在线咨询</span>
                                                    </button>
                                                    {selectedProduct.isOwned ? (
                                                        <Button onClick={() => alert(`正在跳转至 【${selectedProduct.title}】 配置后台...`)} className="bg-gray-900 hover:bg-black text-white shadow-sm h-9 px-6 text-sm">前往设置</Button>
                                                    ) : !checkCompatibility(selectedProduct.minVersionRequired) ? (
                                                        <Button onClick={() => { setSelectedProduct(null); setShowUpgradeModal(true); }} className="bg-gradient-to-r from-amber-500 to-orange-500 border-none shadow-orange-100 h-9 px-5 text-sm text-white font-bold">升级版本开通</Button>
                                                    ) : (
                                                        <Button onClick={() => initiateAppPurchase(selectedProduct)} className="px-6 shadow-blue-100 h-9 text-sm">立即开通</Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Side: Price (Fixed Position) / Compact Actions (When Scrolled) */}
                                    <div className="flex items-center gap-6">
                                        {isHeaderScrolled && (
                                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <button 
                                                    onClick={() => setShowConsultQRModal(true)}
                                                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm hover:border-blue-400 transition-all"
                                                    title="在线咨询"
                                                >
                                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Consultant" />
                                                </button>
                                                {selectedProduct.isOwned ? (
                                                    <Button onClick={() => alert(`正在跳转至 【${selectedProduct.title}】 配置后台...`)} className="bg-gray-900 hover:bg-black text-white h-8 px-4 text-xs">前往设置</Button>
                                                ) : !checkCompatibility(selectedProduct.minVersionRequired) ? (
                                                    <Button onClick={() => { setSelectedProduct(null); setShowUpgradeModal(true); }} className="bg-gradient-to-r from-amber-500 to-orange-500 border-none h-8 px-4 text-xs text-white font-bold">升级版本</Button> 
                                                ) : (
                                                    <Button onClick={() => initiateAppPurchase(selectedProduct)} className="h-8 px-4 text-xs shadow-blue-100">立即开通</Button>
                                                )}
                                            </div>
                                        )}
                                        <div className={`text-right ${isHeaderScrolled ? 'pl-6 border-l border-gray-100' : ''}`}>
                                            {!isHeaderScrolled && <div className="text-[10px] text-gray-400 font-medium mb-0.5">版本价格</div>}
                                            <div className="flex items-baseline gap-0.5">
                                                <span className={`${isHeaderScrolled ? 'text-lg' : 'text-3xl'} font-black text-blue-600 transition-all duration-300`}>
                                                    {selectedProduct.price > 0 ? `¥${selectedProduct.price}` : '免费'}
                                                </span>
                                                {selectedProduct.price > 0 && <span className="text-[10px] text-gray-400">/年</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Navigation Tabs (Sticky) */}
                            <div className="px-8 border-t border-gray-50 bg-white">
                                <div className="flex gap-2">
                                    {['详情', '体验入口', '用户评价'].map((tab, i) => {
                                        const sectionId = ['detail-intro', 'detail-experience', 'detail-reviews'][i];
                                        const isActive = activeDetailTab === sectionId;
                                        return (
                                            <button 
                                                key={tab}
                                                onClick={() => {
                                                    const element = document.getElementById(sectionId);
                                                    const container = element?.parentElement?.parentElement;
                                                    if (container && element) {
                                                        container.scrollTo({
                                                            top: element.offsetTop - 140, // Offset for sticky header
                                                            behavior: 'smooth'
                                                        });
                                                    }
                                                }}
                                                className={`px-5 py-3 text-sm font-bold transition-all border-b-2 relative ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                            >
                                                {tab === '用户评价' ? `用户评价 (${selectedProduct.reviews.length})` : tab}
                                                {isActive && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 animate-in fade-in duration-300"></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Detail Body */}
                        <div 
                            className="flex-1 overflow-y-auto pb-20 scroll-smooth overscroll-contain"
                            onScroll={(e) => {
                                const scrollTop = e.currentTarget.scrollTop;
                                
                                // Efficient header scroll state toggle
                                if (scrollTop > 60 && !isHeaderScrolled) {
                                    setIsHeaderScrolled(true);
                                } else if (scrollTop <= 60 && isHeaderScrolled) {
                                    setIsHeaderScrolled(false);
                                }

                                // Optimize active section detection - use simple offset checking
                                const sections = ['detail-intro', 'detail-experience', 'detail-reviews'];
                                for (const id of sections) {
                                    const el = document.getElementById(id);
                                    if (el) {
                                        const offsetTop = el.offsetTop;
                                        if (scrollTop >= offsetTop - 200 && scrollTop < offsetTop + el.offsetHeight - 200) {
                                            if (activeDetailTab !== id) setActiveDetailTab(id);
                                            break;
                                        }
                                    }
                                }
                            }}
                        >
                            <div className="p-8 space-y-16">
                                {/* 1. 详细介绍 (Markdown) */}
                                <section id="detail-intro">
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="font-black text-gray-900 text-xl flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><FileText size={18}/></div>
                                            产品详细介绍
                                        </h4>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-1 bg-gradient-to-b from-gray-50/50 to-white">
                                        <div className="p-8">
                                            <SimpleMarkdown content={selectedProduct.markdownContent} />
                                            
                                            {/* 自动化功能清单模块 */}
                                            {selectedProduct.features && selectedProduct.features.length > 0 && (
                                                <div className="mt-12 pt-10 border-t border-gray-100">
                                                    <h2 className="text-gray-900 font-black text-xl mb-6 border-l-4 border-blue-500 pl-4 leading-tight">核心功能清单</h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                                        {selectedProduct.features.map((feature: string, idx: number) => (
                                                            <div key={idx} className="flex items-start gap-3 group">
                                                                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                                    <CheckCircle2 size={12}/>
                                                                </div>
                                                                <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* 2. 体验入口 (Experience Entrance) */}
                                <section id="detail-experience">
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="font-black text-gray-900 text-xl flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><Smartphone size={18}/></div>
                                            体验入口
                                        </h4>
                                    </div>
                                    <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                            {selectedProduct.type === 'software' || selectedProduct.type === 'service' ? (
                                                <>
                                                    <div className="flex-1">
                                                        <h5 className="text-2xl font-bold mb-4">扫码立即体验</h5>
                                                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                            使用微信扫描右侧二维码，即可进入【{selectedProduct.title}】演示环境。
                                                            无需安装，全真实数据模拟，深度还原诊所实际使用场景。
                                                        </p>
                                                        <ul className="space-y-3">
                                                            <li className="flex items-center gap-2 text-xs text-slate-300">
                                                                <CheckCircle2 size={14} className="text-green-400"/>
                                                                真实业务流程演示
                                                            </li>
                                                            <li className="flex items-center gap-2 text-xs text-slate-300">
                                                                <CheckCircle2 size={14} className="text-green-400"/>
                                                                手机端/PC端同步交互
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="bg-white p-6 rounded-2xl shadow-inner">
                                                        <div className="w-40 h-40 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-2">
                                                            <QrCode size={80} className="text-slate-900"/>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Demo QR Code</span>
                                                        </div>
                                                        <div className="text-center mt-4">
                                                            <span className="text-[10px] text-slate-400">微信扫码体验</span>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex-1">
                                                        <h5 className="text-2xl font-bold mb-4">设备操作演示</h5>
                                                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                                            观看下方演示视频，深入了解 【{selectedProduct.title}】 的硬件结构与实际应用。
                                                            我们为您展示了从设备开箱到完成第一次检测的全过程。
                                                        </p>
                                                        <Button className="bg-white text-slate-900 hover:bg-slate-100 border-none font-black h-12 px-8">
                                                            播放演示视频
                                                        </Button>
                                                    </div>
                                                    <div className="w-full md:w-80 aspect-video bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center group cursor-pointer overflow-hidden relative">
                                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500"></div>
                                                        <div className="w-16 h-16 rounded-full bg-white/40 flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative z-10 border border-white/30">
                                                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </section>
                                
                                {/* 3. 用户评价 */}
                                <section id="detail-reviews">
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="font-black text-gray-900 text-xl flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><MessageSquare size={18}/></div>
                                            真实用户评价
                                        </h4>
                                    </div>
                                    {selectedProduct.reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {selectedProduct.reviews.map((review: any) => (
                                                <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-5">
                                                        <div className="flex gap-4">
                                                            <div className={`w-12 h-12 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-black shadow-inner`}>{review.user.charAt(0)}</div>
                                                            <div>
                                                                <div className="font-bold text-gray-900">{review.user}</div>
                                                                <div className="text-xs text-gray-400 mt-1">{review.role} · {review.date}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-0.5 text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-200"}/>)}</div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-50">{review.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
                                            <div className="text-gray-300 mb-4">
                                                <Smile size={56} className="mx-auto opacity-20" />
                                            </div>
                                            <div className="text-lg font-bold text-gray-400">暂无用户评价</div>
                                            <p className="text-sm text-gray-300 mt-1">该应用已稳定运行，期待您的真实反馈</p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}



            {/* Order Detail Modal */}
            <Modal isOpen={!!showOrderDetailModal} onClose={() => setShowOrderDetailModal(null)} title="订单详情" maxWidth="max-w-2xl">
                {showOrderDetailModal && (
                    <div className="bg-white">
                        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${showOrderDetailModal.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {showOrderDetailModal.status === 'success' ? <CheckCircle2 size={24} /> : <Clock size={24}/>}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{showOrderDetailModal.status === 'success' ? '交易成功' : '待确认'}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{showOrderDetailModal.status === 'success' ? '服务已自动开通。' : '正在等待汇款确认。'}</p>
                                </div>
                            </div>
                            <div className="text-right"><div className="text-xs text-gray-400 mb-1">实付金额</div><div className="text-2xl font-bold text-gray-900">¥ {Math.abs(showOrderDetailModal.amount).toFixed(2)}</div></div>
                        </div>
                        <div className="p-8 space-y-8">
                            <section>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 items-start">
                                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0"><Zap size={24}/></div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{showOrderDetailModal.item}</h3>
                                        <p className="text-sm text-gray-500 mt-1">支付方式：{showOrderDetailModal.paymentMethod}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div className="text-sm text-gray-500">遇到问题？联系客服 400-888-9999</div>
                            <div className="flex gap-3">
                                {!showOrderDetailModal.invoiced && showOrderDetailModal.status === 'success' && showOrderDetailModal.type !== 'withdrawal' && <Button variant="outline" onClick={() => setShowInvoiceApplyModal(showOrderDetailModal.id)}><Receipt size={16}/> 索取发票</Button>}
                                <Button onClick={() => setShowOrderDetailModal(null)}>关闭</Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Auth Overview Modal */}
            <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title="各门店应用使用情况" maxWidth="max-w-3xl">
                <div className="p-6">
                    <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2">
                        <Info size={16} className="mt-0.5 text-blue-500"/>
                        <div>此处展示所有已购应用在各门店的分配情况。<br/>全连锁应用默认对所有门店开启；单店授权应用需手动分配额度。</div>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500"><tr><th className="p-3 rounded-l-lg">应用名称</th><th className="p-3">类型</th><th className="p-3">中心医院</th><th className="p-3">城西分院</th><th className="p-3 rounded-r-lg">高新区分院</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {PRODUCTS.filter(p => p.isOwned).map(p => (
                                <tr key={p.id}>
                                    <td className="p-3 font-medium text-gray-900">{p.title}</td>
                                    <td className="p-3">{p.scope === 'all_stores' ? <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded">全连锁</span> : <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded">单店</span>}</td>
                                    <td className="p-3">{p.scope === 'all_stores' || p.purchaseInfo?.authorizedStores?.includes('中心医院 - 门诊部') ? <CheckCircle2 size={16} className="text-green-500"/> : <span className="text-gray-300">-</span>}</td>
                                    <td className="p-3">{p.scope === 'all_stores' || p.purchaseInfo?.authorizedStores?.includes('城西分院') ? <CheckCircle2 size={16} className="text-green-500"/> : <span className="text-gray-300">-</span>}</td>
                                    <td className="p-3">{p.scope === 'all_stores' ? <CheckCircle2 size={16} className="text-green-500"/> : <span className="text-gray-300">-</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6 flex justify-end"><Button onClick={() => setShowAuthModal(false)}>关闭</Button></div>
                </div>
            </Modal>

            {/* Guide Modal */}
            <Modal isOpen={!!viewingGuide} onClose={() => setViewingGuide(null)} title={`${viewingGuide?.title} - 快速上手`} maxWidth="max-w-2xl">
                    <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`w-16 h-16 rounded-xl ${viewingGuide?.imageColor} flex items-center justify-center`}><BookOpen size={32} className="text-gray-700"/></div>
                        <div><h3 className="font-bold text-xl text-gray-900">3 步启用指南</h3><p className="text-gray-500 text-sm">跟随指引，快速完成配置</p></div>
                    </div>
                    <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                        {(viewingGuide?.guideSteps || [{ title: "进入配置后台", desc: "点击下方的“前往设置”按钮，进入应用管理界面。" }, { title: "开启功能开关", desc: "在设置页中找到【启用状态】，切换为开启。" }, { title: "分配权限", desc: "在【权限管理】中勾选可以使用该功能的医生或护士。" }]).map((step: any, i: number) => (
                            <div key={i} className="relative pl-12">
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-blue-500 text-blue-600 font-bold flex items-center justify-center text-sm z-10">{i + 1}</div>
                                <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3"><Button variant="secondary" onClick={() => setViewingGuide(null)}>稍后再看</Button><Button onClick={() => { setViewingGuide(null); alert(`正在前往 ${viewingGuide?.title} 设置页面...`); }}>立即前往设置</Button></div>
                    </div>
            </Modal>

            {/* Device Status Modal */}
            <Modal isOpen={!!viewingDevice} onClose={() => setViewingDevice(null)} title="设备状态监控" maxWidth="max-w-md">
                <div className="p-6">
                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4 mb-6"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Wifi size={24}/></div><div><div className="font-bold text-green-800 text-lg">设备在线</div><div className="text-green-600 text-xs">网络连接正常，信号强</div></div></div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-gray-500 text-sm">设备名称</span><span className="font-medium text-gray-900">{viewingDevice?.title}</span></div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-gray-500 text-sm">序列号 (SN)</span><span className="font-mono text-gray-900">ABC-20231024-001</span></div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-gray-500 text-sm">固件版本</span><span className="font-mono text-gray-900">v2.1.0 (最新)</span></div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50"><span className="text-gray-500 text-sm">最后心跳</span><span className="text-gray-900">刚刚</span></div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-3"><Button variant="secondary" className="w-full text-red-600 hover:bg-red-50 border-red-100"><Power size={16}/> 重启设备</Button><Button variant="secondary" className="w-full"><RefreshCw size={16}/> 刷新状态</Button></div>
                </div>
            </Modal>

            {/* Withdraw Modal */}
            <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} title="余额提现" maxWidth="max-w-md">
                <div className="p-6">
                    <div className="bg-orange-50 p-4 rounded-lg mb-6 flex gap-3 text-orange-800 text-sm"><AlertCircle size={18} className="flex-shrink-0 mt-0.5"/><div>提现金额将原路退回至您的支付账户（微信/支付宝），或打款至对公账户。预计 3 个工作日到账。</div></div>
                    <div className="mb-6"><div className="flex justify-between text-sm mb-2"><span className="text-gray-700 font-medium">提现金额</span><span className="text-gray-500">可提现: ¥{balance.toFixed(2)}</span></div><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">¥</span><input type="number" placeholder="0.00" value={withdrawAmount || ''} onChange={(e) => setWithdrawAmount(Math.min(Number(e.target.value), balance))} className="w-full border border-gray-300 rounded-lg pl-8 pr-20 py-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"/><button onClick={() => setWithdrawAmount(balance)} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-xs font-bold px-2 py-1 hover:bg-blue-50 rounded">全部提现</button></div></div>
                    <div className="mt-6 flex gap-3"><Button variant="secondary" className="flex-1" onClick={() => setShowWithdrawModal(false)}>取消</Button><Button className="flex-1" onClick={handleWithdraw} disabled={!withdrawAmount || withdrawAmount <= 0}>确认提现</Button></div>
                </div>
            </Modal>

            {/* Withdraw Success Modal */}
            <Modal isOpen={showWithdrawSuccessModal} onClose={() => setShowWithdrawSuccessModal(false)} title="" maxWidth="max-w-md">
                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                            <CheckCircle2 size={32} className="text-green-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">提现申请已提交</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            提现金额将在 1-3 个工作日内原路退回至您的支付账户<br/>
                            （微信/支付宝）或打款至对公账户
                        </p>
                        <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">提现流水号</span>
                                <span className="text-xs font-mono text-gray-900">{transactions[0]?.orderNo || 'WTH-'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">预计到账时间</span>
                                <span className="text-xs text-gray-900 font-medium">3个工作日内</span>
                            </div>
                        </div>
                        <Button className="w-full" onClick={() => setShowWithdrawSuccessModal(false)}>
                            我知道了
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Invoice Config */}
            <Modal isOpen={showInvoiceConfigModal} onClose={() => setShowInvoiceConfigModal(false)} title="发票抬头配置" maxWidth="max-w-lg">
                <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">抬头名称</label><input type="text" value={invoiceInfo.title} onChange={e => setInvoiceInfo({...invoiceInfo, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    {invoiceInfo.type === 'company' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">税号</label><input type="text" value={invoiceInfo.taxId} onChange={e => setInvoiceInfo({...invoiceInfo, taxId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>)}
                    <div className="pt-4 flex gap-3"><Button variant="secondary" className="flex-1" onClick={() => setShowInvoiceConfigModal(false)}>取消</Button><Button className="flex-1" onClick={() => setShowInvoiceConfigModal(false)}>保存</Button></div>
                </div>
            </Modal>

            {/* Recharge Modal */}
            <Modal isOpen={showRechargeModal} onClose={() => setShowRechargeModal(false)} title="余额充值" maxWidth="max-w-md">
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-3 mb-4">{[500, 1000, 2000, 5000].map(amt => (<button key={amt} onClick={() => setRechargeAmount(amt)} className={`p-4 border rounded-xl text-center transition-all ${rechargeAmount === amt ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 hover:border-blue-300'}`}><div className="font-bold text-lg">¥{amt}</div></button>))}</div>
                    <div className="flex gap-3"><Button variant="secondary" className="flex-1" onClick={() => setShowRechargeModal(false)}>取消</Button><Button className="flex-1" onClick={handleRecharge} disabled={!rechargeAmount}>确认充值</Button></div>
                </div>
            </Modal>

            {/* Invoice Apply */}
            <Modal isOpen={showInvoiceApplyModal} onClose={() => setShowInvoiceApplyModal(null)} title="申请开票" maxWidth="max-w-md" zIndex={60}>
                    <div className="p-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800 border border-blue-100">
                        <div className="font-bold mb-2">确认发票信息</div>
                        <div className="grid grid-cols-[80px_1fr] gap-1"><span className="text-blue-500">抬头：</span><span>{invoiceInfo.title}</span><span className="text-blue-500">税号：</span><span>{invoiceInfo.taxId || '-'}</span><span className="text-blue-500">金额：</span><span className="font-bold">¥{transactions.find(t => t.id === showInvoiceApplyModal)?.amount.toFixed(2)}</span></div>
                    </div>
                    <div className="flex gap-3"><Button variant="secondary" className="flex-1" onClick={() => setShowInvoiceApplyModal(null)}>取消</Button><Button className="flex-1" onClick={() => handleApplyInvoice(showInvoiceApplyModal || '')}>确认申请</Button></div>
                    </div>
            </Modal>

            {/* Batch Invoice Modal */}
            <Modal isOpen={showBatchInvoiceModal} onClose={() => setShowBatchInvoiceModal(false)} title="批量开票" maxWidth="max-w-3xl">
                <div className="p-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 flex gap-3 text-blue-800 text-sm">
                        <Info size={18} className="flex-shrink-0 mt-0.5"/>
                        <div>勾选需要开票的订单，系统将自动合并相同发票抬头的订单，并生成对应的电子发票。</div>
                    </div>

                    {/* 待开发票订单列表 */}
                    <div className="space-y-3 mb-6">
                        {transactions.filter(t => t.type === 'expense' && !t.invoiced && t.status === 'success').map(t => (
                            <label 
                                key={t.id}
                                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all group"
                            >
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"/>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900">{t.item}</h4>
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-green-50 text-green-600 border border-green-100">已完成</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                        <span className="font-mono">{t.orderNo}</span>
                                        <span>•</span>
                                        <span>{t.date}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-gray-900 font-mono">¥{t.amount.toFixed(2)}</div>
                                    <div className="text-[10px] text-gray-400">{t.paymentMethod}</div>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* 发票信息确认 */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Receipt size={18} className="text-blue-600"/>
                            发票抬头信息
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">抬头名称</span>
                                <div className="font-bold text-gray-900 mt-1">{invoiceInfo.title}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">纳税人识别号</span>
                                <div className="font-mono text-gray-900 mt-1">{invoiceInfo.taxId}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">地址电话</span>
                                <div className="text-gray-900 mt-1 text-xs">{invoiceInfo.address} / {invoiceInfo.phone}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">合计开票金额</span>
                                <div className="font-black text-orange-600 mt-1 text-xl">
                                    ¥{transactions.filter(t => t.type === 'expense' && !t.invoiced && t.status === 'success').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            className="mt-4 text-blue-600 text-xs h-8"
                            onClick={() => {
                                setShowBatchInvoiceModal(false);
                                setTimeout(() => setShowInvoiceConfigModal(true), 300);
                            }}
                        >
                            <Settings size={14}/> 修改发票抬头
                        </Button>
                    </div>

                    {/* 底部操作 */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button variant="secondary" className="flex-1" onClick={() => setShowBatchInvoiceModal(false)}>
                            取消
                        </Button>
                        <Button 
                            className="flex-1" 
                            onClick={() => {
                                // 批量开票逻辑
                                const toBatchInvoice = transactions.filter(t => t.type === 'expense' && !t.invoiced && t.status === 'success');
                                setTransactions(prev => prev.map(t => 
                                    toBatchInvoice.some(bi => bi.id === t.id) ? { ...t, invoiced: true } : t
                                ));
                                setShowBatchInvoiceModal(false);
                                alert(`✅ 批量开票成功！\n\n已为 ${toBatchInvoice.length} 笔订单提交开票申请，发票将在 1-3 个工作日内发送至您的电子邮箱。`);
                            }}
                        >
                            <Receipt size={16}/> 提交开票申请
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Consult QR Modal */}
            <Modal isOpen={showConsultQRModal} onClose={() => setShowConsultQRModal(false)} title="" maxWidth="max-w-md">
                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">扫码加入企微群</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            扫描下方二维码，添加产品顾问企业微信<br/>
                            我们将第一时间为您解答产品相关问题
                        </p>
                        
                        {/* 二维码区域 */}
                        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm mb-6">
                            <div className="w-48 h-48 bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-3">
                                <QrCode size={120} className="text-gray-400"/>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">企业微信群二维码</span>
                            </div>
                        </div>

                        {/* 提示信息 */}
                        <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                            <div className="space-y-2 text-xs text-left text-gray-600">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-blue-600 mt-0.5 flex-shrink-0"/>
                                    <span>实时在线解答产品功能、价格、部署相关问题</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-blue-600 mt-0.5 flex-shrink-0"/>
                                    <span>优先获取产品更新通知和限时优惠活动</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-blue-600 mt-0.5 flex-shrink-0"/>
                                    <span>与其他诊所同行交流使用经验和心得</span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" variant="secondary" onClick={() => setShowConsultQRModal(false)}>
                            关闭
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}