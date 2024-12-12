import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedItem } from "../store/features/selectionSlice";
import { Link, useLocation } from "react-router-dom";

const MenuSidebar = ({ items }) => {
  const dispatch = useDispatch();
  const selectedIndex = useSelector((state) => state.selection.selectedItem);
  const location = useLocation();

  useEffect(() => {
    // Encuentra el índice basado en la URL actual
    const currentIndex = items.findIndex((item) => item.to === location.pathname);
    if (currentIndex !== -1) {
      dispatch(setSelectedItem(currentIndex));
    }
  }, [location, items, dispatch]);

  return (
    <div className="h-full bg-azul text-white flex flex-col items-center p-4">
      <ul className="flex flex-col gap-6">
        {items.map(({ icon: Icon, to }, index) => (
          <li
            key={index}
            aria-label={"Icon"}
            onClick={() => dispatch(setSelectedItem(index))}
            className={`cursor-pointer ${
              selectedIndex === index ? "text-rojoCoral" : "text-white"
            }`}
          >
            <Link to={to} className="flex items-center">
              <Icon size={23} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSidebar;
