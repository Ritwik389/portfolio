import { getRatings } from "@/lib/ratings-server";

// ISR on Vercel/Netlify; an explicit build snapshot for GitHub Pages exports.
export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  const ratings = await getRatings();
  return Response.json({ ...ratings, mode: process.env.PORTFOLIO_STATIC_EXPORT === "1" ? "snapshot" : "live" });
}
