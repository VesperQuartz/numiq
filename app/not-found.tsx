"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const navigate = useRouter();
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl text-white">Page is not found</p>{" "}
        <Button onClick={() => navigate.back()}>Go Back</Button>
      </div>
    </>
  );
};

export default NotFound;
