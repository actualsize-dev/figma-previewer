const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_DATABASE_URL
});

async function migrateData() {
  try {
    console.log('Starting data migration...');

    // Read existing projects
    const projectsFile = path.join(process.cwd(), 'data', 'projects.json');
    const deletedProjectsFile = path.join(process.cwd(), 'data', 'deleted-projects.json');

    let activeProjects = [];
    let deletedProjects = [];

    if (fs.existsSync(projectsFile)) {
      const data = fs.readFileSync(projectsFile, 'utf8');
      activeProjects = JSON.parse(data);
    }

    if (fs.existsSync(deletedProjectsFile)) {
      const data = fs.readFileSync(deletedProjectsFile, 'utf8');
      deletedProjects = JSON.parse(data);
    }

    console.log(`Found ${activeProjects.length} active projects and ${deletedProjects.length} deleted projects`);

    // Clear existing data
    await prisma.project.deleteMany({});
    console.log('Cleared existing database data');

    // Migrate active projects
    for (const project of activeProjects) {
      await prisma.project.create({
        data: {
          id: project.id,
          name: project.name,
          slug: project.slug,
          figmaUrl: project.figmaUrl,
          clientLabel: project.clientLabel || 'Uncategorized',
          createdAt: new Date(project.createdAt),
          deletedAt: null
        }
      });
      console.log(`Migrated active project: ${project.name}`);
    }

    // Migrate deleted projects
    for (const project of deletedProjects) {
      await prisma.project.create({
        data: {
          id: project.id,
          name: project.name,
          slug: project.slug,
          figmaUrl: project.figmaUrl,
          clientLabel: project.clientLabel || 'Uncategorized',
          createdAt: new Date(project.createdAt),
          deletedAt: new Date(project.deletedAt)
        }
      });
      console.log(`Migrated deleted project: ${project.name}`);
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();