import React, {useEffect, useState} from 'react';
import MenuItem from '../MenuItem';
import WorkerStatus from '../WorkerStatus';
import config from '../config';
import './style.css';

function Menu() {
  const [status, setStatus] = useState({
    dish: {
      value: 0,
      hpa: {
        currentReplicas: 0,
        desiredReplicas: 0,
        currentValue: 0,
      },
    },
    drink: {
      value: 0,
      hpa: {
        currentReplicas: 0,
        desiredReplicas: 0,
        currentValue: 0,
      },
    },
    dessert: {
      value: 0,
      hpa: {
        currentReplicas: 0,
        desiredReplicas: 0,
        currentValue: 0,
      },
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${config.backend}/status`)
        .then(res => res.json())
        .then(res => {
          setStatus(res);
        })
        .catch(e => {
          console.error(e);
        });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="menu">
      <ul>
        <li>
          <p className="menu-section-title">Dish</p>
          <WorkerStatus status={status.dish} min="1" max="20" time="20" target="2" />
          <ul>
            <MenuItem name="Schnitzel" queue="dish"></MenuItem>
            <MenuItem name="Potato Salad" queue="dish"></MenuItem>
            <MenuItem name="Bratwurst" queue="dish"></MenuItem>
          </ul>
        </li>
        <li>
          <p className="menu-section-title">Drink</p>
          <WorkerStatus status={status.drink} min="1" max="50" time="5" target="5" />
          <ul>
            <MenuItem name="Beer" queue="drink"></MenuItem>
            <MenuItem name="Coffee" queue="drink"></MenuItem>
            <MenuItem name="Hot chocolate" queue="drink"></MenuItem>
            <MenuItem name="Soda" queue="drink"></MenuItem>
          </ul>
        </li>
        <li>
          <p className="menu-section-title">Dessert</p>
          <WorkerStatus status={status.dessert} min="1" max="30" time="10" target="3" />
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
