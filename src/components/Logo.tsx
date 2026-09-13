import { MapPin, Users } from "lucide-react";


const ORANGE = "#F47B2A";
const NAVY = "#1F3A66";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center">
        <MapPin className="h-10 w-10" style={{ color: ORANGE }} strokeWidth={2.5} fill={ORANGE} />
        <Users className="absolute h-4 w-4 text-white" style={{ top: 8 }} />
      </div>
      <span className="text-2xl font-bold" style={{ color: ORANGE }}>
        Go<span style={{ color: NAVY }}>Guia</span>
      </span>
    </div>
  );
}


export default Logo