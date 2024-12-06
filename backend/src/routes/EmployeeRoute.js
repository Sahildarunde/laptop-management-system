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
    const employee = await prisma.employee.findUnique({
      where: { 
        id: parseInt(employeeId),
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

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
            returnedAt: null,
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
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const laptopRequest = await prisma.laptopRequest.create({
      data: {
        description,
        employeeId: parseInt(employeeId),
      },
    });

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
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const laptop = await prisma.laptop.findUnique({
      where: { id: parseInt(laptopId) },
    });

    if (!laptop) {
      return res.status(404).json({ error: "Laptop not found" });
    }

    const issueReport = await prisma.issue.create({
      data: {
        description,
        priority, 
        status: "AVAILABLE", 
        employeeId: parseInt(employeeId),
        laptopId: parseInt(laptopId),
        reportedAt: new Date(),
      },
    });

    res.status(201).json(issueReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.get("/laptop-requests", async (req, res) => {
  try {
    const laptopRequests = await prisma.laptopRequest.findMany();

    res.status(200).json(laptopRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.get("/reports", async (req, res) => {
  try {
    const issues = await prisma.issue.findMany();

    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

employeeRouter.delete("/laptop-requests/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const existingRequest = await prisma.laptopRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRequest) {
      return res.status(404).json({ error: "Laptop request not found" });
    }

    await prisma.laptopRequest.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Laptop request deleted successfully" });
  } catch (error) {
    console.error("Error deleting laptop request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


employeeRouter.post("/assign-laptop/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const availableLaptop = await prisma.laptop.findFirst({
      where: {
        status: 'AVAILABLE', 
      },
    });

    if (!availableLaptop) {
      return res.status(404).json({ error: "No available laptop found" });
    }

    const updatedLaptop = await prisma.laptop.update({
      where: { id: availableLaptop.id },
      data: {
        status: 'ASSIGNED',
      },
    });

    const newAssignment = await prisma.assignment.create({
      data: {
        laptopId: updatedLaptop.id,
        employeeId: parseInt(employeeId), 
        assignedAt: new Date(),
      },
    });

    res.status(200).json({
      message: `Laptop ${updatedLaptop.brand} ${updatedLaptop.model} assigned to employee ${employeeId} successfully`,
      assignment: newAssignment,
      laptop: updatedLaptop,
    });
  } catch (error) {
    console.error("Error assigning laptop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});






export default employeeRouter;
