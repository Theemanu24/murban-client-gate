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
  // Add custom CSS for smooth animations
  const customStyles = `
    @keyframes spin-slow {
      from {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
    .animate-spin-slow {
      animation: spin-slow linear infinite;
    }
    
    /* Ensure input field always works properly */
    .search-input {
      position: relative !important;
      z-index: 999 !important;
      pointer-events: auto !important;
      cursor: text !important;
    }
    
    .search-input:focus {
      cursor: text !important;
    }
  `;

  // Insert styles into document head only once
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('animated-search-styles');
      if (!existingStyle) {
        const styleElement = document.createElement('style');
        styleElement.id = 'animated-search-styles';
        styleElement.textContent = customStyles;
        document.head.appendChild(styleElement);
      }
    }
  }, []);
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
      {/* Animated Border Container - Much slower animations */}
      <div className="absolute -inset-1 rounded-xl pointer-events-none">
        {/* Glow Effect - Very slow */}
        <div className="absolute inset-0 rounded-xl overflow-hidden opacity-30 blur-[25px]">
          <div className="absolute inset-0 w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow"
               style={{
                 backgroundImage: 'conic-gradient(#000, #402fb5 8%, #000 20%, #000 30%, #cf30aa 38%, #000 50%, #000 62%, #402fb5 70%, #000 80%, #000 92%, #cf30aa 100%)',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: '0 0',
                 animationDuration: '20s'
               }} />
        </div>

        {/* Dark Border Background - Slower */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow"
               style={{
                 backgroundImage: 'conic-gradient(rgba(0, 0, 0, 0), #18116a 10%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 35%, #6e1b60 45%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0) 75%, #18116a 85%, rgba(0, 0, 0, 0) 100%)',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: '0 0',
                 animationDuration: '25s'
               }} />
        </div>

        {/* White Layer - Medium speed */}
        <div className="absolute inset-0 rounded-xl overflow-hidden blur-[1px]">
          <div className="absolute inset-0 w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow brightness-[1.2]"
               style={{
                 backgroundImage: 'conic-gradient(rgba(0, 0, 0, 0) 0%, #a099d8 12%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 40%, #dfa2da 52%, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 0) 80%, #a099d8 92%, rgba(0, 0, 0, 0) 100%)',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: '0 0',
                 animationDuration: '18s'
               }} />
        </div>

        {/* Border Layer - Slowest */}
        <div className="absolute inset-0 rounded-xl overflow-hidden blur-[0.3px]">
          <div className="absolute inset-0 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow brightness-[1.1]"
               style={{
                 backgroundImage: 'conic-gradient(#1c191c, #402fb5 15%, #1c191c 30%, #1c191c 40%, #cf30aa 55%, #1c191c 70%, #1c191c 85%, #402fb5 100%)',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: '0 0',
                 animationDuration: '15s'
               }} />
        </div>
      </div>

      {/* Completely isolated input container */}
      <div className="relative" style={{ zIndex: 1000 }}>
        <div className="relative bg-black rounded-xl border border-gray-800" style={{ backgroundColor: '#010201' }}>
          <input
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            spellCheck={false}
            className="search-input w-full h-14 px-12 bg-transparent border-none rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-0"
            style={{
              position: 'relative',
              zIndex: 1001,
              pointerEvents: 'auto',
              cursor: 'text'
            }}
          />
          
          {/* Icon - completely separated */}
          {IconComponent && (
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ zIndex: 1002 }}
            >
              <IconComponent className="w-6 h-6 text-gray-400" />
            </div>
          )}

          {/* Clear Button - completely separated */}
          {value && onClear && (
            <div 
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ zIndex: 1002 }}
            >
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
        
        {/* Subtle effects outside the input area */}
        {!value && (
          <div 
            className="absolute top-1/2 left-16 w-20 h-4 -translate-y-1/2 pointer-events-none transition-opacity duration-300 opacity-60"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(1, 2, 1, 0.8))',
              zIndex: 999
            }} 
          />
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
      {...props}
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
  );

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
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
