import { useMemo, useState, useEffect } from "react";
import Fuse from "fuse.js";
import { initialClients, Client } from "@/data/clients";
import { Input } from "@/components/ui/input";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSelect: (client: Client) => void;
}

export const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const fuse = useMemo(() => new Fuse(initialClients, {
    keys: ["name", "slug"],
    threshold: 0.3,
    ignoreLocation: true,
  }), []);

  const results = useMemo(() => {
    if (!query.trim()) return initialClients.filter(c => c.active).slice(0, 5);
    return fuse.search(query).map(r => r.item).filter(c => c.active).slice(0, 8);
  }, [query, fuse]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(results[activeIndex]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search company name..."
          aria-label="Search company"
          className="pl-10 h-12 text-base"
        />
        {query && (
          <button aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setQuery("") }>
            <X />
          </button>
        )}
      </div>

      <Command className="mt-3 border rounded-xl">
        <CommandList>
          <CommandGroup heading="Results">
            {results.map((client, idx) => (
              <CommandItem
                key={client.slug}
                onSelect={() => onSelect(client)}
                className={idx === activeIndex ? "bg-accent/60" : ""}
              >
                <span className="font-medium">{client.name}</span>
                <span className="ml-2 text-muted-foreground text-sm">/{client.slug}</span>
              </CommandItem>
            ))}
            {!results.length && (
              <div className="p-4 text-muted-foreground">No results. Contact support.</div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};
