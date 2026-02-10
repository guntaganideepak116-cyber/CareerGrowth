
export interface Certification {
  id: string;
  name: string;
  provider: string;
  valueScore: number;
  industryAcceptance: 'high' | 'medium' | 'low';
  timeToComplete: string;
  cost: string;
  aiDecision: 'do-now' | 'do-later' | 'skip';
  aiReason: string;
  skills: string[];
  deadline?: string;
  // Detailed info
  overview: string;
  syllabus: string[];
  prerequisites: string[];
  officialUrl: string;
  preparationResources: string[];
  rolesUnlocked: string[];
  salaryRange: string;
  targetAudience: string[];
}

export const certificationsMap: Record<string, Certification[]> = {
  // CSE
  cse: [
    {
      id: 'cse-1',
      name: 'AWS Certified Solutions Architect',
      provider: 'Amazon Web Services',
      valueScore: 95,
      industryAcceptance: 'high',
      timeToComplete: '3 months',
      cost: '$150',
      aiDecision: 'do-now',
      aiReason: 'Top-tier cloud certification essential for modern software roles.',
      skills: ['Cloud Architecture', 'AWS', 'Security'],
      overview: 'Validates ability to design distributed systems on AWS.',
      syllabus: ['IAM', 'EC2', 'S3', 'VPC', 'Route53'],
      prerequisites: ['Basic Cloud Knowledge'],
      officialUrl: 'https://aws.amazon.com/certification/',
      preparationResources: ['A Cloud Guru', 'Official Docs'],
      rolesUnlocked: ['Cloud Architect', 'Backend Engineer'],
      salaryRange: '$100k - $160k',
      targetAudience: ['Developers', 'Architects']
    },
    {
      id: 'cse-2',
      name: 'Google Professional ML Engineer',
      provider: 'Google Cloud',
      valueScore: 92,
      industryAcceptance: 'high',
      timeToComplete: '4 months',
      cost: '$200',
      aiDecision: 'do-later',
      aiReason: 'Advanced ML certification. Great after mastering basics.',
      skills: ['Machine Learning', 'TensorFlow', 'GCP'],
      overview: 'Design, build, and productionize ML models.',
      syllabus: ['ML Pipeline', 'Model Training', 'Deployment'],
      prerequisites: ['Python', 'ML Basics'],
      officialUrl: 'https://cloud.google.com/certification/machine-learning-engineer',
      preparationResources: ['Coursera', 'Fast.ai'],
      rolesUnlocked: ['ML Engineer', 'Data Scientist'],
      salaryRange: '$120k - $180k',
      targetAudience: ['Data Scientists']
    },
    {
      id: 'cse-3',
      name: 'Certified Kubernetes Administrator (CKA)',
      provider: 'CNCF',
      valueScore: 90,
      industryAcceptance: 'high',
      timeToComplete: '3 months',
      cost: '$395',
      aiDecision: 'do-now',
      aiReason: 'Container orchestration is a must-have skill for DevOps.',
      skills: ['Kubernetes', 'Docker', 'DevOps'],
      overview: 'Demonstrates competence in Kubernetes administration.',
      syllabus: ['Cluster Arch', 'Workloads', 'Services'],
      prerequisites: ['Linux', 'Container Basics'],
      officialUrl: 'https://www.cncf.io/certification/cka/',
      preparationResources: ['KodeKloud', 'Listen to logs'],
      rolesUnlocked: ['DevOps Engineer', 'SRE'],
      salaryRange: '$110k - $170k',
      targetAudience: ['DevOps', 'SysAdmin']
    }
  ],
  // ECE
  ece: [
    {
      id: 'ece-1',
      name: 'Cisco Certified Network Associate (CCNA)',
      provider: 'Cisco',
      valueScore: 88,
      industryAcceptance: 'high',
      timeToComplete: '3-4 months',
      cost: '$300',
      aiDecision: 'do-now',
      aiReason: 'Foundational networking certification for ECE graduates.',
      skills: ['Networking', 'Routing', 'Switching'],
      overview: 'Fundamentals of network infrastructure and services.',
      syllabus: ['Network Fundamentals', 'IP Connectivity', 'Security Fundamentals'],
      prerequisites: ['None'],
      officialUrl: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html',
      preparationResources: ['Official Cert Guide', 'Packet Tracer'],
      rolesUnlocked: ['Network Engineer', 'Network Admin'],
      salaryRange: '$60k - $90k',
      targetAudience: ['Network Engineers']
    },
    {
      id: 'ece-2',
      name: 'Arm Accredited Engineer (AAE)',
      provider: 'Arm',
      valueScore: 90,
      industryAcceptance: 'high',
      timeToComplete: '2-3 months',
      cost: '$200',
      aiDecision: 'do-later',
      aiReason: 'Specialized for embedded systems careers.',
      skills: ['Arm Architecture', 'Embedded C', 'Debugging'],
      overview: 'Validates knowledge of Arm architecture and embedded software.',
      syllabus: ['Armv7/v8 Arch', 'Exception Handling', 'Memory Model'],
      prerequisites: ['C Programming', 'Microcontrollers'],
      officialUrl: 'https://www.arm.com/',
      preparationResources: ['Arm Developer Docs'],
      rolesUnlocked: ['Embedded Engineer', 'Firmware Engineer'],
      salaryRange: '$80k - $130k',
      targetAudience: ['Embedded Developers']
    },
    {
      id: 'ece-3',
      name: 'Certified IPC Specialist (CIS)',
      provider: 'IPC',
      valueScore: 85,
      industryAcceptance: 'high',
      timeToComplete: '1 week',
      cost: '$500+',
      aiDecision: 'skip',
      aiReason: 'Highly specific to PCB assembly/manufacturing roles.',
      skills: ['PCB Assembly', 'Soldering Standards'],
      overview: 'Standard for electronics assembly and soldering.',
      syllabus: ['IPC-A-610', 'Acceptability of Electronic Assemblies'],
      prerequisites: ['None'],
      officialUrl: 'https://www.ipc.org/',
      preparationResources: ['IPC Training Centers'],
      rolesUnlocked: ['PCB Design Engineer', 'Quality Engineer'],
      salaryRange: '$70k - $100k',
      targetAudience: ['Manufacturing Engineers']
    }
  ],
  // EEE
  eee: [
    {
      id: 'eee-1',
      name: 'Certified Energy Manager (CEM)',
      provider: 'AEE',
      valueScore: 92,
      industryAcceptance: 'high',
      timeToComplete: '3 months',
      cost: '$400',
      aiDecision: 'do-later',
      aiReason: 'Gold standard for energy management roles.',
      skills: ['Energy Auditing', 'Efficiency', 'Building Systems'],
      overview: 'Optimizing energy performance in facilities.',
      syllabus: ['Energy Codes', 'HVAC', 'Lighting', 'Boilers'],
      prerequisites: ['Engineering Degree'],
      officialUrl: 'https://www.aeecenter.org/certifications/cem',
      preparationResources: ['AEE Material'],
      rolesUnlocked: ['Energy Manager', 'Sustainability Consultant'],
      salaryRange: '$90k - $130k',
      targetAudience: ['Energy Engineers']
    },
    {
      id: 'eee-2',
      name: 'Fundamentals of Engineering (FE Electrical)',
      provider: 'NCEES',
      valueScore: 95,
      industryAcceptance: 'high',
      timeToComplete: '4-6 months',
      cost: '$175',
      aiDecision: 'do-now',
      aiReason: 'First step towards Professional Engineer (PE) license.',
      skills: ['Circuit Analysis', 'Power Systems', 'Electronics'],
      overview: 'Licensure exam for engineers in the US.',
      syllabus: ['Math', 'Circuits', 'Power', 'Control Systems'],
      prerequisites: ['ABET Degree'],
      officialUrl: 'https://ncees.org/engineering/fe/',
      preparationResources: ['FE Reference Handbook', 'Practice Exams'],
      rolesUnlocked: ['EIT (Engineer in Training)', 'Electrical Engineer'],
      salaryRange: '$70k - $100k',
      targetAudience: ['Final Year Students']
    },
    {
      id: 'eee-3',
      name: 'Siemens PLC Certification',
      provider: 'Siemens',
      valueScore: 88,
      industryAcceptance: 'high',
      timeToComplete: '2 months',
      cost: '$1000+',
      aiDecision: 'do-later',
      aiReason: 'Key for industrial automation and control roles.',
      skills: ['PLC Programming', 'SCADA', 'Automation'],
      overview: 'Programming and troubleshooting Siemens PLCs.',
      syllabus: ['TIA Portal', 'Ladder Logic', 'HMI'],
      prerequisites: ['Digital Logic', 'Control Basics'],
      officialUrl: 'https://www.sitrain-learning.siemens.com/',
      preparationResources: ['Siemens Training'],
      rolesUnlocked: ['Automation Engineer', 'Controls Engineer'],
      salaryRange: '$80k - $120k',
      targetAudience: ['Automation Engineers']
    }
  ],
  // Mechanical
  mechanical: [
    {
      id: 'mech-1',
      name: 'Certified SolidWorks Professional (CSWP)',
      provider: 'Dassault Systèmes',
      valueScore: 90,
      industryAcceptance: 'high',
      timeToComplete: '1-2 months',
      cost: '$99',
      aiDecision: 'do-now',
      aiReason: 'Proves advanced CAD modeling skills.',
      skills: ['Validates specific CAD skills', 'Part Modeling', 'Assemblies'],
      overview: 'Advanced mechanical design skills in SolidWorks.',
      syllabus: ['Part Modeling', 'Configurations', 'Assemblies'],
      prerequisites: ['CSWA', 'Design Experience'],
      officialUrl: 'https://www.solidworks.com/certifications/certified-solidworks-professional-cswp',
      preparationResources: ['SolidWorks Tutorials', 'Udemy'],
      rolesUnlocked: ['Mechanical Design Engineer', 'CAD Tech'],
      salaryRange: '$70k - $110k',
      targetAudience: ['Design Engineers']
    },
    {
      id: 'mech-2',
      name: 'Six Sigma Green Belt',
      provider: 'ASQ',
      valueScore: 88,
      industryAcceptance: 'medium',
      timeToComplete: '2-3 months',
      cost: '$438',
      aiDecision: 'do-later',
      aiReason: 'Valuable for manufacturing and quality roles.',
      skills: ['Quality Control', 'Process Improvement', 'Statistics'],
      overview: 'Methodologies for process improvement.',
      syllabus: ['DMAIC', 'Statistical Analysis', 'Lean Principles'],
      prerequisites: ['Work Experience (suggested)'],
      officialUrl: 'https://asq.org/cert/six-sigma-green-belt',
      preparationResources: ['ASQ Body of Knowledge'],
      rolesUnlocked: ['Quality Engineer', 'Process Engineer'],
      salaryRange: '$80k - $115k',
      targetAudience: ['Manufacturing', 'Operations']
    },
    {
      id: 'mech-3',
      name: 'FE Mechanical',
      provider: 'NCEES',
      valueScore: 95,
      industryAcceptance: 'high',
      timeToComplete: '4-6 months',
      cost: '$175',
      aiDecision: 'do-now',
      aiReason: 'Essential for HVAC, MEP, and consulting careers.',
      skills: ['Thermodynamics', 'Mechanics', 'Fluids'],
      overview: 'Licensure exam for mechanical engineers.',
      syllabus: ['Dynamics', 'Thermo', 'Fluid Mech', 'Heat Transfer'],
      prerequisites: ['ABET Degree'],
      officialUrl: 'https://ncees.org/engineering/fe/',
      preparationResources: ['NCEES Practice Exam'],
      rolesUnlocked: ['Mechanical Engineer', 'HVAC Engineer'],
      salaryRange: '$75k - $105k',
      targetAudience: ['Students']
    }
  ],
  // Civil
  civil: [
    {
      id: 'civ-1',
      name: 'AutoCAD Certified Professional',
      provider: 'Autodesk',
      valueScore: 85,
      industryAcceptance: 'high',
      timeToComplete: '1-2 months',
      cost: '$200',
      aiDecision: 'do-now',
      aiReason: 'Base requirement for many civil drafting roles.',
      skills: ['2D Drafting', '3D Modeling', 'Annotation'],
      overview: 'Validates advanced skills in AutoCAD.',
      syllabus: ['Drawing/Editing', 'Dimensions', 'Plotting'],
      prerequisites: ['AutoCAD experience'],
      officialUrl: 'https://www.autodesk.com/certification',
      preparationResources: ['Autodesk Learning'],
      rolesUnlocked: ['Civil Drafter', 'CAD Designer'],
      salaryRange: '$55k - $80k',
      targetAudience: ['Drafters', 'Designers']
    },
    {
      id: 'civ-2',
      name: 'LEED Green Associate',
      provider: 'USGBC',
      valueScore: 88,
      industryAcceptance: 'high',
      timeToComplete: '2 months',
      cost: '$250',
      aiDecision: 'do-now',
      aiReason: 'Sustainability knowledge is increasingly required.',
      skills: ['Green Building', 'Sustainability', 'LEED Rating'],
      overview: 'Foundational credential for green building professionals.',
      syllabus: ['LEED Process', 'Integrative Strategies', 'Water Efficiency'],
      prerequisites: ['None'],
      officialUrl: 'https://www.usgbc.org/credentials/leed-green-associate',
      preparationResources: ['GBES', 'USGBC Materials'],
      rolesUnlocked: ['Sustainability Consultant', 'Project Engineer'],
      salaryRange: '$70k - $100k',
      targetAudience: ['Architects', 'Civil Engineers']
    },
    {
      id: 'civ-3',
      name: 'Project Management Professional (PMP)',
      provider: 'PMI',
      valueScore: 94,
      industryAcceptance: 'high',
      timeToComplete: '3-6 months',
      cost: '$555',
      aiDecision: 'do-later',
      aiReason: 'Gold standard for construction management.',
      skills: ['Project Mgmt', 'Scheduling', 'Cost Control'],
      overview: 'Global standard in project management.',
      syllabus: ['People', 'Process', 'Business Environment'],
      prerequisites: ['3 years experience', '35 hours training'],
      officialUrl: 'https://www.pmi.org/certifications/project-management-pmp',
      preparationResources: ['PMBOK Guide', 'Rita Mulcahy'],
      rolesUnlocked: ['Project Manager', 'Construction Manager'],
      salaryRange: '$100k - $150k',
      targetAudience: ['Project Managers']
    }
  ],
  // Fallback
  engineering: [
    {
      id: 'eng-1',
      name: 'Project Management Professional (PMP)',
      provider: 'PMI',
      valueScore: 90,
      industryAcceptance: 'high',
      timeToComplete: '6 months',
      cost: '$405',
      aiDecision: 'do-later',
      aiReason: 'Applicable to all engineering disciplines.',
      skills: ['Management', 'Leadership', 'Planning'],
      overview: 'Generic Project Management.',
      syllabus: ['Project Lifecycle'],
      prerequisites: ['Experience'],
      officialUrl: 'pmi.org',
      preparationResources: ['PMBOK'],
      rolesUnlocked: ['Manager'],
      salaryRange: '$100k+',
      targetAudience: ['Engineers']
    }
  ]
};
