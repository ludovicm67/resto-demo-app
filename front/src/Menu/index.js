import React from 'react';
import MenuItem from '../MenuItem';
import './style.css';

function Menu() {
  function test_query(e) {
    const data = JSON.stringify({
      name: 'test',
      count: 2,
    });

    fetch("https://resto-back.192.168.85.40.xip.io/worker/dish", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data,
    });
  }

  return (
    <div class="menu">
      <h2>Menu</h2>
      <ul>
        <li>
          <p>Dish</p>
          <ul>
            <li>
              <button onClick={test_query}>
                test
              </button>
            </li>
            <li><MenuItem name="Schnitzel" queue="dish"></MenuItem></li>
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
