"""
Simple, surgical conversion of test_podcast_api.py to use dependency_overrides fixture.

Changes:
1. Remove global dependency_overrides and autouse fixture (lines 19-26)
2. Remove helper functions _override_user and _clear_override (lines 38-43)
3. Add dependency_overrides parameter to ALL test function signatures
4. Replace _override_user(user) with dependency_overrides(get_current_user, lambda: user)
5. Remove try:/finally:/_clear_override() blocks (keeping only the code inside)
"""

import re

# Read the original file
with open('test_podcast_api.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Step 1: Remove the global and autouse fixture
content = re.sub(
    r'dependency_overrides = None\n\n\n@pytest\.fixture\(autouse=True\)\ndef _bind_dependency_overrides_fixture\(dependency_overrides\):\n    globals\(\)\["dependency_overrides"\] = dependency_overrides\n    yield\n    globals\(\)\["dependency_overrides"\] = None\n\n',
    '',
    content
)

# Step 2: Remove helper functions
content = re.sub(
    r'\n\ndef _override_user\(user\):\n    dependency_overrides\(get_current_user, lambda: user\)\n\n\ndef _clear_override\(\):\n    return None\n\n',
    '\n\n',
    content
)

# Step 3: Add dependency_overrides parameter to test functions
# Match function signatures and add the parameter before the closing )
def add_param(match):
    full_sig = match.group(0)
    # Skip if already has dependency_overrides
    if 'dependency_overrides' in full_sig:
        return full_sig
    # Add before ) -> None: or ):
    return full_sig.replace(
        ') -> None:',
        ',\n        dependency_overrides,\n    ) -> None:'
    ).replace(
        '):'  ,
        ',\n        dependency_overrides,\n    ):'
    ) if '):' in full_sig and ') -> None:' not in full_sig else full_sig.replace(
        ') -> None:',
        ',\n        dependency_overrides,\n    ) -> None:'
    )

# Match test function signatures (handles multi-line)
content = re.sub(
    r'(def test_\w+\([^)]*\)\s*(?:->  \s*None\s*)?:)',
    add_param,
    content,
    flags=re.DOTALL
)

# Step 4: Replace _override_user calls
content = content.replace('_override_user(', 'dependency_overrides(get_current_user, lambda: ')

# Step 5: Remove try:/finally: blocks
#  Pattern: after dependency_overrides call, remove try: and unindent, remove finally: _clear_override()
lines = content.split('\n')
result_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Check for try: after dependency_overrides or expected_period
    if line.strip() == 'try:':
        # Look back a few lines for dependency_overrides
        has_dep_override = False
        for back in range(1, min(6, i + 1)):
            if 'dependency_overrides' in lines[i - back]:
                has_dep_override = True
                break

        if has_dep_override:
            # Skip try: line
            i += 1
            indent_level = len(line) - len(line.lstrip())

            # Collect and unindent code until finally:
            while i < len(lines):
                curr = lines[i]

                # Hit finally block - skip it and the _clear_override() line
                if curr.strip().startswith('finally:'):
                    i += 2  # Skip "finally:" and "_clear_override()"
                    break

                # Unindent by 4 spaces if indented enough
                if curr.startswith(' ' * (indent_level + 4)):
                    result_lines.append(curr[4:])
                else:
                    result_lines.append(curr)

                i += 1
            continue

    result_lines.append(line)
    i += 1

# Write the result
with open('test_podcast_api.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(result_lines))

print('Conversion complete!')
