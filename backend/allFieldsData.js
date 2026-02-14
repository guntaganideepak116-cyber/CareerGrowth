/**
 * COMPLETE REAL-WORLD DATA - ALL 22 FIELDS
 * Structured with IDs matching frontend fieldsData.ts
 */

const COMPLETE_REAL_WORLD_DATA = {

    engineering: {
        displayName: 'Engineering',
        specializations: {
            'cse-web-dev': {
                displayName: 'Full Stack Web Development',
                careerPaths: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
                projects: {
                    beginner: ['Personal Portfolio Website', 'To-Do CRUD App', 'Blog with Admin Panel'],
                    intermediate: ['Full Stack E-commerce Platform', 'JWT Authentication System', 'Real-time Chat App'],
                    advanced: ['SaaS Platform', 'Multi-role Enterprise Web App', 'AI-powered Web Application']
                },
                certifications: {
                    free: ['freeCodeCamp Full Stack', 'NPTEL Web Programming', 'Infosys Springboard Web Dev'],
                    pro: ['Meta Frontend Developer (Coursera)', 'IBM Full Stack Developer'],
                    premium: ['AWS Developer Associate', 'Microsoft Azure Developer']
                }
            },
            'cse-cloud': {
                displayName: 'Cloud Computing & DevOps',
                careerPaths: ['DevOps Engineer', 'Cloud Engineer', 'Platform Engineer'],
                projects: {
                    beginner: ['Deploy Static Site on AWS', 'Dockerizing a Python App', 'CI/CD with GitHub Actions'],
                    intermediate: ['Kubernetes Cluster Setup', 'Infrastructure as Code with Terraform', 'Serverless API Deployment'],
                    advanced: ['Enterprise Multi-Cloud Infrastructure', 'Hybrid Cloud Networking Architecture']
                },
                certifications: {
                    free: ['AWS Cloud Practitioner Essentials', 'Google Cloud Fundamentals'],
                    pro: ['AWS Certified Solutions Architect - Associate', 'Microsoft Azure Administrator'],
                    premium: ['Google Professional Cloud Architect', 'AWS Certified DevOps Engineer']
                }
            },
            'cse-ai-ml': {
                displayName: 'AI & Machine Learning',
                careerPaths: ['ML Engineer', 'Data Scientist', 'AI Researcher'],
                projects: {
                    beginner: ['Spam Mail Classifier', 'Handwritten Digit Recognition', 'Movie Recommendation System'],
                    intermediate: ['Object Detection with YOLO', 'Sentiment Analysis on Twitter Data', 'Medical Image Segmentation'],
                    advanced: ['Custom LLM Fine-tuning', 'Autonomous Drone Navigation System', 'Generative AI Art Studio']
                },
                certifications: {
                    free: ['Google ML Crash Course', 'Kaggle Micro-courses'],
                    pro: ['DeepLearning.AI ML Specialization', 'IBM AI Engineering'],
                    premium: ['Google Professional ML Engineer', 'NVIDIA Deep Learning Institute']
                }
            },
            'cse-cybersecurity': {
                displayName: 'Cybersecurity & Ethical Hacking',
                careerPaths: ['Ethical Hacker', 'SOC Analyst', 'Security Engineer'],
                projects: {
                    beginner: ['Network Scanner Tool', 'Simple Keylogger for Educational Purpose', 'Secure Password Manager'],
                    intermediate: ['Vulnerability Assessment of a Website', 'Intrusion Detection System Setup', 'Penetrating testing of a Mock Target'],
                    advanced: ['Zero-Day Exploit Research Simulation', 'Enterprise Security Architecture Design', 'Digital Forensics Investigation']
                },
                certifications: {
                    free: ['Google Cybersecurity Cert (Audit)', 'Cisco Introduction to Cybersecurity'],
                    pro: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)'],
                    premium: ['OSCP (Offensive Security Certified Professional)', 'CISSP']
                }
            },
            'cse-software-dev': {
                displayName: 'Software Development & Programming',
                careerPaths: ['Software Engineer', 'Java Developer', 'Python Developer'],
                projects: {
                    beginner: ['Scientific Calculator', 'Library Management System', 'Snake Game in Python'],
                    intermediate: ['Student Grading System', 'Inventory Management API', 'Multiplayer Online Game'],
                    advanced: ['Distributed Database Engine', 'Compiler for a Custom Language', 'Real-time Operating System Kernel']
                },
                certifications: {
                    free: ['Programming Foundations (Coursera)', 'HackerRank Python Certification'],
                    pro: ['Oracle Certified Java Professional', 'Microsoft Certified: Azure Developer'],
                    premium: ['Meta Software Engineering Specialization', 'Google Software Product Management']
                }
            },
            'ece-embedded': {
                displayName: 'Embedded Systems & IoT',
                careerPaths: ['Embedded Systems Engineer', 'IoT Developer', 'Hardware Engineer'],
                projects: {
                    beginner: ['Smart Home Light Controller', 'Temperature Monitor with Arduino', 'Blinking LED with 8051'],
                    intermediate: ['IoT Based Smart Agriculture System', 'Real-time Health Monitoring Wearable', 'Autonomous Line Follower'],
                    advanced: ['Embedded Linux Driver Development', 'Smart City Infrastructure IoT Network', 'Industrial Automation with ESP32']
                },
                certifications: {
                    free: ['Introduction to IoT (Cisco)', 'Arduino Fundamentals'],
                    pro: ['Embedded Systems Certification (NPTEL)', 'ARM Certified Developer'],
                    premium: ['Master\'s in Embedded Systems Engineering', 'Professional IoT Architect']
                }
            },
            'mech-robotics': {
                displayName: 'Robotics & Automation',
                careerPaths: ['Robotics Engineer', 'Automation Architect', 'Mechatronics Specialist'],
                projects: {
                    beginner: ['Simple Robotic Arm with Servo', 'Remote Controlled Car', 'Robot Path Simulator'],
                    intermediate: ['Autonomous Mobile Robot with LiDAR', 'Industrial Automation Prototype', 'Robotic Vacuum Cleaner Logic'],
                    advanced: ['Humanoid Robot Prototype', 'Multi-robot Coordination Project', 'Space Exploration Rover Model']
                },
                certifications: {
                    free: ['ROS for Beginners', 'Robotics Specialization (Audit)'],
                    pro: ['NPTEL Robotics', 'Diploma in Mechatronics'],
                    premium: ['Professional Robotic Engineer (Industry Certified)', 'Masters in Robotics']
                }
            },
            'civil-structural': {
                displayName: 'Structural Engineering',
                careerPaths: ['Structural Engineer', 'Bridge Designer', 'Site Engineer'],
                projects: {
                    beginner: ['Building Model (Small Scale)', 'Basic CAD Schematic', 'Concrete Strength Analysis'],
                    intermediate: ['Steel Bridge Structural Design', 'Apartment Complex Planning', 'Earthquake Resistant Building Simulation'],
                    advanced: ['Metro Station Structural Design', 'Skyscraper Aeroelastic Analysis', 'National Highway Bridge Infrastructure']
                },
                certifications: {
                    free: ['Structural Analysis Intro', 'Autodesk Civil 3D Basics'],
                    pro: ['STAAD.Pro Certification', 'ETABS Professional Training'],
                    premium: ['Chartered Engineer Certification', 'M.Tech in Structural Engineering']
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
            'ai-ds': {
                displayName: 'Data Science & Big Data Analytics',
                careerPaths: ['Data Scientist', 'Data Analyst', 'BI Developer'],
                projects: {
                    beginner: ['Sales Dashboard', 'Titanic Survival Prediction'],
                    intermediate: ['Customer Churn Prediction', 'Time Series Forecasting'],
                    advanced: ['Big Data Pipeline', 'Real-time Analytics Engine']
                },
                certifications: {
                    free: ['Kaggle Data Science', 'Google Data Analytics'],
                    pro: ['IBM Data Science Professional'],
                    premium: ['AWS Data Analytics Specialty']
                }
            },
            'ai-nlp': {
                displayName: 'Natural Language Processing (NLP)',
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
                displayName: 'Cloud Architecture & Solutions Design',
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
            },
            'cloud-devops': {
                displayName: 'Cloud DevOps & SRE',
                careerPaths: ['DevOps Engineer', 'SRE Engineer', 'Site Reliability Engineer'],
                projects: {
                    beginner: ['Dockerizing an App', 'Basic CI/CD with Git'],
                    intermediate: ['Kubernetes Deployment on Cloud', 'Infrastructure as Code (Terraform)'],
                    advanced: ['Enterprise-Scale SRE Dashboard', 'Zero-Downtime Migration Strategy']
                },
                certifications: {
                    free: ['Docker Fundamentals', 'Linux Academy CI/CD'],
                    pro: ['CKA (Certified Kubernetes Administrator)', 'AWS DevOps Engineer'],
                    premium: ['Google Professional DevOps Engineer', 'SRE Certification']
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
            },
            'cyber-defensive': {
                displayName: 'Defensive Security & SOC',
                careerPaths: ['SOC Analyst', 'Incident Responder', 'Security Engineer'],
                projects: {
                    beginner: ['Log Analysis', 'Firewall Setup'],
                    intermediate: ['SIEM Implementation', 'Intrusion Detection System'],
                    advanced: ['Threat Intelligence Platform', 'Incident Management Simulation']
                },
                certifications: {
                    free: ['Google Cybersecurity Cert (Audit)', 'Cisco CyberOps Associate'],
                    pro: ['CompTIA Security+', 'GSEC'],
                    premium: ['CISSP', 'CISM']
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
            },
            'web3-dapps': {
                displayName: 'DApp Development',
                careerPaths: ['Web3 Developer', 'Frontend DApp Engineer'],
                projects: {
                    beginner: ['Metamask Connect App'],
                    intermediate: ['NFT Marketplace Frontend'],
                    advanced: ['DApp with WalletConnect & Subgraph']
                },
                certifications: {
                    free: ['Ethers.js Guide'],
                    pro: ['Web3JS Mastery'],
                    premium: ['Certified Blockchain Architect']
                }
            }
        }
    },

    'civil-services': {
        displayName: 'Civil Services & Government',
        specializations: {
            'civil-admin': {
                displayName: 'IAS & Administrative Services',
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
                displayName: 'IPS & Internal Security',
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
    },

    medical: {
        displayName: 'Medical & Health Sciences',
        specializations: {
            'hospital-admin': {
                displayName: 'Hospital Administration & Healthcare Management',
                careerPaths: ['Hospital Administrator', 'Operations Manager', 'Medical Superintendent'],
                projects: {
                    beginner: ['Hospital Workflow Analysis'],
                    intermediate: ['Patient Data Visualization Platform'],
                    advanced: ['AI-based Hospital Resource Optimization']
                },
                certifications: {
                    free: ['WHO Online Health Courses'],
                    pro: ['PG Diploma in Hospital Administration'],
                    premium: ['MBA in Healthcare Management']
                }
            }
        }
    }
};

module.exports = { COMPLETE_REAL_WORLD_DATA };
