// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(0);

  const notificationInc = () => {
    console.log(notification)
    setNotification(notification + 1);
  };

  const notificationDec = () => {
    setNotification(0);
  };

  return (
    <NotificationContext.Provider value={{ notification, notificationInc, notificationDec }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
