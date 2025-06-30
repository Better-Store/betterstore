import { CheckoutEmbed } from "@/react/components";
import ReactDOM from "react-dom/client";
import "../globals.css";

const App = () => {
  return (
    <CheckoutEmbed
      checkoutId="68361ce316a85abff854b11e"
      config={{
        clientSecret:
          "fb98f2506ffe6981a40d02f93879f004842f23cbe3b3cbd93da0b5971ff63854",
        cancelUrl: "/cancel",
        successUrl: "/success",
        appearance: { theme: "light" },
        clientProxy: "/api/betterstore",
      }}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
