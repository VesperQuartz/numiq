"use client";
import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export const ProgressProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#4f46e5bf"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
};
