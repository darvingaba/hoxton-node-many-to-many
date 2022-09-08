import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });

const applicants = [
  {
    name: "John",
    position: "FrontEnd Developer",
    age: 25,
  },
  {
    name: "Ben",
    position: "FrontEnd Developer",
    age: 20,
  },
  {
    name: "Jim",
    position: "FrontEnd Developer",
    age: 29,
  },
  {
    name: "Andy",
    position: "FrontEnd Developer",
    age: 28,
  },
];
const interviewers = [
  {
    name: "Ed",
    age: 28,
  },
  {
    name: "Nicolas",
    age: 34,
  },
];
const interviews = [
  {
    applicantId: 1,
    interviewerId: 2,
    time: "22/10/2022",
  },
  {
    applicantId: 2,
    interviewerId: 1,
    time: "23/10/2022",
  },
  {
    applicantId: 3,
    interviewerId: 2,
    time: "24/10/2022",
  },
  {
    applicantId: 1,
    interviewerId: 1,
    time: "25/10/2022",
  },
  {
    applicantId: 4,
    interviewerId: 2,
    time: "22/10/2022",
  },
];
// const deleteTable = db.prepare(`
// DROP TABLE interviews
// `);
// deleteTable.run();
// const deleteTable1 = db.prepare(`
// DROP TABLE applicants
// `);
// deleteTable1.run();
// const deleteTable2 = db.prepare(`
// DROP TABLE interviewers
// `);
// deleteTable2.run();

const deleteApplicants = db.prepare(`
DELETE FROM  applicants;
`);
deleteApplicants.run();

const createApplicantsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS applicants(
    id INTEGER,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    age INTEGER,
    PRIMARY KEY (id)
)
`);
createApplicantsTable.run();

const createApplicant = db.prepare(`
 INSERT INTO applicants(name,position,age) VALUES(@name,@position,@age);
`);

for (let applicant of applicants) {
  createApplicant.run(applicant);
}

const deleteInterviewers = db.prepare(`
DELETE FROM  interviewers;
`);
deleteInterviewers.run();

const createInterviewersTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers(
    id INTEGER,
    name TEXT,
    age INTEGER,
    PRIMARY KEY (id)
)
`);
createInterviewersTable.run();

const createInterviewer = db.prepare(`
INSERT INTO interviewers(name,age)
VALUES(@name,@age)
`);
for (let interviewer of interviewers) {
  createInterviewer.run(interviewer);
}

const deleteInterviews = db.prepare(`
DELETE FROM  interviews;
`);
deleteInterviews.run();

const createInterviewsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews(
    id INTEGER,
    applicantId INTEGER,
    interviewerId INTEGER,
    time TEXT,
    PRIMARY KEY (id)
)
`);
createInterviewsTable.run();

const createInterview = db.prepare(`
INSERT INTO interviews(applicantId,interviewerId,time)
VALUES(@applicantId,@interviewerId,@time)
`);
for (let interview of interviews) {
  createInterview.run(interview);
}
