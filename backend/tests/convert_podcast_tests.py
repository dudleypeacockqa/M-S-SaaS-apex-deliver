"""Script to convert test_podcast_api.py to use dependency_overrides fixture."""
import re

# Read the file
with open('test_podcast_api.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Pattern 1: Add dependency_overrides parameter to test functions
    if line.strip().startswith('def test_') and i < len(lines) - 1:
        # Collect the full function signature
        signature_lines = [line]
        j = i + 1
        while j < len(lines) and not lines[j].strip().endswith(') -> None:') and not lines[j].strip().endswith('):'):
            signature_lines.append(lines[j])
            j += 1
        if j < len(lines):
            signature_lines.append(lines[j])

        full_signature = ''.join(signature_lines)

        # Check if dependency_overrides is already present
        if 'dependency_overrides' not in full_signature:
            # Add dependency_overrides parameter before the closing parenthesis
            modified_signature = full_signature.replace(
                ') -> None:',
                ',\n        dependency_overrides,\n    ) -> None:'
            ).replace(
                '):',
                ',\n        dependency_overrides,\n    ):'
            )

            # Write the modified signature
            for sig_line in modified_signature.splitlines(keepends=True):
                new_lines.append(sig_line)

            i = j + 1
            continue

    # Pattern 2: Replace _override_user(user) with dependency_overrides(get_current_user, lambda: user)
    if '_override_user(' in line:
        match = re.search(r'_override_user\(([^)]+)\)', line)
        if match:
            user_var = match.group(1)
            new_line = line.replace(
                f'_override_user({user_var})',
                f'dependency_overrides(get_current_user, lambda: {user_var})'
            )
            new_lines.append(new_line)
            i += 1
            continue

    # Pattern 3: Remove try: blocks
    if line.strip() == 'try:' and i > 0 and 'dependency_overrides' in lines[i-1]:
        # Skip the try: line
        i += 1

        # Unindent all lines until we hit 'finally:'
        while i < len(lines):
            if lines[i].strip().startswith('finally:'):
                # Skip finally: and the next line (_clear_override())
                i += 2
                break

            # Unindent by 4 spaces
            if lines[i].startswith('            '):  # 12 spaces
                new_lines.append(lines[i][4:])  # Remove 4 spaces
            else:
                new_lines.append(lines[i])
            i += 1
        continue

    # Pattern 4: Skip finally blocks with _clear_override
    if line.strip().startswith('finally:') and i + 1 < len(lines) and '_clear_override' in lines[i + 1]:
        i += 2  # Skip finally: and _clear_override()
        continue

    # Default: keep the line as-is
    new_lines.append(line)
    i += 1

# Write the updated content
with open('test_podcast_api.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Conversion complete!')
print(f'Processed {len(lines)} lines')
print(f'Output {len(new_lines)} lines')
