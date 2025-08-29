import { useMemo, useState, useEffect } from "react";
import Fuse from "fuse.js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Search, X, MapPin, Clock, CheckCircle } from "lucide-react";

type Client = Database['public']['Tables']['clients']['Row'];

interface Terminal {
  name: string;
  available: boolean;
}

interface SearchBarProps {
  onSelect: (client: Client, terminal?: string) => void;
}

export const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [terminalQuery, setTerminalQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);

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

  // Only show available terminals - no "coming soon" options
  const getTerminalsForClient = (clientSlug: string): Terminal[] => {
    const terminalMap: { [key: string]: Terminal[] } = {
      'rubis-zambia': [
        { name: 'Lusaka', available: true }
      ],
      'total-uganda': [
        { name: 'Jinja', available: true }
      ]
      // Other clients will have no terminals (empty array) until they're ready
    };
    return terminalMap[clientSlug] || [];
  };

  const fuse = useMemo(() => new Fuse(clients, {
    keys: ["name", "slug"],
    threshold: 0.3,
    ignoreLocation: true,
  }), [clients]);

  const terminalFuse = useMemo(() => new Fuse(terminals.map(t => ({ name: t.name, available: t.available })), {
    keys: ["name"],
    threshold: 0.3,
    ignoreLocation: true,
  }), [terminals]);

  const clientResults = useMemo(() => {
    const q = query.trim();
    if (q.length < 5) return [];
    return fuse.search(q).map(r => r.item).filter(c => c.active).slice(0, 8);
  }, [query, fuse]);

  const terminalResults = useMemo(() => {
    const q = terminalQuery.trim();
    if (q.length < 2 || !selectedClient) return terminals.slice(0, 6);
    return terminalFuse.search(q).map(r => r.item).slice(0, 6);
  }, [terminalQuery, terminalFuse, terminals, selectedClient]);

  useEffect(() => { setActiveIndex(0); }, [query, terminalQuery]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setQuery(client.name);
    const clientTerminals = getTerminalsForClient(client.slug);
    setTerminals(clientTerminals);
    setTerminalQuery("");
    
    // If no terminals available, proceed directly
    if (clientTerminals.length === 0) {
      onSelect(client);
    }
  };

  const handleTerminalSelect = (terminal: Terminal) => {
    setTerminalQuery(terminal.name);
    if (selectedClient) {
      // All shown terminals are available, so no need to check availability
      onSelect(selectedClient, terminal.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isTerminal = false) => {
    const currentResults = isTerminal ? terminalResults : clientResults;
    if (!currentResults.length) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % currentResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + currentResults.length) % currentResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isTerminal) {
        handleTerminalSelect(terminalResults[activeIndex]);
      } else {
        handleClientSelect(clientResults[activeIndex]);
      }
    }
  };

  const resetSearch = () => {
    setQuery("");
    setTerminalQuery("");
    setSelectedClient(null);
    setTerminals([]);
    setActiveIndex(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Client Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, false)}
          placeholder="Type your company name..."
          aria-label="Search company"
          autoComplete="off"
          className="pl-10 h-12 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
          disabled={!!selectedClient}
        />
        {query && (
          <button 
            aria-label="Clear" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" 
            onClick={resetSearch}
          >
            <X />
          </button>
        )}
      </div>

      {/* Client Results */}
      {!selectedClient && clientResults.length > 0 && (
        <Command className="mb-4 border rounded-xl">
          <CommandList>
            <CommandGroup heading="Companies">
              {clientResults.map((client, idx) => (
                <CommandItem
                  key={client.slug}
                  onSelect={() => handleClientSelect(client)}
                  className={idx === activeIndex ? "bg-accent/60" : ""}
                >
                  <span className="font-medium">{client.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}

      {!selectedClient && query.trim().length > 0 && query.trim().length < 5 && (
        <div className="p-4 text-muted-foreground border rounded-xl">
          Type at least 5 letters to search your company.
        </div>
      )}

      {!selectedClient && query.trim().length >= 5 && clientResults.length === 0 && (
        <div className="p-4 text-muted-foreground border rounded-xl">
          No matches. Contact support.
        </div>
      )}

      {/* Terminal Search - Only shown after client is selected */}
      {selectedClient && terminals.length > 0 && (
        <>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              value={terminalQuery}
              onChange={(e) => setTerminalQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, true)}
              placeholder="Select terminal location..."
              aria-label="Search terminal"
              autoComplete="off"
              className="pl-10 h-12 text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
            />
            {terminalQuery && (
              <button 
                aria-label="Clear terminal" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" 
                onClick={() => setTerminalQuery("")}
              >
                <X />
              </button>
            )}
          </div>

          {/* Terminal Results */}
          {terminalResults.length > 0 && (
            <Command className="mt-3 border rounded-xl">
              <CommandList>
                <CommandGroup heading={`${selectedClient.name} Terminals`}>
                  {terminalResults.map((terminal, idx) => (
                    <CommandItem
                      key={terminal.name}
                      onSelect={() => handleTerminalSelect(terminal)}
                      className={`${idx === activeIndex ? "bg-accent/60" : ""} flex items-center justify-between`}
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">{terminal.name}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Available
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}

          <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
            <span>Selected: {selectedClient.name}</span>
            <button 
              onClick={resetSearch}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Change company
            </button>
          </div>
        </>
      )}

      {/* No terminals available - proceed directly */}
      {selectedClient && terminals.length === 0 && (
        <div className="p-4 text-muted-foreground border rounded-xl">
          No terminals configured for {selectedClient.name}. Proceeding with company access...
        </div>
      )}
    </div>
  );
};
