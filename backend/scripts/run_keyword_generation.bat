@echo off
REM Batch script to run blog keyword generation with API key prompt
REM Usage: run_keyword_generation.bat [--test] [--limit N]

echo ================================================================
echo Blog Keyword Generation Script
echo ================================================================
echo.

REM Check if OPENAI_API_KEY is already set
if defined OPENAI_API_KEY (
    echo OpenAI API Key: FOUND in environment
    echo.
) else (
    echo OpenAI API Key: NOT FOUND in environment
    echo.
    echo Please enter your OpenAI API key:
    set /p OPENAI_API_KEY=
    echo.
)

echo Running keyword generation...
echo.

REM Run the Python script with all arguments passed through
python generate_blog_keywords.py %*

echo.
echo ================================================================
echo Done!
echo ================================================================
