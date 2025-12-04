const fs = require('fs');
const path = require('path');

async function seedDataViaAPI() {
  try {
    console.log('Starting data migration via API...');

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

    // Migrate active projects
    for (const project of activeProjects) {
      const response = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: project.name,
          slug: project.slug,
          figmaUrl: project.figmaUrl,
          clientLabel: project.clientLabel || 'Uncategorized'
        })
      });

      if (response.ok) {
        console.log(`✓ Migrated active project: ${project.name}`);
      } else {
        const error = await response.text();
        console.error(`✗ Failed to migrate ${project.name}: ${error}`);
      }
    }

    console.log('Active projects migration completed!');
    console.log('Note: Deleted projects need to be handled manually through database updates');

  } catch (error) {
    console.error('Error during migration:', error);
  }
}

seedDataViaAPI();