# Career Paths Data - Complete Guide

## 📊 Data Summary

✅ **Total Career Paths**: 110  
✅ **Fields Covered**: 22  
✅ **Paths Per Field**: 5 (minimum)  
✅ **Difficulty Levels**: Beginner, Intermediate, Advanced  

## 🎯 All 22 Fields Covered

| # | Field ID | Field Name | Paths Count |
|---|----------|------------|-------------|
| 1 | `engineering` | Engineering & Technology | 5 |
| 2 | `medical` | Medical & Health Sciences | 5 |
| 3 | `science` | Science & Research | 5 |
| 4 | `arts` | Arts, Humanities & Degree | 5 |
| 5 | `commerce` | Commerce, Business & Management | 5 |
| 6 | `law` | Law & Public Services | 5 |
| 7 | `education` | Education & Teaching | 5 |
| 8 | `design` | Design, Media & Creative Arts | 5 |
| 9 | `defense` | Defense, Security & Physical Services | 5 |
| 10 | `agriculture` | Agriculture & Environmental Studies | 5 |
| 11 | `aviation` | Aviation & Aerospace | 5 |
| 12 | `sports` | Sports & Fitness | 5 |
| 13 | `hospitality` | Hospitality & Tourism | 5 |
| 14 | `architecture` | Architecture & Construction | 5 |
| 15 | `social` | Social Work & NGO | 5 |
| 16 | `performing` | Performing Arts | 5 |
| 17 | `journalism` | Journalism & Mass Communication | 5 |
| 18 | `fashion` | Fashion & Textiles | 5 |
| 19 | `library` | Library & Information Science | 5 |
| 20 | `pharmacy` | Pharmacy & Pharmaceutical Sciences | 5 |
| 21 | `food` | Food Technology & Nutrition | 5 |
| 22 | `veterinary` | Veterinary Science | 5 |

## 🚀 Method 1: Import via Admin Panel (Recommended)

### Step-by-Step Guide

1. **Login as Admin**
   ```
   Navigate to: http://localhost:8080/admin
   Login with admin credentials
   ```

2. **Go to Career Paths Manager**
   ```
   Click "Career Paths" in the sidebar
   ```

3. **Add Each Path Manually**
   ```
   For each career path in career_paths_data.js:
   - Click "+ Add New Role"
   - Copy the title, field, level, and skills
   - Click "Save Changes"
   ```

**Pros**: Safe, controlled, validates data  
**Cons**: Time-consuming for 110 paths  

## 🔥 Method 2: Firebase Console Batch Import

### Step-by-Step Guide

1. **Open Firebase Console**
   ```
   Go to: https://console.firebase.google.com
   Select your project
   Go to Firestore Database
   ```

2. **Create Collection**
   ```
   Click "Start collection"
   Collection ID: career_paths
   ```

3. **Add Documents in Batch**
   ```
   For each career path, click "Add document":
   
   Document fields:
   - title (string): "Software Developer"
   - field (string): "engineering"
   - level (string): "Beginner"
   - requiredSkills (array): ["JavaScript", "Python", "Git", ...]
   - createdAt (timestamp): auto
   - updatedAt (timestamp): auto
   - verified (boolean): true
   ```

**Pros**: Direct database access, batch operations  
**Cons**: Manual, error-prone for large datasets  

## 💻 Method 3: Programmatic Import (Fastest)

### Option A: Using Node.js Script

1. **Install Firebase Admin SDK**
   ```bash
   cd backend
   npm install firebase-admin
   ```

2. **Download Service Account Key**
   ```
   Firebase Console → Project Settings → Service Accounts
   Click "Generate new private key"
   Save as: backend/config/serviceAccountKey.json
   ```

3. **Run the Population Script**
   ```bash
   cd backend
   npx ts-node src/scripts/populateCareerPaths.ts
   ```

**Expected Output**:
```
🚀 Starting to populate career paths...
📊 Total career paths to add: 110
✅ Committed batch of 110 paths

✅ Successfully populated all career paths!
📈 Total paths added: 110

📊 Breakdown by field:
   agriculture         : 5 paths
   architecture        : 5 paths
   arts                : 5 paths
   aviation            : 5 paths
   commerce            : 5 paths
   ...
   
🎉 Career paths population complete!
```

### Option B: Using Frontend Admin Panel + Script

1. **Create Import Function in Admin Panel**
   
   Add this to `CareerPathManager.tsx`:
   ```typescript
   import { careerPathsData } from '../../../career_paths_data.js';
   
   const handleBulkImport = async () => {
     setLoading(true);
     try {
       for (const pathData of careerPathsData) {
         await addDoc(collection(db, 'career_paths'), {
           ...pathData,
           createdAt: serverTimestamp(),
           updatedAt: serverTimestamp(),
           verified: true
         });
       }
       toast.success('All career paths imported!');
       fetchPaths();
     } catch (error) {
       toast.error('Import failed');
     } finally {
       setLoading(false);
     }
   };
   ```

2. **Add Import Button**
   ```tsx
   <Button onClick={handleBulkImport}>
     Import All 110 Paths
   </Button>
   ```

## 📋 Sample Data Structure

### Example: Software Developer Role

```json
{
  "title": "Software Developer",
  "field": "engineering",
  "level": "Beginner",
  "requiredSkills": [
    "JavaScript",
    "Python",
    "Git",
    "HTML/CSS",
    "Problem Solving"
  ],
  "createdAt": "2026-02-06T07:30:00Z",
  "updatedAt": "2026-02-06T07:30:00Z",
  "verified": true
}
```

## ✅ Verification Steps

After importing, verify the data:

### 1. Check in Firebase Console

```
Firestore → career_paths collection
Should show 110 documents
```

### 2. Check in Admin Panel

```
Admin Panel → Career Paths
Should show all 110 paths in the table
Search for different fields to verify
```

### 3. Check on User Side

```
Login as user with field = "engineering"
Go to Career Paths page
Should see 5 engineering career paths:
- Software Developer (Beginner)
- Full Stack Engineer (Intermediate)
- AI/ML Engineer (Advanced)
- Cloud Architect (Advanced)
- DevOps Engineer (Intermediate)
```

## 🔍 Quick Test

To quickly verify the integration is working:

1. **Import one path manually**:
   ```
   Title: Test Engineer
   Field: engineering
   Level: Beginner
   Skills: Testing, QA, Automation
   ```

2. **Check user page**:
   ```
   Login as user (field = engineering)
   Navigate to Career Paths
   Verify "Test Engineer" appears
   ```

3. **If successful, import all 110 paths**

## 📊 Complete Career Paths List

### Engineering (5 paths)
1. Software Developer (Beginner)
2. Full Stack Engineer (Intermediate)
3. AI/ML Engineer (Advanced)
4. Cloud Architect (Advanced)
5. DevOps Engineer (Intermediate)

### Medical (5 paths)
1. General Physician (Beginner)
2. Cardiologist (Advanced)
3. Medical Researcher (Advanced)
4. Physiotherapist (Intermediate)
5. Pharmacist (Beginner)

### Science (5 paths)
1. Research Scientist (Advanced)
2. Data Scientist (Intermediate)
3. Biotechnologist (Intermediate)
4. Environmental Scientist (Beginner)
5. Astrophysicist (Advanced)

### Arts (5 paths)
1. Content Writer (Beginner)
2. Journalist (Intermediate)
3. Historian (Advanced)
4. Psychologist (Intermediate)
5. Digital Marketer (Beginner)

### Commerce (5 paths)
1. Financial Analyst (Intermediate)
2. Business Consultant (Advanced)
3. Chartered Accountant (Advanced)
4. Investment Banker (Advanced)
5. Marketing Manager (Intermediate)

### Law (5 paths)
1. Corporate Lawyer (Advanced)
2. Civil Services Officer (Advanced)
3. Legal Advisor (Intermediate)
4. Paralegal (Beginner)
5. Judge/Magistrate (Advanced)

### Education (5 paths)
1. School Teacher (Beginner)
2. Professor/Lecturer (Advanced)
3. Educational Consultant (Intermediate)
4. E-Learning Designer (Intermediate)
5. Career Counselor (Beginner)

### Design (5 paths)
1. Graphic Designer (Beginner)
2. UI/UX Designer (Intermediate)
3. Video Editor (Intermediate)
4. 3D Animator (Advanced)
5. Art Director (Advanced)

### Defense (5 paths)
1. Army Officer (Intermediate)
2. Cybersecurity Specialist (Advanced)
3. Police Officer (Beginner)
4. Firefighter (Beginner)
5. Intelligence Analyst (Advanced)

### Agriculture (5 paths)
1. Agricultural Scientist (Advanced)
2. Farm Manager (Intermediate)
3. Environmental Consultant (Intermediate)
4. Horticulturist (Beginner)
5. Agricultural Engineer (Advanced)

### Aviation (5 paths)
1. Commercial Pilot (Advanced)
2. Aerospace Engineer (Advanced)
3. Air Traffic Controller (Intermediate)
4. Aircraft Maintenance Engineer (Intermediate)
5. Flight Attendant (Beginner)

### Sports (5 paths)
1. Professional Athlete (Advanced)
2. Sports Coach (Intermediate)
3. Fitness Trainer (Beginner)
4. Sports Physiotherapist (Advanced)
5. Sports Manager (Intermediate)

### Hospitality (5 paths)
1. Hotel Manager (Intermediate)
2. Chef (Intermediate)
3. Tour Guide (Beginner)
4. Event Manager (Intermediate)
5. Travel Consultant (Beginner)

### Architecture (5 paths)
1. Architect (Advanced)
2. Civil Engineer (Advanced)
3. Interior Designer (Intermediate)
4. Urban Planner (Advanced)
5. Construction Manager (Intermediate)

### Social Work (5 paths)
1. Social Worker (Beginner)
2. NGO Program Manager (Intermediate)
3. Community Development Officer (Intermediate)
4. Human Rights Activist (Advanced)
5. Disaster Relief Coordinator (Intermediate)

### Performing Arts (5 paths)
1. Professional Musician (Advanced)
2. Actor/Actress (Intermediate)
3. Dancer (Intermediate)
4. Theater Director (Advanced)
5. Music Producer (Advanced)

### Journalism (5 paths)
1. News Reporter (Beginner)
2. News Anchor (Intermediate)
3. Investigative Journalist (Advanced)
4. Public Relations Officer (Intermediate)
5. Content Strategist (Intermediate)

### Fashion (5 paths)
1. Fashion Designer (Intermediate)
2. Textile Engineer (Advanced)
3. Fashion Stylist (Beginner)
4. Merchandiser (Intermediate)
5. Fashion Photographer (Intermediate)

### Library Science (5 paths)
1. Librarian (Beginner)
2. Information Architect (Advanced)
3. Digital Archivist (Intermediate)
4. Knowledge Manager (Advanced)
5. Research Librarian (Intermediate)

### Pharmacy (5 paths)
1. Clinical Pharmacist (Intermediate)
2. Pharmaceutical Researcher (Advanced)
3. Regulatory Affairs Specialist (Advanced)
4. Hospital Pharmacist (Beginner)
5. Drug Safety Specialist (Intermediate)

### Food Technology (5 paths)
1. Food Technologist (Intermediate)
2. Nutritionist/Dietitian (Beginner)
3. Food Safety Officer (Intermediate)
4. Product Development Specialist (Advanced)
5. Quality Assurance Manager (Advanced)

### Veterinary (5 paths)
1. Veterinarian (Advanced)
2. Veterinary Surgeon (Advanced)
3. Animal Nutritionist (Intermediate)
4. Wildlife Veterinarian (Advanced)
5. Veterinary Researcher (Advanced)

## 🎯 Summary

✅ **110 career paths ready for import**  
✅ **All 22 fields covered**  
✅ **3 difficulty levels per field**  
✅ **Realistic skill requirements**  
✅ **Production-ready data**  

Choose your import method and populate your database! 🚀
