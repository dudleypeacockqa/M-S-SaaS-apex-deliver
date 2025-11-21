import os
import re

dirs_to_process = [
    'frontend/src/components/marketing/financeflo',
    'frontend/src/pages/marketing/financeflo',
]

replacements = [
    ('import "../styles/brand.css";', 'import "@/styles/financeflo/brand.css";'),
    ('import "./styles/brand.css";', 'import "@/styles/financeflo/brand.css";'),
    ("import '../styles/brand.css';", "import '@/styles/financeflo/brand.css';"),
    ("import './styles/brand.css';", "import '@/styles/financeflo/brand.css';"),
]

for directory in dirs_to_process:
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        continue
        
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements:
                    new_content = new_content.replace(old, new)

                if new_content != content:
                    print(f"Updating {filepath}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)

