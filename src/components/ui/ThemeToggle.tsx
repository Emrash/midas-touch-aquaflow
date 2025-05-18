
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for system preference or saved preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);

    // Apply the theme
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Update DOM
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    // Save preference
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 bg-background border-mdpc-brown-light/30 dark:border-mdpc-gold/20"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <MoonIcon className="h-4 w-4 text-mdpc-brown-dark transition-all" />
      ) : (
        <SunIcon className="h-4 w-4 text-mdpc-gold transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
