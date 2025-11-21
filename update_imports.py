import os

dirs_to_process = [
    'frontend/src/components/marketing/financeflo',
    'frontend/src/pages/marketing/financeflo',
    'frontend/src/hooks/marketing/financeflo'
]

replacements = [
    ('@/components/', '@/components/marketing/financeflo/'),
    ('@/hooks/', '@/hooks/marketing/financeflo/'),
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
                    # Avoid double replacement if already replaced
                    if new not in content: 
                        new_content = new_content.replace(old, new)
                    else:
                        # If "marketing/financeflo" is already in the file, we need to be careful.
                        # But simplest is to just replace matches that are NOT already prefixed.
                        # Regex is better but simple string replace might work if we trust the state.
                        # Actually, "new not in content" is bad logic because one import might be fixed and another not.
                        pass
                
                # Better approach: line by line or regex
                import re
                
                # Replace @/components/ NOT followed by marketing/financeflo
                new_content = re.sub(r'@/components/(?!marketing/financeflo)', '@/components/marketing/financeflo/', content)
                
                # Replace @/hooks/ NOT followed by marketing/financeflo
                new_content = re.sub(r'@/hooks/(?!marketing/financeflo)', '@/hooks/marketing/financeflo/', new_content)

                if new_content != content:
                    print(f"Updating {filepath}")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)

