import { createRoot } from "react-dom/client";
import App from "./src/App";
import ClarityProvider from "./src/hooks/useClarity";

const root = createRoot(document.querySelector('#app'))

root.render(
  <ClarityProvider>
    <App />
  </ClarityProvider>
)
