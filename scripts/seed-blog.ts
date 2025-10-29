import { drizzle } from "drizzle-orm/mysql2";
import { blogPosts } from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedBlogPosts() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  // Read the seed data
  const seedData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../blog_posts_seed.json"), "utf-8")
  );
  
  console.log(`Seeding ${seedData.length} blog posts...`);
  
  for (const post of seedData) {
    try {
      await db.insert(blogPosts).values({
        ...post,
        publishedAt: new Date(),
      });
      console.log(`✓ ${post.title}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⊘ ${post.title} (already exists)`);
      } else {
        console.error(`✗ ${post.title}:`, error.message);
      }
    }
  }
  
  console.log("\nBlog posts seeded successfully!");
  process.exit(0);
}

seedBlogPosts().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
