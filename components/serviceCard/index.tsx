import React from "react";
import { MdDelete } from "react-icons/md";

interface ServiceType {
  serviceName: string;
  serviceRate: string;
  handleDelete: (name: string) => void;
}

export default function ServiceCard({
  serviceName,
  serviceRate,
  handleDelete,
}: ServiceType) {
  return (
    <div className="flex flex-row bg-gray-300 items-center justify-between">
      <div className="p-5 w-[70%]">
        <label className="text-sm">{serviceName}</label>
        <div className="text-sm">{serviceRate}</div>
      </div>
      <div
        onClick={() => handleDelete(serviceName)}
        className="bg-red-500 w-[30%] h-full flex justify-center items-center"
      >
        <MdDelete size={40} color="#fff" />
      </div>
    </div>
  );
}
