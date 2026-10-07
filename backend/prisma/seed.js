"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const sampleCourses = [
    {
        title: 'Mastering Next.js 15 & React 19 Fullstack',
        slug: 'mastering-nextjs-15-react-19-fullstack',
        description: 'Build enterprise-grade fullstack web applications using Next.js App Router, Server Actions, TanStack Query, and PostgreSQL.',
        instructor: 'Alex Rivera',
        instructorEmail: 'alex.rivera@edupro.dev',
        category: 'Frontend',
        level: client_1.CourseLevel.INTERMEDIATE,
        status: client_1.CourseStatus.PUBLISHED,
        price: 89.99,
        discountPrice: 49.99,
        durationHours: 32.5,
        lessonsCount: 64,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
        isFeatured: true,
        rating: 4.9,
        ratingCount: 320,
        studentsCount: 1420,
        tags: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Fullstack'],
        requirements: ['Solid JavaScript / ES6 knowledge', 'Basic React fundamentals'],
        objectives: [
            'Master Next.js App Router and Server Components',
            'Integrate TanStack Query for dynamic client caching',
            'Build performant CRUD systems with PostgreSQL'
        ]
    },
    {
        title: 'Node.js & Express Architecture at Scale',
        slug: 'nodejs-express-architecture-scale',
        description: 'Learn clean architecture, domain-driven design, security best practices, and PostgreSQL query optimization for enterprise Node.js APIs.',
        instructor: 'Elena Rostova',
        instructorEmail: 'elena.rostova@edupro.dev',
        category: 'Backend',
        level: client_1.CourseLevel.ADVANCED,
        status: client_1.CourseStatus.PUBLISHED,
        price: 99.99,
        discountPrice: 69.99,
        durationHours: 28.0,
        lessonsCount: 52,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        isFeatured: true,
        rating: 4.85,
        ratingCount: 210,
        studentsCount: 980,
        tags: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'System Design'],
        requirements: ['Proficiency in TypeScript', 'Basic backend knowledge'],
        objectives: [
            'Implement layered repository-service architecture',
            'Optimize database queries & connection pooling',
            'Secure APIs with JWT, rate limiting, and Helmet'
        ]
    },
    {
        title: 'Modern UI Engineering with Tailwind CSS & Ant Design',
        slug: 'modern-ui-engineering-tailwind-ant-design',
        description: 'Craft beautiful, accessible, and high-performance user interfaces combining the utility of Tailwind CSS with Ant Design components.',
        instructor: 'Sophia Chen',
        instructorEmail: 'sophia.chen@edupro.dev',
        category: 'Frontend',
        level: client_1.CourseLevel.BEGINNER,
        status: client_1.CourseStatus.PUBLISHED,
        price: 59.99,
        discountPrice: 34.99,
        durationHours: 18.0,
        lessonsCount: 38,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        isFeatured: false,
        rating: 4.75,
        ratingCount: 145,
        studentsCount: 750,
        tags: ['TailwindCSS', 'Ant Design', 'UI/UX', 'CSS', 'React'],
        requirements: ['Basic HTML and CSS knowledge'],
        objectives: [
            'Design accessible forms with React Hook Form',
            'Customize Ant Design theme tokens seamlessly',
            'Build responsive data dashboards and modals'
        ]
    },
    {
        title: 'PostgreSQL Database Administration & Performance Tuning',
        slug: 'postgresql-database-administration-performance',
        description: 'Deep dive into PostgreSQL indexing, query planning, partitioning, replication, and transaction isolation levels.',
        instructor: 'Marcus Vance',
        instructorEmail: 'marcus.vance@edupro.dev',
        category: 'Database',
        level: client_1.CourseLevel.ADVANCED,
        status: client_1.CourseStatus.PUBLISHED,
        price: 119.99,
        discountPrice: 79.99,
        durationHours: 35.0,
        lessonsCount: 58,
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
        isFeatured: false,
        rating: 4.92,
        ratingCount: 180,
        studentsCount: 620,
        tags: ['PostgreSQL', 'Database', 'SQL', 'Performance', 'DevOps'],
        requirements: ['Familiarity with SQL queries'],
        objectives: [
            'Analyze EXPLAIN ANALYZE execution plans',
            'Build effective B-Tree, GIN, and GiST indexes',
            'Set up streaming replication and backups'
        ]
    },
    {
        title: 'Fullstack AI Agent Development with TypeScript',
        slug: 'fullstack-ai-agent-development-typescript',
        description: 'Learn how to build AI-powered applications, tool-calling agents, vector embeddings with pgvector, and streaming interfaces.',
        instructor: 'David Miller',
        instructorEmail: 'david.miller@edupro.dev',
        category: 'AI & ML',
        level: client_1.CourseLevel.INTERMEDIATE,
        status: client_1.CourseStatus.DRAFT,
        price: 129.99,
        discountPrice: 89.99,
        durationHours: 25.0,
        lessonsCount: 45,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
        isFeatured: true,
        rating: 5.0,
        ratingCount: 12,
        studentsCount: 50,
        tags: ['AI', 'LLM', 'TypeScript', 'LangChain', 'pgvector'],
        requirements: ['Intermediate JavaScript/TypeScript', 'Basic REST API understanding'],
        objectives: [
            'Implement tool calling and autonomous agent loops',
            'Store and query embeddings with PostgreSQL pgvector',
            'Stream LLM completions into Next.js React client'
        ]
    },
    {
        title: 'Docker & Kubernetes for Web Developers',
        slug: 'docker-kubernetes-for-web-developers',
        description: 'Containerize your frontend, backend, and PostgreSQL database with Docker Compose and deploy to Kubernetes clusters.',
        instructor: 'Alex Rivera',
        instructorEmail: 'alex.rivera@edupro.dev',
        category: 'DevOps',
        level: client_1.CourseLevel.BEGINNER,
        status: client_1.CourseStatus.ARCHIVED,
        price: 69.99,
        discountPrice: 39.99,
        durationHours: 20.0,
        lessonsCount: 40,
        thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=80',
        isFeatured: false,
        rating: 4.6,
        ratingCount: 95,
        studentsCount: 410,
        tags: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Cloud'],
        requirements: ['Basic command line familiarity'],
        objectives: [
            'Write multi-stage Dockerfiles for Next.js & Node.js',
            'Manage multi-container setups with Docker Compose',
            'Deploy applications to production Kubernetes'
        ]
    }
];
async function main() {
    console.log('🌱 Starting database seeding...');
    // Clear existing courses
    await prisma.course.deleteMany({});
    for (const courseData of sampleCourses) {
        const created = await prisma.course.create({
            data: courseData
        });
        console.log(`✅ Created course: ${created.title} (${created.id})`);
    }
    console.log('🎉 Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
