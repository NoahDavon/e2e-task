"use client";
import { AddShoppingCartOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import React from "react";

type Props = {
  item: {
    item_name: string;
    item_desc: string;
    item_price: string;
  };
  clickHandler: (e: any) => void;
};

export default function Product({ item, clickHandler }: Props) {
  return (
    <div className="flex gap-2 p-4 rounded-md shadow-md lg:w-[480px] w-full h-20 items-center bg-amber-600">
      <div className=" flex flex-col gap-2 text-ellipsis w-40 font-semibold ">
        <div>{item.item_name}</div>
        <div>{item.item_price}</div>
      </div>
      <div className="text-ellipsis text-nowrap text-neutral-300 w-40">
        {item.item_desc}
      </div>
      <div className="flex-grow" />
      <IconButton
        className="rounded-full bg-amber-500 text-white"
        onClick={(e) => {
          clickHandler(e);
        }}
      >
        <AddShoppingCartOutlined />
      </IconButton>
    </div>
  );
}
