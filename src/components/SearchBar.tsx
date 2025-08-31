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

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Client Search */}
      <div className="relative mb-4 search-container">
        <div className="relative floating-container">
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
            className="pl-10 h-12 text-base bg-white/95 backdrop-blur-sm border-0 text-black placeholder:text-gray-500 focus:ring-0 focus:border-0 focus:text-black shadow-[0_0_30px_rgba(59,130,246,0.3),0_0_60px_rgba(147,51,234,0.2),0_8px_32px_rgba(0,0,0,0.1)] rounded-xl floating-glow"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(147, 51, 234, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
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
      </div>

      {/* Client Results */}
      {!selectedClient && clientResults.length > 0 && (
        <Command className="mb-4 border-0 rounded-xl bg-white/95 backdrop-blur-sm floating-container shadow-[0_0_20px_rgba(59,130,246,0.2),0_0_40px_rgba(147,51,234,0.15),0_6px_24px_rgba(0,0,0,0.1)]">
          <CommandList>
            <CommandGroup heading="Companies">
              {clientResults.map((client, idx) => (
                <CommandItem
                  key={client.slug}
                  onSelect={() => handleClientSelect(client)}
                  className={`${idx === activeIndex ? "bg-accent/60" : ""} bg-transparent hover:bg-white/60 backdrop-blur-sm`}
                >
                  <span className="font-medium text-gray-900">{client.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}

      {!selectedClient && query.trim().length > 0 && query.trim().length < 5 && (
        <div className="p-4 text-gray-700 rounded-xl bg-white/95 backdrop-blur-sm floating-container shadow-[0_0_20px_rgba(59,130,246,0.2),0_0_40px_rgba(147,51,234,0.15),0_6px_24px_rgba(0,0,0,0.1)]">
          Type at least 5 letters to search your company.
        </div>
      )}

      {!selectedClient && query.trim().length >= 5 && clientResults.length === 0 && (
        <div className="p-4 text-gray-700 rounded-xl bg-white/95 backdrop-blur-sm floating-container shadow-[0_0_20px_rgba(59,130,246,0.2),0_0_40px_rgba(147,51,234,0.15),0_6px_24px_rgba(0,0,0,0.1)]">
          No matches. Contact support.
        </div>
      )}

      {/* Terminal Search - Only shown after client is selected */}
      {selectedClient && terminals.length > 0 && (
        <>
          <div className="relative">
            <div className="relative floating-container">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
              <Input
                value={terminalQuery}
                onChange={(e) => setTerminalQuery(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, true)}
                placeholder="Select terminal location..."
                aria-label="Search terminal"
                autoComplete="off"
                className="pl-10 h-12 text-base bg-white/95 backdrop-blur-sm border-0 text-black placeholder:text-gray-500 focus:ring-0 focus:border-0 focus:text-black shadow-[0_0_30px_rgba(59,130,246,0.3),0_0_60px_rgba(147,51,234,0.2),0_8px_32px_rgba(0,0,0,0.1)] rounded-xl floating-glow"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(147, 51, 234, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                }}
              />
              {terminalQuery && (
                <button 
                  aria-label="Clear terminal" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10" 
                  onClick={() => setTerminalQuery("")}
                >
                  <X />
                </button>
              )}
            </div>
          </div>

          {/* Terminal Results */}
          {terminalResults.length > 0 && (
            <Command className="mt-3 border-0 rounded-xl bg-white/95 backdrop-blur-sm floating-container shadow-[0_0_20px_rgba(59,130,246,0.2),0_0_40px_rgba(147,51,234,0.15),0_6px_24px_rgba(0,0,0,0.1)]">
              <CommandList>
                <CommandGroup heading={`${selectedClient.name} Terminals`}>
                  {terminalResults.map((terminal, idx) => (
                    <CommandItem
                      key={terminal.name}
                      onSelect={() => handleTerminalSelect(terminal)}
                      className={`${idx === activeIndex ? "bg-accent/60" : ""} flex items-center justify-between bg-transparent hover:bg-white/60 backdrop-blur-sm`}
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
        <div className="p-4 text-gray-700 rounded-xl bg-white/95 backdrop-blur-sm floating-container shadow-[0_0_20px_rgba(59,130,246,0.2),0_0_40px_rgba(147,51,234,0.15),0_6px_24px_rgba(0,0,0,0.1)]">
          No terminals configured for {selectedClient.name}. Proceeding with company access...
        </div>
      )}

      <style jsx>{`
        .floating-container {
          animation: float 6s ease-in-out infinite;
          position: relative;
        }
        
        .floating-glow {
          position: relative;
        }
        
        .floating-glow::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            rgba(59, 130, 246, 0.6),
            rgba(147, 51, 234, 0.6),
            rgba(236, 72, 153, 0.6),
            rgba(59, 130, 246, 0.6)
          );
          background-size: 300% 300%;
          border-radius: 14px;
          z-index: -1;
          animation: shimmer 4s ease-in-out infinite, pulse-glow 3s ease-in-out infinite alternate;
          filter: blur(1px);
        }
        
        .floating-glow::after {
          content: '';
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          background: linear-gradient(45deg,
            rgba(59, 130, 246, 0.3),
            rgba(147, 51, 234, 0.3),
            rgba(236, 72, 153, 0.3),
            rgba(59, 130, 246, 0.3)
          );
          background-size: 400% 400%;
          border-radius: 18px;
          z-index: -2;
          animation: shimmer 6s ease-in-out infinite reverse, outer-glow 4s ease-in-out infinite alternate;
          filter: blur(3px);
          opacity: 0.8;
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-3px) rotate(0.5deg); 
          }
          50% { 
            transform: translateY(-6px) rotate(0deg); 
          }
          75% { 
            transform: translateY(-3px) rotate(-0.5deg); 
          }
        }
        
        @keyframes shimmer {
          0% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
          100% { 
            background-position: 0% 50%; 
          }
        }
        
        @keyframes pulse-glow {
          0% { 
            opacity: 0.8;
            filter: blur(1px) brightness(1);
          }
          100% { 
            opacity: 1;
            filter: blur(2px) brightness(1.2);
          }
        }
        
        @keyframes outer-glow {
          0% { 
            opacity: 0.6;
            transform: scale(1);
            filter: blur(3px);
          }
          100% { 
            opacity: 0.9;
            transform: scale(1.02);
            filter: blur(4px);
          }
        }
      `}</style>
    </div>
  );
};
