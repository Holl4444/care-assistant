from api.models import normalize_text


def test_normalize_text_is_case_and_whitespace_insensitive():
    assert normalize_text("  Beethoven  —  Piano  ") == "beethoven piano"


def test_normalize_text_is_empty_for_punctuation_only():
    assert normalize_text(" — … ") == ""
