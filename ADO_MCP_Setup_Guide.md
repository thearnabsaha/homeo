# AWT2 -- Azure DevOps MCP Integration Guide for Cursor

> **Complete step-by-step guide** for configuring the Azure DevOps MCP server in Cursor, setting up PAT authentication, creating project rules for pipeline failure analysis and automated test case scripting.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [MCP Server Configuration](#2-mcp-server-configuration)
3. [PAT Authentication Setup](#3-pat-authentication-setup)
4. [Verify MCP Connection](#4-verify-mcp-connection)
5. [Rule 1 -- Pipeline Failure Analysis](#5-rule-1----pipeline-failure-analysis)
6. [Rule 2 -- ADO Test Case to Automation Script](#6-rule-2----ado-test-case-to-automation-script)
7. [Usage Examples](#7-usage-examples)
8. [Troubleshooting](#8-troubleshooting)
9. [Quick Reference](#9-quick-reference)

---

## 1. Prerequisites

| Requirement | Details |
|---|---|
| **Cursor IDE** | Latest version with MCP support |
| **Node.js** | v18+ installed and `npx` available on PATH |
| **ADO Organization** | `pwc-gx-assurance` (or your org name) |
| **ADO Project** | Access to target project (e.g. `Assurance_WorkItems`) |
| **Personal Access Token** | ADO PAT with scopes: `Build (Read)`, `Work Items (Read/Write)`, `Test Management (Read/Write)`, `Code (Read)`, `Pipeline Resources (Read)` |
| **AWT2 Repository** | Cloned locally at your workspace path |

### AWT2 Project Stack

- **.NET Framework 4.7.2** -- Target framework
- **C#** -- Programming language
- **NUnit 3.13.2** -- Test framework
- **Selenium WebDriver** -- Browser automation
- **MAQS Framework 7.0.6** -- Test automation framework
- **ExtentReports 4.1.0** -- Test reporting
- **Azure DevOps** -- CI/CD pipelines

### AWT2 Project Structure

```
AWT2/
├── QuickTest/                    # Main test automation project
│   ├── API/                      # API test implementations
│   │   ├── Aura/                 # Core Aura API tests
│   │   └── AuraWalkthrough/      # Walkthrough API tests
│   ├── AuraAPI/                  # API wrapper classes
│   ├── Config/                   # Configuration (SeleniumConfig, Constants, Properties)
│   ├── PageFactory/              # Page Object Model (~98 files)
│   │   ├── AuraOnline/           # Aura Online page objects
│   │   ├── Components/           # Reusable UI components
│   │   └── Constants/            # Locator constants
│   ├── ReusableFunctions/        # Shared helpers (~19 files)
│   │   ├── Helper.cs             # Core utilities (waits, clicks, scrolls)
│   │   ├── CanvasHelper.cs       # Canvas interaction helpers
│   │   ├── WebElementActions.cs  # Selenium element wrappers
│   │   ├── ShadowRootActions.cs  # Shadow DOM interactions
│   │   └── ...
│   ├── TestData/                 # JSON, DOCX, CSV test data
│   ├── TestSets/                 # Test classes (~993 files)
│   │   ├── AbstractTest.cs       # Base class all tests extend
│   │   ├── Data_Setup/           # Data setup tests
│   │   ├── APITest/              # API test sets
│   │   ├── BpFlowchart/          # Business Process flowchart tests
│   │   ├── BPICTests/            # BPIC test suites
│   │   ├── SP Flowchart/         # SP flowchart tests
│   │   ├── RC_EGA/               # EGA tests
│   │   └── ...
│   ├── Test.runsettings          # Standard test config (QA environment)
│   └── UATTest.runsettings       # UAT environment config
├── templates/                    # Azure DevOps pipeline templates (19 files)
│   ├── test_automation.yml       # Base test automation template
│   ├── test-automation-matrix-template.yml
│   ├── test-automation-parallel-template.yml
│   ├── BPICPipeline.yml
│   ├── SPICPipeline.yml
│   └── ...
├── pipelines/                    # Additional pipeline definitions
├── *.yml                         # Pipeline entry points (80+ YAML files)
├── QuickTest.sln                 # Solution file
└── README.md                     # Project documentation
```

---

## 2. MCP Server Configuration

### Step 2.1 -- Open MCP Settings

1. Open **Cursor IDE**
2. Go to **Settings** (gear icon or `Ctrl + ,`)
3. Navigate to **Tools & MCP**
4. Click **"+ Add new MCP server"** (or "Create custom MCP")

### Step 2.2 -- Add the ADO MCP JSON

Paste the following JSON configuration. Replace `YOUR-ORGANIZATION-NAME` with your actual ADO organization.

#### Template

```json
{
  "mcpServers": {
    "TestAzureDevops": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@azure-devops/mcp",
        "YOUR-ORGANIZATION-NAME",
        "--authentication",
        "envvar",
        "-d",
        "core",
        "work",
        "work-items",
        "search",
        "test-plans",
        "repositories",
        "pipelines",
        "wiki",
        "advanced-security"
      ],
      "env": {
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

#### AWT2 Configuration (for `pwc-gx-assurance`)

```json
{
  "mcpServers": {
    "TestAzureDevops": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@azure-devops/mcp",
        "pwc-gx-assurance",
        "--authentication",
        "envvar",
        "-d",
        "core",
        "work",
        "work-items",
        "search",
        "test-plans",
        "repositories",
        "pipelines",
        "wiki",
        "advanced-security"
      ],
      "env": {
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

### Configuration Key Explanations

| Field | Value | Purpose |
|---|---|---|
| `type` | `"stdio"` | MCP communicates via standard I/O |
| `command` | `"npx"` | Runs the MCP package via npx |
| `@azure-devops/mcp` | npm package | The official Azure DevOps MCP server |
| `pwc-gx-assurance` | org name | Your ADO organization |
| `--authentication` | `"envvar"` | Reads PAT from the `ADO_MCP_AUTH_TOKEN` environment variable |
| `-d` | domain flags | Enables specific ADO API domains (listed below) |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `"0"` | Bypasses TLS certificate validation (required for corporate proxies/firewalls) |

### Enabled API Domains

| Domain | Tools Available |
|---|---|
| `core` | Projects, teams, process metadata |
| `work` | Backlogs, boards, iterations, sprints |
| `work-items` | Create, read, update, query work items |
| `search` | Full-text search across code, work items, wiki |
| `test-plans` | Test plans, suites, cases, results, runs |
| `repositories` | Git repos, branches, pull requests, commits |
| `pipelines` | Builds, releases, logs, artifacts |
| `wiki` | Wiki pages, content |
| `advanced-security` | Security alerts, scanning results |

---

## 3. PAT Authentication Setup

### Step 3.1 -- Generate a PAT in Azure DevOps

1. Go to [https://pwc-gx-assurance.visualstudio.com/_usersSettings/tokens](https://pwc-gx-assurance.visualstudio.com/_usersSettings/tokens)
2. Click **"+ New Token"**
3. Configure:
   - **Name**: `Cursor MCP Token` (or any descriptive name)
   - **Organization**: `pwc-gx-assurance`
   - **Expiration**: Set per your security policy (max 1 year)
   - **Scopes**: Select the following:

| Scope | Access Level |
|---|---|
| Build | Read |
| Code | Read |
| Work Items | Read & Write |
| Test Management | Read & Write |
| Pipeline Resources | Read |
| Wiki | Read |
| Project and Team | Read |

4. Click **Create** and **copy the token immediately** (it won't be shown again)

### Step 3.2 -- Set the Environment Variable

Open a terminal (**not** inside Cursor) and run:

#### Windows (Command Prompt)

```cmd
setx ADO_MCP_AUTH_TOKEN "YOUR_PAT_TOKEN_HERE"
```

#### Windows (PowerShell)

```powershell
[System.Environment]::SetEnvironmentVariable("ADO_MCP_AUTH_TOKEN", "YOUR_PAT_TOKEN_HERE", "User")
```

#### macOS / Linux

```bash
echo 'export ADO_MCP_AUTH_TOKEN="YOUR_PAT_TOKEN_HERE"' >> ~/.bashrc
source ~/.bashrc
```

> **Important**: After setting the environment variable, you **must restart Cursor** completely for it to pick up the new variable. A simple window reload is not sufficient.

### Step 3.3 -- Verify the Variable is Set

After restarting Cursor, open the integrated terminal and verify:

```powershell
# PowerShell
echo $env:ADO_MCP_AUTH_TOKEN
```

```cmd
# Command Prompt
echo %ADO_MCP_AUTH_TOKEN%
```

You should see the PAT value (or at least confirm it's not empty).

---

## 4. Verify MCP Connection

### Step 4.1 -- Check MCP Status

1. Go to **Cursor Settings > Tools & MCP**
2. Look for **TestAzureDevops** in the server list
3. The status indicator should be **green** (connected)

### If the status is red or yellow

1. Click the **refresh** button next to the MCP server
2. If that doesn't work, **restart Cursor** entirely (`File > Exit`, then reopen)
3. If still failing, open **Cursor Settings > Tools & MCP** and re-save the configuration
4. Check the Cursor developer console (`Help > Toggle Developer Tools > Console`) for error messages

### Step 4.2 -- Test with a Simple Query

In Cursor Agent mode (Cmd/Ctrl + L), type:

```
List the projects in the pwc-gx-assurance organization using the ADO MCP
```

If the MCP is working, Cursor will call the `core_list_projects` tool and return project names.

---

## 5. Rule 1 -- Pipeline Failure Analysis

This rule teaches Cursor how to systematically diagnose and fix ADO pipeline failures.

### Step 5.1 -- Create the Rule

1. Go to **Cursor Settings > Rules, Skills, Subagents**
2. Click **Rule > New > Project Rule**
3. Name it: `ado-pipeline-analysis`
4. Paste the rule content below

### Rule Content

```markdown
# ADO Pipeline Failure Analysis Rule

You have access to the Azure DevOps MCP server (`user-TestAzureDevops`) with pipeline tools.
Use these tools to fetch logs, analyze errors, and fix failures in the AWT2 test automation codebase.

## Context

- **Organization**: pwc-gx-assurance
- **Project**: Assurance_WorkItems (or the specific project the pipeline lives in)
- **Codebase**: Selenium-based C# UI test automation (.NET Framework 4.7.2)
- **Solution**: QuickTest.sln
- **Base Test Class**: QuickTest.TestSets.AbstractTest

## Step-by-Step Workflow

When the user asks to analyze a pipeline failure, follow these steps in order:

### Step 1: Identify the Failed Build

Use `pipelines_get_builds` to find recent failed builds:

Tool: pipelines_get_builds
Args: {
  "project": "<PROJECT_NAME>",
  "resultFilter": 8,
  "queryOrder": "FinishTimeDescending",
  "top": 5
}

Note: `resultFilter` values: 2=Succeeded, 4=PartiallySucceeded, 8=Failed, 32=Canceled

If the user provides a specific build ID, skip to Step 2.

### Step 2: Get Build Status and Timeline

Use `pipelines_get_build_status` to get the build overview:

Tool: pipelines_get_build_status
Args: {
  "project": "<PROJECT_NAME>",
  "buildId": <BUILD_ID>
}

This returns the timeline with jobs, tasks, their results, and issue messages.
Look for records where `result` is `"failed"` and collect their `log.id` values.

### Step 3: Fetch Build Logs

First, list all available logs:

Tool: pipelines_get_build_log
Args: {
  "project": "<PROJECT_NAME>",
  "buildId": <BUILD_ID>
}

Then fetch the specific failed task log using the log ID from Step 2:

Tool: pipelines_get_build_log_by_id
Args: {
  "project": "<PROJECT_NAME>",
  "buildId": <BUILD_ID>,
  "logId": <LOG_ID>
}

If the log is very large, use `startLine` and `endLine` to paginate.
Focus on the last 200-500 lines where errors typically appear.

### Step 4: Get Test Results (if test execution step failed)

Tool: testplan_show_test_results_from_build_id
Args: {
  "project": "<PROJECT_NAME>",
  "buildid": <BUILD_ID>
}

This returns individual test case pass/fail results with error messages and stack traces.

### Step 5: Get Associated Code Changes

Tool: pipelines_get_build_changes
Args: {
  "project": "<PROJECT_NAME>",
  "buildId": <BUILD_ID>,
  "top": 20,
  "includeSourceChange": true
}

Correlate changes with the failure to determine if a recent commit caused the break.

### Step 6: Analyze and Classify the Error

Classify the failure into one of these categories and apply the appropriate fix:

#### Category A: Selenium / WebDriver Errors

| Error | Cause | Fix |
|---|---|---|
| `WebDriverException: Unexpected error creating WebSocket DevTools session` | Chrome/ChromeDriver mismatch or stale session | Update ChromeDriver, add `--no-sandbox`, `--disable-dev-shm-usage`, or add retry logic |
| `NoSuchElementException` / `ElementNotInteractableException` | Locator changed or timing issue | Update selector, add explicit waits (`WebDriverWait`) |
| `StaleElementReferenceException` | DOM refreshed between find and interact | Re-locate element, add retry wrapper |
| `TimeoutException` | Page load or wait exceeded | Increase timeout, check URL/page, add wait conditions |

#### Category B: Build / Compilation Errors

| Error | Fix |
|---|---|
| `error CS****` (C# compiler errors) | Read the referenced file and line, fix syntax/type/reference issues |
| `NuGet restore failed` | Check NuGet.Config, verify package source availability |

#### Category C: Infrastructure / Environment Errors

| Error | Fix |
|---|---|
| `self-signed certificate in certificate chain` | Set `NODE_TLS_REJECT_UNAUTHORIZED=0` or configure proper CA |
| `The agent did not connect` | Agent pool issue -- report to DevOps team (not fixable from code) |
| `##[error]Process completed with exit code 1` | Generic -- read full log to find the actual underlying error |

#### Category D: Test Data / Environment Errors

| Error | Fix |
|---|---|
| Login failures, "user not found" | Verify test data JSON/CSV files in TestData/, check environment config in runsettings |
| API response errors (4xx/5xx) | Check test environment health, verify API endpoints in Test.runsettings |
| Certificate errors during login | Verify OpenAM connection settings in Test.runsettings |

### Step 7: Apply the Fix

1. Read the failing source file using the Read tool
2. Identify the exact line/method causing the failure
3. Apply the fix using StrReplace
4. Check for linter errors using ReadLints
5. Summarize what was changed and why

## Output Format

Always present findings as:

1. **Build Summary**: ID, status, duration, branch, triggered by
2. **Failed Step**: Which pipeline task failed
3. **Root Cause**: The actual error with line reference
4. **Error Category**: A/B/C/D from above
5. **Fix Applied** or **Recommended Action**
6. **Affected Files**: List of files touched
```

---

## 6. Rule 2 -- ADO Test Case to Automation Script

This rule teaches Cursor how to read an ADO test case and generate a C# NUnit test script matching the AWT2 framework patterns.

### Step 6.1 -- Create the Rule

1. Go to **Cursor Settings > Rules, Skills, Subagents**
2. Click **Rule > New > Project Rule**
3. Name it: `ado-testcase-to-script`
4. Paste the rule content below

### Rule Content

```markdown
# ADO Test Case to Automation Script Rule

You have access to the Azure DevOps MCP server (`user-TestAzureDevops`) with work item and test plan tools.
Use them to read test case details from ADO and generate C# Selenium automation scripts that match the AWT2 project patterns.

## Project Context

- **Organization**: pwc-gx-assurance
- **Project**: Assurance_WorkItems (or the relevant project)
- **Framework**: NUnit + Selenium WebDriver (.NET Framework 4.7.2)
- **Language**: C#
- **Solution**: QuickTest.sln
- **Base Class**: QuickTest.TestSets.AbstractTest

## Step-by-Step Workflow

### Step 1: Fetch the Test Case from ADO

Use `wit_get_work_item` to read the full test case including steps:

Tool: wit_get_work_item
Args: {
  "id": <TEST_CASE_ID>,
  "project": "<PROJECT_NAME>",
  "fields": [
    "System.Title",
    "System.Description",
    "System.WorkItemType",
    "System.State",
    "System.AreaPath",
    "System.IterationPath",
    "Microsoft.VSTS.TCM.Steps",
    "Microsoft.VSTS.TCM.Parameters",
    "Microsoft.VSTS.Common.Priority"
  ],
  "expand": "all"
}

The `Microsoft.VSTS.TCM.Steps` field contains XML with `<step>` elements. Each step has:
- `<parameterizedString>` (action to perform)
- `<parameterizedString>` (expected result)

Parse these to understand the test flow.

### Step 2: Identify the Target Folder

Based on the test case title and area path, place the script in the appropriate folder under `QuickTest/TestSets/`.

Examine existing test files in the target area to match naming conventions and patterns.

### Step 3: Generate the Test Script

Follow this template:

```csharp
using NUnit.Framework;
using OpenQA.Selenium;
using QuickTest.Config;
using QuickTest.PageFactory;
using QuickTest.ReusableFunctions;
using QuickTest.TestSets;
using System;
using static QT_Stdlib.QT_Report;

namespace QuickTest.TestSets.<AREA>
{
    [Parallelizable(ParallelScope.Self)]
    internal class <ClassName>_TC<ID> : AbstractTest
    {
        protected override string BaseUrl => TestContext.Parameters["AOURL"];

        protected override void PerformCustomSetup() { }
        protected override void PerformCustomTearDown() { }

        [Test, Property("Description", "<TEST_CASE_TITLE>"), Order(0)]
        [Category("Active")]
        [Category("<CATEGORY>")]
        public void TC<ID>()
        {
            try
            {
                // --- TEST STEPS MAPPED FROM ADO ---
            }
            catch (Exception e)
            {
                ReportFail("Test Case failed: " + e);
            }
        }
    }
}
```

### Step 4: Map ADO Steps to Code

Read existing PageFactory and ReusableFunctions files to find methods that match the ADO test steps.
Use the Read tool on files in `QuickTest/PageFactory/` and `QuickTest/ReusableFunctions/` to discover available methods.

Key patterns from AbstractTest:
- `LoginIfNecessary(email)` -- login if login page is present
- `extractSessionStorageToken()` -- get OAuth token from session storage
- `GetTestData("path.json")` -- load JSON test data as dynamic object
- `GetEnvTestDataCsv(filePath, colName, methodName)` -- load CSV test data
- `GetTestDataFile(@"relative\path")` -- get full path to test data file

### Step 5: Handle Test Data

**JSON-based** (preferred for most tests):
```csharp
dynamic testData = GetTestData("SomeData.json");
string value = testData.SomeProperty;
```

**CSV-based** (for parameterized tests):
```csharp
string filePath = GetTestDataFile(@"Consultation\" + TestContext.Parameters["TestEnvironment"] + ".csv");
dynamic testData = GetEnvTestDataCsv(filePath, "ColumnName", "TC<ID>");
```

### Step 6: Validate the Generated Script

After writing the file:
1. Check for linter errors with ReadLints
2. Verify the namespace matches the folder path
3. Verify the class extends `AbstractTest`
4. Verify `BaseUrl` returns the correct URL from runsettings
5. Verify all referenced PageFactory methods exist
6. Always wrap the test body in try/catch with `ReportFail`

### Step 7: Associate with ADO Test Plan and Suite

After the script is created and validated, link it to the ADO test case.

#### 7a: Find the Test Plan and Suite

List plans:
Tool: testplan_list_test_plans
Args: { "project": "<PROJECT_NAME>", "filterActivePlans": true, "includePlanDetails": true }

List suites in a plan:
Tool: testplan_list_test_suites
Args: { "project": "<PROJECT_NAME>", "planId": <PLAN_ID> }

#### 7b: Add Test Case to Suite

Tool: testplan_add_test_cases_to_suite
Args: {
  "project": "<PROJECT_NAME>",
  "planId": <PLAN_ID>,
  "suiteId": <SUITE_ID>,
  "testCaseIds": ["<TEST_CASE_ID>"]
}

#### 7c: Set Automation Fields

Tool: wit_update_work_item
Args: {
  "id": <TEST_CASE_ID>,
  "updates": [
    { "op": "add", "path": "/fields/Microsoft.VSTS.TCM.AutomatedTestName", "value": "QuickTest.TestSets.<AREA>.<ClassName>_TC<ID>.TC<ID>" },
    { "op": "add", "path": "/fields/Microsoft.VSTS.TCM.AutomatedTestStorage", "value": "Quicktest.dll" },
    { "op": "add", "path": "/fields/Microsoft.VSTS.TCM.AutomatedTestId", "value": "<NEW_GUID>" },
    { "op": "add", "path": "/fields/Microsoft.VSTS.TCM.AutomationStatus", "value": "Automated" }
  ]
}

Note: The assembly name for this project is `Quicktest.dll` (from QuickTest.csproj).

#### 7d: Confirm

Re-read the work item to verify all automation fields are set.

## Important Rules

- NEVER hardcode URLs -- use `TestContext.Parameters["AOURL"]` or keys from Test.runsettings
- NEVER hardcode credentials -- use runsettings parameters
- ALWAYS extend `AbstractTest` as the base class
- ALWAYS wrap test body in try/catch with `ReportFail`
- ALWAYS use `[Category("Active")]` for pipeline-runnable tests
- Match the namespace exactly to the folder path under `QuickTest.TestSets`
```

---

## 7. Usage Examples

Once both the MCP server and rules are configured, you can use natural language prompts in Cursor Agent mode.

### Pipeline Failure Analysis

| Prompt | What Happens |
|---|---|
| `"Analyze the latest pipeline failure"` | Runs full workflow: find failed build -> get logs -> classify error -> suggest fix |
| `"Why did build 12345 fail?"` | Starts from Step 2 with that specific build ID |
| `"Fix the pipeline failure in build 12345"` | Analyzes the failure and applies code fixes to the local codebase |
| `"Get test results from the last failed build"` | Fetches test-level pass/fail details with stack traces |
| `"Show me the last 5 failed builds"` | Lists recent failed builds with summary info |

### Test Case Scripting

| Prompt | What Happens |
|---|---|
| `"Script test case 1465875 from ADO into TestSets/BpFlowchart"` | Reads ADO test case, generates C# script, places in correct folder |
| `"Read test case 12345 and create automation for it"` | Full workflow: fetch -> generate -> validate -> associate |
| `"Associate test case 12345 with test plan 'BVT' suite 'Smoke'"` | Finds plan/suite IDs, adds test case, sets automation fields |
| `"What are the steps in ADO test case 12345?"` | Just reads and displays the test case steps |

### General ADO Queries

| Prompt | What Happens |
|---|---|
| `"List all active test plans"` | Uses `testplan_list_test_plans` |
| `"Search for work items related to flowchart"` | Uses ADO search |
| `"Show recent commits in the AWT2 repo"` | Uses repository tools |
| `"What pipelines are available?"` | Lists pipeline definitions |

---

## 8. Troubleshooting

### MCP Server Won't Start (Red Indicator)

| Issue | Solution |
|---|---|
| `npx` not found | Install Node.js (v18+) and ensure it's on PATH. Run `node --version` to verify. |
| Package download fails | Check network/proxy settings. Try running `npx -y @azure-devops/mcp --help` manually in a terminal. |
| TLS/certificate errors on startup | Ensure `"NODE_TLS_REJECT_UNAUTHORIZED": "0"` is in the `env` section of the MCP config. |
| Server starts then dies | Check Cursor developer console (`Help > Toggle Developer Tools > Console`) for detailed errors. |

### Authentication Failures (401/403)

| Issue | Solution |
|---|---|
| PAT not recognized | Restart Cursor **completely** after setting `ADO_MCP_AUTH_TOKEN`. A window reload is not enough. |
| PAT expired | Generate a new PAT in ADO and update the environment variable. |
| Insufficient permissions | Verify PAT scopes include all required permissions (see Section 3.1). |
| Wrong organization | Verify the org name in MCP config matches where the PAT was generated. |

### MCP Responds But Returns Errors

| Issue | Solution |
|---|---|
| "Project not found" | Use the exact project name as it appears in ADO (case-sensitive). |
| "TF401019: The Git repository does not exist" | The repository name in ADO may differ from the local folder name. |
| Empty results | Verify the PAT has access to the specific project/repo. |
| Timeout on large queries | Use pagination parameters (`top`, `skip`) to limit result size. |

### Rule Not Triggering

| Issue | Solution |
|---|---|
| Rule not applying | Ensure the rule is saved as a **Project Rule** (not User Rule) and the project is open. |
| MCP tools not called | Verify the MCP server name in the rule matches the configured name (`user-TestAzureDevops`). |
| Wrong project in API calls | Update the project name in the rule to match your ADO project exactly. |

---

## 9. Quick Reference

### MCP Tool Cheat Sheet

| Tool | Purpose | Key Arguments |
|---|---|---|
| `pipelines_get_builds` | List builds | `project`, `resultFilter`, `top` |
| `pipelines_get_build_status` | Build timeline | `project`, `buildId` |
| `pipelines_get_build_log` | List build logs | `project`, `buildId` |
| `pipelines_get_build_log_by_id` | Specific log content | `project`, `buildId`, `logId` |
| `pipelines_get_build_changes` | Commits in build | `project`, `buildId` |
| `testplan_show_test_results_from_build_id` | Test results | `project`, `buildid` |
| `wit_get_work_item` | Read work item | `id`, `project`, `fields` |
| `wit_update_work_item` | Update work item | `id`, `updates` |
| `testplan_list_test_plans` | List test plans | `project`, `filterActivePlans` |
| `testplan_list_test_suites` | List suites | `project`, `planId` |
| `testplan_add_test_cases_to_suite` | Add TC to suite | `project`, `planId`, `suiteId`, `testCaseIds` |

### Build Result Filter Values

| Value | Meaning |
|---|---|
| `2` | Succeeded |
| `4` | Partially Succeeded |
| `8` | Failed |
| `32` | Canceled |

### Error Category Quick Reference

| Log Pattern | Category | Action |
|---|---|---|
| `WebDriverException` | A -- Selenium | Fix ChromeDriver/options |
| `NoSuchElement` | A -- Selenium | Update selector/add wait |
| `TimeoutException` | A -- Selenium | Increase wait/check page |
| `error CS` | B -- Build | Fix compilation error |
| `NuGet` | B -- Build | Package restore |
| `certificate` | C -- Infra | TLS config |
| `exit code 1` | C -- Infra | Read full log for real error |
| `401`/`403` | D -- Data/Env | Auth/token expired |
| `login failed` | D -- Data/Env | Test data or env config |

### Environment Config Locations

| File | Purpose |
|---|---|
| `QuickTest/Test.runsettings` | QA environment -- URLs, users, browser, reporting |
| `QuickTest/UATTest.runsettings` | UAT environment -- Sauce Labs, Headspin, mobile |
| `QuickTest/Config/SeleniumConfig.cs` | WebDriver configuration |
| `QuickTest/Config/Constants.cs` | Shared constants |
| `QuickTest/Config/Properties.cs` | Property accessors |
| `QuickTest/TestData/*.json` | Test data payloads |

### Key runsettings Parameters (from Test.runsettings)

| Parameter | Example Value |
|---|---|
| `TestEnvironment` | `QA` |
| `AOURL` | `https://qua002-ao.asr-np.pwcglb.com/` |
| `DefaultExecutiontype` | `chrome` |
| `ParallelExecutionScope` | `None` (local) / `All` (pipeline) |
| `Environment` | `qa2` |
| `consolidatedReport` | `true` |
| `shouldRerun` | `yes` |
| `APIBaseURL` | `https://qua002-auraapi.asr-np.pwcglb.com` |

---

## Summary Checklist

- [ ] Node.js v18+ installed with `npx` on PATH
- [ ] MCP JSON config added in **Cursor Settings > Tools & MCP**
- [ ] PAT generated in ADO with required scopes
- [ ] Environment variable `ADO_MCP_AUTH_TOKEN` set via `setx`
- [ ] Cursor fully restarted (not just reloaded)
- [ ] MCP indicator is **green** in Cursor settings
- [ ] Test query works (e.g., "list projects")
- [ ] Pipeline analysis rule created as project rule
- [ ] Test case scripting rule created as project rule
- [ ] Both rules reference correct MCP server name (`user-TestAzureDevops`)
