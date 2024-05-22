"use client";
import { useState } from "react";
import Product from "./components/Product";
import data from "./data/data.json";
import {
  Badge,
  Button,
  Drawer,
  IconButton,
  Option,
  Select,
  Slider,
} from "@mui/joy";
import { Add, Remove, Search, ShoppingCartOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
type Item = {
  id: number | string;
  item_name: string;
  item_price: string;
  item_desc: string;
};
type cartItem = {
  item: Item;
  count: number;
};
type Filters = {
  search?: string;
  price: number[];
};
export default function Home() {
  function addToCart(item: Item) {
    const itemIndex = cart.findIndex(
      (cartItem) => cartItem.item.id === item.id
    );
    if (itemIndex == -1) {
      setCart([...cart, { item: item, count: 1 }]);
      return;
    }
    const newCart = [...cart];
    newCart[itemIndex].count++;
    setCart(newCart);
  }
  function removeFromCart(item: Item) {
    const itemIndex = cart.findIndex(
      (cartItem) => cartItem.item.id === item.id
    );
    const newCart = [...cart];
    if (newCart[itemIndex].count == 1) newCart.splice(itemIndex, 1);
    else newCart[itemIndex].count--;
    setCart(newCart);
  }
  function getMinMaxPrices() {
    return [
      Math.min(...data.map((item) => parseFloat(item.item_price.slice(1)))),
      Math.max(...data.map((item) => parseFloat(item.item_price.slice(1)))),
    ];
  }
  const [sort, setSort] = useState(0);
  const [filters, setFilters] = useState<Filters>({ price: getMinMaxPrices() });
  const [cart, setCart] = useState<cartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const filteredData = data
    .filter(
      (item) =>
        !filters.search ||
        item.item_name.toLocaleLowerCase().includes(filters.search) ||
        item.item_desc.toLocaleLowerCase().includes(filters.search)
    )
    .filter(
      (item) =>
        parseFloat(item.item_price.slice(1)) >= filters.price[0] &&
        parseFloat(item.item_price.slice(1)) <= filters.price[1]
    )
    .sort((a, b) => {
      switch (sort) {
        case 1:
          return (
            parseFloat(a.item_price.slice(1)) -
            parseFloat(b.item_price.slice(1))
          );
      }
      return a.item_name.localeCompare(b.item_name);
    });

  return (
    <div className="max-h-dvh p-4  bg-white text-white flex flex-col ">
      <Drawer open={cartOpen} onClose={(e) => setCartOpen(false)}>
        <div className="flex flex-col max-h-dvh min-h-dvh gap-6  bg-slate-500 p-4 text-white">
          <div className="text-3xl font-semibold">Cart</div>
          <div className="flex flex-col flex-grow gap-4">
            {cart.length > 0 ? (
              cart.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="flex gap-2 w-full items-center"
                >
                  <div className="w-1/2">{cartItem.item.item_name}</div>
                  <div className="w-1/6">{`£${(
                    parseFloat(cartItem.item.item_price.slice(1)) *
                    cartItem.count
                  ).toFixed(2)}`}</div>
                  <div className="flex-grow" />
                  <div className="flex gap-2 w-1/3 items-center">
                    <IconButton
                      className="bg-slate-700 rounded-full max-w-3 max-h-3 text-white"
                      onClick={() => removeFromCart(cartItem.item)}
                    >
                      <Remove />
                    </IconButton>
                    <div className="min-w-[2ch] text-center">
                      {cartItem.count}
                    </div>

                    <IconButton
                      className="bg-slate-700 rounded-full max-w-3 max-h-3 text-white"
                      onClick={() => addToCart(cartItem.item)}
                    >
                      <Add />
                    </IconButton>
                  </div>
                </div>
              ))
            ) : (
              <div>Your cart is empty</div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="flex flex-col gap-4 w-full">
              <div>{`Total: £${cart
                .reduce(
                  (val, cur) =>
                    val + parseFloat(cur.item.item_price.slice(1)) * cur.count,
                  0
                )
                .toFixed(2)}`}</div>
              <Button color="neutral">Check out</Button>
            </div>
          )}
        </div>
      </Drawer>
      <nav className="flex flex-col justify-center gap-8">
        <div className="flex gap-8">
          <TextField
            className="flex-grow"
            label="Search..."
            onChange={(e) => {
              setFilters({
                ...filters,
                search: e.target.value.toLowerCase() || undefined,
              });
            }}
          />
          <Badge
            color="neutral"
            size="sm"
            max={10}
            badgeContent={cart.reduce((prvVal, item) => prvVal + item.count, 0)}
          >
            <IconButton
              onClick={() => setCartOpen(true)}
              className="bg-amber-600 rounded-full text-white min-w-12 max-h-12"
            >
              <ShoppingCartOutlined />
            </IconButton>
          </Badge>
        </div>
        <div className="flex gap-8 flex-wrap-reverse pb-4">
          <Select
            placeholder="Sort by..."
            value={sort}
            onChange={(_, v) => setSort(v as number)}
          >
            <Option value={0}>Sort by Name</Option>
            <Option value={1}>Sort by Price</Option>
          </Select>
          <Select sx={{ minWidth: "70%" }} placeholder="Filter by price...">
            <div className="p-8">
              <Slider
                valueLabelDisplay="on"
                step={0.1}
                min={getMinMaxPrices()[0]}
                max={getMinMaxPrices()[1]}
                value={filters.price}
                onChange={(_, v) => {
                  setFilters({ ...filters, price: v as number[] });
                }}
              />
              <Button
                color="neutral"
                onClick={(e) =>
                  setFilters({ ...filters, price: getMinMaxPrices() })
                }
              >
                Clear
              </Button>
            </div>
          </Select>
        </div>
      </nav>
      <div className="flex md:flex-row md:flex-wrap flex-col lg:items-start items-center justify-start py-8 lg:p-24 gap-8 flex-shrink basis-[80dvh] overflow-y-scroll">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Product
              key={item.id}
              item={item}
              clickHandler={() => {
                addToCart(item);
              }}
            />
          ))
        ) : (
          <div className="text-black"> No results...</div>
        )}
      </div>
    </div>
  );
}
