import { NavLink } from "react-router-dom";

export default function TopTabs() {
  const tabs = [
    ["Dashboard", "/dashboard"],
    ["Attendance", "/attendance"],
    ["AI Assistant", "/ai-assistant"],
    ["Requests", "/requests"],
    ["Profile", "/profile"],
  ];

  return (
    <div className="flex gap-6 px-6 py-3 bg-white shadow">
      {tabs.map(([name, path]) => (
        <NavLink key={path} to={path}>{name}</NavLink>
      ))}
    </div>
  );
}
