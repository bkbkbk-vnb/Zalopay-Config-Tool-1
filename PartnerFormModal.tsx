import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2, Smartphone, ChevronRight, Activity, ExternalLink, FileDown, FileUp } from 'lucide-react';
import { PartnerMaster, SubContentItem, GuidanceItem, MainCtaItem } from '../types';

interface PartnerFormModalProps {
    partner: PartnerMaster | null;
    onClose: () => void;
    onSave: (p: PartnerMaster) => void;
}

export default function PartnerFormModal({ partner, onClose, onSave }: PartnerFormModalProps) {
    const [formData, setFormData] = useState<PartnerMaster>(partner || {
        Partner_ID: '',
        Partner_Name: '',
        Bank_Code: '',
        Category: 'BANK',
        Status: 'ACTIVE',
        Logo_URL: '',
        Bg_Color: '#ffffff',
        Text_Color: '#1e293b',
        Card_Title: '',
        Card_Subtitle: '',
        Description: '',
        Main_Content: '',
        Header_Title: '',
        Header_Image_URL: '',
        Sub_Contents: [],
        Guidances: [],
        Main_CTAs: [],
        Partner_Code: '',
        Title_Color: '',
        Subtitle_Color: '',
        Content_Color: '',
        Background_Image_URL: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingField, setUploadingField] = useState<{ type: 'header' | 'guidance' | 'logo' | 'background'; index?: number } | null>(null);

    const handleSave = () => {
        if (!formData.Partner_ID || !formData.Partner_Name) {
            alert('Partner ID and Name are required.');
            return;
        }
        onSave(formData);
    };

    const triggerUpload = (type: 'header' | 'guidance' | 'logo' | 'background', index?: number) => {
        setUploadingField({ type, index });
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingField) return;

        const localUrl = URL.createObjectURL(file);

        if (uploadingField.type === 'header') {
            setFormData({ ...formData, Header_Image_URL: localUrl });
        } else if (uploadingField.type === 'logo') {
            setFormData({ ...formData, Logo_URL: localUrl });
        } else if (uploadingField.type === 'background') {
            setFormData({ ...formData, Background_Image_URL: localUrl });
        } else if (uploadingField.type === 'guidance' && uploadingField.index !== undefined) {
            const newGuidances = [...(formData.Guidances || [])];
            newGuidances[uploadingField.index] = { ...newGuidances[uploadingField.index], image_url: localUrl };
            setFormData({ ...formData, Guidances: newGuidances });
        }

        setUploadingField(null);
        e.target.value = '';
    };

    // Array Handlers
    const addSubContent = () => {
        const newItem: SubContentItem = { id: Date.now().toString(), type: 'HYPER_LINK', label: '' };
        setFormData({ ...formData, Sub_Contents: [...(formData.Sub_Contents || []), newItem] });
    };
    const updateSubContent = (index: number, key: string, value: string) => {
        const arr = [...(formData.Sub_Contents || [])];
        arr[index] = { ...arr[index], [key]: value };
        setFormData({ ...formData, Sub_Contents: arr });
    };
    const removeSubContent = (index: number) => {
        const arr = [...(formData.Sub_Contents || [])];
        arr.splice(index, 1);
        setFormData({ ...formData, Sub_Contents: arr });
    };

    const addGuidance = () => {
        const newItem: GuidanceItem = { id: Date.now().toString(), content: '', image_url: '' };
        setFormData({ ...formData, Guidances: [...(formData.Guidances || []), newItem] });
    };
    const updateGuidance = (index: number, key: string, value: string) => {
        const arr = [...(formData.Guidances || [])];
        arr[index] = { ...arr[index], [key]: value };
        setFormData({ ...formData, Guidances: arr });
    };
    const removeGuidance = (index: number) => {
        const arr = [...(formData.Guidances || [])];
        arr.splice(index, 1);
        setFormData({ ...formData, Guidances: arr });
    };

    const addMainCta = () => {
        const newItem: MainCtaItem = { id: Date.now().toString(), condition: 'DEFAULT', name: '', action_type: 'DEEPLINK' };
        setFormData({ ...formData, Main_CTAs: [...(formData.Main_CTAs || []), newItem] });
    };
    const updateMainCta = (index: number, key: string, value: string) => {
        const arr = [...(formData.Main_CTAs || [])];
        arr[index] = { ...arr[index], [key]: value };
        setFormData({ ...formData, Main_CTAs: arr });
    };
    const removeMainCta = (index: number) => {
        const arr = [...(formData.Main_CTAs || [])];
        arr.splice(index, 1);
        setFormData({ ...formData, Main_CTAs: arr });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">{partner ? `Edit Partner: ${formData.Partner_Name}` : 'Add New Partner'}</h2>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors">
                            Save Configuration
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50 border-r border-slate-200">
                        {/* SECTION 1: Basic Information */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Partner ID <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.Partner_ID}
                                        onChange={e => setFormData({ ...formData, Partner_ID: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                                        disabled={!!partner}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Partner Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.Partner_Name}
                                        onChange={e => setFormData({ ...formData, Partner_Name: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                        placeholder="e.g. Cathay United Bank"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
                                    <select
                                        value={formData.Status}
                                        onChange={e => setFormData({ ...formData, Status: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Partner Code</label>
                                    <input
                                        type="text"
                                        value={formData.Partner_Code || ''}
                                        onChange={e => setFormData({ ...formData, Partner_Code: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                        placeholder="e.g. CUB_001"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
                                    <input
                                        type="text"
                                        value={formData.Description || ''}
                                        onChange={e => setFormData({ ...formData, Description: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                        placeholder="Short summary..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Default Logo</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.Logo_URL || ''}
                                            onChange={e => setFormData({ ...formData, Logo_URL: e.target.value })}
                                            className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm"
                                            placeholder="https://..."
                                        />
                                        <button onClick={() => triggerUpload('logo')} className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1"><Upload size={14} /> Upload</button>
                                    </div>
                                    {formData.Logo_URL && <img src={formData.Logo_URL} alt="logo" className="mt-2 h-12 object-contain border border-slate-100 p-1 rounded bg-white" />}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Default Background Image</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.Background_Image_URL || ''}
                                            onChange={e => setFormData({ ...formData, Background_Image_URL: e.target.value })}
                                            className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm"
                                            placeholder="https://..."
                                        />
                                        <button onClick={() => triggerUpload('background')} className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1"><Upload size={14} /> Upload</button>
                                    </div>
                                    {formData.Background_Image_URL && <img src={formData.Background_Image_URL} alt="bg" className="mt-2 h-12 object-contain border border-slate-100 p-1 rounded bg-white" />}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mt-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bg Color</label>
                                    <div className="flex h-10 border border-slate-200 rounded-lg overflow-hidden">
                                        <input type="color" value={formData.Bg_Color || '#ffffff'} onChange={e => setFormData({ ...formData, Bg_Color: e.target.value })} className="w-1/3 h-full cursor-pointer border-none p-0" />
                                        <input type="text" value={formData.Bg_Color || ''} onChange={e => setFormData({ ...formData, Bg_Color: e.target.value })} className="w-2/3 h-full px-2 text-[10px] uppercase font-mono border-none outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Text Color</label>
                                    <div className="flex h-10 border border-slate-200 rounded-lg overflow-hidden">
                                        <input type="color" value={formData.Text_Color || '#000000'} onChange={e => setFormData({ ...formData, Text_Color: e.target.value })} className="w-1/3 h-full cursor-pointer border-none p-0" />
                                        <input type="text" value={formData.Text_Color || ''} onChange={e => setFormData({ ...formData, Text_Color: e.target.value })} className="w-2/3 h-full px-2 text-[10px] uppercase font-mono border-none outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title Color</label>
                                    <div className="flex h-10 border border-slate-200 rounded-lg overflow-hidden">
                                        <input type="color" value={formData.Title_Color || '#000000'} onChange={e => setFormData({ ...formData, Title_Color: e.target.value })} className="w-1/3 h-full cursor-pointer border-none p-0" />
                                        <input type="text" value={formData.Title_Color || ''} onChange={e => setFormData({ ...formData, Title_Color: e.target.value })} className="w-2/3 h-full px-2 text-[10px] uppercase font-mono border-none outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subtitle Color</label>
                                    <div className="flex h-10 border border-slate-200 rounded-lg overflow-hidden">
                                        <input type="color" value={formData.Subtitle_Color || '#000000'} onChange={e => setFormData({ ...formData, Subtitle_Color: e.target.value })} className="w-1/3 h-full cursor-pointer border-none p-0" />
                                        <input type="text" value={formData.Subtitle_Color || ''} onChange={e => setFormData({ ...formData, Subtitle_Color: e.target.value })} className="w-2/3 h-full px-2 text-[10px] uppercase font-mono border-none outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Content Color</label>
                                    <div className="flex h-10 border border-slate-200 rounded-lg overflow-hidden">
                                        <input type="color" value={formData.Content_Color || '#000000'} onChange={e => setFormData({ ...formData, Content_Color: e.target.value })} className="w-1/3 h-full cursor-pointer border-none p-0" />
                                        <input type="text" value={formData.Content_Color || ''} onChange={e => setFormData({ ...formData, Content_Color: e.target.value })} className="w-2/3 h-full px-2 text-[10px] uppercase font-mono border-none outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Default Card Title</label>
                                    <input
                                        type="text"
                                        value={formData.Card_Title || ''}
                                        onChange={e => setFormData({ ...formData, Card_Title: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Default Card Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.Card_Subtitle || ''}
                                        onChange={e => setFormData({ ...formData, Card_Subtitle: e.target.value })}
                                        className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Pane */}
                    <div className="w-[380px] bg-slate-800 flex flex-col items-center justify-center p-6 relative">
                        <div className="absolute top-4 left-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Live Preview</div>
                        <div className="w-[280px] h-[580px] bg-white rounded-[32px] shadow-2xl overflow-hidden border-[6px] border-slate-900 relative flex flex-col scale-90">
                            {/* Status Bar */}
                            <div className="h-10 bg-white w-full flex justify-between items-end px-5 pb-1.5 text-[8px] font-bold text-slate-800">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center">
                                    <div className="w-2.5 h-2 bg-slate-800 rounded-[1px]"></div>
                                    <div className="w-2.5 h-2 bg-slate-800 rounded-[1px]"></div>
                                    <div className="w-3.5 h-2 border border-slate-800 rounded-[1px] relative">
                                        <div className="absolute inset-[0.5px] bg-slate-800 rounded-[0.5px]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-slate-50 overflow-y-auto p-4 pt-10">
                                <h2 className="text-sm font-bold text-slate-900 mb-1">Mở thẻ & Vay</h2>
                                <p className="text-[9px] text-slate-500 mb-4">Sample card with partner defaults</p>

                                <div className="relative rounded-xl p-4 shadow-sm border border-black/5 overflow-hidden"
                                    style={{
                                        backgroundColor: formData.Bg_Color || '#ffffff',
                                        backgroundImage: formData.Background_Image_URL ? `url(${formData.Background_Image_URL})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        color: formData.Text_Color || '#1e293b'
                                    }}
                                >
                                    <div className="flex items-start gap-2.5 mb-3 relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 border border-slate-50">
                                            {formData.Logo_URL ? (
                                                <img src={formData.Logo_URL} alt="logo" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <div className="text-[10px] font-bold text-slate-300">LOGO</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xs leading-tight" style={{ color: formData.Title_Color || 'inherit' }}>{formData.Card_Title || formData.Partner_Name || 'Sample Card Title'}</h3>
                                            <p className="text-[10px] mt-0.5" style={{ color: formData.Subtitle_Color || formData.Text_Color || 'inherit', opacity: formData.Subtitle_Color ? 1 : 0.8 }}>{formData.Card_Subtitle || 'Sample subtitle text'}</p>
                                        </div>
                                    </div>

                                    <ul className="space-y-1 mb-3 relative z-10">
                                        {((formData.Description || 'Benefit 1\nBenefit 2').split('\n')).map((benefit, i) => (
                                            <li key={i} className="text-[9px] flex items-start gap-1.5" style={{ color: formData.Content_Color || formData.Text_Color || 'inherit', opacity: formData.Content_Color ? 1 : 0.9 }}>
                                                <div className="w-1 h-1 rounded-full bg-blue-500 shrink-0 mt-1" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex justify-end relative z-10">
                                        <div className="bg-white/30 text-[9px] font-bold py-1 px-3 rounded-full backdrop-blur-sm shadow-sm border border-white/20">
                                            Mở ngay
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
    );
}
