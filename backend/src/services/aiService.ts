import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface UserProfile {
    semester?: number;
    skills?: string[];
    careerGoal?: string;
}

interface RoadmapPhase {
    id: number;
    title: string;
    duration: string;
    focus: string;
    skills: string[];
    tools: string[];
    projects: string[];
    certifications: string[];
    careerRelevance: string;
}

export async function generateRoadmap(
    fieldId: string,
    specializationId: string,
    userProfile?: UserProfile
): Promise<RoadmapPhase[]> {
    try {
        const prompt = createRoadmapPrompt(fieldId, specializationId, userProfile);

        // Get the generative model
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
            },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();

        if (!content) {
            throw new Error('No content received from Gemini');
        }

        const parsed = JSON.parse(content);
        return parsed.phases || [];
    } catch (error) {
        console.error('Error generating roadmap with Gemini:', error);
        throw new Error('Failed to generate roadmap with AI');
    }
}

function createRoadmapPrompt(
    fieldId: string,
    specializationId: string,
    userProfile?: UserProfile
): string {
    const fieldMap: Record<string, string> = {
        'computer-science': 'Computer Science',
        'data-science': 'Data Science',
        'artificial-intelligence': 'Artificial Intelligence',
        'cybersecurity': 'Cybersecurity',
        'web-development': 'Web Development',
        'mobile-development': 'Mobile Development',
    };

    const specializationMap: Record<string, string> = {
        'full-stack': 'Full Stack Development',
        'frontend': 'Frontend Development',
        'backend': 'Backend Development',
        'devops': 'DevOps Engineering',
        'machine-learning': 'Machine Learning',
        'data-engineering': 'Data Engineering',
        'cloud-computing': 'Cloud Computing',
        'blockchain': 'Blockchain Development',
        'game-development': 'Game Development',
        'mobile-ios': 'iOS Development',
        'mobile-android': 'Android Development',
        'ai-nlp': 'Natural Language Processing',
        'ai-cv': 'Computer Vision',
        'network-security': 'Network Security',
        'ethical-hacking': 'Ethical Hacking',
    };

    const field = fieldMap[fieldId] || fieldId;
    const specialization = specializationMap[specializationId] || specializationId;
    const semester = userProfile?.semester || 1;
    const careerGoal = userProfile?.careerGoal || '';

    return `You are an expert career advisor and curriculum designer. Generate detailed, practical, and industry-relevant learning roadmaps for students. Focus on real-world technologies, certifications, and projects that employers actually look for.

Create a detailed 5-phase learning roadmap for a student in ${field}, specializing in ${specialization}.

Student Context:
- Current Semester: ${semester}
- Career Goal: ${careerGoal || 'Not specified'}

Requirements:
1. Generate exactly 5 phases covering beginner to advanced levels
2. Each phase should be practical and achievable within 2-4 months
3. Include REAL and CURRENT technologies, tools, and certifications (2024-2026)
4. Focus on industry-relevant skills that employers actually seek
5. Include specific project ideas that can be added to a portfolio
6. Mention specific certifications with actual provider names (e.g., AWS Certified Solutions Architect, Google Cloud Professional, etc.)

Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
{
  "phases": [
    {
      "id": 1,
      "title": "Phase name",
      "duration": "2-3 months",
      "focus": "Main learning focus",
      "skills": ["skill1", "skill2", "skill3"],
      "tools": ["tool1", "tool2", "tool3"],
      "projects": ["project1", "project2"],
      "certifications": ["certification1", "certification2"],
      "careerRelevance": "Why this phase matters for career"
    }
  ]
}

Make it practical, current (2024-2026), and career-focused. Use real technology names and actual certifications.`;
}
