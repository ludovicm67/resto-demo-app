import React from 'react';
import MenuItem from '../MenuItem';
import './style.css';

function Menu() {
  return (
    <div className="menu">
      <ul>
        <li>
          <p className="menu-section-title">Dish</p>
          <ul>
            <MenuItem name="Schnitzel" queue="dish"></MenuItem>
            <MenuItem name="Potato Salad" queue="dish"></MenuItem>
            <MenuItem name="Bratwurst" queue="dish"></MenuItem>
          </ul>
        </li>
        <li>
          <p className="menu-section-title">Drink</p>
          <ul>
            <MenuItem name="Beer" queue="drink"></MenuItem>
            <MenuItem name="Coffee" queue="drink"></MenuItem>
            <MenuItem name="Hot chocolate" queue="drink"></MenuItem>
            <MenuItem name="Soda" queue="drink"></MenuItem>
          </ul>
        </li>
        <li>
          <p className="menu-section-title">Dessert</p>
          <ul>
            <MenuItem name="Ice Cream" queue="dessert"></MenuItem>
            <MenuItem name="Black Forest Cake" queue="dessert"></MenuItem>
            <MenuItem name="Fruit" queue="dessert"></MenuItem>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
