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
  // Add optional prop to restrict search to specific clients
  allowedClientSlugs?: string[];
  // Or add user context to determine allowed clients
  userContext?: {
    allowedClients?: string[];
    restrictedKeywords?: string[];
  };
}

export const SearchBar = ({ 
  onSelect, 
  allowedClientSlugs,
  userContext 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [terminalQuery, setTerminalQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);

  useEffect(() => {
    // Fetch clients from Supabase with proper filtering
    const fetchClients = async () => {
      let query = supabase
        .from('clients')
        .select('*')
        .eq('active', true);
      
      // If specific clients are allowed, filter to only those
      if (allowedClientSlugs && allowedClientSlugs.length > 0) {
        query = query.in('slug', allowedClientSlugs);
      }
      
      const { data: clients, error } = await query.order('name');
        
      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }
      
      setClients(clients || []);
    };
    fetchClients();
  }, [allowedClientSlugs]);

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

  // Enhanced filtering function to prevent cross-client visibility
  const isSearchAllowed = (client: Client, searchQuery: string): boolean => {
    const query = searchQuery.toLowerCase().trim();
    
    // If user context provides restrictions, check them
    if (userContext?.restrictedKeywords) {
      const hasRestrictedKeyword = userContext.restrictedKeywords.some(keyword => 
        query.includes(keyword.toLowerCase())
      );
      if (hasRestrictedKeyword && !userContext.allowedClients?.includes(client.slug)) {
        return false;
      }
    }
    
    // Example: Prevent "tank" searches from showing swahili client
    // and prevent "swahili/beach" searches from showing tank client
    const searchKeywordMapping = {
      'tank': ['tank-client-slug'], // Replace with actual tank client slug
      'swahili': ['swahili-client-slug'], // Replace with actual swahili client slug
      'beach': ['swahili-client-slug'], // Beach might be associated with swahili client
    };
    
    for (const [keyword, allowedSlugs] of Object.entries(searchKeywordMapping)) {
      if (query.includes(keyword)) {
        return allowedSlugs.includes(client.slug);
      }
    }
    
    return true;
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
    
    return fuse.search(q)
      .map(r => r.item)
      .filter(c => c.active && isSearchAllowed(c, q)) // Add isolation filter
      .slice(0, 8);
  }, [query, fuse]);

  const terminalResults = useMemo(() => {
    const q = terminalQuery.trim();
    // Only show terminals after user starts typing (at least 1 character)
    if (q.length < 1 || !selectedClient) return [];
    
    if (q.length < 2) return terminals.slice(0, 6);
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
      <div className="relative mb-4 search-container animated-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="search-icon absolute left-3 top-1/2 -translate-y-1/2"
        >
          <circle cx="11" cy="11" r="8" stroke="url(#searchGradient)" />
          <line x1="22" y1="22" x2="16.65" y2="16.65" stroke="url(#searchLineGradient)" />
          <defs>
            <linearGradient id="searchGradient" gradientTransform="rotate(50)">
              <stop offset="0%" stopColor="#f8e7f8" />
              <stop offset="50%" stopColor="#b6a9b7" />
            </linearGradient>
            <linearGradient id="searchLineGradient">
              <stop offset="0%" stopColor="#b6a9b7" />
              <stop offset="50%" stopColor="#837484" />
            </linearGradient>
          </defs>
        </svg>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, false)}
          placeholder="Type your company name..."
          aria-label="Search company"
          autoComplete="off"
          className="pl-10 h-12 text-base bg-white border-gray-300 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-black !bg-white !border-gray-300 hover:!border-gray-400 focus:!border-blue-500 focus:!ring-blue-500"
          style={{ 
            backgroundColor: 'white !important', 
            borderColor: '#d1d5db !important',
            '--tw-ring-color': '#3b82f6'
          }}
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
        <Command className="mb-4 border rounded-xl !bg-white !border-gray-200 animated-container">
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
        <div className="p-4 text-gray-700 border rounded-xl bg-gray-50 animated-container">
          Type at least 5 letters to search your company.
        </div>
      )}

      {!selectedClient && query.trim().length >= 5 && clientResults.length === 0 && (
        <div className="p-4 text-gray-700 border rounded-xl bg-gray-50 animated-container">
          No matches. Contact support.
        </div>
      )}

      {/* Terminal Search - Only shown after client is selected */}
      {selectedClient && terminals.length > 0 && (
        <>
          <div className="relative animated-container">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              value={terminalQuery}
              onChange={(e) => setTerminalQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, true)}
              placeholder="Select terminal location..."
              aria-label="Search terminal"
              autoComplete="off"
              className="pl-10 h-12 text-base bg-white border-gray-300 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-black !bg-white !border-gray-300 hover:!border-gray-400 focus:!border-blue-500 focus:!ring-blue-500"
              style={{ 
                backgroundColor: 'white !important', 
                borderColor: '#d1d5db !important',
                '--tw-ring-color': '#3b82f6'
              }}
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
            <Command className="mt-3 border rounded-xl !bg-white !border-gray-200 animated-container">
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
        <div className="p-4 text-gray-700 border rounded-xl bg-gray-50 animated-container">
          No terminals configured for {selectedClient.name}. Proceeding with company access...
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-3px);
            }
          }

          @keyframes glow-pulse {
            0%, 100% {
              box-shadow: 0 0 5px rgba(59, 130, 246, 0.1);
            }
            50% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
            }
          }

          .animated-container {
            animation: float 4s ease-in-out infinite, glow-pulse 3s ease-in-out infinite;
            transition: all 0.3s ease;
          }

          .animated-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
        `
      }} />
    </div>
  );
};
