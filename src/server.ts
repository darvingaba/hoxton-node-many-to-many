import Database from "better-sqlite3";
import cors from 'cors';
import express from 'express';

const app = express();
const db = Database("./db/data.db", { verbose: console.log });
app.use(cors());
app.use(express.json());

const port = 3421;

const getApplicants = db.prepare(`
SELECT * FROM applicants;
`)
const getInterviewers = db.prepare(`
SELECT * FROM interviewers;
`)
const getInterviews = db.prepare(`
SELECT * FROM interviews;
`)
const getInterviewFromId = db.prepare(`
SELECT * FROM interviews WHERE id = @id;
`)
const getApplicantFromId = db.prepare(`
SELECT * FROM applicants WHERE id = @id;
`);
const getInterviewerFromID = db.prepare(`
SELECT * FROM interviewers WHERE id=@id;
`);
const getInterviewsForApplicants = db.prepare(`
SELECT * FROM interviews WHERE applicantId = @applicantId;
`)
const getInterviewsForInterviewers = db.prepare(`
SELECT * FROM interviews WHERE interviewerId = @interviewerId;
`)
const getInterviewerForApplicant = db.prepare(`
SELECT name FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.applicantId=@applicantId
`);
const getApplicantForInterviewer = db.prepare(`
SELECT name FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId=@interviewerId
`);

const createApplicant = db.prepare(`
 INSERT INTO applicants(name,position,age) VALUES(@name,@position,@age);
`);
const createInterviewer = db.prepare(`
 INSERT INTO interviewers(name,age) VALUES(@name,@age);
`);
const createInterview = db.prepare(`
 INSERT INTO interviews(applicantId,interviewerId,time) VALUES(@applicantId,@interviewerId,@time);
`);

app.get('/applicants',(req,res)=>{
    const applicants = getApplicants.all();
    for(let applicant of applicants){
        applicant.interviews = getInterviewsForApplicants.all({applicantId: applicant.id})
    }
    res.send(applicants)
})
app.get('/interviews',(req,res)=>{
    const interviews = getInterviews.all();
    
    res.send(interviews)
})
app.get('/interviewers',(req,res)=>{
    const interviewers=getInterviewers.all()
    for(let interviewer of interviewers){
        interviewer.interviews = getInterviewsForInterviewers.all({interviewerId: interviewer.id})
    }
    res.send(interviewers)
})
app.get('/applicants/:id',(req,res)=>{
    const id = Number(req.params.id)
    const applicant = getApplicantFromId.get({id:id});
    console.log(applicant)
    if(applicant){
        applicant.interviewer = getInterviewerForApplicant.all({applicantId:applicant.id})
        applicant.interviews = getInterviewsForApplicants.all({applicantId:applicant.id})
        res.send(applicant)
    }else
    res.status(404).send({error:"No applicant found"})
});
app.get("/interviewers/:id", (req, res) => {
  const id = Number(req.params.id);
  const interviewer = getInterviewerFromID.get({ id: id });
  console.log(interviewer)
  if(interviewer){
      interviewer.applicant = getApplicantForInterviewer.all({interviewerId:interviewer.id})
      interviewer.interviews = getInterviewsForInterviewers.all({interviewerId:interviewer.id})
      res.send(interviewer);
  }else
  res.status(404).send({error:"No applicant found"})
});

app.post("/applicants",(req,res)=>{
  const name = req.body.name;
  const position = req.body.position;
  const age = req.body.age;

  const errors: string[] = [];

  if (typeof name !== "string") {
    errors.push("Name not given.");
  }

  if (typeof position !== "string") {
    errors.push("Position not given.");
  }
  if (typeof age !== "number") {
    errors.push("Age not given.");
  }
  let applicants = getApplicants.all();
  for (let applicant of applicants) {
    if(applicant.name===name){
      errors.push("Applicant already in the db")
    }
  }
  if(errors.length>0){
    res.status(404).send({errors})
  }else{
    const changes = createApplicant.run({name:name,position:position,age:age})
    const applicant = getApplicantFromId.get(changes.lastInsertRowid)
    res.send(applicant)
  }
})

app.post("/interviewers", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;

  const errors: string[] = [];

  if (typeof name !== "string") {
    errors.push("Name not given.");
  }

  if (typeof age !== "number") {
    errors.push("Age not given.");
  }
  let interviewers = getInterviewers.all();
  for (let interviewer of interviewers) {
    if (interviewer.name === name) {
      errors.push("Interviewer already in the db");
    }
  }
  if (errors.length > 0) {
    res.status(404).send({ errors });
  } else {
    const changes = createInterviewer.run({
      name: name,
      age: age,
    });
    const interviewer = getInterviewerFromID.get(changes.lastInsertRowid);
    res.send(interviewer);
  }
});

app.post("/interviews", (req, res) => {
  const applicantId =req.body.applicantId
  const interviewerId =req.body.interviewerId
  const time =req.body.time


  const errors: string[] = [];

  if (typeof applicantId !== "number") {
    errors.push("ApplicantId not given.");
  }

  if (typeof interviewerId !== "number") {
    errors.push("InterviewerId not given.");
  }
  // let interviews = getInterviews.all();
  // for (let interview of interviews) {
  //   if (interview.applicantId === applicantId || interview.interviewerId===interviewerId) {
  //     errors.push("Interview already in the db");
  //   }
  // }
  if (errors.length > 0) {
    res.status(404).send({ errors });
  } else {
    const changes = createInterview.run({
      applicantId:applicantId,
      interviewerId:interviewerId,
      time:time,
    });
    const interview = getInterviewFromId.get(changes.lastInsertRowid);
    res.send(interview);
  }
});



app.listen(port,()=>{console.log("server up")})