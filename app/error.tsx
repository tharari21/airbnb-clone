"use client";
import { useEffect, useState } from "react";
import EmptyState from "./components/EmptyState";
interface ErrorStateProps {
  error: Error;
}
// error.tsx is a reserved file name for page loader

const Error: React.FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.log(error);
  }, [error]);
  return <EmptyState title="Uh Oh" subtitle="Something went wrong" />;
};

export default Error;
