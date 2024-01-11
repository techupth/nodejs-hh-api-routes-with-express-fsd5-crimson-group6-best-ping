// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsMockDatabase = [...assignments];
let commentsMockDataBase = [...comments];

const app = express();
const port = 4000;

//1 ขอข้อมูลทั้งหมด
app.get("/assignments", (req, res) => {
  // เขียน req.query (?limit=11) error
  const limit = req.query.limit;
  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignmentResult = assignmentsMockDatabase.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentResult,
  });
});
// 2 เข้าถึงแต่ละ id
app.get("/assignments/:assignmentsId", (req, res) => {
  // กำหนดให้เป็นเลข
  const assignmentId = Number(req.params.assignmentsId);
  //นำมาเทียบค่ากับแล้วเก็บไว้ในตัวแปร
  const newAssignmentId = assignmentsMockDatabase.filter((item) => {
    return item.id === assignmentId;
  });
  //return ตัวแปรออกไป

  return res.json({
    message: "Complete Fetching assignments",
    data: newAssignmentId[0],
  });
});

app.post("/assignments", (req, res) => {
  let assignmentsDataFromClient;
  let newAssignmentId;

  if (!assignmentsMockDatabase.length) {
    // ถ้าใน Mock Database ไม่มีข้อมูลอยู่เลย จะกำหนด newAssignmentId เป็น 1
    newAssignmentId = 1;
  } else {
    // ถ้าใน Mock Database มีข้อมูลอยู่แล้วจะกำหนด newAssignmentId เป็น Id ของ Assignment สุดท้ายเพิ่มขึ้น 1
    newAssignmentId =
      assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1;
  }

  // Assign ตัว Key id เข้าไปใน assignmentDataFromClient
  assignmentsDataFromClient = {
    id: newAssignmentId,
    ...req.body,
  };

  // เพิ่มข้อมูลลงไปใน Mock Database
  assignmentsMockDatabase.push(assignmentsDataFromClient);

  return res.json({
    message: "New assignment has been created successfully",
  });
});

app.delete("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  // หาข้อมูลใน Mock Database ก่อนกว่ามีไหม
  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  // ถ้าไม่มีก็ให้ Return error response กลับไปให้ Client
  if (!hasFound) {
    return res.json({
      message: "No assignment to delete",
    });
  }

  // กรองเอา Assignment ที่จะลบออกไปจาก Mock Database
  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  assignmentsMockDatabase = newAssignments;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const updateAssignmentData = {
    ...req.body,
  };

  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasFound) {
    return res.json({
      message: "No assignment to update",
    });
  }

  // หา Index ของข้อมูลใน Mock Database เพื่อที่จะเอามาใช้ Update ข้อมูล
  const assignmentIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  assignmentsMockDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...updateAssignmentData,
  };

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
  });
});
app.listen(port, () => {
  console.log(`running ${port}`);
});
