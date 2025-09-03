import { neon } from "@neondatabase/serverless"


export const sql = neon(process.env.DATABASE_URL)

export async function initDB() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL environment variable is not set");
        }

        console.log("🔗 Connecting to database...");
        
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("✅ Database initialized successfully")
    } catch (error) {
        console.error("❌ Error initializing DB:", error)
        throw error; // Lanzar el error en lugar de hacer process.exit aquí
    }
}