Here is the clean, practical documentation you asked for — written for a Node.js developer who is moving into NestJS + Next.js and wants to know exactly what goes where and why.

No fluff. No theory dump. Real structure.

 NestJS + Next.js Practical Guide
 Project Architecture Overview
/backend (NestJS)
 ├─ src
 │  ├─ app.module.ts
 │  ├─ main.ts
 │  ├─ users
 │  │   ├─ users.module.ts
 │  │   ├─ users.controller.ts
 │  │   ├─ users.service.ts
 │  ├─ tasks
 │  │   ├─ tasks.module.ts
 │  │   ├─ tasks.service.ts
 │  │   ├─ tasks.cron.ts

/frontend (Next.js)
 ├─ app
 │  ├─ page.tsx
 │  ├─ dashboard
 │  │   └─ page.tsx
 │  ├─ api
 │  │   └─ users
 │  │       └─ route.ts

🧩 1. Modules (Backbone of NestJS)
Purpose

Groups related logic. Nothing works without modules.

users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [UsersModule, TasksModule],
})
export class AppModule {}


Rule:
If it’s not inside a module → Nest will not recognize it.

🎮 2. Controllers (HTTP Entry Points)
users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }
}


Route becomes:

GET http://localhost:3000/users

🧠 3. Dependency Injection (How Services Connect)
users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getAllUsers() {
    return [{ id: 1, name: 'Honey' }];
  }
}


Why DI matters:
Nest creates the service instance for you and injects it automatically.
You never new anything. Ever.

⏰ 4. Cron Jobs in NestJS
Install
npm i @nestjs/schedule

tasks.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class TasksModule {}

tasks.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {

  @Cron('*/10 * * * * *')  // every 10 seconds
  handleCron() {
    console.log('Cron running...');
  }
}

🌐 5. Next.js Routing (Frontend)
UI Routing
app/page.tsx
export default function Home() {
  return <h1>Home Page</h1>;
}

app/dashboard/page.tsx
export default function Dashboard() {
  return <h1>Dashboard</h1>;
}


Routes:

/            → Home
/dashboard   → Dashboard

API Routing (Next.js talks to NestJS)
app/api/users/route.ts
export async function GET() {
  const res = await fetch('http://localhost:3000/users');
  const data = await res.json();

  return Response.json(data);
}


Now frontend calls:

GET /api/users


and internally hits NestJS backend.

🧬 How Everything Connects
Browser
   ↓
Next.js Page → /api/users → Next API Route
                              ↓
                        NestJS Controller
                              ↓
                         NestJS Service
                              ↓
                          Database / Logic

⚠️ Critical Rules
Mistake	Why It Breaks	Fix
Service not in Module	Nest won't create instance	Add to providers
Controller not in Module	Route never exists	Add to controllers
Cron not in Module	Scheduler never runs	Import ScheduleModule
Direct DB in Controller	Architecture collapse	Always go Controller → Service
🧪 Minimal Startup Commands

Backend

cd backend
npm run start:dev


Frontend

cd frontend
npm run dev
