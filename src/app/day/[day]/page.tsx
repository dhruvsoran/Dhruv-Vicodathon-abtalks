import { notFound } from "next/navigation";
import DayView from "@/components/day-view";
import { days, getDay, getDetail } from "@/lib/challenge";

export function generateStaticParams() {
  return days.map((d) => ({ day: String(d.day) }));
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const found = getDay(Number(day));
  return { title: found ? `Day ${found.day}: ${found.title} — ABTalks` : "Day — ABTalks" };
}

export default async function Page({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const n = Number(day);
  const found = getDay(n);
  if (!found) notFound();
  return <DayView day={found} detail={getDetail(n)} />;
}
