import type { Config } from "@netlify/functions";
import { and, count, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { teacherLikes } from "../../db/schema.js";

const teacherIds = new Set([
  "miss-saima",
  "miss-samina",
  "miss-arifa",
  "miss-qurtulain",
  "miss-mehwish",
  "miss-uzma",
  "miss-zarin",
  "nighat-maqsood",
]);

const isVoterId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-zA-Z0-9-]{20,80}$/.test(value);

async function getLikes(voterId?: string) {
  const totals = await db
    .select({ teacherId: teacherLikes.teacherId, total: count() })
    .from(teacherLikes)
    .groupBy(teacherLikes.teacherId);

  const liked = voterId
    ? await db
        .select({ teacherId: teacherLikes.teacherId })
        .from(teacherLikes)
        .where(eq(teacherLikes.voterId, voterId))
    : [];

  return {
    counts: Object.fromEntries(totals.map(({ teacherId, total }) => [teacherId, Number(total)])),
    liked: liked.map(({ teacherId }) => teacherId),
  };
}

export default async (request: Request) => {
  if (request.method === "GET") {
    const voterId = new URL(request.url).searchParams.get("voterId") || undefined;
    return Response.json(await getLikes(isVoterId(voterId) ? voterId : undefined));
  }

  if (request.method === "POST") {
    let body: { teacherId?: unknown; voterId?: unknown; liked?: unknown };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    if (typeof body.teacherId !== "string" || !teacherIds.has(body.teacherId)) {
      return Response.json({ error: "Teacher not found." }, { status: 404 });
    }
    if (!isVoterId(body.voterId) || typeof body.liked !== "boolean") {
      return Response.json({ error: "Invalid like request." }, { status: 400 });
    }

    const condition = and(
      eq(teacherLikes.teacherId, body.teacherId),
      eq(teacherLikes.voterId, body.voterId),
    );

    if (body.liked) {
      await db
        .insert(teacherLikes)
        .values({ teacherId: body.teacherId, voterId: body.voterId })
        .onConflictDoNothing();
    } else {
      await db.delete(teacherLikes).where(condition);
    }

    const [{ total }] = await db
      .select({ total: count() })
      .from(teacherLikes)
      .where(eq(teacherLikes.teacherId, body.teacherId));

    return Response.json({ teacherId: body.teacherId, liked: body.liked, count: Number(total) });
  }

  return Response.json({ error: "Method not allowed." }, { status: 405 });
};

export const config: Config = {
  path: "/api/likes",
};
