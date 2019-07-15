import React from 'react';
import './style.css';

function Menu() {
  return (
    <div class="menu">
      <h2>Menu</h2>
      <ul>
        <li>
          <p>Dish</p>
          <ul>
            <li>A</li>
            <li>B</li>
            <li>C</li>
          </ul>
        </li>
        <li>
          <p>Drinks</p>
          <ul>
            <li>A</li>
            <li>B</li>
            <li>C</li>
          </ul>
        </li>
        <li>
          <p>Dessert</p>
          <ul>
            <li>A</li>
            <li>B</li>
            <li>C</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default Menu;
