import { db } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const client = await db.connect();

  if (request.method === "POST") {
    const { name } = request.body;
    if (!name) {
      return response.status(400).json({ error: "Missing name" });
    }

    try {
      const result = await client.sql`
        INSERT INTO users (name)
        VALUES (${name})
        RETURNING *;
      `;
      const user = result.rows[0];
      return response.status(200).json({ user });
    } catch (error) {
      return response.status(500).json({ error });
    }
  }

  try {
    await client.sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`;
  } catch (error) {
    return response.status(500).json({ error });
  }

  const users = await client.sql`SELECT * FROM users;`;
  return response.status(200).json({ users });
}
