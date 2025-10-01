import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Countries as CountryData } from "../../data/Countries";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag?: string;
}

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const formattedCountries: Country[] = CountryData.map((country) => ({
      name: country.name,
      code: country.code,
      dialCode: country.dial_code || "",
      flag: country.image,
    })).sort((a, b) => a.name.localeCompare(b.name));
    setCountries(formattedCountries);
    setLoading(false);
  }, []);

  const selectedCountry = countries.find((c) => c.dialCode === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2">
              <img
                src={selectedCountry.flag}
                alt={selectedCountry.name}
                className="w-6 h-6"
              />
              <span>{selectedCountry.dialCode}</span>
            </span>
          ) : (
            <span>{loading ? "Loading..." : "Select country code"}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.dialCode}`}
                  onSelect={() => {
                    onChange(country.dialCode);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.dialCode ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-6 h-6"
                    />
                    <span>{country.name}</span>
                    <span className="text-muted-foreground">
                      {country.dialCode}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
