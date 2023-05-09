import { db } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { user } = request.query;

  if (!user || typeof user !== "string")
    return response.status(400).json({ error: "Missing user" });

  const client = await db.connect();

  if (request.method === "PUT") {
    const { name, experience } = request.body;
    if (!name || !experience)
      return response.status(400).json({ error: "Missing name or experience" });

    try {
      await client.sql`
        INSERT INTO experiences (name, username, experience)
        VALUES (${name}, ${user}, ${experience})
        ON CONFLICT (name, username) DO UPDATE SET experience = ${experience};
      `;

      return response.status(200).json({ message: "ok" });
    } catch (error) {
      return response.status(500).json({ error });
    }
  }

  try {
    await client.sql`CREATE TABLE IF NOT EXISTS experiences (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      experience JSON NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (name, username)
    );`;
  } catch (error) {
    return response.status(500).json({ error });
  }

  const experiences =
    await client.sql`SELECT * FROM experiences WHERE username=${user};`;

  return response.status(200).json({ experiences: experiences.rows });
}
