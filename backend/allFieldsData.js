/**
 * COMPLETE REAL-WORLD DATA - ALL 22 FIELDS
 * This file is the "Source of Truth" for the Career Architecture.
 * It contains structured data for Field -> Specialization -> Career Paths/Projects/Certs.
 */

const COMPLETE_REAL_WORLD_DATA = {
    // 1. ENGINEERING (Branch-based)
    engineering: {
        displayName: 'Engineering',
        specializations: {
            'cse-software-dev': {
                displayName: 'Software Development & Programming',
                branch: 'cse',
                careerPaths: ['Software Engineer', 'Backend Developer', 'Systems Architect'],
                projects: { beginner: ['Snake Game', 'Calculator'], intermediate: ['E-commerce API'], advanced: ['Distributed System'] },
                certifications: { free: ['HackerRank'], pro: ['Oracle Java'], premium: ['Meta SE Cert'] }
            },
            'cse-web-dev': {
                displayName: 'Full Stack Web Development',
                branch: 'cse',
                careerPaths: ['Frontend Developer', 'Full Stack Developer', 'Cloud Web Architect'],
                projects: { beginner: ['Portfolio'], intermediate: ['Social Media Clone'], advanced: ['SaaS Platform'] },
                certifications: { free: ['freeCodeCamp'], pro: ['Meta Frontend'], premium: ['AWS Dev Associate'] }
            },
            'cse-mobile-dev': {
                displayName: 'Mobile App Development',
                branch: 'cse',
                careerPaths: ['iOS Developer', 'Android Developer', 'Cross-platform Mobile Lead'],
                projects: { beginner: ['To-Do App'], intermediate: ['Food Delivery App'], advanced: ['Fitness Tracker'] },
                certifications: { free: ['Flutter Basics'], pro: ['Google Android Cert'], premium: ['Apple Developer'] }
            },
            'cse-ai-ml': {
                displayName: 'AI & Machine Learning',
                branch: 'cse',
                careerPaths: ['ML Engineer', 'Data Scientist', 'AI Research Scientist'],
                projects: { beginner: ['Digit Recognizer'], intermediate: ['Sentiment Bot'], advanced: ['Autonomous Bot'] },
                certifications: { free: ['Kaggle'], pro: ['DeepLearning.AI'], premium: ['Google ML Professional'] }
            },
            'ece-vlsi': {
                displayName: 'VLSI Design & Chip Engineering',
                branch: 'ece',
                careerPaths: ['VLSI Design Engineer', 'ASIC Designer', 'SoC Architect'],
                projects: { beginner: ['Logic Gate Sim'], intermediate: ['8-bit CPU'], advanced: ['Nvidia-grade GPU block'] },
                certifications: { free: ['Verilog Basics'], pro: ['Cadence Tool Training'], premium: ['M.Tech VLSI'] }
            },
            'ece-embedded': {
                displayName: 'Embedded Systems & IoT',
                branch: 'ece',
                careerPaths: ['Embedded Systems Engineer', 'IoT Solutions Architect', 'Hardware Designer'],
                projects: { beginner: ['Arduino Light'], intermediate: ['Smart Home Hub'], advanced: ['RTOS Kernel'] },
                certifications: { free: ['Cisco IoT'], pro: ['ARM Developer'], premium: ['Masters in ES'] }
            },
            'eee-power-systems': {
                displayName: 'Power Systems & Grid',
                branch: 'eee',
                careerPaths: ['Power Systems Engineer', 'Grid Manager', 'Electrical Consultant'],
                projects: { beginner: ['Basic Circuit'], intermediate: ['Micro-grid model'], advanced: ['Smart Grid AI'] },
                certifications: { free: ['NPTEL Power'], pro: ['IEEE Cert'], premium: ['Smart Grid Expert'] }
            },
            'eee-ev': {
                displayName: 'Electric Vehicles & Battery',
                branch: 'eee',
                careerPaths: ['EV Powertrain Engineer', 'BMS Designer', 'Battery Scientist'],
                projects: { beginner: ['Motor Control'], intermediate: ['BMS Simulation'], advanced: ['EV Prototype'] },
                certifications: { free: ['EV Intro'], pro: ['Tesla-style Training'], premium: ['Masters in EV'] }
            },
            'mech-design': {
                displayName: 'Design & Manufacturing',
                branch: 'mechanical',
                careerPaths: ['Design Engineer', 'CAD Specialist', 'Production Manager'],
                projects: { beginner: ['3D Bridge'], intermediate: ['Engine Crankshaft'], advanced: ['Factory Automation'] },
                certifications: { free: ['SolidWorks Basic'], pro: ['AutoCAD Pro'], premium: ['M.Tech Design'] }
            },
            'mech-robotics': {
                displayName: 'Robotics & Automation',
                branch: 'mechanical',
                careerPaths: ['Robotics Engineer', 'Automation Lead', 'Mechatronics Expert'],
                projects: { beginner: ['Robot Arm'], intermediate: ['Drone Kit'], advanced: ['Humanoid Model'] },
                certifications: { free: ['ROS Basics'], pro: ['Fanuc Robotics'], premium: ['Masters Robotics'] }
            },
            'civil-structural': {
                displayName: 'Structural Engineering',
                branch: 'civil',
                careerPaths: ['Structural Engineer', 'Project Manager', 'Bridge Designer'],
                projects: { beginner: ['Truss Model'], intermediate: ['Apartment Design'], advanced: ['Skyscraper Analysis'] },
                certifications: { free: ['STAAD.Pro Basic'], pro: ['ETABS Pro'], premium: ['Chartered Engineer'] }
            },
            'civil-construction': {
                displayName: 'Construction Management',
                branch: 'civil',
                careerPaths: ['Site Engineer', 'Quantity Surveyor', 'Construction Manager'],
                projects: { beginner: ['Costing Sheet'], intermediate: ['BIM model'], advanced: ['Metro Project'] },
                certifications: { free: ['Project Mgmt Basic'], pro: ['PMP (Construction)'], premium: ['RICS'] }
            }
        }
    },

    // 2. MEDICAL
    medical: {
        displayName: 'Medical & Health Sciences',
        specializations: {
            'hospital-admin': {
                displayName: 'Hospital Administration',
                careerPaths: ['Hospital Manager', 'Chief Operations Officer', 'Patient Relation Manager'],
                projects: { beginner: ['OPD Flow Chart'], intermediate: ['Clinic Website'], advanced: ['HMS Software'] },
                certifications: { free: ['WHO Clinical Mgmt'], pro: ['PGDHA'], premium: ['MBA Healthcare'] }
            },
            'clinical-research': {
                displayName: 'Clinical Research',
                careerPaths: ['Clinical Trial Manager', 'Drug Safety Physician', 'Protocol Designer'],
                projects: { beginner: ['Trial Data Study'], intermediate: ['FDA Filing Mockup'], advanced: ['Phase 1 Trial'] },
                certifications: { free: ['GCP Cert'], pro: ['Advanced Clinical'], premium: ['PhD Res'] }
            },
            'health-informatics': {
                displayName: 'Health Informatics',
                careerPaths: ['Health Data Analyst', 'Informatics Specialist', 'IT Healthcare Lead'],
                projects: { beginner: ['EHR Mockup'], intermediate: ['Disease Tracker'], advanced: ['AI Diagnosis'] },
                certifications: { free: ['Coursera IT Health'], pro: ['IBM Data Health'], premium: ['M.Sc Informatics'] }
            }
        }
    },

    // 3. SCIENCE
    science: {
        displayName: 'Science & Research',
        specializations: {
            'rnd': {
                displayName: 'Research & Development',
                careerPaths: ['Scientist', 'Lab Director', 'Research Lead'],
                projects: { beginner: ['Lit Review'], intermediate: ['Experiment Set'], advanced: ['Novel Discovery'] },
                certifications: { free: ['Science Writing'], pro: ['Lab Safety'], premium: ['PhD'] }
            },
            'applied-math': {
                displayName: 'Applied Mathematics',
                careerPaths: ['Actuary', 'Quantitative Analyst', 'Computational Math'],
                projects: { beginner: ['Stat Calculator'], intermediate: ['Market Sim'], advanced: ['Algorithm Design'] },
                certifications: { free: ['Khan Academy'], pro: ['Actuarial Level'], premium: ['Masters Math'] }
            },
            'bioinformatics': {
                displayName: 'Bioinformatics',
                careerPaths: ['Genomics Analyst', 'Bio-IT Developer', 'Data Scientist'],
                projects: { beginner: ['DNA Seq'], intermediate: ['Proteomics App'], advanced: ['Drug Discovery'] },
                certifications: { free: ['NCBI Guide'], pro: ['Python Bio'], premium: ['M.Sc Bioinfo'] }
            }
        }
    },

    // 4. COMMERCE
    commerce: {
        displayName: 'Commerce & Business',
        specializations: {
            'financial-analysis': {
                displayName: 'Financial Analysis',
                careerPaths: ['Investment Banker', 'Financial Analyst', 'Portfolio Manager'],
                projects: { beginner: ['Budget Plan'], intermediate: ['Stock Valuation'], advanced: ['M&A Model'] },
                certifications: { free: ['Corporate Finance'], pro: ['CFA Level 1'], premium: ['CFA Charter'] }
            },
            'accounting': {
                displayName: 'Accounting',
                careerPaths: ['Chartered Accountant', 'Tax Consultant', 'Auditor'],
                projects: { beginner: ['Tally Setup'], intermediate: ['Tax Audit'], advanced: ['CFO Level Strategy'] },
                certifications: { free: ['GST Basics'], pro: ['CA Final'], premium: ['CPA / ACCA'] }
            },
            'business-analytics': {
                displayName: 'Business Analytics',
                careerPaths: ['Data Analyst', 'Business Intelligence Developer', 'Strategy Head'],
                projects: { beginner: ['Excel Dash'], intermediate: ['Power BI Sales'], advanced: ['Customer Churn'] },
                certifications: { free: ['Google Data Analytics'], pro: ['Microsoft PL-300'], premium: ['IBM Data Expert'] }
            }
        }
    },

    // 5. LAW
    law: {
        displayName: 'Law & Legal Studies',
        specializations: {
            'corporate-law': {
                displayName: 'Corporate Law',
                careerPaths: ['Corporate Counsel', 'M&A Lawyer', 'Legal Compliance Head'],
                projects: { beginner: ['Contract Draft'], intermediate: ['Startup Legal Kit'], advanced: ['Litigation Strategy'] },
                certifications: { free: ['IPR Basics'], pro: ['LLM Corporate'], premium: ['Bar Council Pro'] }
            },
            'cyber-law': {
                displayName: 'Cyber Law',
                careerPaths: ['Cyber Lawyer', 'Privacy Consultant', 'Policy Researcher'],
                projects: { beginner: ['T&C Policy'], intermediate: ['GDPR Audit'], advanced: ['Cyber Crime Case'] },
                certifications: { free: ['MeitY Modules'], pro: ['Certified Privacy Pro'], premium: ['LLM Cyber'] }
            }
        }
    },

    // 6. ARTS
    arts: {
        displayName: 'Arts & Humanities',
        specializations: {
            'psychology': {
                displayName: 'Psychology',
                careerPaths: ['Clinical Psychologist', 'Counselor', 'HR Specialist'],
                projects: { beginner: ['Survey'], intermediate: ['Counseling Mock'], advanced: ['Research Paper'] },
                certifications: { free: ['Psych 101'], pro: ['M.A. Psych'], premium: ['RCI License'] }
            }
        }
    },

    // 7. DESIGN
    design: {
        displayName: 'Design & Creative Arts',
        specializations: {
            'ui-ux': {
                displayName: 'UI/UX Design',
                careerPaths: ['UI Designer', 'UX Researcher', 'Product Lead'],
                projects: { beginner: ['Mobile App Mockup'], intermediate: ['Design System'], advanced: ['Complex SaaS UI'] },
                certifications: { free: ['Figma Guide'], pro: ['Google UX Design'], premium: ['HCI Master'] }
            },
            'game-design': {
                displayName: 'Game Design',
                careerPaths: ['Game Designer', 'Level Designer', 'Indie Dev'],
                projects: { beginner: ['Platformer'], intermediate: ['RPG World'], advanced: ['Multiplayer Logic'] },
                certifications: { free: ['Unity Essentials'], pro: ['Unreal Engine Cert'], premium: ['Indie Dev Pro'] }
            }
        }
    },

    // 8. DEFENSE
    defense: {
        displayName: 'Defense & Security',
        specializations: {
            'armed-forces': {
                displayName: 'Armed Forces',
                careerPaths: ['Army Officer', 'Navy Pilot', 'Commando'],
                projects: { beginner: ['Fitness Plan'], intermediate: ['Strategy Doc'], advanced: ['Leadership Mock'] },
                certifications: { free: ['NCC'], pro: ['NDA/CDS Prep'], premium: ['Academy Commission'] }
            }
        }
    },

    // 9. MEDIA & COMMUNICATION
    media: {
        displayName: 'Media & Mass Comm',
        specializations: {
            'media-journalism': {
                displayName: 'Journalism',
                careerPaths: ['News Reporter', 'Digital Editor', 'Anchor'],
                projects: { beginner: ['News Blog'], intermediate: ['Video Doc'], advanced: ['News Channel Setup'] },
                certifications: { free: ['Google News Init'], pro: ['BJMC'], premium: ['MJMC'] }
            },
            'media-digital': {
                displayName: 'Digital Content',
                careerPaths: ['Content Strategist', 'Influencer Lead', 'Social Media Head'],
                projects: { beginner: ['Ad Campaign'], intermediate: ['YouTube Channel'], advanced: ['Brand Pivot'] },
                certifications: { free: ['HubSpot Marketing'], pro: ['Meta Social Admin'], premium: ['Masters Media'] }
            }
        }
    },

    // 10. CIVIL SERVICES
    'civil-services': {
        displayName: 'Civil Services',
        specializations: {
            'civil-admin': {
                displayName: 'IAS Administration',
                careerPaths: ['IAS Officer', 'Sub-Collector', 'Chief Secretary'],
                projects: { beginner: ['UPSC Mock'], intermediate: ['District Plan'], advanced: ['Policy Proposal'] },
                certifications: { free: ['Civils Prep Free'], pro: ['Foundation Course'], premium: ['Service Training'] }
            },
            'civil-police': {
                displayName: 'IPS & Security',
                careerPaths: ['IPS Officer', 'SP', 'DGP'],
                projects: { beginner: ['Security Audit'], intermediate: ['Patrol Optimization'], advanced: ['Crime Data Hub'] },
                certifications: { free: ['SVP NPA Guide'], pro: ['Police Academy'], premium: ['Senior Security'] }
            }
        }
    },

    // 11. LOGISTICS
    logistics: {
        displayName: 'Logistics & Supply Chain',
        specializations: {
            'supply-chain-analytics': {
                displayName: 'Supply Chain Analytics',
                careerPaths: ['SCM Consultant', 'Sustainability Lead', 'Supply Chain Head'],
                projects: { beginner: ['Tracker'], intermediate: ['Route Optimizer'], advanced: ['Global Ops Hub'] },
                certifications: { free: ['Logistics 101'], pro: ['Six Sigma Green'], premium: ['CSCP'] }
            },
            'warehouse-transport-management': {
                displayName: 'Warehouse Management',
                careerPaths: ['Warehouse Manager', 'Cold Chain Lead', 'Regional Ops Head'],
                projects: { beginner: ['Layout Design'], intermediate: ['WMS Setup'], advanced: ['Automated Warehouse'] },
                certifications: { free: ['5S Training'], pro: ['Safety Cert'], premium: ['Lean Expert'] }
            }
        }
    },

    // 12. AVIATION
    aviation: {
        displayName: 'Aviation & Merchant Navy',
        specializations: {
            'commercial-pilot-operations': {
                displayName: 'Commercial Pilot & Flight Operations',
                careerPaths: ['Airline Pilot', 'First Officer', 'Captain'],
                projects: { beginner: ['Sim Log'], intermediate: ['IFR Training'], advanced: ['ATPL Theory'] },
                certifications: { free: ['DGCA Ground'], pro: ['CPL License'], premium: ['Type Rating'] }
            },
            'merchant-navy-deck-engine': {
                displayName: 'Merchant Navy',
                careerPaths: ['Deck Officer', 'Chief Engineer', 'Master Mariner'],
                projects: { beginner: ['Sea Log'], intermediate: ['Navigation Mock'], advanced: ['Engine Overhaul'] },
                certifications: { free: ['STCW'], pro: ['GME / DNS'], premium: ['COC Master'] }
            }
        }
    },

    // 13. CLOUD COMPUTING (Promoted)
    'cloud-computing': {
        displayName: 'Cloud Computing',
        specializations: {
            'cloud-architecture': {
                displayName: 'Cloud Architecture',
                careerPaths: ['Cloud Architect', 'Solutions Architect', 'Infrastructure Head'],
                projects: { beginner: ['VPC Setup'], intermediate: ['Serverless API'], advanced: ['Global Cloud Infra'] },
                certifications: { free: ['AWS Cloud Practitioner'], pro: ['AWS Solutions Architect'], premium: ['Google Cloud Architect'] }
            },
            'cloud-devops': {
                displayName: 'Cloud DevOps',
                careerPaths: ['DevOps Engineer', 'SRE', 'DevSecOps Manager'],
                projects: { beginner: ['Dockerize App'], intermediate: ['K8s Cluster'], advanced: ['Zero Downtime CI/CD'] },
                certifications: { free: ['Linux Basics'], pro: ['CKA Certification'], premium: ['AWS DevOps Pro'] }
            }
        }
    },

    // 14. AI & ML (Promoted)
    'ai-ml': {
        displayName: 'AI & Machine Learning',
        specializations: {
            'ai-deep-learning': {
                displayName: 'Deep Learning',
                careerPaths: ['DL Engineer', 'Computer Vision Expert', 'Researcher'],
                projects: { beginner: ['Digit Classifier'], intermediate: ['Face Recognition'], advanced: ['Generative AI'] },
                certifications: { free: ['Fast.ai'], pro: ['Pytorch Spec'], premium: ['Nvidia Deep Learning'] }
            },
            'ai-ds': {
                displayName: 'Data Science',
                careerPaths: ['Data Scientist', 'BI Developer', 'Analytics Head'],
                projects: { beginner: ['Sales EDA'], intermediate: ['Predictive Model'], advanced: ['Big Data Pipeline'] },
                certifications: { free: ['Kaggle DS'], pro: ['IBM DS Professional'], premium: ['AWS Data Analytics'] }
            },
            'ai-nlp': {
                displayName: 'Natural Language Processing',
                careerPaths: ['NLP Engineer', 'Conversation AI Lead', 'LLM Scientist'],
                projects: { beginner: ['Spam Filter'], intermediate: ['Chatbot'], advanced: ['Custom GPT'] },
                certifications: { free: ['Hugging Face'], pro: ['LangChain Cert'], premium: ['NLP Specialization'] }
            }
        }
    },

    // 15. CYBERSECURITY (Promoted)
    'cybersecurity': {
        displayName: 'Cybersecurity',
        specializations: {
            'cyber-offensive': {
                displayName: 'Offensive Security',
                careerPaths: ['Ethical Hacker', 'Red Team Lead', 'Security Researcher'],
                projects: { beginner: ['SQLi Lab'], intermediate: ['Vuln Scanner'], advanced: ['Full APT Mock'] },
                certifications: { free: ['TryHackMe'], pro: ['CEH / PenTest+'], premium: ['OSCP'] }
            },
            'cyber-defensive': {
                displayName: 'Defensive Security',
                careerPaths: ['SOC Analyst', 'BRP Manager', 'CISO'],
                projects: { beginner: ['Log Analytics'], intermediate: ['SIEM Setup'], advanced: ['Incident Response Pro'] },
                certifications: { free: ['Google Cyber'], pro: ['Security+'], premium: ['CISSP'] }
            }
        }
    },

    // 16. BLOCKCHAIN (Promoted)
    'blockchain-web3': {
        displayName: 'Blockchain & Web3',
        specializations: {
            'web3-smart-contracts': {
                displayName: 'Smart Contract Dev',
                careerPaths: ['Blockchain Engineer', 'Solidity Dev', 'Web3 Architect'],
                projects: { beginner: ['ERC20 Token'], intermediate: ['DeFi Loan'], advanced: ['DEX Engine'] },
                certifications: { free: ['CryptoZombies'], pro: ['ConsenSys Dev'], premium: ['Blockchain Architect'] }
            },
            'web3-dapps': {
                displayName: 'DApp Development',
                careerPaths: ['Web3 Frontend Engineer', 'Fullstack Web3 Dev', 'EVM Specialist'],
                projects: { beginner: ['Wallet Connect'], intermediate: ['NFT Gallery'], advanced: ['Metaverse DApp'] },
                certifications: { free: ['Alchemy University'], pro: ['Web3JS Mastery'], premium: ['Certified Web3 Pro'] }
            }
        }
    },

    // 17. EMERGING TECH
    'emerging-tech': {
        displayName: 'Emerging Tech',
        specializations: {
            'tech-quantum': {
                displayName: 'Quantum Computing',
                careerPaths: ['Quantum Researcher', 'Quantum Algorithms Lead'],
                projects: { beginner: ['Quantum Gate'], intermediate: ['QKD Sim'], advanced: ['Shor\'s Demo'] },
                certifications: { free: ['IBM Qiskit'], pro: ['MS Quantum'], premium: ['PhD Quantum'] }
            },
            'tech-robotics': {
                displayName: 'Space Tech & Robotics',
                careerPaths: ['Satellite Engineer', 'Robotics Researcher', 'Space Ops'],
                projects: { beginner: ['Drone'], intermediate: ['SmallSat Mock'], advanced: ['Mars Rover Unit'] },
                certifications: { free: ['NASA Free Ed'], pro: ['STK Software'], premium: ['Master Space Tech'] }
            }
        }
    },

    // 18. EDUCATION
    education: {
        displayName: 'Education',
        specializations: {
            'edtech': {
                displayName: 'EdTech & Digital Learning',
                careerPaths: ['Instructional Designer', 'EdTech Product Manager', 'E-Learning Lead'],
                projects: { beginner: ['Lesson Plan'], intermediate: ['LMS Course'], advanced: ['AI Tutor'] },
                certifications: { free: ['Google Educator'], pro: ['Instructional Design'], premium: ['EdTech Leader'] }
            }
        }
    },

    // 19. AGRICULTURE
    agriculture: {
        displayName: 'Agriculture',
        specializations: {
            'agritech': {
                displayName: 'Agri-Tech',
                careerPaths: ['Agri-Tech Founder', 'Smart Farming Specialist', 'Agri Data Scientist'],
                projects: { beginner: ['Soil Sensor'], intermediate: ['Drone Agri'], advanced: ['Precision Supply'] },
                certifications: { free: ['Agri 101'], pro: ['Agri-data Cert'], premium: ['Agri-MBA'] }
            }
        }
    },

    // 20. HOSPITALITY
    hospitality: {
        displayName: 'Hospitality',
        specializations: {
            'hotel-mgmt': {
                displayName: 'Hotel Management',
                careerPaths: ['Hotel GM', 'F&B Director', 'Luxury Concierge'],
                projects: { beginner: ['Guest Plan'], intermediate: ['Event Budget'], advanced: ['Property Setup'] },
                certifications: { free: ['Front Office'], pro: ['IHM Degree'], premium: ['Swiss Hotel Mgmt'] }
            }
        }
    },

    // 21. SPORTS
    sports: {
        displayName: 'Sports',
        specializations: {
            'sports-science': {
                displayName: 'Sports Science',
                careerPaths: ['Performance Analyst', 'Strength Coach', 'Sports Scientist'],
                projects: { beginner: ['Fitness Metrics'], intermediate: ['Injury Map'], advanced: ['Pro Team Stats'] },
                certifications: { free: ['Anatomy Basic'], pro: ['CSCS Cert'], premium: ['PHD Sports'] }
            }
        }
    },

    // 22. VOCATIONAL
    vocational: {
        displayName: 'Vocational',
        specializations: {
            'ev-tech': {
                displayName: 'EV Maintenance',
                careerPaths: ['EV Technician', 'Workshop owner', 'EV Fleet Repair'],
                projects: { beginner: ['Battery Check'], intermediate: ['Motor Repair'], advanced: ['EV Retrofit'] },
                certifications: { free: ['EV Safety'], pro: ['Skill India EV'], premium: ['Advanced EV Tech'] }
            }
        }
    }
};

module.exports = { COMPLETE_REAL_WORLD_DATA };
