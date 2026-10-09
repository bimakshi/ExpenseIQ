import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="eq-page">
      <DashboardHeader />
      {children}
    </div>
  );
}
