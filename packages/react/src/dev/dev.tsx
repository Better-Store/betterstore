import { CheckoutEmbed } from "@/react/components";
import ReactDOM from "react-dom/client";
import "../globals.css";

const App = () => {
  return (
    <CheckoutEmbed
      checkoutId="691df8f0bfca2ed589d950c7"
      config={{
        clientSecret:
          "5bc453bc1e486804104b6b9ddcd583c1ead732af03eb23af9575c222e873ca37",
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
