#!/usr/bin/env python3
"""Add missing ListResponse classes to master_admin schema."""

# Read file
with open('app/schemas/master_admin.py', 'r') as f:
    lines = f.readlines()

# Track insertions (line_number, text_to_insert)
insertions = []

# Find AdminFocusSessionResponse and add ListResponse after it
for i, line in enumerate(lines):
    if 'class AdminFocusSessionResponse(AdminFocusSessionBase):' in line:
        # Find the end of this class (look for next blank line after model_config)
        j = i + 1
        while j < len(lines) and 'model_config = ConfigDict' not in lines[j]:
            j += 1
        j += 2  # Skip model_config line and blank line

        insertions.append((j, [
            '\n',
            'class AdminFocusSessionListResponse(BaseModel):\n',
            '    """Schema for list of focus sessions."""\n',
            '    sessions: list[AdminFocusSessionResponse]\n',
            '    total: int\n',
        ]))
        break

# Find AdminNudgeResponse
for i, line in enumerate(lines):
    if 'class AdminNudgeResponse(AdminNudgeBase):' in line:
        j = i + 1
        while j < len(lines) and 'model_config = ConfigDict' not in lines[j]:
            j += 1
        j += 2

        insertions.append((j, [
            '\n',
            'class AdminNudgeListResponse(BaseModel):\n',
            '    """Schema for list of admin nudges."""\n',
            '    nudges: list[AdminNudgeResponse]\n',
            '    total: int\n',
        ]))
        break

# Find AdminMeetingResponse
for i, line in enumerate(lines):
    if 'class AdminMeetingResponse(AdminMeetingBase):' in line:
        j = i + 1
        while j < len(lines) and 'model_config = ConfigDict' not in lines[j]:
            j += 1
        j += 2

        insertions.append((j, [
            '\n',
            'class AdminMeetingListResponse(BaseModel):\n',
            '    """Schema for list of meeting templates."""\n',
            '    meetings: list[AdminMeetingResponse]\n',
            '    total: int\n',
        ]))
        break

# Find AdminCampaignRecipientResponse
for i, line in enumerate(lines):
    if 'class AdminCampaignRecipientResponse(AdminCampaignRecipientBase):' in line:
        j = i + 1
        while j < len(lines) and 'model_config = ConfigDict' not in lines[j]:
            j += 1
        j += 2

        insertions.append((j, [
            '\n',
            'class AdminCampaignRecipientListResponse(BaseModel):\n',
            '    """Schema for list of campaign recipients."""\n',
            '    recipients: list[AdminCampaignRecipientResponse]\n',
            '    total: int\n',
        ]))
        break

# Find AdminContentScriptResponse
for i, line in enumerate(lines):
    if 'class AdminContentScriptResponse(AdminContentScriptBase):' in line:
        j = i + 1
        while j < len(lines) and 'model_config = ConfigDict' not in lines[j]:
            j += 1
        j += 2

        insertions.append((j, [
            '\n',
            'class AdminContentScriptListResponse(BaseModel):\n',
            '    """Schema for list of content scripts."""\n',
            '    scripts: list[AdminContentScriptResponse]\n',
            '    total: int\n',
        ]))
        break

# Apply insertions in reverse order
insertions.sort(reverse=True, key=lambda x: x[0])
for line_num, new_lines in insertions:
    lines[line_num:line_num] = new_lines

# Write back
with open('app/schemas/master_admin.py', 'w') as f:
    f.writelines(lines)

print(f"Added {len(insertions)} ListResponse classes")
