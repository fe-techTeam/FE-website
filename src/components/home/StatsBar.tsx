import { Users, MapPin, Share2, Globe, DollarSign, Award, Network, type LucideIcon } from "lucide-react";

export type StatBarItem = {
  label: string;
  value: string;
  description?: string;
};

const statIcons: Record<string, LucideIcon> = {
  People: Users,
  Cities: MapPin,
  Agencies: Share2,
  "Marketing Agencies": Share2,
  Markets: Globe,
  "Media Billings": DollarSign,
  Billings: DollarSign,
  "Media Awards": Award,
  "Growth System": Network,
  Minds: Users,
};

function StatValue({ value }: { value: string }) {
  if (value.endsWith("+")) {
    return (
      <>
        {value.slice(0, -1)}
        <span className="text-red">+</span>
      </>
    );
  }
  return <>{value}</>;
}

export default function StatsBar({ stats, showIcons = false }: { stats: StatBarItem[]; showIcons?: boolean }) {
  return (
    <div className="border-t border-paper/10 bg-ink">
      <div className="grid container-frame grid-cols-2 divide-x divide-paper/10 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = statIcons[stat.label] ?? Award;
          return (
            <div key={stat.label} className="px-5 py-8 first:pl-0">
              {showIcons && <Icon size={16} className="mb-3 text-red" />}
              <p className="font-heading text-3xl text-paper md:text-4xl">
                <StatValue value={stat.value} />
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-paper/60">{stat.label}</p>
              {stat.description && <p className="mt-2 max-w-[16rem] text-xs text-paper/40">{stat.description}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
