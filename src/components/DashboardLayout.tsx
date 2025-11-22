import React from "react";

interface IProps {
  children: React.ReactNode;
  title?: string;
}
export function DashboardLayout({ children, title }: IProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">{children}</div>
    </div>
  );
}
