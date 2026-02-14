import {
  Cpu,
  Stethoscope,
  FlaskConical,
  Palette,
  TrendingUp,
  Scale,
  GraduationCap,
  Film,
  Shield,
  Sprout,
  Plane,
  Dumbbell,
  Wrench,
  LucideIcon,
  Cloud,
  GitBranch,
  Link,
  Glasses,
  Atom,
  Bot,
  Dna,
  Target,
  MousePointer,
  Truck,
  Landmark,
  Newspaper,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';

export interface Specialization {
  id: string;
  name: string;
  type: 'core' | 'emerging' | 'hybrid';
  growthPotential: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  marketDemand: number;
  description: string;
  skills: string[];
  degreeLevel?: 'UG' | 'PG' | 'M.Tech'; // Optional: for higher studies tracking
  branch?: string; // Optional: for branch-specific specializations
}

export interface Branch {
  id: string;
  name: string;
  icon?: LucideIcon;
  description: string;
  demand: string;
  growth: string;
  color: string;
}

export interface Field {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  demand: string;
  growth: string;
  color: string;
  hasBranches?: boolean; // Optional: indicates if field has sub-branches
}

export const fields: Field[] = [
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    icon: Cpu,
    description: 'Build the future with technology and innovation',
    demand: 'Very High',
    growth: '+25%',
    color: 'from-blue-500 to-blue-600',
    hasBranches: true,
  },
  {
    id: 'medical',
    name: 'Medical & Health Sciences',
    icon: Stethoscope,
    description: 'Healthcare, wellness, and life sciences careers',
    demand: 'High',
    growth: '+18%',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'science',
    name: 'Science & Research',
    icon: FlaskConical,
    description: 'Research, discovery, and scientific innovation',
    demand: 'High',
    growth: '+20%',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'arts',
    name: 'Arts, Humanities & Degree',
    icon: Palette,
    description: 'Liberal arts, humanities, and social sciences',
    demand: 'Moderate',
    growth: '+12%',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'commerce',
    name: 'Commerce, Business & Management',
    icon: TrendingUp,
    description: 'Business, finance, and entrepreneurship',
    demand: 'High',
    growth: '+15%',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'law',
    name: 'Law & Public Services',
    icon: Scale,
    description: 'Legal profession and public administration',
    demand: 'Moderate',
    growth: '+10%',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'education',
    name: 'Education & Teaching',
    icon: GraduationCap,
    description: 'Teaching, training, and educational leadership',
    demand: 'Moderate',
    growth: '+14%',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'design',
    name: 'Design, Media & Creative Arts',
    icon: Palette,
    description: 'Visual design, media production, and creativity',
    demand: 'High',
    growth: '+22%',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'defense',
    name: 'Defense, Security & Physical Services',
    icon: Shield,
    description: 'Armed forces, security, and emergency services',
    demand: 'High',
    growth: '+16%',
    color: 'from-slate-500 to-slate-600',
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Environmental Studies',
    icon: Sprout,
    description: 'Farming, sustainability, and environmental science',
    demand: 'Moderate',
    growth: '+18%',
    color: 'from-lime-500 to-lime-600',
  },
  {
    id: 'hospitality',
    name: 'Hospitality, Travel & Tourism',
    icon: Plane,
    description: 'Hotels, travel, events, and tourism management',
    demand: 'High',
    growth: '+20%',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'sports',
    name: 'Sports, Fitness & Lifestyle',
    icon: Dumbbell,
    description: 'Sports science, fitness, and wellness coaching',
    demand: 'Moderate',
    growth: '+15%',
    color: 'from-rose-500 to-rose-600',
  },
  {
    id: 'vocational',
    name: 'Skill-Based & Vocational Fields',
    icon: Wrench,
    description: 'Technical trades, certifications, and practical skills',
    demand: 'High',
    growth: '+24%',
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    icon: Cloud,
    description: 'Cloud infrastructure and platforms',
    demand: 'Very High',
    growth: '+28%',
    color: 'from-blue-400 to-blue-500',
  },
  {
    id: 'devops',
    name: 'DevOps & Site Reliability Engineering',
    icon: GitBranch,
    description: 'Automation, CI/CD, and system reliability',
    demand: 'Very High',
    growth: '+32%',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'blockchain-web3',
    name: 'Blockchain & Web3',
    icon: Link,
    description: 'Decentralized applications and smart contracts',
    demand: 'High',
    growth: '+22%',
    color: 'from-purple-600 to-purple-700',
  },
  {
    id: 'ar-vr',
    name: 'AR / VR / Mixed Reality',
    icon: Glasses,
    description: 'Immersive experiences and spatial computing',
    demand: 'High',
    growth: '+35%',
    color: 'from-pink-600 to-pink-700',
  },
  {
    id: 'quantum',
    name: 'Quantum Computing',
    icon: Atom,
    description: 'Quantum algorithms and information science',
    demand: 'Medium',
    growth: '+45%',
    color: 'from-cyan-600 to-cyan-700',
  },
  {
    id: 'robotics-automation',
    name: 'Robotics & Automation',
    icon: Bot,
    description: 'Industrial robots, autonomous systems, and automation',
    demand: 'High',
    growth: '+30%',
    color: 'from-orange-600 to-orange-700',
  },
  {
    id: 'bioinformatics',
    name: 'Bioinformatics & Computational Biology',
    icon: Dna,
    description: 'Genomics, proteomics, and computational bio sciences',
    demand: 'High',
    growth: '+25%',
    color: 'from-green-600 to-green-700',
  },
  {
    id: 'product-management',
    name: 'Product Management & Tech Leadership',
    icon: Target,
    description: 'Product strategy, roadmapping, and tech leadership',
    demand: 'Very High',
    growth: '+20%',
    color: 'from-blue-600 to-blue-700',
  },
  {
    id: 'ui-ux',
    name: 'UI / UX & Human-Computer Interaction',
    icon: MousePointer,
    description: 'User experience design and human-centered computing',
    demand: 'Very High',
    growth: '+22%',
    color: 'from-rose-600 to-rose-700',
  },
];

// Engineering Branches (Subject-wise selection)
export const branchesMap: Record<string, Branch[]> = {
  engineering: [
    {
      id: 'cse',
      name: 'Computer Science Engineering (CSE)',
      description: 'Software development, algorithms, and computer systems',
      demand: 'Very High',
      growth: '+30%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'ece',
      name: 'Electronics & Communication Engineering (ECE)',
      description: 'Electronics, communication systems, and embedded technologies',
      demand: 'High',
      growth: '+22%',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'eee',
      name: 'Electrical & Electronics Engineering (EEE)',
      description: 'Power systems, electrical machines, and renewable energy',
      demand: 'High',
      growth: '+20%',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 'mechanical',
      name: 'Mechanical Engineering',
      description: 'Design, manufacturing, thermal systems, and robotics',
      demand: 'High',
      growth: '+18%',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'civil',
      name: 'Civil Engineering',
      description: 'Infrastructure, construction, and structural design',
      demand: 'Medium',
      growth: '+15%',
      color: 'from-green-500 to-green-600',
    },
  ],
};

export const specializationsMap: Record<string, Specialization[]> = {
  engineering: [
    // ============================================
    // CSE (COMPUTER SCIENCE ENGINEERING) - UG
    // ============================================
    { id: 'cse-software-dev', name: 'Software Development & Programming', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 95, description: 'Master programming fundamentals and software development lifecycle', skills: ['Java', 'Python', 'C++', 'Data Structures', 'Algorithms'], degreeLevel: 'UG', branch: 'cse' },
    { id: 'cse-web-dev', name: 'Full Stack Web Development', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 93, description: 'Build complete web applications from frontend to backend', skills: ['React', 'Node.js', 'Databases', 'APIs', 'TypeScript'], degreeLevel: 'UG', branch: 'cse' },
    { id: 'cse-mobile-dev', name: 'Mobile App Development', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Create native and cross-platform mobile applications', skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Mobile UI/UX'], degreeLevel: 'UG', branch: 'cse' },
    { id: 'cse-ai-ml', name: 'Artificial Intelligence & Machine Learning', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 96, description: 'Build intelligent systems that learn and adapt', skills: ['Python', 'TensorFlow', 'Deep Learning', 'Mathematics'], degreeLevel: 'UG', branch: 'cse' },
    { id: 'cse-data-science', name: 'Data Science & Big Data', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 94, description: 'Extract insights from massive datasets', skills: ['Python', 'SQL', 'Statistics', 'Spark'], degreeLevel: 'UG', branch: 'cse' },
    { id: 'cse-cloud', name: 'Cloud Computing & DevOps', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 92, description: 'Design scalable cloud infrastructure and automate deployments', skills: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'CI/CD'], degreeLevel: 'UG', branch: 'cse' },
    { id: 'cse-cybersecurity', name: 'Cybersecurity & Ethical Hacking', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Protect systems, networks, and data from threats', skills: ['Penetration Testing', 'Network Security', 'SIEM', 'Compliance'], degreeLevel: 'UG', branch: 'cse' },
    { id: 'cse-database', name: 'Database Management & Engineering', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Design and manage robust database systems', skills: ['SQL', 'NoSQL', 'PostgreSQL', 'MongoDB', 'Database Design'], degreeLevel: 'UG', branch: 'cse' },

    // CSE - POSTGRADUATE
    { id: 'cse-mtech', name: 'M.Tech in Computer Science & Engineering', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 92, description: 'Advanced computer science with specializations in algorithms, systems, and theory', skills: ['Advanced Algorithms', 'System Design', 'Theory of Computation', 'Research'], degreeLevel: 'M.Tech', branch: 'cse' },
    { id: 'cse-mtech-ai', name: 'M.Tech in AI & Machine Learning', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 94, description: 'Specialized program in AI/ML with focus on research and industry applications', skills: ['Deep Learning', 'Reinforcement Learning', 'Computer Vision', 'NLP'], degreeLevel: 'M.Tech', branch: 'cse' },
    { id: 'cse-mtech-data', name: 'M.Tech in Data Science & Analytics', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 91, description: 'Advanced data science with big data technologies and analytics', skills: ['Big Data', 'Advanced Analytics', 'Data Mining', 'Visualization'], degreeLevel: 'M.Tech', branch: 'cse' },
    { id: 'cse-mtech-cyber', name: 'M.Tech in Cyber Security', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Advanced cybersecurity research and enterprise security solutions', skills: ['Network Security', 'Cryptography', 'Security Protocols', 'Forensics'], degreeLevel: 'M.Tech', branch: 'cse' },
    { id: 'cse-mtech-cloud', name: 'M.Tech in Cloud Computing & Virtualization', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Cloud infrastructure, virtualization, and distributed computing', skills: ['Cloud Platforms', 'Virtualization', 'Containerization', 'Orchestration'], degreeLevel: 'M.Tech', branch: 'cse' },

    // ============================================
    // ECE (ELECTRONICS & COMMUNICATION) - UG
    // ============================================
    { id: 'ece-vlsi', name: 'VLSI Design & Chip Engineering', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 85, description: 'Design integrated circuits and semiconductor chips', skills: ['VLSI Design', 'Verilog/VHDL', 'Cadence', 'SoC Design'], degreeLevel: 'UG', branch: 'ece' },
    { id: 'ece-embedded', name: 'Embedded Systems & IoT', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Design embedded systems for smart devices and IoT applications', skills: ['Embedded C', 'ARM', 'RTOS', 'IoT Protocols'], degreeLevel: 'UG', branch: 'ece' },
    { id: 'ece-communication', name: 'Communication Systems & Networks', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 83, description: 'Design and optimize communication networks and systems', skills: ['Digital Communication', 'Wireless Networks', '5G', 'Signal Processing'], degreeLevel: 'UG', branch: 'ece' },
    { id: 'ece-signal', name: 'Signal Processing & Image Processing', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 80, description: 'Process and analyze signals and images for various applications', skills: ['DSP', 'Image Processing', 'MATLAB', 'Python'], degreeLevel: 'UG', branch: 'ece' },
    { id: 'ece-rf', name: 'RF & Microwave Engineering', type: 'hybrid', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 75, description: 'Design RF circuits and microwave communication systems', skills: ['RF Design', 'Antenna Design', 'Microwave Engineering', 'EM Theory'], degreeLevel: 'UG', branch: 'ece' },
    { id: 'ece-optical', name: 'Optical Communication & Fiber Optics', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 78, description: 'Design optical communication systems and fiber optic networks', skills: ['Fiber Optics', 'Optical Networks', 'Photonics', 'WDM'], degreeLevel: 'UG', branch: 'ece' },

    // ECE - POSTGRADUATE
    { id: 'ece-mtech-vlsi', name: 'M.Tech in VLSI Design', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 85, description: 'Advanced chip design, embedded systems, and hardware architecture', skills: ['VLSI Design', 'Verilog/VHDL', 'Embedded Systems', 'SoC Design'], degreeLevel: 'M.Tech', branch: 'ece' },
    { id: 'ece-mtech-embedded', name: 'M.Tech in Embedded Systems', type: 'hybrid', growthPotential: 'high', riskLevel: 'low', marketDemand: 84, description: 'Advanced embedded systems design and IoT applications', skills: ['Embedded C', 'RTOS', 'Hardware Interfacing', 'IoT Protocols'], degreeLevel: 'M.Tech', branch: 'ece' },
    { id: 'ece-mtech-comm', name: 'M.Tech in Communication Systems', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 82, description: 'Advanced wireless communication and network design', skills: ['5G/6G', 'Wireless Networks', 'Network Security', 'Signal Processing'], degreeLevel: 'M.Tech', branch: 'ece' },

    // ============================================
    // EEE (ELECTRICAL & ELECTRONICS) - UG
    // ============================================
    { id: 'eee-power-systems', name: 'Power Systems & Grid Management', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 86, description: 'Design and manage electrical power systems and smart grids', skills: ['Power Systems', 'Grid Management', 'MATLAB', 'Protection Systems'], degreeLevel: 'UG', branch: 'eee' },
    { id: 'eee-renewable', name: 'Renewable Energy & Solar Engineering', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Design solar, wind, and renewable energy systems', skills: ['Solar PV', 'Wind Energy', 'Energy Storage', 'Grid Integration'], degreeLevel: 'UG', branch: 'eee' },
    { id: 'eee-power-electronics', name: 'Power Electronics & Drives', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 84, description: 'Design power electronic converters and motor drives', skills: ['Power Electronics', 'Motor Drives', 'Converters', 'Control Systems'], degreeLevel: 'UG', branch: 'eee' },
    { id: 'eee-ev', name: 'Electric Vehicles & Battery Systems', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 92, description: 'Design EV powertrains and battery management systems', skills: ['EV Technology', 'Battery Management', 'Motor Control', 'Charging Infrastructure'], degreeLevel: 'UG', branch: 'eee' },
    { id: 'eee-control', name: 'Control Systems & Automation', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 80, description: 'Design automated control systems for industrial applications', skills: ['Control Systems', 'PLC', 'SCADA', 'Automation'], degreeLevel: 'UG', branch: 'eee' },
    { id: 'eee-instrumentation', name: 'Instrumentation & Measurements', type: 'hybrid', growthPotential: 'medium', riskLevel: 'low', marketDemand: 76, description: 'Design measurement and instrumentation systems', skills: ['Instrumentation', 'Sensors', 'Data Acquisition', 'Process Control'], degreeLevel: 'UG', branch: 'eee' },

    // EEE - POSTGRADUATE
    { id: 'eee-mtech-power', name: 'M.Tech in Power Systems', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 85, description: 'Advanced power systems, smart grids, and energy management', skills: ['Power Systems Analysis', 'Smart Grids', 'FACTS', 'Energy Management'], degreeLevel: 'M.Tech', branch: 'eee' },
    { id: 'eee-mtech-pe', name: 'M.Tech in Power Electronics', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 83, description: 'Advanced power electronics and electric drives', skills: ['Power Electronics', 'Electric Drives', 'Converters', 'Control'], degreeLevel: 'M.Tech', branch: 'eee' },
    { id: 'eee-mtech-renewable', name: 'M.Tech in Renewable Energy', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Advanced renewable energy systems and grid integration', skills: ['Renewable Energy', 'Grid Integration', 'Energy Storage', 'Sustainability'], degreeLevel: 'M.Tech', branch: 'eee' },

    // ============================================
    // MECHANICAL ENGINEERING - UG
    // ============================================
    { id: 'mech-design', name: 'Design & Manufacturing Engineering', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 85, description: 'Design mechanical components and manufacturing processes', skills: ['CAD/CAM', 'SolidWorks', 'Manufacturing', 'Materials'], degreeLevel: 'UG', branch: 'mechanical' },
    { id: 'mech-thermal', name: 'Thermal Engineering & HVAC', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 78, description: 'Design thermal systems, HVAC, and refrigeration systems', skills: ['Thermodynamics', 'HVAC', 'Heat Transfer', 'CFD'], degreeLevel: 'UG', branch: 'mechanical' },
    { id: 'mech-robotics', name: 'Robotics & Automation', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 90, description: 'Design robotic systems and automated manufacturing', skills: ['Robotics', 'ROS', 'Automation', 'Control Systems'], degreeLevel: 'UG', branch: 'mechanical' },
    { id: 'mech-automotive', name: 'Automotive Engineering & Vehicle Design', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Design automotive systems and vehicle engineering', skills: ['Automotive Systems', 'Vehicle Dynamics', 'Engine Design', 'Testing'], degreeLevel: 'UG', branch: 'mechanical' },
    { id: 'mech-cfd', name: 'Computational Fluid Dynamics (CFD)', type: 'hybrid', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 75, description: 'Simulate fluid flow and heat transfer using computational methods', skills: ['CFD', 'ANSYS', 'Fluid Mechanics', 'Simulation'], degreeLevel: 'UG', branch: 'mechanical' },
    { id: 'mech-production', name: 'Production & Industrial Engineering', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 80, description: 'Optimize manufacturing processes and production systems', skills: ['Production Planning', 'Quality Control', 'Lean Manufacturing', 'Six Sigma'], degreeLevel: 'UG', branch: 'mechanical' },

    // MECHANICAL - POSTGRADUATE
    { id: 'mech-mtech-design', name: 'M.Tech in Mechanical Design', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 84, description: 'Advanced mechanical design and engineering analysis', skills: ['Advanced CAD', 'FEA', 'Design Optimization', 'Materials Science'], degreeLevel: 'M.Tech', branch: 'mechanical' },
    { id: 'mech-mtech-thermal', name: 'M.Tech in Thermal Engineering', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 80, description: 'Advanced thermal systems and energy engineering', skills: ['Advanced Thermodynamics', 'Heat Transfer', 'Energy Systems', 'CFD'], degreeLevel: 'M.Tech', branch: 'mechanical' },
    { id: 'mech-mtech-robotics', name: 'M.Tech in Robotics & Automation', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 88, description: 'Advanced robotics, AI integration, and automation', skills: ['Advanced Robotics', 'AI', 'Machine Vision', 'Automation'], degreeLevel: 'M.Tech', branch: 'mechanical' },

    // ============================================
    // CIVIL ENGINEERING - UG
    // ============================================
    { id: 'civil-structural', name: 'Structural Engineering & Design', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 86, description: 'Design buildings, bridges, and structural systems', skills: ['Structural Analysis', 'Steel Design', 'Concrete Design', 'STAAD Pro'], degreeLevel: 'UG', branch: 'civil' },
    { id: 'civil-construction', name: 'Construction Management & Planning', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Manage construction projects and site operations', skills: ['Project Management', 'Cost Estimation', 'Planning', 'Safety Management'], degreeLevel: 'UG', branch: 'civil' },
    { id: 'civil-transport', name: 'Transportation Engineering & Traffic', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 78, description: 'Design transportation systems and traffic management', skills: ['Highway Engineering', 'Traffic Engineering', 'Transport Planning', 'GIS'], degreeLevel: 'UG', branch: 'civil' },
    { id: 'civil-environmental', name: 'Environmental Engineering & Sustainability', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 85, description: 'Design sustainable and environmentally friendly infrastructure', skills: ['Environmental Engineering', 'Water Treatment', 'Waste Management', 'Sustainability'], degreeLevel: 'UG', branch: 'civil' },
    { id: 'civil-geotech', name: 'Geotechnical Engineering & Soil Mechanics', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 75, description: 'Analyze soil properties and foundation design', skills: ['Soil Mechanics', 'Foundation Design', 'Geotechnical Analysis', 'Site Investigation'], degreeLevel: 'UG', branch: 'civil' },
    { id: 'civil-water', name: 'Water Resources & Hydraulics', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 80, description: 'Design water supply, drainage, and hydraulic systems', skills: ['Hydraulics', 'Hydrology', 'Water Resources', 'Irrigation'], degreeLevel: 'UG', branch: 'civil' },

    // CIVIL - POSTGRADUATE
    { id: 'civil-mtech-structural', name: 'M.Tech in Structural Engineering', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 85, description: 'Advanced structural analysis and earthquake engineering', skills: ['Advanced Structural Analysis', 'Earthquake Engineering', 'FEA', 'Design'], degreeLevel: 'M.Tech', branch: 'civil' },
    { id: 'civil-mtech-construction', name: 'M.Tech in Construction Management', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 87, description: 'Advanced project management and construction technology', skills: ['Advanced Project Management', 'Construction Tech', 'BIM', 'Cost Management'], degreeLevel: 'M.Tech', branch: 'civil' },
    { id: 'civil-mtech-transport', name: 'M.Tech in Transportation Engineering', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 78, description: 'Advanced transportation planning and smart cities', skills: ['Transportation Planning', 'Smart Cities', 'ITS', 'Sustainable Transport'], degreeLevel: 'M.Tech', branch: 'civil' },
    { id: 'civil-mtech-env', name: 'M.Tech in Environmental Engineering', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 84, description: 'Advanced environmental systems and green technologies', skills: ['Environmental Systems', 'Green Building', 'Climate Change', 'Sustainability'], degreeLevel: 'M.Tech', branch: 'civil' },
  ],
  medical: [
    // === UNDERGRADUATE (UG) PROGRAMS ===
    { id: 'hospital-admin', name: 'Hospital Administration & Healthcare Management', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Manage healthcare facilities and operations', skills: ['Healthcare Policy', 'Operations', 'Finance', 'Leadership'], degreeLevel: 'UG' },
    { id: 'clinical-research', name: 'Clinical Research & Trials', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 85, description: 'Conduct and manage clinical trials for new treatments', skills: ['GCP', 'Data Analysis', 'Regulatory Affairs', 'Protocol Design'], degreeLevel: 'UG' },
    { id: 'health-informatics', name: 'Health Informatics', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Apply IT to improve healthcare delivery', skills: ['EHR Systems', 'Data Analytics', 'HL7/FHIR', 'Healthcare IT'], degreeLevel: 'UG' },
    { id: 'medical-coding', name: 'Medical Coding & Health Data Analytics', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 82, description: 'Translate medical records into standardized codes', skills: ['ICD-10', 'CPT Coding', 'Data Analysis', 'Compliance'], degreeLevel: 'UG' },
    { id: 'public-health', name: 'Public Health & Epidemiology', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 86, description: 'Study and improve population health outcomes', skills: ['Biostatistics', 'Disease Surveillance', 'Policy', 'Research'], degreeLevel: 'UG' },
    { id: 'mental-health', name: 'Mental Health & Psychology (Applied)', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Provide mental health support and therapy', skills: ['Counseling', 'CBT', 'Assessment', 'Crisis Intervention'], degreeLevel: 'UG' },
    { id: 'nutrition', name: 'Nutrition Science & Diet Planning', type: 'hybrid', growthPotential: 'medium', riskLevel: 'low', marketDemand: 78, description: 'Design nutrition plans for health and wellness', skills: ['Dietetics', 'Metabolism', 'Meal Planning', 'Client Counseling'], degreeLevel: 'UG' },

    // === MASTER'S (PG) PROGRAMS ===
    { id: 'msc-public-health', name: 'M.Sc. in Public Health', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 92, description: 'Advanced public health research, policy, and epidemiology', skills: ['Epidemiology', 'Health Policy', 'Biostatistics', 'Global Health'], degreeLevel: 'PG' },
    { id: 'mph', name: 'Master of Public Health (MPH)', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 91, description: 'Professional degree in public health with community health focus', skills: ['Community Health', 'Health Promotion', 'Environmental Health', 'Health Management'], degreeLevel: 'PG' },
    { id: 'msc-clinical-research', name: 'M.Sc. in Clinical Research', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 89, description: 'Advanced clinical trial design, regulatory affairs, and drug development', skills: ['Clinical Trials', 'GCP/ICH', 'Pharmacovigilance', 'Biostatistics'], degreeLevel: 'PG' },
    { id: 'mha', name: 'Master of Hospital Administration (MHA)', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Healthcare management, hospital operations, and leadership', skills: ['Hospital Management', 'Healthcare Finance', 'Quality Management', 'Leadership'], degreeLevel: 'PG' },
    { id: 'msc-health-informatics', name: 'M.Sc. in Health Informatics', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 93, description: 'Advanced health IT, data analytics, and digital health systems', skills: ['Health IT Systems', 'Data Mining', 'AI in Healthcare', 'Interoperability'], degreeLevel: 'PG' },
    { id: 'msc-biotechnology', name: 'M.Sc. in Medical Biotechnology', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 87, description: 'Biotechnology applications in medicine and healthcare', skills: ['Molecular Biology', 'Genetic Engineering', 'Biopharmaceuticals', 'Research'], degreeLevel: 'PG' },
    { id: 'msc-microbiology', name: 'M.Sc. in Medical Microbiology', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 84, description: 'Study of microorganisms and infectious diseases', skills: ['Bacteriology', 'Virology', 'Immunology', 'Lab Diagnostics'], degreeLevel: 'PG' },
    { id: 'msc-pharmacology', name: 'M.Sc. in Pharmacology', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 86, description: 'Drug development, mechanisms, and therapeutics', skills: ['Drug Development', 'Toxicology', 'Clinical Pharmacology', 'Research'], degreeLevel: 'PG' },
    { id: 'msc-psychology', name: 'M.Sc. in Clinical Psychology', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Advanced psychology with clinical practice and therapy focus', skills: ['Psychotherapy', 'Psychological Assessment', 'Research Methods', 'Counseling'], degreeLevel: 'PG' },
    { id: 'msc-nutrition', name: 'M.Sc. in Nutrition & Dietetics', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 82, description: 'Advanced nutrition science, clinical nutrition, and food science', skills: ['Clinical Nutrition', 'Food Science', 'Therapeutic Diets', 'Research'], degreeLevel: 'PG' },
  ],
  science: [
    // === UNDERGRADUATE (UG) PROGRAMS ===
    { id: 'rnd', name: 'Research & Development (R&D)', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 84, description: 'Drive innovation through scientific research', skills: ['Research Methods', 'Lab Techniques', 'Publication', 'Grant Writing'], degreeLevel: 'UG' },
    { id: 'computational', name: 'Computational Science', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Solve complex problems using computational models', skills: ['Programming', 'Numerical Methods', 'HPC', 'Simulation'], degreeLevel: 'UG' },
    { id: 'applied-math', name: 'Applied Mathematics & Statistics', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 86, description: 'Apply mathematical methods to real-world problems', skills: ['Statistics', 'Modeling', 'Optimization', 'Data Analysis'], degreeLevel: 'UG' },
    { id: 'bioinformatics', name: 'Bioinformatics', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 82, description: 'Analyze biological data using computational tools', skills: ['Genomics', 'Python/R', 'Sequence Analysis', 'Machine Learning'], degreeLevel: 'UG' },
    { id: 'environmental', name: 'Environmental & Climate Science', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 80, description: 'Study and address environmental challenges', skills: ['Climate Modeling', 'GIS', 'Sustainability', 'Data Analysis'], degreeLevel: 'UG' },
    { id: 'space-science', name: 'Space Science & Astrophysics', type: 'emerging', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 68, description: 'Explore the universe and celestial phenomena', skills: ['Physics', 'Astronomy', 'Data Analysis', 'Remote Sensing'], degreeLevel: 'UG' },
    { id: 'scientific-data', name: 'Scientific Data Analysis', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Analyze and interpret scientific datasets', skills: ['Python/R', 'Statistics', 'Visualization', 'Domain Expertise'], degreeLevel: 'UG' },

    // === MASTER'S (PG) PROGRAMS ===
    { id: 'msc-physics', name: 'M.Sc. in Physics', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 80, description: 'Advanced physics research in theoretical and experimental domains', skills: ['Quantum Mechanics', 'Research Methods', 'Mathematical Physics', 'Lab Techniques'], degreeLevel: 'PG' },
    { id: 'msc-chemistry', name: 'M.Sc. in Chemistry', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 82, description: 'Advanced chemistry with specializations in organic, inorganic, and physical chemistry', skills: ['Analytical Chemistry', 'Spectroscopy', 'Research', 'Lab Techniques'], degreeLevel: 'PG' },
    { id: 'msc-mathematics', name: 'M.Sc. in Mathematics', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 85, description: 'Pure and applied mathematics with research focus', skills: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Mathematical Modeling'], degreeLevel: 'PG' },
    { id: 'msc-biology', name: 'M.Sc. in Biology / Life Sciences', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 83, description: 'Advanced biological sciences and life sciences research', skills: ['Molecular Biology', 'Genetics', 'Ecology', 'Research Methods'], degreeLevel: 'PG' },
    { id: 'msc-env-science', name: 'M.Sc. in Environmental Science', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 87, description: 'Environmental conservation, climate change, and sustainability', skills: ['Climate Science', 'Environmental Policy', 'GIS', 'Sustainability'], degreeLevel: 'PG' },
    { id: 'msc-bioinformatics', name: 'M.Sc. in Bioinformatics', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 89, description: 'Computational biology, genomics, and biodata analytics', skills: ['Genomics', 'Proteomics', 'Biostatistics', 'Programming'], degreeLevel: 'PG' },
    { id: 'msc-geology', name: 'M.Sc. in Geology', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 75, description: 'Earth sciences, minerals, and geological research', skills: ['Geology', 'Geophysics', 'Mineral Exploration', 'GIS'], degreeLevel: 'PG' },
    { id: 'msc-statistics', name: 'M.Sc. in Statistics', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Advanced statistical methods and data analytics', skills: ['Advanced Statistics', 'Data Analytics', 'R/Python', 'Machine Learning'], degreeLevel: 'PG' },
  ],
  arts: [
    { id: 'psychology', name: 'Psychology & Behavioral Science', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 85, description: 'Understand human behavior and mental processes', skills: ['Research Methods', 'Statistics', 'Counseling', 'Assessment'] },
    { id: 'intl-relations', name: 'International Relations & Political Strategy', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 72, description: 'Analyze global politics and diplomacy', skills: ['Geopolitics', 'Diplomacy', 'Policy Analysis', 'Research'] },
    { id: 'public-policy', name: 'Public Policy & Governance', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 78, description: 'Shape and implement public policies', skills: ['Policy Analysis', 'Research', 'Stakeholder Management', 'Communication'] },
    { id: 'digital-humanities', name: 'Digital Humanities', type: 'emerging', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 65, description: 'Apply digital tools to humanities research', skills: ['Text Mining', 'Data Visualization', 'Programming', 'Research'] },
    { id: 'communication', name: 'Communication & Media Studies', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 76, description: 'Study and practice effective communication', skills: ['Media Analysis', 'Writing', 'Public Speaking', 'Digital Media'] },
    { id: 'philosophy-ethics', name: 'Philosophy & Ethics (Applied)', type: 'hybrid', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 62, description: 'Apply ethical reasoning to real-world problems', skills: ['Critical Thinking', 'Ethics', 'Logic', 'Writing'] },
  ],
  commerce: [
    // === UNDERGRADUATE (UG) PROGRAMS ===
    { id: 'financial-analysis', name: 'Financial Analysis & Investment Banking', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Analyze markets and manage investments', skills: ['Financial Modeling', 'Valuation', 'Excel', 'Due Diligence'], degreeLevel: 'UG' },
    { id: 'accounting', name: 'Accounting (CA, CPA, CMA Paths)', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 84, description: 'Manage finances and ensure compliance', skills: ['Accounting Standards', 'Taxation', 'Audit', 'Excel'], degreeLevel: 'UG' },
    { id: 'hrm', name: 'Human Resource Management (HRM)', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 80, description: 'Manage talent and organizational culture', skills: ['Recruitment', 'Performance Management', 'Employee Relations', 'HR Systems'], degreeLevel: 'UG' },
    { id: 'business-analytics', name: 'Business Analytics', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Drive decisions with data-driven insights', skills: ['SQL', 'Tableau', 'Statistics', 'Business Intelligence'], degreeLevel: 'UG' },
    { id: 'entrepreneurship', name: 'Entrepreneurship & Startup Management', type: 'hybrid', growthPotential: 'high', riskLevel: 'high', marketDemand: 78, description: 'Build and scale new ventures', skills: ['Business Strategy', 'Fundraising', 'Product Development', 'Leadership'], degreeLevel: 'UG' },
    { id: 'marketing-analytics', name: 'Marketing Analytics & Growth Strategy', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 86, description: 'Optimize marketing with data', skills: ['Digital Marketing', 'SEO/SEM', 'Analytics', 'Growth Hacking'], degreeLevel: 'UG' },
    { id: 'supply-chain', name: 'Supply Chain & Operations Management', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 82, description: 'Optimize logistics and operations', skills: ['Logistics', 'Inventory Management', 'Process Optimization', 'ERP'], degreeLevel: 'UG' },

    // === MASTER'S (PG) MBA PROGRAMS ===
    { id: 'mba-finance', name: 'MBA in Finance', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 94, description: 'Advanced finance, investment banking, and corporate finance', skills: ['Financial Management', 'Investment Analysis', 'Risk Management', 'Corporate Finance'], degreeLevel: 'PG' },
    { id: 'mba-marketing', name: 'MBA in Marketing', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 92, description: 'Strategic marketing, brand management, and digital marketing', skills: ['Brand Management', 'Marketing Strategy', 'Consumer Behavior', 'Digital Marketing'], degreeLevel: 'PG' },
    { id: 'mba-hr', name: 'MBA in Human Resource Management', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Strategic HR, talent management, and organizational development', skills: ['Talent Management', 'Organizational Behavior', 'Compensation & Benefits', 'HR Analytics'], degreeLevel: 'PG' },
    { id: 'mba-operations', name: 'MBA in Operations Management', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 86, description: 'Supply chain, operations strategy, and process optimization', skills: ['Operations Strategy', 'Supply Chain', 'Six Sigma', 'Project Management'], degreeLevel: 'PG' },
    { id: 'mba-analytics', name: 'MBA in Business Analytics', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 95, description: 'Data-driven decision making and business intelligence', skills: ['Data Analytics', 'Predictive Modeling', 'Business Intelligence', 'Data Strategy'], degreeLevel: 'PG' },
    { id: 'mba-consulting', name: 'MBA in Management Consulting', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 90, description: 'Strategy consulting, problem solving, and business transformation', skills: ['Strategy', 'Problem Solving', 'Case Analysis', 'Client Management'], degreeLevel: 'PG' },
    { id: 'mba-entrepreneurship', name: 'MBA in Entrepreneurship', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 85, description: 'Startups, innovation, and venture creation', skills: ['Venture Capital', 'Innovation', 'Business Planning', 'Fundraising'], degreeLevel: 'PG' },
    { id: 'mba-international', name: 'MBA in International Business', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 87, description: 'Global business, international trade, and cross-cultural management', skills: ['Global Strategy', 'International Trade', 'Cross-Cultural Management', 'Forex'], degreeLevel: 'PG' },

    // === SPECIALIZED MASTER'S PROGRAMS ===
    { id: 'msc-finance', name: 'M.Sc. in Finance', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 91, description: 'Quantitative finance, financial engineering, and risk management', skills: ['Quantitative Finance', 'Derivatives', 'Risk Management', 'Financial Modeling'], degreeLevel: 'PG' },
    { id: 'mcom', name: 'M.Com (Master of Commerce)', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 80, description: 'Advanced commerce, accounting, and business studies', skills: ['Accounting', 'Economics', 'Business Law', 'Research'], degreeLevel: 'PG' },
  ],
  law: [
    { id: 'corporate-law', name: 'Corporate & Business Law', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 86, description: 'Handle business legal matters and contracts', skills: ['Contract Law', 'M&A', 'Compliance', 'Negotiation'] },
    { id: 'cyber-law', name: 'Cyber Law & Data Protection', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Navigate digital law and privacy regulations', skills: ['GDPR', 'Data Privacy', 'IT Law', 'Cybercrime'] },
    { id: 'constitutional', name: 'Constitutional & Administrative Law', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 72, description: 'Practice constitutional and government law', skills: ['Constitutional Law', 'Litigation', 'Research', 'Advocacy'] },
    { id: 'judiciary', name: 'Judiciary Preparation', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 68, description: 'Prepare for judicial services examinations', skills: ['Legal Knowledge', 'Current Affairs', 'Writing', 'Interview Skills'] },
    { id: 'public-policy-law', name: 'Public Policy & Governance', type: 'hybrid', growthPotential: 'medium', riskLevel: 'low', marketDemand: 74, description: 'Work at the intersection of law and policy', skills: ['Policy Analysis', 'Legal Research', 'Drafting', 'Advocacy'] },
    { id: 'international-law', name: 'International Law', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 70, description: 'Practice law across borders', skills: ['International Treaties', 'Human Rights', 'Trade Law', 'Arbitration'] },
  ],
  education: [
    { id: 'edtech', name: 'Educational Technology (EdTech)', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Innovate learning with technology', skills: ['LMS', 'Instructional Design', 'E-Learning', 'UX for Education'] },
    { id: 'curriculum', name: 'Curriculum Design', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 76, description: 'Design effective learning experiences', skills: ['Curriculum Development', 'Assessment', 'Pedagogy', 'Standards Alignment'] },
    { id: 'edu-psychology', name: 'Educational Psychology', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 74, description: 'Apply psychology to improve learning', skills: ['Learning Theory', 'Assessment', 'Counseling', 'Research'] },
    { id: 'online-teaching', name: 'Online Teaching & Digital Pedagogy', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 84, description: 'Master virtual instruction methods', skills: ['Virtual Classrooms', 'Content Creation', 'Engagement', 'Tech Tools'] },
    { id: 'academic-research', name: 'Academic Research & Doctoral Track', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 68, description: 'Pursue advanced academic research', skills: ['Research Methods', 'Publication', 'Grant Writing', 'Teaching'] },
  ],
  design: [
    { id: 'motion', name: 'Motion Graphics & Animation', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 82, description: 'Bring designs to life with motion', skills: ['After Effects', 'Cinema 4D', 'Animation', 'Storytelling'] },
    { id: 'game-design', name: 'Game Design', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 78, description: 'Create engaging interactive experiences', skills: ['Unity/Unreal', 'Game Mechanics', '3D Art', 'Narrative Design'] },
    { id: 'film', name: 'Film Production & Direction', type: 'core', growthPotential: 'medium', riskLevel: 'high', marketDemand: 72, description: 'Produce and direct video content', skills: ['Cinematography', 'Editing', 'Directing', 'Sound Design'] },
    { id: 'content-creation', name: 'Digital Content Creation', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 86, description: 'Create engaging digital content', skills: ['Video Production', 'Social Media', 'Copywriting', 'Analytics'] },
    { id: 'branding', name: 'Branding & Visual Communication', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 80, description: 'Build memorable brand identities', skills: ['Brand Strategy', 'Visual Design', 'Typography', 'Marketing'] },
    { id: 'media-journalism', name: 'Journalism & Mass Communication', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 82, description: 'Master news reporting, anchoring, and digital journalism', skills: ['Reporting', 'News Analysis', 'Video Editing', 'Content Strategy'] },
    { id: 'media-digital', name: 'Digital Content & Influencer Strategy', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 90, description: 'Build and manage digital media brands and content platforms', skills: ['Social Media Analytics', 'YouTube SEO', 'Content Marketing', 'Monetization'] },
  ],
  defense: [
    { id: 'armed-forces', name: 'Indian Armed Forces (NDA, CDS, AFCAT, OTA)', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 85, description: 'Serve as an officer in the armed forces', skills: ['Physical Fitness', 'Leadership', 'Strategy', 'Discipline'] },
    { id: 'paramilitary', name: 'Paramilitary Forces', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 78, description: 'Serve in paramilitary organizations', skills: ['Physical Training', 'Law Enforcement', 'Security', 'Leadership'] },
    { id: 'intelligence', name: 'Intelligence & Strategic Operations', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 72, description: 'Work in intelligence and strategy', skills: ['Analysis', 'Research', 'Cryptography', 'Languages'] },
    { id: 'digital-forensics', name: 'Cybersecurity & Digital Forensics', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Investigate cyber crimes and threats', skills: ['Forensic Tools', 'Network Security', 'Investigation', 'Law'] },
    { id: 'disaster-mgmt', name: 'Disaster & Emergency Management', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 76, description: 'Manage emergency response operations', skills: ['Crisis Management', 'Planning', 'Coordination', 'First Response'] },
    { id: 'fire-safety', name: 'Fire & Industrial Safety', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 74, description: 'Ensure workplace and fire safety', skills: ['Safety Protocols', 'Risk Assessment', 'Training', 'Compliance'] },
  ],
  agriculture: [
    { id: 'agritech', name: 'Agri-Technology', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 82, description: 'Apply technology to modern farming', skills: ['Precision Agriculture', 'IoT', 'Data Analytics', 'Drones'] },
    { id: 'organic-farming', name: 'Sustainable & Organic Farming', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 78, description: 'Practice environmentally-friendly farming', skills: ['Organic Methods', 'Soil Health', 'Sustainability', 'Certification'] },
    { id: 'food-tech', name: 'Food Technology', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 80, description: 'Innovate in food processing and safety', skills: ['Food Science', 'Quality Control', 'Processing', 'Regulations'] },
    { id: 'climate-agriculture', name: 'Climate-Smart Agriculture', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 76, description: 'Adapt farming to climate change', skills: ['Climate Science', 'Sustainable Practices', 'Resource Management', 'Policy'] },
    { id: 'fisheries', name: 'Fisheries & Aquaculture', type: 'hybrid', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 68, description: 'Manage fish farming and aquatic resources', skills: ['Aquaculture', 'Marine Biology', 'Resource Management', 'Business'] },
    { id: 'veterinary', name: 'Veterinary & Animal Sciences', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 74, description: 'Care for animals and livestock', skills: ['Animal Health', 'Diagnostics', 'Surgery', 'Nutrition'] },
  ],
  hospitality: [
    { id: 'aviation', name: 'Aviation & Cabin Crew Services', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 82, description: 'Work in airline and aviation services', skills: ['Customer Service', 'Safety Procedures', 'Communication', 'Grooming'] },
    { id: 'hotel-mgmt', name: 'Hotel & Resort Management', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 78, description: 'Manage hospitality operations', skills: ['Operations', 'Guest Relations', 'Revenue Management', 'Leadership'] },
    { id: 'travel-ops', name: 'Travel Operations & Management', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 74, description: 'Plan and manage travel services', skills: ['Travel Planning', 'GDS Systems', 'Customer Service', 'Marketing'] },
    { id: 'event-mgmt', name: 'Event & Luxury Management', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 80, description: 'Create memorable events and experiences', skills: ['Event Planning', 'Vendor Management', 'Budgeting', 'Creativity'] },
    { id: 'cruise', name: 'Cruise & Maritime Hospitality', type: 'hybrid', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 68, description: 'Work in cruise line hospitality', skills: ['Maritime Knowledge', 'Guest Services', 'Multi-cultural', 'Operations'] },
  ],
  sports: [
    { id: 'sports-science', name: 'Sports Science & Performance', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 82, description: 'Optimize athletic performance', skills: ['Exercise Physiology', 'Biomechanics', 'Nutrition', 'Data Analysis'] },
    { id: 'strength-conditioning', name: 'Strength & Conditioning', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 84, description: 'Train athletes for peak performance', skills: ['Exercise Science', 'Program Design', 'Assessment', 'Injury Prevention'] },
    { id: 'coaching', name: 'Professional Coaching', type: 'core', growthPotential: 'medium', riskLevel: 'medium', marketDemand: 76, description: 'Coach athletes and teams', skills: ['Sport-Specific', 'Leadership', 'Strategy', 'Communication'] },
    { id: 'yoga-naturopathy', name: 'Yoga Therapy & Naturopathy', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 78, description: 'Promote holistic health and wellness', skills: ['Yoga', 'Alternative Medicine', 'Wellness', 'Counseling'] },
    { id: 'fitness-business', name: 'Fitness Entrepreneurship', type: 'hybrid', growthPotential: 'high', riskLevel: 'high', marketDemand: 74, description: 'Build fitness and wellness businesses', skills: ['Business Management', 'Marketing', 'Personal Training', 'Client Relations'] },
  ],
  vocational: [
    { id: 'industrial-trades', name: 'Industrial & Technical Trades', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 82, description: 'Master industrial technical skills', skills: ['Welding', 'Machining', 'Electrical', 'Plumbing'] },
    { id: 'iti-polytechnic', name: 'ITI & Polytechnic Certifications', type: 'core', growthPotential: 'medium', riskLevel: 'low', marketDemand: 78, description: 'Earn vocational certifications', skills: ['Technical Skills', 'Practical Training', 'Industry Knowledge', 'Safety'] },
    { id: 'ev-tech', name: 'Electric Vehicle Technology', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 86, description: 'Work on electric vehicle systems', skills: ['EV Systems', 'Battery Tech', 'Electronics', 'Diagnostics'] },
    { id: 'renewable-energy', name: 'Renewable Energy Systems', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 84, description: 'Install and maintain renewable systems', skills: ['Solar/Wind', 'Installation', 'Maintenance', 'Grid Systems'] },
    { id: 'skill-india', name: 'Skill India & Government Skill Programs', type: 'hybrid', growthPotential: 'medium', riskLevel: 'low', marketDemand: 76, description: 'Access government skill development', skills: ['Various Trades', 'Certification', 'Apprenticeship', 'Placement'] },
  ],
  // ============================================
  // NEW FIELD SPECIALIZATIONS
  // ============================================
  'cloud-computing': [
    { id: 'cloud-architecture', name: 'Cloud Architecture & Solutions Design', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 94, description: 'Design enterprise-grade cloud solutions', skills: ['AWS', 'Azure', 'GCP', 'Architecture Patterns'] },
    { id: 'cloud-security', name: 'Cloud Security & Compliance', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 92, description: 'Secure cloud infrastructure and ensure compliance', skills: ['IAM', 'Security Controls', 'Compliance', 'Zero Trust'] },
  ],
  devops: [
    { id: 'cloud-devops', name: 'Cloud DevOps & SRE', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 95, description: 'Automate deployments and ensure cloud system reliability', skills: ['Terraform', 'Kubernetes', 'CI/CD', 'Docker', 'Prometheus'] },
  ],
  'blockchain-web3': [
    { id: 'web3-smart-contracts', name: 'Smart Contract Development', type: 'core', growthPotential: 'high', riskLevel: 'medium', marketDemand: 85, description: 'Write and audit smart contracts on Ethereum and other chains', skills: ['Solidity', 'Rust', 'Security Auditing', 'Truffle/Hardhat'] },
    { id: 'web3-dapps', name: 'DApp Development', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 84, description: 'Build decentralized application frontends and backends', skills: ['ethers.js', 'React', 'IPFS', 'Wallet Integration'] },
  ],
  'ar-vr': [
    { id: 'tech-xr', name: 'AR/VR & Spatial Computing', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 82, description: 'Create immersive experiences combining virtual and physical worlds', skills: ['Unity', 'Unreal Engine', 'C#', '3D Modeling'] },
  ],
  quantum: [
    { id: 'tech-quantum', name: 'Quantum Computing', type: 'emerging', growthPotential: 'high', riskLevel: 'high', marketDemand: 70, description: 'Algorithm design and programming for quantum computers', skills: ['Qiskit', 'Quantum Gates', 'Complex Math'] },
  ],
  'robotics-automation': [
    { id: 'tech-robotics', name: 'Robotics & Autonomous Systems', type: 'emerging', growthPotential: 'high', riskLevel: 'medium', marketDemand: 86, description: 'Design and program autonomous robots and industrial systems', skills: ['ROS', 'Control Systems', 'Embedded C', 'AI'] },
  ],
  bioinformatics: [
    { id: 'tech-bio', name: 'Bioinformatics & Computational Biology', type: 'emerging', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Analyze biological data using computational tools', skills: ['Genomics', 'Python/R', 'Sequence Analysis'] },
  ],
  'product-management': [
    { id: 'prod-pm', name: 'Technical Product Management', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 92, description: 'Lead product development from discovery to launch', skills: ['Agile', 'Roadmapping', 'User Feedback', 'Jira'] },
    { id: 'prod-leadership', name: 'Tech Leadership & Strategy', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 88, description: 'Scale engineering teams and define tech vision', skills: ['Leadership', 'System Design', 'Strategy', 'Mentorship'] },
  ],
  'ui-ux': [
    { id: 'ui-ux-design', name: 'UI / UX Design', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 92, description: 'Create intuitive and beautiful user experiences', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'] },
    { id: 'ui-research', name: 'UX Research & HCI', type: 'core', growthPotential: 'high', riskLevel: 'low', marketDemand: 85, description: 'Deep dive into user behavior and psychology', skills: ['Surveys', 'User Testing', 'Psychology', 'Statistics'] },
  ],
};

export const getFieldById = (id: string): Field | undefined => {
  return fields.find(f => f.id === id);
};

export const getSpecializationsForField = (fieldId: string): Specialization[] => {
  return specializationsMap[fieldId] || [];
};
