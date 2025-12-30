const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aroma-luxe');
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// START: Add your services here following this structure
const engineeringServices = [
  // Example service structure (remove this comment block after understanding):
  // {
  //   title: 'Service Name',
  //   brand: 'Velan Engineering - Division Name',
  //   price: 0000,  // Price in dollars
  //   category: 'Mechanical',  // Options: Mechanical, Industrial, Consulting, Maintenance
  //   size: 'Service Package Type',  // e.g., Standard Package, Complete System, Per Unit
  //   description: 'Detailed description of the service...',
  //   rating: 4.5,  // Rating out of 5
  //   images: ['image_url_1', 'image_url_2'],  // At least 2 images
  //   stock: 10,  // Availability count
  //   featured: true,  // true or false
  //   discount: 0,  // Discount percentage (0-100)
  //   tags: ['tag1', 'tag2', 'tag3'],
  //   serviceDetails: {
  //     scope: ['item1', 'item2'],
  //     deliverables: ['item1', 'item2'],
  //     requirements: ['item1', 'item2']
  //   },
  //   duration: '1-2 Weeks',  // Options: 1-2 Days, 3-7 Days, 1-2 Weeks, 2-3 Weeks, 2-4 Weeks, 1-3 Months, 3-6 Months, Custom
  //   complexity: 'Intermediate',  // Options: Basic, Intermediate, Advanced, Expert
  //   projectType: ['Design', 'Installation'],  // Options: Design, Installation, Maintenance, Consulting, Inspection, All Types
  //   industry: ['Commercial', 'Manufacturing']  // Options: Manufacturing, Construction, Energy, Infrastructure, Commercial, Residential
  // },

  // Add your services below this line:
  
  {
    title: 'HVAC System Design & Installation',
    brand: 'Velan Engineering - Mechanical Division',
    price: 4200,
    category: 'Mechanical',
    size: 'Standard Package',
    description: 'Complete HVAC system design and installation for commercial and residential buildings. Includes load calculation, duct design, equipment selection, and energy-efficient solutions complying with ASHRAE standards.',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1621905252472-b5e24347c97c?w=800', 'https://images.unsplash.com/photo-1635699900341-d1b65e8b0f47?w=800'],
    stock: 12,
    featured: true,
    discount: 10,
    tags: ['HVAC', 'air conditioning', 'ventilation', 'mechanical'],
    serviceDetails: {
      scope: ['Load calculation', 'Duct design', 'Equipment sizing', 'Installation'],
      deliverables: ['HVAC drawings', 'Equipment list', 'Energy analysis', 'Commissioning report'],
      requirements: ['Building plans', 'Occupancy details', 'Budget']
    },
    duration: '2-4 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Commercial', 'Residential']
  },
  {
    title: 'Industrial Automation Solutions',
    brand: 'Velan Engineering - Industrial Division',
    price: 8500,
    category: 'Industrial',
    size: 'Complete System',
    description: 'End-to-end industrial automation solutions including PLC programming, SCADA systems, and HMI development. We specialize in Siemens, Allen Bradley, and Schneider Electric platforms for manufacturing and process industries.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800', 'https://images.unsplash.com/photo-1581092160607-ee67f8d9e5e4?w=800'],
    stock: 8,
    featured: true,
    discount: 15,
    tags: ['automation', 'PLC', 'SCADA', 'industrial'],
    serviceDetails: {
      scope: ['PLC programming', 'SCADA development', 'Panel design', 'Installation & commissioning'],
      deliverables: ['Control logic', 'HMI screens', 'Control schematics', 'User manual'],
      requirements: ['Process flow diagram', 'I/O list', 'Site layout']
    },
    duration: '1-3 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation'],
    industry: ['Manufacturing', 'Energy']
  },
  {
    title: 'Process Plant Design & Optimization',
    brand: 'Velan Engineering - Industrial Division',
    price: 12000,
    category: 'Industrial',
    size: 'Enterprise Package',
    description: 'Complete process plant design including P&ID development, equipment layout, piping design, and process optimization. Specializing in chemical, pharmaceutical, and food processing industries.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800', 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800'],
    stock: 5,
    featured: true,
    discount: 20,
    tags: ['process plant', 'P&ID', 'industrial design', 'optimization'],
    serviceDetails: {
      scope: ['Process flow diagrams', 'Equipment selection', 'Piping layout', 'Safety systems'],
      deliverables: ['P&ID drawings', '3D plant model', 'Equipment specifications', 'Safety report'],
      requirements: ['Process requirements', 'Site data', 'Production capacity']
    },
    duration: '3-6 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Consulting'],
    industry: ['Manufacturing', 'Energy']
  },
  {
    title: 'Mechanical Systems Coordination',
    brand: 'Velan Engineering - Consulting Division',
    price: 3500,
    category: 'Consulting',
    size: 'Professional Service',
    description: 'Expert coordination of mechanical systems for construction projects. BIM-based clash detection, MEP coordination, and constructability reviews to ensure seamless installation.',
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'],
    stock: 15,
    featured: false,
    discount: 0,
    tags: ['coordination', 'BIM', 'MEP', 'consulting'],
    serviceDetails: {
      scope: ['BIM coordination', 'Clash detection', 'Shop drawing review', 'Site coordination'],
      deliverables: ['Coordination drawings', 'Clash reports', 'Construction documents'],
      requirements: ['Architectural plans', 'MEP drawings', 'BIM models']
    },
    duration: '2-4 Weeks',
    complexity: 'Advanced',
    projectType: ['Consulting'],
    industry: ['Construction', 'Infrastructure']
  },
  {
    title: 'Fire Protection System Design',
    brand: 'Velan Engineering - Mechanical Division',
    price: 4800,
    category: 'Mechanical',
    size: 'Safety Package',
    description: 'Comprehensive fire protection system design including sprinkler systems, fire alarm, smoke detection, and fire suppression systems. NFPA compliant designs for all building types.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1583266293702-a2a431734de4?w=800', 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800'],
    stock: 10,
    featured: true,
    discount: 0,
    tags: ['fire protection', 'sprinkler', 'fire safety', 'NFPA'],
    serviceDetails: {
      scope: ['Hydraulic calculations', 'Sprinkler layout', 'Fire alarm design', 'Compliance review'],
      deliverables: ['Fire protection drawings', 'Hydraulic calc sheets', 'Equipment schedules', 'Compliance report'],
      requirements: ['Building plans', 'Occupancy classification', 'Local codes']
    },
    duration: '2-3 Weeks',
    complexity: 'Advanced',
    projectType: ['Design'],
    industry: ['Commercial', 'Residential', 'Infrastructure']
  },
  {
    title: 'Energy Audit & Efficiency Consulting',
    brand: 'Velan Engineering - Consulting Division',
    price: 2800,
    category: 'Consulting',
    size: 'Standard Audit',
    description: 'Detailed energy audit and efficiency analysis for industrial and commercial facilities. Identify savings opportunities, recommend energy-efficient upgrades, and provide ROI analysis.',
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800'],
    stock: 20,
    featured: false,
    discount: 10,
    tags: ['energy audit', 'efficiency', 'sustainability', 'consulting'],
    serviceDetails: {
      scope: ['Site survey', 'Energy analysis', 'Recommendations', 'ROI calculation'],
      deliverables: ['Audit report', 'Energy model', 'Savings analysis', 'Implementation plan'],
      requirements: ['Utility bills', 'Site access', 'Equipment data']
    },
    duration: '1-2 Weeks',
    complexity: 'Intermediate',
    projectType: ['Consulting', 'Inspection'],
    industry: ['Manufacturing', 'Commercial', 'Energy']
  },
  {
    title: 'Facility Maintenance Planning',
    brand: 'Velan Engineering - Maintenance Division',
    price: 2200,
    category: 'Maintenance',
    size: 'Annual Plan',
    description: 'Comprehensive facility maintenance planning and preventive maintenance program development. Includes equipment inventory, maintenance schedules, and CMMS implementation.',
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800'],
    stock: 25,
    featured: false,
    discount: 0,
    tags: ['maintenance', 'preventive maintenance', 'facility management', 'CMMS'],
    serviceDetails: {
      scope: ['Equipment inventory', 'Maintenance schedule', 'Procedure development', 'CMMS setup'],
      deliverables: ['Maintenance manual', 'PM schedules', 'Work procedures', 'CMMS database'],
      requirements: ['Facility layout', 'Equipment list', 'Maintenance history']
    },
    duration: '2-4 Weeks',
    complexity: 'Intermediate',
    projectType: ['Maintenance', 'Consulting'],
    industry: ['Commercial', 'Manufacturing', 'Infrastructure']
  },
  {
    title: 'Custom Door Design & Fabrication',
    brand: 'Velan Engineering - Design Studio',
    price: 1800,
    category: 'Mechanical',
    size: 'Per Unit',
    description: 'Custom door design and engineering for residential, commercial, and industrial applications. Includes structural calculations, material selection, hardware specifications, and fabrication drawings. Specializing in steel, aluminum, wood, and composite materials.',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800'],
    stock: 30,
    featured: true,
    discount: 0,
    tags: ['door design', 'custom doors', 'fabrication', 'structural design'],
    serviceDetails: {
      scope: ['Door design', 'Structural calculations', 'Material selection', 'Hardware specs', 'Fabrication drawings'],
      deliverables: ['Design drawings', 'Structural calculations', 'Material specifications', 'Hardware list', 'Installation guide'],
      requirements: ['Opening dimensions', 'Building type', 'Usage requirements', 'Budget', 'Design preferences']
    },
    duration: '1-2 Weeks',
    complexity: 'Intermediate',
    projectType: ['Design'],
    industry: ['Residential', 'Commercial', 'Infrastructure']
  },
  {
    title: 'Window System Design & Engineering',
    brand: 'Velan Engineering - Design Studio',
    price: 1200,
    category: 'Mechanical',
    size: 'Per Unit',
    description: 'Complete window system design and engineering including frame calculations, glazing specifications, thermal analysis, and wind load calculations. Expertise in aluminum, UPVC, and steel window systems for all building types.',
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'],
    stock: 35,
    featured: true,
    discount: 5,
    tags: ['window design', 'glazing', 'thermal analysis', 'energy efficient'],
    serviceDetails: {
      scope: ['Window design', 'Structural analysis', 'Glazing selection', 'Thermal calculations', 'Detail drawings'],
      deliverables: ['Design drawings', 'Load calculations', 'Glazing specs', 'Thermal report', 'Installation details'],
      requirements: ['Wall opening size', 'Building location', 'Climate data', 'Energy requirements', 'Style preferences']
    },
    duration: '3-7 Days',
    complexity: 'Intermediate',
    projectType: ['Design'],
    industry: ['Residential', 'Commercial']
  },
  {
    title: 'Main Gate Design & Engineering',
    brand: 'Velan Engineering - Design Studio',
    price: 3200,
    category: 'Mechanical',
    size: 'Complete System',
    description: 'Comprehensive main gate design including structural engineering, automation system integration, and security features. Specializing in sliding gates, swing gates, and overhead gates for residential, commercial, and industrial properties.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    stock: 15,
    featured: true,
    discount: 10,
    tags: ['gate design', 'automated gates', 'security', 'structural design'],
    serviceDetails: {
      scope: ['Gate design', 'Structural calculations', 'Automation integration', 'Security features', 'Foundation design'],
      deliverables: ['Design drawings', 'Structural calculations', 'Automation specs', 'Material list', 'Installation guide'],
      requirements: ['Site dimensions', 'Gate type preference', 'Security requirements', 'Automation needs', 'Budget']
    },
    duration: '2-3 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Residential', 'Commercial', 'Infrastructure']
  },
  {
    title: 'Commercial Roofing Systems',
    brand: 'Velan Engineering - Structural Division',
    price: 7500,
    category: 'Mechanical',
    size: 'Complete System',
    description: 'Complete roofing system design and engineering for commercial buildings including malls, warehouses, and office complexes. Expertise in steel structures, pre-engineered buildings, and long-span roofing solutions with waterproofing and insulation.',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
    stock: 8,
    featured: true,
    discount: 15,
    tags: ['commercial roofing', 'mall roofing', 'steel structure', 'pre-engineered buildings'],
    serviceDetails: {
      scope: ['Structural design', 'Roof layout', 'Load calculations', 'Drainage design', 'Waterproofing system', 'Insulation specs'],
      deliverables: ['Structural drawings', 'Load calculations', 'Material specifications', 'Waterproofing details', 'BOQ'],
      requirements: ['Building dimensions', 'Occupancy type', 'Local wind/snow loads', 'Budget', 'Timeline']
    },
    duration: '1-3 Months',
    complexity: 'Expert',
    projectType: ['Design', 'Installation'],
    industry: ['Commercial', 'Infrastructure']
  },
  {
    title: 'High-Rise Residential Roofing',
    brand: 'Velan Engineering - Structural Division',
    price: 5800,
    category: 'Mechanical',
    size: 'Premium Package',
    description: 'Specialized high-rise residential roofing design and engineering for apartment buildings and luxury homes. Includes structural analysis, weather protection systems, and modern architectural roofing solutions with emphasis on durability and aesthetics.',
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    stock: 10,
    featured: true,
    discount: 10,
    tags: ['high-rise roofing', 'residential roofing', 'luxury homes', 'apartment buildings'],
    serviceDetails: {
      scope: ['Roof structural design', 'Weather protection', 'Terrace waterproofing', 'Parapet design', 'Aesthetic features'],
      deliverables: ['Structural drawings', 'Waterproofing details', 'Material specifications', 'Aesthetic renders', 'Maintenance guide'],
      requirements: ['Building height', 'Floor plans', 'Local climate data', 'Architectural style', 'Budget']
    },
    duration: '2-4 Weeks',
    complexity: 'Advanced',
    projectType: ['Design', 'Installation'],
    industry: ['Residential']
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing services');
    
    // Insert engineering services
    await Product.insertMany(engineeringServices);
    
    console.log('✅ Engineering services added successfully!');
    console.log(`📊 Total services: ${engineeringServices.length}`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
