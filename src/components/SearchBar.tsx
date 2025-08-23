
import { useMemo, useState, useEffect } from "react";
import Fuse from "fuse.js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Search, X } from "lucide-react";

type Client = Database['public']['Tables']['clients']['Row'];

interface SearchBarProps {
  onSelect: (client: Client) => void;
}

export const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    // Fetch clients from Supabase
    const fetchClients = async () => {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('active', true)
        .order('name');
        
      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }
      
      setClients(clients || []);
    };

    fetchClients();
  }, []);

  const fuse = useMemo(() => new Fuse(clients, {
    keys: ["name", "slug"],
    threshold: 0.3,
    ignoreLocation: true,
  }), [clients]);

  const results = useMemo(() => {
    const q = query.trim();
    // Changed from 2 to 5 characters minimum
    if (q.length < 5) return [];
    return fuse.search(q).map(r => r.item).filter(c => c.active).slice(0, 8);
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your company name..."
          aria-label="Search company"
          autoComplete="off"
          className="pl-10 h-12 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setQuery("") }>
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
              </CommandItem>
            ))}
            {!results.length && (
              <div className="p-4 text-muted-foreground">
                {query.trim().length < 5 ? "Type at least 5 letters to search your company." : "No matches. Contact support."}
              </div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};
