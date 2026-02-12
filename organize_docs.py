import os
import shutil

# Paths
docs_dir = os.path.join(os.getcwd(), 'docs')
frontend_dir = os.path.join(docs_dir, 'frontend')
backend_dir = os.path.join(docs_dir, 'backend')
general_dir = os.path.join(docs_dir, 'general')

# Ensure directories exist
os.makedirs(frontend_dir, exist_ok=True)
os.makedirs(backend_dir, exist_ok=True)
os.makedirs(general_dir, exist_ok=True)

# Categorization
frontend_files = [
    'ENHANCED_PROFILE_PAGE.md', 'PORTFOLIO_COMPLETE_DOCS.md', 'PORTFOLIO_FEATURE_DOCS.md'
]

backend_files = [
    'ADMIN_ACCESS_CONTROL.md', 'ADMIN_PANEL_ENABLED.md', 'ADMIN_USER_INTEGRATION.md', 
    'AI_CAREER_PATHS_IMPLEMENTATION_SUMMARY.md', 'AI_CAREER_PATHS_QUICK_START.md', 
    'AI_CAREER_PATHS_SYSTEM.md', 'AI_MENTOR_GUIDE.md', 'AI_NOTIFICATIONS_SYSTEM.md', 
    'ANALYTICS_BUTTONS_ENABLED.md', 'ASSESSMENT_ACCESS_CONTROL_GUIDE.md', 
    'ASSESSMENT_COMPLETE_GUIDE.md', 'ASSESSMENT_SYSTEM_FIX_SUMMARY.md', 
    'AUTH_FIX_DOCUMENTATION.md', 'AUTH_PERSISTENCE_FIX.md', 'CAREER_PATHS_FIXED.md', 
    'CAREER_PATHS_IMPORT_GUIDE.md', 'CHATGPT_STYLE_AI_MENTOR.md', 'DAILY_NOTIFICATIONS.md', 
    'ENGINEERING_BRANCHES_IMPLEMENTATION.md', 'ENGINEERING_BRANCHES_STRUCTURE.md', 
    'ENGINEERING_BRANCHES_WORKING.md', 'FIELD_ASSESSMENT_IMPLEMENTATION.md', 
    'FIELD_ASSESSMENT_SYSTEM.md', 'FIREBASE_NOTIFICATIONS_GUIDE.md', 'FIREBASE_RULES_UPDATE.md', 
    'IMPORT_CAREER_PATHS_QUICK_START.md', 'MASTERS_MTECH_PROGRAMS_ADDED.md', 
    'MULTI_SESSION_AUTH.md', 'NOTIFICATIONS_QUICK_START.md', 'NOTIFICATION_ENHANCEMENT_PLAN.md', 
    'NOTIFICATION_IMPLEMENTATION_GUIDE.md', 'NOTIFICATION_SYSTEM.md', 
    'PROJECTS_CERTIFICATIONS_FIX.md', 'QUICK_FIX_ASSESSMENT_ERROR.md', 
    'ROLE_AUTH_TESTING_GUIDE.md', 'ROLE_BASED_AUTH_FIX.md', 'TIMESTAMP_SYSTEM.md', 
    'USER_ADMIN_ACCESS_BEHAVIOR.md', 'AI_MENTOR_TRAINING_EXAMPLES.ts'
]

general_files = [
    'ADDING_OPENAI_LATER.md', 'ADMIN_DASHBOARD_STRUCTURE.md', 'ADMIN_SETUP_GUIDE.md', 
    'ADMIN_SETUP_START_HERE.md', 'COMPLETE_IMPLEMENTATION_SUMMARY.md', 'CRITICAL_FIX_TEST.md', 
    'DIAGNOSIS.md', 'DYNAMIC_CONTENT_GUIDE.md', 'EXPO_DETAILS.md', 'FINAL_SOLUTION.md', 
    'FIXES_APPLIED.md', 'HOW_TO_USE.md', 'IMMEDIATE_FIX_NOW.md', 'IMPLEMENTATION_GUIDE.md', 
    'PRICING_MODEL_IMPLEMENTATION.example', 'QUICK_START.md', 'QUICK_TEST_GUIDE.md', 
    'RECOMMENDATION.md', 'ROADMAPS_WORKING.md', 'SETUP_GUIDE.md', 'USER_MANUAL.md'
]

def move_file(filename, target_dir):
    src = os.path.join(docs_dir, filename)
    dst = os.path.join(target_dir, filename)
    if os.path.exists(src):
        try:
            shutil.move(src, dst)
            print(f"Moved {filename} to {target_dir}")
        except Exception as e:
            print(f"Error moving {filename}: {e}")

# Move files
for f in frontend_files:
    move_file(f, frontend_dir)

for f in backend_files:
    move_file(f, backend_dir)

for f in general_files:
    move_file(f, general_dir)

# Handle subfolders in docs (like 'database')
# Move contents of docs/database to docs/backend
database_dir = os.path.join(docs_dir, 'database')
if os.path.exists(database_dir):
    for f in os.listdir(database_dir):
        src = os.path.join(database_dir, f)
        dst = os.path.join(backend_dir, f)
        try:
            shutil.move(src, dst)
            print(f"Moved {f} from database to backend")
        except Exception as e:
            print(f"Error moving {f}: {e}")
    # Remove empty database dir
    try:
        os.rmdir(database_dir)
        print("Removed empty database directory")
    except:
        pass
