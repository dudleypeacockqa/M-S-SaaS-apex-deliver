import pathlib
path = pathlib.Path('backend/app/api/routes/podcasts.py')
text = path.read_text()
old_return = "    return {\n        \"feature\": feature,\n        \"tier\": tier.value,\n        \"has_access\": has_access,\n        \"required_tier\": required_tier.value,\n    }\n\n"
if old_return not in text:
    raise SystemExit('Original return block not found in get_feature_access')
new_code = "    tier_label = entitlement_service.get_tier_label(tier)\n    required_tier_label = entitlement_service.get_tier_label(required_tier)\n    upgrade_required = not has_access\n    upgrade_message = None\n    upgrade_cta_url = None\n    if upgrade_required:\n        upgrade_message = entitlement_service.get_feature_upgrade_message(feature, tier)\n        upgrade_cta_url = entitlement_service.get_feature_upgrade_cta(feature)\n\n    return {\n        \"feature\": feature,\n        \"tier\": tier.value,\n        \"tier_label\": tier_label,\n        \"has_access\": has_access,\n        \"required_tier\": required_tier.value,\n        \"required_tier_label\": required_tier_label,\n        \"upgrade_required\": upgrade_required,\n        \"upgrade_message\": upgrade_message,\n        \"upgrade_cta_url\": upgrade_cta_url,\n    }\n\n"
path.write_text(text.replace(old_return, new_code))
