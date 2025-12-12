#!/usr/bin/env tsx
/**
 * Sync script to ensure all client labels from projects exist in the clients table
 * Run with: npx tsx scripts/sync-clients.ts
 */

import { config } from 'dotenv';
// Load .env.local first, then .env
config({ path: '.env.local' });
config();

import { prisma } from '../src/lib/db';

async function syncClients() {
  try {
    console.log('Starting client sync...');

    // Get all unique client labels from projects
    const projects = await prisma.project.findMany({
      select: {
        clientLabel: true
      }
    });

    const uniqueLabels = [...new Set(projects.map(p => p.clientLabel))]
      .filter(label => label && label !== 'Uncategorized');

    console.log(`Found ${uniqueLabels.length} unique client labels:`, uniqueLabels);

    // Upsert each client label into the clients table
    const results = await Promise.all(
      uniqueLabels.map(async (clientLabel) => {
        const result = await prisma.client.upsert({
          where: { clientLabel },
          update: {}, // Don't update if exists
          create: { clientLabel },
        });
        console.log(`  ✓ Synced: ${clientLabel}`);
        return result;
      })
    );

    console.log(`\n✅ Successfully synced ${results.length} clients to the database!`);

    // Show all clients in database
    const allClients = await prisma.client.findMany({
      orderBy: { clientLabel: 'asc' }
    });
    console.log('\nClients in database:');
    allClients.forEach(c => console.log(`  - ${c.clientLabel}${c.description ? ` (has description)` : ''}`));

  } catch (error) {
    console.error('Error syncing clients:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncClients();
