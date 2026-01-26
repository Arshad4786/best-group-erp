import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Connecting to database...");

  // 1. CLEAR EXISTING DATA (Order matters for foreign keys)
  // We must delete 'Employee' first because it depends on Company and Project
  await prisma.employee.deleteMany();      
  await prisma.quotationItem.deleteMany(); 
  await prisma.quotation.deleteMany();     
  await prisma.expense.deleteMany();       
  await prisma.labor.deleteMany();         
  await prisma.project.deleteMany();       
  await prisma.company.deleteMany();       
  await prisma.user.deleteMany();          

  console.log("🧹 Database cleared.");

  // 2. CREATE USERS
  console.log("👤 Creating Users...");
  
  await prisma.user.create({
    data: {
      email: "admin@bestgroup.com",
      password: "admin", 
      name: "Super Admin",
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      email: "eng1@bestgroup.com",
      password: "123",
      name: "Ahmed Al-Farsi",
      role: "ENGINEER",
    },
  });

  // 3. CREATE COMPANIES (Master & Subs)
  console.log("🏢 Creating Companies...");

  // Create the Master Company
  const masterCompany = await prisma.company.create({
    data: {
      name: "Best Group LLC",
      location: "Jeddah, Saudi Arabia",
      isMaster: true,
      vatNumber: "300012345600003",
      email: "info@bestgroup.com",
      phone: "+966 12 345 6789",
      bankName: "Al Rajhi Bank",
      iban: "SA1280000000001234567890",
      accountNumber: "1234567890",
      accountName: "Best Group LLC Main Account"
    }
  });

  // Create Sub Companies linked to Master
  const subCompany1 = await prisma.company.create({
    data: {
      name: "Best Manpower Services",
      location: "Riyadh, KSA",
      isMaster: false,
      masterId: masterCompany.id,
      bankName: "NCB Bank",
      accountNumber: "9876543210",
      accountName: "Best Manpower Ops"
    }
  });

  const subCompany2 = await prisma.company.create({
    data: {
      name: "Best Logistics",
      location: "Dammam, KSA",
      isMaster: false,
      masterId: masterCompany.id,
    }
  });

  // 4. CREATE PROJECTS
  console.log("🏗️ Creating Projects...");
  
  const dubaiMall = await prisma.project.create({
    data: {
      name: "Dubai Mall Renovation",
      clientName: "Emaar Properties",
      value: 130000,
      status: "Active",
      duration: "18 months",
      requiredManpower: 45,
    },
  });

  const riyadhTower = await prisma.project.create({
    data: {
      name: "Riyadh Tower Construction",
      clientName: "Kingdom Holding",
      value: 245000,
      status: "Active",
      duration: "24 months",
      requiredManpower: 120,
    },
  });

  // 5. CREATE EMPLOYEES
  console.log("👷 Creating Employees...");

  await prisma.employee.create({
    data: {
      fullName: "MOHAMMAD AKKAS ALI",
      employeeId: "3088181577",
      mobileNumber: "0501234567",
      gender: "Male",
      nationality: "Bangladeshi",
      category: "Skilled",
      companyId: subCompany1.id, // Linked to Manpower Services
      projectId: riyadhTower.id, // Linked to Riyadh Tower
      basicSalary: 2500.00,
      workShift: "Day",
      entryDate: new Date(),
    }
  });

  await prisma.employee.create({
    data: {
      fullName: "SARAH JOHNSON",
      employeeId: "1022938475",
      mobileNumber: "0559876543",
      gender: "Female",
      nationality: "Filipino",
      category: "Admin",
      companyId: masterCompany.id, // Linked to Best Group
      projectId: dubaiMall.id,     // Linked to Dubai Mall
      basicSalary: 4500.00,
      workShift: "Day",
      entryDate: new Date(),
    }
  });

  // 6. CREATE QUOTATIONS
  console.log("📄 Creating Quotations...");
  
  await prisma.quotation.create({
    data: {
      quoteNumber: "Q-1001",
      status: "Approved",
      quotationFor: "Emaar Properties",
      attention: "Mr. Omar Khalid",
      location: "Dubai, UAE",
      project: "Dubai Mall Renovation",
      workingHours: "10 hours / 6 days",
      rateType: "HOUR",
      duration: "12 Months",
      invoiceDays: "30 Days",
      quotationBy: "Ahmed Al-Farsi",
      manpower: 15,
      totalAmount: 150000,
      items: {
        create: [
          { description: "General Helper", rate: 15 },
          { description: "Skilled Mason", rate: 25 },
          { description: "Site Supervisor", rate: 45 },
        ]
      }
    }
  });

  await prisma.quotation.create({
    data: {
      quoteNumber: "Q-1003",
      status: "Pending",
      quotationFor: "Kingdom Holding",
      attention: "Ms. Sarah Lee",
      location: "Riyadh, KSA",
      project: "Riyadh Tower Construction",
      workingHours: "8 hours / 6 days",
      rateType: "MONTH",
      duration: "24 Months",
      invoiceDays: "15 Days",
      quotationBy: "Ahmed Al-Farsi",
      manpower: 10,
      totalAmount: 95000,
      items: {
        create: [
          { description: "Crane Operator", rate: 3500 },
          { description: "Safety Officer", rate: 4500 },
        ]
      }
    }
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });