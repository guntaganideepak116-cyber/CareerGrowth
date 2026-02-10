# 📘 CareerGrowth Intelligence - User Manual & Guide

Welcome to **CareerGrowth Intelligence**, your AI-powered career mentorship platform. This guide will help you navigate the platform, set up your development environment, and understand the project submission workflow.

---

## 🚀 Getting Started

### 1. Account Setup
- **Sign Up/Login**: Use your email credentials or Google Sign-In to access your dashboard.
- **Profile Initialization**: On your first login, the AI will ask for your current status (Student/Professional) to tailor recommendations.

### 2. Dashboard Overview
- **Career Phase**: View your current semester/career stage.
- **Metrics**: Track your Resume Strength, Market Alignment, and Skill Progress.
- **Quick Actions**: Shortcuts to Mentorship, Roadmap, and Projects.

---

## � Technical Setup (Local Environment)

To build the projects listed on this platform, you need a proper **Local Development Environment**. Here are the recommended tools standard in the industry:

### 1. Code Editor (IDE)
We recommend **Visual Studio Code (VS Code)** for its versatility and massive extension marketplace.
- **Alternatives**: IntelliJ IDEA (for Java), PyCharm (for Python), WebStorm.
- **Why Local?**: While cloud editors exist, a local environment gives you full control over debugging, performance, and offline work, mirroring a real job setting.

### 2. Version Control (Git)
All professional code is managed via Git.
- **Install Git**: Download Git Bash (Windows) or use Terminal (Mac/Linux).
- **GitHub Account**: Create a free account on [GitHub.com](https://github.com) to host your project repositories.

### 3. Language Runtimes
Depending on your chosen field, install the necessary runtimes:
- **Web/Full Stack**: Install **Node.js** (LTS version).
- **Data Science/AI**: Install **Python 3.10+** and Anaconda (optional but recommended).
- **Mobile App**: Install Android Studio or Xcode.

---

## 🛠 Features & Functionality

### 1. Field Selection & Projects
*Navigate to `Projects`.*
- **Filter**: Use tabs to see Free, Pro, or Premium projects.
- **Start**: Click "Start Project" to enter the Workspace. If locked, upgrade your plan via the Subscription page.

### 2. Subscription & Upgrades
*Navigate to `Upgrade Plan`.*
- **Upgrade Flow**: Click "Upgrade" on Pro/Premium plans. In this demo environment, the upgrade is simulated instantly, allowing you to access premium content immediately for testing.

---

## 📤 Project Submission Workflow

When you complete a project, you need to "Submit" it for proof of work. Here is how the solution is architected:

### Step 1: Build & Browse
- Write your code locally in VS Code.
- Test your application to ensure it meets requirements.

### Step 2: Push to Cloud (GitHub)
- Commit your code: `git commit -m "Completed project"`
- Push to GitHub: `git push origin main`
- **Why?**: Recruiters want to see your actual code history.

### Step 3: Platform Submission
1.  Go to the **Project Workspace** -> **Submission Tab**.
2.  Paste your **GitHub Repository URL** (e.g., `github.com/username/my-project`).
3.  Click **Submit Project**.

### 📍 Where is it saved?
In a real-world deployment of this platform:
1.  **Database**: Your submission (Repo Link, Timestamp, Project ID) is saved to our central database (e.g., Firestore or PostgreSQL).
2.  **Profile**: The project is added to your **User Profile** under "Completed Projects".
3.  **Review Queue**: For Pro/Premium users, the submission enters a "Mentor Review Queue" where an expert reviews the code and provides feedback.

*In this Demo version: The submission simulates a successful save and updates your local progress state.*

---

## ❓ Frequently Asked Questions

**Q: Can I use Replit or CodeSandbox?**
A: Yes, for smaller projects (Free tier), browser-based IDEs are fine. For Premium industry projects, we strongly recommend a local setup to simulate enterprise workflows.

**Q: Do I lose access if I downgrade?**
A: No, projects you have already started or completed remain in your history.

---

*Powered by CareerGrowth AI Team*
