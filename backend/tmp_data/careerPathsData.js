const careerPathsMap = {
  // ==========================================
  // ENGINEERING BRANCH SPECIALIZATIONS
  // ==========================================

  // --- CSE (Computer Science) ---
  'cse-software-dev': [
    { id: 'swe-1', name: 'Software Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 5, growthScope: 'high', description: 'Build and maintain software systems', milestones: ['Coding', 'System Design', 'Testing'], avgSalary: '$100k+' },
    { id: 'swe-2', name: 'Senior Software Engineer', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 5, growthScope: 'high', description: 'Lead software projects and design', milestones: ['Architecture', 'Leadership', 'Scale'], avgSalary: '$150k+' }
  ],
  'cse-web-dev': [
    { id: 'web-1', name: 'Frontend Developer', difficulty: 'intermediate', timeToStability: '1 year', riskScore: 8, growthScope: 'high', description: 'Build user interfaces', milestones: ['React', 'CSS', 'Performance'], avgSalary: '$90k+' },
    { id: 'web-2', name: 'Full Stack Developer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 8, growthScope: 'high', description: 'Handle both client and server side', milestones: ['Node.js', 'Databases', 'API Design'], avgSalary: '$120k+' }
  ],
  'cse-mobile-dev': [
    { id: 'mob-1', name: 'iOS Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Build iOS apps', milestones: ['Swift', 'UIKit', 'App Store'], avgSalary: '$110k+' },
    { id: 'mob-2', name: 'Android Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Build Android apps', milestones: ['Kotlin', 'Jetpack', 'Play Store'], avgSalary: '$110k+' }
  ],
  'cse-ai-ml': [
    { id: 'ai-1', name: 'ML Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Deploy ML models', milestones: ['Python', 'TensorFlow', 'MLOps'], avgSalary: '$140k+' },
    { id: 'ai-2', name: 'AI Researcher', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 15, growthScope: 'high', description: 'Novel AI research', milestones: ['Publications', 'PhD', 'Innovation'], avgSalary: '$160k+' }
  ],
  'cse-data-science': [
    { id: 'ds-1', name: 'Data Scientist', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Extract insights from data', milestones: ['Statistics', 'ML', 'Visualization'], avgSalary: '$130k+' },
    { id: 'ds-2', name: 'Data Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'high', description: 'Build data pipelines', milestones: ['SQL', 'Spark', 'ETL'], avgSalary: '$125k+' }
  ],
  'cse-cloud': [
    { id: 'cld-1', name: 'Cloud Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'high', description: 'Manage cloud infrastructure', milestones: ['AWS', 'Terraform', 'Linux'], avgSalary: '$120k+' },
    { id: 'cld-2', name: 'Cloud Architect', difficulty: 'advanced', timeToStability: '5 years', riskScore: 10, growthScope: 'high', description: 'Design cloud systems', milestones: ['Architecture', 'Security', 'Cost'], avgSalary: '$160k+' }
  ],
  'cse-cybersecurity': [
    { id: 'sec-1', name: 'Security Analyst', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 10, growthScope: 'high', description: 'Monitor security threats', milestones: ['SOC', 'SIEM', 'Network'], avgSalary: '$100k+' },
    { id: 'sec-2', name: 'Penetration Tester', difficulty: 'advanced', timeToStability: '3 years', riskScore: 12, growthScope: 'high', description: 'Ethical hacking', milestones: ['OSCP', 'Exploits', 'Reporting'], avgSalary: '$130k+' }
  ],
  'cse-database': [
    { id: 'dba-1', name: 'Database Administrator', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 8, growthScope: 'medium', description: 'Manage databases', milestones: ['SQL', 'Backup', 'Performance'], avgSalary: '$100k+' },
    { id: 'dba-2', name: 'Data Architect', difficulty: 'advanced', timeToStability: '5 years', riskScore: 8, growthScope: 'high', description: 'Design data models', milestones: ['Modeling', 'Warehousing', 'Governance'], avgSalary: '$140k+' }
  ],
  // CSE PG
  'cse-mtech': [{ id: 'pg-cse-1', name: 'Senior R&D Engineer', difficulty: 'advanced', timeToStability: '2 years', riskScore: 5, growthScope: 'high', description: 'Lead R&D initiatives', milestones: ['Research', 'Patents', 'Leadership'], avgSalary: '$140k+' }],
  'cse-mtech-ai': [{ id: 'pg-ai-1', name: 'Lead AI Scientist', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'high', description: 'Lead AI projects', milestones: ['Deep Learning', 'Strategy', 'Team Lead'], avgSalary: '$170k+' }],
  'cse-mtech-data': [{ id: 'pg-ds-1', name: 'Principal Data Scientist', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'high', description: 'Strategic data science', milestones: ['Big Data strategy', 'Algorithms', 'Impact'], avgSalary: '$160k+' }],
  'cse-mtech-cyber': [{ id: 'pg-sec-1', name: 'Security Architect', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'high', description: 'Enterprise security design', milestones: ['Architecture', 'Compliance', 'CISO track'], avgSalary: '$160k+' }],
  'cse-mtech-cloud': [{ id: 'pg-cld-1', name: 'Principal Cloud Architect', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'Cloud strategy leadership', milestones: ['Multi-cloud', 'Strategy', 'Executive'], avgSalary: '$180k+' }],

  // --- ECE (Electronics) ---
  'ece-vlsi': [
    { id: 'vlsi-1', name: 'VLSI Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Design ICs', milestones: ['Verilog', 'RTL', 'Verification'], avgSalary: '$110k+' },
    { id: 'vlsi-2', name: 'Physical Design Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 12, growthScope: 'high', description: 'Chip layout and timing', milestones: ['Place & Route', 'Timing Analysis', 'Tapeout'], avgSalary: '$130k+' }
  ],
  'ece-embedded': [
    { id: 'emb-1', name: 'Embedded Systems Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 10, growthScope: 'high', description: 'Firmware & Hardware', milestones: ['C/C++', 'Microcontrollers', 'RTOS'], avgSalary: '$100k+' },
    { id: 'emb-2', name: 'IoT Solutions Architect', difficulty: 'advanced', timeToStability: '4 years', riskScore: 10, growthScope: 'high', description: 'Connected systems design', milestones: ['IoT Protocols', 'Cloud', 'Architecture'], avgSalary: '$140k+' }
  ],
  'ece-communication': [
    { id: 'comm-1', name: 'Network Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'medium', description: 'Manage networks', milestones: ['CCNA', 'Routing', 'Switching'], avgSalary: '$90k+' },
    { id: 'comm-2', name: 'Telecom Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'medium', description: 'Telecom infrastructure', milestones: ['5G', 'RF', 'Signal Proc'], avgSalary: '$110k+' }
  ],
  'ece-signal': [
    { id: 'dsp-1', name: 'DSP Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 15, growthScope: 'medium', description: 'Signal processing algorithms', milestones: ['MATLAB', 'Algorithms', 'Audio/Video'], avgSalary: '$115k+' }
  ],
  'ece-rf': [
    { id: 'rf-1', name: 'RF Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 12, growthScope: 'medium', description: 'Radio frequency systems', milestones: ['Antenna Design', 'Spectrum', 'Testing'], avgSalary: '$110k+' }
  ],
  'ece-optical': [
    { id: 'opt-1', name: 'Optical Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 15, growthScope: 'medium', description: 'Optical systems', milestones: ['Photonics', 'Fiber', 'Lasers'], avgSalary: '$110k+' }
  ],
  // ECE PG
  'ece-mtech-vlsi': [{ id: 'pg-vlsi-1', name: 'Senior Staff VLSI Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'Lead chip design', milestones: ['Chip Arch', 'Team Lead', 'Tapeout'], avgSalary: '$160k+' }],
  'ece-mtech-embedded': [{ id: 'pg-emb-1', name: 'Embedded System Architect', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'Complex embedded systems', milestones: ['System Arch', 'Safety Critical', 'Auto/Aero'], avgSalary: '$150k+' }],
  'ece-mtech-comm': [{ id: 'pg-comm-1', name: 'Communication Systems Lead', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'medium', description: 'Next-gen comms', milestones: ['6G Research', 'Standards', 'Patents'], avgSalary: '$140k+' }],

  // --- EEE (Electrical) ---
  'eee-power-systems': [
    { id: 'pwr-1', name: 'Power Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'medium', description: 'Power grid operations', milestones: ['Grid Ops', 'Safety', 'Maintenance'], avgSalary: '$90k+' },
    { id: 'pwr-2', name: 'Grid Planning Engineer', difficulty: 'advanced', timeToStability: '4 years', riskScore: 5, growthScope: 'high', description: 'Plan power infrastructure', milestones: ['Simulation', 'Capacity', 'Reliability'], avgSalary: '$120k+' }
  ],
  'eee-renewable': [
    { id: 'ren-1', name: 'Solar Energy Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'high', description: 'Solar PV systems', milestones: ['PV Design', 'Installation', 'Efficiency'], avgSalary: '$95k+' },
    { id: 'ren-2', name: 'Wind Energy Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'high', description: 'Wind farm systems', milestones: ['Turbines', 'Aerodynamics', 'Siting'], avgSalary: '$110k+' }
  ],
  'eee-power-electronics': [
    { id: 'pe-1', name: 'Power Electronics Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'high', description: 'Converters and drives', milestones: ['Inverters', 'PCB Design', 'Thermal'], avgSalary: '$115k+' }
  ],
  'eee-ev': [
    { id: 'ev-1', name: 'EV Powertrain Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'Electric vehicle drive units', milestones: ['Motors', 'Inverters', 'Testing'], avgSalary: '$125k+' },
    { id: 'ev-2', name: 'Battery Systems Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'Battery packs and BMS', milestones: ['Chemistry', 'BMS', 'Safety'], avgSalary: '$125k+' }
  ],
  'eee-control': [
    { id: 'ctrl-1', name: 'Controls Engineer', difficulty: 'advanced', timeToStability: '2 years', riskScore: 8, growthScope: 'medium', description: 'Industrial automation', milestones: ['PLC', 'SCADA', 'PID'], avgSalary: '$100k+' }
  ],
  'eee-instrumentation': [
    { id: 'inst-1', name: 'Instrumentation Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'medium', description: 'Sensors and measurement', milestones: ['Calibration', 'Sensors', 'DAQ'], avgSalary: '$90k+' }
  ],
  // EEE PG
  'eee-mtech-power': [{ id: 'pg-pwr-1', name: 'Senior Power System Analyst', difficulty: 'advanced', timeToStability: '3 years', riskScore: 5, growthScope: 'high', description: 'Advanced grid analytics', milestones: ['Smart Grid', 'Stability', 'Markets'], avgSalary: '$140k+' }],
  'eee-mtech-pe': [{ id: 'pg-pe-1', name: 'Lead Power Electronics Design', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'High power conversion', milestones: ['Wide Bandgap', 'Auto/Aero', 'Innovation'], avgSalary: '$145k+' }],
  'eee-mtech-renewable': [{ id: 'pg-ren-1', name: 'Renewable Integration Specialist', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'Grid integration of renewables', milestones: ['Grid Codes', 'Storage', 'Stability'], avgSalary: '$135k+' }],

  // --- Mechanical ---
  'mech-design': [
    { id: 'mech-1', name: 'Mechanical Design Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'medium', description: 'Product design CAD', milestones: ['SolidWorks', 'GD&T', 'Prototyping'], avgSalary: '$85k+' },
    { id: 'mech-2', name: 'CAE Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'Analysis and simulation', milestones: ['FEA', 'ANSYS', 'Optimization'], avgSalary: '$110k+' }
  ],
  'mech-thermal': [
    { id: 'therm-1', name: 'Thermal Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'medium', description: 'Cooling and heat transfer', milestones: ['Thermodynamics', 'Heat Sinks', 'Testing'], avgSalary: '$100k+' },
    { id: 'therm-2', name: 'HVAC Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'medium', description: 'Building climate systems', milestones: ['HVAC Design', 'Codes', 'Efficiency'], avgSalary: '$90k+' }
  ],
  'mech-robotics': [
    { id: 'robo-1', name: 'Robotics Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'high', description: 'Robot design and control', milestones: ['ROS', 'Kinematics', 'Mechatronics'], avgSalary: '$120k+' }
  ],
  'mech-automotive': [
    { id: 'auto-1', name: 'Automotive Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'medium', description: 'Vehicle systems', milestones: ['Chassis', 'Powertrain', 'Safety'], avgSalary: '$95k+' }
  ],
  'mech-cfd': [
    { id: 'cfd-1', name: 'CFD Analyst', difficulty: 'advanced', timeToStability: '3 years', riskScore: 10, growthScope: 'high', description: 'Fluid flow simulation', milestones: ['Meshing', 'Turbulence', 'Aerodynamics'], avgSalary: '$115k+' }
  ],
  'mech-production': [
    { id: 'prod-1', name: 'Manufacturing Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'medium', description: 'Production lines', milestones: ['Lean', 'Process', 'Quality'], avgSalary: '$85k+' }
  ],
  // Mech PG
  'mech-mtech-design': [{ id: 'pg-mech-1', name: 'Senior Mechanical Architect', difficulty: 'advanced', timeToStability: '4 years', riskScore: 5, growthScope: 'high', description: 'Complex system architecture', milestones: ['Systems Eng', 'Leadership', 'Innovation'], avgSalary: '$140k+' }],
  'mech-mtech-thermal': [{ id: 'pg-therm-1', name: 'Principal Thermal Engineer', difficulty: 'advanced', timeToStability: '4 years', riskScore: 8, growthScope: 'high', description: 'Advanced thermal management', milestones: ['Data Centers', 'EVs', 'Space'], avgSalary: '$150k+' }],
  'mech-mtech-robotics': [{ id: 'pg-robo-1', name: 'Lead Robotics Systems Engineer', difficulty: 'advanced', timeToStability: '4 years', riskScore: 10, growthScope: 'high', description: 'Advanced robotics R&D', milestones: ['AI Integration', 'Autonomy', 'Research'], avgSalary: '$160k+' }],

  // --- Civil ---
  'civil-structural': [
    { id: 'struct-1', name: 'Structural Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 5, growthScope: 'medium', description: 'Building structures', milestones: ['PE License', 'Steel/Concrete', 'Analysis'], avgSalary: '$90k+' },
    { id: 'struct-2', name: 'Bridge Engineer', difficulty: 'advanced', timeToStability: '4 years', riskScore: 8, growthScope: 'high', description: 'Bridge design', milestones: ['Bridge Codes', 'Seismic', 'Inspection'], avgSalary: '$100k+' }
  ],
  'civil-construction': [
    { id: 'const-1', name: 'Construction Manager', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'high', description: 'Site management', milestones: ['Scheduling', 'Budgeting', 'Safety'], avgSalary: '$95k+' },
    { id: 'const-2', name: 'Project Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'medium', description: 'Engineering support', milestones: ['RFIs', 'Submittals', 'Coordination'], avgSalary: '$80k+' }
  ],
  'civil-transport': [
    { id: 'trans-1', name: 'Transportation Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'high', description: 'Roads and traffic', milestones: ['Traffic Sim', 'Highway Design', 'Planning'], avgSalary: '$85k+' }
  ],
  'civil-environmental': [
    { id: 'env-1', name: 'Environmental Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'high', description: 'Water and waste', milestones: ['Treatment', 'Permitting', 'Sustainability'], avgSalary: '$85k+' }
  ],
  'civil-geotech': [
    { id: 'geo-1', name: 'Geotechnical Engineer', difficulty: 'advanced', timeToStability: '3 years', riskScore: 8, growthScope: 'high', description: 'Foundations and soil', milestones: ['Soil Mech', 'Foundations', 'Field Work'], avgSalary: '$90k+' }
  ],
  'civil-water': [
    { id: 'wtr-1', name: 'Water Resources Engineer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'high', description: 'Hydraulics and hydrology', milestones: ['HEC-RAS', 'Stormwater', 'Flood Control'], avgSalary: '$88k+' }
  ],
  // Civil PG
  'civil-mtech-structural': [{ id: 'pg-struct-1', name: 'Principal Structural Engineer', difficulty: 'advanced', timeToStability: '5 years', riskScore: 5, growthScope: 'high', description: 'Major infrastructure design', milestones: ['High-rise', 'Seismic', 'Forensics'], avgSalary: '$130k+' }],
  'civil-mtech-construction': [{ id: 'pg-const-1', name: 'Senior Construction Manager', difficulty: 'advanced', timeToStability: '5 years', riskScore: 8, growthScope: 'high', description: 'Large scale projects', milestones: ['Mega-projects', 'Executive', 'PMP'], avgSalary: '$140k+' }],
  'civil-mtech-transport': [{ id: 'pg-trans-1', name: 'Senior Transportation Planner', difficulty: 'advanced', timeToStability: '4 years', riskScore: 5, growthScope: 'high', description: 'Regional transport strategy', milestones: ['Policy', 'Systems', 'Transit'], avgSalary: '$125k+' }],
  'civil-mtech-env': [{ id: 'pg-env-1', name: 'Environmental Consultant', difficulty: 'advanced', timeToStability: '4 years', riskScore: 8, growthScope: 'high', description: 'Complex environmental solutions', milestones: ['Remediation', 'ESG', 'Compliance'], avgSalary: '$120k+' }],
  // Engineering & Technology (Legacy)
  'ai-ml': [
    { id: 'ml-engineer', name: 'ML Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Build and deploy machine learning models at scale', milestones: ['Python Mastery', 'ML Frameworks', 'Production Systems'], avgSalary: '$150k+' },
    { id: 'data-scientist', name: 'Data Scientist', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Extract insights and build predictive models', milestones: ['Statistics', 'Visualization', 'ML Basics'], avgSalary: '$130k+' },
    { id: 'ai-researcher', name: 'AI Researcher', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 25, growthScope: 'high', description: 'Push the boundaries of AI capabilities', milestones: ['PhD/Research', 'Publications', 'Novel Algorithms'], avgSalary: '$180k+' },
  ],
  'data-science': [
    { id: 'data-analyst', name: 'Data Analyst', difficulty: 'beginner', timeToStability: '1 year', riskScore: 8, growthScope: 'high', description: 'Analyze data to drive business decisions', milestones: ['SQL', 'Excel', 'Visualization'], avgSalary: '$80k+' },
    { id: 'data-engineer', name: 'Data Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Build data pipelines and infrastructure', milestones: ['ETL', 'Spark', 'Cloud Platforms'], avgSalary: '$140k+' },
    { id: 'analytics-manager', name: 'Analytics Manager', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Lead analytics teams and strategy', milestones: ['Leadership', 'Strategy', 'Stakeholder Mgmt'], avgSalary: '$160k+' },
  ],
  'cloud': [
    { id: 'cloud-architect', name: 'Cloud Architect', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Design enterprise cloud solutions', milestones: ['AWS/Azure', 'Architecture', 'Security'], avgSalary: '$160k+' },
    { id: 'devops-engineer', name: 'DevOps Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Automate and optimize deployments', milestones: ['CI/CD', 'Kubernetes', 'Monitoring'], avgSalary: '$145k+' },
    { id: 'sre', name: 'Site Reliability Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Ensure system reliability at scale', milestones: ['SRE Practices', 'Automation', 'Incident Response'], avgSalary: '$165k+' },
  ],
  'cybersecurity': [
    { id: 'security-analyst', name: 'Security Analyst', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Monitor and protect systems from threats', milestones: ['Security Tools', 'Threat Analysis', 'Compliance'], avgSalary: '$100k+' },
    { id: 'pentester', name: 'Penetration Tester', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Test systems for vulnerabilities', milestones: ['Ethical Hacking', 'Certifications', 'Reporting'], avgSalary: '$130k+' },
    { id: 'ciso', name: 'Chief Information Security Officer', difficulty: 'advanced', timeToStability: '8-10 years', riskScore: 15, growthScope: 'high', description: 'Lead organizational security strategy', milestones: ['Leadership', 'Risk Mgmt', 'Governance'], avgSalary: '$250k+' },
  ],
  'devops': [
    { id: 'devops-engineer', name: 'DevOps Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Bridge development and operations', milestones: ['CI/CD', 'Containers', 'IaC'], avgSalary: '$140k+' },
    { id: 'platform-engineer', name: 'Platform Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Build internal developer platforms', milestones: ['Kubernetes', 'Platform Design', 'APIs'], avgSalary: '$160k+' },
    { id: 'sre-manager', name: 'SRE Manager', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 12, growthScope: 'high', description: 'Lead reliability engineering teams', milestones: ['Team Leadership', 'Strategy', 'Scaling'], avgSalary: '$180k+' },
  ],
  'blockchain': [
    { id: 'blockchain-dev', name: 'Blockchain Developer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 30, growthScope: 'medium', description: 'Build decentralized applications', milestones: ['Solidity', 'Smart Contracts', 'Web3'], avgSalary: '$140k+' },
    { id: 'defi-specialist', name: 'DeFi Specialist', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 40, growthScope: 'medium', description: 'Design decentralized finance protocols', milestones: ['DeFi Protocols', 'Tokenomics', 'Security'], avgSalary: '$160k+' },
    { id: 'blockchain-architect', name: 'Blockchain Architect', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 25, growthScope: 'medium', description: 'Design blockchain infrastructure', milestones: ['Architecture', 'Consensus', 'Scalability'], avgSalary: '$180k+' },
  ],
  'ar-vr': [
    { id: 'xr-developer', name: 'XR Developer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 25, growthScope: 'high', description: 'Build immersive AR/VR experiences', milestones: ['Unity/Unreal', '3D Development', 'UX Design'], avgSalary: '$130k+' },
    { id: '3d-artist', name: '3D Artist', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 20, growthScope: 'medium', description: 'Create 3D assets for virtual worlds', milestones: ['3D Modeling', 'Texturing', 'Animation'], avgSalary: '$90k+' },
    { id: 'metaverse-architect', name: 'Metaverse Architect', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 35, growthScope: 'high', description: 'Design virtual world experiences', milestones: ['World Building', 'Social Systems', 'Economy Design'], avgSalary: '$150k+' },
  ],
  'iot': [
    { id: 'iot-engineer', name: 'IoT Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 12, growthScope: 'high', description: 'Build connected device systems', milestones: ['Embedded Systems', 'Protocols', 'Cloud Integration'], avgSalary: '$120k+' },
    { id: 'embedded-dev', name: 'Embedded Developer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Program embedded systems', milestones: ['C/C++', 'RTOS', 'Hardware'], avgSalary: '$130k+' },
    { id: 'iot-architect', name: 'IoT Solutions Architect', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'high', description: 'Design enterprise IoT solutions', milestones: ['Architecture', 'Security', 'Scale'], avgSalary: '$160k+' },
  ],
  'quantum': [
    { id: 'quantum-researcher', name: 'Quantum Researcher', difficulty: 'advanced', timeToStability: '5+ years', riskScore: 50, growthScope: 'high', description: 'Research quantum computing algorithms', milestones: ['PhD', 'Quantum Theory', 'Publications'], avgSalary: '$150k+' },
    { id: 'quantum-engineer', name: 'Quantum Software Engineer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 40, growthScope: 'high', description: 'Develop quantum software', milestones: ['Qiskit/Cirq', 'Algorithms', 'Optimization'], avgSalary: '$160k+' },
  ],
  'fullstack': [
    { id: 'senior-dev', name: 'Senior Developer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Lead development of complex applications', milestones: ['Frontend', 'Backend', 'Architecture'], avgSalary: '$140k+' },
    { id: 'tech-lead', name: 'Tech Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 15, growthScope: 'high', description: 'Lead technical teams and decisions', milestones: ['Leadership', 'System Design', 'Team Management'], avgSalary: '$170k+' },
    { id: 'startup-founder', name: 'Startup Founder', difficulty: 'advanced', timeToStability: '5+ years', riskScore: 70, growthScope: 'high', description: 'Build your own tech company', milestones: ['MVP', 'Funding', 'Product-Market Fit'], avgSalary: 'Variable' },
  ],

  // Medical & Health Sciences
  'hospital-admin': [
    { id: 'hospital-admin-manager', name: 'Hospital Administrator', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Manage hospital operations', milestones: ['Operations', 'Compliance', 'Leadership'], avgSalary: '$100k+' },
    { id: 'healthcare-consultant', name: 'Healthcare Consultant', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 15, growthScope: 'high', description: 'Advise healthcare organizations', milestones: ['Strategy', 'Analytics', 'Transformation'], avgSalary: '$130k+' },
  ],
  'clinical-research': [
    { id: 'cra', name: 'Clinical Research Associate', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Monitor clinical trials', milestones: ['GCP', 'Protocol', 'Site Management'], avgSalary: '$85k+' },
    { id: 'clinical-project-manager', name: 'Clinical Project Manager', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Lead clinical research programs', milestones: ['Project Mgmt', 'Regulatory', 'Team Leadership'], avgSalary: '$120k+' },
  ],
  'health-informatics': [
    { id: 'health-informaticist', name: 'Health Informaticist', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'high', description: 'Apply IT to healthcare delivery', milestones: ['EHR Systems', 'Data Analysis', 'Integration'], avgSalary: '$95k+' },
    { id: 'chief-health-officer', name: 'Chief Health Informatics Officer', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 12, growthScope: 'high', description: 'Lead health IT strategy', milestones: ['Strategy', 'Leadership', 'Innovation'], avgSalary: '$180k+' },
  ],
  'medical-coding': [
    { id: 'medical-coder', name: 'Medical Coder', difficulty: 'beginner', timeToStability: '1 year', riskScore: 5, growthScope: 'medium', description: 'Code medical records accurately', milestones: ['ICD-10', 'CPT', 'Certification'], avgSalary: '$55k+' },
    { id: 'coding-supervisor', name: 'Coding Supervisor', difficulty: 'intermediate', timeToStability: '3-4 years', riskScore: 8, growthScope: 'medium', description: 'Lead medical coding teams', milestones: ['Leadership', 'Quality Assurance', 'Compliance'], avgSalary: '$75k+' },
  ],
  'public-health': [
    { id: 'epidemiologist', name: 'Epidemiologist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'high', description: 'Study disease patterns', milestones: ['Biostatistics', 'Research', 'Publications'], avgSalary: '$90k+' },
    { id: 'public-health-director', name: 'Public Health Director', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 12, growthScope: 'high', description: 'Lead public health initiatives', milestones: ['Policy', 'Leadership', 'Community Health'], avgSalary: '$130k+' },
  ],
  'mental-health': [
    { id: 'clinical-psychologist', name: 'Clinical Psychologist', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 8, growthScope: 'high', description: 'Provide psychological therapy', milestones: ['PhD/PsyD', 'Licensure', 'Specialization'], avgSalary: '$95k+' },
    { id: 'mental-health-counselor', name: 'Mental Health Counselor', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 8, growthScope: 'high', description: 'Counsel individuals and groups', milestones: ['Masters', 'Licensure', 'Practice'], avgSalary: '$55k+' },
  ],
  'nutrition': [
    { id: 'clinical-dietitian', name: 'Clinical Dietitian', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 5, growthScope: 'medium', description: 'Provide medical nutrition therapy', milestones: ['RD Credential', 'Clinical Experience', 'Specialization'], avgSalary: '$65k+' },
    { id: 'nutrition-consultant', name: 'Nutrition Consultant', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 15, growthScope: 'medium', description: 'Advise clients on nutrition', milestones: ['Certification', 'Client Building', 'Marketing'], avgSalary: '$80k+' },
  ],

  // Science & Research
  'rnd': [
    { id: 'research-scientist', name: 'Research Scientist', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 20, growthScope: 'high', description: 'Lead research projects', milestones: ['PhD', 'Publications', 'Grants'], avgSalary: '$100k+' },
    { id: 'rd-director', name: 'R&D Director', difficulty: 'advanced', timeToStability: '8-10 years', riskScore: 15, growthScope: 'high', description: 'Direct research strategy', milestones: ['Leadership', 'Strategy', 'Innovation'], avgSalary: '$180k+' },
  ],
  'computational': [
    { id: 'computational-scientist', name: 'Computational Scientist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Solve complex problems computationally', milestones: ['Programming', 'HPC', 'Domain Expertise'], avgSalary: '$130k+' },
    { id: 'simulation-engineer', name: 'Simulation Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Build simulation models', milestones: ['Modeling', 'Validation', 'Optimization'], avgSalary: '$120k+' },
  ],
  'applied-math': [
    { id: 'statistician', name: 'Statistician', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'high', description: 'Apply statistical methods', milestones: ['Statistics', 'Programming', 'Domain Knowledge'], avgSalary: '$100k+' },
    { id: 'quant-analyst', name: 'Quantitative Analyst', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Build quantitative models', milestones: ['Mathematics', 'Finance', 'Programming'], avgSalary: '$180k+' },
  ],
  'bioinformatics': [
    { id: 'bioinformatician', name: 'Bioinformatician', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Analyze biological data', milestones: ['Genomics', 'Programming', 'ML'], avgSalary: '$110k+' },
    { id: 'genomics-scientist', name: 'Genomics Scientist', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 15, growthScope: 'high', description: 'Research genomics', milestones: ['PhD', 'Sequencing', 'Analysis'], avgSalary: '$120k+' },
  ],
  'environmental': [
    { id: 'environmental-scientist', name: 'Environmental Scientist', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 10, growthScope: 'high', description: 'Study environmental issues', milestones: ['Research', 'Fieldwork', 'Policy'], avgSalary: '$80k+' },
    { id: 'climate-analyst', name: 'Climate Analyst', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Analyze climate data', milestones: ['Climate Models', 'Data Analysis', 'Policy'], avgSalary: '$100k+' },
  ],
  'space-science': [
    { id: 'astrophysicist', name: 'Astrophysicist', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 25, growthScope: 'medium', description: 'Research space phenomena', milestones: ['PhD', 'Research', 'Publications'], avgSalary: '$100k+' },
    { id: 'space-systems-engineer', name: 'Space Systems Engineer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 15, growthScope: 'high', description: 'Design space systems', milestones: ['Aerospace', 'Systems', 'Testing'], avgSalary: '$130k+' },
  ],
  'scientific-data': [
    { id: 'scientific-data-analyst', name: 'Scientific Data Analyst', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Analyze scientific datasets', milestones: ['Programming', 'Statistics', 'Visualization'], avgSalary: '$90k+' },
    { id: 'research-data-scientist', name: 'Research Data Scientist', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Lead data science in research', milestones: ['ML', 'Domain Expertise', 'Publication'], avgSalary: '$130k+' },
  ],

  // Arts, Humanities & Degree
  'psychology': [
    { id: 'research-psychologist', name: 'Research Psychologist', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 15, growthScope: 'medium', description: 'Conduct psychological research', milestones: ['PhD', 'Publications', 'Grants'], avgSalary: '$90k+' },
    { id: 'organizational-psychologist', name: 'Organizational Psychologist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'high', description: 'Apply psychology to organizations', milestones: ['Masters/PhD', 'Consulting', 'Specialization'], avgSalary: '$110k+' },
  ],
  'intl-relations': [
    { id: 'diplomat', name: 'Diplomat', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 20, growthScope: 'medium', description: 'Represent country abroad', milestones: ['Foreign Service', 'Languages', 'Postings'], avgSalary: '$100k+' },
    { id: 'policy-analyst', name: 'Policy Analyst', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 12, growthScope: 'medium', description: 'Analyze international policies', milestones: ['Research', 'Writing', 'Analysis'], avgSalary: '$75k+' },
  ],
  'public-policy': [
    { id: 'policy-researcher', name: 'Policy Researcher', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 10, growthScope: 'medium', description: 'Research public policy issues', milestones: ['Research Methods', 'Analysis', 'Writing'], avgSalary: '$70k+' },
    { id: 'policy-director', name: 'Policy Director', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 12, growthScope: 'medium', description: 'Lead policy initiatives', milestones: ['Leadership', 'Strategy', 'Advocacy'], avgSalary: '$130k+' },
  ],
  'digital-humanities': [
    { id: 'dh-specialist', name: 'Digital Humanities Specialist', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 20, growthScope: 'medium', description: 'Apply digital tools to humanities', milestones: ['Programming', 'Research', 'Visualization'], avgSalary: '$70k+' },
    { id: 'dh-professor', name: 'DH Professor', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 25, growthScope: 'low', description: 'Teach and research DH', milestones: ['PhD', 'Publications', 'Tenure'], avgSalary: '$90k+' },
  ],
  'communication': [
    { id: 'communications-manager', name: 'Communications Manager', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 10, growthScope: 'medium', description: 'Manage organizational communications', milestones: ['Strategy', 'Content', 'Media Relations'], avgSalary: '$85k+' },
    { id: 'pr-director', name: 'PR Director', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 12, growthScope: 'medium', description: 'Lead public relations', milestones: ['Leadership', 'Crisis Mgmt', 'Media'], avgSalary: '$120k+' },
  ],
  'philosophy-ethics': [
    { id: 'ethics-consultant', name: 'Ethics Consultant', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 20, growthScope: 'medium', description: 'Advise on ethical issues', milestones: ['Philosophy', 'Industry Knowledge', 'Consulting'], avgSalary: '$100k+' },
    { id: 'academic-philosopher', name: 'Academic Philosopher', difficulty: 'advanced', timeToStability: '7-10 years', riskScore: 30, growthScope: 'low', description: 'Research and teach philosophy', milestones: ['PhD', 'Publications', 'Tenure'], avgSalary: '$80k+' },
  ],

  // Commerce, Business & Management
  'financial-analysis': [
    { id: 'financial-analyst', name: 'Financial Analyst', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Analyze financial data', milestones: ['Modeling', 'Valuation', 'CFA'], avgSalary: '$90k+' },
    { id: 'investment-banker', name: 'Investment Banker', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Execute M&A and capital raises', milestones: ['Deal Execution', 'Client Relations', 'Sector Expertise'], avgSalary: '$200k+' },
    { id: 'portfolio-manager', name: 'Portfolio Manager', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 20, growthScope: 'high', description: 'Manage investment portfolios', milestones: ['CFA', 'Track Record', 'Risk Management'], avgSalary: '$250k+' },
  ],
  'fintech': [
    { id: 'fintech-pm', name: 'FinTech Product Manager', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Build financial technology products', milestones: ['Product', 'Finance', 'Tech'], avgSalary: '$140k+' },
    { id: 'fintech-engineer', name: 'FinTech Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Build financial software', milestones: ['Engineering', 'Finance', 'APIs'], avgSalary: '$150k+' },
  ],
  'business-analytics': [
    { id: 'business-analyst', name: 'Business Analyst', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Analyze business processes', milestones: ['SQL', 'Visualization', 'Domain'], avgSalary: '$85k+' },
    { id: 'analytics-director', name: 'Analytics Director', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 10, growthScope: 'high', description: 'Lead analytics teams', milestones: ['Leadership', 'Strategy', 'Advanced Analytics'], avgSalary: '$160k+' },
  ],
  'entrepreneurship': [
    { id: 'founder', name: 'Startup Founder', difficulty: 'advanced', timeToStability: '5+ years', riskScore: 70, growthScope: 'high', description: 'Build and scale a startup', milestones: ['Idea Validation', 'MVP', 'Fundraising'], avgSalary: 'Variable' },
    { id: 'venture-builder', name: 'Venture Builder', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 40, growthScope: 'high', description: 'Build multiple ventures', milestones: ['Playbook', 'Team', 'Portfolio'], avgSalary: 'Variable' },
  ],
  'marketing-analytics': [
    { id: 'growth-marketer', name: 'Growth Marketer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 15, growthScope: 'high', description: 'Drive user acquisition and growth', milestones: ['Analytics', 'Experimentation', 'Channels'], avgSalary: '$100k+' },
    { id: 'cmo', name: 'Chief Marketing Officer', difficulty: 'advanced', timeToStability: '8-10 years', riskScore: 15, growthScope: 'high', description: 'Lead marketing strategy', milestones: ['Leadership', 'Brand', 'Revenue'], avgSalary: '$200k+' },
  ],
  'supply-chain': [
    { id: 'supply-chain-analyst', name: 'Supply Chain Analyst', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'medium', description: 'Optimize supply chain operations', milestones: ['Analytics', 'Logistics', 'Systems'], avgSalary: '$75k+' },
    { id: 'supply-chain-director', name: 'Supply Chain Director', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 10, growthScope: 'medium', description: 'Lead supply chain strategy', milestones: ['Leadership', 'Strategy', 'Global Ops'], avgSalary: '$150k+' },
  ],

  // Law & Public Services
  'corporate-law': [
    { id: 'corporate-lawyer', name: 'Corporate Lawyer', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 12, growthScope: 'high', description: 'Handle business legal matters', milestones: ['Law Degree', 'Bar Exam', 'Practice'], avgSalary: '$150k+' },
    { id: 'general-counsel', name: 'General Counsel', difficulty: 'advanced', timeToStability: '10-12 years', riskScore: 10, growthScope: 'high', description: 'Lead corporate legal', milestones: ['Experience', 'Leadership', 'Strategy'], avgSalary: '$300k+' },
  ],
  'cyber-law': [
    { id: 'data-privacy-lawyer', name: 'Data Privacy Lawyer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'high', description: 'Specialize in privacy law', milestones: ['Law Degree', 'GDPR/Privacy', 'Tech'], avgSalary: '$160k+' },
    { id: 'cybercrime-prosecutor', name: 'Cybercrime Prosecutor', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 12, growthScope: 'medium', description: 'Prosecute cyber crimes', milestones: ['Law Degree', 'Criminal Law', 'Tech'], avgSalary: '$100k+' },
  ],
  'constitutional': [
    { id: 'constitutional-lawyer', name: 'Constitutional Lawyer', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 15, growthScope: 'medium', description: 'Practice constitutional law', milestones: ['Law Degree', 'Litigation', 'Advocacy'], avgSalary: '$120k+' },
    { id: 'judicial-clerk', name: 'Judicial Clerk', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'medium', description: 'Support judicial proceedings', milestones: ['Law Degree', 'Research', 'Writing'], avgSalary: '$70k+' },
  ],
  'judiciary': [
    { id: 'judicial-officer', name: 'Judicial Officer', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 15, growthScope: 'medium', description: 'Serve in judiciary', milestones: ['Law Degree', 'Exam', 'Training'], avgSalary: 'Govt Scale' },
    { id: 'judge', name: 'Judge', difficulty: 'advanced', timeToStability: '10-15 years', riskScore: 10, growthScope: 'medium', description: 'Preside over court', milestones: ['Experience', 'Appointment', 'Tenure'], avgSalary: 'Govt Scale' },
  ],
  'public-policy-law': [
    { id: 'legislative-counsel', name: 'Legislative Counsel', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'medium', description: 'Draft legislation', milestones: ['Law Degree', 'Policy', 'Drafting'], avgSalary: '$90k+' },
    { id: 'policy-lawyer', name: 'Policy Lawyer', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 12, growthScope: 'medium', description: 'Work at law-policy intersection', milestones: ['Law', 'Policy', 'Advocacy'], avgSalary: '$100k+' },
  ],
  'international-law': [
    { id: 'intl-lawyer', name: 'International Lawyer', difficulty: 'advanced', timeToStability: '4-6 years', riskScore: 18, growthScope: 'medium', description: 'Practice international law', milestones: ['Law Degree', 'LLM', 'Languages'], avgSalary: '$140k+' },
    { id: 'trade-lawyer', name: 'Trade Lawyer', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 12, growthScope: 'high', description: 'Handle international trade', milestones: ['Law Degree', 'Trade Law', 'Negotiations'], avgSalary: '$160k+' },
  ],

  // Education & Teaching
  'edtech': [
    { id: 'instructional-designer', name: 'Instructional Designer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Design learning experiences', milestones: ['ID Principles', 'Tools', 'Assessment'], avgSalary: '$80k+' },
    { id: 'edtech-pm', name: 'EdTech Product Manager', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 15, growthScope: 'high', description: 'Build educational products', milestones: ['Product', 'Education', 'Tech'], avgSalary: '$130k+' },
  ],
  'curriculum': [
    { id: 'curriculum-developer', name: 'Curriculum Developer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 8, growthScope: 'medium', description: 'Design curriculum', milestones: ['Pedagogy', 'Standards', 'Assessment'], avgSalary: '$70k+' },
    { id: 'curriculum-director', name: 'Curriculum Director', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 10, growthScope: 'medium', description: 'Lead curriculum strategy', milestones: ['Leadership', 'Policy', 'Innovation'], avgSalary: '$110k+' },
  ],
  'edu-psychology': [
    { id: 'school-psychologist', name: 'School Psychologist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'medium', description: 'Support student wellbeing', milestones: ['Masters/PhD', 'Certification', 'Practice'], avgSalary: '$80k+' },
    { id: 'learning-specialist', name: 'Learning Specialist', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'medium', description: 'Support diverse learners', milestones: ['Special Ed', 'Assessment', 'Intervention'], avgSalary: '$65k+' },
  ],
  'online-teaching': [
    { id: 'online-instructor', name: 'Online Instructor', difficulty: 'beginner', timeToStability: '1 year', riskScore: 10, growthScope: 'medium', description: 'Teach online courses', milestones: ['Content', 'Platform', 'Engagement'], avgSalary: '$60k+' },
    { id: 'online-course-creator', name: 'Course Creator', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 25, growthScope: 'high', description: 'Create and sell courses', milestones: ['Content', 'Platform', 'Marketing'], avgSalary: 'Variable' },
  ],
  'academic-research': [
    { id: 'postdoc', name: 'Postdoctoral Researcher', difficulty: 'advanced', timeToStability: '2-4 years', riskScore: 25, growthScope: 'medium', description: 'Conduct academic research', milestones: ['PhD', 'Publications', 'Grants'], avgSalary: '$60k+' },
    { id: 'professor', name: 'Professor', difficulty: 'advanced', timeToStability: '8-12 years', riskScore: 20, growthScope: 'medium', description: 'Research and teach', milestones: ['PhD', 'Tenure Track', 'Publications'], avgSalary: '$120k+' },
  ],

  // Design, Media & Creative Arts
  'ui-ux': [
    { id: 'ux-designer', name: 'UX Designer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Design user experiences', milestones: ['Research', 'Prototyping', 'Testing'], avgSalary: '$100k+' },
    { id: 'design-lead', name: 'Design Lead', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 12, growthScope: 'high', description: 'Lead design teams', milestones: ['Leadership', 'Strategy', 'Systems'], avgSalary: '$160k+' },
    { id: 'head-of-design', name: 'Head of Design', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 15, growthScope: 'high', description: 'Lead design org', milestones: ['Leadership', 'Vision', 'Culture'], avgSalary: '$200k+' },
  ],
  'motion': [
    { id: 'motion-designer', name: 'Motion Designer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 15, growthScope: 'high', description: 'Create motion graphics', milestones: ['After Effects', 'Animation', 'Storytelling'], avgSalary: '$80k+' },
    { id: 'creative-director', name: 'Creative Director', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 15, growthScope: 'high', description: 'Lead creative vision', milestones: ['Leadership', 'Vision', 'Portfolio'], avgSalary: '$140k+' },
  ],
  'game-design': [
    { id: 'game-designer', name: 'Game Designer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 25, growthScope: 'high', description: 'Design game mechanics', milestones: ['Game Theory', 'Prototyping', 'Tools'], avgSalary: '$90k+' },
    { id: 'lead-game-designer', name: 'Lead Game Designer', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 20, growthScope: 'high', description: 'Lead game design', milestones: ['Shipped Games', 'Leadership', 'Vision'], avgSalary: '$130k+' },
  ],
  'film': [
    { id: 'film-director', name: 'Film Director', difficulty: 'advanced', timeToStability: '5-10 years', riskScore: 60, growthScope: 'medium', description: 'Direct films', milestones: ['Short Films', 'Features', 'Recognition'], avgSalary: 'Variable' },
    { id: 'video-producer', name: 'Video Producer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 20, growthScope: 'medium', description: 'Produce video content', milestones: ['Production', 'Editing', 'Distribution'], avgSalary: '$80k+' },
  ],
  'content-creation': [
    { id: 'content-creator', name: 'Content Creator', difficulty: 'beginner', timeToStability: '2-3 years', riskScore: 40, growthScope: 'high', description: 'Create digital content', milestones: ['Audience', 'Monetization', 'Brand'], avgSalary: 'Variable' },
    { id: 'content-strategist', name: 'Content Strategist', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Plan content strategy', milestones: ['Strategy', 'Analytics', 'Brand'], avgSalary: '$90k+' },
  ],
  'branding': [
    { id: 'brand-designer', name: 'Brand Designer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 15, growthScope: 'medium', description: 'Create brand identities', milestones: ['Design', 'Strategy', 'Portfolio'], avgSalary: '$85k+' },
    { id: 'brand-director', name: 'Brand Director', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 12, growthScope: 'high', description: 'Lead brand strategy', milestones: ['Leadership', 'Strategy', 'Results'], avgSalary: '$150k+' },
  ],

  // Defense, Security & Physical Services
  'armed-forces': [
    { id: 'military-officer', name: 'Military Officer', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 25, growthScope: 'high', description: 'Serve as commissioned officer', milestones: ['Training', 'Commission', 'Leadership'], avgSalary: 'Govt Scale' },
    { id: 'defense-consultant', name: 'Defense Consultant', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 15, growthScope: 'medium', description: 'Advise on defense matters', milestones: ['Military Experience', 'Expertise', 'Network'], avgSalary: '$150k+' },
  ],
  'paramilitary': [
    { id: 'paramilitary-officer', name: 'Paramilitary Officer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 30, growthScope: 'medium', description: 'Serve in paramilitary forces', milestones: ['Selection', 'Training', 'Posting'], avgSalary: 'Govt Scale' },
  ],
  'intelligence': [
    { id: 'intelligence-analyst', name: 'Intelligence Analyst', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 20, growthScope: 'high', description: 'Analyze intelligence data', milestones: ['Analysis', 'Clearance', 'Specialization'], avgSalary: '$100k+' },
    { id: 'intelligence-officer', name: 'Intelligence Officer', difficulty: 'advanced', timeToStability: '4-6 years', riskScore: 30, growthScope: 'medium', description: 'Conduct intelligence operations', milestones: ['Selection', 'Training', 'Operations'], avgSalary: 'Classified' },
  ],
  'digital-forensics': [
    { id: 'forensic-analyst', name: 'Digital Forensic Analyst', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Investigate digital evidence', milestones: ['Forensics Tools', 'Certification', 'Cases'], avgSalary: '$90k+' },
    { id: 'cybercrime-investigator', name: 'Cybercrime Investigator', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 15, growthScope: 'high', description: 'Investigate cyber crimes', milestones: ['Law Enforcement', 'Tech', 'Investigation'], avgSalary: '$100k+' },
  ],
  'disaster-mgmt': [
    { id: 'emergency-manager', name: 'Emergency Manager', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 10, growthScope: 'medium', description: 'Manage emergency response', milestones: ['Planning', 'Coordination', 'Response'], avgSalary: '$75k+' },
    { id: 'disaster-response-lead', name: 'Disaster Response Lead', difficulty: 'advanced', timeToStability: '4-6 years', riskScore: 15, growthScope: 'medium', description: 'Lead disaster response', milestones: ['Field Experience', 'Leadership', 'Policy'], avgSalary: '$100k+' },
  ],
  'fire-safety': [
    { id: 'fire-safety-officer', name: 'Fire Safety Officer', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 10, growthScope: 'medium', description: 'Ensure fire safety compliance', milestones: ['Certification', 'Inspections', 'Training'], avgSalary: '$60k+' },
    { id: 'safety-director', name: 'Safety Director', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 8, growthScope: 'medium', description: 'Lead safety programs', milestones: ['Leadership', 'Compliance', 'Culture'], avgSalary: '$120k+' },
  ],

  // Agriculture & Environmental Studies
  'agritech': [
    { id: 'agritech-specialist', name: 'AgriTech Specialist', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Apply tech to agriculture', milestones: ['Tech', 'Agriculture', 'Implementation'], avgSalary: '$80k+' },
    { id: 'precision-ag-manager', name: 'Precision Ag Manager', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Manage precision farming', milestones: ['Data', 'Equipment', 'Results'], avgSalary: '$100k+' },
  ],
  'organic-farming': [
    { id: 'organic-farmer', name: 'Organic Farmer', difficulty: 'intermediate', timeToStability: '3-5 years', riskScore: 35, growthScope: 'medium', description: 'Run organic farm', milestones: ['Certification', 'Land', 'Markets'], avgSalary: 'Variable' },
    { id: 'organic-consultant', name: 'Organic Consultant', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 15, growthScope: 'medium', description: 'Advise on organic practices', milestones: ['Expertise', 'Certification', 'Clients'], avgSalary: '$70k+' },
  ],
  'food-tech': [
    { id: 'food-technologist', name: 'Food Technologist', difficulty: 'intermediate', timeToStability: '2 years', riskScore: 8, growthScope: 'medium', description: 'Develop food products', milestones: ['Food Science', 'R&D', 'Quality'], avgSalary: '$75k+' },
    { id: 'food-rd-manager', name: 'Food R&D Manager', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 10, growthScope: 'medium', description: 'Lead food innovation', milestones: ['Leadership', 'Innovation', 'Commercialization'], avgSalary: '$120k+' },
  ],
  'climate-agriculture': [
    { id: 'climate-ag-specialist', name: 'Climate-Smart Ag Specialist', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Implement climate-smart practices', milestones: ['Climate Science', 'Agriculture', 'Policy'], avgSalary: '$80k+' },
    { id: 'sustainability-manager', name: 'Sustainability Manager', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'high', description: 'Lead sustainability initiatives', milestones: ['Strategy', 'Implementation', 'Reporting'], avgSalary: '$100k+' },
  ],
  'fisheries': [
    { id: 'aquaculture-manager', name: 'Aquaculture Manager', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 20, growthScope: 'medium', description: 'Manage fish farms', milestones: ['Operations', 'Biology', 'Business'], avgSalary: '$65k+' },
    { id: 'fisheries-scientist', name: 'Fisheries Scientist', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 15, growthScope: 'medium', description: 'Research fisheries', milestones: ['PhD', 'Research', 'Policy'], avgSalary: '$85k+' },
  ],
  'veterinary': [
    { id: 'veterinarian', name: 'Veterinarian', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 10, growthScope: 'medium', description: 'Treat animals', milestones: ['DVM', 'Licensure', 'Practice'], avgSalary: '$100k+' },
    { id: 'vet-specialist', name: 'Veterinary Specialist', difficulty: 'advanced', timeToStability: '7-9 years', riskScore: 12, growthScope: 'medium', description: 'Specialize in vet medicine', milestones: ['Residency', 'Board Certification', 'Practice'], avgSalary: '$150k+' },
  ],

  // Hospitality, Travel & Tourism
  'aviation': [
    { id: 'cabin-crew', name: 'Cabin Crew', difficulty: 'beginner', timeToStability: '1 year', riskScore: 20, growthScope: 'medium', description: 'Serve passengers on flights', milestones: ['Training', 'Certification', 'Experience'], avgSalary: '$50k+' },
    { id: 'airline-manager', name: 'Airline Operations Manager', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 15, growthScope: 'medium', description: 'Manage airline operations', milestones: ['Operations', 'Leadership', 'Safety'], avgSalary: '$100k+' },
  ],
  'hotel-mgmt': [
    { id: 'hotel-manager', name: 'Hotel Manager', difficulty: 'intermediate', timeToStability: '3-4 years', riskScore: 12, growthScope: 'medium', description: 'Manage hotel operations', milestones: ['Operations', 'Guest Service', 'P&L'], avgSalary: '$70k+' },
    { id: 'resort-gm', name: 'Resort General Manager', difficulty: 'advanced', timeToStability: '8-10 years', riskScore: 10, growthScope: 'medium', description: 'Lead resort property', milestones: ['Leadership', 'Revenue', 'Brand'], avgSalary: '$150k+' },
  ],
  'travel-ops': [
    { id: 'travel-consultant', name: 'Travel Consultant', difficulty: 'beginner', timeToStability: '1 year', riskScore: 15, growthScope: 'medium', description: 'Plan travel experiences', milestones: ['Destinations', 'Systems', 'Sales'], avgSalary: '$45k+' },
    { id: 'travel-director', name: 'Travel Operations Director', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 12, growthScope: 'medium', description: 'Lead travel operations', milestones: ['Operations', 'Partnerships', 'Strategy'], avgSalary: '$100k+' },
  ],
  'event-mgmt': [
    { id: 'event-planner', name: 'Event Planner', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 20, growthScope: 'high', description: 'Plan and execute events', milestones: ['Planning', 'Vendors', 'Execution'], avgSalary: '$60k+' },
    { id: 'event-director', name: 'Event Director', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 15, growthScope: 'high', description: 'Lead event operations', milestones: ['Leadership', 'Large Events', 'Clients'], avgSalary: '$120k+' },
  ],
  'cruise': [
    { id: 'cruise-staff', name: 'Cruise Ship Staff', difficulty: 'beginner', timeToStability: '1 year', riskScore: 15, growthScope: 'medium', description: 'Work on cruise ships', milestones: ['Training', 'Certification', 'Experience'], avgSalary: '$40k+' },
    { id: 'cruise-director', name: 'Cruise Director', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 12, growthScope: 'medium', description: 'Lead cruise entertainment', milestones: ['Experience', 'Leadership', 'Entertainment'], avgSalary: '$80k+' },
  ],

  // Sports, Fitness & Lifestyle
  'sports-science': [
    { id: 'sports-scientist', name: 'Sports Scientist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Optimize athletic performance', milestones: ['Degree', 'Research', 'Applied Work'], avgSalary: '$80k+' },
    { id: 'performance-director', name: 'Performance Director', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 15, growthScope: 'high', description: 'Lead performance programs', milestones: ['Leadership', 'Results', 'Team Building'], avgSalary: '$150k+' },
  ],
  'strength-conditioning': [
    { id: 'strength-coach', name: 'Strength & Conditioning Coach', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Train athletes', milestones: ['Certification', 'Experience', 'Results'], avgSalary: '$65k+' },
    { id: 'head-strength-coach', name: 'Head Strength Coach', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 15, growthScope: 'high', description: 'Lead S&C programs', milestones: ['Leadership', 'Pro Athletes', 'Innovation'], avgSalary: '$120k+' },
  ],
  'coaching': [
    { id: 'sport-coach', name: 'Sports Coach', difficulty: 'intermediate', timeToStability: '3-5 years', riskScore: 25, growthScope: 'medium', description: 'Coach athletes/teams', milestones: ['Certification', 'Experience', 'Results'], avgSalary: '$60k+' },
    { id: 'head-coach', name: 'Head Coach', difficulty: 'advanced', timeToStability: '8-12 years', riskScore: 30, growthScope: 'medium', description: 'Lead sports programs', milestones: ['Championships', 'Recruitment', 'Legacy'], avgSalary: 'Variable' },
  ],
  'yoga-naturopathy': [
    { id: 'yoga-instructor', name: 'Yoga Instructor', difficulty: 'beginner', timeToStability: '1-2 years', riskScore: 20, growthScope: 'medium', description: 'Teach yoga', milestones: ['Certification', 'Teaching', 'Specialization'], avgSalary: '$50k+' },
    { id: 'wellness-director', name: 'Wellness Director', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 15, growthScope: 'medium', description: 'Lead wellness programs', milestones: ['Leadership', 'Programs', 'Business'], avgSalary: '$90k+' },
  ],
  'fitness-business': [
    { id: 'gym-owner', name: 'Gym Owner', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 50, growthScope: 'high', description: 'Own and operate gym', milestones: ['Business', 'Location', 'Membership'], avgSalary: 'Variable' },
    { id: 'fitness-entrepreneur', name: 'Fitness Entrepreneur', difficulty: 'advanced', timeToStability: '3-5 years', riskScore: 55, growthScope: 'high', description: 'Build fitness business', milestones: ['Product', 'Brand', 'Scale'], avgSalary: 'Variable' },
  ],

  // Skill-Based & Vocational Fields
  'industrial-trades': [
    { id: 'skilled-tradesperson', name: 'Skilled Tradesperson', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 8, growthScope: 'medium', description: 'Master industrial trade', milestones: ['Apprenticeship', 'Certification', 'Experience'], avgSalary: '$60k+' },
    { id: 'master-craftsman', name: 'Master Craftsman', difficulty: 'advanced', timeToStability: '7-10 years', riskScore: 8, growthScope: 'medium', description: 'Expert in trade', milestones: ['Mastery', 'Teaching', 'Business'], avgSalary: '$90k+' },
  ],
  'iti-polytechnic': [
    { id: 'technician', name: 'Technician', difficulty: 'beginner', timeToStability: '1-2 years', riskScore: 8, growthScope: 'medium', description: 'Work as certified technician', milestones: ['Certification', 'Practical Skills', 'Experience'], avgSalary: '$40k+' },
    { id: 'technical-supervisor', name: 'Technical Supervisor', difficulty: 'intermediate', timeToStability: '4-5 years', riskScore: 8, growthScope: 'medium', description: 'Lead technical teams', milestones: ['Leadership', 'Expertise', 'Safety'], avgSalary: '$60k+' },
  ],
  'ev-tech': [
    { id: 'ev-technician', name: 'EV Technician', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Service electric vehicles', milestones: ['EV Certification', 'Diagnostics', 'Battery'], avgSalary: '$60k+' },
    { id: 'ev-engineer', name: 'EV Systems Engineer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Design EV systems', milestones: ['Engineering', 'Battery Tech', 'Integration'], avgSalary: '$110k+' },
  ],
  'renewable-energy': [
    { id: 'solar-technician', name: 'Solar Technician', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Install solar systems', milestones: ['Certification', 'Installation', 'Maintenance'], avgSalary: '$55k+' },
    { id: 'renewable-engineer', name: 'Renewable Energy Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Design renewable systems', milestones: ['Engineering', 'Projects', 'Grid'], avgSalary: '$90k+' },
  ],
  'skill-india': [
    { id: 'certified-professional', name: 'Certified Professional', difficulty: 'beginner', timeToStability: '1-2 years', riskScore: 10, growthScope: 'medium', description: 'Govt certified skills', milestones: ['Training', 'Certification', 'Placement'], avgSalary: '$30k+' },
    { id: 'skill-trainer', name: 'Skill Development Trainer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 10, growthScope: 'medium', description: 'Train others in skills', milestones: ['Expertise', 'Teaching', 'Curriculum'], avgSalary: '$45k+' },
  ],

  // ============================================
  // NEW FIELD CAREER PATHS
  // ============================================

  // Cloud Computing
  'cloud-architecture': [
    { id: 'cloud-architect', name: 'Cloud Solutions Architect', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Design enterprise cloud solutions', milestones: ['AWS/Azure/GCP Certs', 'Architecture', 'Well-Architected'], avgSalary: '$170k+' },
    { id: 'principal-architect', name: 'Principal Cloud Architect', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 8, growthScope: 'high', description: 'Lead cloud architecture strategy', milestones: ['Enterprise Scale', 'Multi-Cloud', 'Leadership'], avgSalary: '$220k+' },
    { id: 'cloud-consultant', name: 'Cloud Consultant', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Advise on cloud strategy', milestones: ['Consulting', 'Certifications', 'Client Mgmt'], avgSalary: '$150k+' },
  ],
  'cloud-security': [
    { id: 'cloud-security-engineer', name: 'Cloud Security Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Secure cloud infrastructure', milestones: ['Security Certs', 'IAM', 'Compliance'], avgSalary: '$140k+' },
    { id: 'cloud-security-architect', name: 'Cloud Security Architect', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Design cloud security strategy', milestones: ['Zero Trust', 'Architecture', 'Governance'], avgSalary: '$180k+' },
  ],
  'cloud-native': [
    { id: 'cloud-native-dev', name: 'Cloud-Native Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Build cloud-native applications', milestones: ['Kubernetes', 'Microservices', '12-Factor'], avgSalary: '$140k+' },
    { id: 'cloud-native-architect', name: 'Cloud-Native Architect', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Design cloud-native systems', milestones: ['Service Mesh', 'Patterns', 'Scale'], avgSalary: '$175k+' },
  ],
  'multi-cloud': [
    { id: 'multi-cloud-engineer', name: 'Multi-Cloud Engineer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Manage multi-cloud environments', milestones: ['AWS + Azure', 'Terraform', 'Governance'], avgSalary: '$145k+' },
    { id: 'hybrid-cloud-architect', name: 'Hybrid Cloud Architect', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'high', description: 'Design hybrid cloud solutions', milestones: ['On-Prem + Cloud', 'Integration', 'Migration'], avgSalary: '$170k+' },
  ],
  'serverless': [
    { id: 'serverless-developer', name: 'Serverless Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Build serverless applications', milestones: ['Lambda', 'Event-Driven', 'APIs'], avgSalary: '$130k+' },
    { id: 'serverless-architect', name: 'Serverless Architect', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Design serverless systems', milestones: ['Patterns', 'Cost Optimization', 'Scale'], avgSalary: '$165k+' },
  ],
  'cloud-finops': [
    { id: 'finops-analyst', name: 'FinOps Analyst', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Optimize cloud costs', milestones: ['Cost Tools', 'Analysis', 'Reporting'], avgSalary: '$100k+' },
    { id: 'finops-lead', name: 'FinOps Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Lead FinOps practice', milestones: ['Strategy', 'Governance', 'Culture'], avgSalary: '$150k+' },
  ],

  // DevOps & SRE
  'ci-cd': [
    { id: 'ci-cd-engineer', name: 'CI/CD Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Build and maintain pipelines', milestones: ['Jenkins/GitHub Actions', 'Automation', 'Testing'], avgSalary: '$130k+' },
    { id: 'release-engineer', name: 'Release Engineer', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 8, growthScope: 'high', description: 'Manage release processes', milestones: ['Release Mgmt', 'Coordination', 'Quality'], avgSalary: '$140k+' },
  ],
  'infrastructure-code': [
    { id: 'iac-engineer', name: 'Infrastructure as Code Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Automate infrastructure', milestones: ['Terraform', 'Ansible', 'CloudFormation'], avgSalary: '$140k+' },
    { id: 'platform-engineer-iac', name: 'Platform Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 8, growthScope: 'high', description: 'Build infrastructure platforms', milestones: ['Platform Design', 'Self-Service', 'Standards'], avgSalary: '$160k+' },
  ],
  'container-orchestration': [
    { id: 'kubernetes-engineer', name: 'Kubernetes Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Manage Kubernetes clusters', milestones: ['CKA/CKAD', 'Operations', 'Security'], avgSalary: '$150k+' },
    { id: 'kubernetes-architect', name: 'Kubernetes Architect', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Design Kubernetes platforms', milestones: ['Multi-Cluster', 'Service Mesh', 'GitOps'], avgSalary: '$180k+' },
  ],
  'observability': [
    { id: 'observability-engineer', name: 'Observability Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Implement monitoring systems', milestones: ['Prometheus', 'Grafana', 'Tracing'], avgSalary: '$135k+' },
    { id: 'observability-lead', name: 'Observability Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Lead observability strategy', milestones: ['Strategy', 'Tooling', 'Culture'], avgSalary: '$165k+' },
  ],
  'sre-practices': [
    { id: 'sre', name: 'Site Reliability Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Ensure system reliability', milestones: ['SLOs', 'Incident Response', 'Automation'], avgSalary: '$155k+' },
    { id: 'staff-sre', name: 'Staff SRE', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 8, growthScope: 'high', description: 'Lead SRE practices org-wide', milestones: ['Leadership', 'Strategy', 'Scale'], avgSalary: '$200k+' },
  ],
  'platform-engineering': [
    { id: 'platform-eng', name: 'Platform Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Build developer platforms', milestones: ['Developer Experience', 'Tooling', 'Self-Service'], avgSalary: '$150k+' },
    { id: 'platform-lead', name: 'Platform Engineering Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Lead platform teams', milestones: ['Team Leadership', 'Strategy', 'Adoption'], avgSalary: '$180k+' },
  ],

  // Blockchain & Web3
  'smart-contracts': [
    { id: 'smart-contract-dev', name: 'Smart Contract Developer', difficulty: 'advanced', timeToStability: '1-2 years', riskScore: 25, growthScope: 'high', description: 'Develop smart contracts', milestones: ['Solidity', 'Testing', 'Auditing'], avgSalary: '$140k+' },
    { id: 'smart-contract-auditor', name: 'Smart Contract Auditor', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 20, growthScope: 'high', description: 'Audit smart contract security', milestones: ['Security', 'Vulnerabilities', 'Reports'], avgSalary: '$180k+' },
  ],
  'defi': [
    { id: 'defi-developer', name: 'DeFi Developer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 35, growthScope: 'high', description: 'Build DeFi protocols', milestones: ['Protocols', 'Tokenomics', 'Security'], avgSalary: '$160k+' },
    { id: 'defi-strategist', name: 'DeFi Strategist', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 40, growthScope: 'medium', description: 'Develop DeFi strategies', milestones: ['Yield', 'Risk', 'Analytics'], avgSalary: '$150k+' },
  ],
  'nft-digital-assets': [
    { id: 'nft-developer', name: 'NFT Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 35, growthScope: 'medium', description: 'Build NFT platforms', milestones: ['ERC-721', 'Marketplaces', 'IPFS'], avgSalary: '$120k+' },
    { id: 'digital-asset-manager', name: 'Digital Asset Manager', difficulty: 'intermediate', timeToStability: '2-3 years', riskScore: 30, growthScope: 'medium', description: 'Manage digital asset portfolios', milestones: ['Custody', 'Valuation', 'Strategy'], avgSalary: '$130k+' },
  ],
  'blockchain-infrastructure': [
    { id: 'blockchain-engineer', name: 'Blockchain Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 20, growthScope: 'high', description: 'Build blockchain infrastructure', milestones: ['Node Operations', 'Consensus', 'Networking'], avgSalary: '$150k+' },
    { id: 'protocol-engineer', name: 'Protocol Engineer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 25, growthScope: 'high', description: 'Develop blockchain protocols', milestones: ['Protocol Design', 'Cryptography', 'Research'], avgSalary: '$180k+' },
  ],
  'web3-frontend': [
    { id: 'web3-frontend-dev', name: 'Web3 Frontend Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 20, growthScope: 'high', description: 'Build dApp frontends', milestones: ['ethers.js', 'wagmi', 'Wallets'], avgSalary: '$130k+' },
    { id: 'dapp-developer', name: 'Full Stack dApp Developer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 25, growthScope: 'high', description: 'Build complete dApps', milestones: ['Smart Contracts', 'Frontend', 'Integration'], avgSalary: '$160k+' },
  ],
  'dao-governance': [
    { id: 'dao-contributor', name: 'DAO Contributor', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 40, growthScope: 'medium', description: 'Contribute to DAOs', milestones: ['Governance', 'Proposals', 'Community'], avgSalary: 'Variable' },
    { id: 'dao-architect', name: 'DAO Architect', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 35, growthScope: 'medium', description: 'Design DAO structures', milestones: ['Tokenomics', 'Governance', 'Treasury'], avgSalary: '$140k+' },
  ],

  // AR / VR / Mixed Reality
  'vr-development': [
    { id: 'vr-developer', name: 'VR Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 20, growthScope: 'high', description: 'Build VR applications', milestones: ['Unity/Unreal', 'VR SDKs', 'Optimization'], avgSalary: '$120k+' },
    { id: 'senior-vr-dev', name: 'Senior VR Developer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 18, growthScope: 'high', description: 'Lead VR development', milestones: ['Architecture', 'Performance', 'Team Leadership'], avgSalary: '$160k+' },
  ],
  'ar-development': [
    { id: 'ar-developer', name: 'AR Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 18, growthScope: 'high', description: 'Build AR applications', milestones: ['ARKit/ARCore', 'WebXR', 'CV Integration'], avgSalary: '$125k+' },
    { id: 'ar-lead', name: 'AR Development Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 15, growthScope: 'high', description: 'Lead AR projects', milestones: ['Team Leadership', 'Innovation', 'Platforms'], avgSalary: '$165k+' },
  ],
  '3d-modeling-xr': [
    { id: '3d-artist-xr', name: '3D Artist for XR', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 18, growthScope: 'high', description: 'Create 3D assets for XR', milestones: ['Blender/Maya', 'Optimization', 'Texturing'], avgSalary: '$90k+' },
    { id: 'technical-artist', name: 'Technical Artist', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Bridge art and technology', milestones: ['Shaders', 'Pipeline', 'Performance'], avgSalary: '$130k+' },
  ],
  'spatial-computing': [
    { id: 'spatial-developer', name: 'Spatial Computing Developer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 25, growthScope: 'high', description: 'Build spatial applications', milestones: ['Vision Pro', 'HoloLens', 'Spatial UI'], avgSalary: '$150k+' },
    { id: 'mr-architect', name: 'Mixed Reality Architect', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 20, growthScope: 'high', description: 'Design MR experiences', milestones: ['Architecture', 'Innovation', 'Strategy'], avgSalary: '$180k+' },
  ],
  'xr-design': [
    { id: 'xr-designer', name: 'XR Experience Designer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 18, growthScope: 'high', description: 'Design XR experiences', milestones: ['Spatial UX', 'Prototyping', 'User Testing'], avgSalary: '$110k+' },
    { id: 'xr-design-lead', name: 'XR Design Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 15, growthScope: 'high', description: 'Lead XR design teams', milestones: ['Team Leadership', 'Strategy', 'Standards'], avgSalary: '$150k+' },
  ],
  'enterprise-xr': [
    { id: 'enterprise-xr-developer', name: 'Enterprise XR Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 15, growthScope: 'high', description: 'Build enterprise XR solutions', milestones: ['Training', 'Industrial', 'Collaboration'], avgSalary: '$130k+' },
    { id: 'xr-solutions-architect', name: 'XR Solutions Architect', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Design enterprise XR strategy', milestones: ['ROI', 'Integration', 'Scale'], avgSalary: '$170k+' },
  ],

  // Quantum Computing
  'quantum-algorithms': [
    { id: 'quantum-researcher', name: 'Quantum Algorithm Researcher', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 45, growthScope: 'high', description: 'Research quantum algorithms', milestones: ['PhD', 'Publications', 'Breakthroughs'], avgSalary: '$150k+' },
    { id: 'quantum-scientist', name: 'Quantum Scientist', difficulty: 'advanced', timeToStability: '4-6 years', riskScore: 40, growthScope: 'high', description: 'Advance quantum science', milestones: ['Research', 'Theory', 'Applications'], avgSalary: '$160k+' },
  ],
  'quantum-programming': [
    { id: 'quantum-developer', name: 'Quantum Software Developer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 35, growthScope: 'high', description: 'Develop quantum software', milestones: ['Qiskit/Cirq', 'Algorithms', 'Optimization'], avgSalary: '$140k+' },
    { id: 'quantum-engineer', name: 'Quantum Software Engineer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 30, growthScope: 'high', description: 'Engineer quantum applications', milestones: ['Production', 'Integration', 'Scale'], avgSalary: '$165k+' },
  ],
  'quantum-ml': [
    { id: 'quantum-ml-researcher', name: 'Quantum ML Researcher', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 45, growthScope: 'high', description: 'Research quantum machine learning', milestones: ['Variational', 'Kernels', 'Publications'], avgSalary: '$155k+' },
    { id: 'quantum-ml-engineer', name: 'Quantum ML Engineer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 40, growthScope: 'high', description: 'Apply quantum to ML', milestones: ['Hybrid Models', 'Applications', 'Benchmarks'], avgSalary: '$160k+' },
  ],
  'quantum-simulation': [
    { id: 'quantum-simulator', name: 'Quantum Simulation Specialist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 40, growthScope: 'high', description: 'Simulate quantum systems', milestones: ['Chemistry', 'Materials', 'VQE'], avgSalary: '$150k+' },
    { id: 'computational-physicist', name: 'Computational Physicist', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 35, growthScope: 'medium', description: 'Apply quantum to physics', milestones: ['Simulation', 'Research', 'Publications'], avgSalary: '$140k+' },
  ],
  'quantum-cryptography': [
    { id: 'quantum-crypto-researcher', name: 'Quantum Cryptography Researcher', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 35, growthScope: 'high', description: 'Research quantum cryptography', milestones: ['QKD', 'Post-Quantum', 'Security'], avgSalary: '$150k+' },
    { id: 'pqc-engineer', name: 'Post-Quantum Cryptography Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 25, growthScope: 'high', description: 'Implement post-quantum crypto', milestones: ['Algorithms', 'Standards', 'Migration'], avgSalary: '$160k+' },
  ],

  // Robotics & Automation
  'industrial-robotics': [
    { id: 'robot-programmer', name: 'Robot Programmer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Program industrial robots', milestones: ['Programming', 'PLC', 'Safety'], avgSalary: '$90k+' },
    { id: 'robotics-engineer', name: 'Robotics Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Design robotic systems', milestones: ['System Design', 'Integration', 'Optimization'], avgSalary: '$130k+' },
  ],
  'autonomous-systems': [
    { id: 'autonomy-engineer', name: 'Autonomy Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Develop autonomous systems', milestones: ['SLAM', 'Planning', 'Perception'], avgSalary: '$150k+' },
    { id: 'av-engineer', name: 'Autonomous Vehicle Engineer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 18, growthScope: 'high', description: 'Build autonomous vehicles', milestones: ['Self-Driving', 'Safety', 'Testing'], avgSalary: '$180k+' },
  ],
  'robot-perception': [
    { id: 'perception-engineer', name: 'Perception Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Develop robot perception', milestones: ['Computer Vision', 'Sensor Fusion', 'ML'], avgSalary: '$145k+' },
    { id: 'cv-robotics-lead', name: 'CV/Robotics Lead', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 12, growthScope: 'high', description: 'Lead perception teams', milestones: ['Leadership', 'Innovation', 'Systems'], avgSalary: '$180k+' },
  ],
  'rpa': [
    { id: 'rpa-developer', name: 'RPA Developer', difficulty: 'intermediate', timeToStability: '1 year', riskScore: 10, growthScope: 'high', description: 'Develop RPA solutions', milestones: ['UiPath/Blue Prism', 'Process Automation', 'Testing'], avgSalary: '$85k+' },
    { id: 'rpa-architect', name: 'RPA Architect', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 8, growthScope: 'high', description: 'Design RPA strategy', milestones: ['Architecture', 'COE', 'Governance'], avgSalary: '$140k+' },
  ],
  'cobot-hri': [
    { id: 'cobot-developer', name: 'Collaborative Robotics Developer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 12, growthScope: 'high', description: 'Program collaborative robots', milestones: ['Cobot Programming', 'Safety', 'Integration'], avgSalary: '$100k+' },
    { id: 'hri-researcher', name: 'Human-Robot Interaction Researcher', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 20, growthScope: 'medium', description: 'Research HRI', milestones: ['Research', 'Studies', 'Publications'], avgSalary: '$120k+' },
  ],
  'mechatronics': [
    { id: 'mechatronics-engineer', name: 'Mechatronics Engineer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Design mechatronic systems', milestones: ['Controls', 'Integration', 'Testing'], avgSalary: '$95k+' },
    { id: 'controls-engineer', name: 'Controls Engineer', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Design control systems', milestones: ['Control Theory', 'PLC', 'Optimization'], avgSalary: '$120k+' },
  ],

  // Bioinformatics & Computational Biology
  'genomics-analysis': [
    { id: 'bioinformatician-genomics', name: 'Genomics Bioinformatician', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Analyze genomic data', milestones: ['NGS', 'Variant Calling', 'Pipelines'], avgSalary: '$110k+' },
    { id: 'senior-bioinformatician', name: 'Senior Bioinformatician', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 10, growthScope: 'high', description: 'Lead genomics analysis', milestones: ['Leadership', 'Methods Dev', 'Research'], avgSalary: '$150k+' },
  ],
  'structural-bio': [
    { id: 'structural-bioinformatician', name: 'Structural Bioinformatician', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 15, growthScope: 'high', description: 'Analyze protein structures', milestones: ['AlphaFold', 'Docking', 'Analysis'], avgSalary: '$115k+' },
    { id: 'computational-structural', name: 'Computational Structural Biologist', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 15, growthScope: 'high', description: 'Research protein structure', milestones: ['MD', 'Methods', 'Publications'], avgSalary: '$140k+' },
  ],
  'systems-biology': [
    { id: 'systems-biologist', name: 'Systems Biologist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 18, growthScope: 'high', description: 'Model biological systems', milestones: ['Networks', 'Modeling', 'Integration'], avgSalary: '$120k+' },
    { id: 'systems-bio-lead', name: 'Systems Biology Lead', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 15, growthScope: 'high', description: 'Lead systems biology research', milestones: ['Leadership', 'Grants', 'Publications'], avgSalary: '$160k+' },
  ],
  'clinical-bioinformatics': [
    { id: 'clinical-bioinformatician', name: 'Clinical Bioinformatician', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 10, growthScope: 'high', description: 'Apply bioinformatics clinically', milestones: ['Clinical NGS', 'Compliance', 'Interpretation'], avgSalary: '$120k+' },
    { id: 'genomics-director', name: 'Clinical Genomics Director', difficulty: 'advanced', timeToStability: '6-8 years', riskScore: 8, growthScope: 'high', description: 'Lead clinical genomics', milestones: ['Leadership', 'Accreditation', 'Strategy'], avgSalary: '$180k+' },
  ],
  'computational-genomics': [
    { id: 'comp-genomics-scientist', name: 'Computational Genomics Scientist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Apply ML to genomics', milestones: ['ML', 'scRNA-seq', 'Methods'], avgSalary: '$140k+' },
    { id: 'ml-biology-lead', name: 'ML for Biology Lead', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 12, growthScope: 'high', description: 'Lead ML in biology', milestones: ['Team', 'Innovation', 'Publications'], avgSalary: '$170k+' },
  ],
  'drug-discovery': [
    { id: 'comp-drug-scientist', name: 'Computational Drug Discovery Scientist', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 15, growthScope: 'high', description: 'Discover drugs computationally', milestones: ['Virtual Screening', 'QSAR', 'Leads'], avgSalary: '$130k+' },
    { id: 'drug-discovery-lead', name: 'Drug Discovery Lead', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 12, growthScope: 'high', description: 'Lead drug discovery programs', milestones: ['Pipeline', 'IND', 'Leadership'], avgSalary: '$180k+' },
  ],

  // Product Management & Tech Leadership
  'product-strategy': [
    { id: 'product-manager', name: 'Product Manager', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 15, growthScope: 'high', description: 'Own product outcomes', milestones: ['Discovery', 'Delivery', 'Metrics'], avgSalary: '$130k+' },
    { id: 'senior-pm', name: 'Senior Product Manager', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Lead product strategy', milestones: ['Strategy', 'Leadership', 'Impact'], avgSalary: '$170k+' },
    { id: 'vp-product', name: 'VP of Product', difficulty: 'advanced', timeToStability: '7-10 years', riskScore: 15, growthScope: 'high', description: 'Lead product organization', milestones: ['Org Building', 'Portfolio', 'P&L'], avgSalary: '$250k+' },
  ],
  'product-discovery': [
    { id: 'product-researcher', name: 'Product Researcher', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 12, growthScope: 'high', description: 'Research product opportunities', milestones: ['Research', 'Insights', 'Opportunity Mapping'], avgSalary: '$100k+' },
    { id: 'discovery-lead', name: 'Product Discovery Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'high', description: 'Lead product discovery', milestones: ['Methods', 'Team', 'Impact'], avgSalary: '$150k+' },
  ],
  'product-growth': [
    { id: 'growth-pm', name: 'Growth Product Manager', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 18, growthScope: 'high', description: 'Drive product growth', milestones: ['Experiments', 'Metrics', 'Loops'], avgSalary: '$140k+' },
    { id: 'head-of-growth', name: 'Head of Growth', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 18, growthScope: 'high', description: 'Lead growth strategy', milestones: ['Strategy', 'Team', 'Scale'], avgSalary: '$200k+' },
  ],
  'technical-pm': [
    { id: 'technical-pm-role', name: 'Technical Product Manager', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 12, growthScope: 'high', description: 'Manage technical products', milestones: ['Technical', 'APIs', 'Platform'], avgSalary: '$145k+' },
    { id: 'platform-pm', name: 'Platform Product Manager', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 10, growthScope: 'high', description: 'Own platform products', milestones: ['Platform Strategy', 'Ecosystem', 'Scale'], avgSalary: '$180k+' },
  ],
  'product-analytics': [
    { id: 'product-analyst', name: 'Product Analyst', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Analyze product data', milestones: ['SQL', 'Analytics', 'Insights'], avgSalary: '$100k+' },
    { id: 'product-analytics-lead', name: 'Product Analytics Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Lead product analytics', milestones: ['Team', 'Strategy', 'Data Culture'], avgSalary: '$150k+' },
  ],
  'engineering-management': [
    { id: 'engineering-manager', name: 'Engineering Manager', difficulty: 'advanced', timeToStability: '2-3 years', riskScore: 12, growthScope: 'high', description: 'Lead engineering teams', milestones: ['People Mgmt', 'Delivery', 'Culture'], avgSalary: '$180k+' },
    { id: 'director-engineering', name: 'Director of Engineering', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 12, growthScope: 'high', description: 'Lead engineering org', milestones: ['Org Design', 'Strategy', 'Scale'], avgSalary: '$250k+' },
    { id: 'vp-engineering', name: 'VP of Engineering', difficulty: 'advanced', timeToStability: '8-12 years', riskScore: 15, growthScope: 'high', description: 'Lead all engineering', milestones: ['Org Building', 'Tech Strategy', 'Exec Team'], avgSalary: '$350k+' },
  ],

  // UI/UX & Human-Computer Interaction
  'ux-research': [
    { id: 'ux-researcher', name: 'UX Researcher', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Conduct user research', milestones: ['Methods', 'Synthesis', 'Impact'], avgSalary: '$100k+' },
    { id: 'senior-ux-researcher', name: 'Senior UX Researcher', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Lead UX research', milestones: ['Strategy', 'Ops', 'Mentoring'], avgSalary: '$150k+' },
  ],
  'interaction-design': [
    { id: 'interaction-designer', name: 'Interaction Designer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Design user interactions', milestones: ['Wireframes', 'Prototypes', 'Systems'], avgSalary: '$110k+' },
    { id: 'principal-designer', name: 'Principal Designer', difficulty: 'advanced', timeToStability: '5-6 years', riskScore: 8, growthScope: 'high', description: 'Lead interaction design', milestones: ['Vision', 'Quality', 'Influence'], avgSalary: '$180k+' },
  ],
  'visual-ui-design': [
    { id: 'ui-designer', name: 'UI Designer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 10, growthScope: 'high', description: 'Design user interfaces', milestones: ['Visual Design', 'Figma', 'Accessibility'], avgSalary: '$100k+' },
    { id: 'senior-ui-designer', name: 'Senior UI Designer', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Lead UI design', milestones: ['Systems', 'Leadership', 'Craft'], avgSalary: '$145k+' },
  ],
  'design-systems': [
    { id: 'design-systems-designer', name: 'Design Systems Designer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 8, growthScope: 'high', description: 'Build design systems', milestones: ['Components', 'Tokens', 'Documentation'], avgSalary: '$120k+' },
    { id: 'design-systems-lead', name: 'Design Systems Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 8, growthScope: 'high', description: 'Lead design systems', milestones: ['Strategy', 'Adoption', 'Operations'], avgSalary: '$170k+' },
  ],
  'hci-research': [
    { id: 'hci-researcher', name: 'HCI Researcher', difficulty: 'advanced', timeToStability: '4-5 years', riskScore: 20, growthScope: 'medium', description: 'Research human-computer interaction', milestones: ['PhD', 'Publications', 'Methods'], avgSalary: '$120k+' },
    { id: 'research-scientist-hci', name: 'HCI Research Scientist', difficulty: 'advanced', timeToStability: '5-7 years', riskScore: 18, growthScope: 'medium', description: 'Lead HCI research', milestones: ['Lab', 'Grants', 'Impact'], avgSalary: '$160k+' },
  ],
  'conversational-design': [
    { id: 'conversation-designer', name: 'Conversation Designer', difficulty: 'intermediate', timeToStability: '1-2 years', riskScore: 15, growthScope: 'high', description: 'Design conversational interfaces', milestones: ['Dialog', 'VUI', 'NLU'], avgSalary: '$100k+' },
    { id: 'conversational-ux-lead', name: 'Conversational UX Lead', difficulty: 'advanced', timeToStability: '3-4 years', riskScore: 12, growthScope: 'high', description: 'Lead conversational design', milestones: ['Strategy', 'AI Integration', 'Scale'], avgSalary: '$150k+' },
  ],
};

module.exports = { careerPathsMap };