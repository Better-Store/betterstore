import { CheckoutEmbed } from "@/react/components";
import ReactDOM from "react-dom/client";
import "../globals.css";

const App = () => {
  return (
    <CheckoutEmbed
      checkoutId="691ccdc91a701569a62d5164"
      config={{
        clientSecret:
          "f48b7dd1ae4cb6396eddb0a3f5c11e6550ed27f8ae2ead598c8e009561b51626",
        cancelUrl: "/cancel",
        successUrl: "/success",
        locale: "en",
        clientProxy: "/api/betterstore",
      }}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
