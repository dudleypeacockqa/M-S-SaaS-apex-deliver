"""Remove try blocks that follow dependency_overrides calls."""

with open('test_podcast_api.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Check if this is a try: line that comes after dependency_overrides
    if line.strip() == 'try:' and i > 0:
        # Check if previous non-empty line contains dependency_overrides
        prev_idx = i - 1
        while prev_idx >= 0 and lines[prev_idx].strip() == '':
            prev_idx -= 1

        if prev_idx >= 0 and 'dependency_overrides' in lines[prev_idx]:
            # Skip the try: line
            i += 1

            # Unindent all lines until we hit the next function definition or class
            while i < len(lines):
                current = lines[i]

                # Stop if we hit a new function or class
                if current.strip().startswith('def ') or current.strip().startswith('class '):
                    break

                # Unindent by 4 spaces if the line starts with at least 12 spaces (indent inside try block)
                if current.startswith('            '):  # 12 spaces = 3 levels
                    new_lines.append(current[4:])  # Remove 4 spaces
                elif current.startswith('        '):  # 8 spaces = 2 levels (empty lines or less indented)
                    new_lines.append(current)
                else:
                    new_lines.append(current)

                i += 1
            continue

    # Default: keep the line as-is
    new_lines.append(line)
    i += 1

# Write the result
with open('test_podcast_api.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Processed {len(lines)} lines → {len(new_lines)} lines')
