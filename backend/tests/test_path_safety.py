"""Unit tests for pytest reserved-path protection."""
from __future__ import annotations

import pytest

from tests import path_safety


def test_pytest_ignore_collect_delegates_to_path_safety(monkeypatch):
    from backend.tests import conftest as backend_conftest

    monkeypatch.setattr(path_safety, "os_name_equals_nt", lambda: True)
    assert backend_conftest.pytest_ignore_collect("nul", object()) is True

    monkeypatch.setattr(path_safety, "os_name_equals_nt", lambda: False)
    assert backend_conftest.pytest_ignore_collect("nul", object()) is False


def test_reserved_name_detection_handles_strings():
    assert path_safety.is_windows_reserved_name("C:/repo/backend/nul")
    assert path_safety.is_windows_reserved_name("nul")
    assert not path_safety.is_windows_reserved_name("backend/tests")


def test_reserved_name_detection_handles_py_path_like_objects():
    class DummyPath:
        def __init__(self, basename: str) -> None:
            self.basename = basename

    assert path_safety.is_windows_reserved_name(DummyPath("CON"))


def test_should_ignore_path_only_on_windows(monkeypatch):
    monkeypatch.setattr(path_safety, "os_name_equals_nt", lambda: True)
    assert path_safety.should_ignore_path("nul")

    monkeypatch.setattr(path_safety, "os_name_equals_nt", lambda: False)
    assert not path_safety.should_ignore_path("nul")
