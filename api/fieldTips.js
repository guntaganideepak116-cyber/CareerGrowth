// 22 Fields with categorized tips (Career, Certification, Project, Trend, Skill)
const fieldTips = {
    // 1. Computer Science
    cse: [
        { type: 'Career Tip', message: 'Optimize your LinkedIn profile with keywords like "Cloud Computing" and "AI" to attract recruiters.' },
        { type: 'Certification', message: 'Have you considered the "AWS Certified Solutions Architect" certification? It\'s highly valued.' },
        { type: 'Project Idea', message: 'Build a full-stack e-commerce app using the MERN stack to showcase your skills.' },
        { type: 'Trend', message: 'Generative AI is transforming software development. Learn prompt engineering today.' },
        { type: 'Skill', message: 'Mastering Docker and Kubernetes is essential for modern backend roles.' }
    ],
    // 2. Electronics (ECE)
    ece: [
        { type: 'Career Tip', message: 'Networking is key in hardware. Attend embedded systems conferences.' },
        { type: 'Certification', message: 'The "Cisco Certified Network Associate (CCNA)" is a great foundational cert.' },
        { type: 'Project Idea', message: 'Design a simple IoT home automation system using Arduino or Raspberry Pi.' },
        { type: 'Trend', message: '5G technology is opening new roles in telecom and network engineering.' },
        { type: 'Skill', message: 'VLSI design skills are in high demand for chip manufacturing roles.' }
    ],
    // 3. Electrical (EEE)
    eee: [
        { type: 'Career Tip', message: 'Focus on renewable energy sectors for future-proof career growth.' },
        { type: 'Certification', message: 'Certified Energy Manager (CEM) is excellent for sustainability roles.' },
        { type: 'Project Idea', message: 'Simulate a power grid distribution network using MATLAB.' },
        { type: 'Trend', message: 'Electric Vehicles (EVs) are driving massive demand for power electronics engineers.' },
        { type: 'Skill', message: 'Learn PLC programming for industrial automation careers.' }
    ],
    // 4. Mechanical
    mechanical: [
        { type: 'Career Tip', message: 'Gain experience with 3D modeling software to stand out.' },
        { type: 'Certification', message: 'Certified SolidWorks Professional (CSWP) validates your CAD skills.' },
        { type: 'Project Idea', message: 'Design and simulate a robotic arm mechanism.' },
        { type: 'Trend', message: 'Additive manufacturing (3D printing) is revolutionizing prototyping.' },
        { type: 'Skill', message: 'Finite Element Analysis (FEA) is crucial for structural design roles.' }
    ],
    // 5. Civil
    civil: [
        { type: 'Career Tip', message: 'Project management skills are vital for site engineers.' },
        { type: 'Certification', message: 'PMP certification can significantly boost your salary in construction.' },
        { type: 'Project Idea', message: 'Design a sustainable green building layout using AutoCAD.' },
        { type: 'Trend', message: 'BIM (Building Information Modeling) is the standard for modern construction.' },
        { type: 'Skill', message: 'Learn revitalizing old structures for sustainable urban development.' }
    ],
    // 6. Medical
    medical: [
        { type: 'Career Tip', message: 'Consider specializing early. Areas like Radiology are growing fast.' },
        { type: 'Certification', message: 'USMLE Step 1 is the gateway to medical licensure in the US.' },
        { type: 'Project Idea', message: 'Conduct a case study review on recent advancements in telemedicine.' },
        { type: 'Trend', message: 'Telehealth and remote patient monitoring are here to stay.' },
        { type: 'Skill', message: 'Emotional intelligence is as important as clinical skills for patient care.' }
    ],
    // 7. Commerce
    commerce: [
        { type: 'Career Tip', message: 'Internships in "Big 4" firms provide unbeatable experience.' },
        { type: 'Certification', message: 'ACCA or CPA certifications open global accounting opportunities.' },
        { type: 'Project Idea', message: 'Analyze the financial health of a public company using their annual reports.' },
        { type: 'Trend', message: 'Fintech allows for new roles in digital banking and crypto finance.' },
        { type: 'Skill', message: 'Advanced Excel and financial modeling are non-negotiable skills.' }
    ],
    // 8. Arts
    arts: [
        { type: 'Career Tip', message: 'Build a digital portfolio. Behance, Dribbble, or a personal website is a must.' },
        { type: 'Certification', message: 'Google UX Design Certificate is great for transition to tech design.' },
        { type: 'Project Idea', message: 'Create a brand identity package for a fictional sustainable startup.' },
        { type: 'Trend', message: 'Digital art and NFT spaces are creating new revenue streams for artists.' },
        { type: 'Skill', message: 'Mastering Adobe Creative Suite is fundamental for visual careers.' }
    ],
    // 9. Law
    law: [
        { type: 'Career Tip', message: 'Network with alumni. Law is very reputation-driven.' },
        { type: 'Certification', message: 'CIPP/E involves data privacy law, a booming field.' },
        { type: 'Project Idea', message: 'Write a legal opinion piece on AI copyright issues.' },
        { type: 'Trend', message: 'Legal Tech and AI contract review tools are changing the profession.' },
        { type: 'Skill', message: 'Strong negotiation and conflict resolution skills set you apart.' }
    ],
    // 10. Management
    management: [
        { type: 'Career Tip', message: 'Leadership experience in clubs/societies is highly valued by top B-schools.' },
        { type: 'Certification', message: 'Certified Associate in Project Management (CAPM) is a great start.' },
        { type: 'Project Idea', message: 'Develop a comprehensive business plan for a service-based startup.' },
        { type: 'Trend', message: 'Remote team management is a critical modern leadership skill.' },
        { type: 'Skill', message: 'Data-driven decision making is expected in all management roles.' }
    ],
    // 11. Science
    science: [
        { type: 'Career Tip', message: 'Research publications are your currency in academia and R&D.' },
        { type: 'Certification', message: 'Six Sigma Green Belt is valuable for quality control roles.' },
        { type: 'Project Idea', message: 'Conduct a small-scale experiment and document the methodology.' },
        { type: 'Trend', message: 'Biotechnology and genetic engineering are seeing massive investment.' },
        { type: 'Skill', message: 'Data analysis with Python/R is increasingly important in sciences.' }
    ],
    // 12. Agriculture
    agriculture: [
        { type: 'Career Tip', message: 'Agri-tech startups are booming. Look for roles there.' },
        { type: 'Certification', message: 'Certified Crop Adviser (CCA) adds professional credibility.' },
        { type: 'Project Idea', message: 'Design a small-scale hydroponic system plan.' },
        { type: 'Trend', message: 'Precision agriculture using drones and IoT is the future.' },
        { type: 'Skill', message: 'understanding sustainable farming practices is crucial.' }
    ],
    // 13. Aviation
    aviation: [
        { type: 'Career Tip', message: 'Safety certifications are paramount. Never let them expire.' },
        { type: 'Certification', message: 'IATA certifications are recognized globally by airlines.' },
        { type: 'Project Idea', message: 'Analyze flight route efficiency for a hypothetical airline.' },
        { type: 'Trend', message: 'Sustainable aviation fuel (SAF) is a major industry focus.' },
        { type: 'Skill', message: 'Crisis management and quick decision making are essential.' }
    ],
    // 14. Architecture
    architecture: [
        { type: 'Career Tip', message: 'Document your design process, not just the final render.' },
        { type: 'Certification', message: 'LEED Green Associate proves your sustainable design knowledge.' },
        { type: 'Project Idea', message: 'Redesign a public space in your city for better accessibility.' },
        { type: 'Trend', message: 'Smart cities and sustainable urban planning are huge trends.' },
        { type: 'Skill', message: 'Proficiency in Revit and BIM software is now standard.' }
    ],
    // 15. Fashion
    fashion: [
        { type: 'Career Tip', message: 'Internships with established designers are the best way to learn.' },
        { type: 'Certification', message: 'Fashion Business Management courses add strategic value.' },
        { type: 'Project Idea', message: 'Create a sustainable capsule wardrobe collection concept.' },
        { type: 'Trend', message: 'Sustainable and ethical fashion involves transparency in supply chains.' },
        { type: 'Skill', message: 'Digital pattern making and CLO3D skills are in demand.' }
    ],
    // 16. Journalism
    journalism: [
        { type: 'Career Tip', message: 'Build a personal brand on Twitter/X and Substack.' },
        { type: 'Certification', message: 'Digital Marketing certifications help understand audience reach.' },
        { type: 'Project Idea', message: 'Investigate and write a long-form article on a local issue.' },
        { type: 'Trend', message: 'Data journalism involves telling stories with complex datasets.' },
        { type: 'Skill', message: 'Multimedia storytelling (video, audio, text) is expected.' }
    ],
    // 17. Psychology
    psychology: [
        { type: 'Career Tip', message: 'Research experience is crucial for grad school applications.' },
        { type: 'Certification', message: 'Mental Health First Aid certification is a great basic credential.' },
        { type: 'Project Idea', message: 'Conduct a survey on social media usage and mental well-being.' },
        { type: 'Trend', message: 'Industrial-Organizational (I-O) psychology is growing in corporate sectors.' },
        { type: 'Skill', message: 'Statistical analysis (SPSS/R) is key for research roles.' }
    ],
    // 18. Teaching
    teaching: [
        { type: 'Career Tip', message: 'Classroom management skills are often more important than content knowledge initially.' },
        { type: 'Certification', message: 'Google Certified Educator helps with digital classrooms.' },
        { type: 'Project Idea', message: 'Create a comprehensive lesson plan integrating gamification.' },
        { type: 'Trend', message: 'Personalized learning through AI tools is reshaping education.' },
        { type: 'Skill', message: 'Adaptability and patience are your core soft skills.' }
    ],
    // 19. Hotel Management
    'hotel-management': [
        { type: 'Career Tip', message: 'Cross-functional experience (Front desk + F&B) makes you a better manager.' },
        { type: 'Certification', message: 'Certified Hotel Administrator (CHA) is a top executive credential.' },
        { type: 'Project Idea', message: 'Design a guest experience journey map for a luxury hotel.' },
        { type: 'Trend', message: 'Eco-tourism and sustainable hospitality are growing markets.' },
        { type: 'Skill', message: 'Multilingual abilities significantly boost your employability.' }
    ],
    // 20. Sports
    sports: [
        { type: 'Career Tip', message: 'Networking with local clubs is the first step to major leagues.' },
        { type: 'Certification', message: 'CSCS (Certified Strength and Conditioning Specialist) is gold standard.' },
        { type: 'Project Idea', message: 'Develop a training regimen for a specific athletic goal.' },
        { type: 'Trend', message: 'Sports analytics data is driving player recruitment decisions.' },
        { type: 'Skill', message: 'Understanding biomechanics prevents injuries and improves performance.' }
    ],
    // 21. Animation
    animation: [
        { type: 'Career Tip', message: 'A strong demo reel is your most important asset. Keep it under 2 minutes.' },
        { type: 'Certification', message: 'Unity or Unreal Engine certifications open gaming roles.' },
        { type: 'Project Idea', message: 'Create a 10-second character animation showing weight and emotion.' },
        { type: 'Trend', message: 'Real-time rendering is blurring lines between film and games.' },
        { type: 'Skill', message: 'Mastering the 12 principles of animation is timeless.' }
    ],
    // 22. General / Fallback
    general: [
        { type: 'Career Tip', message: 'Consistent learning is the key to career growth. Set aside 1 hour daily.' },
        { type: 'Certification', message: 'Project Management skills are useful in every single industry.' },
        { type: 'Project Idea', message: 'Identify a problem in your daily life and propose a structured solution.' },
        { type: 'Trend', message: 'Remote work requires strong self-discipline and communication skills.' },
        { type: 'Skill', message: 'Communication and detailed documentation save hours of meetings.' }
    ]
};

// Aliases for 22 fields mapping (handling potential variations)
const fieldAliases = {
    'computer-science': 'cse',
    'information-technology': 'cse',
    'electronics': 'ece',
    'electrical': 'eee',
    'mechanical-engineering': 'mechanical',
    'civil-engineering': 'civil',
    'hospitality': 'hotel-management',
    'hospital-admin': 'medical',
    'business': 'commerce',
    'finance': 'commerce',
    'marketing': 'management',
    'hr': 'management',
    'education': 'teaching'
};

module.exports = { fieldTips, fieldAliases };
