import type { ReactNode } from "react";


const StatCard = ({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-sm">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}


export default StatCard