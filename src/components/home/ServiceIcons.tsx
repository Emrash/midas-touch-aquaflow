
import { Compass, Droplet, Gauge, Wrench, Filter, Server, Activity } from "lucide-react";

export const CompassIcon = Compass;
export const DropletIcon = Droplet;
export const GaugeIcon = Gauge;
export const WrenchIcon = Wrench;
export const FilterIcon = Filter;
export const ServerIcon = Server;
export const ActivityIcon = Activity;

export const PickaxeIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 17L12 9" />
    <path d="m13 8-2 2" />
    <path d="m9 12-5 5c-.6.6-.6 1.5 0 2 .5.6 1.4.6 2 0l5-5" />
    <path d="m11 6 3-3c.6-.6 1.5-.6 2 0 .5.6.5 1.5 0 2l-3 3" />
    <path d="m11 10 5 5" />
  </svg>
);
