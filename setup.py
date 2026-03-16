#!/usr/bin/env python3
"""
IELTSdua — Project Setup Script
Run from the root folder where you extracted all files.
"""
import os, shutil, sys

def green(t): return f"\033[92m{t}\033[0m"
def yellow(t): return f"\033[93m{t}\033[0m"
def red(t): return f"\033[91m{t}\033[0m"
def bold(t): return f"\033[1m{t}\033[0m"
def cyan(t): return f"\033[96m{t}\033[0m"

ROOT = os.path.dirname(os.path.abspath(__file__))

print()
print(bold(cyan("  🌿 IELTSdua — Project Setup")))
print(cyan("  " + "=" * 40))
print()

FOLDERS = [
    "src", "src/pages", "src/components",
    "src/contexts", "src/lib", "src/data", "public",
]

FILE_MAP = {
    # Root config
    "package.json":        "package.json",
    "vite.config.js":      "vite.config.js",
    "tailwind.config.js":  "tailwind.config.js",
    "postcss.config.js":   "postcss.config.js",
    "index.html":          "index.html",
    "wrangler.toml":       "wrangler.toml",
    "SETUP.md":            "SETUP.md",
    "supabase_schema.sql": "supabase_schema.sql",
    ".env.example":        ".env.example",
    # src root
    "main.jsx":            "src/main.jsx",
    "App.jsx":             "src/App.jsx",
    "index.css":           "src/index.css",
    # lib
    "supabase.js":         "src/lib/supabase.js",
    # data
    "courseData.js":       "src/data/courseData.js",
    "mockTestData.js":   "src/data/mockTestData.js",
    # contexts
    "AuthContext.jsx":     "src/contexts/AuthContext.jsx",
    "ProgressContext.jsx": "src/contexts/ProgressContext.jsx",
    # components
    "Navbar.jsx":              "src/components/Navbar.jsx",
    "NotificationToast.jsx":   "src/components/NotificationToast.jsx",
    "XPBar.jsx":               "src/components/XPBar.jsx",
    "Hearts.jsx":              "src/components/Hearts.jsx",
    # pages
    "Login.jsx":           "src/pages/Login.jsx",
    "Register.jsx":        "src/pages/Register.jsx",
    "Dashboard.jsx":       "src/pages/Dashboard.jsx",
    "Learn.jsx":           "src/pages/Learn.jsx",
    "Lesson.jsx":          "src/pages/Lesson.jsx",
    "Vocabulary.jsx":      "src/pages/Vocabulary.jsx",
    "WritingPractice.jsx": "src/pages/WritingPractice.jsx",
    "SpeakingPractice.jsx":"src/pages/SpeakingPractice.jsx",
    "GrammarDrills.jsx":   "src/pages/GrammarDrills.jsx",
    "ReadingPractice.jsx": "src/pages/ReadingPractice.jsx",
    "BandEstimator.jsx":   "src/pages/BandEstimator.jsx",
    "MockTest.jsx":        "src/pages/MockTest.jsx",
    "Profile.jsx":         "src/pages/Profile.jsx",
    "Leaderboard.jsx":     "src/pages/Leaderboard.jsx",
    "Achievements.jsx":    "src/pages/Achievements.jsx",
    # public
    "favicon.svg":         "public/favicon.svg",
    "_redirects":          "public/_redirects",
}

errors, moved, skipped = [], [], []

print(bold("📁 Creating directory structure..."))
for folder in FOLDERS:
    full = os.path.join(ROOT, folder)
    if not os.path.exists(full):
        os.makedirs(full)
        print(f"  {green('✓')} Created: {folder}/")
    else:
        print(f"  {yellow('·')} Exists:  {folder}/")
print()

print(bold("📂 Organising files..."))
for filename, dest_rel in FILE_MAP.items():
    src_path  = os.path.join(ROOT, filename)
    dest_path = os.path.join(ROOT, dest_rel)
    if os.path.abspath(src_path) == os.path.abspath(dest_path):
        skipped.append(filename); continue
    if os.path.isfile(src_path):
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        shutil.copy2(src_path, dest_path)
        os.remove(src_path)
        moved.append(filename)
        print(f"  {green('✓')} {filename} → {dest_rel}")
    elif os.path.isfile(dest_path):
        skipped.append(filename)
        print(f"  {yellow('·')} Already placed: {dest_rel}")
    else:
        errors.append(filename)
        print(f"  {red('✗')} NOT FOUND: {filename}")
print()

# Create .env
env_path = os.path.join(ROOT, ".env")
if not os.path.isfile(env_path):
    with open(env_path, "w") as f:
        f.write("VITE_SUPABASE_URL=your_supabase_project_url_here\n")
        f.write("VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here\n")
    print(bold("🔑 Created .env — fill in your Supabase credentials!\n"))

# Verify
print(bold("🔍 Final structure:"))
all_ok = True
for _, dest_rel in FILE_MAP.items():
    dest = os.path.join(ROOT, dest_rel)
    if os.path.isfile(dest):
        print(f"  {green('✓')} {dest_rel}")
    else:
        print(f"  {red('✗')} MISSING: {dest_rel}")
        all_ok = False

print()
print(bold("📊 Summary"))
print(f"  Moved:  {green(str(len(moved)))}   Skipped: {yellow(str(len(skipped)))}   Errors: {red(str(len(errors)))}")
print()

if errors:
    print(red(bold(f"  ⚠  {len(errors)} file(s) not found. Make sure all output files are in the root folder.")))
    for e in errors: print(f"    {red('·')} {e}")
    print()

print(bold(green("  ✅ Setup complete!") if all_ok else yellow("  ⚠  Setup done with missing files.")))
print()
print(bold("  🚀 Next Steps:"))
print(f"  1. Edit {bold('.env')} — add your Supabase URL + anon key")
print(f"  2. Run SQL schema in Supabase SQL Editor  (supabase_schema.sql)")
print(f"  3. {bold('npm install')}")
print(f"  4. {bold('npm run dev')}  →  open http://localhost:5173")
print(f"  5. Deploy: see {bold('SETUP.md')} → Step 3 (Cloudflare Pages)")
print()
print(cyan("  Happy studying! 🌿 Aim for Band 9!"))
print()
