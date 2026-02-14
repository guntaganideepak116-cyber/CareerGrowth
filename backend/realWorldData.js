/**
 * REAL-WORLD DATA MIGRATION SCRIPT
 * Replaces all generic data with actual field-specific content
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ============================================
// REAL-WORLD DATA STRUCTURE
// ============================================

const REAL_WORLD_DATA = {
    engineering: {
        specializations: {
            'full-stack-web-development': {
                name: 'Full Stack Web Development',
                careerPaths: [
                    { title: 'Frontend Developer', level: 'junior' },
                    { title: 'Backend Developer', level: 'junior' },
                    { title: 'Full Stack Developer', level: 'mid' }
                ],
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
            'artificial-intelligence-machine-learning': {
                name: 'Artificial Intelligence & Machine Learning',
                careerPaths: [
                    { title: 'AI Engineer', level: 'mid' },
                    { title: 'ML Engineer', level: 'mid' },
                    { title: 'NLP Engineer', level: 'senior' }
                ],
                projects: {
                    beginner: ['Spam Detection', 'Movie Recommendation', 'House Price Prediction'],
                    intermediate: ['Resume Screening AI', 'Face Recognition System', 'Sentiment Analysis'],
                    advanced: ['LLM-based AI Assistant', 'AI SaaS Platform', 'Deep Learning Deployment Pipeline']
                },
                certifications: {
                    free: ['Google ML Crash Course', 'Kaggle Micro Courses'],
                    pro: ['IBM AI Engineering', 'DeepLearning.AI ML Specialization'],
                    premium: ['Google Professional ML Engineer', 'Azure AI Engineer']
                }
            },
            'data-science-analytics': {
                name: 'Data Science & Analytics',
                careerPaths: [
                    { title: 'Data Analyst', level: 'junior' },
                    { title: 'Data Scientist', level: 'mid' },
                    { title: 'BI Developer', level: 'mid' }
                ],
                projects: {
                    beginner: ['Excel Sales Dashboard', 'Basic Data Visualization'],
                    intermediate: ['Power BI Dashboard', 'Customer Segmentation'],
                    advanced: ['Big Data Pipeline', 'Real-time Analytics System']
                },
                certifications: {
                    free: ['Google Data Analytics (Audit Mode)', 'Kaggle SQL'],
                    pro: ['Microsoft Power BI', 'IBM Data Science'],
                    premium: ['AWS Data Analytics Specialty', 'Tableau Professional']
                }
            },
            'cybersecurity': {
                name: 'Cybersecurity',
                careerPaths: [
                    { title: 'Ethical Hacker', level: 'mid' },
                    { title: 'SOC Analyst', level: 'junior' },
                    { title: 'Security Engineer', level: 'senior' }
                ],
                projects: {
                    beginner: ['Password Strength Checker', 'Encryption Tool'],
                    intermediate: ['Vulnerability Scanner', 'Network Monitoring Tool'],
                    advanced: ['Pen Testing Lab', 'Threat Detection System']
                },
                certifications: {
                    free: ['Google Cybersecurity Intro', 'TryHackMe Beginner Paths'],
                    pro: ['CompTIA Security+', 'Certified SOC Analyst'],
                    premium: ['CEH', 'CISSP']
                }
            },
            'cloud-computing': {
                name: 'Cloud Computing',
                careerPaths: [
                    { title: 'Cloud Engineer', level: 'mid' },
                    { title: 'DevOps Engineer', level: 'mid' },
                    { title: 'Cloud Architect', level: 'senior' }
                ],
                projects: {
                    beginner: ['Deploy Website on AWS', 'Basic VM Setup'],
                    intermediate: ['Docker + CI/CD Pipeline', 'Kubernetes Deployment'],
                    advanced: ['Multi-region Cloud Setup', 'Serverless Architecture']
                },
                certifications: {
                    free: ['AWS Cloud Practitioner Essentials (Free Training)'],
                    pro: ['AWS Solutions Architect', 'Azure Administrator'],
                    premium: ['Google Cloud Professional Engineer', 'AWS DevOps Engineer']
                }
            },
            'devops-site-reliability': {
                name: 'DevOps & Site Reliability',
                careerPaths: [
                    { title: 'DevOps Engineer', level: 'mid' },
                    { title: 'SRE Engineer', level: 'senior' },
                    { title: 'Platform Engineer', level: 'senior' }
                ],
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
            'blockchain-web3': {
                name: 'Blockchain & Web3',
                careerPaths: [
                    { title: 'Blockchain Developer', level: 'mid' },
                    { title: 'Smart Contract Engineer', level: 'mid' },
                    { title: 'Web3 Developer', level: 'senior' }
                ],
                projects: {
                    beginner: ['Simple Smart Contract', 'Crypto Wallet UI'],
                    intermediate: ['NFT Marketplace', 'Token Creation Platform'],
                    advanced: ['DAO System', 'DeFi Lending Platform']
                },
                certifications: {
                    free: ['Binance Blockchain Intro'],
                    pro: ['Certified Blockchain Developer'],
                    premium: ['Ethereum Professional Certification']
                }
            },
            'internet-of-things': {
                name: 'Internet of Things (IoT)',
                careerPaths: [
                    { title: 'IoT Engineer', level: 'mid' },
                    { title: 'Embedded Systems Developer', level: 'mid' },
                    { title: 'Automation Engineer', level: 'senior' }
                ],
                projects: {
                    beginner: ['Sensor-based Monitoring System'],
                    intermediate: ['Smart Home Automation'],
                    advanced: ['Industrial IoT Platform', 'AI + IoT System']
                },
                certifications: {
                    free: ['Cisco IoT Intro'],
                    pro: ['NPTEL IoT'],
                    premium: ['Azure IoT Developer']
                }
            },
            'robotics-automation': {
                name: 'Robotics & Automation',
                careerPaths: [
                    { title: 'Robotics Engineer', level: 'mid' },
                    { title: 'Automation Engineer', level: 'mid' },
                    { title: 'Control Systems Engineer', level: 'senior' }
                ],
                projects: {
                    beginner: ['Line Follower Robot'],
                    intermediate: ['Robotic Arm'],
                    advanced: ['Autonomous Robotics System']
                },
                certifications: {
                    free: ['Robotics Intro Courses'],
                    pro: ['PLC Certification'],
                    premium: ['Robotics Specialization']
                }
            },
            'mobile-app-development': {
                name: 'Mobile App Development',
                careerPaths: [
                    { title: 'Android Developer', level: 'junior' },
                    { title: 'iOS Developer', level: 'junior' },
                    { title: 'Flutter Developer', level: 'mid' }
                ],
                projects: {
                    beginner: ['To-Do App'],
                    intermediate: ['E-commerce App'],
                    advanced: ['AI-powered Mobile App']
                },
                certifications: {
                    free: ['Google Android Basics'],
                    pro: ['Flutter Certification'],
                    premium: ['Google Associate Android Developer']
                }
            },
            'game-development': {
                name: 'Game Development',
                careerPaths: [
                    { title: 'Unity Developer', level: 'mid' },
                    { title: 'Unreal Developer', level: 'mid' },
                    { title: 'Gameplay Engineer', level: 'senior' }
                ],
                projects: {
                    beginner: ['2D Game'],
                    intermediate: ['Multiplayer Game'],
                    advanced: ['VR Game']
                },
                certifications: {
                    free: ['Unity Learn'],
                    pro: ['Unity Certification'],
                    premium: ['Unreal Engine Certification']
                }
            },
            'computer-vision': {
                name: 'Computer Vision',
                careerPaths: [
                    { title: 'Computer Vision Engineer', level: 'mid' },
                    { title: 'AI Vision Specialist', level: 'senior' }
                ],
                projects: {
                    beginner: ['Object Detection'],
                    intermediate: ['Traffic Monitoring AI'],
                    advanced: ['Autonomous Driving Vision']
                },
                certifications: {
                    free: ['OpenCV Tutorials'],
                    pro: ['DeepLearning.AI CV'],
                    premium: ['Professional AI Vision Certification']
                }
            },
            'quantum-computing': {
                name: 'Quantum Computing',
                careerPaths: [
                    { title: 'Quantum Computing Engineer', level: 'senior' },
                    { title: 'Quantum Software Developer', level: 'mid' },
                    { title: 'Quantum Research Scientist', level: 'senior' }
                ],
                projects: {
                    beginner: ['Quantum Circuit Simulator using Qiskit'],
                    intermediate: ['Quantum Algorithm Implementation'],
                    advanced: ['Quantum Secure Communication System']
                },
                certifications: {
                    free: ['IBM Quantum Computing Fundamentals'],
                    pro: ['IBM Quantum Developer Certification'],
                    premium: ['Professional Quantum Computing Developer Certification']
                }
            }
        }
    },

    medical: {
        specializations: {
            'hospital-administration': {
                name: 'Hospital Administration & Healthcare Management',
                careerPaths: [
                    { title: 'Hospital Administrator', level: 'mid' },
                    { title: 'Healthcare Operations Manager', level: 'mid' },
                    { title: 'Medical Superintendent', level: 'senior' }
                ],
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
                name: 'Clinical Research & Medical Research',
                careerPaths: [
                    { title: 'Clinical Research Associate', level: 'junior' },
                    { title: 'Medical Research Analyst', level: 'mid' },
                    { title: 'Clinical Trial Coordinator', level: 'mid' }
                ],
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
                name: 'Public Health & Epidemiology',
                careerPaths: [
                    { title: 'Public Health Officer', level: 'mid' },
                    { title: 'Epidemiologist', level: 'senior' },
                    { title: 'Health Policy Analyst', level: 'senior' }
                ],
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
            }
        }
    },

    // Add more fields here...
};

console.log('✅ Real-world data structure loaded');
console.log(`📊 Total fields: ${Object.keys(REAL_WORLD_DATA).length}`);
console.log('📊 Engineering specializations:', Object.keys(REAL_WORLD_DATA.engineering.specializations).length);

module.exports = { REAL_WORLD_DATA };
