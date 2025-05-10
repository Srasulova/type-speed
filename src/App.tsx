import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class="flex items-center justify-center h-screen">
      <h1 class="bg-red-500 text-white p-6 text-2xl font-bold">
        Tailwind is working!
      </h1>
    </div>
  );
};

export default App;
