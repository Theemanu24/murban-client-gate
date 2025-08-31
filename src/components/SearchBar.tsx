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
        <div id="poda" className="relative">
          <div id="main" className="relative">
            <div className="grid"></div>
            <div className="glow"></div>
            <div className="darkBorderBg"></div>
            <div className="white"></div>
            <div className="border"></div>
            <div id="pink-mask"></div>
            <div id="input-mask"></div>
            
            <div id="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                stroke="#c0b9c0"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="22" y1="22" x2="16.65" y2="16.65" />
              </svg>
            </div>
            
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, false)}
              placeholder="Type your company name..."
              className="input"
              disabled={!!selectedClient}
            />
            
            {query && (
              <button 
                aria-label="Clear" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white z-10" 
                onClick={resetSearch}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Client Results */}
      {!selectedClient && clientResults.length > 0 && (
        <Command className="mb-4 border-0 rounded-xl bg-black/90 backdrop-blur-sm border border-gray-800">
          <CommandList>
            <CommandGroup heading="Companies">
              {clientResults.map((client, idx) => (
                <CommandItem
                  key={client.slug}
                  onSelect={() => handleClientSelect(client)}
                  className={`${idx === activeIndex ? "bg-gray-800/60" : ""} bg-transparent hover:bg-gray-800/40 backdrop-blur-sm text-white`}
                >
                  <span className="font-medium text-gray-100">{client.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}

      {!selectedClient && query.trim().length > 0 && query.trim().length < 5 && (
        <div className="p-4 text-gray-300 rounded-xl bg-black/90 backdrop-blur-sm border border-gray-800">
          Type at least 5 letters to search your company.
        </div>
      )}

      {!selectedClient && query.trim().length >= 5 && clientResults.length === 0 && (
        <div className="p-4 text-gray-300 rounded-xl bg-black/90 backdrop-blur-sm border border-gray-800">
          No matches. Contact support.
        </div>
      )}

      {/* Terminal Search - Only shown after client is selected */}
      {selectedClient && terminals.length > 0 && (
        <>
          <div className="relative">
            <div id="poda" className="relative">
              <div id="main" className="relative">
                <div className="grid"></div>
                <div className="glow"></div>
                <div className="darkBorderBg"></div>
                <div className="white"></div>
                <div className="border"></div>
                <div id="pink-mask"></div>
                <div id="input-mask"></div>
                
                <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                  <MapPin className="text-gray-400" size={20} />
                </div>
                
                <input
                  value={terminalQuery}
                  onChange={(e) => setTerminalQuery(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, true)}
                  placeholder="Select terminal location..."
                  className="input"
                />
                
                {terminalQuery && (
                  <button 
                    aria-label="Clear terminal" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white z-10" 
                    onClick={() => setTerminalQuery("")}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Results */}
          {terminalResults.length > 0 && (
            <Command className="mt-3 border-0 rounded-xl bg-black/90 backdrop-blur-sm border border-gray-800">
              <CommandList>
                <CommandGroup heading={`${selectedClient.name} Terminals`}>
                  {terminalResults.map((terminal, idx) => (
                    <CommandItem
                      key={terminal.name}
                      onSelect={() => handleTerminalSelect(terminal)}
                      className={`${idx === activeIndex ? "bg-gray-800/60" : ""} flex items-center justify-between bg-transparent hover:bg-gray-800/40 backdrop-blur-sm text-white`}
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-100">{terminal.name}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                        <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full border border-green-700">
                          Available
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}

          <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
            <span>Selected: {selectedClient.name}</span>
            <button 
              onClick={resetSearch}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Change company
            </button>
          </div>
        </>
      )}

      {/* No terminals available - proceed directly */}
      {selectedClient && terminals.length === 0 && (
        <div className="p-4 text-gray-300 rounded-xl bg-black/90 backdrop-blur-sm border border-gray-800">
          No terminals configured for {selectedClient.name}. Proceeding with company access...
        </div>
      )}

      <style jsx>{`
        .grid {
          height: 800px;
          width: 800px;
          background-image: linear-gradient(to right, #0f0f10 1px, transparent 1px),
            linear-gradient(to bottom, #0f0f10 1px, transparent 1px);
          background-size: 1rem 1rem;
          background-position: center center;
          position: absolute;
          z-index: -1;
          filter: blur(1px);
        }

        .white,
        .border,
        .darkBorderBg,
        .glow {
          max-height: 70px;
          max-width: 314px;
          height: 100%;
          width: 100%;
          position: absolute;
          overflow: hidden;
          z-index: -1;
          border-radius: 12px;
          filter: blur(3px);
        }

        .input {
          background-color: #010201;
          border: none;
          width: 301px;
          height: 56px;
          border-radius: 10px;
          color: white;
          padding-inline: 59px;
          font-size: 18px;
        }

        #poda {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input::placeholder {
          color: #c0b9c0;
        }

        .input:focus {
          outline: none;
        }

        #main:focus-within > #input-mask {
          display: none;
        }

        #input-mask {
          pointer-events: none;
          width: 100px;
          height: 20px;
          position: absolute;
          background: linear-gradient(90deg, transparent, black);
          top: 18px;
          left: 70px;
        }

        #pink-mask {
          pointer-events: none;
          width: 30px;
          height: 20px;
          position: absolute;
          background: #cf30aa;
          top: 10px;
          left: 5px;
          filter: blur(20px);
          opacity: 0.8;
          transition: all 2s;
        }

        #main:hover > #pink-mask {
          opacity: 0;
        }

        .white {
          max-height: 63px;
          max-width: 307px;
          border-radius: 10px;
          filter: blur(2px);
        }

        .white::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(83deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.4);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0) 0%,
            #a099d8,
            rgba(0, 0, 0, 0) 8%,
            rgba(0, 0, 0, 0) 50%,
            #dfa2da,
            rgba(0, 0, 0, 0) 58%
          );
          transition: all 2s;
        }

        .border {
          max-height: 59px;
          max-width: 303px;
          border-radius: 11px;
          filter: blur(0.5px);
        }

        .border::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(70deg);
          position: absolute;
          width: 600px;
          height: 600px;
          filter: brightness(1.3);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #1c191c,
            #402fb5 5%,
            #1c191c 14%,
            #1c191c 50%,
            #cf30aa 60%,
            #1c191c 64%
          );
          transition: all 2s;
        }

        .darkBorderBg {
          max-height: 65px;
          max-width: 312px;
        }

        .darkBorderBg::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(82deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #18116a,
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            #6e1b60,
            rgba(0, 0, 0, 0) 60%
          );
          transition: all 2s;
        }

        #poda:hover > .darkBorderBg::before {
          transform: translate(-50%, -50%) rotate(-98deg);
        }

        #poda:hover > .glow::before {
          transform: translate(-50%, -50%) rotate(-120deg);
        }

        #poda:hover > .white::before {
          transform: translate(-50%, -50%) rotate(-97deg);
        }

        #poda:hover > .border::before {
          transform: translate(-50%, -50%) rotate(-110deg);
        }

        #poda:focus-within > .darkBorderBg::before {
          transform: translate(-50%, -50%) rotate(442deg);
          transition: all 4s;
        }

        #poda:focus-within > .glow::before {
          transform: translate(-50%, -50%) rotate(420deg);
          transition: all 4s;
        }

        #poda:focus-within > .white::before {
          transform: translate(-50%, -50%) rotate(443deg);
          transition: all 4s;
        }

        #poda:focus-within > .border::before {
          transform: translate(-50%, -50%) rotate(430deg);
          transition: all 4s;
        }

        .glow {
          overflow: hidden;
          filter: blur(30px);
          opacity: 0.4;
          max-height: 130px;
          max-width: 354px;
        }

        .glow:before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(60deg);
          position: absolute;
          width: 999px;
          height: 999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #000,
            #402fb5 5%,
            #000 38%,
            #000 50%,
            #cf30aa 60%,
            #000 87%
          );
          transition: all 2s;
        }

        #main {
          position: relative;
        }

        #search-icon {
          position: absolute;
          left: 20px;
          top: 15px;
          z-index: 10;
        }

        @keyframes rotate {
          100% {
            transform: translate(-50%, -50%) rotate(450deg);
          }
        }
      `}</style>
    </div>
  );
};
