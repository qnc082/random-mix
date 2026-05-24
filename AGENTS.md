# Git Graph Architect (random-mix) - AI Agents Guide

Welcome, AI Agents! This guide is designed to help you quickly understand the structure, logic, development workflow, and commands of the **random-mix** repository so you can effectively work with it, customize its behaviors, or make improvements.

---

## 1. Project Overview & Tech Stack

**random-mix** is a utility script that automates the generation of Git commits backdated into the past. By programmatically modifying a state file (`data.json`) and using Git's `--date` override flag, it enables users to draw patterns or back-populate activity on their GitHub contribution graphs.

### Tech Stack:
- **Runtime**: Node.js (configured as an ES Module via `"type": "module"` in `./package.json`)
- **Git Interaction**: `simple-git` for executing git staging, commits, and pushes
- **Date Manipulation**: `moment` for calculating relative dates and offsets
- **Data File Manipulation**: `jsonfile` for quick JSON read/write operations
- **Randomization**: `random` for generating random offsets and interval spacing

---

## 2. Directory Structure

Here is an overview of the codebase organization:

```text
random-mix/
├── node_modules/         # Node.js dependencies
├── .gitignore            # Excludes build, temporary, environment, and IDE configuration files
├── README.md             # Project setup and usage instructions
├── AGENTS.md             # AI agents guide (this file)
├── package.json          # Node.js package metadata, script runner configurations, and dependencies
├── package-lock.json     # Locked dependency tree configuration
├── data.json             # Target state file updated with the timestamp of each backdated commit
└── index.js              # Entrypoint script containing the commit generation logic
```

---

## 3. Core Logic & Implementation Details

The core functionality of the project resides in [`./index.js`](./index.js). It contains two main functions:

### `makeCommits(n)`
Generates commits recursively:
- **Termination**: If `n === 0`, it triggers a git push (`simpleGit().push()`) and completes.
- **Date Offsets**:
  - Generates random offsets for weeks `x` and days `y` (both between `0` and `4`).
  - Computes a date subtracting `1` year, adding `1` day, and adding the random offsets.
- **Write**: Overwrites [`./data.json`](./data.json) with `{ "date": "<computed_date>" }`.
- **Commit**: Uses `simple-git` to add `data.json` and create a commit using the calculated date for the `--date` git parameter.
- **Recursion**: Calls `makeCommits(--n)` recursively inside the callback of `jsonfile.writeFile`.

### `markCommit(x, y)`
A helper function (defined but not invoked by default):
- Calculates a date offset based on subtracting `2` years from the current time.
- Commits changes to [`./data.json`](./data.json) using the custom date offset and pushes.

---

## 4. Development Workflow & Usage Guide

If you are tasked with modifying or extending this script, adhere to the following workflow:

### A. Adjusting the Target Time Range
The commit generation time range can be customized by editing the `moment()` builder chain in `./index.js`:
- To shift the target year, edit `.subtract(1, "y")` to target a different year (e.g. `.subtract(3, "y")` to target 3 years ago).
- To target specific weeks/days or expand the random window, modify:
  ```javascript
  const x = random.int(0, 52); // target any week in the year
  const y = random.int(0, 6);  // target any day of the week
  ```

### B. Adjusting the Number of Commits
At the end of `./index.js`, `makeCommits(100)` is invoked. Modify this integer argument to change the total count of commits generated in a single run.

### C. Testing and Safety
- **Caution**: Running the script makes active commits in the local git repository and pushes to the configured remote repository.
- **Verification**: Always run `git status` and check `git log -n 5` locally after a test run of `makeCommits` with a low number (e.g., `makeCommits(2)`) to verify that the dates are correctly formed before pushing.

---

## 5. Developer & CLI Commands

| Task | Command |
| :--- | :--- |
| **Install Dependencies** | `npm install` |
| **Execute Commit Script** | `node index.js <startDate> <endDate> <commitCount>` (all optional) |
| **Test** | `npm test` *(Currently contains the default boilerplate)* |
