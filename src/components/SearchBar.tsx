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
      <div className="relative mb-4">
        <div className="grid"></div>
        <div id="poda" className="animated-container">
          <div className="glow"></div>
          <div className="darkBorderBg"></div>
          <div className="darkBorderBg"></div>
          <div className="darkBorderBg"></div>
          <div className="white"></div>
          <div className="border"></div>
          <div id="main">
            <input
              placeholder="Enter company name"
              type="text"
              name="text"
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, false)}
              aria-label="Search company"
              autoComplete="off"
              disabled={!!selectedClient}
            />
            <div id="input-mask"></div>
            <div id="pink-mask"></div>
            <div className="filterBorder"></div>
            <div id="filter-icon">
              <svg
                preserveAspectRatio="none"
                height="27"
                width="27"
                viewBox="4.8 4.56 14.832 15.408"
                fill="none"
              >
                <path
                  d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
                  stroke="#d6d6e6"
                  strokeWidth="1"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <div id="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                height="24"
                fill="none"
                className="feather feather-search"
              >
                <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
                <line
                  stroke="url(#searchl)"
                  y2="16.65"
                  y1="22"
                  x2="16.65"
                  x1="22"
                ></line>
                <defs>
                  <linearGradient gradientTransform="rotate(50)" id="search">
                    <stop stopColor="#f8e7f8" offset="0%"></stop>
                    <stop stopColor="#b6a9b7" offset="50%"></stop>
                  </linearGradient>
                  <linearGradient id="searchl">
                    <stop stopColor="#b6a9b7" offset="0%"></stop>
                    <stop stopColor="#837484" offset="50%"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
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
            /* From Uiverse.io by Lakshay-art */
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
              /* Border Radius */
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
              /*  animation: rotate 4s linear infinite; */
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
              /* animation: rotate 4s 0.1s linear infinite; */
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
              transform: translate(-50%, -50%) rotate(262deg);
            }
            #poda:hover > .glow::before {
              transform: translate(-50%, -50%) rotate(240deg);
            }
            #poda:hover > .white::before {
              transform: translate(-50%, -50%) rotate(263deg);
            }
            #poda:hover > .border::before {
              transform: translate(-50%, -50%) rotate(250deg);
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
              /*border color, change middle color*/
              background-image: conic-gradient(
                #000,
                #402fb5 5%,
                #000 38%,
                #000 50%,
                #cf30aa 60%,
                #000 87%
              );
              /* change speed here */
              /*animation: rotate 4s 0.3s linear infinite;*/
              transition: all 2s;
            }
            @keyframes rotate {
              100% {
                transform: translate(-50%, -50%) rotate(450deg);
              }
            }
            @keyframes leftright {
              0% {
                transform: translate(0px, 0px);
                opacity: 1;
              }
              49% {
                transform: translate(250px, 0px);
                opacity: 0;
              }
              80% {
                transform: translate(-40px, 0px);
                opacity: 0;
              }
              100% {
                transform: translate(0px, 0px);
                opacity: 1;
              }
            }
            #filter-icon {
              position: absolute;
              top: 8px;
              right: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 2;
              max-height: 40px;
              max-width: 38px;
              height: 100%;
              width: 100%;
              isolation: isolate;
              overflow: hidden;
              /* Border Radius */
              border-radius: 10px;
              background: linear-gradient(180deg, #161329, black, #1d1b4b);
              border: 1px solid transparent;
            }
            .filterBorder {
              height: 42px;
              width: 40px;
              position: absolute;
              overflow: hidden;
              top: 7px;
              right: 7px;
              border-radius: 10px;
            }
            .filterBorder::before {
              content: "";
              text-align: center;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(90deg);
              position: absolute;
              width: 600px;
              height: 600px;
              background-repeat: no-repeat;
              background-position: 0 0;
              filter: brightness(1.35);
              background-image: conic-gradient(
                rgba(0, 0, 0, 0),
                #3d3a4f,
                rgba(0, 0, 0, 0) 50%,
                rgba(0, 0, 0, 0) 50%,
                #3d3a4f,
                rgba(0, 0, 0, 0) 100%
              );
              animation: rotate 4s linear infinite;
            }
            #main {
              position: relative;
            }
            #search-icon {
              position: absolute;
              left: 20px;
              top: 15px;
            }
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
