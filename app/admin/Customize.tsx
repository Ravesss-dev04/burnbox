import React, { useState, useEffect } from 'react'
import Home from '../page'
import { SiteConfigProvider, useSiteConfig } from '../context/SiteConfigContext'
import EditorSidebar from '../components/EditorSidebar'
import { Save, ChevronDown, ChevronRight, Plus, Trash2, Layout, Type, Palette, Image as ImageIcon, Settings, X, Lock, Menu, Circle, Triangle, Square, Layers, MousePointer2, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

interface CustomizeProps {
  darkmode?: boolean;
  userRole?: 'ADMIN' | 'STAFF';
}

// Helper Component for Accordion Sections
const AccordionSection = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onClick, 
  children 
}: { 
  title: string; 
  icon: any; 
  isOpen: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) => {
  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors ${isOpen ? 'bg-gray-800/30' : ''}`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-pink-500" />
          <span className="font-medium text-sm text-gray-200">{title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-900/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const ToolButton = ({ icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className='flex flex-col items-center justify-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 hover:border-pink-500 transition-all group aspect-square'
  >
    <Icon size={20} className="text-gray-400 group-hover:text-pink-500" />
    <span className="text-[10px] font-bold text-gray-300">{label}</span>
  </button>
);

const CustomizeContent = () => {
  const { config, updateConfig, saveConfig, setEditing, editKey, setEditKey, undo, redo } = useSiteConfig();
  const [openSection, setOpenSection] = useState<string | null>('tools');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Enable editing mode when component mounts
  useEffect(() => {
    setEditing(true);
    return () => setEditing(false);
  }, [setEditing]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'x' && editKey) {
        e.preventDefault();
        // Delete selected element
        if (confirm('Are you sure you want to delete this element?')) {
            const elements = config.addedElements || [];
            const newElements = elements.filter((el: any) => el.id !== editKey);
            updateConfig('addedElements', newElements);
            setEditKey(null);
        }
      }
      if (e.key === 'Delete' && editKey) {
        // Delete selected element
        if (confirm('Are you sure you want to delete this element?')) {
            const elements = config.addedElements || [];
            const newElements = elements.filter((el: any) => el.id !== editKey);
            updateConfig('addedElements', newElements);
            setEditKey(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, editKey, config, updateConfig, setEditKey]);

  // Auto-open section based on clicked element
  useEffect(() => {
    if (editKey) {
      setOpenSection('selected'); // Open the new "Selected Element" section
    }
  }, [editKey]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Helper to update style of selected element
  const updateSelectedStyle = (property: string, value: any) => {
    if (!editKey) return;
    const currentStyle = config[`${editKey}_style`] || {};
    updateConfig(`${editKey}_style`, { ...currentStyle, [property]: value });
  };

  const getSelectedStyle = (property: string) => {
    if (!editKey) return '';
    const style = config[`${editKey}_style`] || {};
    return style[property] || '';
  };

  // Helper for Services Array
  const services = config.servicesData || [
    { title: "Large Format Printing", description: "Eye-catching banners...", icon: "Printer" },
    { title: "Custom Signage", description: "Indoor and outdoor signs...", icon: "Signpost" },
    { title: "Promotional Materials", description: "Brochures, flyers...", icon: "Megaphone" }
  ];

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    updateConfig('servicesData', newServices);
  };

  const addService = () => {
    updateConfig('servicesData', [...services, { title: "New Service", description: "Description", icon: "Printer" }]);
  };

  const removeService = (index: number) => {
    const newServices = services.filter((_: any, i: number) => i !== index);
    updateConfig('servicesData', newServices);
  };

  // Helper for FAQ Array
  const faqs = config.faqData || [
    { question: "How do I request a quotation?", answer: "You can request a quotation..." }
  ];

  const updateFaq = (index: number, field: string, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    updateConfig('faqData', newFaqs);
  };

  const addFaq = () => {
    updateConfig('faqData', [...faqs, { question: "New Question", answer: "New Answer" }]);
  };

  const removeFaq = (index: number) => {
    const newFaqs = faqs.filter((_: any, i: number) => i !== index);
    updateConfig('faqData', newFaqs);
  };

  return (
    <div className='relative h-full w-full flex flex-col md:flex-row overflow-hidden'>
      
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden absolute top-20 left-4 z-50 p-3 bg-pink-600 text-white rounded-full shadow-lg border border-white/20 hover:bg-pink-700 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Settings size={24} />}
      </button>

      {/* Sidebar Controls */}
      <div className={`
        fixed inset-y-0 left-0 z-40 bg-gray-900 text-white flex flex-col h-full border-r border-white/10 shadow-2xl transform transition-all duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isSidebarCollapsed ? 'w-16' : 'w-80 md:w-96'}
      `}>
        {/* Header */}
        <div className={`p-4 border-b border-gray-800 flex flex-col gap-4 bg-gray-900 z-10 ${isSidebarCollapsed ? 'items-center px-2' : ''}`}>
          <div className="flex items-center justify-between w-full">
             {!isSidebarCollapsed && (
                <h2 className='text-lg font-bold flex items-center gap-2 whitespace-nowrap'>
                    <Settings className="text-pink-500" size={20} />
                    Site Customizer
                </h2>
             )}
             <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                className={`text-gray-400 hover:text-white transition-colors ${isSidebarCollapsed ? 'mx-auto' : ''}`}
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
             >
                {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
             </button>
          </div>
          
          {!isSidebarCollapsed && (
              <div className="flex flex-col gap-2 w-full">
                  <button 
                    onClick={saveConfig}
                    className='w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95'
                  >
                    <Save size={14} /> Save Changes
                  </button>
              </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0 ${isSidebarCollapsed ? 'hidden' : ''}`}>
          
          {/* Tools Section (Figma Style) */}
          <AccordionSection 
            title="Tools" 
            icon={MousePointer2} 
            isOpen={openSection === 'tools'} 
            onClick={() => toggleSection('tools')}
          >
            <div className='grid grid-cols-4 gap-2'>
              <ToolButton 
                icon={Type} 
                label="Text" 
                onClick={() => {
                  const id = `text_${Date.now()}`;
                  const newElements = [...(config.addedElements || []), { id, type: 'text', content: 'Text', x: 100, y: 100 }];
                  updateConfig('addedElements', newElements);
                  updateConfig(id, 'Text');
                  updateConfig(`${id}_type`, 'text');
                  updateConfig(`${id}_pos`, { x: 100, y: 100 });
                  updateConfig(`${id}_style`, { fontSize: '24px', color: '#ffffff' });
                  setEditKey(id);
                }} 
              />
              <ToolButton 
                icon={Layout} 
                label="Card" 
                onClick={() => {
                  const id = `card_${Date.now()}`;
                  const newElements = [...(config.addedElements || []), { id, type: 'card', x: 150, y: 150 }];
                  updateConfig('addedElements', newElements);
                  updateConfig(`${id}_type`, 'card');
                  updateConfig(`${id}_pos`, { x: 150, y: 150 });
                  updateConfig(`${id}_style`, { width: '300px', height: '200px', backgroundColor: '#1f2937', borderRadius: '12px' });
                  setEditKey(id);
                }} 
              />
              <ToolButton 
                icon={ImageIcon} 
                label="Image" 
                onClick={() => {
                  const id = `image_${Date.now()}`;
                  const newElements = [...(config.addedElements || []), { id, type: 'image', content: '/placeholder.jpg', x: 200, y: 200 }];
                  updateConfig('addedElements', newElements);
                  updateConfig(id, '/placeholder.jpg');
                  updateConfig(`${id}_type`, 'image');
                  updateConfig(`${id}_pos`, { x: 200, y: 200 });
                  updateConfig(`${id}_style`, { width: '200px', height: '200px', borderRadius: '12px' });
                  setEditKey(id);
                }} 
              />
              <ToolButton 
                icon={Circle} 
                label="Circle" 
                onClick={() => {
                  const id = `circle_${Date.now()}`;
                  const newElements = [...(config.addedElements || []), { id, type: 'circle', x: 250, y: 250 }];
                  updateConfig('addedElements', newElements);
                  updateConfig(`${id}_type`, 'circle');
                  updateConfig(`${id}_pos`, { x: 250, y: 250 });
                  updateConfig(`${id}_style`, { width: '100px', height: '100px', backgroundColor: '#ec4899', borderRadius: '50%' });
                  setEditKey(id);
                }} 
              />
              <ToolButton 
                icon={Square} 
                label="Square" 
                onClick={() => {
                  const id = `square_${Date.now()}`;
                  const newElements = [...(config.addedElements || []), { id, type: 'square', x: 300, y: 300 }];
                  updateConfig('addedElements', newElements);
                  updateConfig(`${id}_type`, 'square');
                  updateConfig(`${id}_pos`, { x: 300, y: 300 });
                  updateConfig(`${id}_style`, { width: '100px', height: '100px', backgroundColor: '#ec4899' });
                  setEditKey(id);
                }} 
              />
              <ToolButton 
                icon={Triangle} 
                label="Triangle" 
                onClick={() => {
                  const id = `triangle_${Date.now()}`;
                  const newElements = [...(config.addedElements || []), { id, type: 'triangle', x: 350, y: 350 }];
                  updateConfig('addedElements', newElements);
                  updateConfig(`${id}_type`, 'triangle');
                  updateConfig(`${id}_pos`, { x: 350, y: 350 });
                  updateConfig(`${id}_style`, { 
                    width: '0', 
                    height: '0', 
                    borderLeft: '50px solid transparent',
                    borderRight: '50px solid transparent',
                    borderBottom: '100px solid #ec4899',
                    backgroundColor: 'transparent'
                  });
                  setEditKey(id);
                }} 
              />
            </div>
          </AccordionSection>

          {/* Layers Section */}
          <AccordionSection 
            title="Layers" 
            icon={Layers} 
            isOpen={openSection === 'layers'} 
            onClick={() => toggleSection('layers')}
          >
             <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {(!config.addedElements || config.addedElements.length === 0) && (
                    <p className="text-xs text-gray-500 p-2 text-center italic">No layers yet</p>
                )}
                {([...(config.addedElements || [])].reverse()).map((el: any) => (
                   <button 
                      key={el.id}
                      onClick={() => setEditKey(el.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all group ${editKey === el.id ? 'bg-pink-600/20 text-pink-500 border border-pink-600/50' : 'hover:bg-gray-800 text-gray-400 border border-transparent'}`}
                   >
                      {el.type === 'text' && <Type size={14} />}
                      {el.type === 'image' && <ImageIcon size={14} />}
                      {el.type === 'card' && <Layout size={14} />}
                      {el.type === 'circle' && <Circle size={14} />}
                      {el.type === 'square' && <Square size={14} />}
                      {el.type === 'triangle' && <Triangle size={14} />}
                      <span className="truncate font-medium">{el.id}</span>
                   </button>
                ))}
             </div>
          </AccordionSection>



          {/* Hero Section */}
          <AccordionSection 
            title="Hero Section" 
            icon={Layout} 
            isOpen={openSection === 'hero'} 
            onClick={() => toggleSection('hero')}
          >
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Hero Title</label>
                <textarea 
                  value={config.heroTitle || "Welcome to BurnBox"}
                  onChange={(e) => updateConfig('heroTitle', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-20 resize-none whitespace-pre-wrap ${editKey === 'heroTitle' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Hero Subtitle</label>
                <textarea 
                  value={config.heroSubtitle || "Your one-stop shop for customized merchandise."}
                  onChange={(e) => updateConfig('heroSubtitle', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-24 resize-none whitespace-pre-wrap ${editKey === 'heroSubtitle' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Hero Image URL</label>
                <input 
                  type="text" 
                  value={config.heroImage || "/onetwo.jpg"}
                  onChange={(e) => updateConfig('heroImage', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'heroImage' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
            </div>
          </AccordionSection>

          {/* Creative Section */}
          <AccordionSection 
            title="Creative Section" 
            icon={ImageIcon} 
            isOpen={openSection === 'creative'} 
            onClick={() => toggleSection('creative')}
          >
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Title</label>
                <textarea 
                  value={config.creativeTitle || "Your Visibility Challenge\nOur Creative Solution"}
                  onChange={(e) => updateConfig('creativeTitle', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-20 resize-none whitespace-pre-wrap ${editKey === 'creativeTitle' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Highlight Text</label>
                <input 
                  type="text" 
                  value={config.creativeHighlight || "Struggling to Stand Out?"}
                  onChange={(e) => updateConfig('creativeHighlight', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'creativeHighlight' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Subtitle</label>
                <textarea 
                  value={config.creativeSubtitle || "In a crowded market, your brand can easily get lost..."}
                  onChange={(e) => updateConfig('creativeSubtitle', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-24 resize-none ${editKey === 'creativeSubtitle' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Image URL</label>
                <input 
                  type="text" 
                  value={config.creativeImage || "/onetree.jpg"}
                  onChange={(e) => updateConfig('creativeImage', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'creativeImage' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
            </div>
          </AccordionSection>

          {/* Services Section */}
          <AccordionSection 
            title="Services (Cards)" 
            icon={Layout} 
            isOpen={openSection === 'services'} 
            onClick={() => toggleSection('services')}
          >
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Section Title</label>
                <input 
                  type="text" 
                  value={config.servicesTitle || "Comprehensive Printing & Signage Services"}
                  onChange={(e) => updateConfig('servicesTitle', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'servicesTitle' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              
              <div className='space-y-3'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Service Cards</label>
                {services.map((service: any, index: number) => (
                  <div key={index} className='bg-gray-800 p-3 rounded-lg border border-gray-700 space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs font-bold text-pink-500'>Card #{index + 1}</span>
                      <button onClick={() => removeService(index)} className='text-red-400 hover:text-red-300'>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={service.title}
                      onChange={(e) => updateService(index, 'title', e.target.value)}
                      placeholder="Title"
                      className='w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs'
                    />
                    <textarea 
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="Description"
                      className='w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs h-16 resize-none'
                    />
                    <select
                      value={service.icon}
                      onChange={(e) => updateService(index, 'icon', e.target.value)}
                      className='w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs'
                    >
                      <option value="Printer">Printer Icon</option>
                      <option value="Signpost">Signpost Icon</option>
                      <option value="Megaphone">Megaphone Icon</option>
                    </select>
                  </div>
                ))}
                <button 
                  onClick={addService}
                  className='w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase'
                >
                  <Plus size={14} /> Add Service Card
                </button>
              </div>
            </div>
          </AccordionSection>
          {/* Why Choose Us Section */}
          <AccordionSection 
            title="Why Choose Us" 
            icon={Layout} 
            isOpen={openSection === 'whychoose'} 
            onClick={() => toggleSection('whychoose')}
          >
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Title</label>
                <input 
                  type="text" 
                  value={config.whyChooseTitle || "Why Choose BurnBox?"}
                  onChange={(e) => updateConfig('whyChooseTitle', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'whyChooseTitle' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Image URL</label>
                <input 
                  type="text" 
                  value={config.whyChooseImage || "/onefive.jpg"}
                  onChange={(e) => updateConfig('whyChooseImage', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'whyChooseImage' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
            </div>
          </AccordionSection>
          {/* FAQ Section */}
          <AccordionSection 
            title="FAQ Section" 
            icon={Type} 
            isOpen={openSection === 'faq'} 
            onClick={() => toggleSection('faq')}
          >
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Section Title</label>
                <input 
                  type="text" 
                  value={config.faqTitle || "Frequently Asked Questions"}
                  onChange={(e) => updateConfig('faqTitle', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                />
              </div>
              
              <div className='space-y-3'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Questions</label>
                {faqs.map((faq: any, index: number) => (
                  <div key={index} className='bg-gray-800 p-3 rounded-lg border border-gray-700 space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs font-bold text-pink-500'>Q #{index + 1}</span>
                      <button onClick={() => removeFaq(index)} className='text-red-400 hover:text-red-300'>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      placeholder="Question"
                      className='w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs'
                    />
                    <textarea 
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      placeholder="Answer"
                      className='w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs h-16 resize-none'
                    />
                  </div>
                ))}
                <button 
                  onClick={addFaq}
                  className='w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase'
                >
                  <Plus size={14} /> Add Question
                </button>
              </div>
            </div>
          </AccordionSection>

          {/* Contact Section */}
          <AccordionSection 
            title="Contact Section" 
            icon={Layout} 
            isOpen={openSection === 'contact'} 
            onClick={() => toggleSection('contact')}
          >
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Title</label>
                <textarea 
                  value={config.contactTitle || "Contact Burnbox for\nYour Next Project"}
                  onChange={(e) => updateConfig('contactTitle', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-20 resize-none whitespace-pre-wrap ${editKey === 'contactTitle' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Subtitle</label>
                <textarea 
                  value={config.contactSubtitle || "Let's bring your vision to life..."}
                  onChange={(e) => updateConfig('contactSubtitle', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-24 resize-none ${editKey === 'contactSubtitle' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Button Text</label>
                <input 
                  type="text" 
                  value={config.contactButtonText || "Contact Us Now"}
                  onChange={(e) => updateConfig('contactButtonText', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'contactButtonText' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Image URL</label>
                <input 
                  type="text" 
                  value={config.contactImage || "/aboutusimage.png"}
                  onChange={(e) => updateConfig('contactImage', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'contactImage' ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-700'}`}
                />
              </div>
            </div>
          </AccordionSection>

          {/* Footer Section */}
          <AccordionSection 
            title="Footer & Socials" 
            icon={Layout} 
            isOpen={openSection === 'footer'} 
            onClick={() => toggleSection('footer')}
          >
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Contact Email</label>
                <input 
                  type="text" 
                  value={config.contactEmail || "info@burnbox.com"}
                  onChange={(e) => updateConfig('contactEmail', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Footer Text</label>
                <input 
                  type="text" 
                  value={config.footerText || "@ 2025 burnbox Printing company"}
                  onChange={(e) => updateConfig('footerText', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Facebook URL</label>
                <input 
                  type="text" 
                  value={config.facebookUrl || ""}
                  onChange={(e) => updateConfig('facebookUrl', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Instagram URL</label>
                <input 
                  type="text" 
                  value={config.instagramUrl || ""}
                  onChange={(e) => updateConfig('instagramUrl', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </AccordionSection>

        </div>

        {/* Footer Actions */}
        {!isSidebarCollapsed && (
            <div className="p-4 border-t border-gray-800 bg-gray-900">
                <button 
                    onClick={() => window.location.href = '/admin'}
                    className='w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 text-gray-400 hover:text-white border border-gray-700'
                >
                    <LogOut size={14} /> Exit Customization
                </button>
            </div>
        )}
      </div>

      {/* Preview Area */}
      <div 
        className='flex-1 bg-black rounded-xl overflow-hidden border border-gray-800 relative shadow-2xl'
        onClick={() => setEditKey(null)}
      >
        <div className='absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10 flex items-center gap-2'>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Live Preview
        </div>
        <div className='w-full h-full overflow-y-auto'>
           <div className="w-full h-full">
             <Home />
           </div>
        </div>
      </div>

      <EditorSidebar />
    </div>
  )
}




const SecurityGate = ({ children, userRole }: { children: React.ReactNode, userRole?: string }) => {
  // Normalize role to ensure case-insensitive comparison
  const normalizedRole = userRole?.toUpperCase() || 'STAFF';
  const isAdmin = normalizedRole === 'ADMIN';

  const [isAuthenticated, setIsAuthenticated] = useState(isAdmin);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Update authentication state if role changes
  useEffect(() => {
    if (normalizedRole === 'ADMIN') {
      setIsAuthenticated(true);
    } else {
      // If role changes to non-admin, lock it again unless already unlocked
      // But typically we want to respect the new role.
      // If we want to force re-auth on role downgrade, we could do:
      // setIsAuthenticated(false);
      // But for now, let's just ensure ADMIN gets in.
    }
  }, [normalizedRole]);
  
  // Force immediate bypass if admin, ignoring state (double check)
  if (isAdmin) return <>{children}</>;
  if (isAuthenticated) return <>{children}</>;

  const handleUnlock = () => {
    if (pin === '123456') { // Simple hardcoded PIN for demo
      setIsAuthenticated(true);
    } else {
      setError('Incorrect Security PIN');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-950 text-white p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl border border-white/10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto text-pink-500">
          <Lock size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Restricted Access</h2>
          <p className="text-gray-400 text-sm">
            You are logged in as <span className="font-bold text-pink-400">{normalizedRole}</span>. 
            <br/>This area requires additional authorization.
          </p>
        </div>
        
        <div className="space-y-4">
          <input 
            type="password" 
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(''); }}
            placeholder="Enter Security PIN"
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:border-pink-500 transition-colors"
            maxLength={6}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          />
          {error && <p className="text-red-400 text-sm font-medium animate-pulse">{error}</p>}
          
          <button 
            onClick={handleUnlock}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Unlock Customization
          </button>
        </div>
        
        <p className="text-xs text-gray-500">
          Please contact an administrator if you don't have the PIN.
        </p>
      </div>
    </div>
  );
};

const Customize = ({darkmode =  false, userRole = 'STAFF' }: CustomizeProps) => {
  return (
      <div className='bg-gray-950 shadow-md rounded-xl p-0 md:p-4 w-full h-full overflow-hidden'>
        <SecurityGate userRole={userRole}>
          <CustomizeContent />
        </SecurityGate>
      </div>
  )
}

export default Customize
