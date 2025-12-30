import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { FiSave, FiTrash2, FiPlus, FiUpload, FiCpu, FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiZap, FiTrendingUp, FiBox, FiLayers, FiMessageCircle, FiSend, FiMinimize2 } from 'react-icons/fi';

const CustomDesign = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [design, setDesign] = useState({
    projectName: '',
    projectType: 'Door',
    category: 'Mechanical',
    specifications: {
      dimensions: {
        width: '',
        height: '',
        depth: '',
        unit: 'feet'
      },
      material: '',
      color: '',
      finish: '',
      features: []
    },
    budget: {
      min: '',
      max: '',
      currency: 'USD'
    },
    timeline: {
      startDate: '',
      endDate: '',
      duration: ''
    },
    location: {
      type: 'Commercial',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    buildingType: 'Commercial',
    description: '',
    requirements: [],
    status: 'Draft'
  });

  const [newFeature, setNewFeature] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  
  // High-tech features state
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [autoSaving, setAutoSaving] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m your Design Assistant AI. Ask me anything about your project!', timestamp: new Date() }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      if (grandchild) {
        setDesign(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value
            }
          }
        }));
      } else {
        setDesign(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setDesign(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setDesign(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          features: [...prev.specifications.features, newFeature]
        }
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setDesign(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        features: prev.specifications.features.filter((_, i) => i !== index)
      }
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setDesign(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setDesign(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Real-time cost estimation
  const calculateEstimate = useCallback(() => {
    const { dimensions, material } = design.specifications;
    const { min, max } = design.budget;
    
    // Base cost calculation based on material and dimensions
    const materialCosts = {
      'Steel': 50, 'Stainless Steel': 80, 'Aluminum': 60, 'Brass': 100,
      'Teak Wood': 120, 'Oak Wood': 90, 'Tempered Glass': 70,
      'UPVC': 45, 'Concrete': 40, 'Granite': 110
    };
    
    const baseCost = materialCosts[material] || 50;
    const area = (parseFloat(dimensions.width) || 0) * (parseFloat(dimensions.height) || 0);
    const volume = area * (parseFloat(dimensions.depth) || 1);
    
    let estimate = baseCost * area;
    
    // Category multiplier
    const categoryMultiplier = {
      'Industrial': 1.5,
      'Mechanical': 1.2,
      'Consulting': 1.3,
      'Maintenance': 1.0
    };
    
    estimate *= categoryMultiplier[design.category] || 1.0;
    
    // Complexity adjustment
    const featureCount = design.specifications.features.length;
    estimate += featureCount * 200;
    
    setEstimatedCost({
      base: Math.round(estimate),
      labor: Math.round(estimate * 0.4),
      materials: Math.round(estimate * 0.5),
      overhead: Math.round(estimate * 0.1),
      total: Math.round(estimate * 2.0)
    });
  }, [design]);

  // AI-powered suggestions
  const generateAISuggestions = useCallback(() => {
    const suggestions = [];
    
    // Material-based suggestions
    if (design.specifications.material === 'Steel') {
      suggestions.push({
        type: 'material',
        icon: '🛡️',
        title: 'Corrosion Protection Recommended',
        description: 'Consider galvanized or powder-coated finish for outdoor applications'
      });
    }
    
    if (design.specifications.material === 'Glass' || design.specifications.material === 'Tempered Glass') {
      suggestions.push({
        type: 'safety',
        icon: '⚡',
        title: 'Safety Enhancement',
        description: 'Add laminated glass for increased safety and sound insulation'
      });
    }
    
    // Budget-based suggestions
    const estTotal = estimatedCost?.total || 0;
    if (design.budget.max && estTotal > design.budget.max) {
      suggestions.push({
        type: 'budget',
        icon: '💰',
        title: 'Budget Optimization',
        description: `Estimated cost (₹${estTotal}) exceeds budget. Consider alternative materials or simplified design.`
      });
    }
    
    // Project type suggestions
    if (design.projectType === 'Gate' && !design.specifications.features.includes('Automation')) {
      suggestions.push({
        type: 'feature',
        icon: '🤖',
        title: 'Smart Automation',
        description: 'Add automated gate opener for enhanced convenience and security'
      });
    }
    
    if (design.projectType === 'Door' && design.buildingType === 'Commercial') {
      suggestions.push({
        type: 'compliance',
        icon: '📋',
        title: 'Fire Safety Code',
        description: 'Ensure compliance with fire-rated door requirements for commercial buildings'
      });
    }
    
    // Timeline suggestions
    const startDate = new Date(design.timeline.startDate);
    const endDate = new Date(design.timeline.endDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 14 && design.category === 'Industrial') {
      suggestions.push({
        type: 'timeline',
        icon: '⏰',
        title: 'Timeline Advisory',
        description: 'Industrial projects typically require 3-6 weeks. Consider extending timeline.'
      });
    }
    
    setAiSuggestions(suggestions);
  }, [design, estimatedCost]);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (user && design.projectName) {
      setAutoSaving(true);
      localStorage.setItem('draft_design', JSON.stringify(design));
      setTimeout(() => setAutoSaving(false), 1000);
    }
  }, [design, user]);

  // Progress calculation
  const calculateProgress = useCallback(() => {
    const fields = [
      design.projectName,
      design.projectType,
      design.specifications.material,
      design.specifications.color,
      design.budget.min,
      design.timeline.startDate,
      design.location.city,
      design.description
    ];
    
    const filledFields = fields.filter(field => field && field !== '').length;
    const progress = Math.round((filledFields / fields.length) * 100);
    setCompletionProgress(progress);
  }, [design]);

  // File upload handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      preview: URL.createObjectURL(file)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  // Enhanced AI Chatbot Response Generator with Advanced Intelligence
  const generateChatResponse = (message) => {
    const msg = message.toLowerCase();
    const { projectType, category } = design;
    const materialName = design.specifications?.material;
    const { width, height } = design.specifications.dimensions;
    
    // Track conversation context
    setConversationContext(prev => [...prev, msg].slice(-5));
    
    // Smart Form Auto-Fill Feature
    let formUpdated = false;
    let updateMessage = '';
    
    // Auto-detect and fill Project Type
    if (msg.match(/(?:i need|want|building|planning|project for)\s+(?:a\s+)?(?:new\s+)?(roof|roofing|ceiling)/i)) {
      setDesign(prev => ({ ...prev, projectType: 'Roofing', category: 'Mechanical' }));
      formUpdated = true;
      updateMessage += '✅ Project Type set to **Roofing**\n';
    } else if (msg.match(/(?:i need|want|building|planning|project for)\s+(?:a\s+)?(?:new\s+)?(door|entrance|entry)/i)) {
      setDesign(prev => ({ ...prev, projectType: 'Door', category: 'Mechanical' }));
      formUpdated = true;
      updateMessage += '✅ Project Type set to **Door**\n';
    } else if (msg.match(/(?:i need|want|building|planning|project for)\s+(?:a\s+)?(?:new\s+)?(window|windows|glass)/i)) {
      setDesign(prev => ({ ...prev, projectType: 'Window', category: 'Mechanical' }));
      formUpdated = true;
      updateMessage += '✅ Project Type set to **Window**\n';
    } else if (msg.match(/(?:i need|want|building|planning|project for)\s+(?:a\s+)?(?:new\s+)?(gate|gateway|entrance gate)/i)) {
      setDesign(prev => ({ ...prev, projectType: 'Gate', category: 'Mechanical' }));
      formUpdated = true;
      updateMessage += '✅ Project Type set to **Gate**\n';
    }
    
    // Auto-detect and fill Building Type
    if (msg.match(/\b(commercial|office|business|shop|store|mall)\b/i)) {
      setDesign(prev => ({ ...prev, buildingType: 'Commercial' }));
      formUpdated = true;
      updateMessage += '✅ Building Type set to **Commercial**\n';
    } else if (msg.match(/\b(residential|home|house|apartment|condo)\b/i)) {
      setDesign(prev => ({ ...prev, buildingType: 'Residential' }));
      formUpdated = true;
      updateMessage += '✅ Building Type set to **Residential**\n';
    } else if (msg.match(/\b(industrial|factory|warehouse|plant)\b/i)) {
      setDesign(prev => ({ ...prev, buildingType: 'Industrial' }));
      formUpdated = true;
      updateMessage += '✅ Building Type set to **Industrial**\n';
    }
    
    // Auto-detect and fill Dimensions
    const dimensionMatch = msg.match(/(\d+(?:\.\d+)?)\s*(?:ft|feet|foot|')?\s*(?:x|by|×)\s*(\d+(?:\.\d+)?)\s*(?:ft|feet|foot|')?/i);
    if (dimensionMatch) {
      const w = parseFloat(dimensionMatch[1]);
      const h = parseFloat(dimensionMatch[2]);
      setDesign(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          dimensions: { ...prev.specifications.dimensions, width: w, height: h }
        }
      }));
      formUpdated = true;
      updateMessage += `✅ Dimensions set to **${w}ft × ${h}ft**\n`;
    }
    
    // Auto-detect and fill Material
    if (msg.match(/\b(steel|stainless steel|mild steel)\b/i)) {
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, material: 'Steel' }
      }));
      formUpdated = true;
      updateMessage += '✅ Material set to **Steel**\n';
    } else if (msg.match(/\b(aluminum|aluminium)\b/i)) {
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, material: 'Aluminum' }
      }));
      formUpdated = true;
      updateMessage += '✅ Material set to **Aluminum**\n';
    } else if (msg.match(/\b(wood|wooden|teak|oak|mahogany)\b/i)) {
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, material: 'Wood' }
      }));
      formUpdated = true;
      updateMessage += '✅ Material set to **Wood**\n';
    } else if (msg.match(/\b(glass|tempered glass|laminated glass)\b/i)) {
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, material: 'Glass' }
      }));
      formUpdated = true;
      updateMessage += '✅ Material set to **Glass**\n';
    }
    
    // Auto-detect and fill Budget
    const budgetMatch = msg.match(/budget\s+(?:is\s+)?(?:around\s+)?(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand|lakhs?)?/i);
    if (budgetMatch) {
      let budget = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (msg.match(/\b(k|thousand)\b/i)) budget *= 1000;
      if (msg.match(/\blakh?s?\b/i)) budget *= 100000;
      
      setDesign(prev => ({
        ...prev,
        budget: { ...prev.budget, min: budget * 0.8, max: budget * 1.2 }
      }));
      formUpdated = true;
      updateMessage += `✅ Budget range set to **₹${(budget * 0.8).toLocaleString()} - ₹${(budget * 1.2).toLocaleString()}**\n`;
    }
    
    // Auto-detect and fill Project Name
    const projectNameMatch = msg.match(/(?:project name|call it|name it|named?)\s+(?:is\s+)?["']?([^"',.!?\n]+)["']?/i);
    if (projectNameMatch) {
      const name = projectNameMatch[1].trim();
      setDesign(prev => ({ ...prev, projectName: name }));
      formUpdated = true;
      updateMessage += `✅ Project Name set to **"${name}"**\n`;
    }
    
    // Auto-detect and add Features
    if (msg.match(/\b(automation|automated|automatic|smart|motorized)\b/i)) {
      setDesign(prev => ({
        ...prev,
        features: [...new Set([...prev.features, 'Automation'])]
      }));
      formUpdated = true;
      updateMessage += '✅ Added feature: **Automation**\n';
    }
    if (msg.match(/\b(security|safe|secure|lock|deadbolt)\b/i)) {
      setDesign(prev => ({
        ...prev,
        features: [...new Set([...prev.features, 'Security System'])]
      }));
      formUpdated = true;
      updateMessage += '✅ Added feature: **Security System**\n';
    }
    if (msg.match(/\b(fire.?resistant|fire.?rated|fire.?proof)\b/i)) {
      setDesign(prev => ({
        ...prev,
        features: [...new Set([...prev.features, 'Fire-Resistant'])]
      }));
      formUpdated = true;
      updateMessage += '✅ Added feature: **Fire-Resistant**\n';
    }
    
    // Auto-detect and fill Color
    const colorMatch = msg.match(/\b(black|white|gray|grey|silver|gold|brown|red|blue|green)\b/i);
    if (colorMatch) {
      const color = colorMatch[1].charAt(0).toUpperCase() + colorMatch[1].slice(1).toLowerCase();
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, color: color }
      }));
      formUpdated = true;
      updateMessage += `✅ Color set to **${color}**\n`;
    }
    
    // If form was updated, prepend the update message
    if (formUpdated) {
      updateMessage += '\n📝 **Form automatically updated!** Check the form above.\n\n';
      toast.success('Form fields updated automatically!', { duration: 3000 });
    }
    
    // Detect project type from user's message with better pattern matching
    let detectedType = null;
    if (msg.match(/roof|roofing|ceiling|tiles|shingle/)) {
      detectedType = 'Roofing';
    } else if (msg.match(/door|entrance|entry|doorway/)) {
      detectedType = 'Door';
    } else if (msg.match(/window|glass|pane|sash/)) {
      detectedType = 'Window';
    } else if (msg.match(/gate|entrance|driveway|main gate/)) {
      detectedType = 'Gate';
    }
    
    // If user mentions a different project type, suggest it
    if (detectedType && detectedType !== projectType) {
      const suggestions = {
        'Roofing': 'I can help you with roofing! 🏠\n\n**For residential roofing, consider:**\n- **Asphalt Shingles**: Affordable, 20-30 year lifespan (₹250-420/sq ft)\n- **Metal Roofing**: Durable, energy-efficient, 40-70 years (₹580-1000/sq ft)\n- **Tile Roofing**: Premium, 50+ years, excellent for hot climates (₹830-1500/sq ft)\n\n**I recommend:**\n1. Change "Project Type" above to "Roofing"\n2. Select your building type (Residential/Commercial)\n3. Enter roof area in square feet\n\nWhat type of building is this for?',
        'Door': 'Perfect! Let me help with your door project 🚪\n\n**Material options:**\n- **Teak Wood**: Premium, durable (₹10,000/unit)\n- **Steel**: Secure, fire-resistant (₹4,150/unit)\n- **Aluminum**: Lightweight (₹5,000/unit)\n\n**Standard sizes:**\n- Residential: 3ft x 6.67ft\n- Commercial: 3ft x 7ft\n\nChange "Project Type" to "Door" above to get started!',
        'Window': 'Great choice! For windows 🪟\n\n**Recommended materials:**\n- **Tempered Glass**: Safety first (₹5,800/unit)\n- **Aluminum Frame**: Low maintenance (₹5,000/unit)\n- **uPVC Frame**: Energy-efficient (₹4,565/unit)\n\n**Common sizes:**\n- Small: 2ft x 3ft\n- Medium: 3ft x 4ft\n- Large: 4ft x 5ft\n\nSet "Project Type" to "Window" above!',
        'Gate': 'I can help with your gate design! 🚧\n\n**Material options:**\n- **Stainless Steel**: Weather-proof (₹6,640/unit)\n- **Wrought Iron**: Classic look (₹7,055/unit)\n- **Aluminum**: Rust-resistant (₹5,000/unit)\n\n**Sizes:**\n- Pedestrian: 4ft x 6ft\n- Single Vehicle: 12ft x 6ft\n- Double Vehicle: 24ft x 6ft\n\nChange "Project Type" to "Gate" to begin!'
      };
      return suggestions[detectedType];
    }
    
    if (msg.includes('material') || msg.includes('what material')) {
      if (projectType === 'Roofing') {
        return updateMessage + 'For roofing, best materials are: 🏠\n- **Asphalt Shingles**: Most common, affordable, 20-30 years (₹250-420/sq ft)\n- **Metal Roofing**: Long-lasting, energy-efficient, 40-70 years (₹580-1000/sq ft)\n- **Clay/Concrete Tiles**: Premium, 50+ years, fire-resistant (₹830-1500/sq ft)\n- **Slate**: Ultra-premium, 100+ years, very heavy (₹1245-2490/sq ft)\n\nConsider your climate, budget, and building structure!';
      } else if (projectType === 'Door') {
        return updateMessage + 'For doors, I recommend: 🚪\n- **Teak Wood**: Premium, durable, aesthetic (₹10,000/unit)\n- **Steel**: Secure, affordable, fire-resistant (₹4,150/unit)\n- **Aluminum**: Lightweight, corrosion-resistant (₹5,000/unit)\nConsider your budget and location (interior vs exterior).';
      } else if (projectType === 'Window') {
        return updateMessage + 'For windows, best options are: 🪟\n- **Tempered Glass**: Safety first, break-resistant ($70/unit)\n- **Aluminum Frame**: Durable, low maintenance ($60/unit)\n- **Oak Wood Frame**: Traditional, insulating ($90/unit)';
      } else if (projectType === 'Gate') {
        return updateMessage + 'For gates, consider: 🚧\n- **Stainless Steel**: Weather-proof, strong ($80/unit)\n- **Wrought Iron**: Classic, secure ($85/unit)\n- **Steel**: Cost-effective, can be powder-coated ($50/unit)';
      }
      return updateMessage + 'Material selection depends on your project type. Common options: Steel (durable), Wood (aesthetic), Aluminum (lightweight), Glass (modern). What are you building?';
    }
    
    if (msg.includes('cost') || msg.includes('price') || msg.includes('budget')) {
      if (estimatedCost) {
        return `Based on your current design:\n💰 **Estimated Cost: ₹${estimatedCost.total.toLocaleString()}**\n- Base: ₹${estimatedCost.base.toLocaleString()}\n- Materials: ₹${estimatedCost.materials.toLocaleString()}\n- Labor: ₹${estimatedCost.labor.toLocaleString()}\n\nTips to reduce cost:\n- Choose standard dimensions\n- Opt for Steel over premium materials\n- Reduce custom features`;
      }
      return 'Fill in your project details (dimensions, material, features) and I\'ll calculate a real-time estimate! Budget planning is crucial for engineering projects.';
    }
    
    // Installation & Maintenance queries
    if (msg.match(/install|installation|how to install|fitting/)) {
      return 'Installation Guide: 🔧\n\n**Professional Installation Recommended**\n- Doors/Windows: 1-2 days\n- Gates: 2-3 days (with automation: 3-4 days)\n- Roofing: 3-7 days (depends on area)\n\n**DIY Considerations:**\n✅ Proper tools required\n✅ Building codes compliance\n✅ Warranty may require professional install\n✅ Safety equipment necessary\n\n**Included in our service:**\n• Site preparation\n• Professional installation\n• Post-install inspection\n• 1-year installation warranty\n\nWould you like a detailed installation timeline?';
    }
    
    if (msg.match(/maintain|maintenance|care|clean|upkeep/)) {
      return 'Maintenance Tips: 🧹\n\n**Regular Maintenance (Every 6 months):**\n\n**Doors/Gates:**\n• Lubricate hinges and locks\n• Check weather stripping\n• Clean with mild soap\n• Inspect for rust/corrosion\n\n**Windows:**\n• Clean glass with non-abrasive cleaner\n• Check seals and caulking\n• Lubricate sliding mechanisms\n• Inspect frames for damage\n\n**Roofing:**\n• Clear debris and leaves\n• Inspect for damaged shingles\n• Clean gutters\n• Check for leaks after rain\n\n**Pro tip:** Schedule annual professional inspection!';
    }
    
    if (msg.match(/warranty|guarantee|coverage|protection/)) {
      return 'Warranty Coverage: 🛡️\n\n**Standard Warranty:**\n• Materials: 10-25 years (manufacturer)\n• Installation: 1 year (our service)\n• Hardware: 2-5 years\n\n**Extended Protection Available:**\n• Premium Warranty: +$500 (5 years full coverage)\n• Lifetime Structural Warranty: +$1,200\n\n**Covered:**\n✅ Manufacturing defects\n✅ Installation errors\n✅ Structural issues\n✅ Hardware failures\n\n**Not Covered:**\n❌ Normal wear & tear\n❌ Weather damage\n❌ Improper maintenance\n❌ Unauthorized modifications\n\nNeed extended warranty details?';
    }
    
    if (msg.match(/weather|climate|rain|sun|wind|snow|resistant/)) {
      return 'Weather Resistance Guide: ☀️🌧️\n\n**Climate Considerations:**\n\n**Hot/Sunny Climates:**\n• UV-resistant coatings\n• Reflective materials\n• Heat-resistant seals\n• Light colors recommended\n\n**Rainy/Humid Climates:**\n• Waterproof materials\n• Rust-resistant hardware\n• Proper drainage design\n• Anti-corrosion coating\n\n**Cold/Snowy Climates:**\n• Insulated materials\n• Weather stripping\n• Freeze-resistant components\n• Snow load calculations\n\n**Coastal Areas:**\n• Marine-grade stainless steel\n• Salt-resistant finishes\n• Enhanced corrosion protection\n\nWhat\'s your climate like?';
    }
    
    if (msg.match(/compare|comparison|vs|versus|difference|better/)) {
      return 'Material Comparison: 📊\n\n**Steel vs Aluminum:**\n• Steel: Stronger, heavier, needs coating ($50/unit)\n• Aluminum: Rust-proof, lighter, more expensive ($60/unit)\n\n**Wood vs Metal:**\n• Wood: Natural look, needs maintenance, insulating ($90-120/unit)\n• Metal: Low maintenance, modern, durable ($50-80/unit)\n\n**Asphalt vs Metal Roofing:**\n• Asphalt: Cheaper upfront, 20-30 years ($3-5/sq ft)\n• Metal: Higher cost, 50+ years, energy-efficient ($7-12/sq ft)\n\n**Budget vs Premium:**\n• Budget: Basic function, shorter lifespan, standard look\n• Premium: Enhanced features, longer warranty, better aesthetics\n\nWhich materials would you like to compare in detail?';
    }
    
    if (msg.match(/energy|efficiency|insulation|thermal|saving/)) {
      return 'Energy Efficiency Guide: ⚡💡\n\n**Energy-Saving Features:**\n\n**Windows:**\n• Double/Triple glazing: 30-50% heat reduction\n• Low-E coating: Blocks UV, retains heat\n• Gas-filled panes: Better insulation\n• **Savings**: $100-300/year on energy bills\n\n**Doors:**\n• Insulated core: R-value 15-20\n• Weather stripping: Prevents drafts\n• Thermal break: Reduces heat transfer\n\n**Roofing:**\n• Cool roof coating: Reflects 65-90% of sun\n• Proper ventilation: Reduces AC load 15-20%\n• Insulation: R-30 to R-60 recommended\n• **Payback**: 3-7 years\n\n**ROI:** Energy-efficient upgrades can increase home value by 5-10%!';
    }
    
    if (msg.match(/permit|code|regulation|legal|approval/)) {
      return 'Permits & Regulations: 📋\n\n**Typically Required Permits:**\n\n**Roofing:**\n✅ Building permit (always)\n✅ Structural approval\n✅ HOA approval (if applicable)\n• Cost: $200-500\n• Processing: 2-4 weeks\n\n**Doors/Windows (Exterior):**\n✅ Building permit (major changes)\n✅ Energy compliance\n• Cost: $50-150\n• Processing: 1-2 weeks\n\n**Gates (Automated):**\n✅ Electrical permit\n✅ Safety compliance\n✅ Setback requirements\n• Cost: $100-300\n\n**We Handle:**\n• Permit applications\n• Code compliance verification\n• Inspector coordination\n• Documentation\n\n**Note:** Requirements vary by location!';
    }
    
    if (msg.match(/calculate|calculator|math|compute|estimate/)) {
      if (width && height) {
        const area = parseFloat(width) * parseFloat(height);
        return `Quick Calculator: 🧮\n\n**Your Dimensions:** ${width}ft × ${height}ft\n**Area:** ${area.toFixed(2)} square feet\n\n**Useful Calculations:**\n• Roofing material needed: ${(area * 1.15).toFixed(2)} sq ft (15% waste factor)\n• Paint required: ${(area / 350).toFixed(2)} gallons\n• Approximate weight: ${(area * 3).toFixed(2)} lbs (standard materials)\n\n**Cost Estimates by Material:**\n• Steel: $${(area * 50).toFixed(2)}\n• Aluminum: $${(area * 60).toFixed(2)}\n• Wood: $${(area * 90).toFixed(2)}\n\nNeed more calculations?`;
      }
      return 'Quick Calculator: 🧮\n\nI can help calculate:\n• Material quantities\n• Cost estimates\n• Area/volume\n• Paint needed\n• Installation time\n\nEnter your dimensions above (width × height) and ask me to calculate!';
    }
    
    if (msg.includes('dimension') || msg.includes('size') || msg.includes('how big')) {
      if (projectType === 'Roofing') {
        return 'Roofing Measurements: 🏠📏\n\n**How to Measure:**\n1. Measure roof length and width\n2. Calculate area (L × W)\n3. Multiply by roof pitch factor\n4. Add 10-15% for waste\n\n**Typical House Sizes:**\n• Small (1000 sq ft home): 1,200-1,500 sq ft roof\n• Medium (1500 sq ft home): 1,800-2,200 sq ft roof\n• Large (2500 sq ft home): 3,000-3,500 sq ft roof\n\n**Pitch Multipliers:**\n• Flat (1:12): 1.00×\n• Low (4:12): 1.05×\n• Medium (6:12): 1.12×\n• Steep (12:12): 1.41×\n\nNeed help calculating your roof area?';
      } else if (projectType === 'Door') {
        return 'Standard door dimensions: 🚪\n- **Residential Interior**: 30" x 80" or 32" x 80"\n- **Residential Exterior**: 36" x 80" (3ft x 6.67ft)\n- **Commercial**: 36" x 84" (3ft x 7ft)\n- **Double Door**: 60-72" x 80" (5-6ft x 6.67ft)\n- **Garage**: 8-9ft x 7ft (single) or 16ft x 7ft (double)\n\n**Opening Size:** Add 2-3" to door size for frame\n\nCustom sizes available! Enter dimensions in feet.';
      } else if (projectType === 'Window') {
        return 'Common window sizes: 🪟\n\n**Standard Heights:** 3-6 feet\n**Standard Widths:** 2-8 feet\n\n**Popular Sizes:**\n- **Small**: 24" x 36" (2ft x 3ft) - Bathrooms\n- **Medium**: 36" x 48" (3ft x 4ft) - Bedrooms\n- **Large**: 48" x 60" (4ft x 5ft) - Living rooms\n- **Picture Window**: 72" x 48" (6ft x 4ft)\n- **Bay Window**: Custom configurations\n\n**Rough Opening:** Add 1-2" for installation\n\nEnter width × height in feet!';
      } else if (projectType === 'Gate') {
        return 'Gate sizing guide: 🚧\n\n**Pedestrian Gates:**\n- Standard: 3-4ft wide × 5-6ft tall\n- ADA Compliant: 36" minimum width\n\n**Vehicle Gates:**\n- Single Car: 10-12ft wide × 5-7ft tall\n- Double Car: 20-24ft wide × 5-7ft tall\n- RV/Truck: 14-16ft wide × 8-10ft tall\n\n**Commercial:**\n- Delivery: 12-14ft wide\n- Loading Dock: 16-20ft wide\n\n**Clearance:** Add 6-12" to vehicle width\n**Swing Space:** Consider gate arc radius\n\nMeasure your opening accurately!';
      }
      return 'Dimensions are critical! Measure your space: Width (ft) × Height (ft). For roofing, include total area in square feet. I can help calculate material needs!';
    }
    
    if (msg.includes('feature') || msg.includes('add') || msg.includes('include')) {
      return 'Popular features by category: ✨\n\n**Doors**: Auto-closer, deadbolt lock, fire-rating, vision panel\n**Windows**: Double-glazing, UV coating, security bars, mosquito mesh\n**Gates**: Automation, intercom, CCTV, remote control\n**Roofing**: Insulation, skylights, solar panels, waterproofing\n\nEach feature adds ~$200 to cost but increases value!';
    }
    
    if (msg.includes('timeline') || msg.includes('how long') || msg.includes('duration')) {
      const categoryTime = {
        'Mechanical': '2-4 weeks',
        'Industrial': '3-6 weeks',
        'Consulting': '1-3 weeks',
        'Maintenance': '1-2 weeks'
      };
      const time = categoryTime[category] || '2-4 weeks';
      return `Typical timeline for ${category || 'your'} projects: ⏱️\n\n**${time}** (includes design, approval, fabrication, installation)\n\nFactors affecting timeline:\n- Custom features (+1 week)\n- Premium materials (+3-5 days)\n- Complex designs (+1-2 weeks)\n\nWe'll provide exact timeline after reviewing your design!`;
    }
    
    if (msg.includes('safety') || msg.includes('compliance') || msg.includes('code')) {
      return 'Safety & Compliance checklist: 🛡️\n\n✅ **Fire Safety**: Fire-rated materials for commercial\n✅ **Structural**: Load calculations for roofing\n✅ **Security**: Proper locking mechanisms\n✅ **Weather**: Corrosion protection for exterior\n✅ **Standards**: Compliance with local building codes\n\nOur team ensures all designs meet regulatory requirements!';
    }
    
    if (msg.includes('help') || msg.includes('guide') || msg.includes('how to')) {
      return 'I can help you with: 🤖\n\n1️⃣ **Material Selection** - Best options for your project\n2️⃣ **Cost Estimation** - Real-time budget calculations\n3️⃣ **Dimensions** - Standard sizes and custom requirements\n4️⃣ **Features** - Available add-ons and upgrades\n5️⃣ **Timeline** - Project duration estimates\n6️⃣ **Safety** - Compliance and regulations\n\nJust ask me anything like "What material for doors?" or "How much will it cost?"';
    }
    
    if (msg.includes('save') || msg.includes('draft')) {
      return 'Your project auto-saves every 30 seconds! 💾\n\nYou can also:\n- Click **"Save as Draft"** to manually save\n- Reload page to continue where you left off\n- Drafts stored in your browser\n\nNever lose your progress!';
    }
    
    if (msg.includes('upload') || msg.includes('file') || msg.includes('blueprint')) {
      return 'File Upload Tips: 📁\n\n✅ **Supported**: Images (JPG, PNG), PDF, DWG, CAD files\n✅ **Drag & Drop**: Just drop files in the upload zone\n✅ **Multiple Files**: Upload references, blueprints, inspiration\n\nFiles help our team understand your vision better! Max 10MB per file.';
    }
    
    // Smart follow-up based on conversation context
    const lastTopics = conversationContext.slice(-3).join(' ');
    if (lastTopics.includes('cost') && !lastTopics.includes('save')) {
      return updateMessage + 'Cost Follow-up: 💡\n\nSince we discussed costs, here are ways to **save money**:\n\n1️⃣ **Choose standard sizes** (-15-20%)\n2️⃣ **Bundle multiple projects** (-10-15%)\n3️⃣ **Off-season installation** (-10% in winter)\n4️⃣ **Mid-grade materials** (best value/durability ratio)\n5️⃣ **Skip premium features** initially, upgrade later\n\n**Financing Options:**\n• 0% APR for 12 months\n• Low monthly payments\n• Home improvement loans\n\nWant to know about material alternatives that cost less?';
    }
    
    if (lastTopics.includes('material') && !lastTopics.includes('install')) {
      return updateMessage + 'Next Step: 🔨\n\nNow that you\'ve chosen materials, let\'s talk about:\n\n**Installation:**\n• Professional vs DIY\n• Timeline expectations\n• Site preparation\n• Permits needed\n\n**Or learn about:**\n• Maintenance requirements\n• Warranty coverage\n• Energy efficiency\n• Weather resistance\n\nWhat would you like to know next?';
    }
    
    // Default response - be more intelligent
    if (projectType && projectType !== 'Door' && materialName) {
      const progressItems = [];
      if (materialName) progressItems.push('✅ Material selected');
      if (width && height) progressItems.push('✅ Dimensions entered');
      if (estimatedCost) progressItems.push('✅ Cost estimated');
      
      return updateMessage + `Great progress on your **${projectType}** project! ${progressItems.join(' • ')}\n\n${materialName ? `**Material:** ${materialName}` : ''} ${estimatedCost ? `\n**Estimate:** $${estimatedCost.total.toLocaleString()}` : ''}\n\n**Next steps:**\n1. Add features/upgrades\n2. Upload reference images\n3. Submit for review\n\n**Need help with:**\n• Installation timeline\n• Maintenance tips\n• Warranty options\n• Energy efficiency\n• Permit requirements\n\nWhat would you like to explore?`;
    }
    
    return updateMessage + 'Hi! I\'m your **upgraded** Design Assistant AI! 🚀\n\n**Quick Start:**\n🏠 Roofing - "I need roof for my house"\n🚪 Doors - "Door materials"\n🪟 Windows - "Window options"\n🚧 Gates - "Gate design"\n\n**I can also help with:**\n💰 Cost comparisons & budgeting\n📏 Measurements & calculations\n🔧 Installation & maintenance\n⚡ Energy efficiency\n🛡️ Warranties & permits\n☀️ Weather resistance\n\n**Pro tip:** Ask me to compare materials or calculate estimates!\n\n**Smart feature:** Just tell me your project details and I\'ll automatically fill the form for you! Try saying: "I need a steel door 3x7 feet for my residential building"';
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message
    const userMsg = {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);
    
    // Show typing indicator
    setIsTyping(true);
    setUserMessage('');
    
    // Simulate AI thinking time (500-1500ms for realism)
    const thinkingTime = 500 + Math.random() * 1000;
    
    setTimeout(() => {
      const response = generateChatResponse(userMessage);
      setIsTyping(false);
      
      const botMsg = {
        type: 'bot',
        text: response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMsg]);
      
      // Scroll to bottom
      setTimeout(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }, thinkingTime);
  };
  
  // Export chat history
  const exportChatHistory = () => {
    const chatText = chatMessages
      .map(msg => `[${msg.timestamp.toLocaleTimeString()}] ${msg.type === 'user' ? 'You' : 'AI'}: ${msg.text}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Chat history exported!');
  };
  
  // Clear chat
  const clearChat = () => {
    setChatMessages([
      { type: 'bot', text: 'Chat cleared! How can I help with your new project?', timestamp: new Date() }
    ]);
    setConversationContext([]);
    toast.info('Chat history cleared');
  };

  // Effects
  useEffect(() => {
    if (design.specifications.material && design.specifications.dimensions.width) {
      calculateEstimate();
    }
  }, [design.specifications, design.category, calculateEstimate]);

  useEffect(() => {
    if (estimatedCost) {
      generateAISuggestions();
    }
  }, [estimatedCost, design, generateAISuggestions]);

  useEffect(() => {
    calculateProgress();
  }, [design, calculateProgress]);

  useEffect(() => {
    const saveInterval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(saveInterval);
  }, [autoSave]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('draft_design');
    if (draft) {
      const shouldLoad = window.confirm('Found a saved draft. Would you like to continue from where you left off?');
      if (shouldLoad) {
        setDesign(JSON.parse(draft));
        toast.info('Draft loaded successfully');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to create a design');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/designs', design, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Design created successfully! Our team will review it soon.');
      navigate('/designs/my-designs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create design');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black relative overflow-hidden">
      {/* Main Content Wrapper - Slides left when chat opens */}
      <motion.div
        animate={{ 
          marginRight: chatOpen ? '500px' : '0'
        }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 150,
          mass: 0.8,
          restDelta: 0.001
        }}
        className="min-h-screen py-12 px-4 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Stats Widget */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          right: chatOpen ? '516px' : '16px'
        }}
        transition={{ 
          delay: 1,
          x: { type: 'spring', damping: 30, stiffness: 150, mass: 0.8 },
          right: { type: 'spring', damping: 30, stiffness: 150, mass: 0.8, restDelta: 0.001 },
          opacity: { duration: 0.4, ease: 'easeInOut' }
        }}
        className="fixed top-1/4 z-30 hidden lg:block"
      >
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="luxury-card p-4 rounded-xl border border-primary-500/30 backdrop-blur-lg bg-luxury-darkGray/80 shadow-xl hover:shadow-2xl hover:shadow-primary-500/20 hover:border-primary-500/50 transition-all duration-300"
        >
          <div className="text-center mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <FiCpu className="text-primary-500 text-3xl mx-auto mb-2" />
            </motion.div>
            <p className="text-xs text-gray-400 font-semibold">LIVE STATUS</p>
          </div>
          <div className="space-y-3">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.div 
                className="text-2xl font-bold text-white"
                key={completionProgress}
                initial={{ scale: 1.2, color: '#2196f3' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.5 }}
              >
                {completionProgress}%
              </motion.div>
              <div className="text-xs text-gray-400">Complete</div>
            </motion.div>
            <div className="border-t border-primary-500/20 pt-2">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <motion.div 
                  className="text-lg font-bold text-primary-500"
                  key={estimatedCost?.total}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {estimatedCost ? `$${estimatedCost.total.toLocaleString()}` : '--'}
                </motion.div>
                <div className="text-xs text-gray-400">Estimated</div>
              </motion.div>
            </div>
            <div className="border-t border-primary-500/20 pt-2">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <motion.div 
                  className="text-lg font-bold text-purple-500"
                  key={aiSuggestions.length}
                  initial={{ scale: 1.3, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {aiSuggestions.length}
                </motion.div>
                <div className="text-xs text-gray-400">AI Tips</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-4">
              <span className="text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text">
                AI-Powered
              </span> Design Studio
            </h1>
            <p className="text-gray-400 text-lg">Create your custom engineering project with intelligent assistance</p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Project Completion</span>
              <span className="text-sm font-semibold text-primary-500">{completionProgress}%</span>
            </div>
            <div className="w-full h-3 bg-luxury-darkGray rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <FiCpu className="text-xl" />
              <span>AI Assistant</span>
              {aiSuggestions.length > 0 && (
                <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {aiSuggestions.length}
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setShowCostBreakdown(!showCostBreakdown)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <FiDollarSign className="text-xl" />
              <span>Cost</span>
              {estimatedCost && (
                <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  ₹{estimatedCost.total.toLocaleString()}
                </span>
              )}
            </button>

            {autoSaving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 px-4 py-3 bg-luxury-darkGray text-primary-500 rounded-lg"
              >
                <FiCheckCircle className="animate-pulse" />
                <span className="text-sm">Auto-saved</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {showAiPanel && aiSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-8 luxury-card p-6 rounded-xl border-2 border-purple-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FiZap className="text-purple-500 text-2xl" />
                  <h3 className="text-xl font-bold text-white">AI-Powered Suggestions</h3>
                </div>
                <button
                  onClick={() => setShowAiPanel(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-luxury-darkGray p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-3xl">{suggestion.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-gray-400">{suggestion.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cost Breakdown Panel */}
        <AnimatePresence>
          {showCostBreakdown && estimatedCost && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-8 luxury-card p-6 rounded-xl border-2 border-green-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="text-green-500 text-2xl" />
                  <h3 className="text-xl font-bold text-white">Real-Time Cost Analysis</h3>
                </div>
                <button
                  onClick={() => setShowCostBreakdown(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-luxury-darkGray p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Base Cost</div>
                  <div className="text-2xl font-bold text-white">${estimatedCost.base.toLocaleString()}</div>
                </div>
                <div className="bg-luxury-darkGray p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Materials</div>
                  <div className="text-2xl font-bold text-primary-500">${estimatedCost.materials.toLocaleString()}</div>
                </div>
                <div className="bg-luxury-darkGray p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Labor</div>
                  <div className="text-2xl font-bold text-yellow-500">${estimatedCost.labor.toLocaleString()}</div>
                </div>
                <div className="bg-luxury-darkGray p-4 rounded-lg border-2 border-green-500/30">
                  <div className="text-gray-400 text-sm mb-1">Total Estimate</div>
                  <div className="text-2xl font-bold text-green-500">${estimatedCost.total.toLocaleString()}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                * Estimates are calculated in real-time based on specifications and may vary
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Start Templates */}
        {!design.projectName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 luxury-card p-6 rounded-xl"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Quick Start Templates</h3>
              <p className="text-gray-400">Choose a template to get started faster</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🚪', name: 'Door Design', type: 'Door', category: 'Mechanical' },
                { icon: '🪟', name: 'Window System', type: 'Window', category: 'Mechanical' },
                { icon: '🚧', name: 'Gate System', type: 'Gate', category: 'Mechanical' },
                { icon: '🏠', name: 'Roofing', type: 'Roofing', category: 'Mechanical' },
              ].map((template, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDesign(prev => ({
                      ...prev,
                      projectType: template.type,
                      category: template.category,
                      projectName: `New ${template.name} Project`
                    }));
                    toast.success(`${template.name} template loaded!`);
                  }}
                  className="bg-luxury-darkGray hover:bg-luxury-gray border-2 border-primary-500/20 hover:border-primary-500 rounded-xl p-6 text-center transition-all group"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{template.icon}</div>
                  <div className="text-white font-semibold">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{template.category}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Project Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Project Name *</label>
                    <input
                      type="text"
                      name="projectName"
                      value={design.projectName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Main Entrance Gate Design"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Project Type *</label>
                      <select
                        name="projectType"
                        value={design.projectType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Door">Door</option>
                        <option value="Window">Window</option>
                        <option value="Gate">Gate</option>
                        <option value="Roofing">Roofing</option>
                        <option value="HVAC">HVAC</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Category *</label>
                      <select
                        name="category"
                        value={design.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Mechanical">Mechanical</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Building Type</label>
                    <select
                      name="buildingType"
                      value={design.buildingType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Mall">Mall</option>
                      <option value="Office">Office</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={design.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe your project requirements..."
                    />
                  </div>
                </div>
              </motion.div>

              {/* Specifications */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Specifications</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Dimensions</label>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="number"
                        name="specifications.dimensions.width"
                        value={design.specifications.dimensions.width}
                        onChange={handleInputChange}
                        placeholder="Width"
                        className="px-3 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        name="specifications.dimensions.height"
                        value={design.specifications.dimensions.height}
                        onChange={handleInputChange}
                        placeholder="Height"
                        className="px-3 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        name="specifications.dimensions.depth"
                        value={design.specifications.dimensions.depth}
                        onChange={handleInputChange}
                        placeholder="Depth"
                        className="px-3 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <select
                        name="specifications.dimensions.unit"
                        value={design.specifications.dimensions.unit}
                        onChange={handleInputChange}
                        className="px-3 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="feet">ft</option>
                        <option value="meters">m</option>
                        <option value="inches">in</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Material *</label>
                      <select
                        name="specifications.material"
                        value={design.specifications.material}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Material</option>
                        <optgroup label="Metals">
                          <option value="Steel">Steel</option>
                          <option value="Stainless Steel">Stainless Steel</option>
                          <option value="Aluminum">Aluminum</option>
                          <option value="Brass">Brass</option>
                          <option value="Bronze">Bronze</option>
                          <option value="Iron">Iron</option>
                          <option value="Galvanized Steel">Galvanized Steel</option>
                        </optgroup>
                        <optgroup label="Wood">
                          <option value="Teak Wood">Teak Wood</option>
                          <option value="Oak Wood">Oak Wood</option>
                          <option value="Pine Wood">Pine Wood</option>
                          <option value="Mahogany">Mahogany</option>
                          <option value="Plywood">Plywood</option>
                        </optgroup>
                        <optgroup label="Glass & Acrylic">
                          <option value="Tempered Glass">Tempered Glass</option>
                          <option value="Laminated Glass">Laminated Glass</option>
                          <option value="Acrylic Sheet">Acrylic Sheet</option>
                          <option value="Polycarbonate">Polycarbonate</option>
                        </optgroup>
                        <optgroup label="Composite">
                          <option value="UPVC">UPVC</option>
                          <option value="Fiber Glass">Fiber Glass</option>
                          <option value="Composite Panel">Composite Panel</option>
                          <option value="WPC (Wood Plastic)">WPC (Wood Plastic)</option>
                        </optgroup>
                        <optgroup label="Concrete & Stone">
                          <option value="Concrete">Concrete</option>
                          <option value="Granite">Granite</option>
                          <option value="Marble">Marble</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Color *</label>
                      <select
                        name="specifications.color"
                        value={design.specifications.color}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Color</option>
                        <optgroup label="Neutral">
                          <option value="White">White</option>
                          <option value="Black">Black</option>
                          <option value="Gray">Gray</option>
                          <option value="Silver">Silver</option>
                          <option value="Beige">Beige</option>
                          <option value="Cream">Cream</option>
                        </optgroup>
                        <optgroup label="Earth Tones">
                          <option value="Brown">Brown</option>
                          <option value="Wood Finish">Wood Finish</option>
                          <option value="Walnut">Walnut</option>
                          <option value="Teak">Teak</option>
                          <option value="Oak">Oak</option>
                        </optgroup>
                        <optgroup label="Classic Colors">
                          <option value="Red">Red</option>
                          <option value="Blue">Blue</option>
                          <option value="Green">Green</option>
                          <option value="Yellow">Yellow</option>
                          <option value="Orange">Orange</option>
                        </optgroup>
                        <optgroup label="Metallic">
                          <option value="Gold">Gold</option>
                          <option value="Bronze">Bronze</option>
                          <option value="Copper">Copper</option>
                          <option value="Champagne">Champagne</option>
                          <option value="Gunmetal">Gunmetal</option>
                        </optgroup>
                        <optgroup label="Special">
                          <option value="Transparent">Transparent</option>
                          <option value="Frosted">Frosted</option>
                          <option value="Custom Color">Custom Color</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Finish</label>
                    <input
                      type="text"
                      name="specifications.finish"
                      value={design.specifications.finish}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Powder Coated, Polished"
                    />
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <FiUpload />
                        <span>Upload Blueprints / References</span>
                      </div>
                    </label>
                    <div className="border-2 border-dashed border-primary-500/30 rounded-lg p-6 text-center hover:border-primary-500/60 transition-all cursor-pointer bg-luxury-darkGray/50">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.dwg"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <FiBox className="text-4xl text-primary-500 mx-auto mb-2" />
                        <p className="text-white font-semibold mb-1">Drop files here or click to upload</p>
                        <p className="text-sm text-gray-400">Supports: Images, PDF, DWG, CAD files</p>
                      </label>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-luxury-darkGray px-3 py-2 rounded">
                            <div className="flex items-center space-x-2">
                              <FiLayers className="text-primary-500" />
                              <div>
                                <span className="text-gray-300 text-sm">{file.name}</span>
                                <span className="text-gray-500 text-xs ml-2">({file.size})</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-400"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Features</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-4 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Add feature"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-primary-500 text-black font-semibold rounded-lg hover:bg-primary-600"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {design.specifications.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between bg-luxury-darkGray px-3 py-2 rounded">
                          <span className="text-gray-300">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Budget & Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Budget & Timeline</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Budget Range</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="budget.min"
                        value={design.budget.min}
                        onChange={handleInputChange}
                        placeholder="Min Budget"
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        name="budget.max"
                        value={design.budget.max}
                        onChange={handleInputChange}
                        placeholder="Max Budget"
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Start Date</label>
                      <input
                        type="date"
                        name="timeline.startDate"
                        value={design.timeline.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">End Date</label>
                      <input
                        type="date"
                        name="timeline.endDate"
                        value={design.timeline.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Expected Duration</label>
                    <input
                      type="text"
                      name="timeline.duration"
                      value={design.timeline.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 2-3 weeks"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Location</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Address</label>
                    <input
                      type="text"
                      name="location.address"
                      value={design.location.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">City</label>
                      <input
                        type="text"
                        name="location.city"
                        value={design.location.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">State</label>
                      <input
                        type="text"
                        name="location.state"
                        value={design.location.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="location.zipCode"
                      value={design.location.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Special Requirements</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="flex-1 px-4 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Add requirement"
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="px-4 py-2 bg-primary-500 text-black font-semibold rounded-lg hover:bg-primary-600"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {design.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between bg-luxury-darkGray px-3 py-2 rounded">
                        <span className="text-gray-300">{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            {/* Smart Validation Messages */}
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {design.projectName && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-500 text-sm">
                  <FiCheckCircle />
                  <span>Project Named</span>
                </div>
              )}
              {design.specifications.material && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-500 text-sm">
                  <FiCheckCircle />
                  <span>Material Selected</span>
                </div>
              )}
              {estimatedCost && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-500 text-sm">
                  <FiCheckCircle />
                  <span>Cost Calculated</span>
                </div>
              )}
              {completionProgress < 60 && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-500 text-sm">
                  <FiAlertCircle />
                  <span>More details recommended</span>
                </div>
              )}
            </div>

            {/* Enhanced Submit Button */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('draft_design', JSON.stringify(design));
                  toast.success('Draft saved successfully!');
                }}
                className="px-8 py-4 bg-luxury-darkGray border-2 border-primary-500/30 text-white font-bold rounded-xl text-lg flex items-center justify-center space-x-3 hover:border-primary-500 transition-all"
              >
                <FiSave />
                <span>Save as Draft</span>
              </button>

              <motion.button
                type="submit"
                disabled={loading || !design.projectName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-4 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white font-bold rounded-xl text-lg flex items-center justify-center space-x-3 shadow-primary-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <FiZap className="relative z-10" />
                <span className="relative z-10">{loading ? 'Processing...' : 'Submit to AI Review'}</span>
                <motion.div
                  animate={{
                    rotate: loading ? 360 : 0
                  }}
                  transition={{
                    duration: 1,
                    repeat: loading ? Infinity : 0,
                    ease: "linear"
                  }}
                  className="relative z-10"
                >
                  {loading && <FiCpu />}
                </motion.div>
              </motion.button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              🔒 Your design will be reviewed by our AI system and engineering team within 24 hours
            </p>
          </motion.div>
        </form>
      </div>
      </motion.div>

      {/* AI Chatbot - Floating Window in Slide Area */}
      <AnimatePresence>
        {chatOpen && (
          <>
            {/* Floating Chat Window - Positioned in cleared space */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 100 }}
              transition={{ 
                type: 'spring', 
                damping: 30, 
                stiffness: 150,
                mass: 0.8,
                restDelta: 0.001
              }}
              className="fixed top-8 right-8 w-[470px] max-w-[95vw] h-[calc(100vh-4rem)] z-50"
            >
              {/* Glassmorphism Effect with rounded corners */}
              <div className="h-full flex flex-col overflow-hidden rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-luxury-darkGray/95 via-luxury-black/95 to-luxury-darkGray/95 border-2 border-primary-500/30 shadow-2xl shadow-primary-500/20">
                {/* Chat Header - Enhanced Design */}
                <div className="relative overflow-hidden flex-shrink-0">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 animate-gradient-x"></div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  <div className="relative p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* AI Avatar with Glow */}
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-primary-100 flex items-center justify-center shadow-lg">
                          <FiCpu className="text-primary-600 text-2xl" />
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-green-400 blur-md"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
                        />
                      </motion.div>
                      
                      <div>
                        <h4 className="text-white font-bold text-xl tracking-tight">Design Assistant</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 bg-green-400 rounded-full"
                          />
                          <p className="text-white/90 text-xs font-medium">AI Online • Ready to assist</p>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setChatOpen(false)}
                      className="text-white/90 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-xl backdrop-blur-sm"
                    >
                      <FiMinimize2 size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Chat Messages - Redesigned */}
                <div id="chat-messages" className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth custom-scrollbar">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex-shrink-0"
                    >
                      {msg.type === 'bot' ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-400/30">
                          <FiCpu className="text-white text-lg" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-400/30 text-white font-bold text-sm">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Message Bubble */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`flex flex-col max-w-[75%] ${
                        msg.type === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`relative p-4 rounded-2xl shadow-xl ${
                          msg.type === 'user'
                            ? 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-br-sm'
                            : 'bg-gradient-to-br from-luxury-gray to-luxury-darkGray text-gray-100 rounded-bl-sm border border-primary-500/20'
                        }`}
                      >
                        {/* Shine Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                        
                        {msg.type === 'bot' && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary-500/20">
                            <span className="text-xs text-primary-400 font-bold uppercase tracking-wider">AI Response</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-line relative z-10">{msg.text}</p>
                      </div>
                      
                      {msg.timestamp && (
                        <span className="text-xs text-gray-500 mt-1.5 px-2 flex items-center gap-1">
                          <FiClock size={10} />
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator - Enhanced */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-400/30">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                        <FiCpu className="text-white text-lg" />
                      </motion.div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-luxury-gray to-luxury-darkGray px-5 py-4 rounded-2xl rounded-bl-sm border border-primary-500/20 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2.5 h-2.5 bg-primary-400 rounded-full shadow-lg shadow-primary-400/50"
                          />
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2.5 h-2.5 bg-primary-400 rounded-full shadow-lg shadow-primary-400/50"
                          />
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2.5 h-2.5 bg-primary-400 rounded-full shadow-lg shadow-primary-400/50"
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">AI is analyzing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

                {/* Chat Input - Enhanced */}
                <div className="p-5 bg-gradient-to-t from-luxury-black to-luxury-darkGray border-t border-primary-500/20 flex-shrink-0 backdrop-blur-xl">
                  {/* Chat Controls */}
                  <div className="flex gap-3 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportChatHistory}
                      className="flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 px-3 py-2 rounded-lg transition-all"
                      title="Export chat history"
                    >
                      <FiSave size={14} />
                      <span className="font-medium">Export</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearChat}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-400 bg-gray-500/10 hover:bg-gray-500/20 px-3 py-2 rounded-lg transition-all"
                      title="Clear chat"
                    >
                      <FiTrash2 size={14} />
                      <span className="font-medium">Clear</span>
                    </motion.button>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Type your message or project details..."
                        className="w-full bg-luxury-darkGray/80 text-white px-5 py-4 rounded-2xl border-2 border-primary-500/30 focus:border-primary-500 focus:outline-none transition-all placeholder:text-gray-500 shadow-inner"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.08, rotate: 5 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleSendMessage}
                      disabled={!userMessage.trim()}
                      className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white px-6 py-4 rounded-2xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <FiSend size={22} />
                    </motion.button>
                  </div>
                  {/* Quick Actions - Enhanced */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { text: 'Compare materials', icon: '📊', color: 'from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border-blue-500/30' },
                      { text: 'Calculate cost', icon: '💰', color: 'from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border-green-500/30' },
                      { text: 'Installation time', icon: '⏱️', color: 'from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border-purple-500/30' },
                      { text: 'Energy saving', icon: '⚡', color: 'from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/30 hover:to-yellow-600/30 border-yellow-500/30' },
                      { text: 'Warranty info', icon: '🛡️', color: 'from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border-red-500/30' }
                    ].map((quick) => (
                      <motion.button
                        key={quick.text}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setUserMessage(quick.text);
                          setTimeout(handleSendMessage, 100);
                        }}
                        className={`text-xs bg-gradient-to-r ${quick.color} text-white font-medium px-4 py-2 rounded-xl border transition-all flex items-center gap-2 shadow-lg`}
                      >
                        <span className="text-base">{quick.icon}</span>
                        <span>{quick.text}</span>
                      </motion.button>
                    ))}
                  </div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Floating Chat Button */}
      {!chatOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="fixed bottom-8 right-8 z-30"
        >
          {/* Glow Effect */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary-500 rounded-full blur-xl"
          />
          
          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatOpen(true)}
            className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white p-5 rounded-full shadow-2xl hover:shadow-primary-500/70 transition-all group"
          >
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiMessageCircle size={32} className="drop-shadow-lg" />
              </motion.div>
              
              {chatMessages.length > 1 && (
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-white"
                >
                  {chatMessages.filter(m => m.type === 'bot').length}
                </motion.div>
              )}
            </div>
          </motion.button>
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-luxury-darkGray text-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
          >
            <span className="text-sm font-medium">Chat with AI Assistant</span>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-luxury-darkGray"></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomDesign;


