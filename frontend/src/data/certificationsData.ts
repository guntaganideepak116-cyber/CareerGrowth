
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
      aiReason: 'Advanced ML certification.',
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
      aiReason: 'Container orchestration is a must-have skill.',
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
      aiReason: 'Foundational networking certification.',
      skills: ['Networking', 'Routing', 'Switching'],
      overview: 'Fundamentals of network infrastructure.',
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
      aiReason: 'Specialized for embedded systems.',
      skills: ['Arm Architecture', 'Embedded C', 'Debugging'],
      overview: 'Validates knowledge of Arm architecture.',
      syllabus: ['Armv7/v8 Arch', 'Exception Handling', 'Memory Model'],
      prerequisites: ['C Programming', 'Microcontrollers'],
      officialUrl: 'https://www.arm.com/',
      preparationResources: ['Arm Developer Docs'],
      rolesUnlocked: ['Embedded Engineer', 'Firmware Engineer'],
      salaryRange: '$80k - $130k',
      targetAudience: ['Embedded Developers']
    }
  ],
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
      aiReason: 'First step towards PE license.',
      skills: ['Circuit Analysis', 'Power Systems', 'Electronics'],
      overview: 'Licensure exam for engineers.',
      syllabus: ['Math', 'Circuits', 'Power', 'Control Systems'],
      prerequisites: ['ABET Degree'],
      officialUrl: 'https://ncees.org/engineering/fe/',
      preparationResources: ['FE Handbook', 'Practice Exams'],
      rolesUnlocked: ['Engineer in Training', 'Electrical Engineer'],
      salaryRange: '$70k - $100k',
      targetAudience: ['Final Year Students']
    }
  ],
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
      skills: ['CAD', 'Part Modeling', 'Assemblies'],
      overview: 'Advanced mechanical design skills.',
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
    }
  ],
  medical: [
    {
      id: 'med-1',
      name: 'USMLE Step 1',
      provider: 'FSMB & NBME',
      valueScore: 98,
      industryAcceptance: 'high',
      timeToComplete: '6-12 months',
      cost: '$985',
      aiDecision: 'do-now',
      aiReason: 'Mandatory for medical licensure in US/International practice.',
      skills: ['Basic Science', 'Pathology', 'Pharmacology'],
      overview: 'Assesses understanding of basic science concepts.',
      syllabus: ['Anatomy', 'Physiology', 'Biochemistry'],
      prerequisites: ['Medical Student'],
      officialUrl: 'https://www.usmle.org/',
      preparationResources: ['First Aid', 'UWorld'],
      rolesUnlocked: ['Medical Resident', 'Doctor'],
      salaryRange: '$60k (Residency)',
      targetAudience: ['Medical Students']
    },
    {
      id: 'med-2',
      name: 'ACLS (Advanced Cardiovascular Life Support)',
      provider: 'AHA',
      valueScore: 90,
      industryAcceptance: 'high',
      timeToComplete: '2 days',
      cost: '$200',
      aiDecision: 'do-now',
      aiReason: 'Required for almost all hospital clinical roles.',
      skills: ['CPR', 'Emergency Care', 'Team Dynamics'],
      overview: 'Clinical interventions for cardiovascular emergencies.',
      syllabus: ['Airway Management', 'Rhythms'],
      prerequisites: ['BLS'],
      officialUrl: 'https://cpr.heart.org/',
      preparationResources: ['AHA Manual'],
      rolesUnlocked: ['ER Doctor', 'Nurse'],
      salaryRange: 'N/A',
      targetAudience: ['Clinicians']
    }
  ],
  science: [
    {
      id: 'sci-1',
      name: 'Certified Analytics Professional (CAP)',
      provider: 'INFORMS',
      valueScore: 90,
      industryAcceptance: 'high',
      timeToComplete: '3-6 months',
      cost: '$695',
      aiDecision: 'do-later',
      aiReason: 'Validates end-to-end analytics process knowledge.',
      skills: ['Data Analytics', 'Modeling', 'Deployment'],
      overview: 'End-to-end analytics practice certification.',
      syllabus: ['Business Problem Framing', 'Methodology'],
      prerequisites: ['Degree + Experience'],
      officialUrl: 'https://www.certifiedanalytics.org/',
      preparationResources: ['CAP Handbook'],
      rolesUnlocked: ['Data Scientist', 'Analyst'],
      salaryRange: '$90k - $140k',
      targetAudience: ['Data Scientists']
    }
  ],
  commerce: [
    {
      id: 'comm-1',
      name: 'Chartered Financial Analyst (CFA) Level 1',
      provider: 'CFA Institute',
      valueScore: 98,
      industryAcceptance: 'high',
      timeToComplete: '6 months',
      cost: '$900',
      aiDecision: 'do-now',
      aiReason: 'The most respected designation in investment management.',
      skills: ['Financial Analysis', 'Ethics', 'Economics'],
      overview: 'Investment tools and ethical standards.',
      syllabus: ['Quantitative Methods', 'Financial Reporting'],
      prerequisites: ['Bachelor Degree (final year)'],
      officialUrl: 'https://www.cfainstitute.org/',
      preparationResources: ['Kaplan Schweser'],
      rolesUnlocked: ['Investment Analyst'],
      salaryRange: '$80k - $150k',
      targetAudience: ['Finance Professionals']
    }
  ],
  arts: [
    {
      id: 'arts-1',
      name: 'Google UX Design Professional Certificate',
      provider: 'Google',
      valueScore: 88,
      industryAcceptance: 'high',
      timeToComplete: '6 months',
      cost: '$240',
      aiDecision: 'do-now',
      aiReason: 'Great entry point for creative careers in tech.',
      skills: ['UX Design', 'Figma', 'Prototyping'],
      overview: 'Foundations of UX design.',
      syllabus: ['User Research', 'Wireframing'],
      prerequisites: ['None'],
      officialUrl: 'https://grow.google/certificates/ux-design/',
      preparationResources: ['Coursera'],
      rolesUnlocked: ['UX Designer'],
      salaryRange: '$60k - $90k',
      targetAudience: ['Designers']
    }
  ],
  law: [
    {
      id: 'law-1',
      name: 'Certified Information Privacy Professional (CIPP/E)',
      provider: 'IAPP',
      valueScore: 92,
      industryAcceptance: 'high',
      timeToComplete: '3 months',
      cost: '$550',
      aiDecision: 'do-now',
      aiReason: 'Critical for data protection and tech law.',
      skills: ['GDPR', 'Privacy Law', 'Compliance'],
      overview: 'European data protection laws.',
      syllabus: ['GDPR Principles', 'Data Rights'],
      prerequisites: ['None'],
      officialUrl: 'https://iapp.org/',
      preparationResources: ['IAPP Books'],
      rolesUnlocked: ['Privacy Officer', 'Legal Counsel'],
      salaryRange: '$100k - $160k',
      targetAudience: ['Lawyers']
    }
  ],
  education: [
    {
      id: 'edu-1',
      name: 'Google Certified Educator Level 1',
      provider: 'Google',
      valueScore: 85,
      industryAcceptance: 'high',
      timeToComplete: '1 month',
      cost: '$10',
      aiDecision: 'do-now',
      aiReason: 'Essential for modern digital classrooms.',
      skills: ['Google Classroom', 'EdTech'],
      overview: 'Using Google tools in teaching.',
      syllabus: ['Chrome', 'Classroom', 'Forms'],
      prerequisites: ['None'],
      officialUrl: 'https://edu.google.com/',
      preparationResources: ['Google Fundamentals Training'],
      rolesUnlocked: ['Digital Teacher'],
      salaryRange: 'N/A',
      targetAudience: ['Teachers']
    }
  ],
  design: [
    {
      id: 'des-1',
      name: 'Adobe Certified Professional using Photoshop',
      provider: 'Adobe',
      valueScore: 88,
      industryAcceptance: 'high',
      timeToComplete: '2 months',
      cost: '$150',
      aiDecision: 'do-now',
      aiReason: 'Standard validation for visual design skills.',
      skills: ['Photoshop', 'Visual Design', 'Editing'],
      overview: 'Demonstrates proficiency in Adobe Photoshop.',
      syllabus: ['Layers', 'Masking', 'Retouching'],
      prerequisites: ['Experience'],
      officialUrl: 'https://certifiedprofessional.adobe.com/',
      preparationResources: ['Adobe Creative Cloud'],
      rolesUnlocked: ['Graphic Designer', 'Visual Artist'],
      salaryRange: '$50k - $80k',
      targetAudience: ['Designers']
    }
  ],
  'cloud-computing': [
    {
      id: 'cloud-1',
      name: 'AWS Certified Solutions Architect – Associate',
      provider: 'AWS',
      valueScore: 98,
      industryAcceptance: 'high',
      timeToComplete: '3 months',
      cost: '$150',
      aiDecision: 'do-now',
      aiReason: 'The most popular cloud certification globally.',
      skills: ['AWS Services', 'Cloud Architecture'],
      overview: 'Designing distributed systems on AWS.',
      syllabus: ['IAM', 'VPC', 'EC2', 'S3'],
      prerequisites: ['Basic IT knowledge'],
      officialUrl: 'https://aws.amazon.com/certification/',
      preparationResources: ['A Cloud Guru'],
      rolesUnlocked: ['Cloud Engineer', 'Solutions Architect'],
      salaryRange: '$120k - $160k',
      targetAudience: ['Developers', 'Admins']
    }
  ],
  'devops-sre': [
    {
      id: 'devops-1',
      name: 'Certified Kubernetes Administrator (CKA)',
      provider: 'CNCF',
      valueScore: 98,
      industryAcceptance: 'high',
      timeToComplete: '3 months',
      cost: '$395',
      aiDecision: 'do-now',
      aiReason: 'Defacto standard for container orchestration.',
      skills: ['Kubernetes', 'Troubleshooting'],
      overview: 'Kubernetes cluster administration.',
      syllabus: ['Cluster Arch', 'Workloads'],
      prerequisites: ['Linux'],
      officialUrl: 'https://www.cncf.io/',
      preparationResources: ['KodeKloud'],
      rolesUnlocked: ['SRE', 'Platform Engineer'],
      salaryRange: '$130k - $180k',
      targetAudience: ['DevOps']
    }
  ],
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
      aiReason: 'Universal management certification.',
      skills: ['Project Mgmt', 'Leadership'],
      overview: 'Project management standards.',
      syllabus: ['People', 'Process', 'Business Env'],
      prerequisites: ['Experience'],
      officialUrl: 'https://www.pmi.org/',
      preparationResources: ['PMBOK'],
      rolesUnlocked: ['Project Manager'],
      salaryRange: '$100k+',
      targetAudience: ['Engineers']
    }
  ]
};
