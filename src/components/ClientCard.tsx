import { Client } from "@/data/clients";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export const ClientCard = ({ client, onClick }: { client: Client; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl border p-5 glossy-card transition-all hover:-translate-y-0.5 hover:shadow-lg hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Open ${client.name}`}
    >
      <div className="flex items-center gap-4">
        {client.logo_url ? (
          <img src={client.logo_url} alt={`${client.name} logo`} className="h-12 w-12 rounded-full border object-cover" loading="lazy" />
        ) : (
          <div className="h-12 w-12 rounded-full border grid place-content-center">
            <span className="text-primary font-semibold">{getInitials(client.name)}</span>
          </div>
        )}
        <div>
          <h3 className="font-semibold tracking-tight">{client.name}</h3>
          {client.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{client.description}</p>
          )}
        </div>
      </div>
    </button>
  );
};