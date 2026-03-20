// Static fallback career paths data for all 22 fields
// Used when backend API is unavailable

export const staticCareerPaths = {
    engineering: [
        {
            id: 'eng-1',
            title: 'Software Developer',
            field: 'engineering',
            level: 'Beginner',
            requiredSkills: ['JavaScript', 'Python', 'Git', 'HTML/CSS', 'Problem Solving'],
            description: 'Develops software applications using modern technologies and best practices.',
            salary_range: '₹4-8 LPA',
            growth_potential: 'High'
        },
        {
            id: 'eng-2',
            title: 'Full Stack Engineer',
            field: 'engineering',
            level: 'Intermediate',
            requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'DevOps'],
            description: 'Builds complete web applications from frontend to backend.',
            salary_range: '₹8-15 LPA',
            growth_potential: 'High'
        },
        {
            id: 'eng-3',
            title: 'AI/ML Engineer',
            field: 'engineering',
            level: 'Advanced',
            requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Statistics'],
            description: 'Develops artificial intelligence and machine learning solutions.',
            salary_range: '₹15-30 LPA',
            growth_potential: 'High'
        },
        {
            id: 'eng-4',
            title: 'Cloud Architect',
            field: 'engineering',
            level: 'Advanced',
            requiredSkills: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'Microservices'],
            description: 'Designs and implements cloud infrastructure solutions.',
            salary_range: '₹18-35 LPA',
            growth_potential: 'High'
        },
        {
            id: 'eng-5',
            title: 'DevOps Engineer',
            field: 'engineering',
            level: 'Intermediate',
            requiredSkills: ['CI/CD', 'Jenkins', 'Docker', 'Kubernetes', 'Linux'],
            description: 'Manages deployment pipelines and infrastructure automation.',
            salary_range: '₹10-18 LPA',
            growth_potential: 'High'
        }
    ],
    medical: [
        {
            id: 'med-1',
            title: 'General Physician',
            field: 'medical',
            level: 'Beginner',
            requiredSkills: ['MBBS', 'Clinical Diagnosis', 'Patient Care', 'Medical Ethics', 'Communication'],
            description: 'Provides primary healthcare services and diagnoses common illnesses.',
            salary_range: '₹6-12 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'med-2',
            title: 'Cardiologist',
            field: 'medical',
            level: 'Advanced',
            requiredSkills: ['MD Cardiology', 'ECG Analysis', 'Cardiac Surgery', 'Patient Management'],
            description: 'Specializes in heart and cardiovascular system treatment.',
            salary_range: '₹20-50 LPA',
            growth_potential: 'High'
        },
        {
            id: 'med-3',
            title: 'Medical Researcher',
            field: 'medical',
            level: 'Advanced',
            requiredSkills: ['PhD', 'Clinical Trials', 'Data Analysis', 'Research Methodology', 'Biostatistics'],
            description: 'Conducts medical research and clinical studies.',
            salary_range: '₹10-25 LPA',
            growth_potential: 'High'
        },
        {
            id: 'med-4',
            title: 'Physiotherapist',
            field: 'medical',
            level: 'Intermediate',
            requiredSkills: ['BPT', 'Rehabilitation', 'Manual Therapy', 'Exercise Prescription'],
            description: 'Helps patients recover from injuries through physical therapy.',
            salary_range: '₹4-10 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'med-5',
            title: 'Pharmacist',
            field: 'medical',
            level: 'Beginner',
            requiredSkills: ['B.Pharm', 'Drug Knowledge', 'Patient Counseling', 'Medication Management'],
            description: 'Dispenses medications and provides pharmaceutical advice.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        }
    ],
    science: [
        {
            id: 'sci-1',
            title: 'Data Scientist',
            field: 'science',
            level: 'Intermediate',
            requiredSkills: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL'],
            description: 'Analyzes complex data to derive business insights.',
            salary_range: '₹8-20 LPA',
            growth_potential: 'High'
        },
        {
            id: 'sci-2',
            title: 'Research Scientist',
            field: 'science',
            level: 'Advanced',
            requiredSkills: ['PhD', 'Research Design', 'Data Analysis', 'Scientific Writing', 'Lab Techniques'],
            description: 'Conducts advanced scientific research in specialized fields.',
            salary_range: '₹10-30 LPA',
            growth_potential: 'High'
        },
        {
            id: 'sci-3',
            title: 'Biotechnologist',
            field: 'science',
            level: 'Intermediate',
            requiredSkills: ['Molecular Biology', 'Genetic Engineering', 'Lab Skills', 'Bioinformatics'],
            description: 'Works with biological systems for technological applications.',
            salary_range: '₹5-15 LPA',
            growth_potential: 'High'
        },
        {
            id: 'sci-4',
            title: 'Environmental Scientist',
            field: 'science',
            level: 'Beginner',
            requiredSkills: ['Environmental Studies', 'GIS', 'Data Collection', 'Report Writing'],
            description: 'Studies and protects the environment and natural resources.',
            salary_range: '₹4-10 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'sci-5',
            title: 'Astrophysicist',
            field: 'science',
            level: 'Advanced',
            requiredSkills: ['Physics', 'Mathematics', 'Programming', 'Data Analysis', 'Cosmology'],
            description: 'Studies celestial objects and phenomena in space.',
            salary_range: '₹12-35 LPA',
            growth_potential: 'Medium'
        }
    ],
    arts: [
        {
            id: 'arts-1',
            title: 'Content Writer',
            field: 'arts',
            level: 'Beginner',
            requiredSkills: ['Creative Writing', 'Grammar', 'SEO', 'Research', 'Storytelling'],
            description: 'Creates engaging written content for various platforms.',
            salary_range: '₹3-7 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'arts-2',
            title: 'Journalist',
            field: 'arts',
            level: 'Intermediate',
            requiredSkills: ['Reporting', 'Interviewing', 'News Writing', 'Ethics', 'Communication'],
            description: 'Reports news and current events for media organizations.',
            salary_range: '₹5-12 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'arts-3',
            title: 'Psychologist',
            field: 'arts',
            level: 'Advanced',
            requiredSkills: ['Psychology', 'Counseling', 'Assessment', 'Empathy', 'Communication'],
            description: 'Provides mental health counseling and therapy.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'High'
        },
        {
            id: 'arts-4',
            title: 'Digital Marketer',
            field: 'arts',
            level: 'Intermediate',
            requiredSkills: ['Social Media', 'Content Marketing', 'Analytics', 'SEO', 'Copywriting'],
            description: 'Promotes products and services through digital channels.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'High'
        },
        {
            id: 'arts-5',
            title: 'Historian',
            field: 'arts',
            level: 'Advanced',
            requiredSkills: ['Research Methodology', 'Archival Studies', 'Critical Analysis', 'Writing'],
            description: 'Studies and interprets historical events and cultures.',
            salary_range: '₹5-15 LPA',
            growth_potential: 'Low'
        }
    ],
    commerce: [
        {
            id: 'comm-1',
            title: 'Financial Analyst',
            field: 'commerce',
            level: 'Intermediate',
            requiredSkills: ['Financial Modeling', 'Excel', 'Accounting', 'Valuation', 'Analysis'],
            description: 'Analyzes financial data to guide business decisions.',
            salary_range: '₹6-15 LPA',
            growth_potential: 'High'
        },
        {
            id: 'comm-2',
            title: 'Chartered Accountant',
            field: 'commerce',
            level: 'Advanced',
            requiredSkills: ['Accounting', 'Taxation', 'Auditing', 'Financial Reporting', 'Compliance'],
            description: 'Provides expert financial and tax advice to organizations.',
            salary_range: '₹10-30 LPA',
            growth_potential: 'High'
        },
        {
            id: 'comm-3',
            title: 'Business Consultant',
            field: 'commerce',
            level: 'Advanced',
            requiredSkills: ['Strategy', 'Problem Solving', 'Communication', 'Industry Knowledge', 'Analytics'],
            description: 'Advises businesses on strategy and operational improvements.',
            salary_range: '₹12-35 LPA',
            growth_potential: 'High'
        },
        {
            id: 'comm-4',
            title: 'Investment Banker',
            field: 'commerce',
            level: 'Advanced',
            requiredSkills: ['Finance', 'Valuation', 'M&A', 'Modeling', 'Negotiation'],
            description: 'Facilitates corporate finance transactions and mergers.',
            salary_range: '₹15-50 LPA',
            growth_potential: 'High'
        },
        {
            id: 'comm-5',
            title: 'Marketing Manager',
            field: 'commerce',
            level: 'Intermediate',
            requiredSkills: ['Marketing Strategy', 'Brand Management', 'Analytics', 'Communication', 'Leadership'],
            description: 'Plans and executes marketing campaigns for products.',
            salary_range: '₹8-20 LPA',
            growth_potential: 'High'
        }
    ],
    law: [
        {
            id: 'law-1',
            title: 'Corporate Lawyer',
            field: 'law',
            level: 'Advanced',
            requiredSkills: ['LLB', 'Contract Law', 'Negotiation', 'Legal Research', 'Drafting'],
            description: 'Provides legal counsel to corporations and businesses.',
            salary_range: '₹10-40 LPA',
            growth_potential: 'High'
        },
        {
            id: 'law-2',
            title: 'Civil Services Officer',
            field: 'law',
            level: 'Advanced',
            requiredSkills: ['Administration', 'Policy Making', 'Leadership', 'Public Relations', 'Ethics'],
            description: 'Serves in government administrative positions.',
            salary_range: '₹8-20 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'law-3',
            title: 'Legal Advisor',
            field: 'law',
            level: 'Intermediate',
            requiredSkills: ['Legal Knowledge', 'Advisory', 'Research', 'Communication', 'Ethics'],
            description: 'Provides legal guidance to individuals and organizations.',
            salary_range: '₹6-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'law-4',
            title: 'Paralegal',
            field: 'law',
            level: 'Beginner',
            requiredSkills: ['Legal Research', 'Documentation', 'Case Management', 'Communication'],
            description: 'Assists lawyers with legal research and documentation.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'law-5',
            title: 'Judge/Magistrate',
            field: 'law',
            level: 'Advanced',
            requiredSkills: ['Judicial Experience', 'Legal Knowledge', 'Decision Making', 'Ethics', 'Impartiality'],
            description: 'Presides over legal proceedings and delivers judgments.',
            salary_range: '₹12-30 LPA',
            growth_potential: 'Medium'
        }
    ],
    education: [
        {
            id: 'edu-1',
            title: 'School Teacher',
            field: 'education',
            level: 'Beginner',
            requiredSkills: ['B.Ed', 'Subject Knowledge', 'Classroom Management', 'Communication', 'Patience'],
            description: 'Teaches students in primary or secondary schools.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'edu-2',
            title: 'Professor/Lecturer',
            field: 'education',
            level: 'Advanced',
            requiredSkills: ['PhD', 'Research', 'Teaching', 'Subject Expertise', 'Publication'],
            description: 'Teaches and conducts research at universities.',
            salary_range: '₹8-25 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'edu-3',
            title: 'Educational Consultant',
            field: 'education',
            level: 'Intermediate',
            requiredSkills: ['Curriculum Design', 'Assessment', 'Training', 'Communication', 'Analysis'],
            description: 'Advises educational institutions on curriculum and policies.',
            salary_range: '₹5-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'edu-4',
            title: 'E-Learning Designer',
            field: 'education',
            level: 'Intermediate',
            requiredSkills: ['Instructional Design', 'LMS', 'Multimedia', 'Pedagogy', 'Technology'],
            description: 'Creates online courses and digital learning content.',
            salary_range: '₹6-14 LPA',
            growth_potential: 'High'
        },
        {
            id: 'edu-5',
            title: 'Career Counselor',
            field: 'education',
            level: 'Beginner',
            requiredSkills: ['Counseling', 'Assessment', 'Communication', 'Empathy', 'Career Knowledge'],
            description: 'Guides students in career planning and decision making.',
            salary_range: '₹4-10 LPA',
            growth_potential: 'Medium'
        }
    ],
    design: [
        {
            id: 'des-1',
            title: 'Graphic Designer',
            field: 'design',
            level: 'Beginner',
            requiredSkills: ['Adobe Photoshop', 'Illustrator', 'Typography', 'Color Theory', 'Creativity'],
            description: 'Creates visual content for print and digital media.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'des-2',
            title: 'UI/UX Designer',
            field: 'design',
            level: 'Intermediate',
            requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Wireframing', 'Design Thinking'],
            description: 'Designs user interfaces and experiences for digital products.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'High'
        },
        {
            id: 'des-3',
            title: 'Video Editor',
            field: 'design',
            level: 'Intermediate',
            requiredSkills: ['Premiere Pro', 'After Effects', 'Storytelling', 'Color Grading', 'Audio Editing'],
            description: 'Edits and produces video content for various platforms.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'High'
        },
        {
            id: 'des-4',
            title: '3D Animator',
            field: 'design',
            level: 'Advanced',
            requiredSkills: ['Blender', 'Maya', '3D Modeling', 'Animation', 'Texturing'],
            description: 'Creates 3D animations for films, games, and advertisements.',
            salary_range: '₹8-20 LPA',
            growth_potential: 'High'
        },
        {
            id: 'des-5',
            title: 'Art Director',
            field: 'design',
            level: 'Advanced',
            requiredSkills: ['Creative Direction', 'Team Leadership', 'Branding', 'Design Strategy', 'Communication'],
            description: 'Leads creative teams and directs visual projects.',
            salary_range: '₹12-30 LPA',
            growth_potential: 'High'
        }
    ],
    defense: [
        {
            id: 'def-1',
            title: 'Army Officer',
            field: 'defense',
            level: 'Intermediate',
            requiredSkills: ['Leadership', 'Physical Fitness', 'Strategy', 'Discipline', 'Teamwork'],
            description: 'Serves in the armed forces defending the nation.',
            salary_range: '₹7-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'def-2',
            title: 'Cybersecurity Specialist',
            field: 'defense',
            level: 'Advanced',
            requiredSkills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Incident Response', 'Linux'],
            description: 'Protects systems and networks from cyber threats.',
            salary_range: '₹10-25 LPA',
            growth_potential: 'High'
        },
        {
            id: 'def-3',
            title: 'Police Officer',
            field: 'defense',
            level: 'Beginner',
            requiredSkills: ['Law Enforcement', 'Physical Fitness', 'Communication', 'Investigation', 'Ethics'],
            description: 'Maintains law and order and protects citizens.',
            salary_range: '₹4-10 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'def-4',
            title: 'Firefighter',
            field: 'defense',
            level: 'Beginner',
            requiredSkills: ['Emergency Response', 'Physical Fitness', 'First Aid', 'Teamwork', 'Courage'],
            description: 'Responds to fires and emergencies to save lives.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'def-5',
            title: 'Intelligence Analyst',
            field: 'defense',
            level: 'Advanced',
            requiredSkills: ['Analysis', 'Critical Thinking', 'Research', 'Communication', 'Security Clearance'],
            description: 'Analyzes intelligence data for national security.',
            salary_range: '₹8-20 LPA',
            growth_potential: 'High'
        }
    ],
    agriculture: [
        {
            id: 'agr-1',
            title: 'Agricultural Scientist',
            field: 'agriculture',
            level: 'Advanced',
            requiredSkills: ['Agronomy', 'Research', 'Crop Management', 'Soil Science', 'Data Analysis'],
            description: 'Conducts research to improve agricultural productivity.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'agr-2',
            title: 'Farm Manager',
            field: 'agriculture',
            level: 'Intermediate',
            requiredSkills: ['Farm Operations', 'Crop Planning', 'Equipment Management', 'Business Skills'],
            description: 'Manages agricultural operations and farm resources.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'agr-3',
            title: 'Environmental Consultant',
            field: 'agriculture',
            level: 'Intermediate',
            requiredSkills: ['Environmental Impact', 'Sustainability', 'Regulations', 'Reporting', 'Analysis'],
            description: 'Advises on environmental sustainability practices.',
            salary_range: '₹5-15 LPA',
            growth_potential: 'High'
        },
        {
            id: 'agr-4',
            title: 'Horticulturist',
            field: 'agriculture',
            level: 'Beginner',
            requiredSkills: ['Plant Science', 'Gardening', 'Pest Management', 'Soil Care', 'Landscape Design'],
            description: 'Cultivates plants, gardens, and landscapes.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'agr-5',
            title: 'Agricultural Engineer',
            field: 'agriculture',
            level: 'Advanced',
            requiredSkills: ['Engineering', 'Irrigation', 'Machinery', 'Technology', 'Problem Solving'],
            description: 'Designs agricultural machinery and irrigation systems.',
            salary_range: '₹7-18 LPA',
            growth_potential: 'Medium'
        }
    ],
    aviation: [
        {
            id: 'avi-1',
            title: 'Commercial Pilot',
            field: 'aviation',
            level: 'Advanced',
            requiredSkills: ['CPL License', 'Aircraft Operations', 'Navigation', 'Communication', 'Decision Making'],
            description: 'Flies commercial aircraft transporting passengers and cargo.',
            salary_range: '₹15-50 LPA',
            growth_potential: 'High'
        },
        {
            id: 'avi-2',
            title: 'Aerospace Engineer',
            field: 'aviation',
            level: 'Advanced',
            requiredSkills: ['Aerodynamics', 'CAD', 'Propulsion', 'Materials Science', 'Problem Solving'],
            description: 'Designs and develops aircraft and spacecraft.',
            salary_range: '₹10-30 LPA',
            growth_potential: 'High'
        },
        {
            id: 'avi-3',
            title: 'Air Traffic Controller',
            field: 'aviation',
            level: 'Intermediate',
            requiredSkills: ['ATC License', 'Communication', 'Decision Making', 'Stress Management', 'Radar Operation'],
            description: 'Manages aircraft movements and ensures aviation safety.',
            salary_range: '₹8-20 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'avi-4',
            title: 'Aircraft Maintenance Engineer',
            field: 'aviation',
            level: 'Intermediate',
            requiredSkills: ['AME License', 'Aircraft Systems', 'Troubleshooting', 'Safety', 'Documentation'],
            description: 'Maintains and repairs aircraft to ensure safety.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'avi-5',
            title: 'Flight Attendant',
            field: 'aviation',
            level: 'Beginner',
            requiredSkills: ['Customer Service', 'Safety Procedures', 'Communication', 'First Aid', 'Languages'],
            description: 'Ensures passenger safety and comfort during flights.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'Medium'
        }
    ],
    sports: [
        {
            id: 'spo-1',
            title: 'Professional Athlete',
            field: 'sports',
            level: 'Advanced',
            requiredSkills: ['Sport-Specific Skills', 'Physical Fitness', 'Mental Toughness', 'Discipline', 'Teamwork'],
            description: 'Competes professionally in sports tournaments.',
            salary_range: '₹5-50 LPA',
            growth_potential: 'High'
        },
        {
            id: 'spo-2',
            title: 'Sports Coach',
            field: 'sports',
            level: 'Intermediate',
            requiredSkills: ['Coaching', 'Strategy', 'Communication', 'Leadership', 'Sport Knowledge'],
            description: 'Trains and mentors athletes to improve performance.',
            salary_range: '₹4-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'spo-3',
            title: 'Fitness Trainer',
            field: 'sports',
            level: 'Beginner',
            requiredSkills: ['Exercise Science', 'Nutrition', 'Motivation', 'Communication', 'First Aid'],
            description: 'Guides individuals in fitness and exercise programs.',
            salary_range: '₹3-10 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'spo-4',
            title: 'Sports Physiotherapist',
            field: 'sports',
            level: 'Advanced',
            requiredSkills: ['Physiotherapy', 'Sports Medicine', 'Rehabilitation', 'Anatomy', 'Manual Therapy'],
            description: 'Treats and prevents sports-related injuries.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'High'
        },
        {
            id: 'spo-5',
            title: 'Sports Manager',
            field: 'sports',
            level: 'Intermediate',
            requiredSkills: ['Management', 'Negotiation', 'Marketing', 'Event Planning', 'Communication'],
            description: 'Manages athletes, teams, and sporting events.',
            salary_range: '₹5-20 LPA',
            growth_potential: 'High'
        }
    ],
    hospitality: [
        {
            id: 'hos-1',
            title: 'Hotel Manager',
            field: 'hospitality',
            level: 'Intermediate',
            requiredSkills: ['Hospitality Management', 'Customer Service', 'Operations', 'Leadership', 'Communication'],
            description: 'Oversees hotel operations and guest experiences.',
            salary_range: '₹5-18 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'hos-2',
            title: 'Chef',
            field: 'hospitality',
            level: 'Intermediate',
            requiredSkills: ['Culinary Arts', 'Menu Planning', 'Food Safety', 'Creativity', 'Team Management'],
            description: 'Prepares gourmet meals and manages kitchen operations.',
            salary_range: '₹4-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'hos-3',
            title: 'Tour Guide',
            field: 'hospitality',
            level: 'Beginner',
            requiredSkills: ['Communication', 'Local Knowledge', 'Languages', 'Customer Service', 'Storytelling'],
            description: 'Guides tourists and provides information about attractions.',
            salary_range: '₹2-6 LPA',
            growth_potential: 'Low'
        },
        {
            id: 'hos-4',
            title: 'Event Manager',
            field: 'hospitality',
            level: 'Intermediate',
            requiredSkills: ['Event Planning', 'Coordination', 'Budgeting', 'Vendor Management', 'Problem Solving'],
            description: 'Plans and executes events and conferences.',
            salary_range: '₹5-15 LPA',
            growth_potential: 'High'
        },
        {
            id: 'hos-5',
            title: 'Travel Consultant',
            field: 'hospitality',
            level: 'Beginner',
            requiredSkills: ['Destination Knowledge', 'Booking Systems', 'Communication', 'Sales', 'Customer Service'],
            description: 'Advises clients on travel plans and bookings.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        }
    ],
    architecture: [
        {
            id: 'arch-1',
            title: 'Architect',
            field: 'architecture',
            level: 'Advanced',
            requiredSkills: ['AutoCAD', '3D Modeling', 'Design', 'Building Codes', 'Project Management'],
            description: 'Designs buildings and structures for various purposes.',
            salary_range: '₹8-25 LPA',
            growth_potential: 'High'
        },
        {
            id: 'arch-2',
            title: 'Civil Engineer',
            field: 'architecture',
            level: 'Advanced',
            requiredSkills: ['Structural Analysis', 'CAD', 'Construction Management', 'Materials', 'Problem Solving'],
            description: 'Designs and oversees construction of infrastructure projects.',
            salary_range: '₹6-20 LPA',
            growth_potential: 'High'
        },
        {
            id: 'arch-3',
            title: 'Interior Designer',
            field: 'architecture',
            level: 'Intermediate',
            requiredSkills: ['Space Planning', 'Design Software', 'Color Theory', 'Materials', 'Client Management'],
            description: 'Designs interior spaces for functionality and aesthetics.',
            salary_range: '₹4-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'arch-4',
            title: 'Urban Planner',
            field: 'architecture',
            level: 'Advanced',
            requiredSkills: ['Urban Design', 'GIS', 'Policy', 'Sustainability', 'Community Engagement'],
            description: 'Plans and designs urban development projects.',
            salary_range: '₹7-20 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'arch-5',
            title: 'Construction Manager',
            field: 'architecture',
            level: 'Intermediate',
            requiredSkills: ['Project Management', 'Budgeting', 'Safety', 'Team Leadership', 'Construction Knowledge'],
            description: 'Manages construction projects from start to completion.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'High'
        }
    ],
    social: [
        {
            id: 'soc-1',
            title: 'Social Worker',
            field: 'social',
            level: 'Beginner',
            requiredSkills: ['Counseling', 'Empathy', 'Communication', 'Case Management', 'Community Work'],
            description: 'Helps individuals and communities overcome challenges.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'soc-2',
            title: 'NGO Program Manager',
            field: 'social',
            level: 'Intermediate',
            requiredSkills: ['Program Management', 'Fundraising', 'Leadership', 'Communication', 'Project Planning'],
            description: 'Manages programs and operations for non-profit organizations.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'soc-3',
            title: 'Community Development Officer',
            field: 'social',
            level: 'Intermediate',
            requiredSkills: ['Community Engagement', 'Development', 'Research', 'Communication', 'Leadership'],
            description: 'Works to improve community welfare and development.',
            salary_range: '₹4-10 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'soc-4',
            title: 'Human Rights Activist',
            field: 'social',
            level: 'Advanced',
            requiredSkills: ['Advocacy', 'Legal Knowledge', 'Communication', 'Research', 'Networking'],
            description: 'Advocates for human rights and social justice.',
            salary_range: '₹5-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'soc-5',
            title: 'Disaster Relief Coordinator',
            field: 'social',
            level: 'Intermediate',
            requiredSkills: ['Emergency Management', 'Coordination', 'Logistics', 'Communication', 'Decision Making'],
            description: 'Coordinates relief efforts during disasters and emergencies.',
            salary_range: '₹5-12 LPA',
            growth_potential: 'Medium'
        }
    ],
    performing: [
        {
            id: 'per-1',
            title: 'Professional Musician',
            field: 'performing',
            level: 'Advanced',
            requiredSkills: ['Musical Instrument', 'Theory', 'Performance', 'Practice', 'Stage Presence'],
            description: 'Performs music professionally in concerts and recordings.',
            salary_range: '₹4-30 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'per-2',
            title: 'Actor/Actress',
            field: 'performing',
            level: 'Intermediate',
            requiredSkills: ['Acting', 'Voice', 'Movement', 'Script Analysis', 'Emotional Range'],
            description: 'Performs in films, theater, and television productions.',
            salary_range: '₹3-50 LPA',
            growth_potential: 'High'
        },
        {
            id: 'per-3',
            title: 'Dancer',
            field: 'performing',
            level: 'Intermediate',
            requiredSkills: ['Dance Technique', 'Choreography', 'Physical Fitness', 'Performance', 'Creativity'],
            description: 'Performs dance in various styles and settings.',
            salary_range: '₹3-20 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'per-4',
            title: 'Theater Director',
            field: 'performing',
            level: 'Advanced',
            requiredSkills: ['Direction', 'Script Analysis', 'Leadership', 'Communication', 'Vision'],
            description: 'Directs theatrical productions and performances.',
            salary_range: '₹5-25 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'per-5',
            title: 'Music Producer',
            field: 'performing',
            level: 'Advanced',
            requiredSkills: ['Audio Engineering', 'DAW', 'Music Theory', 'Creativity', 'Technical Skills'],
            description: 'Produces and records music for artists and films.',
            salary_range: '₹6-30 LPA',
            growth_potential: 'High'
        }
    ],
    journalism: [
        {
            id: 'jour-1',
            title: 'News Reporter',
            field: 'journalism',
            level: 'Beginner',
            requiredSkills: ['Reporting', 'Writing', 'Communication', 'Ethics', 'Current Affairs'],
            description: 'Reports news and current events for media outlets.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'jour-2',
            title: 'News Anchor',
            field: 'journalism',
            level: 'Intermediate',
            requiredSkills: ['Broadcasting', 'Communication', 'Presentation', 'Current Affairs', 'Confidence'],
            description: 'Presents news and current affairs on television.',
            salary_range: '₹5-20 LPA',
            growth_potential: 'High'
        },
        {
            id: 'jour-3',
            title: 'Investigative Journalist',
            field: 'journalism',
            level: 'Advanced',
            requiredSkills: ['Investigation', 'Research', 'Writing', 'Ethics', 'Persistence'],
            description: 'Investigates and exposes corruption and wrongdoing.',
            salary_range: '₹6-25 LPA',
            growth_potential: 'High'
        },
        {
            id: 'jour-4',
            title: 'Public Relations Officer',
            field: 'journalism',
            level: 'Intermediate',
            requiredSkills: ['Communication', 'Media Relations', 'Writing', 'Crisis Management', 'Networking'],
            description: 'Manages public image and media relations for organizations.',
            salary_range: '₹4-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'jour-5',
            title: 'Content Strategist',
            field: 'journalism',
            level: 'Intermediate',
            requiredSkills: ['Content Planning', 'SEO', 'Analytics', 'Writing', 'Strategy'],
            description: 'Develops content strategies for digital platforms.',
            salary_range: '₹5-18 LPA',
            growth_potential: 'High'
        }
    ],
    fashion: [
        {
            id: 'fash-1',
            title: 'Fashion Designer',
            field: 'fashion',
            level: 'Intermediate',
            requiredSkills: ['Design', 'Sketching', 'Pattern Making', 'Fabrics', 'Trend Analysis'],
            description: 'Creates clothing and accessory designs for fashion industry.',
            salary_range: '₹4-20 LPA',
            growth_potential: 'High'
        },
        {
            id: 'fash-2',
            title: 'Textile Engineer',
            field: 'fashion',
            level: 'Advanced',
            requiredSkills: ['Textile Technology', 'Manufacturing', 'Quality Control', 'Materials Science', 'Innovation'],
            description: 'Develops and improves textile production processes.',
            salary_range: '₹5-15 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'fash-3',
            title: 'Fashion Stylist',
            field: 'fashion',
            level: 'Beginner',
            requiredSkills: ['Styling', 'Fashion Trends', 'Communication', 'Creativity', 'Client Management'],
            description: 'Styles outfits for clients, photoshoots, and events.',
            salary_range: '₹3-12 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'fash-4',
            title: 'Merchandiser',
            field: 'fashion',
            level: 'Intermediate',
            requiredSkills: ['Product Planning', 'Market Analysis', 'Negotiation', 'Trends', 'Supply Chain'],
            description: 'Plans and manages fashion product inventory and sales.',
            salary_range: '₹4-14 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'fash-5',
            title: 'Fashion Photographer',
            field: 'fashion',
            level: 'Intermediate',
            requiredSkills: ['Photography', 'Lighting', 'Editing', 'Creativity', 'Fashion Knowledge'],
            description: 'Photographs fashion products and models for campaigns.',
            salary_range: '₹4-18 LPA',
            growth_potential: 'High'
        }
    ],
    library: [
        {
            id: 'lib-1',
            title: 'Librarian',
            field: 'library',
            level: 'Beginner',
            requiredSkills: ['Library Management', 'Cataloging', 'Research Assistance', 'Organization', 'Communication'],
            description: 'Manages library resources and assists patrons.',
            salary_range: '₹3-8 LPA',
            growth_potential: 'Low'
        },
        {
            id: 'lib-2',
            title: 'Information Architect',
            field: 'library',
            level: 'Advanced',
            requiredSkills: ['Information Design', 'UX', 'Data Organization', 'Taxonomy', 'Technical Skills'],
            description: 'Organizes and structures information for accessibility.',
            salary_range: '₹8-20 LPA',
            growth_potential: 'High'
        },
        {
            id: 'lib-3',
            title: 'Digital Archivist',
            field: 'library',
            level: 'Intermediate',
            requiredSkills: ['Digital Preservation', 'Metadata', 'Database Management', 'Technology', 'Organization'],
            description: 'Preserves and manages digital collections and archives.',
            salary_range: '₹5-14 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'lib-4',
            title: 'Knowledge Manager',
            field: 'library',
            level: 'Advanced',
            requiredSkills: ['Knowledge Systems', 'Information Management', 'Strategy', 'Technology', 'Communication'],
            description: 'Manages organizational knowledge and information systems.',
            salary_range: '₹7-18 LPA',
            growth_potential: 'High'
        },
        {
            id: 'lib-5',
            title: 'Research Librarian',
            field: 'library',
            level: 'Intermediate',
            requiredSkills: ['Research Methods', 'Database Search', 'Academic Knowledge', 'Communication', 'Analysis'],
            description: 'Assists researchers with information and resources.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'Medium'
        }
    ],
    pharmacy: [
        {
            id: 'phar-1',
            title: 'Clinical Pharmacist',
            field: 'pharmacy',
            level: 'Intermediate',
            requiredSkills: ['Pharmacy', 'Patient Care', 'Drug Therapy', 'Communication', 'Clinical Knowledge'],
            description: 'Provides pharmaceutical care in clinical settings.',
            salary_range: '₹5-15 LPA',
            growth_potential: 'High'
        },
        {
            id: 'phar-2',
            title: 'Pharmaceutical Researcher',
            field: 'pharmacy',
            level: 'Advanced',
            requiredSkills: ['Research', 'Drug Development', 'Analysis', 'Lab Skills', 'Scientific Writing'],
            description: 'Conducts research in pharmaceutical sciences.',
            salary_range: '₹8-25 LPA',
            growth_potential: 'High'
        },
        {
            id: 'phar-3',
            title: 'Regulatory Affairs Specialist',
            field: 'pharmacy',
            level: 'Advanced',
            requiredSkills: ['Regulations', 'Documentation', 'Compliance', 'Pharmaceutical Knowledge', 'Communication'],
            description: 'Ensures pharmaceutical products meet regulatory standards.',
            salary_range: '₹7-20 LPA',
            growth_potential: 'High'
        },
        {
            id: 'phar-4',
            title: 'Hospital Pharmacist',
            field: 'pharmacy',
            level: 'Beginner',
            requiredSkills: ['Pharmacy', 'Medication Management', 'Patient Interaction', 'Documentation', 'Ethics'],
            description: 'Dispenses medications in hospital settings.',
            salary_range: '₹4-10 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'phar-5',
            title: 'Drug Safety Specialist',
            field: 'pharmacy',
            level: 'Intermediate',
            requiredSkills: ['Pharmacovigilance', 'Analysis', 'Reporting', 'Regulations', 'Medical Knowledge'],
            description: 'Monitors and reports drug safety and adverse effects.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'High'
        }
    ],
    food: [
        {
            id: 'food-1',
            title: 'Food Technologist',
            field: 'food',
            level: 'Intermediate',
            requiredSkills: ['Food Science', 'Processing', 'Quality Control', 'Safety', 'Innovation'],
            description: 'Develops and improves food products and processes.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'food-2',
            title: 'Nutritionist/Dietitian',
            field: 'food',
            level: 'Beginner',
            requiredSkills: ['Nutrition Science', 'Diet Planning', 'Counseling', 'Communication', 'Health Knowledge'],
            description: 'Provides nutrition advice and diet planning services.',
            salary_range: '₹3-10 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'food-3',
            title: 'Food Safety Officer',
            field: 'food',
            level: 'Intermediate',
            requiredSkills: ['Food Safety', 'Regulations', 'Inspection', 'Testing', 'Documentation'],
            description: 'Ensures food products meet safety standards.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'food-4',
            title: 'Product Development Specialist',
            field: 'food',
            level: 'Advanced',
            requiredSkills: ['Food Science', 'Innovation', 'R&D', 'Market Research', 'Project Management'],
            description: 'Develops new food products for the market.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'High'
        },
        {
            id: 'food-5',
            title: 'Quality Assurance Manager',
            field: 'food',
            level: 'Advanced',
            requiredSkills: ['Quality Management', 'Standards', 'Auditing', 'Leadership', 'Food Technology'],
            description: 'Manages quality standards in food production.',
            salary_range: '₹7-20 LPA',
            growth_potential: 'High'
        }
    ],
    veterinary: [
        {
            id: 'vet-1',
            title: 'Veterinarian',
            field: 'veterinary',
            level: 'Advanced',
            requiredSkills: ['BVSc', 'Animal Medicine', 'Surgery', 'Diagnosis', 'Compassion'],
            description: 'Provides medical care to animals and pets.',
            salary_range: '₹5-20 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'vet-2',
            title: 'Veterinary Surgeon',
            field: 'veterinary',
            level: 'Advanced',
            requiredSkills: ['Surgery', 'Anesthesia', 'Animal Anatomy', 'Emergency Care', 'Precision'],
            description: 'Performs surgical procedures on animals.',
            salary_range: '₹8-25 LPA',
            growth_potential: 'High'
        },
        {
            id: 'vet-3',
            title: 'Animal Nutritionist',
            field: 'veterinary',
            level: 'Intermediate',
            requiredSkills: ['Animal Nutrition', 'Feed Formulation', 'Research', 'Animal Science', 'Analysis'],
            description: 'Develops nutrition plans for animals and livestock.',
            salary_range: '₹4-12 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'vet-4',
            title: 'Wildlife Veterinarian',
            field: 'veterinary',
            level: 'Advanced',
            requiredSkills: ['Wildlife Medicine', 'Conservation', 'Field Work', 'Adaptability', 'Research'],
            description: 'Provides medical care to wild animals and supports conservation.',
            salary_range: '₹6-18 LPA',
            growth_potential: 'Medium'
        },
        {
            id: 'vet-5',
            title: 'Veterinary Researcher',
            field: 'veterinary',
            level: 'Advanced',
            requiredSkills: ['Research', 'Animal Science', 'Lab Skills', 'Data Analysis', 'Scientific Writing'],
            description: 'Conducts research in veterinary sciences.',
            salary_range: '₹7-20 LPA',
            growth_potential: 'High'
        }
    ]
};
