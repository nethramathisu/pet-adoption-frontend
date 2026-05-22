import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";

import "./index.css";

import {
  AuthProvider,
} from "./context/AuthContext.tsx";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>

    <AuthProvider>
      <App />
	  <Toaster
			position="top-right"
			toastOptions={{
				duration: 3000,
				style: {
					borderRadius: "12px",
					padding: "16px",
				},
			}}
		/>
    </AuthProvider>

  </React.StrictMode>
);