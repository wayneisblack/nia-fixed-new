import { getMongoDatabase } from "../../../lib/mongodb";

export async function GET() {
  try {
    const database = await getMongoDatabase();

    return Response.json({
      status: "ok",
      app: "nia",
      database: database ? "connected" : "not-configured",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        status: "ok",
        app: "nia",
        database: "error",
        databaseError: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
