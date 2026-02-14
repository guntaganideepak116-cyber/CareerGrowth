/**
 * COMPLETE REAL-WORLD DATA - ALL 22 FIELDS
 * Compact format with all user-provided data
 * Will be expanded by migration script
 */

const COMPLETE_REAL_WORLD_DATA = {

    engineering: {
        displayName: 'Engineering',
        specializations: {
            'full-stack-web-development': {
                displayName: 'Full Stack Web Development',
                careerPaths: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
                projects: {
                    beginner: ['Personal Portfolio Website', 'To-Do CRUD App', 'Blog with Admin Panel'],
                    intermediate: ['Full Stack E-commerce Platform', 'JWT Authentication System', 'Real-time Chat App', 'Admin + User Dashboard'],
                    advanced: ['SaaS Platform', 'Multi-role Enterprise Web App', 'AI-powered Web Application', 'Payment Integrated Subscription System']
                },
                certifications: {
                    free: ['freeCodeCamp Full Stack', 'NPTEL Web Programming', 'Infosys Springboard Web Dev'],
                    pro: ['Meta Frontend Developer (Coursera)', 'IBM Full Stack Developer'],
                    premium: ['AWS Developer Associate', 'Microsoft Azure Developer', 'Full Stack Bootcamp (Industry Certified)']
                }
            },
            'devops-site-reliability': {
                displayName: 'DevOps & Site Reliability',
                careerPaths: ['DevOps Engineer', 'SRE Engineer', 'Platform Engineer'],
                projects: {
                    beginner: ['CI/CD Setup', 'Dockerized App'],
                    intermediate: ['Kubernetes Cluster Setup', 'Infrastructure as Code'],
                    advanced: ['Enterprise DevOps Pipeline', 'Cloud-native Microservices Platform']
                },
                certifications: {
                    free: ['GitHub Actions Certification', 'Docker Fundamentals'],
                    pro: ['Docker Certified Associate', 'Kubernetes CKA'],
                    premium: ['AWS DevOps Engineer']
                }
            },
            'software-architecture': {
                displayName: 'Software Architecture',
                careerPaths: ['Enterprise Architect', 'Systems Designer', 'Solution Architect'],
                projects: {
                    beginner: ['System Design Mockups'],
                    intermediate: ['Microservices Design Document'],
                    advanced: ['Distributed System Prototype']
                },
                certifications: {
                    free: ['GCP Architecture Basics'],
                    pro: ['TOGAF Foundation'],
                    premium: ['Microsoft Certified: Azure Solutions Architect Expert']
                }
            }
        }
    },

    'ai-ml': {
        displayName: 'AI & Machine Learning',
        specializations: {
            'ai-deep-learning': {
                displayName: 'Deep Learning & Neural Networks',
                careerPaths: ['Deep Learning Engineer', 'Computer Vision Specialist', 'Research Scientist'],
                projects: {
                    beginner: ['Simple Neural Network', 'MNIST Classifier'],
                    intermediate: ['Object Detection System', 'Style Transfer App'],
                    advanced: ['Custom LLM Fine-tuning', 'Generative AI Platform']
                },
                certifications: {
                    free: ['Coursera Deep Learning Intro', 'Fast.ai Courses'],
                    pro: ['NVIDIA Deep Learning Institute'],
                    premium: ['Google Professional ML Engineer']
                }
            },
            'ai-nlp': {
                displayName: 'Natural Language Processing',
                careerPaths: ['NLP Engineer', 'Conversational AI Designer', 'Data Scientist (NLP)'],
                projects: {
                    beginner: ['Spam Detection', 'Sentiment Analysis'],
                    intermediate: ['Chatbot with Rasa/Dialogflow', 'Translation Tool'],
                    advanced: ['Custom GPT Model', 'Semantic Search Engine']
                },
                certifications: {
                    free: ['LangChain Documentation Guides', 'Hugging Face Course'],
                    pro: ['NLP Specialization (DeepLearning.AI)'],
                    premium: ['AWS Certified Machine Learning']
                }
            }
        }
    },

    'cloud-computing': {
        displayName: 'Cloud Computing',
        specializations: {
            'cloud-architecture': {
                displayName: 'Cloud Architecture',
                careerPaths: ['Cloud Architect', 'Solutions Architect', 'Cloud Infrastructure Lead'],
                projects: {
                    beginner: ['Static site on AWS S3', 'VPC Setup'],
                    intermediate: ['Multi-tier Architecture Deployment', 'Serverless API with Lambda'],
                    advanced: ['Global Cloud Infrastructure with Terraform']
                },
                certifications: {
                    free: ['AWS Cloud Practitioner Essentials'],
                    pro: ['AWS Certified Solutions Architect – Associate'],
                    premium: ['Google Professional Cloud Architect']
                }
            }
        }
    },

    'cybersecurity': {
        displayName: 'Cybersecurity',
        specializations: {
            'cyber-offensive': {
                displayName: 'Offensive Security & Pen Testing',
                careerPaths: ['Ethical Hacker', 'Penetration Tester', 'Red Team Specialist'],
                projects: {
                    beginner: ['Password Cracker Study', 'SQL Injection Lab'],
                    intermediate: ['Network Vulnerability Assessment', 'Metasploit Lab'],
                    advanced: ['Full-scale Enterprise Pen Test (Simulated)']
                },
                certifications: {
                    free: ['HTB Academy Intro', 'TryHackMe Paths'],
                    pro: ['CompTIA PenTest+', 'Certified Ethical Hacker'],
                    premium: ['OSCP (Offensive Security Certified Professional)']
                }
            }
        }
    },

    'blockchain-web3': {
        displayName: 'Blockchain & Web3',
        specializations: {
            'web3-smart-contracts': {
                displayName: 'Smart Contract Development',
                careerPaths: ['Smart Contract Engineer', 'Blockchain Developer', 'Web3 Architect'],
                projects: {
                    beginner: ['ERC20 Token', 'Simple NFT'],
                    intermediate: ['Voting DAO', 'DeFi Liquidity Pool'],
                    advanced: ['Flash Loan Bot', 'Cross-chain Bridge']
                },
                certifications: {
                    free: ['Alchemy University', 'CryptoZombies'],
                    pro: ['Certified Blockchain Developer'],
                    premium: ['ConsenSys Blockchain Developer']
                }
            }
        }
    },


    medical: {
        displayName: 'Medical & Health Sciences',
        specializations: {
            'hospital-administration': {
                displayName: 'Hospital Administration & Healthcare Management',
                careerPaths: ['Hospital Administrator', 'Healthcare Operations Manager', 'Medical Superintendent'],
                projects: {
                    beginner: ['Hospital Workflow Analysis', 'Patient Registration System'],
                    intermediate: ['Hospital Management System', 'Patient Data Analytics Dashboard'],
                    advanced: ['AI-based Hospital Resource Optimization', 'Enterprise Healthcare ERP System']
                },
                certifications: {
                    free: ['WHO Online Health Courses', 'Coursera Healthcare Management (Audit)'],
                    pro: ['PG Diploma in Hospital Administration', 'Healthcare Management Certification'],
                    premium: ['MBA in Healthcare Management', 'CPHQ']
                }
            },
            'clinical-research': {
                displayName: 'Clinical Research & Medical Research',
                careerPaths: ['Clinical Research Associate', 'Medical Research Analyst', 'Clinical Trial Coordinator'],
                projects: {
                    beginner: ['Literature Review on Medical Study'],
                    intermediate: ['Clinical Trial Data Analysis'],
                    advanced: ['Full Clinical Trial Management Simulation']
                },
                certifications: {
                    free: ['NIH Clinical Research Training'],
                    pro: ['Clinical Research Certification (CRS)'],
                    premium: ['Certified Clinical Research Professional (CCRP)']
                }
            },
            'public-health': {
                displayName: 'Public Health & Epidemiology',
                careerPaths: ['Public Health Officer', 'Epidemiologist', 'Health Policy Analyst'],
                projects: {
                    beginner: ['Community Health Survey'],
                    intermediate: ['Public Health Data Dashboard'],
                    advanced: ['National Health Strategy Plan']
                },
                certifications: {
                    free: ['WHO Public Health Courses'],
                    pro: ['PG Diploma in Public Health'],
                    premium: ['Master of Public Health (MPH)']
                }
            },
            'health-informatics': {
                displayName: 'Health Informatics & Medical Data Science',
                careerPaths: ['Health Informatics Specialist', 'Medical Data Analyst', 'Healthcare IT Consultant'],
                projects: {
                    beginner: ['Electronic Health Record (EHR) Mockup'],
                    intermediate: ['Healthcare Analytics Dashboard'],
                    advanced: ['AI-based Medical Diagnosis Assistant']
                },
                certifications: {
                    free: ['Google Health Data Intro'],
                    pro: ['Health Informatics Certification'],
                    premium: ['Certified Health Informatics Systems Professional (CHISP)']
                }
            },
            'microbiology': {
                displayName: 'Microbiology & Laboratory Sciences',
                careerPaths: ['Microbiologist', 'Lab Technologist', 'Pathology Technician'],
                projects: {
                    beginner: ['Bacterial Culture Analysis'],
                    intermediate: ['Microbial Growth Study'],
                    advanced: ['Infectious Disease Research Model']
                },
                certifications: {
                    free: ['WHO Microbiology Training'],
                    pro: ['Diploma in Medical Lab Technology'],
                    premium: ['Master\'s in Microbiology']
                }
            },
            'medical-coding': {
                displayName: 'Medical Coding & Health Insurance',
                careerPaths: ['Medical Coder', 'Health Insurance Analyst', 'Claims Processing Officer'],
                projects: {
                    beginner: ['ICD Coding Practice'],
                    intermediate: ['Insurance Claims Management System'],
                    advanced: ['Healthcare Billing Automation Platform']
                },
                certifications: {
                    free: ['AAPC Intro Course'],
                    pro: ['Certified Professional Coder (CPC)'],
                    premium: ['Certified Coding Specialist (CCS)']
                }
            },
            'allied-health': {
                displayName: 'Allied Health & Rehabilitation Sciences',
                careerPaths: ['Physiotherapist', 'Occupational Therapist', 'Rehabilitation Specialist'],
                projects: {
                    beginner: ['Patient Rehabilitation Plan'],
                    intermediate: ['Rehabilitation Tracking Dashboard'],
                    advanced: ['AI-based Therapy Monitoring System']
                },
                certifications: {
                    free: ['WHO Rehab Modules'],
                    pro: ['Diploma in Physiotherapy'],
                    premium: ['Master\'s in Rehabilitation Sciences']
                }
            },
            'pharmaceutical-sciences': {
                displayName: 'Pharmaceutical Sciences',
                careerPaths: ['Pharmacist', 'Drug Safety Officer', 'Pharma Production Manager'],
                projects: {
                    beginner: ['Drug Interaction Study'],
                    intermediate: ['Pharma Inventory Management'],
                    advanced: ['AI-based Drug Recommendation System']
                },
                certifications: {
                    free: ['Pharma Safety Basics'],
                    pro: ['Diploma in Pharmacy'],
                    premium: ['Doctor of Pharmacy (Pharm.D)']
                }
            },
            'medical-biotechnology': {
                displayName: 'Medical Biotechnology',
                careerPaths: ['Biotech Researcher', 'Genetic Analyst', 'Biomedical Scientist'],
                projects: {
                    beginner: ['DNA Analysis Simulation'],
                    intermediate: ['Genetic Disease Study'],
                    advanced: ['Gene Editing Research Model']
                },
                certifications: {
                    free: ['Biotech Fundamentals'],
                    pro: ['Biotechnology Certification'],
                    premium: ['Master\'s in Biotechnology']
                }
            },
            'nursing-clinical-practice': {
                displayName: 'Nursing & Clinical Practice',
                careerPaths: ['Registered Nurse', 'Clinical Nurse Specialist', 'Nurse Administrator'],
                projects: {
                    beginner: ['Patient Care Documentation'],
                    intermediate: ['Hospital Ward Management'],
                    advanced: ['Critical Care Monitoring System']
                },
                certifications: {
                    free: ['Basic Nursing Modules'],
                    pro: ['B.Sc Nursing'],
                    premium: ['M.Sc Nursing / Nurse Practitioner Certification']
                }
            }
        }
    },

    science: {
        displayName: 'Science & Research',
        specializations: {
            'physics-applied-physics': {
                displayName: 'Physics & Applied Physics',
                careerPaths: ['Research Physicist', 'Astrophysicist', 'Nuclear Scientist'],
                projects: {
                    beginner: ['Simple Physics Simulation', 'Optics Experiment Analysis'],
                    intermediate: ['Solar Energy Optimization Study', 'Magnetic Field Simulation Model'],
                    advanced: ['Quantum Mechanics Simulation', 'Satellite Orbit Calculation System']
                },
                certifications: {
                    free: ['NPTEL Physics Courses', 'MIT OpenCourseWare Physics'],
                    pro: ['Applied Physics Certification'],
                    premium: ['BARC / ISRO Scientific Training']
                }
            },
            'chemistry-chemical-sciences': {
                displayName: 'Chemistry & Chemical Sciences',
                careerPaths: ['Chemist', 'Chemical Analyst', 'Industrial Chemist'],
                projects: {
                    beginner: ['Chemical Reaction Analysis', 'Water Quality Testing'],
                    intermediate: ['Industrial Chemical Process Study', 'Polymer Analysis Project'],
                    advanced: ['Green Chemistry Research Model', 'Drug Synthesis Research']
                },
                certifications: {
                    free: ['NPTEL Chemistry', 'Coursera Chemical Safety'],
                    pro: ['Diploma in Industrial Chemistry'],
                    premium: ['Certified Chemical Safety Professional']
                }
            },
            'mathematics-statistics': {
                displayName: 'Mathematics & Statistics',
                careerPaths: ['Statistician', 'Actuary', 'Quantitative Analyst'],
                projects: {
                    beginner: ['Statistical Data Analysis', 'Probability Simulation'],
                    intermediate: ['Stock Market Risk Model', 'Predictive Statistical Model'],
                    advanced: ['Quantitative Trading Algorithm', 'Cryptographic System Model']
                },
                certifications: {
                    free: ['Khan Academy Advanced Math', 'NPTEL Statistics'],
                    pro: ['Actuarial Science Certification'],
                    premium: ['FRM (Financial Risk Manager)']
                }
            },
            'environmental-science-sustainability': {
                displayName: 'Environmental Science & Sustainability',
                careerPaths: ['Environmental Analyst', 'Climate Change Specialist', 'Sustainability Consultant'],
                projects: {
                    beginner: ['Air Quality Analysis', 'Water Pollution Study'],
                    intermediate: ['Climate Data Visualization', 'Waste Management System Design'],
                    advanced: ['Carbon Footprint Optimization Model', 'Renewable Energy Research Project']
                },
                certifications: {
                    free: ['UN Climate Courses', 'WHO Environmental Health'],
                    pro: ['Diploma in Environmental Science'],
                    premium: ['Certified Sustainability Professional']
                }
            },
            'biotechnology-life-sciences': {
                displayName: 'Biotechnology & Life Sciences',
                careerPaths: ['Biotechnology Researcher', 'Genetic Engineer', 'Biomedical Scientist'],
                projects: {
                    beginner: ['DNA Analysis Simulation', 'Basic Cell Study'],
                    intermediate: ['Genetic Mutation Study', 'Drug Effectiveness Analysis'],
                    advanced: ['Gene Editing Research (CRISPR Model)', 'Biomedical AI Integration']
                },
                certifications: {
                    free: ['Biotech Basics (Coursera Audit)'],
                    pro: ['Diploma in Biotechnology'],
                    premium: ['Advanced Genetic Engineering Certification']
                }
            },
            'astronomy-space-sciences': {
                displayName: 'Astronomy & Space Sciences',
                careerPaths: ['Astronomer', 'Astrophysicist', 'Space Research Scientist'],
                projects: {
                    beginner: ['Star Mapping Simulation', 'Solar System Model'],
                    intermediate: ['Satellite Orbit Tracking System', 'Astronomical Data Analysis'],
                    advanced: ['Deep Space Research Model', 'Asteroid Tracking AI System']
                },
                certifications: {
                    free: ['NASA Online Courses', 'ISRO MOOCs'],
                    pro: ['Space Science Certification'],
                    premium: ['ISRO Research Fellowship']
                }
            },
            'materials-science-nanotechnology': {
                displayName: 'Materials Science & Nanotechnology',
                careerPaths: ['Materials Scientist', 'Nanotechnology Engineer', 'Research Scientist'],
                projects: {
                    beginner: ['Material Strength Testing'],
                    intermediate: ['Nano-material Simulation', 'Smart Material Study'],
                    advanced: ['Nanotechnology Drug Delivery Model', 'Advanced Composite Material Research']
                },
                certifications: {
                    free: ['NPTEL Nanotechnology'],
                    pro: ['Diploma in Materials Science'],
                    premium: ['Advanced Research Fellowship']
                }
            },
            'forensic-science': {
                displayName: 'Forensic Science',
                careerPaths: ['Forensic Scientist', 'Crime Lab Analyst', 'Digital Forensic Specialist'],
                projects: {
                    beginner: ['Fingerprint Analysis Study'],
                    intermediate: ['Crime Scene Simulation'],
                    advanced: ['Digital Forensic Investigation System', 'Forensic Data Analysis Platform']
                },
                certifications: {
                    free: ['Intro to Forensic Science Courses'],
                    pro: ['Diploma in Forensic Science'],
                    premium: ['Certified Forensic Analyst']
                }
            },
            'research-development': {
                displayName: 'Research & Development (General)',
                careerPaths: ['Research Scientist', 'R&D Engineer', 'Innovation Specialist'],
                projects: {
                    beginner: ['Literature Review Research'],
                    intermediate: ['Prototype Research Model'],
                    advanced: ['Full Research Publication', 'Patent Filing Simulation']
                },
                certifications: {
                    free: ['Research Methodology Course'],
                    pro: ['Diploma in Research Methods'],
                    premium: ['Research Fellowship']
                }
            }
        }
    },

    arts: {
        displayName: 'Arts, Humanities & Degree',
        specializations: {
            'english-literature-communication': {
                displayName: 'English Literature & Communication',
                careerPaths: ['Content Writer', 'Copywriter', 'Technical Writer'],
                projects: {
                    beginner: ['Blog Writing Portfolio', 'Article Compilation Website'],
                    intermediate: ['SEO Content Strategy', 'Technical Documentation Project'],
                    advanced: ['Publishing Platform Development', 'Corporate Branding Content Strategy']
                },
                certifications: {
                    free: ['Google Digital Writing Basics', 'HubSpot Content Marketing'],
                    pro: ['Technical Writing Certification'],
                    premium: ['PG Diploma in Journalism']
                }
            },
            'psychology': {
                displayName: 'Psychology',
                careerPaths: ['Clinical Psychologist', 'Counselor', 'Behavior Analyst'],
                projects: {
                    beginner: ['Basic Behavioral Survey', 'Stress Analysis Study'],
                    intermediate: ['Mental Health Awareness Campaign', 'Psychological Assessment Tool'],
                    advanced: ['AI-based Mental Health Chatbot', 'Clinical Case Study Research']
                },
                certifications: {
                    free: ['WHO Mental Health Courses'],
                    pro: ['Diploma in Counseling Psychology'],
                    premium: ['Licensed Clinical Psychologist Certification']
                }
            },
            'political-science-public-administration': {
                displayName: 'Political Science & Public Administration',
                careerPaths: ['Civil Services Officer', 'Policy Analyst', 'Public Administrator'],
                projects: {
                    beginner: ['Public Policy Review'],
                    intermediate: ['Government Scheme Analysis'],
                    advanced: ['Policy Impact Research', 'Administrative Reform Proposal']
                },
                certifications: {
                    free: ['UN Public Policy Courses'],
                    pro: ['Diploma in Public Administration'],
                    premium: ['MPA (Master of Public Administration)']
                }
            },
            'history-archaeology': {
                displayName: 'History & Archaeology',
                careerPaths: ['Historian', 'Archivist', 'Archaeologist'],
                projects: {
                    beginner: ['Historical Documentation'],
                    intermediate: ['Heritage Conservation Study'],
                    advanced: ['Archaeological Survey Project']
                },
                certifications: {
                    free: ['UNESCO Heritage Courses'],
                    pro: ['Diploma in Archaeology'],
                    premium: ['PhD in Archaeology']
                }
            },
            'sociology-social-work': {
                displayName: 'Sociology & Social Work',
                careerPaths: ['Social Worker', 'NGO Coordinator', 'Community Development Officer'],
                projects: {
                    beginner: ['Community Survey'],
                    intermediate: ['Social Impact Study'],
                    advanced: ['NGO Project Planning Model']
                },
                certifications: {
                    free: ['UN Social Development Courses'],
                    pro: ['Diploma in Social Work'],
                    premium: ['MSW (Master of Social Work)']
                }
            },
            'economics': {
                displayName: 'Economics',
                careerPaths: ['Economist', 'Financial Analyst', 'Policy Advisor'],
                projects: {
                    beginner: ['Economic Data Analysis'],
                    intermediate: ['Market Trend Analysis'],
                    advanced: ['Macroeconomic Research Model']
                },
                certifications: {
                    free: ['World Bank Economic Courses'],
                    pro: ['Financial Modeling Certification'],
                    premium: ['CFA (Chartered Financial Analyst)']
                }
            },
            'fine-arts-performing-arts': {
                displayName: 'Fine Arts & Performing Arts',
                careerPaths: ['Graphic Artist', 'Fine Artist', 'Art Director'],
                projects: {
                    beginner: ['Art Portfolio'],
                    intermediate: ['Short Film / Animation'],
                    advanced: ['Creative Studio Startup Model']
                },
                certifications: {
                    free: ['Canva Design Courses'],
                    pro: ['Diploma in Fine Arts'],
                    premium: ['Bachelor / Master of Fine Arts']
                }
            },
            'media-mass-communication': {
                displayName: 'Media & Mass Communication',
                careerPaths: ['Journalist', 'News Anchor', 'Media Planner'],
                projects: {
                    beginner: ['News Blog'],
                    intermediate: ['YouTube Channel Strategy'],
                    advanced: ['Digital Media Agency Model']
                },
                certifications: {
                    free: ['Google Digital Marketing'],
                    pro: ['Diploma in Mass Communication'],
                    premium: ['Master\'s in Media Studies']
                }
            },
            'general-degree': {
                displayName: 'General Degree (B.A / B.Sc / B.Com)',
                careerPaths: ['Government Officer', 'Banking Professional', 'Teacher'],
                projects: {
                    beginner: ['Academic Research'],
                    intermediate: ['Competitive Exam Preparation Plan'],
                    advanced: ['Startup Business Plan']
                },
                certifications: {
                    free: ['NPTEL Courses'],
                    pro: ['UGC NET Preparation Programs'],
                    premium: ['MBA / M.A / M.Sc Advanced Degrees']
                }
            }
        }
    },

    commerce: {
        displayName: 'Commerce & Business',
        specializations: {
            'accounting-finance': {
                displayName: 'Accounting & Professional Finance',
                careerPaths: ['Accountant', 'Auditor', 'Tax Consultant'],
                projects: {
                    beginner: ['Balance Sheet Preparation', 'Personal Income Tax Filing Analysis'],
                    intermediate: ['Corporate Audit Simulation', 'Financial Statement Analysis Platform'],
                    advanced: ['M&A Financial Model', 'International Taxation Strategy Model']
                },
                certifications: {
                    free: ['QuickBooks Basics', 'Accountant Fundamentals (Audit)'],
                    pro: ['Tally Prime Certification'],
                    premium: ['CA / ACCA / CPA Programs']
                }
            },
            'business-administration-management': {
                displayName: 'Business Administration & Management',
                careerPaths: ['Operations Manager', 'Business Development Manager', 'Strategy Consultant'],
                projects: {
                    beginner: ['Business Strategy Case Study'],
                    intermediate: ['Operations Optimization Plan'],
                    advanced: ['Entrepreneurial Venture Pitch Deck', 'Enterprise Resource Planning Architecture']
                },
                certifications: {
                    free: ['Google Management Basics'],
                    pro: ['PMP Certification'],
                    premium: ['MBA / PGDM Programs']
                }
            },
            'marketing-branding': {
                displayName: 'Marketing & Brand Management',
                careerPaths: ['Marketing Manager', 'Digital Marketer', 'Brand Strategist'],
                projects: {
                    beginner: ['Social Media Content Plan'],
                    intermediate: ['Digital Marketing Campaign Analytics'],
                    advanced: ['Global Brand Identity Project', 'AI-driven Marketing Automation Platform']
                },
                certifications: {
                    free: ['HubSpot Digital Marketing'],
                    pro: ['Google Ads Professional'],
                    premium: ['Advanced Marketing Specialization']
                }
            },
            'banking-financial-services': {
                displayName: 'Banking & Financial Services',
                careerPaths: ['Bank Manager', 'Relationship Manager', 'Mortgage Advisor'],
                projects: {
                    beginner: ['Banking Product Portfolio Review'],
                    intermediate: ['Loan Risk Assessment Analysis'],
                    advanced: ['Digital Banking App Strategy', 'FinTech Integration Model']
                },
                certifications: {
                    free: ['Intro to Banking (CFI free courses)'],
                    pro: ['Investment Banking Certification'],
                    premium: ['JAIIB / CAIIB (Banking) Certifications']
                }
            },
            'international-business-trade': {
                displayName: 'International Business & Global Trade',
                careerPaths: ['Export Manager', 'Trade Consultant', 'L/C Specialist'],
                projects: {
                    beginner: ['Import-Export Documentation Study'],
                    intermediate: ['Global Market Entry Strategy'],
                    advanced: ['Cross-border Supply Chain Model', 'International Trade Policy Analysis']
                },
                certifications: {
                    free: ['WTO Trade Courses'],
                    pro: ['EXIM Certification'],
                    premium: ['International Business Management Diploma']
                }
            },
            'human-resource-management': {
                displayName: 'Human Resource Management (HRM)',
                careerPaths: ['HR Manager', 'Talent Acquisition Specialist', 'L&D Specialist'],
                projects: {
                    beginner: ['Recruitment Workflow Design'],
                    intermediate: ['Employee Training Manual'],
                    advanced: ['HR Analytics Dashboard', 'Corporate Culture Transformation Plan']
                },
                certifications: {
                    free: ['LinkedIn HR Learning Path (Free month)'],
                    pro: ['SHRM-CP Certification'],
                    premium: ['SAP SuccessFactors / Workday Certification']
                }
            },
            'entrepreneurship-innovation': {
                displayName: 'Entrepreneurship & Startup Innovation',
                careerPaths: ['Startup Founder', 'Innovation Consultant', 'Business Incubator Manager'],
                projects: {
                    beginner: ['Lean Canvas Business Model'],
                    intermediate: ['MVP Prototype Development Plan'],
                    advanced: ['VC Funding Strategy Project', 'Scalability Roadmap for Startups']
                },
                certifications: {
                    free: ['Y Combinator Startup School'],
                    pro: ['Innovation Management Certification'],
                    premium: ['Angel Investor / VC Training']
                }
            },
            'supply-chain-logistics': {
                displayName: 'Supply Chain & Logistics Management',
                careerPaths: ['Supply Chain Manager', 'Logistics Analyst', 'Procurement Specialist'],
                projects: {
                    beginner: ['Inventory Management Study'],
                    intermediate: ['Logistics Route Optimization'],
                    advanced: ['Global SCM AI Platform', 'Blockchain in Supply Chain Project']
                },
                certifications: {
                    free: ['Intro to SCM (Coursera Audit)'],
                    pro: ['Six Sigma Green Belt'],
                    premium: ['CSCP (Certified Supply Chain Professional)']
                }
            },
            'business-analytics-intelligence': {
                displayName: 'Business Analytics & BI',
                careerPaths: ['Business Analyst', 'BI Developer', 'Data Insights Consultant'],
                projects: {
                    beginner: ['Data Visualization in Excel'],
                    intermediate: ['Tableau Dashboard for Sales'],
                    advanced: ['Predictive Sales AI Model', 'Real-time BI Infrastructure']
                },
                certifications: {
                    free: ['Power BI Fundamentals'],
                    pro: ['Tableau Desktop Specialist'],
                    premium: ['Advanced Business Analytics Certification']
                }
            }
        }
    },

    law: {
        displayName: 'Law & Legal Studies',
        specializations: {
            'corporate-law': {
                displayName: 'Corporate Law',
                careerPaths: ['Corporate Lawyer', 'In-house Counsel', 'Legal Researcher'],
                projects: {
                    beginner: ['Contract Drafting Exercise'],
                    intermediate: ['M&A Legal Compliance Review'],
                    advanced: ['Corporate Governance Framework Design']
                },
                certifications: {
                    free: ['Intro to Business Law Courses'],
                    pro: ['Diploma in Corporate Law'],
                    premium: ['CS (Company Secretary) / LLM Corporate Law']
                }
            },
            'criminal-law': {
                displayName: 'Criminal Law & Justice',
                careerPaths: ['Criminal Defense Lawyer', 'Public Prosecutor', 'Case Analyst'],
                projects: {
                    beginner: ['Case Law Summary Analysis'],
                    intermediate: ['Criminal Procedure Simulation'],
                    advanced: ['Legal Aid Platform Design', 'Justice System Reform Research']
                },
                certifications: {
                    free: ['Criminal Justice Basics'],
                    pro: ['Psychology & Law Certification'],
                    premium: ['Advanced Criminal Litigation Diploma']
                }
            },
            'cyber-law': {
                displayName: 'Cyber Law & Digital Compliance',
                careerPaths: ['Cyber Lawyer', 'Data Privacy Officer', 'Compliance Specialist'],
                projects: {
                    beginner: ['Privacy Policy Audit'],
                    intermediate: ['Cyber Crime Case Study'],
                    advanced: ['GDPR/DPDP Compliance Framework']
                },
                certifications: {
                    free: ['Google Cybersecurity & Law Concepts'],
                    pro: ['CIPP (Certified Information Privacy Professional)'],
                    premium: ['Diploma in Cyber Law']
                }
            },
            'ipr-law': {
                displayName: 'Intellectual Property Rights (IPR)',
                careerPaths: ['Patent Attorney', 'IP Consultant', 'Trademark Specialist'],
                projects: {
                    beginner: ['Trademark Search Exercise'],
                    intermediate: ['Patent Drafting Simulation'],
                    advanced: ['Global IP Strategy for Startups']
                },
                certifications: {
                    free: ['WIPO Online Courses'],
                    pro: ['Patent Agent Certification'],
                    premium: ['Specialization in IP Law']
                }
            },
            'civil-law': {
                displayName: 'Civil Law & Litigation',
                careerPaths: ['Civil Lawyer', 'Property Consultant', 'Mediator'],
                projects: {
                    beginner: ['Legal Documentation Basis'],
                    intermediate: ['Civil Case Strategy Study'],
                    advanced: ['Mediator Simulation Platform']
                },
                certifications: {
                    free: ['Intro to Mediation'],
                    pro: ['Diploma in Civil Law'],
                    premium: ['Advanced Litigation Specialization']
                }
            },
            'constitutional-law': {
                displayName: 'Constitutional Law',
                careerPaths: ['Constitutional Expert', 'Policy Researcher', 'Public Interest Lawyer'],
                projects: {
                    beginner: ['Constitutional Article Review'],
                    intermediate: ['PIL (Public Interest Litigation) Draft'],
                    advanced: ['Constitutional Reform Research Paper']
                },
                certifications: {
                    free: ['Coursera Constitutional Law (Audit)'],
                    pro: ['Diploma in Constitutional Law'],
                    premium: ['Higher Research in Law']
                }
            }
        }
    },

    education: {
        displayName: 'Education & Teaching',
        specializations: {
            'school-education': {
                displayName: 'School Education & K-12 Teaching',
                careerPaths: ['School Teacher', 'Academic Coordinator', 'Principal'],
                projects: {
                    beginner: ['Teaching Lesson Plan Design'],
                    intermediate: ['Student Performance Analytics'],
                    advanced: ['School Management System Design']
                },
                certifications: {
                    free: ['Microsoft Educator Community Courses'],
                    pro: ['B.Ed (Bachelor of Education)'],
                    premium: ['M.Ed / School Leadership Certification']
                }
            },
            'higher-education': {
                displayName: 'Higher Education & Academia',
                careerPaths: ['University Professor', 'Researcher', 'Dean of Academics'],
                projects: {
                    beginner: ['Academic Curriculum Review'],
                    intermediate: ['Research Methodology Plan'],
                    advanced: ['Grant Proposal for Academic Research']
                },
                certifications: {
                    free: ['NPTEL Higher Education Courses'],
                    pro: ['PhD Research Training'],
                    premium: ['UGC-NET / SLET Certification']
                }
            },
            'online-elearning': {
                displayName: 'Online Learning & EdTech',
                careerPaths: ['E-learning Content Developer', 'EdTech Specialist', 'Digital Teacher'],
                projects: {
                    beginner: ['Educational Video Module'],
                    intermediate: ['Interactive Quiz Application'],
                    advanced: ['EdTech Platform SaaS Blueprint']
                },
                certifications: {
                    free: ['Google Digital Classroom Training'],
                    pro: ['Instructional Design Certification'],
                    premium: ['Digital Learning Professional Certification']
                }
            },
            'special-education-inclusion': {
                displayName: 'Special Education & Inclusion',
                careerPaths: ['Special Educator', 'Inclusion Specialist', 'Speech Therapist'],
                projects: {
                    beginner: ['Individualized Education Program (IEP) Mockup'],
                    intermediate: ['Accessibility Audit of Classroom'],
                    advanced: ['Special Needs Learning App Design']
                },
                certifications: {
                    free: ['UNICEF Inclusive Education'],
                    pro: ['Diploma in Special Education'],
                    premium: ['Master\'s in Special Education']
                }
            },
            'educational-psychology-counseling': {
                displayName: 'Educational Psychology & Counseling',
                careerPaths: ['School Counselor', 'Educational Consultant', 'Behavior Analyst'],
                projects: {
                    beginner: ['Student Stress Survey'],
                    intermediate: ['Career Counseling Platform Mockup'],
                    advanced: ['Psychological Intervention Model for Schools']
                },
                certifications: {
                    free: ['Intro to Psychology Courses'],
                    pro: ['Diploma in Counseling Psychology'],
                    premium: ['Certification in Educational Psychology']
                }
            },
            'educational-administration-leadership': {
                displayName: 'Educational Administration & Leadership',
                careerPaths: ['School Administrator', 'Academic Registrar', 'Institutional Manager'],
                projects: {
                    beginner: ['School Policy Review'],
                    intermediate: ['Academic Calendar Optimization'],
                    advanced: ['Institutional Strategic Plan']
                },
                certifications: {
                    free: ['Leadership in Education (Coursera Audit)'],
                    pro: ['Diploma in Educational Management'],
                    premium: ['MBA / M.Ed in Educational Leadership']
                }
            },
            'skill-development-vocational-training': {
                displayName: 'Skill Development & Vocational Training',
                careerPaths: ['Vocational Trainer', 'Skill Development Officer', 'Workshop Facilitator'],
                projects: {
                    beginner: ['Skill-based Training Module Design'],
                    intermediate: ['Vocational Center Operational Plan'],
                    advanced: ['National Skill Development Strategy Proposal']
                },
                certifications: {
                    free: ['NSDC Trainer Basics'],
                    pro: ['TDP (Training Development Professional)'],
                    premium: ['Advanced Vocational Management Certification']
                }
            },
            'competitive-exam-mentorship': {
                displayName: 'Competitive Exam Mentorship & Coaching',
                careerPaths: ['Competitive Exam Mentor', 'Subject Matter Expert', 'Content Strategist'],
                projects: {
                    beginner: ['Competitive Exam Strategy Guide'],
                    intermediate: ['Test Series Content Design'],
                    advanced: ['Online Coaching Platform Architecture']
                },
                certifications: {
                    free: ['Mentorship Programs (Open Source)'],
                    pro: ['Subject Mastery Certifications'],
                    premium: ['EdTech Entrepreneurship Masterclass']
                }
            }
        }
    },

    design: {
        displayName: 'Design & Creative Arts',
        specializations: {
            'graphic-design-branding': {
                displayName: 'Graphic Design & Branding',
                careerPaths: ['Graphic Designer', 'Brand Identity Designer', 'Illustrator'],
                projects: {
                    beginner: ['Logo Design for Startup'],
                    intermediate: ['Full Brand Style Guide'],
                    advanced: ['Global Branding Campaign Portfolio']
                },
                certifications: {
                    free: ['Canva Design School'],
                    pro: ['Adobe Certified Professional (Illustrator)'],
                    premium: ['Master\'s in Graphic Design']
                }
            },
            'interior-design-architecture': {
                displayName: 'Interior Design & Space Planning',
                careerPaths: ['Interior Designer', 'Space Planner', 'Lighting Designer'],
                projects: {
                    beginner: ['Room Layout Design'],
                    intermediate: ['Smart Home Interior 3D Model'],
                    advanced: ['Commercial Office Complex Interior Design']
                },
                certifications: {
                    free: ['Intro to Interior Design'],
                    pro: ['AutoCAD for Interior Design'],
                    premium: ['B.Des (Interior Design)']
                }
            },
            'fashion-design-merchandising': {
                displayName: 'Fashion Design & Merchandising',
                careerPaths: ['Fashion Designer', 'Fashion Merchandiser', 'Stylist'],
                projects: {
                    beginner: ['Apparel Sketch Collection'],
                    intermediate: ['Sustainable Fashion Line Prototype'],
                    advanced: ['Fashion Show Curation Portfolio']
                },
                certifications: {
                    free: ['Fashion Basics Online'],
                    pro: ['Diploma in Fashion Design'],
                    premium: ['NIFT / NID Fashion Programs']
                }
            },
            'product-industrial-design': {
                displayName: 'Product & Industrial Design',
                careerPaths: ['Product Designer', 'Industrial Designer', 'CAD Specialist'],
                projects: {
                    beginner: ['Basic Product Prototype'],
                    intermediate: ['Ergonomic Household Appliance Design'],
                    advanced: ['Industrial Machinery Design with CAD']
                },
                certifications: {
                    free: ['SolidWorks Basics'],
                    pro: ['Professional CAD Certification'],
                    premium: ['Bachelor / Master in Industrial Design']
                }
            },
            'animation-vfx': {
                displayName: 'Animation & VFX',
                careerPaths: ['3D Animator', 'VFX Artist', 'Storyboard Artist'],
                projects: {
                    beginner: ['2D Character Animation'],
                    intermediate: ['3D Short Film with VFX'],
                    advanced: ['Cinematic Animation Portfolio']
                },
                certifications: {
                    free: ['Blender Fundamentals'],
                    pro: ['Autodesk Maya Professional Certification'],
                    premium: ['Advanced VFX Program Certification']
                }
            },
            'game-art-design': {
                displayName: 'Game Art & Interaction Design',
                careerPaths: ['Game Artist', 'Level Designer', 'Concept Artist'],
                projects: {
                    beginner: ['Game Asset 3D Model'],
                    intermediate: ['Full Game Level Design'],
                    advanced: ['AAA Game Art Portfolio']
                },
                certifications: {
                    free: ['Unity Game Art Basics'],
                    pro: ['Unreal Engine Artist Certification'],
                    premium: ['Professional Game Design Degree']
                }
            }
        }
    },

    defense: {
        displayName: 'Defense & Security',
        specializations: {
            'armed-forces-officer': {
                displayName: 'Armed Forces Officer (Army/Navy/Air Force)',
                careerPaths: ['Commissioned Officer', 'Branch Specialist', 'Strategic Tactical Leader'],
                projects: {
                    beginner: ['Leadership & Fitness Training Journal'],
                    intermediate: ['Tactical Strategy Simulation Study'],
                    advanced: ['Military Operations Management Model']
                },
                certifications: {
                    free: ['NCC Training Programs'],
                    pro: ['SSB Preparation Training'],
                    premium: ['NDA / IMA / OTA Training']
                }
            },
            'paramilitary-forces': {
                displayName: 'Paramilitary & Central Armed Police Forces',
                careerPaths: ['CAPF Assistant Commandant', 'Sub-Inspector', 'Special Force Operative'],
                projects: {
                    beginner: ['Internal Security Awareness Study'],
                    intermediate: ['Border Management Strategy Research'],
                    advanced: ['Law Enforcement Operations Plan']
                },
                certifications: {
                    free: ['Civil Defense Basics'],
                    pro: ['Security Management Certification'],
                    premium: ['Advanced Tactical Force Training']
                }
            },
            'intelligence-national-security': {
                displayName: 'Intelligence & National Security',
                careerPaths: ['Intelligence Analyst', 'Security Researcher', 'Field Investigator'],
                projects: {
                    beginner: ['Open Source Intelligence Research'],
                    intermediate: ['Threat Assessment Report for Region'],
                    advanced: ['Strategic National Security Plan Simulation']
                },
                certifications: {
                    free: ['Intro to OSINT'],
                    pro: ['Security Analyst Certification'],
                    premium: ['Postgraduate in National Security Studies']
                }
            },
            'defense-technology-cyber-defense': {
                displayName: 'Defense Technology & Cyber Defense',
                careerPaths: ['Cyber Defense Specialist', 'Military Tech Analyst', 'Aerospace Engineer'],
                projects: {
                    beginner: ['Network Security Basis for Defense'],
                    intermediate: ['Anti-Drone System Concept'],
                    advanced: ['Military Crypto-communication System Design']
                },
                certifications: {
                    free: ['Cyber Defense Fundamentals (Coursera)'],
                    pro: ['Certified Ethical Hacker (Defense context)'],
                    premium: ['M.Tech in Defense Technology']
                }
            }
        }
    },

    agriculture: {
        displayName: 'Agriculture & Environment',
        specializations: {
            'agronomy-sustainable-farming': {
                displayName: 'Agronomy & Sustainable Farming',
                careerPaths: ['Agronomist', 'Farm Manager', 'Agricultural Consultant'],
                projects: {
                    beginner: ['Crop Rotation Plan for Local Farm'],
                    intermediate: ['Organic Fertilizer Efficacy Study'],
                    advanced: ['Precision Agriculture Automation System']
                },
                certifications: {
                    free: ['FAO Sustainable Farming Courses'],
                    pro: ['Diploma in Agriculture'],
                    premium: ['B.Sc / M.Sc Agriculture']
                }
            },
            'horticulture-landscape-design': {
                displayName: 'Horticulture & Landscape Design',
                careerPaths: ['Horticulturist', 'Landscape Architect', 'Plant Breeder'],
                projects: {
                    beginner: ['Home Garden Management Plan'],
                    intermediate: ['Hydroponic System Design'],
                    advanced: ['Commercial Greenhouse Operation Strategy']
                },
                certifications: {
                    free: ['NPTEL Horticulture'],
                    pro: ['Diploma in Horticulture'],
                    premium: ['Advanced Landscaping Certification']
                }
            },
            'animal-husbandry-livestock': {
                displayName: 'Animal Husbandry & Livestock Management',
                careerPaths: ['Livestock Manager', 'Dairy Professional', 'Animal Scientist'],
                projects: {
                    beginner: ['Livestock Health Tracking Mockup'],
                    intermediate: ['Dairy Farm Efficiency Study'],
                    advanced: ['Automated Livestock Monitoring System']
                },
                certifications: {
                    free: ['Animal Science Basics'],
                    pro: ['Veterinary Assistant Certification'],
                    premium: ['Master\'s in Animal Husbandry']
                }
            },
            'agtech-drone-automation': {
                displayName: 'Agricultural Technology & Automation',
                careerPaths: ['Ag-Drone Pilot', 'Agriculture Automation Engineer', 'AgTech Consultant'],
                projects: {
                    beginner: ['Drone Mapping Simulation for Crops'],
                    intermediate: ['Smart Irrigation System using IoT'],
                    advanced: ['Full Ag-Robot Prototype Design']
                },
                certifications: {
                    free: ['Intro to AgTech (Coursera)'],
                    pro: ['Drone Pilot Certification (DGCA/Equivalent)'],
                    premium: ['Advanced Ag-Automation Degree']
                }
            }
        }
    },

    sports: {

        displayName: 'Sports & Fitness',
        specializations: {
            'professional-athlete': {
                displayName: 'Professional Athlete & Player',
                careerPaths: ['Professional Player', 'Athelete', 'Sports Team Member'],
                projects: {
                    beginner: ['Performance Tracking Log'],
                    intermediate: ['Participation in State/National Level'],
                    advanced: ['Professional Sports Career Portfolio']
                },
                certifications: {
                    free: ['Anti-Doping Awareness (WADA)'],
                    pro: ['State Level Representation'],
                    premium: ['National/International Training Academy']
                }
            },
            'sports-coaching-fitness': {
                displayName: 'Sports Coaching & Physical Education',
                careerPaths: ['Sports Coach', 'Fitness Trainer', 'P.E. Teacher'],
                projects: {
                    beginner: ['Exercise Routine Design'],
                    intermediate: ['Full Sports Training Module'],
                    advanced: ['High-Performance Athletic Camp Design']
                },
                certifications: {
                    free: ['WHO Physical Activity Courses'],
                    pro: ['NSDC Certified Fitness Trainer'],
                    premium: ['Diploma in Sports Coaching (NIS)']
                }
            },
            'sports-management': {
                displayName: 'Sports Management & Administration',
                careerPaths: ['Sports Manager', 'Sports Agent', 'Event Coordinator'],
                projects: {
                    beginner: ['Sports Event Plan'],
                    intermediate: ['Sports Marketing Strategy'],
                    advanced: ['Global Sports League Architecture']
                },
                certifications: {
                    free: ['Intro to Sports Management'],
                    pro: ['Diploma in Sports Management'],
                    premium: ['MBA / M.Sc in Sports Management']
                }
            },
            'sports-medicine-physiotherapy': {
                displayName: 'Sports Medicine & Physiotherapy',
                careerPaths: ['Sports Physiotherapist', 'Nutritionist', 'Sports Doctor'],
                projects: {
                    beginner: ['Basic Injury Recovery Guide'],
                    intermediate: ['Sports Nutrition Plan for Athletes'],
                    advanced: ['Rehabilitation Program for Pro Teams']
                },
                certifications: {
                    free: ['Sports Injury First Aid'],
                    pro: ['B.PT (Bachelor of Physiotherapy)'],
                    premium: ['MPT Sports Certification']
                }
            }
        }
    },

    hospitality: {
        displayName: 'Hospitality & Tourism',
        specializations: {
            'hotel-management': {
                displayName: 'Hotel Management & Operations',
                careerPaths: ['Hotel Manager', 'F&B Manager', 'Front Office Executive'],
                projects: {
                    beginner: ['Guest Service Standard Plan'],
                    intermediate: ['Hotel Operations Audit Simulation'],
                    advanced: ['Full Resort Management Blueprint']
                },
                certifications: {
                    free: ['Hospitality Fundamentals (Coursera)'],
                    pro: ['IHM (Hotel Management) Diploma'],
                    premium: ['B.HM (Bachelor of Hotel Management)']
                }
            },
            'tourism-travel-management': {
                displayName: 'Tourism & Travel Management',
                careerPaths: ['Travel Consultant', 'Tour Operator', 'Travel Blogger'],
                projects: {
                    beginner: ['Tourism Itinerary for Local City'],
                    intermediate: ['Cross-border Travel Package Design'],
                    advanced: ['Global Tourism Platform Model']
                },
                certifications: {
                    free: ['IATA Travel Concepts (Free modules)'],
                    pro: ['IATA Foundation Certification'],
                    premium: ['MBA in Tourism Management']
                }
            },
            'culinary-arts-gastronomy': {
                displayName: 'Culinary Arts & Gastronomy',
                careerPaths: ['Executive Chef', 'Pastry Chef', 'Food Stylist'],
                projects: {
                    beginner: ['Menu Concept Design'],
                    intermediate: ['Signature Dish Development Portfolio'],
                    advanced: ['Commercial Restaurant Kitchen Blueprint']
                },
                certifications: {
                    free: ['Food Safety & Hygiene Courses'],
                    pro: ['Diploma in Culinary Arts'],
                    premium: ['WACS (World Association of Chefs) Certification']
                }
            },
            'event-management': {
                displayName: 'Event & Wedding Planning',
                careerPaths: ['Event Planner', 'Wedding Planner', 'Corporate Event Manager'],
                projects: {
                    beginner: ['Small Event Budgeting'],
                    intermediate: ['Large Scale Corporate Event Plan'],
                    advanced: ['Destination Wedding Planning Model']
                },
                certifications: {
                    free: ['Event Planning Basics'],
                    pro: ['Diploma in Event Management'],
                    premium: ['Certified Event Professional Certification']
                }
            }
        }
    },

    media: {
        displayName: 'Media & Entertainment',
        specializations: {
            'journalism-mass-communication': {
                displayName: 'Journalism & Mass Communication',
                careerPaths: ['Reporter', 'News Anchor', 'Editor'],
                projects: {
                    beginner: ['News Report Portfolio'],
                    intermediate: ['Investigative Journalism Piece'],
                    advanced: ['Full Digital News Media Prototype']
                },
                certifications: {
                    free: ['Google News Initiative Training'],
                    pro: ['Diploma in Journalism'],
                    premium: ['Master\'s in Mass Communication']
                }
            },
            'digital-media-content-creation': {
                displayName: 'Digital Media & Content Creation',
                careerPaths: ['YouTuber/Vlogger', 'Podcast Host', 'Social Media Manager'],
                projects: {
                    beginner: ['YouTube Channel Content Plan'],
                    intermediate: ['Podcast Series Development'],
                    advanced: ['Digital Media Agency Architecture']
                },
                certifications: {
                    free: ['YouTube Creator Academy'],
                    pro: ['Meta Social Media Manager Professional'],
                    premium: ['Advanced Digital Media Specialization']
                }
            },
            'film-video-production': {
                displayName: 'Film & Video Production',
                careerPaths: ['Film Director', 'Cinematographer', 'Video Editor'],
                projects: {
                    beginner: ['Short Film Script & Shoot'],
                    intermediate: ['Music Video Production'],
                    advanced: ['Full Feature/Documentary Portfolio']
                },
                certifications: {
                    free: ['Intro to Film Making (Coursera)'],
                    pro: ['Diploma in Cinematography'],
                    premium: ['FTII / Film School Graduation']
                }
            },
            'pr-advertising': {
                displayName: 'PR & Advertising',
                careerPaths: ['PR Manager', 'Advertising Strategist', 'Copywriter'],
                projects: {
                    beginner: ['Ad Campaign Mockup'],
                    intermediate: ['PR Crisis Management Plan'],
                    advanced: ['Global Integrated Marketing Campaign']
                },
                certifications: {
                    free: ['HubSpot Advertising Courses'],
                    pro: ['Pragmatic Institute Marketing Cert'],
                    premium: ['Master\'s in Advertising/PR']
                }
            }
        }
    },

    vocational: {
        displayName: 'Vocational & Professional Skills',
        specializations: {
            'digital-transformation-it-skills': {
                displayName: 'Digital Transformation & IT Skills',
                careerPaths: ['Digital Transformation Consultant', 'IT Trainer', 'Help Desk Manager'],
                projects: {
                    beginner: ['Basic IT Support Guide'],
                    intermediate: ['Small Business Digitalization Plan'],
                    advanced: ['Enterprise IT Infrastructure Design']
                },
                certifications: {
                    free: ['Google IT Support Professional (Audit)'],
                    pro: ['CompTIA A+ Certification'],
                    premium: ['CDX (Certified Digital Transformation Expert)']
                }
            },
            'trading-financial-markets': {
                displayName: 'Trading & Financial Markets',
                careerPaths: ['Stock Trader', 'Financial Analyst', 'Portfolio Manager'],
                projects: {
                    beginner: ['Paper Trading Performance Log'],
                    intermediate: ['Technical Analysis Model'],
                    advanced: ['Algorithmic Trading System Design']
                },
                certifications: {
                    free: ['NSE / BSE Free Online Modules'],
                    pro: ['NISM Series Certifications'],
                    premium: ['CFA / CMT Professional Certification']
                }
            }
        }
    },

    'civil-services': {
        displayName: 'Civil Services & Government',
        specializations: {
            'civil-admin': {
                displayName: 'Civil & Administrative Services (IAS/State Services)',
                careerPaths: ['IAS Officer', 'State Civil Services Officer', 'Policy Advisor'],
                projects: {
                    beginner: ['Social Problem Analysis Report'],
                    intermediate: ['District Development Plan Simulation'],
                    advanced: ['National Policy Implementation Research']
                },
                certifications: {
                    free: ['Unacademy / Byju\'s Free Resources'],
                    pro: ['Civil Services Foundation Training'],
                    premium: ['National Academy (LBSNAA) Training']
                }
            },
            'civil-police': {
                displayName: 'Police & Internal Security (IPS/Police)',
                careerPaths: ['IPS Officer', 'Police Inspector', 'Intelligence Officer'],
                projects: {
                    beginner: ['Community Policing Awareness'],
                    intermediate: ['Crime Prevention Plan for Locality'],
                    advanced: ['Urban Security Infrastructure Design']
                },
                certifications: {
                    free: ['Police Academy Awareness Modules'],
                    pro: ['National Police Academy (SVP NPA) Training'],
                    premium: ['Higher Defense/Security Research']
                }
            }
        }
    },


    logistics: {
        displayName: 'Logistics & Supply Chain',
        specializations: {
            'supply-chain-analytics': {
                displayName: 'Supply Chain Analytics',
                careerPaths: ['SCM Analyst', 'Operations Researcher', 'Demand Planner'],
                projects: {
                    beginner: ['Inventory Data Analysis'],
                    intermediate: ['Supply Chain Simulation Model'],
                    advanced: ['AI-driven Logistics Optimization Platform']
                },
                certifications: {
                    free: ['Intro to SCM (Coursera Audit)'],
                    pro: ['CSCP Certification'],
                    premium: ['Masters in SCM Analytics']
                }
            },
            'warehouse-transport-management': {
                displayName: 'Warehouse & Transport Management',
                careerPaths: ['Warehouse Manager', 'Fleet Manager', 'Logistics Coordinator'],
                projects: {
                    beginner: ['Warehouse Layout Plan'],
                    intermediate: ['Fleet Tracking Dashboard Mockup'],
                    advanced: ['Centralized Logistics Command Center Blueprint']
                },
                certifications: {
                    free: ['Warehouse Safety Basics'],
                    pro: ['Six Sigma Green Belt for Logistics'],
                    premium: ['Advanced Logistics Management Degree']
                }
            }
        }
    },

    aviation: {
        displayName: 'Aviation & Merchant Navy',
        specializations: {
            'commercial-pilot-operations': {
                displayName: 'Commercial Pilot & Flight Operations',
                careerPaths: ['Commercial Pilot', 'Flight Instructor', 'Air Traffic Controller'],
                projects: {
                    beginner: ['Flight Simulation Log'],
                    intermediate: ['Navigation Plan Study'],
                    advanced: ['Airline Operational Management Research']
                },
                certifications: {
                    free: ['Aviation Awareness Modules'],
                    pro: ['Private Pilot License (PPL)'],
                    premium: ['Commercial Pilot License (CPL)']
                }
            },
            'merchant-navy-deck-engine': {
                displayName: 'Merchant Navy (Deck & Engine)',
                careerPaths: ['Deck Officer', 'Marine Engineer', 'Captain'],
                projects: {
                    beginner: ['Basic Ship Navigation Study'],
                    intermediate: ['Marine Engine Troubleshooting Report'],
                    advanced: ['International Maritime Policy Analysis']
                },
                certifications: {
                    free: ['Basic Safety Training (STCW) Awareness'],
                    pro: ['GME / DNS Certification'],
                    premium: ['B.Sc Nautical Science / Marine Engineering']
                }
            }
        }
    },

    'emerging-tech': {
        displayName: 'Emerging Technologies',
        specializations: {
            'tech-quantum': {
                displayName: 'Quantum Computing',
                careerPaths: ['Quantum Algorithm Researcher', 'Quantum Software Engineer'],
                projects: {
                    beginner: ['Qiskit Circuit Builder'],
                    intermediate: ['Quantum Key Distribution Study'],
                    advanced: ['Hybrid Quantum-Classical Algorithm']
                },
                certifications: {
                    free: ['IBM Quantum Learning'],
                    pro: ['Microsoft Quantum Solutions'],
                    premium: ['PhD in Quantum Computing']
                }
            },
            'tech-robotics': {
                displayName: 'Robotics & Automation',
                careerPaths: ['Robotics Engineer', 'Autonomous Systems Specialist'],
                projects: {
                    beginner: ['Simple Robot Arm Control'],
                    intermediate: ['Path Finding Algorithm for Mobile Robot'],
                    advanced: ['Autonomous Warehouse Robot Design']
                },
                certifications: {
                    free: ['ROS for Beginners'],
                    pro: ['Robotics Specialization (Penn)'],
                    premium: ['Masters in Robotics']
                }
            }
        }
    },
    'media': {
        displayName: 'Media & Entertainment',
        specializations: {
            'media-journalism': {
                displayName: 'Journalism & Mass Communication',
                careerPaths: ['Journalist', 'Media Editor', 'Digital Reporter'],
                projects: {
                    beginner: ['News Blog Portfolio'],
                    intermediate: ['Investigative Documentary Short'],
                    advanced: ['Digital News Startup Blueprint']
                },
                certifications: {
                    free: ['Google News Initiative Training'],
                    pro: ['Journalism Diploma'],
                    premium: ['Master\'s in Journalism']
                }
            }
        }
    }
};

module.exports = { COMPLETE_REAL_WORLD_DATA };
