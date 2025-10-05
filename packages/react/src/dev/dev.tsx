import { CheckoutEmbed } from "@/react/components";
import ReactDOM from "react-dom/client";
import "../globals.css";

const App = () => {
  return (
    <CheckoutEmbed
      checkoutId="68e2bc3105815cffe397bf8d"
      config={{
        clientSecret:
          "2c018056894c43dedd8971d0634d61509b199f28cdd024829691503970b442e7",
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
