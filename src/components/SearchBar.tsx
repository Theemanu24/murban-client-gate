import { useMemo, useState, useEffect } from "react";
import Fuse from "fuse.js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { X, MapPin, CheckCircle } from "lucide-react";

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
      'totaluganda': [
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

  const AnimatedInput = ({ 
    value, 
    onChange, 
    onKeyDown, 
    placeholder, 
    disabled, 
    onClear,
    icon: IconComponent 
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder: string;
    disabled?: boolean;
    onClear?: () => void;
    icon?: React.ComponentType<any>;
  }) => (
    <div className="relative w-full">
      {/* Animated Border - Simple two-color rotating gradient */}
      <div className="absolute -inset-0.5 rounded-xl overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full animate-spin"
          style={{
            background: 'linear-gradient(90deg, #6366f1 50%, #ec4899 50%)',
            animationDuration: '3s',
          }}
        />
      </div>

      {/* Input Container */}
      <div className="relative bg-gray-900 rounded-xl">
        <input
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          className="w-full h-14 px-12 bg-gray-900 border-none rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-0 relative z-10"
        />
        
        {/* Icon */}
        {IconComponent && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
            <IconComponent className="w-6 h-6 text-gray-400" />
          </div>
        )}

        {/* Clear Button */}
        {value && onClear && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
            <button 
              onClick={onClear}
              className="text-gray-400 hover:text-white cursor-pointer p-1"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const SearchIcon = (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="22" y1="22" x2="16.65" y2="16.65" />
    </svg>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Client Search */}
      <div className="relative mb-4">
        <AnimatedInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, false)}
          placeholder="Type your company name..."
          disabled={!!selectedClient}
          onClear={resetSearch}
          icon={SearchIcon}
        />
      </div>

      {/* Client Results */}
      {!selectedClient && clientResults.length > 0 && (
        <Command className="mb-4 border rounded-xl !bg-white !border-gray-200">
          <CommandList>
            <CommandGroup heading="Companies">
              {clientResults.map((client, idx) => (
                <CommandItem
                  key={client.slug}
                  onSelect={() => handleClientSelect(client)}
                  className={`${idx === activeIndex ? "bg-accent/60" : ""} !bg-white hover:!bg-gray-50`}
                >
                  <span className="font-medium text-gray-900">{client.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}

      {!selectedClient && query.trim().length > 0 && query.trim().length < 5 && (
        <div className="p-4 text-gray-700 border rounded-xl bg-gray-50">
          Type at least 5 letters to search your company.
        </div>
      )}

      {!selectedClient && query.trim().length >= 5 && clientResults.length === 0 && (
        <div className="p-4 text-gray-700 border rounded-xl bg-gray-50">
          No matches. Contact support.
        </div>
      )}

      {/* Terminal Search - Only shown after client is selected */}
      {selectedClient && terminals.length > 0 && (
        <>
          <div className="relative mb-4">
            <AnimatedInput
              value={terminalQuery}
              onChange={(e) => setTerminalQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, true)}
              placeholder="Select terminal location..."
              onClear={() => setTerminalQuery("")}
              icon={MapPin}
            />
          </div>

          {/* Terminal Results */}
          {terminalResults.length > 0 && (
            <Command className="mt-3 border rounded-xl !bg-white !border-gray-200">
              <CommandList>
                <CommandGroup heading={`${selectedClient.name} Terminals`}>
                  {terminalResults.map((terminal, idx) => (
                    <CommandItem
                      key={terminal.name}
                      onSelect={() => handleTerminalSelect(terminal)}
                      className={`${idx === activeIndex ? "bg-accent/60" : ""} flex items-center justify-between !bg-white hover:!bg-gray-50`}
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-900">{terminal.name}</span>
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
        <div className="p-4 text-gray-700 border rounded-xl bg-gray-50">
          No terminals configured for {selectedClient.name}. Proceeding with company access...
        </div>
      )}
    </div>
  );
};
