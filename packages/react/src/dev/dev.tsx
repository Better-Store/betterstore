import { CheckoutEmbed } from "@/react/components";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <CheckoutEmbed
      checkoutId="686a5d013f99bd3c0357740e"
      config={{
        clientSecret:
          "aa8294786a9f41097d7e38142e231358280456371415386c4fe5b66fc6f6cbc5",
        cancelUrl: "/cancel",
        successUrl: "/success",
        locale: "cs",
        clientProxy: "/api/betterstore",
      }}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
