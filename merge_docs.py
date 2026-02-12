import os

# Paths
docs_dir = 'docs'
frontend_dir = os.path.join(docs_dir, 'frontend')
backend_dir = os.path.join(docs_dir, 'backend')
general_dir = os.path.join(docs_dir, 'general')
readme_path = 'README.md'

# --- Merge Mobile Docs ---
mobile_target = os.path.join(frontend_dir, 'MOBILE_RESPONSIVENESS.md')
mobile_sources = [
    os.path.join(frontend_dir, 'MOBILE_OPTIMIZATION_CHECKLIST.md'),
    os.path.join(frontend_dir, 'MOBILE_RESPONSIVE.md'),
    os.path.join(frontend_dir, 'RESPONSIVE_IMPLEMENTATION_SUMMARY.md')
]

# Read target (if exists, or start new)
if os.path.exists(mobile_target):
    with open(mobile_target, 'r', encoding='utf-8') as f:
        mobile_content = f.read()
else:
    mobile_content = "# Mobile Responsiveness Guide\n\n"

# Append sources
for src in mobile_sources:
    if os.path.exists(src):
        with open(src, 'r', encoding='utf-8') as f:
            content = f.read()
            mobile_content += f"\n\n---\n\n# From {os.path.basename(src)}\n\n" + content
        os.remove(src)
        print(f"Merged and removed {src}")

# Write back
with open(mobile_target, 'w', encoding='utf-8') as f:
    f.write(mobile_content)
print(f"Updated {mobile_target}")

# --- Merge Portfolio Docs ---
portfolio_target = os.path.join(frontend_dir, 'PORTFOLIO_DOCUMENTATION.md')
portfolio_sources = [
    os.path.join(frontend_dir, 'PORTFOLIO_COMPLETE_DOCS.md'),
    os.path.join(frontend_dir, 'PORTFOLIO_FEATURE_DOCS.md')
]

portfolio_content = "# Portfolio Documentation\n\n"
for src in portfolio_sources:
    if os.path.exists(src):
        with open(src, 'r', encoding='utf-8') as f:
            content = f.read()
            portfolio_content += f"\n\n---\n\n# From {os.path.basename(src)}\n\n" + content
        os.remove(src)
        print(f"Merged and removed {src}")

with open(portfolio_target, 'w', encoding='utf-8') as f:
    f.write(portfolio_content)
print(f"Created {portfolio_target}")


# --- Update README.md ---
if os.path.exists(readme_path):
    with open(readme_path, 'r', encoding='utf-8') as f:
        readme_content = f.read()
else:
    readme_content = "# Career Growth Project\n\n"

# Check if Documentation Index already exists
if "## Documentation Index" not in readme_content:
    index_content = """
## Documentation Index

The documentation is organized into the following sections:

### 📂 [General Documentation](docs/general)
System overview, setup guides, architecture, and deployment instructions.
- [Setup Guide](docs/general/SETUP_GUIDE.md)
- [Deployment Guide](docs/general/DEPLOYMENT_GUIDE_VERCEL.md)
- [System Overview](docs/general/SYSTEM_OVERHAUL_COMPLETE.md)

### 📂 [Frontend Documentation](docs/frontend)
UI/UX, Components, Responsive Design, and Feature specifics.
- [Mobile Responsiveness](docs/frontend/MOBILE_RESPONSIVENESS.md)
- [Portfolio System](docs/frontend/PORTFOLIO_DOCUMENTATION.md)

### 📂 [Backend Documentation](docs/backend)
API, Firebase, Authentication, and Data Structures.
- [Authentication](docs/backend/AUTH_SESSION_ISOLATION.md)
- [Career Paths Architecture](docs/backend/CAREER_PATHS_ARCHITECTURE_COMPLETE.md)
- [Firebase Config](docs/backend/FIREBASE_PERMISSIONS_FIX.md)

"""
    # Append to end
    readme_content += "\n\n" + index_content
    
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print("Updated README.md with Documentation Index")
else:
    print("README.md already has Documentation Index")

