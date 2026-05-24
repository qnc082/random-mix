import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// CLI arguments: startDate endDate commitCount
const startDateArg = process.argv[2];
const endDateArg = process.argv[3];
const countArg = process.argv[4];

const startDate = startDateArg ? moment(startDateArg) : null;
const endDate = endDateArg ? moment(endDateArg) : null;
const commitCount = countArg ? parseInt(countArg, 10) : 100;

// Validate date range if both provided
if (startDate && endDate && startDate.isAfter(endDate)) {
  console.error("Error: startDate must be before or equal to endDate.");
  process.exit(1);
}

// Helper to generate a random date within the optional range
function getRandomDate() {
  if (startDate && endDate) {
    const diffMs = endDate.diff(startDate);
    const randomMs = random.int(0, diffMs);
    return moment(startDate).add(randomMs, "ms").format();
  } else {
    // Original random logic: within 1 year range with weekly/day offsets
    const x = random.int(0, 4);
    const y = random.int(0, 4);
    return moment()
      .subtract(1, "y")
      .add(1, "d")
      .add(x, "w")
      .add(y, "d")
      .format();
  }
}

// Existing helper (kept for compatibility)
const markCommit = (x, y) => {
  const date = moment()
    .subtract(2, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = { date };
  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }).push();
  });
};

const makeCommits = (n) => {
  if (n === 0) return simpleGit().push();
  const date = getRandomDate();
  const data = { date };
  console.log(date);
  jsonfile.writeFile(path, data, () => {
    simpleGit()
      .add([path])
      .commit(date, { "--date": date }, makeCommits.bind(this, --n));
  });
};

makeCommits(commitCount);
