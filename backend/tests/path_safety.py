"""Utilities to guard pytest against Windows reserved device names."""
from __future__ import annotations

from pathlib import PurePath
from typing import Any

WINDOWS_RESERVED_NAMES = {
    "con",
    "prn",
    "aux",
    "nul",
    "com1",
    "com2",
    "com3",
    "com4",
    "com5",
    "com6",
    "com7",
    "com8",
    "com9",
    "lpt1",
    "lpt2",
    "lpt3",
    "lpt4",
    "lpt5",
    "lpt6",
    "lpt7",
    "lpt8",
    "lpt9",
}


def _extract_basename(candidate: Any) -> str:
    """Return the final path component for strings, pathlib, or py.path objects."""

    if hasattr(candidate, "basename"):
        # py.path.local exposes basename for compatibility with pytest internals
        return str(candidate.basename).lower()

    if hasattr(candidate, "name"):
        try:
            return str(PurePath(candidate).name).lower()
        except TypeError:
            pass

    return str(candidate).split("/")[-1].split("\\")[-1].lower()


def is_windows_reserved_name(candidate: Any) -> bool:
    """True if the basename matches a reserved DOS device."""

    return _extract_basename(candidate) in WINDOWS_RESERVED_NAMES


def should_ignore_path(candidate: Any) -> bool:
    """Indicate whether pytest should skip collecting the provided path."""

    return os_name_equals_nt() and is_windows_reserved_name(candidate)


def os_name_equals_nt() -> bool:
    """Is the host running on Windows (nt)? Split out for testability."""

    import os

    return os.name == "nt"
