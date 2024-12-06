import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismaClient as prisma } from "../db/index.js";
import { authenticateToken } from "../middleware.js";

const employeeRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const ALLOWED_ROLES = ["ADMIN", "EMPLOYEE"];

const generateToken = (employee) => {
  return jwt.sign(
    {
      id: employee.id,
      email: employee.email,
      role: employee.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

employeeRouter.post("/signup", async (req, res) => {
  const { name, email, password, department, role } = req.body;

  if (!name || !email || !password || !department || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });
    if (existingEmployee) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        department,
        role,
        password: hashedPassword,
      },
    });

    const token = generateToken(newEmployee);

    res.status(201).json({
      message: "Employee created successfully",
      token,
      role: newEmployee.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(employee);

    res.status(200).json({
      message: "Login successful",
      employee: { id: employee.id, email: employee.email, role: employee.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


employeeRouter.get("/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.get("/employee/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch employee by id
    const employee = await prisma.employee.findUnique({
      where: { 
        id: parseInt(employeeId),
      },
    });

    // Check if employee was found
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Respond with the found employee
    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


employeeRouter.post("/assign-laptop",authenticateToken, async (req, res) => {
  const { laptopId, employeeId } = req.body;

  if (!laptopId || !employeeId) {
    return res.status(400).json({ error: "Laptop ID and Employee ID are required" });
  }

  try {
    const laptop = await prisma.laptop.findUnique({
      where: { id: laptopId },
    });

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!laptop) {
      return res.status(404).json({ error: "Laptop not found" });
    }

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    const assignment = await prisma.assignment.create({
      data: {
        laptopId,
        employeeId,
        assignedAt: new Date(),
      },
    });

    await prisma.laptop.update({
      where: { id: laptopId },
      data: {
        status: "ASSIGNED", 
      },
    });

    res.status(201).json({
      message: "Laptop assigned successfully",
      assignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.get("/employee/:employeeId/laptops", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { 
        id: parseInt(employeeId),
      },
      include: {
        assignments: {
          where: {
            returnedAt: null, // Only include assignments where returnedAt is null
          },
          include: {
            laptop: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const laptopsAssigned = employee.assignments.map((assignment) => assignment.laptop);

    res.status(200).json(laptopsAssigned);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


employeeRouter.post("/employee/:employeeId/laptop-request", async (req, res) => {
  const { employeeId } = req.params;
  const { description } = req.body;

  try {
    // Find the employee in the database
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Create a new laptop request
    const laptopRequest = await prisma.laptopRequest.create({
      data: {
        description,
        employeeId: parseInt(employeeId),
      },
    });

    // Respond with the created laptop request
    res.status(201).json(laptopRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


employeeRouter.post("/employee/:employeeId/report", async (req, res) => {
  const { employeeId } = req.params;
  const { laptopId, description, priority } = req.body;

  try {
    // Find the employee in the database
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Find the laptop in the database
    const laptop = await prisma.laptop.findUnique({
      where: { id: parseInt(laptopId) },
    });

    if (!laptop) {
      return res.status(404).json({ error: "Laptop not found" });
    }

    // Create a new report (Issue)
    const issueReport = await prisma.issue.create({
      data: {
        description,
        priority, // Assuming priority is one of 'LOW', 'MEDIUM', or 'HIGH'
        status: "AVAILABLE", // Default status can be 'AVAILABLE', you can change it as per your logic
        employeeId: parseInt(employeeId),
        laptopId: parseInt(laptopId),
        reportedAt: new Date(),
      },
    });

    // Respond with the created issue report
    res.status(201).json(issueReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});




export default employeeRouter;
