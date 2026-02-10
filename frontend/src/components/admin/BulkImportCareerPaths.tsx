import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { toast } from 'sonner';
import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

// Complete career paths data for all 22 fields
const allCareerPathsData = [
    // 1. ENGINEERING & TECHNOLOGY
    { title: "Software Developer", field: "engineering", level: "Beginner", requiredSkills: ["JavaScript", "Python", "Git", "HTML/CSS", "Problem Solving"] },
    { title: "Full Stack Engineer", field: "engineering", level: "Intermediate", requiredSkills: ["React", "Node.js", "MongoDB", "REST APIs", "DevOps"] },
    { title: "AI/ML Engineer", field: "engineering", level: "Advanced", requiredSkills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "Statistics"] },
    { title: "Cloud Architect", field: "engineering", level: "Advanced", requiredSkills: ["AWS", "Azure", "Kubernetes", "Docker", "Microservices"] },
    { title: "DevOps Engineer", field: "engineering", level: "Intermediate", requiredSkills: ["CI/CD", "Jenkins", "Docker", "Kubernetes", "Linux"] },

    // 2. MEDICAL & HEALTH SCIENCES
    { title: "General Physician", field: "medical", level: "Beginner", requiredSkills: ["MBBS", "Clinical Diagnosis", "Patient Care", "Medical Ethics", "Communication"] },
    { title: "Cardiologist", field: "medical", level: "Advanced", requiredSkills: ["MD Cardiology", "ECG Analysis", "Cardiac Surgery", "Patient Management"] },
    { title: "Medical Researcher", field: "medical", level: "Advanced", requiredSkills: ["PhD", "Clinical Trials", "Data Analysis", "Research Methodology", "Biostatistics"] },
    { title: "Physiotherapist", field: "medical", level: "Intermediate", requiredSkills: ["BPT", "Rehabilitation", "Manual Therapy", "Exercise Prescription"] },
    { title: "Pharmacist", field: "medical", level: "Beginner", requiredSkills: ["B.Pharm", "Drug Knowledge", "Patient Counseling", "Medication Management"] },

    // 3. SCIENCE & RESEARCH
    { title: "Research Scientist", field: "science", level: "Advanced", requiredSkills: ["PhD", "Research Design", "Data Analysis", "Scientific Writing", "Lab Techniques"] },
    { title: "Data Scientist", field: "science", level: "Intermediate", requiredSkills: ["Python", "R", "Machine Learning", "Statistics", "SQL"] },
    { title: "Biotechnologist", field: "science", level: "Intermediate", requiredSkills: ["Molecular Biology", "Genetic Engineering", "Lab Skills", "Bioinformatics"] },
    { title: "Environmental Scientist", field: "science", level: "Beginner", requiredSkills: ["Environmental Studies", "GIS", "Data Collection", "Report Writing"] },
    { title: "Astrophysicist", field: "science", level: "Advanced", requiredSkills: ["Physics", "Mathematics", "Programming", "Data Analysis", "Cosmology"] },

    // 4. ARTS, HUMANITIES & DEGREE
    { title: "Content Writer", field: "arts", level: "Beginner", requiredSkills: ["Creative Writing", "Grammar", "SEO", "Research", "Storytelling"] },
    { title: "Journalist", field: "arts", level: "Intermediate", requiredSkills: ["Reporting", "Interviewing", "News Writing", "Ethics", "Communication"] },
    { title: "Historian", field: "arts", level: "Advanced", requiredSkills: ["Research Methodology", "Archival Studies", "Critical Analysis", "Writing"] },
    { title: "Psychologist", field: "arts", level: "Intermediate", requiredSkills: ["Psychology", "Counseling", "Assessment", "Empathy", "Communication"] },
    { title: "Digital Marketer", field: "arts", level: "Beginner", requiredSkills: ["Social Media", "Content Marketing", "Analytics", "SEO", "Copywriting"] },

    // 5. COMMERCE, BUSINESS & MANAGEMENT
    { title: "Financial Analyst", field: "commerce", level: "Intermediate", requiredSkills: ["Financial Modeling", "Excel", "Accounting", "Valuation", "Analysis"] },
    { title: "Business Consultant", field: "commerce", level: "Advanced", requiredSkills: ["Strategy", "Problem Solving", "Communication", "Industry Knowledge", "Analytics"] },
    { title: "Chartered Accountant", field: "commerce", level: "Advanced", requiredSkills: ["Accounting", "Taxation", "Auditing", "Financial Reporting", "Compliance"] },
    { title: "Investment Banker", field: "commerce", level: "Advanced", requiredSkills: ["Finance", "Valuation", "M&A", "Modeling", "Negotiation"] },
    { title: "Marketing Manager", field: "commerce", level: "Intermediate", requiredSkills: ["Marketing Strategy", "Brand Management", "Analytics", "Communication", "Leadership"] },

    // 6. LAW & PUBLIC SERVICES
    { title: "Corporate Lawyer", field: "law", level: "Advanced", requiredSkills: ["LLB", "Contract Law", "Negotiation", "Legal Research", "Drafting"] },
    { title: "Civil Services Officer", field: "law", level: "Advanced", requiredSkills: ["Administration", "Policy Making", "Leadership", "Public Relations", "Ethics"] },
    { title: "Legal Advisor", field: "law", level: "Intermediate", requiredSkills: ["Legal Knowledge", "Advisory", "Research", "Communication", "Ethics"] },
    { title: "Paralegal", field: "law", level: "Beginner", requiredSkills: ["Legal Research", "Documentation", "Case Management", "Communication"] },
    { title: "Judge/Magistrate", field: "law", level: "Advanced", requiredSkills: ["Judicial Experience", "Legal Knowledge", "Decision Making", "Ethics", "Impartiality"] },

    // 7. EDUCATION & TEACHING
    { title: "School Teacher", field: "education", level: "Beginner", requiredSkills: ["B.Ed", "Subject Knowledge", "Classroom Management", "Communication", "Patience"] },
    { title: "Professor/Lecturer", field: "education", level: "Advanced", requiredSkills: ["PhD", "Research", "Teaching", "Subject Expertise", "Publication"] },
    { title: "Educational Consultant", field: "education", level: "Intermediate", requiredSkills: ["Curriculum Design", "Assessment", "Training", "Communication", "Analysis"] },
    { title: "E-Learning Designer", field: "education", level: "Intermediate", requiredSkills: ["Instructional Design", "LMS", "Multimedia", "Pedagogy", "Technology"] },
    { title: "Career Counselor", field: "education", level: "Beginner", requiredSkills: ["Counseling", "Assessment", "Communication", "Empathy", "Career Knowledge"] },

    // 8. DESIGN, MEDIA & CREATIVE ARTS
    { title: "Graphic Designer", field: "design", level: "Beginner", requiredSkills: ["Adobe Photoshop", "Illustrator", "Typography", "Color Theory", "Creativity"] },
    { title: "UI/UX Designer", field: "design", level: "Intermediate", requiredSkills: ["Figma", "User Research", "Prototyping", "Wireframing", "Design Thinking"] },
    { title: "Video Editor", field: "design", level: "Intermediate", requiredSkills: ["Premiere Pro", "After Effects", "Storytelling", "Color Grading", "Audio Editing"] },
    { title: "3D Animator", field: "design", level: "Advanced", requiredSkills: ["Blender", "Maya", "3D Modeling", "Animation", "Texturing"] },
    { title: "Art Director", field: "design", level: "Advanced", requiredSkills: ["Creative Direction", "Team Leadership", "Branding", "Design Strategy", "Communication"] },

    // 9. DEFENSE, SECURITY & PHYSICAL SERVICES
    { title: "Army Officer", field: "defense", level: "Intermediate", requiredSkills: ["Leadership", "Physical Fitness", "Strategy", "Discipline", "Teamwork"] },
    { title: "Cybersecurity Specialist", field: "defense", level: "Advanced", requiredSkills: ["Network Security", "Ethical Hacking", "Cryptography", "Incident Response", "Linux"] },
    { title: "Police Officer", field: "defense", level: "Beginner", requiredSkills: ["Law Enforcement", "Physical Fitness", "Communication", "Investigation", "Ethics"] },
    { title: "Firefighter", field: "defense", level: "Beginner", requiredSkills: ["Emergency Response", "Physical Fitness", "First Aid", "Teamwork", "Courage"] },
    { title: "Intelligence Analyst", field: "defense", level: "Advanced", requiredSkills: ["Analysis", "Critical Thinking", "Research", "Communication", "Security Clearance"] },

    // 10. AGRICULTURE & ENVIRONMENTAL STUDIES
    { title: "Agricultural Scientist", field: "agriculture", level: "Advanced", requiredSkills: ["Agronomy", "Research", "Crop Management", "Soil Science", "Data Analysis"] },
    { title: "Farm Manager", field: "agriculture", level: "Intermediate", requiredSkills: ["Farm Operations", "Crop Planning", "Equipment Management", "Business Skills"] },
    { title: "Environmental Consultant", field: "agriculture", level: "Intermediate", requiredSkills: ["Environmental Impact", "Sustainability", "Regulations", "Reporting", "Analysis"] },
    { title: "Horticulturist", field: "agriculture", level: "Beginner", requiredSkills: ["Plant Science", "Gardening", "Pest Management", "Soil Care", "Landscape Design"] },
    { title: "Agricultural Engineer", field: "agriculture", level: "Advanced", requiredSkills: ["Engineering", "Irrigation", "Machinery", "Technology", "Problem Solving"] },

    // 11. AVIATION & AEROSPACE
    { title: "Commercial Pilot", field: "aviation", level: "Advanced", requiredSkills: ["CPL License", "Aircraft Operations", "Navigation", "Communication", "Decision Making"] },
    { title: "Aerospace Engineer", field: "aviation", level: "Advanced", requiredSkills: ["Aerodynamics", "CAD", "Propulsion", "Materials Science", "Problem Solving"] },
    { title: "Air Traffic Controller", field: "aviation", level: "Intermediate", requiredSkills: ["ATC License", "Communication", "Decision Making", "Stress Management", "Radar Operation"] },
    { title: "Aircraft Maintenance Engineer", field: "aviation", level: "Intermediate", requiredSkills: ["AME License", "Aircraft Systems", "Troubleshooting", "Safety", "Documentation"] },
    { title: "Flight Attendant", field: "aviation", level: "Beginner", requiredSkills: ["Customer Service", "Safety Procedures", "Communication", "First Aid", "Languages"] },

    // 12. SPORTS & FITNESS
    { title: "Professional Athlete", field: "sports", level: "Advanced", requiredSkills: ["Sport-Specific Skills", "Physical Fitness", "Mental Toughness", "Discipline", "Teamwork"] },
    { title: "Sports Coach", field: "sports", level: "Intermediate", requiredSkills: ["Coaching", "Strategy", "Communication", "Leadership", "Sport Knowledge"] },
    { title: "Fitness Trainer", field: "sports", level: "Beginner", requiredSkills: ["Exercise Science", "Nutrition", "Motivation", "Communication", "First Aid"] },
    { title: "Sports Physiotherapist", field: "sports", level: "Advanced", requiredSkills: ["Physiotherapy", "Sports Medicine", "Rehabilitation", "Anatomy", "Manual Therapy"] },
    { title: "Sports Manager", field: "sports", level: "Intermediate", requiredSkills: ["Management", "Negotiation", "Marketing", "Event Planning", "Communication"] },

    // 13. HOSPITALITY & TOURISM
    { title: "Hotel Manager", field: "hospitality", level: "Intermediate", requiredSkills: ["Hospitality Management", "Customer Service", "Operations", "Leadership", "Communication"] },
    { title: "Chef", field: "hospitality", level: "Intermediate", requiredSkills: ["Culinary Arts", "Menu Planning", "Food Safety", "Creativity", "Team Management"] },
    { title: "Tour Guide", field: "hospitality", level: "Beginner", requiredSkills: ["Communication", "Local Knowledge", "Languages", "Customer Service", "Storytelling"] },
    { title: "Event Manager", field: "hospitality", level: "Intermediate", requiredSkills: ["Event Planning", "Coordination", "Budgeting", "Vendor Management", "Problem Solving"] },
    { title: "Travel Consultant", field: "hospitality", level: "Beginner", requiredSkills: ["Destination Knowledge", "Booking Systems", "Communication", "Sales", "Customer Service"] },

    // 14. ARCHITECTURE & CONSTRUCTION
    { title: "Architect", field: "architecture", level: "Advanced", requiredSkills: ["AutoCAD", "3D Modeling", "Design", "Building Codes", "Project Management"] },
    { title: "Civil Engineer", field: "architecture", level: "Advanced", requiredSkills: ["Structural Analysis", "CAD", "Construction Management", "Materials", "Problem Solving"] },
    { title: "Interior Designer", field: "architecture", level: "Intermediate", requiredSkills: ["Space Planning", "Design Software", "Color Theory", "Materials", "Client Management"] },
    { title: "Urban Planner", field: "architecture", level: "Advanced", requiredSkills: ["Urban Design", "GIS", "Policy", "Sustainability", "Community Engagement"] },
    { title: "Construction Manager", field: "architecture", level: "Intermediate", requiredSkills: ["Project Management", "Budgeting", "Safety", "Team Leadership", "Construction Knowledge"] },

    // 15. SOCIAL WORK & NGO
    { title: "Social Worker", field: "social", level: "Beginner", requiredSkills: ["Counseling", "Empathy", "Communication", "Case Management", "Community Work"] },
    { title: "NGO Program Manager", field: "social", level: "Intermediate", requiredSkills: ["Program Management", "Fundraising", "Leadership", "Communication", "Project Planning"] },
    { title: "Community Development Officer", field: "social", level: "Intermediate", requiredSkills: ["Community Engagement", "Development", "Research", "Communication", "Leadership"] },
    { title: "Human Rights Activist", field: "social", level: "Advanced", requiredSkills: ["Advocacy", "Legal Knowledge", "Communication", "Research", "Networking"] },
    { title: "Disaster Relief Coordinator", field: "social", level: "Intermediate", requiredSkills: ["Emergency Management", "Coordination", "Logistics", "Communication", "Decision Making"] },

    // 16. PERFORMING ARTS
    { title: "Professional Musician", field: "performing", level: "Advanced", requiredSkills: ["Musical Instrument", "Theory", "Performance", "Practice", "Stage Presence"] },
    { title: "Actor/Actress", field: "performing", level: "Intermediate", requiredSkills: ["Acting", "Voice", "Movement", "Script Analysis", "Emotional Range"] },
    { title: "Dancer", field: "performing", level: "Intermediate", requiredSkills: ["Dance Technique", "Choreography", "Physical Fitness", "Performance", "Creativity"] },
    { title: "Theater Director", field: "performing", level: "Advanced", requiredSkills: ["Direction", "Script Analysis", "Leadership", "Communication", "Vision"] },
    { title: "Music Producer", field: "performing", level: "Advanced", requiredSkills: ["Audio Engineering", "DAW", "Music Theory", "Creativity", "Technical Skills"] },

    // 17. JOURNALISM & MASS COMMUNICATION
    { title: "News Reporter", field: "journalism", level: "Beginner", requiredSkills: ["Reporting", "Writing", "Communication", "Ethics", "Current Affairs"] },
    { title: "News Anchor", field: "journalism", level: "Intermediate", requiredSkills: ["Broadcasting", "Communication", "Presentation", "Current Affairs", "Confidence"] },
    { title: "Investigative Journalist", field: "journalism", level: "Advanced", requiredSkills: ["Investigation", "Research", "Writing", "Ethics", "Persistence"] },
    { title: "Public Relations Officer", field: "journalism", level: "Intermediate", requiredSkills: ["Communication", "Media Relations", "Writing", "Crisis Management", "Networking"] },
    { title: "Content Strategist", field: "journalism", level: "Intermediate", requiredSkills: ["Content Planning", "SEO", "Analytics", "Writing", "Strategy"] },

    // 18. FASHION & TEXTILES
    { title: "Fashion Designer", field: "fashion", level: "Intermediate", requiredSkills: ["Design", "Sketching", "Pattern Making", "Fabrics", "Trend Analysis"] },
    { title: "Textile Engineer", field: "fashion", level: "Advanced", requiredSkills: ["Textile Technology", "Manufacturing", "Quality Control", "Materials Science", "Innovation"] },
    { title: "Fashion Stylist", field: "fashion", level: "Beginner", requiredSkills: ["Styling", "Fashion Trends", "Communication", "Creativity", "Client Management"] },
    { title: "Merchandiser", field: "fashion", level: "Intermediate", requiredSkills: ["Product Planning", "Market Analysis", "Negotiation", "Trends", "Supply Chain"] },
    { title: "Fashion Photographer", field: "fashion", level: "Intermediate", requiredSkills: ["Photography", "Lighting", "Editing", "Creativity", "Fashion Knowledge"] },

    // 19. LIBRARY & INFORMATION SCIENCE
    { title: "Librarian", field: "library", level: "Beginner", requiredSkills: ["Library Management", "Cataloging", "Research Assistance", "Organization", "Communication"] },
    { title: "Information Architect", field: "library", level: "Advanced", requiredSkills: ["Information Design", "UX", "Data Organization", "Taxonomy", "Technical Skills"] },
    { title: "Digital Archivist", field: "library", level: "Intermediate", requiredSkills: ["Digital Preservation", "Metadata", "Database Management", "Technology", "Organization"] },
    { title: "Knowledge Manager", field: "library", level: "Advanced", requiredSkills: ["Knowledge Systems", "Information Management", "Strategy", "Technology", "Communication"] },
    { title: "Research Librarian", field: "library", level: "Intermediate", requiredSkills: ["Research Methods", "Database Search", "Academic Knowledge", "Communication", "Analysis"] },

    // 20. PHARMACY & PHARMACEUTICAL SCIENCES
    { title: "Clinical Pharmacist", field: "pharmacy", level: "Intermediate", requiredSkills: ["Pharmacy", "Patient Care", "Drug Therapy", "Communication", "Clinical Knowledge"] },
    { title: "Pharmaceutical Researcher", field: "pharmacy", level: "Advanced", requiredSkills: ["Research", "Drug Development", "Analysis", "Lab Skills", "Scientific Writing"] },
    { title: "Regulatory Affairs Specialist", field: "pharmacy", level: "Advanced", requiredSkills: ["Regulations", "Documentation", "Compliance", "Pharmaceutical Knowledge", "Communication"] },
    { title: "Hospital Pharmacist", field: "pharmacy", level: "Beginner", requiredSkills: ["Pharmacy", "Medication Management", "Patient Interaction", "Documentation", "Ethics"] },
    { title: "Drug Safety Specialist", field: "pharmacy", level: "Intermediate", requiredSkills: ["Pharmacovigilance", "Analysis", "Reporting", "Regulations", "Medical Knowledge"] },

    // 21. FOOD TECHNOLOGY & NUTRITION
    { title: "Food Technologist", field: "food", level: "Intermediate", requiredSkills: ["Food Science", "Processing", "Quality Control", "Safety", "Innovation"] },
    { title: "Nutritionist/Dietitian", field: "food", level: "Beginner", requiredSkills: ["Nutrition Science", "Diet Planning", "Counseling", "Communication", "Health Knowledge"] },
    { title: "Food Safety Officer", field: "food", level: "Intermediate", requiredSkills: ["Food Safety", "Regulations", "Inspection", "Testing", "Documentation"] },
    { title: "Product Development Specialist", field: "food", level: "Advanced", requiredSkills: ["Food Science", "Innovation", "R&D", "Market Research", "Project Management"] },
    { title: "Quality Assurance Manager", field: "food", level: "Advanced", requiredSkills: ["Quality Management", "Standards", "Auditing", "Leadership", "Food Technology"] },

    // 22. VETERINARY SCIENCE
    { title: "Veterinarian", field: "veterinary", level: "Advanced", requiredSkills: ["BVSc", "Animal Medicine", "Surgery", "Diagnosis", "Compassion"] },
    { title: "Veterinary Surgeon", field: "veterinary", level: "Advanced", requiredSkills: ["Surgery", "Anesthesia", "Animal Anatomy", "Emergency Care", "Precision"] },
    { title: "Animal Nutritionist", field: "veterinary", level: "Intermediate", requiredSkills: ["Animal Nutrition", "Feed Formulation", "Research", "Animal Science", "Analysis"] },
    { title: "Wildlife Veterinarian", field: "veterinary", level: "Advanced", requiredSkills: ["Wildlife Medicine", "Conservation", "Field Work", "Adaptability", "Research"] },
    { title: "Veterinary Researcher", field: "veterinary", level: "Advanced", requiredSkills: ["Research", "Animal Science", "Lab Skills", "Data Analysis", "Scientific Writing"] }
];

export function BulkImportCareerPaths() {
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleBulkImport = async () => {
        // Check if data already exists
        try {
            const existingDocs = await getDocs(collection(db, 'career_paths'));
            if (existingDocs.size > 0) {
                const confirmOverwrite = window.confirm(
                    `Database already has ${existingDocs.size} career paths. Do you want to add ${allCareerPathsData.length} more paths?`
                );
                if (!confirmOverwrite) return;
            }
        } catch (error) {
            console.error('Error checking existing data:', error);
        }

        setImporting(true);
        setProgress(0);

        const pathsRef = collection(db, 'career_paths');
        let successCount = 0;
        let errorCount = 0;

        try {
            toast.info(`Starting import of ${allCareerPathsData.length} career paths...`);

            for (let i = 0; i < allCareerPathsData.length; i++) {
                const pathData = allCareerPathsData[i];

                try {
                    await addDoc(pathsRef, {
                        ...pathData,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        verified: true
                    });
                    successCount++;
                    setProgress(Math.round(((i + 1) / allCareerPathsData.length) * 100));
                } catch (error) {
                    console.error(`Error adding path: ${pathData.title}`, error);
                    errorCount++;
                }

                // Small delay to prevent rate limiting
                if (i % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            toast.success(
                `✅ Import Complete! Added ${successCount} paths${errorCount > 0 ? `, ${errorCount} errors` : ''}`
            );

            console.log(`
        ✅ Career Paths Import Summary:
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Total Paths: ${allCareerPathsData.length}
        Successful: ${successCount}
        Errors: ${errorCount}
        Fields Covered: 22
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);

        } catch (error) {
            console.error('Bulk import error:', error);
            toast.error('Import failed. Check console for details.');
        } finally {
            setImporting(false);
            setProgress(0);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-6">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                        Bulk Import Career Paths
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Import <span className="font-bold text-primary">{allCareerPathsData.length} pre-defined career paths</span> covering all <span className="font-bold text-primary">22 fields</span>.
                        This will populate the database with comprehensive career data for all users.
                    </p>

                    {importing && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Importing...</span>
                                <span className="font-semibold text-primary">{progress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={handleBulkImport}
                            disabled={importing}
                            className="gap-2"
                        >
                            {importing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Importing {progress}%
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Import All {allCareerPathsData.length} Paths
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="bg-white dark:bg-gray-800 rounded px-2 py-1.5">
                            <span className="text-muted-foreground">Total:</span>{' '}
                            <span className="font-semibold">{allCareerPathsData.length}</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded px-2 py-1.5">
                            <span className="text-muted-foreground">Fields:</span>{' '}
                            <span className="font-semibold">22</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded px-2 py-1.5">
                            <span className="text-muted-foreground">Per Field:</span>{' '}
                            <span className="font-semibold">~5</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded px-2 py-1.5">
                            <span className="text-muted-foreground">Levels:</span>{' '}
                            <span className="font-semibold">3</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
