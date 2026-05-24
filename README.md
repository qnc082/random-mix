# Project Overview: Git Graph Architect

This script automates the process of backdating commits. By using the --date flag in Git, it "tricks" the contribution tracker into displaying activity for past dates.

## Prerequisites

Node.js installed on your machine.
Git configured locally.
An empty GitHub repository to push these commits to (recommended to keep your main profile clean).

# Installation

Initialize the project:

```bash
npm init -y
```

Install dependencies:

```bash
npm install simple-git moment jsonfile random
```

Ensure you have a data.json file in the root directory:

```json
{ "date": "2024-01-01T00:00:00Z" }
```

## Usage

Run the script with optional start and end dates (ISO 8601) and an optional commit count:
```
node index.js <startDate> <endDate> <commitCount>
```
- `startDate` and `endDate` define the inclusive range for generated commit dates. If omitted, the script uses its original random one‑year logic.
- `commitCount` defaults to 100 if not provided.

Examples:
- `node index.js 2023-01-01 2023-01-31 50` – generate 50 commits between Jan 1 and Jan 31 2023.
- `node index.js` – generate 100 commits using the default range.

# How to Change the Time Period

To control when the commits appear, you must modify the moment() logic in the script. Here are the most common configurations:

1. Target a Specific Year (e.g., 2018)
   If you want to fill squares in 2018, you need to subtract enough years to get back there.

   ```javascript
   const date = moment()
     .subtract(6, "y") // Goes back 6 years from today
     .add(x, "w") // Random week
     .add(y, "d") // Random day
     .format();
   ```

2. Target a Specific Range
   To stay within a small window (e.g., just last month):

   ```javascript
   const date = moment()
     .subtract(1, "m") // Start only 1 month ago
     .add(random.int(0, 30), "d") // Randomize days within that month
     .format();
   ```

3.
